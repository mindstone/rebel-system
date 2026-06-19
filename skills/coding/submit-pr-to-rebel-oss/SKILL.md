---
name: submit-pr-to-rebel-oss
description: "Generic, parameterized flow for opening a pull request against a Rebel open-source repository. Called from a parent skill (e.g. build-custom-mcp-server, extend-mcp-server) once local changes are ready to ship. Covers fork, branch, commit (via GitHub Git Data API for atomic multi-file commits), push, and PR open. Uses the GitHub REST API + OAuth by default; gh CLI is a documented alternative. Does not cover CI triage, review responses, rebasing, or merge — those belong to a follow-up workflow."
last_updated: 2026-04-22
agent_type: main_agent
tools_required: []
---

# Submit PR to a Rebel OSS Repo

Opens a pull request against a Rebel open-source repository. This skill is **mechanics only** — the parent skill owns the narrative (what's being contributed, why, which files, the PR description).

The skill mirrors the pattern used by Rebel's in-app contribution service (`src/main/services/contributionGitHubService.ts`): fork → branch → commit via the **Git Data API** (atomic, multi-file, no local clone required) → PR open. This keeps agent-driven contributions consistent with how the app itself submits contributions.

## When to use this skill

Call this skill from another skill when:

- Local changes are ready to ship (code, tests, docs written and validated).
- Any domain-specific quality / security review the parent skill requires has already passed.
- The parent skill has composed a PR title and body.
- You want to open a PR against a Rebel OSS repo (e.g. `mindstone/mcp-servers` or any future Rebel OSS repo).

**Do not call this skill for:**

- MCP connector submissions where the in-app contribution flow (`rebel_mcp_report_contribution_state` → MCPBuildCard → automatic submission) is available and the user hasn't opted out. The in-app flow is the primary path for MCP connectors; this skill is the manual fallback. See [build-custom-mcp-server](../build-custom-mcp-server/SKILL.md) Phase 8 for when the fallback is appropriate.
- Work that hasn't been tested locally. Open PRs only for code the agent has actually exercised.
- Follow-up work on an existing PR (CI failures, review comments, rebases, merges). That's a separate workflow.

## Preconditions — the parent skill MUST confirm all of these before invoking

This skill refuses to act if any precondition is unmet. The parent skill is responsible for verifying each item:

1. **Changes are tested locally.** Build passes, tests pass, the feature actually works.
2. **Any domain-specific security / quality review has passed.** For MCP connectors this is the OSS Security Review in `contribute-connector.md` (internal-reference scan, bridge-pattern check, host/domain validation, license/docs, test fixture hygiene). If the parent skill has its own gate, that gate must be green.
3. **`prTitle` is a non-empty, descriptive string** — no "feat: update" placeholders, no generic one-liners. A reviewer should understand the PR's scope from the title alone.
4. **`prBody` is composed** using the parent skill's template. Empty or generic bodies are rejected — reviewers need context to make a merge decision in a 30-second scan.
5. **`filePaths` enumerates every file** that should be committed. Not `git add .`, not wildcards — an explicit list. This prevents build artefacts (`dist/`, `.env`, `node_modules`, coverage output) from leaking into the commit.
6. **No credentials in any file.** Visually inspect the diff for leaked tokens, API keys, `.env` contents, or anything under `.rebel-contribution/`. A file allowlist helps but isn't sufficient on its own.

## Parameters — the parent skill supplies these

| Param | Required | Example | Notes |
|-------|----------|---------|-------|
| `repo` | yes | `"mindstone/mcp-servers"` | Upstream `owner/repo`. |
| `baseBranch` | yes | `"main"` | PR target branch on the upstream. Used as the fallback base when `branchName` doesn't yet exist on the fork. |
| `branchName` | yes | `"feat/zendesk-search-macros"` | Feature branch on the contributor's fork. Use the parent skill's naming convention. |
| `commitMessage` | yes | `"feat(zendesk): add search-macros tool"` | Conventional-commits format. |
| `prTitle` | yes | `"feat(zendesk): add search-macros tool"` | Human-readable PR title. |
| `prBody` | yes | (markdown string) | Composed by the parent skill using the parent's template. |
| `files` | yes | see below | Explicit list of **source → destination** file pairs to commit. |
| `pathAllowlistPrefix` | yes | `"connectors/zendesk/"` | Every `destination` path must live under this prefix. Aborts on violation. |

**`files` shape** — each entry is an object with both a source and destination path:

```json
[
  { "source": "~/mcp-servers/zendesk-mcp/src/index.ts",     "destination": "connectors/zendesk/src/index.ts" },
  { "source": "~/mcp-servers/zendesk-mcp/package.json",      "destination": "connectors/zendesk/package.json" },
  { "source": "~/mcp-servers/zendesk-mcp/docs/build-plan.md","destination": "connectors/zendesk/docs/build-plan.md" }
]
```

- `source` — absolute (or `~`-expanded) path on the local filesystem where the agent reads the file contents from.
- `destination` — repo-relative path where the file lands in the target repo.

For in-repo edits (e.g. `extend-mcp-server` working directly on a local clone of `mcp-servers`), `source` and `destination` typically differ only by an absolute-path prefix. For off-repo builds (e.g. `build-custom-mcp-server` with `~/mcp-servers/<api-name>-mcp/` outside the target repo), `source` and `destination` have different directory structures — the mapping is explicit for exactly this reason.

## Scope

**In scope:** authenticate, fork (or reuse existing fork), create feature branch, commit changed files atomically, open the pull request, return the PR number and URL.

**Out of scope:** CI-failure triage, addressing review comments, rebasing against upstream after `main` advances, `--force-with-lease` re-pushes, merge/close operations, post-merge cleanup. These belong to a separate workflow — do not attempt them from this skill.

## Flow

### 1. Authenticate

**Primary — GitHub REST API + OAuth.** Read a token from a secure location — environment variable `GITHUB_CONTRIBUTION_TOKEN` or a pre-configured user credential. Never hardcode a token. Never log its value.

Required scope: `public_repo` (matches the contribution service in `src/main/services/contributionGitHubAuthService.ts` — using `repo` scope is over-permissioned for public-repo contributions and must be refused).

Verify the token before doing anything else:

```
GET https://api.github.com/user
Authorization: Bearer <token>
```

- 200 → proceed. Remember `user.login` — you need it for the fork owner.
- 401 → abort. Surface "Your GitHub authorisation for Rebel contributions has expired — please reconnect." to the parent skill. Do not prompt interactively from this skill.
- 403 → inspect the response before retrying. A 403 with `X-RateLimit-Remaining: 0` or a `Retry-After` header is a rate limit (retry with backoff, max 3 attempts). A 403 with a `"message"` like `"Resource not accessible by ..."` is a permission/policy failure — abort; no amount of retrying will fix it.

**Alternative — `gh` CLI.** If the agent already has authenticated `gh`, this flow is also valid — use `gh auth status --hostname github.com --active` to verify (don't use `--json`; its exit code is unreliable). See [github-cli-gh](../github-cli-gh/SKILL.md) for command reference. Do NOT run `gh auth login` from this skill — it's interactive and must not be triggered by an agent.

### 2. Fork or reuse the fork

**REST:**

```
POST https://api.github.com/repos/{repo}/forks
```

This endpoint is idempotent — it returns the existing fork if one exists, otherwise creates one asynchronously. Poll `GET /repos/{user.login}/{repoName}` up to ~20 seconds (10 attempts × 2s) until it returns 200. 404 means the fork isn't ready yet — keep polling.

**gh alternative:** `gh repo fork {repo} --clone=false --remote=false`.

After this step you have `{user.login}/{repoName}` as the fork.

### 3. Path allowlist check (before any write)

For every entry in `files`, validate `destination` against the allowlist — **mirrors `validateConnectorPaths()` in `contributionGitHubService.ts`**:

- Must start with `pathAllowlistPrefix`.
- Must not be absolute (no leading `/`).
- Must not contain `..` (path traversal).
- Must not start with `.github/` (workflow-injection prevention).
- Must be non-empty and extend beyond the prefix (not just the directory itself).

If any `destination` fails: **abort immediately.** Do not create blobs, do not create commits, do not open a PR. Surface every violating path to the parent.

Do this before any write (blob/tree/commit/ref) operation — the check is cheap and prevents wasted API quota and half-written commits.

### 4. Resolve the base commit and base tree

The Git Data API commit step needs a **tree SHA** to use as `base_tree`. A branch ref gives you a commit SHA, so this step has two substeps.

**4a. Find the base commit SHA.** Read the feature branch first; fall back to the default branch only if it doesn't exist yet:

```
GET https://api.github.com/repos/{user.login}/{repoName}/git/ref/heads/{branchName}
```

- 200 → `baseCommitSha = response.object.sha`. The branch already exists (e.g. from a prior attempt). Your new commit advances it. Note this case — step 6 uses `PATCH` for the ref update.
- 404 → branch doesn't exist yet. Read the fork's default branch:
  ```
  GET https://api.github.com/repos/{user.login}/{repoName}/git/ref/heads/{baseBranch}
  ```
  200 → `baseCommitSha = response.object.sha`. Note this case — step 6 uses `POST` to create the ref.

**4b. Read the commit to get its tree SHA:**

```
GET https://api.github.com/repos/{user.login}/{repoName}/git/commits/{baseCommitSha}
→ { "tree": { "sha": "<baseTreeSha>" }, ... }
```

You now have `baseCommitSha` (for the `parents` array) and `baseTreeSha` (for `base_tree` in the tree step). Skipping 4b is the most common cause of `422` errors on `/git/trees` — the endpoint accepts tree SHAs, not commit SHAs.

### 5. Commit via the Git Data API (atomic, multi-file, no local clone)

This is the preferred path because it produces a single atomic commit, doesn't require a local git clone, and cannot pick up unrelated working-tree files.

**5a. Create a blob per file.** Read each `source` from disk, then:

```
POST https://api.github.com/repos/{user.login}/{repoName}/git/blobs
{ "content": "<file contents>", "encoding": "utf-8" }
→ { "sha": "<blobSha>" }
```

For text files use `encoding: "utf-8"` with raw content (matches the canonical implementation). For binary files use `encoding: "base64"` with base64-encoded content. Never commit binary artefacts you can't review — if a file's purpose is unclear, abort and ask the parent skill.

**5b. Build a single tree** rooted at `baseTreeSha`:

```
POST https://api.github.com/repos/{user.login}/{repoName}/git/trees
{
  "base_tree": "{baseTreeSha}",
  "tree": [
    { "path": "{destination}", "mode": "100644", "type": "blob", "sha": "{blobSha}" },
    ...
  ]
}
→ { "sha": "<treeSha>" }
```

**5c. Create the commit:**

```
POST https://api.github.com/repos/{user.login}/{repoName}/git/commits
{
  "message": "{commitMessage}",
  "tree": "{treeSha}",
  "parents": ["{baseCommitSha}"]
}
→ { "sha": "<commitSha>" }
```

**5d. Create or update the branch ref** based on which case fired in 4a:

- Branch is **new** (404 in 4a → used default branch as base):
  ```
  POST https://api.github.com/repos/{user.login}/{repoName}/git/refs
  { "ref": "refs/heads/{branchName}", "sha": "{commitSha}" }
  ```
- Branch **already exists** (200 in 4a → used its own HEAD as base):
  ```
  PATCH https://api.github.com/repos/{user.login}/{repoName}/git/refs/heads/{branchName}
  { "sha": "{commitSha}", "force": false }
  ```

If any step fails, stop — don't attempt partial recovery via a different mechanism. Surface the failure to the parent.

### Alternative — local git (only when the Git Data API path isn't usable)

If the agent genuinely cannot use the REST API (no token, offline, corporate proxy blocks `api.github.com`), fall back to local git. This path only works when `source` and `destination` paths correspond to an actual clone of the target repo at the fork remote — i.e. the parent skill has already cloned the repo and is editing files in place. For off-repo builds (source tree outside the repo), the Git Data API path is the only viable option.

```bash
cd <cloned-fork-root>
git checkout -b "{branchName}"
# Enumerate explicit destination paths — NEVER `git add .`, `-A`, or wildcards
git add -- "{destination1}" "{destination2}" ...
git diff --cached --stat   # Visual sanity check before commit
git commit -m "{commitMessage}"
git push origin "{branchName}"
```

Before committing, run `git status` and abort if the working tree has untracked or modified files outside `pathAllowlistPrefix`. Never auto-stash or reset — ask the parent skill to surface the dirty state to the user.

### 6. Open the pull request

```
POST https://api.github.com/repos/{repo}/pulls
{
  "title": "{prTitle}",
  "body":  "{prBody}",
  "head":  "{user.login}:{branchName}",
  "base":  "{baseBranch}"
}
→ { "number": 123, "html_url": "..." }
```

**gh alternative:** `gh pr create -R {repo} --base {baseBranch} --head {branchName} --title "..." --body "..."`.

### 7. Hand back to the parent skill

Return:

- PR number
- PR URL (`html_url` from the response)
- Head commit SHA

The parent skill is responsible for surfacing this to the user, tracking submission state, and any follow-up (waiting on CI, etc.). This skill does not poll CI or wait for reviews.

## Error handling

| Case | Action |
|------|--------|
| 401 Unauthorized | Abort. Parent skill explains to the user in plain language ("your GitHub connection for Rebel contributions needs to be re-authorised"). Do not prompt from this skill. |
| 403 rate-limit (header-confirmed) or 429 | Honour `Retry-After`; otherwise exponential backoff (1s → 2s → 4s), max 3 attempts. After that, abort. |
| 403 permission/policy (no rate-limit headers) | Abort immediately. Surface the GitHub error message to the parent. Retrying will not help. |
| 422 fork already exists | Treat as success; use the existing fork. |
| 422 on `/git/trees` with "Not a tree" | You passed a commit SHA where a tree SHA was expected — re-check step 4b. |
| 422 ref already exists (step 5d) | This shouldn't happen if step 4a was followed correctly. If it does, investigate rather than force-push. |
| 422 on PR open ("A pull request already exists") | Look up the existing PR and surface its URL to the parent — do not open a duplicate. Use: `GET https://api.github.com/repos/{repo}/pulls?head={user.login}:{branchName}&state=open` (matches `contributionGitHubService.ts`). Take the first result's `html_url` and `number`. |
| 422 on PR open ("No commits between branches") | Abort — the branch has no new commits. Something went wrong in step 5. |
| Path allowlist violation | Abort immediately before any write. Report the offending paths. |
| Working-tree dirty (local-git path only) | Abort. Never auto-stash, auto-reset, or discard user work. Surface the issue to the parent skill. |
| Network failure mid-flow | Surface and abort. Do not retry partial Git Data API sequences — they're cheap to redo from scratch. |

## Security

- **Never log the OAuth token** or include it in error messages, breadcrumbs, or telemetry. The token appears only in the `Authorization` header.
- **Refuse `repo` scope.** Only `public_repo` is acceptable for public-repo contributions. A broader scope indicates a misconfigured auth flow.
- **Never push to `main` or `master` on any fork or upstream** — the feature branch is mandatory.
- **Never include `dist/`, `node_modules/`, `.env`, `.env.*` (except `.env.example`), build artefacts, coverage output, or IDE config files** in `filePaths`. CI builds from source; committed build output is a leak risk and will break npm publishing for the downstream package.
- **Pre-blob scan — after reading each `source` file and before creating its blob**, reject the submission if the content contains:
  - Personal absolute paths — `/Users/<name>/`, `/home/<name>/`, `C:\\Users\\<name>\\`. These leak the contributor's machine identity and flag the PR as copy-pasted without review.
  - Tokens or credentials — `ghp_`, `github_pat_`, `sk-`, `AKIA` prefixes, or anything matching `[A-Z0-9_]{3,}_(API_KEY|TOKEN|SECRET)\s*=\s*["'][^"']{8,}`.
  - Internal host references (`mindstone`, `rebel`, `nspr`) inside source or test files — docs may reference the source org in PR metadata; code may not.
  Abort before creating any blob if a scan hits — fixing it after a partial commit means force-pushing, which this skill refuses.
- **Verify `package.json` declares a `"license"` field** (and a matching LICENSE file exists) whenever `files` includes a `package.json`. Missing license metadata is a recurring reviewer pushback for OSS contributions.
- **Visually inspect the diff** before calling step 5. If the parent skill composed `filePaths` from a pattern, confirm every resolved path before committing.
- **Do not submit a PR with failing local tests.** The preconditions enforce this, but worth restating — an open PR represents "this works" to the reviewer.

## [IMPORTANT]

- This skill **opens** the PR. It does **not** drive it to merge.
- This skill never prompts the user — all parameters come from the parent skill.
- The parent skill composes the PR title and body. This skill doesn't know the domain.
- If any precondition is unmet, refuse to run and return to the parent skill.

## See Also

- [github-cli-gh](../github-cli-gh/SKILL.md) — `gh` CLI reference for the alternative path.
- [git-commit-changes](../git-commit-changes/SKILL.md) — commit hygiene and atomic batching.
- `src/main/services/contributionGitHubService.ts` — canonical implementation of the REST + Git Data API pattern that this skill mirrors.
- `src/main/services/contributionGitHubAuthService.ts` — OAuth flow with `public_repo` scope.
- [build-custom-mcp-server](../build-custom-mcp-server/SKILL.md) — parent skill for new MCP connector contributions.
- [extend-mcp-server](../extend-mcp-server/SKILL.md) — parent skill for adding tools to existing MCP connectors.
- `docs/plans/260422_extract_rebel_oss_pr_skill.md` — design rationale and decisions behind this skill.
