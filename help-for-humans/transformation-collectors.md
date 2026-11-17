---
description: "What the two Transformation Collector models collect, where the data goes, and which controls and visibility rules apply"
last_updated: "2026-11-17"
---

# Transformation Collectors

Transformation Collector is separate from Rebel's own usage analytics and company reporting. Your organisation may use one of two collection models. The difference matters: one reads supported session files on your computer, while the other runs in your company's environment.

## Transformation Collector desktop app

If your organisation provides the desktop app, it asks for your consent before reading supported local AI-session files. It uploads identifiable, per-session usage metrics, including tool and model identifiers, timing, counts, costs, and one-way hashes of project identifiers. A hash is a consistent label, not proof that the underlying project or person is anonymous.

### What we send

AI enrichment uses AI to classify the activity. AI enrichment is off by default; it runs only when you enable it, provide an Anthropic API key or company enrichment server, and consent.

With AI enrichment on, your employer's dashboard receives fixed-vocabulary work-type labels, not conversation text. Enrichment sends capped conversation excerpts to Anthropic under your own account or key, or to a company-run analysis server if your organisation configured one. A separate opt-in can send a short, scrubbed description of the kind of work you do; it is off by default.

### Pause

Use **Pause** when you want the desktop app to stop collecting temporarily. It can resume later when you choose.

### Opt out & delete

Use **Opt out & delete** to stop collection and request removal of the data already sent. If the collector cannot reach its service, the deletion request remains pending and can be completed when it reconnects.

## Company-hosted collector

If your company uses a hosted collector, its telemetry and conversation context are processed in your company's environment. Configured AI analysis can send conversation text to the provider your company chose. Context may be stored encrypted, but company IT with the necessary access can read it.

The normal dashboard report contains per-person daily totals and activity identifiers, such as counts, models, tools, costs, and estimated time—not the raw conversation transcript. If success stories are enabled, filtered story prose can also be sent to Mindstone; this is a company-configured flow, not an explicit personal approval before every story is shared.

Visibility depends on role. Leaders can see named usage. Admin-only access manages people and settings; it does not automatically grant named usage. Champions see only their assigned teams or cohorts.

See [What data can leave Rebel](rebel://library/rebel-system%2Fhelp-for-humans%2Fwhat-data-can-leave-rebel.md) for Rebel's own data flows and [Teams and admin controls](rebel://library/rebel-system%2Fhelp-for-humans%2Fteams-and-admin-controls.md) for company reporting and roles.
