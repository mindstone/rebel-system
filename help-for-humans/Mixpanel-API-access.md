---
description: "Legacy guide for querying Mixpanel via direct API. For agent-driven access, prefer the Mixpanel connector in Settings → Connectors."
last_updated: "2026-05-15"
---

> **For agent-driven access, use the Mixpanel connector** in **Settings → Connectors → Mixpanel** (see [connectors/mixpanel.md](./connectors/mixpanel.md)). The connector wraps the same APIs documented here with structured tools, safety checks, response capping, and proper credential handling. This Python-script pattern is retained for scripting / batch / one-off scenarios where the connector isn't a fit.
>
> **Env var naming differs:** the connector uses `MIXPANEL_USERNAME` (singular); the legacy script below uses `MIXPANEL_USER`. The variables hold the same value (the Service Account username) — they're just named differently.
>
> Note: PostHog (a separate connector) is Rebel's analytics platform for Rebel's *own* product analytics. Mixpanel is for *internal product* analytics — a distinct concern. Both connectors can coexist.

[AGENT USE]
Use this when an LLM needs to retrieve Mixpanel data (events only) in a read-only, region-aware way. Uses direct API calls for reliable EU/US region support. **For agent-driven access, prefer the Mixpanel connector at Settings → Connectors.**

[PERSONA]
You are a careful data retriever who must not mutate Mixpanel data. You optimise for correctness, minimal scope, and privacy.

[GOAL]
Fetch Mixpanel events (read-only) reliably, including per-user lookups and last-N recent events, with EU/US region support and safe secret handling.

[CONTEXT]
- Some orgs use EU residency. EU export host is `https://data-eu.mixpanel.com`; US is `https://data.mixpanel.com`.
- Service accounts often require `project_id` for Export API calls.
- The Export API returns newline-delimited JSON (one event per line). Keep date windows narrow where possible.

[PROCESS]
1) Prerequisites
   - Service account with read permissions for the target project
   - Project ID (e.g. from Mixpanel UI → Project Settings)
   - Region (EU or US)

2) Secrets setup (follow secrets-and-passwords)
   - Recommended: local environment variables or `.secrets/.env` (excluded from Drive sync) for low-risk keys
   - Define:
     - `MIXPANEL_USER` → service account username
     - `MIXPANEL_SECRET` → service account secret
     - `MIXPANEL_PROJECT_ID` → project id (string)
     - `MIXPANEL_REGION` → `EU` or `US`

   Example `.secrets/.env` (local only):
   ```bash
   MIXPANEL_USER="your_service_account_username"
   MIXPANEL_SECRET="your_service_account_secret"
   MIXPANEL_PROJECT_ID="1234567"
   MIXPANEL_REGION=EU
   ```

3) Region host selection
   - If `MIXPANEL_REGION=EU`: base export host is `https://data-eu.mixpanel.com`
   - Else (US): `https://data.mixpanel.com`

4) Fetch last N events for a user by email
   - Choose a tight date range to reduce payload (e.g. last 90–180 days)
   - Filter supports either `properties["$email"]` or `properties["email"]`

   Example (bash + Python) that prints last 10 events with full properties, deduped by timestamp:
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail

   : "${MIXPANEL_USER?}"
   : "${MIXPANEL_SECRET?}"
   : "${MIXPANEL_PROJECT_ID?}"
   : "${MIXPANEL_REGION?}"

   if [ "$MIXPANEL_REGION" = "EU" ]; then
     HOST="https://data-eu.mixpanel.com"
   else
     HOST="https://data.mixpanel.com"
   fi

   FROM_DATE="2025-05-01"   # adjust
   TO_DATE="2025-11-02"     # adjust
   EMAIL="user@example.com" # target

   TMPFILE=$(mktemp)
   curl -s -u "$MIXPANEL_USER:$MIXPANEL_SECRET" "$HOST/api/2.0/export" \
     --get \
     --data-urlencode "project_id=$MIXPANEL_PROJECT_ID" \
     --data-urlencode "from_date=$FROM_DATE" \
     --data-urlencode "to_date=$TO_DATE" \
     --data-urlencode "where=(properties[\"$email\"] == \"$EMAIL\") or (properties[\"email\"] == \"$EMAIL\")" \
     > "$TMPFILE"

   python3 - "$TMPFILE" <<'PY'
import sys, json
from datetime import datetime, timezone

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    lines = [ln.strip() for ln in f if ln.strip()]

events = []
for ln in lines:
    if not ln.startswith('{'):
        continue
    try:
        ev = json.loads(ln)
    except Exception:
        continue
    t = ev.get('properties', {}).get('time') or ev.get('time')
    if isinstance(t, (int, float)) and t > 1e12:
        t = int(t/1000)
    if isinstance(t, (int, float)):
        ev['_time'] = int(t)
        events.append(ev)

events.sort(key=lambda e: e['_time'], reverse=True)

# dedupe by timestamp, then take last 10
seen = set()
deduped = []
for ev in events:
    if ev['_time'] in seen:
        continue
    seen.add(ev['_time'])
    deduped.append(ev)
    if len(deduped) == 10:
        break

def fmt(ev):
    iso = datetime.fromtimestamp(ev['_time'], tz=timezone.utc).isoformat()
    return {
        'event': ev.get('event'),
        'distinct_id': ev.get('properties', {}).get('distinct_id') or ev.get('distinct_id'),
        'email': ev.get('properties', {}).get('$email') or ev.get('properties', {}).get('email'),
        'time_epoch': ev['_time'],
        'time_iso': iso,
        'properties': ev.get('properties', {}),
    }

print(json.dumps([fmt(e) for e in deduped], ensure_ascii=False))
PY
   ```

5) Fetch events by distinct_id (alternative)
   - If you know the `distinct_id`, filter by `properties["distinct_id"] == "..."`
   - Or use a combined OR clause for both email and distinct_id

6) Safety and privacy
   - Never echo secrets into logs; reference via environment variables
   - Keep `.secrets/.env` local-only and excluded from Drive sync per Secrets policy
   - Do not commit secrets to any repo; avoid pasting in shared docs

7) Troubleshooting
   - 401/403: verify credentials, project access, and that `project_id` is provided
   - 400s: check date format (YYYY-MM-DD), region host, and `where` syntax
   - Empty results: widen date range; test alternate email key (`$email` vs `email`)
   - Large payloads: narrow date window or add additional filters

[IMPORTANT]
- This skill is read-only. Do not use write/import endpoints here.
- Prefer Export API for reliable EU access. Some analytics endpoints may default to US hosts.
- Region awareness is mandatory: EU → `data-eu.mixpanel.com`, US → `data.mixpanel.com`.

[SEE ALSO]
- [secrets-and-passwords.md](secrets-and-passwords.md) for secret handling
- Mixpanel Export API docs

