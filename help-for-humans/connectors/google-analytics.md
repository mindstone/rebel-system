---
description: "Connect Google Analytics 4 to ask Rebel questions about your traffic, conversions, and property setup"
---

# Google Analytics

Ask Rebel about your Google Analytics 4 properties: traffic, conversions, custom dimensions, and how each property is wired up.

## What You Can Do

- **Run reports** — sessions, users, revenue, by country, device, page, source, and so on
- **Realtime view** — what's happening on the site in the last 30 minutes
- **Schema discovery** — find the right metric or dimension by keyword instead of memorising GA4 apiNames
- **Property setup** — list custom dimensions/metrics, key events, data streams, BigQuery / Firebase / Google Ads links, retention settings
- **Change history** — recent created/updated/deleted events on a property

Everything is read-only — Rebel cannot edit your GA4 configuration.

## Setup

Google Analytics uses Application Default Credentials (ADC), which is the standard way Google tools authenticate locally. One-time setup:

1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
2. In a terminal, run:
   ```bash
   gcloud auth application-default login \
     --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform
   ```
3. The CLI prints the path it wrote credentials to — typically `~/.config/gcloud/application_default_credentials.json` on macOS / Linux, or `%APPDATA%\gcloud\application_default_credentials.json` on Windows.
4. In Rebel, open [Settings → Connectors](rebel://settings/tools), find **Google Analytics**, and click **Set up with Rebel**.
5. Paste the **absolute path** to the credentials file (Rebel does not expand `~` or `%APPDATA%` — provide the fully-resolved path).
6. Optionally enter a **default GA4 property ID** (digits only, e.g. `123456789`) so you don't have to repeat it on every question.

The Google account behind your credentials must have access to the GA4 property, and the **Google Analytics Admin API** and **Google Analytics Data API** must be enabled in the Cloud project attached to the credentials.

## Asking Rebel

Examples Rebel handles:

- "How many sessions came from organic search last week, by country?"
- "What's the bounce rate trend for the marketing site over the past 30 days?"
- "Show realtime active users on the product."
- "Which key events fired most on Tuesday?"
- "List custom dimensions on the production property."
- "Which BigQuery exports are configured?"

For large pulls (thousands of rows) Rebel will warn first and suggest a smaller summary unless you explicitly ask for the full dataset.

## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1) — what the underlying API can do
