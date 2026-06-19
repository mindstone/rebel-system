# Contributing Your MCP Connector

> Reviewer-facing reference. Do not paste this content into chat with non-technical users. See SKILL.md § Voice Firewall for chat-safe phrasing.

How to contribute your custom MCP server back to the Rebel connector ecosystem so other users can install it with one click.

This guide covers the full contribution lifecycle — from local build to published npm package in the Rebel catalog. It assumes you've already built and tested an MCP server using the [build-custom-mcp-server](../SKILL.md) skill.

---

## Overview

Contributing a connector makes it available to all Rebel users via the connector catalog. The process has four phases:

```
Phase A: Build & Run Locally      → You already have a working MCP
Phase B: Create PR to mcp-servers → Fork, branch, PR with structured description
Phase C: Maintainer Review        → Review, merge, tag, npm publish
Phase D: Transition to npm        → Optional switch from local build to published package
```

You keep running your local build throughout. The contribution is about making the connector available to *other* users — nothing changes for you until Phase D (and that's optional).

---

## Phase A: Build & Run Locally

*This is where you are now if you've completed the [build-custom-mcp-server](../SKILL.md) skill.*

Your setup:
1. MCP server source in a local folder (e.g., `~/mcp-servers/my-service-mcp/`)
2. Compiled output at `dist/index.js`
3. Configured in Rebel via Settings → Connectors (command: `node`, args: path to `dist/index.js`)
4. Tools visible and working in Rebel conversations

Before contributing, verify your connector meets the [quality bar](#quality-bar-for-contribution) below.

---

## Phase B: Submit to mcp-servers

### Primary Path — In-App Contribution Flow

The recommended way to contribute your connector is through the in-app "Add to the community" flow. This handles all GitHub operations automatically — no manual Git commands needed.

**How it works:**

1. **Authenticate** — The in-app flow uses a separate GitHub OAuth flow with `public_repo` scope (independent from any existing Rebel GitHub connection). Click "Add to the community" in the MCPBuildCard and complete the GitHub authorization when prompted.

2. **Automatic submission** — The contribution service handles everything:
   - Forks the [`mcp-servers`](https://github.com/mindstone-engineering/mcp-servers) repository to your GitHub account (or reuses an existing fork)
   - Creates a `contribution/<connector-name>` branch
   - Pushes your connector files under `connectors/<service-name>/` via the Git Data API (single atomic commit)
   - Opens a pull request with a structured description

3. **Track progress** — Once the agent reports `ready_to_submit`, the MCPBuildCard appears in the conversation showing real-time status: submit-prompt → submitted → CI running → approved/changes requested. Earlier states (`draft`, `testing`) are tracked internally but don't surface a card unless something goes wrong — if tests fail, a `testing-error` card appears so the user can trigger a re-run.

4. **CI runs automatically** — Once the PR is created, the `mcp-servers` CI pipeline builds and tests your connector on Node.js 20 and 22.

> The in-app flow uses the contribution IPC channels (`contribution:start-auth`, `contribution:submit`, `contribution:refresh-status`) to orchestrate the entire process. Status updates appear in the MCPBuildCard and notification surfaces.

### Connector File Structure

Whether using the in-app flow or manual Git, your connector should be structured as:

```
connectors/
└── <service-name>/
    ├── package.json        # With bin field and files: ["dist"]
    ├── tsconfig.json
    ├── src/
    │   ├── server.ts       # Server entry point with version constant
    │   └── tools/          # Tool implementations
    ├── test/                # Test files (*.test.mjs, *.test.ts)
    ├── docs/
    │   └── build-plan.md   # Software Engineer working document (research, approach, review history)
    ├── .env.example        # Required env vars documented
    └── README.md           # What it does, setup, tool reference
```

### Verify Before Submitting

```bash
cd connectors/<service-name>
npm install
npm run build
npm test
```

All tests must pass. The CI pipeline will run these same checks.

---

### Fallback — Manual Git Workflow

If the in-app flow isn't available (e.g., running the skill outside a seeded conversation) or the user explicitly prefers manual control, delegate the PR mechanics to the [`submit-pr-to-rebel-oss`](../../submit-pr-to-rebel-oss/SKILL.md) skill. That skill owns the generic fork / branch / atomic-commit (via the GitHub Git Data API) / push / PR-open flow.

**Before invoking it, confirm:**

- Phase 7 quality review has passed.
- The [OSS Security Review](#oss-security-review) above has passed — internal-reference scan, bridge-pattern check, host/domain validation, license/docs, test fixture hygiene all clean.
- The [PR description template](#pr-description-template) has been filled in as `prBody`, and `prTitle` matches the format `feat: add <service-name> connector`.
- `files` is a source→destination list enumerating every connector file (see the [Connector File Structure](#connector-file-structure) above — include `package.json`, `tsconfig.json`, `src/`, `test/`, `docs/build-plan.md`, `README.md`, `.env.example`, `LICENSE`). Nothing under `dist/` or `node_modules/`. No `.env` with real credentials.
- `pathAllowlistPrefix` is set to `connectors/<service-name>/` so the skill rejects anything outside that scope.

The build skill's Phase 8 writes out the full parameter block to pass to `submit-pr-to-rebel-oss` — use that as the source of truth.

---

## Phase C: Maintainer Review & Publish

After you open your PR, this is what happens on the maintainer side:

### C.1 CI Runs Automatically

The `ci.yml` workflow runs on every PR targeting `main`:
- Builds the connector (`npm run build`)
- Runs tests (`npm test`) across Node.js 20 and 22
- Verifies package contents — no source maps or test files leak into the npm package

You'll see the CI status on your PR. Fix any failures before requesting review.

### C.2 Maintainer Review

A maintainer reviews the PR under the assumption that any external contribution may be **malicious, incompetent, or both, until proven otherwise**. The structured description you provide is helpful context, but it does not earn the contribution good faith — verifiable identity, code that does what it claims, and a clean read against the adversarial review prompts do.

Maintainers use an internal reviewer playbook for the full review process. Everything below is a contributor-facing summary of what the reviewer is checking on your PR, not a substitute for that maintainer process.

What that review covers, in summary:
- **Adversarial code read** — looking for backdoors, exfiltration paths, supply-chain hooks, unexplained scope, suspicious dependencies, install-time scripts. The reviewer will not just check boxes; they will read the diff with the assumption that something might be wrong.
- **Contributor identity** — verifiable GitHub account, plausible commit history, account that exists beyond this PR. **Anonymous and pseudonymous PRs default to reject** while our policy is still being formalised.
- **IP posture** — the contribution is implicitly licensed under the repo licence by virtue of being submitted via GitHub against the live `LICENSE` file. The reviewer will flag anything in your PR that contradicts that posture (claims of corporate ownership, code copied from other repos, etc.).
- **Quality and correctness** — code patterns, security checks, tool design (naming, annotations, descriptions), test coverage, documentation completeness.

**What this means for you as a contributor:** make the reviewer's job easy. Use a real GitHub account, write a clear PR description that matches what the code actually does, keep the diff focused on the connector you're contributing, and don't add unexplained scope. Anything that triggers a "feels wrong" signal will slow your PR down or stop it.

### C.3 Merge & Tag

Once approved, the maintainer:
1. Merges the PR to `main`
2. Tags a release: `<service-name>-v<version>` (e.g., `stripe-v0.1.0`)

### C.4 npm Publish

The `publish.yml` workflow triggers on the release tag:
1. Verifies the tag is on `main` (releases can't be cut from feature branches)
2. Verifies version sync across the tag, `package.json`, and `server.ts`
3. Verifies package contents (no source maps)
4. Runs `npm publish --access public` using the `NPM_TOKEN` secret

> **Future direction:** The publish pipeline is transitioning to npm OIDC trusted publishing with provenance attestations for stronger supply-chain security. The `NPM_TOKEN` secret flow is the current mechanism but will be replaced.

The connector is now available as `@mindstone-engineering/mcp-server-<service-name>` on npm.

### C.5 Catalog Entry

After npm publish, a separate PR is created (or the maintainer creates one) to add the connector to the Rebel connector catalog. This makes it discoverable in Settings → Connectors for all Rebel users.

### C.6 MCP Registry Submission

After npm publish, the maintainer also registers (or updates) the connector in the [official MCP Registry](https://registry.modelcontextprotocol.io). This makes the connector discoverable to **any** MCP host (not just Rebel) — Claude Desktop, Cursor, IDE plugins, agentic tools, etc.

**Prerequisites already shipped with your PR** (the in-app contribution flow and `oss-port-worker` skill emit these automatically; see `mcp-servers/CONTRIBUTING.md` § Registry Submission in the public repository):

- `connectors/<name>/server.json` — registry manifest, schema-validated against `2025-12-11`. Contains `name: "io.github.mindstone/mcp-server-<name>"`, version pinning, `repository.subfolder`, `packages[0]` with npm registry+stdio transport+env vars, and `_meta.com.mindstone.rebel.{catalogId, provider}` for round-trip identity with Rebel's catalog.
- `package.json` carries `mcpName` matching `server.json.name` — registry verifies ownership against the live npm metadata, so this field MUST be in the published npm version, not just the local checkout.
- The `server-json-check.yml` CI workflow ran clean on the PR (cross-file consistency + `mcp-publisher validate`).

**Maintainer step** (after `publish.yml` ships the npm version):

```bash
# One-time setup on whichever machine/runner does the registration
brew install mcp-publisher  # or download from https://github.com/modelcontextprotocol/registry/releases

# Authenticate via GitHub OIDC (locally needs `gh auth login` first; cleanest in CI)
mcp-publisher login github-oidc

# Register (or update) the connector
cd mcp-servers
mcp-publisher publish connectors/<connector>/server.json

# Verify
curl -s "https://registry.modelcontextprotocol.io/v0/servers?search=<connector>" | jq .
```

> **Future direction:** This registry registration step will move into `publish.yml` once npm OIDC trusted publishing with provenance attestations is in place — the registry, npm publish, and provenance step together.

---

## Phase D: Transition to npm (Optional)

After the connector is published to npm, you *may* switch from your local build to the published package. This is entirely optional — your local build is always valid and may have local customizations.

### To switch:

1. **Disconnect your local MCP** in Rebel: Settings → Connectors → remove the custom MCP entry pointing to your local `dist/index.js`
2. **Reconnect via the catalog**: The connector should now appear in Settings → Connectors as a one-click install (uses `npx @mindstone-engineering/mcp-server-<name>` under the hood)
3. **Re-enter credentials**: The published version uses the same environment variables, but you'll need to configure them in the new connector entry

### Why this isn't automatic:

- Your local build may have customizations not in the published version
- You may want to keep running a development version while contributing improvements
- Switching is a user decision, not an automated migration

---

## Quality Bar for Contribution

Your connector must meet these standards before submitting a PR. This is the same checklist from [Phase 7: Quality Review](../SKILL.md#phase-7-quality-review) of the build skill, focused on contribution requirements.

### Tests
- At minimum: MCP Inspector manual verification
- Ideally: automated tests matching `ci.yml` expectations (build + test passing on Node 20 and 22)
- Tests should cover: happy path for each tool, error/edge cases (missing params, API errors, empty results), and pagination if applicable

### Documentation
- **README.md** with: what the connector does, setup instructions (required env vars, API access), tool reference (name, description, inputs, outputs for each tool), and auth requirements
- **`.env.example`** documenting all required environment variables

### Security Review
- No hardcoded API keys, tokens, or secrets anywhere in the code
- `.env` for credentials, `.gitignore` excludes `.env`
- Base URL is a constant or from env var — never from tool input (SSRF prevention)
- All tool inputs validated via Zod schemas
- HTTP timeouts configured on API requests
- HTTPS required for external APIs
- Credentials never logged or exposed in tool responses
- For OSS-specific security requirements, see [OSS Security Review](#oss-security-review) above

### Naming Compliance
- All tool names use `snake_case` with a service prefix (e.g., `zendesk_search_tickets`, `stripe_list_charges`)
- All top-level parameter names use `snake_case`
- Canonical names for common concepts: `limit`, `page_token`/`cursor`, `return_json`, `{thing}_id`

### Tool Annotations
- Every tool has `readOnlyHint` and `destructiveHint` annotations set correctly
- Read-only tools: `readOnlyHint: true`
- Create/update tools: `readOnlyHint: false, destructiveHint: false`
- Delete/destructive tools: `readOnlyHint: false, destructiveHint: true`

### Packaging
- `bin` field in `package.json` points to `dist/index.js` (for npx distribution)
- `files: ["dist"]` in `package.json` to limit npm package contents
- Shebang (`#!/usr/bin/env node`) at the top of the entry file
- `npm run build` succeeds without errors
- No source maps or test files in the published package

> For the full development standard, see [mcp-development-standard.md](mcp-development-standard.md).

---

## OSS Security Review

Before submitting a PR, every connector must pass this security review. These checks exist because open-source code is visible to — and usable by — anyone, including potential attackers. Issues that are harmless in internal code become real vulnerabilities when published.

> **Mindset reminder:** these checks are red-team tools, not a passing grade. The maintainer reviewing your PR is told to assume any external contribution may be malicious, incompetent, or both, until proven otherwise. Ticking these boxes does not confer safety — it just means the obvious failure modes weren't found. Use this section to clean up the obvious stuff *before* you submit, knowing the actual review is broader and adversarial. If anything in your connector exists for reasons that aren't obvious from the code, document it in `docs/build-plan.md` so the reviewer doesn't have to guess.

> For the technical standards behind these checks, see [mcp-development-standard.md § OSS Readiness](mcp-development-standard.md#oss-readiness).

### Internal Reference Scan

Run this from the connector root:

```bash
rg -i 'mindstone|rebel|nspr' --glob '!LICENSE' --glob '!package.json' --glob '!node_modules' src/ test/
```

**Expected result: zero matches.** If any are found:
- Error messages referencing "Mindstone" or "Rebel" → Replace with host-neutral language ("your MCP host's settings")
- Product-host-specific User-Agent strings → Replace with connector name and version
- Environment variables like REBEL_WORKSPACE_PATH → Replace with connector-specific names
- Imports or references to bridge code → Remove entirely (see below)

### Bridge Pattern Check

The bridge pattern (MINDSTONE_REBEL_BRIDGE_STATE, bridge.ts, localhost bridge calls) is internal host plumbing that must NOT be in open-source connectors.

```bash
rg -l 'MINDSTONE_REBEL_BRIDGE_STATE|bridge\.ts|127\.0\.0\.1.*bundled' src/ test/
```

**Expected result: zero matches.** If found, the connector still has internal host coupling that must be removed before publishing.

### Host/Domain Validation Check

If the connector accepts user-supplied hostnames or subdomains:
- Verify strict validation exists BEFORE the hostname is used in URL construction
- Verify credentials are NEVER sent to unvalidated hosts
- Check for URL interpolation patterns like `` `https://${domain}.service.com` `` — the `domain` variable must be validated first

### License and Documentation Check

- [ ] LICENSE file exists in the connector root with full license text (not just a reference in package.json)
- [ ] README.md exists with: what the connector does, setup instructions, tool reference, auth method, and security disclosures
- [ ] .env.example documents all required environment variables

### Test Fixture Hygiene

- [ ] Mock API keys don't resemble real credential patterns — avoid prefixes like `sk_`, `key_real_`, `Bearer eyJ`
- [ ] Use obviously fake values: `test-mock-api-key`, `mock-token-for-testing`

### Repo-Level Governance (maintainer responsibility)

These are not per-connector checks but repo-level requirements that maintainers enforce:

- **SECURITY.md** at repo root — vulnerability disclosure process, security contact, supported versions
- **Contributor identity & IP transfer** — current de facto coverage is GitHub PR submission via an authenticated account against the live `LICENSE` file (which makes the contribution an implicit grant under the repo licence). Anonymous and pseudonymous PRs default to reject while the policy is being formalised. **Phase 2 (deferred):** formalise IP transfer with one of DCO sign-off, a PR-template IP-donation checkbox, or a CLA via cla-assistant.io — decision and rollout TBD. Until then, do not add new UI or process for this.
- **Supply chain** — npm publishing should use OIDC trusted publishing with provenance when available (the current `NPM_TOKEN` flow is a transitional step)

## Intent and Decision Capture

Throughout the build process, Rebel tracks context that would otherwise be lost between the build conversation and the PR review. This feeds the auto-generated PR description.

**What Rebel captures at each phase:**
- **Phase 0 (Build-vs-Buy Gate):** Why building was the right choice — existing alternatives and why they were insufficient
- **Phase 1 (Discovery):** User's use cases and requirements in plain language
- **Phase 3 (Planning):** Approved tool list, auth method, API constraints discovered
- **Phase 4 (Implementation):** Workflow used, implementation model, review rounds and findings
- **Phase 5 (Security):** Security review outcome
- **Phase 6 (Testing):** Build/test results, whether tools were tested end-to-end in Rebel
- **Phase 7 (Quality Review):** Final quality gate status

At the end of the build, Rebel assembles this into the PR description template below.

---

## PR Description Template

When contributing a connector, use this structured PR description. Rebel auto-generates this from context captured during the build. The goal is to give the Mindstone engineering team enough context to make a confident merge decision in a 30-second scan — surgical, not bloated.

**Anti-patterns to avoid:**
- Full build-vs-buy search transcripts (Tier 1/2/3 dumps)
- AI marketing speak ("robust, comprehensive, production-ready integration...")
- Exhaustive implementation narratives or model rosters
- Repeating the full README tool reference in the PR body
- "All tests pass" with no indication of what was actually run

````markdown
## Summary

Adds the `<connector_name>` connector for **<service>**.
<User's intent — what problem this solves, for whom, and why existing options were insufficient. 1-3 sentences, plain language from the user's own words where possible.>

## What it does

- **Auth:** <API key / OAuth / Bearer token / None>
- **Tools (<N>):**
  - `<tool_a>` — <one-liner>
  - `<tool_b>` — <one-liner>
  - `<tool_c>` — <one-liner>
- **Annotations:** <all read-only / includes write / includes destructive actions>

## Checks run

- **Build & tests:** `npm run build && npm test` ✅ / ⚠️ <details if failing>
- **Integration tested in Rebel:** ✅ Tested `<tool_a>`, `<tool_b>` end-to-end / ❌ Not tested
- **Security review:** ✅ Pass — <reviewer model> / ⚠️ <issues found> / ❌ Not performed

## Reviewer notes

- **Known limitations:** <rate limits, partial API coverage, missing features — or "None">
- **Build plan:** `docs/build-plan.md` — full research, implementation stages, and review history

## Build Context

- **Workflow:** Software Engineer → <N> stage(s)
- **Model:** <e.g., claude-opus-4-7>
- **Code review:** <N> review(s) by <model(s)> — <key outcome, e.g., "2 findings addressed">

Submitted via Rebel's in-app contribution flow.
````

The description answers four questions a reviewer needs: **Is it useful?** (Summary), **What's the scope/risk?** (What it does), **Does it work?** (Checks run), and **Is it safe?** (Reviewer notes + Checks run security line). The Build Context footer gives provenance without dominating the description.

---

## CI Pipeline

The [`mcp-servers`](https://github.com/mindstone-engineering/mcp-servers) repository uses two GitHub Actions workflows:

### ci.yml — Continuous Integration

**Triggers:** Every push to `main` and every pull request targeting `main`.

**What it does:**
1. Checks out the repository
2. Sets up Node.js (matrix: Node 20 and Node 22)
3. Installs dependencies (`npm ci`)
4. Builds the connector (`npm run build`)
5. Runs tests (`npm test`)
6. Verifies package contents — ensures no source maps (`.map` files) or test files leak into the npm package

**For contributors:** CI runs automatically on your PR. Check the status checks on GitHub — all must pass before the PR can be reviewed. If CI fails, check the build logs, fix the issue, and push again.

### publish.yml — npm Publish

**Triggers:** Git tags matching `<connector>-v*` (e.g., `zendesk-v0.2.0`, `stripe-v0.1.0`). This is tag-triggered, not merge-triggered — a maintainer must explicitly tag a release after merging.

**What it does:**
1. Verifies the tag is on `main` (cannot publish from feature branches)
2. Checks version sync across three sources: the git tag, `package.json`, and the `version` constant in `server.ts` — all three must match
3. Builds and tests one final time
4. Verifies package contents (no source maps)
5. Runs `npm publish --access public` with the `NPM_TOKEN` secret

**For contributors:** You don't trigger this — the maintainer does after merging your PR. The published package appears at `@mindstone-engineering/mcp-server-<name>` on npm.

### What this means for your PR:

- Your PR only interacts with `ci.yml` — make sure `npm run build` and `npm test` pass
- Publishing happens *after* merge via a separate manual tag by the maintainer
- There is no automatic publish-on-merge — this is intentional so maintainers can batch changes and control release timing
