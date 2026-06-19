---
description: "Connect ProfitSage to ask hotel performance questions across properties, labor, P&L, and sales pace"
---

# ProfitSage

Connect ProfitSage so Rebel can answer questions about your hotels — daily labor, P&L, ledger batches, sales bookings, and pace — without you opening the ProfitSage UI.

Rebel talks to ProfitSage via the **ProfitSword Data Portal v3** API — the same spec every ProfitSage tenant uses — so any tenant with Data Portal v3 enabled can connect.


## What You Can Do

- **List properties** and pick one for deeper analysis
- **Daily labor** — hours and amounts by site, date, and employee
- **Daily & monthly P&L** — revenue, labor, expenses for a data set (e.g. Primary Forecast)
- **GL ledger batches** for a site, date range, and status
- **Sales bookings** and **sales pace** (events, rooms, transient) by property
- All read-only — Rebel never changes anything in ProfitSage


## Setup

1. Open **Settings → Connectors**
2. Find **ProfitSage** and click **Set up**
3. Enter three things:
   - **Subdomain** — the part before `.profitsage.net` in your ProfitSage URL (e.g. `acmehotels` for `https://acmehotels.profitsage.net`)
   - **API username** — ask your ProfitSage administrator to provision an **API service account**, not a personal login
   - **API password** — paired with the API username

Your tenant must have **Data Portal v3** enabled. If you're not sure, ask your ProfitSage administrator. ProfitSage issues a 1-hour token when Rebel first calls the API; Rebel refreshes it automatically.


## Tips

- **Cross-property rollups**: "Show me RevPAR across all Embassy Suites last month" — Rebel will list your sites, pick the matching ones, and aggregate.
- **Budget variance**: "Which properties missed labor budget last week?"
- **Group pace**: "What's the group pace for Q3 at site 100 as of today?"
- **Narrow the range if a report is slow** — daily P&L across many properties for a long range can be heavy.


## Troubleshooting

- **"credentials missing" error** — the subdomain, username, or password is empty. Re-enter them in Settings → Connectors → ProfitSage.
- **"invalid subdomain" error** — use only the label (e.g. `acmehotels`), not the full URL or anything with dots, slashes, or spaces.
- **401 / "rejected the request"** — the service account password may have changed or been disabled. Ask your ProfitSage administrator to verify the account, then reconnect in Settings.


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
