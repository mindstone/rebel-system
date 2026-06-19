---
description: "Connect Salesforce CRM to search accounts, contacts, opportunities, and leads"
last_updated: "2026-05-11"
---

# Salesforce

Access your Salesforce CRM: search accounts, contacts, opportunities, and leads. Update records and run queries.


## What You Can Do

- **Search** accounts, contacts, opportunities, and leads
- **Query** data using natural language (converted to SOQL)
- **Update** existing records
- **Read** detailed record information


## Setup

Salesforce requires you to create an External Client App in your Salesforce org first, then enter the credentials in Rebel.

### 1. Create an External Client App in Salesforce

1. Log in to Salesforce, go to **Setup** (gear icon)
2. Search for **External Client App** in Quick Find, then open **External Client App Manager**
3. Click **Create New External Client App**
4. Enter a name (e.g. "Mindstone Rebel"), your email, and set **Distribution State** to **Local**
5. Under **API (Enable OAuth Settings)**, check **Enable OAuth**
6. Set the **Callback URL** to: `https://rebel-auth.mindstone.com/salesforce/callback`
7. Select OAuth Scopes: **Manage user data via APIs (api)** and **Perform requests at any time (refresh_token, offline_access)**
8. Click **Create**

### 2. Get your Consumer Key and Secret

1. Reopen your app from **Manage External Client Apps**
2. Go to the **Settings** tab → **OAuth Settings** → click **Consumer Key and Secret**
3. Copy both values

### 3. Set the refresh token policy

1. In the **Policies** tab, click **Edit**
2. Set **Refresh token is valid until revoked**
3. Click **Save**

### 4. Connect in Rebel

1. Open **Settings → Connectors**
2. Find **Salesforce** and enter your Consumer Key and Secret
3. Click **Set up with Rebel**
4. Sign in to your Salesforce account in the browser
5. Authorize Rebel to access your CRM

> **Sandbox accounts**: Rebel supports Salesforce sandboxes. Select the sandbox environment option during setup.

> **Permissions**: If you see "Insufficient Privileges" when viewing keys, your profile needs the "View all External Client Apps" permission. Non-admin users may need their admin to set the app's "Permitted Users" to "All users may self-authorize".


## Tips

- **Natural language queries**: Ask "show opportunities closing this quarter" or "find contacts at Acme"
- **Complex filters**: Rebel handles sophisticated queries naturally — just describe what you need
- **Sandbox testing**: Connect a sandbox instance to test workflows before running them against production


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
