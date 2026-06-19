---
name: install-skill-from-marketplace
description: "Install skills from GitHub repositories with security review and provenance tracking. Three-phase workflow: discovery → security review → install."
last_updated: 2026-01-13
tools_required: [Execute, Read, Task]
agent_type: main_agent
---

# Install Skill from Marketplace

> ⚠️ **SECURITY WARNING**
> The LLM-based security review is **defense-in-depth only** — it catches obvious issues but **cannot protect against sophisticated attackers**. Obfuscation, delayed payloads, and prompt injection can bypass review. Users should only install skills from sources they trust. This is the same trust model as VS Code extensions or npm packages.

[GOAL]
Help users discover and safely install skills from GitHub repositories with full provenance tracking.

[CONTEXT]
This skill orchestrates a three-phase workflow to install skills from external sources:
1. **Discovery** — Research skills matching user needs using a researcher subagent
2. **Security Review** — Download and review skill content using a reviewer subagent
3. **Install** — Copy to user-chosen location with provenance log

**Security Model**: The LLM-based security review is **defense-in-depth only** — it catches obvious issues but cannot protect against sophisticated attackers. Users should only install skills from sources they trust. This is the same trust model as VS Code extensions or npm packages.

[PROCESS]

1. **CLARIFY INTENT** — Before researching, ask clarifying questions if the request is ambiguous
   - What problem are you trying to solve?
   - Any specific tool preferences (e.g., Node vs Python)?
   - Any platform constraints (Windows, macOS, Linux)?

2. **DISCOVERY** — Delegate to researcher subagent
   - Task: "Search for skills matching: [user's query]"
   - Researcher applies third-party selection criteria (see `references/known_sources.md`):
     - Reputable/authoritative sources (prefer official Anthropic skills, well-known repos)
     - Active community (stars, recent activity, discussion)
     - Well-documented (clear SKILL.md, good descriptions)
   - Return top candidates with: **repo URL**, **skill path** (folder within repo), description, stars, last updated, language/runtime, branch (default `main`)
   - Document reasoning and alternatives considered (for provenance log)

3. **USER SELECTION** — Present options, user picks skill and install location
   - Show candidates with relevant metadata
   - **Platform considerations**: If skills have runtime dependencies (Python, Node, shell scripts):
     - Ask the user about their setup, or run a quick version check (e.g., `python3 --version`) if permitted
     - On Windows when Python isn't available or user prefers not to install it, prefer Node-based alternatives when they exist
     - Explain tradeoffs simply for non-technical users: "This skill needs Python installed. An alternative uses Node.js which you already have."
     - If Python setup is needed, reference `@python-setup-and-check` skill
   - Ask: "Which skill would you like to install, and where should I install it?"
   - User must provide target path (no default location)
   - **User must explicitly confirm** before proceeding to download

4. **DOWNLOAD** — Run `download_skill.js` to fetch to temp directory
   ```bash
   node scripts/download_skill.js \
     --repo "owner/repo" \
     --path "skills/skill-name" \
     --branch "main" \
     --adm-zip-path "/path/to/node_modules/adm-zip"
   ```
   - Script creates initial `.skill-provenance.json` with download metadata
   - Script returns: temp path, files list, archive hash

5. **SECURITY REVIEW** — Delegate to reviewer subagent with checklist
   - Task: "Review the downloaded skill at [temp_path] for security concerns"
   - Reviewer must (see `references/security_review_checklist.md`):
     - Read ALL text files in the skill folder (*.md, *.js, *.py, *.sh, *.json)
     - List binary files that cannot be reviewed
     - Flag red flags: exec/spawn, network requests, file writes, eval, obfuscated code
     - Flag yellow flags: file reads, env access, complex regex
     - Summarize what the skill does and any concerns
   - Present findings to user:
     - Show file list, red flags, yellow flags, summary
     - If binary files present: "This skill contains N binary files that cannot be reviewed: [list]"
     - Ask: "Do you approve installation of this skill? (yes/no)"
   - **User must explicitly approve before proceeding**

6. **INSTALL** — If user approves, run `install_skill.js`
   ```bash
   echo '{"security_review": {...}}' | node scripts/install_skill.js \
     --source "/tmp/skill-xyz/skill-name" \
     --target "/path/to/skills/skill-name"
   ```
   - Script validates skill structure (SKILL.md exists, valid frontmatter)
   - Script finalizes `.skill-provenance.json` with security review findings
   - Script copies to target (atomic: staging then rename)
   - Script cleans up temp source

7. **NOTIFY** — Confirm installation and next steps
   - "Installed [skill-name] to [target_path]"
   - "Provenance log saved to [target_path]/.skill-provenance.json"
   - "You may need to reload Rebel for the skill to appear in discovery"

[IMPORTANT]

- **Security is defense-in-depth only** — LLM review catches obvious issues but cannot detect sophisticated attacks (obfuscation, delayed payloads, prompt injection). Users bear responsibility for trusting the source.
- **User must approve installation** — Never install without explicit "yes" after seeing security findings
- **User must acknowledge binary files** — If skill contains binaries, user must explicitly acknowledge they cannot be reviewed
- **Ask where to install** — Don't assume a default location; user decides the target path
- **Provenance is mandatory** — Every installed skill includes `.skill-provenance.json` documenting source, review findings, and approval
- **No overwrites** — If target already exists, abort and inform user
- **GitHub only (V1)** — This version only supports public GitHub repos; private repos and other sources may come later
- **Runtime compatibility** — When multiple skill options exist, prefer Node-based skills for Windows users or users without Python. Explain dependencies in plain language.

## Scripts

- `scripts/download_skill.js` — Downloads repo zip, extracts skill folder, creates initial provenance
- `scripts/install_skill.js` — Validates skill, finalizes provenance, copies to target

## References

- `references/known_sources.md` — Trusted skill sources and selection criteria
- `references/security_review_checklist.md` — Detailed checklist for reviewer subagent
- `references/provenance_schema.md` — Schema for `.skill-provenance.json`

## Related Skills

- [@third-party-choosing-products-utilities-libraries](../../coding/third-party-choosing-products-utilities-libraries/SKILL.md) — General guidance for evaluating third-party code
- [@tasks-subagents](../tasks-subagents/SKILL.md) — Guidelines for effective subagent delegation
- [@python-setup-and-check](../../coding/python-setup-and-check/SKILL.md) — Help users set up Python/venv if a skill requires it
