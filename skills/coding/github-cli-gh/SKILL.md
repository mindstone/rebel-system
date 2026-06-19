---
name: github-cli-gh
description: "Reference guide for using GitHub CLI (gh) to interact with GitHub repos, issues, PRs, Actions, and releases from the command line. Preferred over GitHub MCP for simplicity."
last_updated: 2026-01-14
agent_type: main_agent
tools_required: ["gh"]
---

# GitHub CLI (`gh`) Reference

The GitHub CLI (`gh`) provides a powerful command-line interface for GitHub operations. It's the recommended way to interact with GitHub from Rebel, as it's well-documented, automation-friendly, and requires no additional MCP server setup.

**Why gh CLI over GitHub MCP?** The GitHub MCP Server provides richer context for AI agents but requires Docker and more complex setup. For most tasks (creating PRs, checking CI, managing issues), `gh` is simpler, faster, and sufficient. Consider MCP only when deep repo exploration or complex multi-step reasoning about GitHub state is needed.


## See Also

- [references/deep-dive.md](references/deep-dive.md) - Comprehensive deep-dive with advanced features, extensions, and comparison
- CI investigation workflow using `gh` - use the repository's own CI documentation or runbook when available
- **Official CLI manual**: https://cli.github.com/manual/
- **GitHub CLI repo**: https://github.com/cli/cli - Installation for all platforms
- **Environment variables**: https://cli.github.com/manual/gh_help_environment
- **Output formatting**: https://cli.github.com/manual/gh_help_formatting
- **Alternative - GitHub MCP Server**: https://github.com/modelcontextprotocol/servers/tree/main/src/github (requires Docker)


## Installation

### macOS
```bash
brew install gh
```

### Windows
```powershell
winget install GitHub.cli
```

### Linux (Debian/Ubuntu)
```bash
sudo apt install gh
```

Check other distributions at https://github.com/cli/cli#installation


## Authentication

### Interactive (browser OAuth)
```bash
gh auth login
```

### Non-interactive (token via stdin)
```bash
echo "$GH_TOKEN" | gh auth login --with-token
```

### Environment variables (headless/automation)
- `GH_TOKEN` or `GITHUB_TOKEN` — for github.com
- `GH_ENTERPRISE_TOKEN` — for GitHub Enterprise Server
- `GH_HOST` — default host
- `GH_REPO` — default repository (avoids `-R` flag)
- `GH_PROMPT_DISABLED=1` — disable interactive prompts (important for agents)

### Check auth status
```bash
gh auth status --hostname github.com --active
```

**Gotcha**: `gh auth status --json ...` always exits 0 even if auth has issues. For reliable exit codes, don't use `--json`.

### Refresh scopes (for Projects, etc.)
```bash
gh auth refresh -s project
```


## Non-Interactive Best Practices for Agents

1. **Set `GH_PROMPT_DISABLED=1`** to prevent commands from hanging on prompts
2. **Always specify required flags** that would otherwise prompt (e.g., `--title`, `--body`)
3. **Use `-R OWNER/REPO`** explicitly rather than relying on working directory
4. **Use `--json` output** for machine-readable responses
5. **Avoid `--web`** in headless environments


## Output Formatting

Most commands support structured output:

```bash
gh <command> --json <field1,field2,...> --jq '<jq expression>'
```

To discover available fields, run with `--json` but omit the field list:
```bash
gh pr view 123 --json
```

**IMPORTANT: The `url` field contains the actual GitHub commit/PR/issue URL.** Always use this field directly for markdown links - never construct URLs manually. The URL format varies by repository and should always come from the API response.

Example - getting commit URLs:
```bash
# Correct: Use the url field directly
gh search commits --author=username --repo=OWNER/REPO \
  --json commit,sha,url \
  --jq '.[] | "[\(.sha[0:7])](\(.url)) - \(.commit.message | split("\n")[0])"'

# This produces: [abc1234](https://github.com/OWNER/REPO/commit/abc1234...) - Commit message
```


## Core Commands

### Repository Operations

```bash
# Clone a repository
gh repo clone OWNER/REPO

# Create a new repository
gh repo create my-project --public --clone

# Fork a repository
gh repo fork OWNER/REPO --clone=false --remote=false

# View repository info (JSON)
gh repo view OWNER/REPO --json nameWithOwner,url,defaultBranchRef \
  --jq '{repo:.nameWithOwner,url:.url,defaultBranch:.defaultBranchRef.name}'
```

### Issues

```bash
# List open issues with filters
gh issue list -R OWNER/REPO --state open --label bug \
  --json number,title,url,labels \
  --jq '.[] | {number,title,url,labels:(.labels|map(.name))}'

# View issue details
gh issue view -R OWNER/REPO 123 --json number,title,state,comments,url

# Create issue (non-interactive)
gh issue create -R OWNER/REPO \
  --title "I found a bug" \
  --body "Steps to reproduce..." \
  --label bug \
  --assignee "@me"

# Comment on issue
gh issue comment -R OWNER/REPO 123 --body "Acknowledged; investigating."

# Close issue with reason
gh issue close -R OWNER/REPO 123 --reason completed --comment "Fixed in #456"
```

### Pull Requests

```bash
# List PRs with CI and review status
gh pr list -R OWNER/REPO --state open \
  --json number,title,url,reviewDecision,statusCheckRollup \
  --jq '.[] | {number,title,url,reviewDecision,checks:.statusCheckRollup}'

# View PR details
gh pr view -R OWNER/REPO 456 \
  --json number,title,body,state,mergeable,reviewDecision,url

# Create PR (non-interactive)
gh pr create -R OWNER/REPO \
  --base main \
  --head my-branch \
  --title "Fix parser edge case" \
  --body "Fixes #123"

# Checkout a PR locally
gh pr checkout -R OWNER/REPO 456

# Review: approve
gh pr review -R OWNER/REPO 456 --approve

# Review: request changes
gh pr review -R OWNER/REPO 456 --request-changes \
  --body "Needs tests for the new branch."

# Add comment (not a review)
gh pr comment -R OWNER/REPO 456 --body "Looks good overall; one nit inline."

# Check CI status
gh pr checks -R OWNER/REPO 456 \
  --json name,state,bucket,link \
  --jq '.[] | {name,state,bucket,link}'

# Watch CI (blocks until complete)
gh pr checks -R OWNER/REPO 456 --watch

# Merge PR
gh pr merge -R OWNER/REPO 456 --squash --delete-branch --auto
```

### GitHub Actions (Workflow Runs)

```bash
# List recent runs for a branch
gh run list -R OWNER/REPO --branch my-branch \
  --json databaseId,status,conclusion,workflowName,createdAt,url \
  --jq '.[] | {id:.databaseId,status,conclusion,workflow:.workflowName,url}'

# View run details (exit non-zero if failed)
gh run view -R OWNER/REPO 12345 --exit-status

# Fetch logs
gh run view -R OWNER/REPO 12345 --log

# Watch run until completion
gh run watch -R OWNER/REPO 12345 --exit-status

# Rerun failed jobs
gh run rerun -R OWNER/REPO 12345 --failed
```

### Releases

```bash
# List releases
gh release list -R OWNER/REPO --limit 10 \
  --json tagName,name,publishedAt,isDraft,isPrerelease

# Create release with auto-generated notes
gh release create -R OWNER/REPO v1.2.3 --generate-notes

# Download release assets
gh release download -R OWNER/REPO v1.2.3
gh release download -R OWNER/REPO --pattern '*.tgz'
```


## Common Workflows

### Create a PR from Current Branch

```bash
# Push branch if needed, then create PR
git push -u origin my-branch
gh pr create -R OWNER/REPO \
  --base main \
  --head my-branch \
  --title "Add feature X" \
  --body "Description of changes"

# Watch CI status
gh pr checks -R OWNER/REPO my-branch --watch
```

### Review and Merge a PR

```bash
# Check current status
gh pr view -R OWNER/REPO 456 \
  --json title,reviewDecision,mergeable,statusCheckRollup

# Approve
gh pr review -R OWNER/REPO 456 --approve

# Merge (squash + delete branch + auto-merge when checks pass)
gh pr merge -R OWNER/REPO 456 --squash --delete-branch --auto
```

### Triage Issues

```bash
# Find stale unassigned bugs
gh issue list -R OWNER/REPO \
  --search "label:bug no:assignee sort:updated-asc" \
  --json number,title,url

# Comment and close as not planned
gh issue comment -R OWNER/REPO 123 \
  --body "Thanks—closing as not planned. Please reopen if new info appears."
gh issue close -R OWNER/REPO 123 --reason "not planned"
```

### Check CI Status

```bash
# For a PR
gh pr checks -R OWNER/REPO 456 --watch

# For branch-wide runs
gh run list -R OWNER/REPO --branch main --limit 5
gh run view -R OWNER/REPO <run-id> --log
```

### Check Rate Limits

```bash
gh api rate_limit --jq '.resources.core | {limit,remaining,reset}'
```


## Gotchas & Troubleshooting

### Interactive prompts hang automation
- Set `GH_PROMPT_DISABLED=1`
- Always provide `--title`, `--body`, `--head`, `--base` flags

### PR creation prompts to push/fork
- `gh pr create` can prompt if branch isn't pushed
- Always push first, or use `--head` explicitly

### Auth status exit codes
- `gh auth status --json ...` **always exits 0** even on auth problems
- For reliable exit codes, omit `--json`

### Fine-grained PAT limitations
- `gh run watch` does NOT work with fine-grained PATs (can't grant `checks:read`)
- Use classic PATs for Actions-heavy workflows

### Search queries starting with `-`
- Queries like `-label:bug` can be parsed as flags
- Use `--` separator: `gh search issues -- "query -label:bug"`

### Job rerun IDs
- `gh run rerun --job` requires `databaseId`, not the browser URL job number

### Projects scope
- Creating issues/PRs into Projects may require extra scope
- Run: `gh auth refresh -s project`


## Preflight Checklist for Agents

Before using `gh` commands, verify:

```bash
# 1. Check gh is available
gh --version

# 2. Check authentication (non-JSON for exit code)
gh auth status --hostname github.com --active

# 3. Set repo context (or use -R flag)
export GH_REPO="OWNER/REPO"

# 4. Disable prompts
export GH_PROMPT_DISABLED=1
```


## Debugging

For API/auth issues, enable debug logging:

```bash
GH_DEBUG=1 gh pr list
GH_DEBUG=api gh api rate_limit
```
