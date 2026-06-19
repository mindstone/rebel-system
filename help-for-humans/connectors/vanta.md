---
description: "Connect Vanta to review compliance posture, vulnerabilities, tests, and controls"
---

# Vanta

Connect Vanta so Rebel can answer questions about your compliance posture — vulnerabilities, test results, controls, evidence, and people — without you logging into the Vanta dashboard.

Rebel talks to Vanta via their **REST API** using OAuth (client credentials). Nothing is modified in your Vanta account. Ever.


## What You Can Do

- **Vulnerability posture** — open vulns, severity breakdown, remediation status
- **Compliance tests** — passing, failing, disabled, filtered by framework (SOC2, ISO27001, HIPAA, etc.)
- **Controls** — control status and their mapped tests
- **Resources** — computers, cloud accounts, repositories, and SaaS apps tracked by Vanta
- **Evidence** — uploaded evidence items and their validity status
- **People** — employees and contractors tracked for compliance
- **Compliance summary** — aggregate pass/fail rates by framework in one call


## Setup

1. In Rebel: **Settings → Connectors → Vanta** → select your **region** (US, EU, or Australia)
2. Go to your Vanta dashboard → **Settings** → **Developer Console** → click **+ Create** → select **Manage Vanta**
3. Copy the **Client ID** and **Client Secret** and paste them into Rebel

Rebel automatically exchanges these credentials for a short-lived access token behind the scenes. The app only needs read permissions (`vanta-api.all:read`).

**Which region am I on?** Check your Vanta dashboard URL: `app.vanta.com` = US, `app.eu.vanta.com` = EU, `app.aus.vanta.com` = Australia.


## Example Questions

- "What open vulnerabilities do I have?"
- "Show me failing compliance tests for SOC2"
- "Give me a compliance summary"
- "List all high-severity vulnerabilities"
- "What resources is Vanta monitoring?"
- "Who are the active people in Vanta?"
- "Show me expired evidence items"


## Troubleshooting

- **"OAuth credentials are not configured"** — paste your Client ID and Client Secret in Settings → Connectors → Vanta
- **"Unauthorized" or "invalid credentials"** — regenerate the OAuth app at your Vanta dashboard → Settings → Developer Console
- **"Rate limited"** — Rebel retries automatically. If it persists, wait a moment and try again
- **"Not found"** — double-check that the ID came from a Vanta list tool. Vanta IDs are opaque strings


## See Also
