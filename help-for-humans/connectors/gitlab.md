---
description: "Connect GitLab to manage repositories, issues, merge requests, and CI/CD pipelines"
---

# GitLab

Access your GitLab projects: browse repos, manage issues and merge requests, trigger pipelines, search code, and view releases. Supports self-hosted GitLab instances.


## What You Can Do

- **Repositories**: Browse projects, search code, view files and wikis
- **Issues**: Create, update, and search issues with labels and milestones
- **Merge requests**: Review MRs, view diffs, and manage approvals
- **CI/CD**: View pipeline status, trigger builds, and check job logs
- **Releases**: List and view release details


## Setup

1. Open **Settings → Connectors**
2. Find **GitLab** and click **Set up**
3. Click **Open GitLab** to go to Personal Access Tokens
4. Click **Add new token** and name it (e.g., "Rebel AI")
5. Select scopes: `api` (full access) or `read_api` (read-only)
6. Click **Create personal access token** and copy it immediately
7. Paste the token back in Rebel

> **Self-hosted GitLab**: Change the API URL field to your instance (e.g., `https://gitlab.yourcompany.com`).


## Tips

- **Search code**: "Find all files referencing the payments API in our GitLab"
- **MR review**: "Show me open merge requests on project X" or "Summarise the changes in MR !42"
- **Pipeline status**: "What's the status of the latest pipeline on main?"
- **Issue management**: "Create a GitLab issue for the login bug in project Y"


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors
