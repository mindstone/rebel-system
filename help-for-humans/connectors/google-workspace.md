---
description: "Connect Google Workspace for Gmail, Calendar, Drive, Docs, Sheets, Slides, Contacts, and Forms"
last_updated: "2026-05-19"
---

# Google Workspace

Access your Google suite: read and send emails, manage calendar events, search Drive files, work with Docs, Sheets, and Slides, and review Google Forms.


## What You Can Do

- **Gmail**: Search inbox, read and send emails, manage drafts
- **Calendar**: View and create events, check availability, respond to invites
- **Drive**: Search and access files across your Drive
- **Docs/Sheets/Slides**: Read and reference document content
- **Contacts**: Look up people in your organization
- **Forms**: Read forms and review responses


## What Makes This Different

- **All 8 services in one place**: Gmail, Calendar, Drive, Docs, Sheets, Slides, Contacts, and Forms — including Contacts and Forms, which many alternatives skip
- **Simple setup**: Connect once through Rebel's settings, no Google Cloud project or local credential files needed
- **Multiple accounts**: Add personal and work accounts side by side
- **Direct calendar sync**: Calendar events sync directly via API for faster, more reliable scheduling — no MCP round-trip needed
- **Open connector package**: The Google Workspace connector now ships from Rebel's open connector package, which makes fixes easier to audit and ship. Paperwork, but useful paperwork.

Most community Google integrations require creating your own Google Cloud project, configuring credentials, and running a separate authorization server. Rebel handles this for you.

**What we don't cover**: Chat, Tasks, or Google Search. Some community servers include these.


## Setup

1. Open **Settings → Connectors**
2. Find **Google Workspace** and click **Set up with Rebel**
3. Sign in with your Google account
4. Authorize Rebel to access your Google services

> **Enterprise accounts**: Some organizations require admin approval before you can connect third-party apps. Check with your IT team if authorization fails.


## Multiple Accounts

Connect additional Google accounts (personal + work, or multiple workspaces) by clicking **Set up with Rebel** again.


## Tips

- **Email search**: Use Gmail syntax: `from:alice`, `subject:invoice`, `has:attachment`, `newer_than:7d`
- **Calendar context**: Rebel can see your calendar to help with scheduling and meeting prep. Rebel detects timezone differences between you, your calendar events, and your device — so times are always shown correctly, even when you're travelling or scheduling across zones
- **Drive access**: Searches files you own or have access to


## Local File Sync Alternative

For offline access or IDE integration, you can also use Google Drive Desktop to sync files locally. See [Google-Drive](library://rebel-system/help-for-humans/google-drive-desktop-local-sync.md) for setup.


## See Also

- [Google-Drive](library://rebel-system/help-for-humans/google-drive-desktop-local-sync.md) — local file sync with Google Drive Desktop
- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
