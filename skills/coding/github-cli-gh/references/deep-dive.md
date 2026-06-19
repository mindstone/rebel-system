---
description: "Comprehensive reference for GitHub CLI (gh) covering installation, authentication, all command families, advanced features, and comparison with GitHub MCP Server."
generated_by: skills/documentation/write-deep-dive-as-doc/SKILL.md
generated_date: 260114
---

# GitHub CLI Deep Dive

## See Also

- [Official CLI Manual](https://cli.github.com/manual/) - Complete command reference
- [GitHub CLI Repository](https://github.com/cli/cli) - Source code, releases, installation
- [Environment Variables](https://cli.github.com/manual/gh_help_environment) - All env vars for configuration
- [Output Formatting](https://cli.github.com/manual/gh_help_formatting) - JSON output and Go templates
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github) - Alternative approach for AI agents (requires Docker)
- [../SKILL.md](../SKILL.md) - Quick reference skill for agents

---

## 1. Installation & Setup

### Installation by Platform

| Platform | Command | Notes |
|----------|---------|-------|
| **macOS** | `brew install gh` | Also: MacPorts, Conda |
| **Windows** | `winget install GitHub.cli` | Also: Chocolatey (`choco install gh`), Scoop (`scoop install gh`), MSI |
| **Debian/Ubuntu** | `sudo apt install gh` | Requires [official keyring setup](https://github.com/cli/cli/blob/trunk/docs/install_linux.md) |
| **Fedora/CentOS** | `sudo dnf install gh` | |
| **Arch Linux** | `sudo pacman -S github-cli` | |

**Cross-platform**: Binary downloads from [GitHub Releases](https://github.com/cli/cli/releases) or `conda install gh`.

### Authentication

```bash
# Interactive (opens browser for OAuth)
gh auth login

# Non-interactive (for automation/CI)
echo "$GH_TOKEN" | gh auth login --with-token

# Check status
gh auth status --hostname github.com --active

# Refresh scopes (e.g., for Projects)
gh auth refresh -s project

# Setup git credential helper (enables password-less git push/pull)
gh auth setup-git
```

#### Environment Variables for Auth

| Variable | Purpose |
|----------|---------|
| `GH_TOKEN` / `GITHUB_TOKEN` | Auth token (takes precedence over stored credentials) |
| `GH_ENTERPRISE_TOKEN` | Token for GitHub Enterprise Server |
| `GH_HOST` | Default GitHub host |
| `GH_REPO` | Default repository (avoids `-R` flag) |
| `GH_PROMPT_DISABLED=1` | Disable interactive prompts (critical for agents) |

### Configuration

```bash
# Set preferred editor
gh config set editor "code --wait"

# Set git protocol (https or ssh)
gh config set git_protocol ssh

# Disable prompts globally
gh config set prompt disabled
```

---

## 2. Command Reference

### Repository Operations (`gh repo`)

```bash
# Clone (auto-sets up remote)
gh repo clone OWNER/REPO

# Create new repository
gh repo create my-project --public --clone

# Fork and clone in one step
gh repo fork OWNER/REPO --clone

# View repository info
gh repo view OWNER/REPO --json nameWithOwner,url,defaultBranchRef

# Sync fork with upstream
gh repo sync
```

### Issue Management (`gh issue`)

```bash
# List with filters
gh issue list --state open --label bug --assignee "@me"

# Create (non-interactive)
gh issue create --title "Bug title" --body "Description" --label bug

# View details
gh issue view 123 --json number,title,state,body,comments

# Edit
gh issue edit 123 --add-label "urgent" --add-assignee "@me"

# Comment
gh issue comment 123 --body "Investigating..."

# Close with reason
gh issue close 123 --reason completed --comment "Fixed in #456"

# Create branch for issue
gh issue develop 123 --checkout
```

### Pull Request Workflow (`gh pr`)

```bash
# Create PR (interactive or auto-fill from commits)
gh pr create --fill
gh pr create --title "Title" --body "Description" --base main --head feature-branch

# List with status
gh pr list --state open --json number,title,reviewDecision,statusCheckRollup

# Checkout PR branch locally
gh pr checkout 456

# View diff
gh pr diff 456

# Review
gh pr review 456 --approve
gh pr review 456 --request-changes --body "Needs tests"
gh pr review 456 --comment --body "General feedback"

# Check CI status
gh pr checks 456
gh pr checks 456 --watch  # Block until complete

# Merge options
gh pr merge 456 --merge                    # Merge commit
gh pr merge 456 --squash --delete-branch   # Squash and delete branch
gh pr merge 456 --auto --squash            # Auto-merge when checks pass
```

### GitHub Actions (`gh run` / `gh workflow`)

```bash
# List workflow runs
gh run list --branch main --limit 5
gh run list --workflow "CI" --status failure

# View run details
gh run view 12345
gh run view 12345 --exit-status  # Non-zero exit if failed

# Stream/download logs
gh run view 12345 --log
gh run view 12345 --log-failed  # Only failed job logs

# Watch run until completion
gh run watch 12345 --exit-status

# Rerun
gh run rerun 12345          # All jobs
gh run rerun 12345 --failed # Only failed jobs

# Download artifacts
gh run download 12345
gh run download 12345 --name "test-results"

# Trigger workflow manually
gh workflow run "CI" --ref main
```

### Release Management (`gh release`)

```bash
# List releases
gh release list --limit 10

# Create with auto-generated notes
gh release create v1.2.3 --generate-notes

# Create with specific notes
gh release create v1.2.3 --notes "Release notes here"

# Upload assets
gh release upload v1.2.3 ./build/*.zip

# Download assets
gh release download v1.2.3
gh release download v1.2.3 --pattern "*.tar.gz"
```

### Gists (`gh gist`)

```bash
# Create
gh gist create file.txt
gh gist create file.txt --public --desc "Description"

# List
gh gist list

# View
gh gist view GIST_ID
```

### SSH & Secrets

```bash
# Add SSH key to GitHub
gh ssh-key add ~/.ssh/id_ed25519.pub --title "Work laptop"

# Set repository secret for Actions
gh secret set SECRET_NAME < secret.txt
gh secret set SECRET_NAME --body "value"

# Set organization secret
gh secret set SECRET_NAME --org myorg

# List secrets
gh secret list
```

---

## 3. Advanced Features

### Direct API Access (`gh api`)

Access any GitHub API endpoint:

```bash
# REST API
gh api repos/{owner}/{repo}/releases
gh api /user

# GraphQL
gh api graphql -f query='query { viewer { login } }'

# With pagination
gh api repos/{owner}/{repo}/issues --paginate

# POST/PATCH/DELETE
gh api repos/{owner}/{repo}/issues -f title="New issue" -f body="Description"
gh api repos/{owner}/{repo}/issues/123 -X PATCH -f state="closed"
```

### JSON Output & jq Integration

Most commands support structured output:

```bash
# Get specific fields as JSON
gh pr list --json number,title,url

# Filter with built-in jq
gh pr list --json number,title --jq '.[] | select(.title | contains("bug"))'

# Complex queries
gh issue list --json number,labels --jq '[.[] | select(.labels | any(.name == "bug"))]'

# Discover available fields
gh pr view 123 --json  # Lists all available fields
```

### Extensions

Extend gh with community or custom commands:

```bash
# Browse available extensions
gh extension browse

# Install extension
gh extension install owner/gh-extension-name

# Popular extensions
gh extension install dlvhdr/gh-dash        # TUI dashboard
gh extension install mislav/gh-branch      # Branch management
gh extension install vilmibm/gh-screensaver

# Create your own
gh extension create my-extension
```

### Aliases

Create custom shortcuts:

```bash
# Simple alias
gh alias set pv 'pr view'

# With arguments
gh alias set co 'pr checkout'

# Shell command
gh alias set --shell igrep 'gh issue list | grep'

# List aliases
gh alias list
```

---

## 4. Comparison: gh CLI vs GitHub MCP Server

| Aspect | gh CLI | GitHub MCP Server |
|--------|--------|-------------------|
| **Setup** | Single binary + auth | Docker container + MCP config |
| **Best for** | Deterministic actions, scripts, CI | AI agent context gathering |
| **Interface** | Command line | MCP protocol (for AI agents) |
| **Use case** | "Create this PR", "Merge that" | "Understand this repo", "Browse issues" |
| **Auth** | OAuth or PAT | PAT via environment |
| **Advantages** | Simple, scriptable, pre-installed in CI | Rich context for LLMs, tool discovery |

**Recommendation for Rebel**:
- Use `gh` for explicit, action-oriented tasks (create issue, merge PR, check CI)
- Consider GitHub MCP when the agent needs deep repo exploration or multi-step reasoning about GitHub state

**GitHub MCP Server setup** (if needed):
```bash
# Requires Docker
docker pull ghcr.io/modelcontextprotocol/github
# Configure in mcp.json with GITHUB_PERSONAL_ACCESS_TOKEN
```

---

## 5. Best Practices

### Security
- Use fine-grained PATs when possible (narrower scope)
- Never pass secrets as command arguments (visible in shell history)
- Use `gh secret set < file` instead of `--body`
- Regularly run `gh auth status` to verify credentials

### Automation/Scripting
- Always use `--json` output for parsing
- Set `GH_PROMPT_DISABLED=1` to prevent hangs
- Use `-R OWNER/REPO` explicitly for reliability
- Set `NO_COLOR=1` when parsing logs

### CI/CD Integration
- `gh` is pre-installed on GitHub Actions runners
- Use `${{ github.token }}` or `GITHUB_TOKEN` env var
- Common patterns: auto-release on tag, comment on PR failure, create issues from test results

### Draft Workflow
```bash
# Start with draft PR to signal WIP
gh pr create --draft --title "WIP: Feature X"

# Convert to ready when done
gh pr ready
```

---

## 6. Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Command hangs | Set `GH_PROMPT_DISABLED=1` and provide all required flags |
| "Not found" errors | Check auth: `gh auth status`, verify repo access |
| Rate limiting | Check: `gh api rate_limit --jq '.resources.core'` |
| `gh run watch` fails with fine-grained PAT | Use classic PAT (fine-grained can't grant `checks:read`) |
| Auth status --json exits 0 on failure | Don't use `--json` when checking auth exit codes |

### Debug Mode

```bash
# Full debug output
GH_DEBUG=1 gh pr list

# API-only debug
GH_DEBUG=api gh api /user
```

### Search Queries Starting with `-`

```bash
# Use -- separator
gh search issues -- "repo:owner/repo -label:wontfix"
```

---

## 7. Recent Changes (2024-2025)

- **Copilot CLI**: The `gh-copilot` extension is being deprecated in favor of standalone GitHub Copilot CLI
- **Projects Classic**: Deprecated - use new Projects (Memex) instead
- **Attestations**: New `gh attestation` commands for supply chain security
- **JSON standardization**: Continued improvements to `--json` output consistency
