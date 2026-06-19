# Community MCP Security Review

Guidelines for reviewing open source and community MCPs before installation.

> **User consent required**: This security review is optional. Always ask the user: "Would you like me to perform a security review of this MCP before adding it?" Only proceed with the review if they agree.


## When This Applies

This review process applies when users want to add MCPs that are **NOT** in Rebel's connector catalog:

- Community npm packages (e.g., `npx @some-org/some-mcp`)
- Python MCPs via `uvx` (e.g., `uvx some-mcp-package`)
- MCPs discovered via web search with a source repository

**Does NOT apply to:**
- Built-in connectors in Rebel's catalog (already vetted)
- Official vendor-hosted MCPs (Notion, Linear, Asana, etc.)

**Limited review for URL-only MCPs:**
For HTTP/SSE MCPs where user provides only a URL (no source repo), the full code review isn't possible. Instead:
- Verify the domain is the official vendor domain (e.g., `mcp.notion.com` for Notion)
- Check if the service has official MCP documentation
- Warn user if the domain doesn't match a known vendor
- Note: version pinning is not applicable for URL-based MCPs (they're managed by the vendor)


## Security Review Process

### Step 1: Offer the Security Review

When a user wants to add a community/custom MCP, ask:

> "This MCP isn't in Rebel's built-in catalog. Before adding it, I can perform a security review to check for potential risks. This involves:
> - Examining the source repository
> - Checking for security red flags in the code
> - Verifying the package version and license
>
> Would you like me to do this? (It may take a minute.)"

**If user declines**: Skip to version pinning (Step 4). Note: Skipping the security review does NOT skip the separate permission to add the MCP — the main skill still requires explicit user confirmation before modifying config.

**If user agrees**: Continue with the review.


### Step 2: Parallel Security Review (if authorized)

Launch 2 research/review subagents in parallel for diverse perspectives:

```
Task(researcher, "Research the MCP package [package-name]:
1. Find the source repository (GitHub/GitLab)
2. Check repo stats: stars, recent activity, open issues
3. Verify the license is permissive (MIT, Apache 2.0, BSD, ISC)
4. Look for any reported security issues
5. Check if this is an official/vendor package or community-maintained
Report findings with links.")

Task(reviewer, "Review the MCP repository at [repo-url] for security concerns.
Check the ENTIRE codebase for these red flags:

RED FLAGS (high risk):
- eval(), exec(), Function() — arbitrary code execution
- child_process, spawn, execSync — shell command execution
- Dynamic require() with variable paths
- fetch/http to unexpected external servers
- fs.writeFile outside expected directories
- Base64 encoded strings (could be obfuscated code)
- Minified/obfuscated code sections
- __proto__ or prototype manipulation
- process.env access for unexpected variables

YELLOW FLAGS (note but don't reject):
- fs.readFile, fs.readdir — file system reading
- process.cwd(), __dirname — path detection
- setTimeout, setInterval — delayed execution
- Complex regex patterns (potential ReDoS)

Report: What does this MCP claim to do vs what does the code actually do?
Any discrepancy between stated purpose and actual behavior?")
```


### Step 3: Present Findings

After reviews complete, summarize for the user:

```
## Security Review Summary

**Package:** @example/some-mcp
**Source:** https://github.com/example/some-mcp
**License:** MIT ✓
**Stars:** 245 | Last updated: 2 weeks ago

### Red Flags: NONE | X found
[List any with file/line references]

### Yellow Flags: X found
[List any with brief explanation]

### What This MCP Does
[2-3 sentence summary of actual behavior]

### Recommendation
[SAFE | CAUTION | NOT RECOMMENDED]
[Brief explanation]

---
⚠️ **Reminder**: This review catches obvious issues but cannot detect sophisticated attacks (obfuscation, delayed payloads). Only install MCPs from sources you trust.
```

**If NOT RECOMMENDED**: Explain why and suggest alternatives. Don't proceed unless user explicitly acknowledges the risks.


### Step 4: Version Pinning (Always Required)

**All npx/uvx MCPs MUST use pinned versions**, not `@latest` or implicit latest.

#### Why Pin Versions?

| Risk | Impact |
|------|--------|
| **Breaking changes** | MCP stops working after silent update |
| **Supply chain attacks** | Malicious code injected via compromised package |
| **Non-reproducible** | Different users get different behavior |

#### How to Pin

**npm packages (npx):**
```json
// BAD - implicit latest (vulnerable to supply chain attacks)
"args": ["-y", "@example/some-mcp"]

// BAD - explicit @latest or semver ranges (same problem)
"args": ["-y", "@example/some-mcp@latest"]
"args": ["-y", "@example/some-mcp@^1.2.0"]

// GOOD - pinned to exact version
"args": ["-y", "@example/some-mcp@1.2.3"]
```

**Python packages (uvx):**
```json
// BAD - implicit latest
"args": ["some-mcp-package"]

// GOOD - pinned to exact version
"args": ["some-mcp-package==1.2.3"]
```

#### Finding the Current Version

```bash
# For npm packages
npm view @example/some-mcp version

# For Python packages
pip index versions some-mcp-package
# Or check PyPI: https://pypi.org/project/some-mcp-package/

# Or check the package's GitHub releases page
```

#### If User Provides Unpinned Config

When user pastes a config without a version pin:

> "I notice this MCP config doesn't specify a version. Using unpinned packages means the code could change without warning, which is a security risk.
>
> The current version is `1.2.3`. Would you like me to pin it to this version? (Recommended)"

**If user agrees**: Add the version pin before adding the MCP.

**If user declines**: Warn them of the risk and proceed only with explicit acknowledgement:
> "I understand you want to use the unpinned version. Please note this means the package could auto-update to a compromised version in the future. Proceed anyway?"


## Escalation Criteria

Escalate to 3 reviewers (add a third perspective) when the MCP:

- Requests broad file system access
- Spawns child processes or runs shell commands
- Handles credentials or tokens
- Is newly published (< 6 months old) with low adoption
- Has no clear organizational backing


## MCP-Specific Red Flags Checklist

Beyond standard code review, check for these MCP-specific concerns:

### Command Injection
- [ ] User-provided args passed to shell/spawn without sanitization
- [ ] String concatenation building shell commands

### Data Exfiltration
- [ ] Telemetry/analytics endpoints sending tool inputs
- [ ] "Error reporting" that uploads payloads
- [ ] Silent network calls not related to stated functionality

### Self-Update Mechanisms
- [ ] Auto-update behavior that could pull malicious code
- [ ] Dynamic imports from remote URLs
- [ ] Remote code fetch at runtime

### Permission Creep
- [ ] Declared tool capabilities vs actual code behavior mismatch
- [ ] Tools that request more access than they need
- [ ] Hidden tools not documented in README

### Supply Chain Risks
- [ ] Suspicious `postinstall` or `prepare` scripts in package.json
- [ ] Recent ownership/publisher changes on npm/PyPI
- [ ] Package name similar to popular packages (typosquatting)
- [ ] Native/binary dependencies that can't be inspected

### Python-Specific Red Flags
- [ ] `subprocess`, `os.system`, `os.popen` — shell execution
- [ ] `importlib` with dynamic paths — runtime code loading
- [ ] `pickle.load` from untrusted sources — code execution via deserialization


## Limitations

**This review catches obvious issues but cannot detect:**
- Sophisticated obfuscation
- Delayed payloads (malicious behavior triggered later)
- Prompt injection attacks embedded in tool responses
- Compromised dependencies (transitive supply chain attacks)

**When parts can't be inspected** (native binaries, compiled code, minified JS without source maps):
- Explicitly warn the user: "This package contains code I cannot review: [list]. Do you trust the source?"
- Require explicit acknowledgement before proceeding


## See Also

- [script-security-review](../../../coding/script-security-review/SKILL.md) — General script security checklist (credential scan, npm audit)
- [install-skill-from-marketplace](../install-skill-from-marketplace/SKILL.md) — Similar security review pattern for skills
- [third-party-choosing-products-utilities-libraries](../../../coding/third-party-choosing-products-utilities-libraries/SKILL.md) — Evaluation criteria for third-party packages
