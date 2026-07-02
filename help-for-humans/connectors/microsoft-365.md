---
description: "Connect Microsoft 365 for Outlook Mail, Calendar, OneDrive, Word, Teams, and SharePoint — including what to do when your sign-in expires"
last_updated: "2026-07-02"
---

# Microsoft 365

Access your Microsoft suite: email, calendar, files, Word documents, Teams messaging, and SharePoint — all from Rebel.


## What You Can Do

- **Outlook Mail**: Search inbox, read and send emails, manage folders and drafts
- **Outlook Calendar**: View and create events, check availability, respond to invites
- **OneDrive**: Search and access files, upload documents, manage sharing
- **Word**: Read, reference, and work with Word documents
- **Teams**: Read and send chats, view team channels, check your presence status
- **SharePoint**: Search and access SharePoint files and sites you already have permission to use


## What Makes This Different

- **Read and write**: Send emails, create events, upload files — not just read-only access
- **Service-by-service**: Enable only what you need — mail, calendar, files, Word, Teams, or SharePoint separately
- **Direct calendar sync**: Calendar events sync directly via API for faster, more reliable scheduling — no MCP round-trip needed
- **Open connector packages**: The Microsoft 365 connectors now run through Rebel's open connector packages, which makes the plumbing easier to inspect and fix. Office work, with fewer locked cupboards.

Some popular community Microsoft integrations are read-only or require complex admin setup. Rebel provides full read/write access for everyday workflows.

**What we don't cover**: Contacts, Tasks/Planner, tenant administration, or deep SharePoint administration beyond working with the files and sites your account can already access.


## Setup

1. Open **Settings → Connectors**
2. Find the Microsoft service you need (Outlook Mail, Calendar, OneDrive, Word, Teams, or SharePoint)
3. Click **Set up with Rebel**
4. Sign in with your Microsoft account
5. Authorize Rebel to access your data

All Microsoft services share a single sign-in — connecting any one authorizes the others. You can then choose which ones to enable.

> **Enterprise accounts**: Organizations may require admin approval before you can connect third-party apps. Check with your IT team if authorization fails.


## Enterprise Admin Consent (For IT Administrators)

If your organization uses Microsoft 365 with managed accounts, a tenant administrator can grant organization-wide consent for Rebel. This allows all users in your organization to connect their Microsoft accounts without individual approval.

**How admin consent works:**

1. Admin visits **https://rebel.mindstone.com/microsoft/admin-consent**
2. Click **"Grant Admin Consent"** button
3. Sign in with admin credentials and approve the requested permissions
4. After approving, you'll be redirected back with success/error status

This is particularly useful for pilot onboarding when multiple users need to connect Microsoft tools (Outlook, Teams, OneDrive, Calendar).

**When to use admin consent:**
- Onboarding multiple users at once (e.g., company-wide pilot programs)
- Your organization requires admin pre-approval for third-party apps
- Individual users are getting "Admin approval required" errors when connecting

For questions about required permissions or security review, contact Mindstone support.


## Multiple Accounts

Connect additional Microsoft accounts by clicking **Set up with Rebel** again.


## If your sign-in expires

When your Microsoft sign-in genuinely expires, Rebel flags it — currently through your Calendar connection — with a **needs reconnecting** prompt and a **Reconnect** button in [Settings → Connectors](rebel://settings/tools).

Because all Microsoft services share one sign-in, reconnecting once restores **Mail, Calendar, Files, Teams, and SharePoint** together — you don't need to fix each one separately.

For the general reconnect flow (what you'll see, the expiry toast, and other connectors), see [Troubleshooting — Sign-in expired](library://rebel-system/help-for-humans/troubleshooting.md#sign-in-expired--needs-reconnecting).

## Tips

- **Email search**: Search your inbox with natural language or Outlook-style filters
- **Calendar context**: Rebel can see your schedule to help with meeting prep and availability. Rebel detects timezone differences between you, your calendar events, and your device — so times are always shown correctly, even when you're travelling or scheduling across zones
- **Teams chats**: Read recent conversations and send messages directly from Rebel


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [Troubleshooting](library://rebel-system/help-for-humans/troubleshooting.md) — sign-in expired and other connector issues
