---
description: "Connect Mixpanel so Rebel can answer questions about product analytics — user events, cohorts, retention, funnels, and saved insights"
---

# Mixpanel

Connect Mixpanel so Rebel can answer questions about your product analytics — what individual users did, how cohorts retain, how funnels convert, what your saved insights say — without you logging into the Mixpanel dashboard.

Rebel talks to Mixpanel via its **Query and Export APIs** using Service Account credentials. **Read-only.** Nothing in your Mixpanel project is created, modified, or deleted.


## What You Can Do

- **Per-user event lookup** — "what did `alice@example.com` do last week?"
- **Ad-hoc event queries** — filter by event name, date, or property values (top-level AND filters)
- **Schema discovery** — list event names and the distinct values seen for any property
- **Cohorts** — list saved cohorts in the project
- **Retention** — "of users who signed up in May, how many came back in week 2?"
- **Funnels** — run a saved funnel for any date range and see overall + per-step conversion
- **Saved insights** — list bookmarked reports (and find a `funnel_id` to query)
- **User profiles** — fetch a Mixpanel People profile by email or distinct_id


## Setup

1. In Rebel: **Settings → Connectors → Mixpanel** → select your **region** (US or EU)
2. Open Mixpanel → **Project Settings** → **Service Accounts** → click **+ Add Service Account**
3. Name it `Mindstone Rebel`, choose the **Consumer** role (read-only), and **Create**
4. Copy the **Username** and **Secret**
5. Grab your **Project ID** from the same Project Settings page (numeric value in the URL or General tab)
6. Paste **Project ID**, **Username**, and **Secret** into Rebel

That's it. Service Account credentials are stable across user offboarding, unlike personal API tokens.

**Which region am I on?** US lives at `mixpanel.com`; EU at `eu.mixpanel.com`.


## Example Questions

- "What events did alice@example.com fire in the last 30 days?"
- "How many distinct users signed up between May 1 and May 15?"
- "Show me the activation funnel for last quarter"
- "What's the week-2 retention for our March signup cohort?"
- "List the most-viewed saved reports in our Mixpanel project"
- "Pull alice@example.com's Mixpanel profile"
- "What country codes have we seen on Purchase events?"


## A Few Honest Caveats

- **Dates use the project's local timezone** for raw event queries (the Export API's quirk, not ours). YYYY-MM-DD format.
- **Windows are capped at 90 days** for `mixpanel_query_events`. Wider windows return a structured suggestion you can narrow into.
- **Responses default to a summary** — top-line counts, top events, first/last seen. Ask Rebel to "show me the full event list" when you want the underlying data.
- **Event payloads include PII** by design — emails, names, IPs — same access you have in Mixpanel. URLs with auth tokens (`?token=…`, `?session=…`, etc.) are redacted before they reach Rebel.
- **No write access.** Rebel cannot create cohorts, import events, or edit profiles. If you need that, do it in Mixpanel directly.


## Troubleshooting

- **"Mixpanel credentials are not configured"** — fill in all four fields (region, project ID, username, secret) under Settings → Connectors → Mixpanel.
- **"401 unauthorized"** — username or secret is wrong. Regenerate the Service Account in Mixpanel → Project Settings → Service Accounts and re-paste.
- **"403 forbidden"** — the project ID is wrong, or the Service Account doesn't have access to that project. Check both in Project Settings.
- **"Rate limited"** with a long retry — Mixpanel's Query API allows 60 requests per hour. Wait or narrow the date range.
- **"Window too wide"** — narrow `mixpanel_query_events` to ≤ 90 days.
- **"No matching events"** — different from an error. Either the user isn't in Mixpanel, or the date range has no events.


## See Also

- [Mixpanel Service Accounts documentation](https://developer.mixpanel.com/reference/service-accounts)
- The older [Python-script approach](../Mixpanel-API-access.md) for when you'd rather script your own queries.
