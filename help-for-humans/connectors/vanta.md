---
description: "Connect Vanta to review compliance posture, vulnerabilities, tests, controls, vendors, and documents"
---

# Vanta

Connect Vanta so Rebel can answer questions about your compliance posture — vulnerabilities, test results, controls, people, vendors, documents, and compliance summaries — without you logging into the Vanta dashboard.

Rebel talks to Vanta via their **REST API** using OAuth (client credentials). Read-only questions stay read-only; write actions only happen when you explicitly ask Rebel to create or update something.


## What You Can Do

- **Vulnerability posture** — open vulns, severity breakdown, remediation status
- **Compliance tests** — passing, failing, disabled, filtered by framework (SOC2, ISO27001, HIPAA, etc.)
- **Controls** — control status and their mapped tests
- **People** — employees and contractors tracked for compliance
- **Compliance summary** — aggregate pass/fail rates by framework in one call
- **Vendors and documents** — review vendors, create or update vendor records, and work with documents


## Setup

1. In Rebel: **Settings → Connectors → Vanta**. If a region field appears, leave the default unless your setup already uses one — standard Vanta tenants all use the same API host.
2. Go to your Vanta dashboard → **Settings** → **Developer Console** → click **+ Create** → select **Manage Vanta**
3. Copy the **Client ID** and **Client Secret** and paste them into Rebel

Rebel automatically exchanges these credentials for a short-lived access token behind the scenes. Use a **Manage Vanta** app that can request all three permissions: `vanta-api.all:read vanta-api.all:write vanta-api.documents:upload`. The upload permission is separate because Vanta treats document uploads as their own thing. Naturally.

Vanta's dashboard may show regional URLs like `app.eu.vanta.com`, but the API connection uses Vanta's global API host. No regional hostname wrangling required, which is a mercy.


## Example Questions

- "What open vulnerabilities do I have?"
- "Show me failing compliance tests for SOC2"
- "Give me a compliance summary"
- "List all high-severity vulnerabilities"
- "Which vendors need review?"
- "Who are the active people in Vanta?"
- "Attach this SOC 2 report to a vendor"
- "Upload this evidence file to an existing Vanta document"


## Troubleshooting

- **"OAuth credentials are not configured"** — paste your Client ID and Client Secret in Settings → Connectors → Vanta
- **"Unauthorized" or "invalid credentials"** — regenerate the OAuth app at your Vanta dashboard → Settings → Developer Console
- **"Invalid scope"** — make sure the Vanta app is a **Manage Vanta** app that can request `vanta-api.all:read vanta-api.all:write vanta-api.documents:upload`
- **"Rate limited"** — Vanta allows 50 requests per minute. Rebel retries automatically. If it persists, wait a moment and try again
- **"Not found"** — double-check that the ID came from a Vanta list tool. Vanta IDs are opaque strings
- **Uploaded documents still need review** — Vanta saves API uploads as drafts. Submit the document in Vanta before auditors can see it


## See Also
