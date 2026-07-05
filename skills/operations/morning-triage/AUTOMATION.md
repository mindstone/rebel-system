---
name: morning-triage
description: "Morning triage — scans email/calendar/Slack to surface new actionable items, enriches existing items with metadata, and marks completions."
---

# Morning Triage

You are running a scheduled morning triage for the user's Actions. Your job is to make the Today view useful by: creating new items from overnight activity, enriching existing items with proper metadata, and cleaning up completed items.

Ultrathink.

## Steps

### 1. Load context
- Read `Chief-of-Staff/README.md` to learn the user's name, email, and connected tools
- Get today's calendar events using available calendar tools
- Call `rebel_inbox_list` to get all active action items
- List recent emails (received since yesterday, or since last run) using available email tools
- Search Microsoft Teams for mentions and questions (when Teams is connected)

### 2. Surface new actionable items from overnight activity

Scan what came in since the last run and create action items for things that need the user's attention:

a. **Emails needing a reply** — received from a real person (not automated/newsletter), no reply sent yet, seems to expect a response:
   - Create item: "Reply to [person] about [subject]"
   - Set `category: 'follow-up'`, `dueBy` to 48h from now
   - Include email reference (threadId, messageId) in `references`

b. **Slack threads needing response** — threads where the user was mentioned or asked a question, no response yet:
   - Create item: "Respond to [person] in [channel] about [topic]"
   - Set `category: 'follow-up'`, `dueBy` to 24h from now
   - Include a URL or workspace reference to the exact thread when available

c. **Teams messages needing response** — threads where the user was mentioned or asked a question, no response yet:
   - Create item: "Respond to [person] in Teams about [topic]"
   - Set `category: 'follow-up'`, `dueBy` to 24h from now
   - Include a URL or workspace reference to the exact chat/thread when available

d. **Document/Notion review items** — documents, pages, specs, criteria, or comments where the user personally needs to review, approve, comment, or decide:
   - Create item: "Review [document/topic] in [tool]"
   - Set `category: 'follow-up'`, `dueBy` only when a deadline exists or is inferable
   - Include a URL or workspace reference to the exact document/page/comment when available
   - Do NOT create the item if the source already shows the user approved/commented, the owner accepted the review, or someone else clearly handled the review

**Rules for creating items:**
- Only create items for things the user personally needs to act on
- Deduplicate against BOTH active and archived items:
  1. Check `rebel_inbox_list` results for items with similar titles or matching references
  2. Also call `rebel_inbox_query(archivedOnly: true, search: "<person or topic name>")` to check archived items
  3. For archived matches, verify it's the **same underlying signal** (same email thread, same meeting, same Slack/Teams thread, same document/page/comment) — not just the same person or topic. Recurring contacts and topics are expected; only skip if the specific actionable signal was already handled.
  4. Skip if a true duplicate is found in either active or archived items
- Always set `dueBy` or `relevantDate` so items land in the right temporal bucket
- Cap at 5 new items per run
- Always set `text` with 1-3 sentences of actionable context (who, when, what needs attention). Never set `text` to the same value as `title`.
- Set `source: { kind: 'automation', automationId: 'system-morning-triage', automationName: 'morning-triage' }`

### 3. Enrich existing items (oldest first, max 15 per run, skip items < 12h old)

For each existing item:

a. **Calendar match** — If the item relates to a meeting happening today:
   - If no `relevantDate`, set it to today
   - If no `dueBy` and the meeting hasn't happened yet, set `dueBy` to meeting start time

b. **Missing dueBy** — If a follow-up without `dueBy`:
   - If category is meeting-action, set `dueBy` to 48h after item creation

c. **Missing tags** — If no tags but the topic is clear, add 1-3 relevant tags

### 4. Check for completions (bounded, targeted searches only)

When archiving in this step, always pass `resolution` (see Rules) — `'completed'` when there's evidence it's done, `'stale'` when it's no longer relevant.

**Connector/user agnostic:** resolve Actions using the systems this user normally uses for that action type. Infer the likely system from exact references first, then source provenance, `Chief-of-Staff/README.md`, connected tool packages, recent source history, and scoped feedback examples. Do not assume Gmail, Slack, Notion, Linear, GitHub, or any single connector is present.

**Evidence route:** exact reference first; same source thread/page/task second; user's normal tool for that person/topic third; at most one targeted cross-system search last. If those are inconclusive, leave active.

Build a priority queue and check up to 15 completion candidates per run. Prioritise: (1) overdue or due-today items, (2) items with exact email/URL/workspace/ticket references and completion-prone titles ("reply/respond/follow up/check/confirm/review/comment/approve"), (3) oldest remaining items. Skip items less than 24 hours old unless they have a specific email-thread reference with reply evidence. This keeps connector cost bounded even when the Actions list is large, without letting obvious resolved items sit behind old vague backlog.

**Backlog sweep exception:** if the user explicitly asks for a first-time cleanup / backlog sweep / "go through all my Actions", process all active items once in batches using the same priority order and high-confidence rules. First produce a dry-run receipt with counts by outcome (resolved, stale/obsolete, leave active, needs user review) and connector work performed. Only mark items resolved/dismissed after the user authorises the specific cleanup result.

**Hard budget stop:** use the existing automation cadence only. Normal runs must stop after the item cap, 30 read-only connector calls total, or 2 minutes, whichever comes first. Do not start a new background resolver, crawl whole workspaces, fetch large document bodies, or run per-item LLM judging. Backlog sweeps are dry-run receipts in batches and require user authorisation before applying.

For email-action items ("reply to", "follow up with", "email X about"):
- If the item has an email reference with threadId/messageId, fetch that specific thread first
- If no thread reference exists, search sent mail for the specific person/company plus subject/topic keywords (last 7 days)
- If same-thread reply evidence or a high-confidence person+topic match is found, archive via `rebel_inbox_update` with `archived: true`, `resolution: 'completed'`, and an `evidenceNote` naming the reply evidence

For messaging/communication items ("respond to X in [channel/Teams]", "send X to Y", "share X with Y", "tell Y about X", "let Y know", "message Y", "ping Y", "forward X to Y", "notify Y", "ask Y about X", "loop in Y", "update Y on X", "check with X", "confirm with X"):
- Use `list_tool_packages()` to discover connected messaging tools (Slack, Microsoft Teams, etc.)
- If the item has a URL/workspace reference to a Slack/Teams thread, inspect that specific thread first
- Search the user's connected messaging platforms for recent messages (last 7 days) from the user mentioning the person or topic in the item title
- For communication-derived scheduling/follow-up items ("schedule/sync/call/meet/follow up with X"), use the originating communication system first, then the user's normal communication system for that person/topic. Archive when later same-thread, same-person, or same-topic evidence shows the sync/call happened, was scheduled, was cancelled, or is no longer needed. This applies to Slack, Teams, email, CRM comments, or any connected communication tool — do not hardcode one platform.
- For "check/confirm with" items, archive when the referenced thread or a targeted recent search shows an explicit answer, decision, confirmation, or "handled/done" update from the named person, the user, or another clearly responsible teammate. A mere topic mention is not enough.
- If same-thread, same-person, or same-topic evidence shows the sync/call happened or was scheduled, archive via `rebel_inbox_update` with `archived: true`, `resolution: 'completed'`, and an `evidenceNote` naming the completion message
- If that evidence shows the sync/call was cancelled or is no longer needed, archive via `rebel_inbox_update` with `archived: true`, `resolution: 'stale'`, and an `evidenceNote` naming the cancellation/no-longer-needed evidence
- Cap at 2 messaging searches per item to keep cost bounded

**Important:** Items created by this automation in step 2 (e.g., "Respond to [person] in [channel] about [topic]") must be checked here — match "respond to" items that mention a channel or "Teams" as messaging items, not email items.

For document/review items ("review X in Notion", "comment on X", "approve X", "check X doc", "review X criteria/proposal/spec"):
- If the item has a URL/workspace reference, inspect that exact document/page/comment first. Do not crawl unrelated documents.
- Archive when there is HIGH confidence evidence that the user approved/commented/edited, the user discussed or used the feedback in a later meeting/call, the requested reviewer resolved the comment, the document status changed to approved/final/done, or the source thread explicitly says the review was handled by someone else.
- Do NOT archive merely because the document exists, was updated, or contains the same topic keywords.
- Cap at 1 document lookup plus 1 targeted messaging search per item.
- The 24h minimum age guard applies.

For implementation/shipping/documentation items ("push X", "ship X", "release X", "deploy X", "merge X", "document X", "fix X", "implement X"):
- Check GitHub/Linear/Git evidence when available. Archive when a matching commit, merged PR, closed issue, or release note clearly covers the requested work.
- If a teammate owns/completed the work and the user has no remaining decision/action, archive as handled.
- Do NOT archive merely because related engineering work exists; the evidence must cover the requested action.

For meeting-prep items:
- Check calendar status and later availability signals.
- Archive/dismiss when the user declined, is out of office during the event, or explicitly said they will not attend.
- Do not ask the user to prep for a meeting they are not attending.

For system receipts and automation logs ("memory hygiene completed", "draft saved", "source capture complete", "cleanup receipt"):
- Dismiss/archive once recorded. These are audit trail entries, not Actions.

For delegated tasks ("Greg said he would check", "Harry is working on", "Josh will confirm"):
- Archive/dismiss unless the item clearly asks the user to follow up by a deadline.
- Other people's owned work should not stay in the user's active Actions.

For past meeting items (relevantDate past, meeting-action category):
- If meeting was 3+ days ago with no draft or clarifying question, archive

For items with Linear/GitHub/Asana references:
- Check tool status (closed/merged/completed → archive)

### 5. Summary
Log: N new items created, M items enriched, K items archived. Be brief.

## Rules
- **Only update/archive with HIGH confidence.** When in doubt, leave unchanged.
- **Use structured data, not the visual app UI.** Actions state must come from `rebel_inbox_list`, `rebel_inbox_query`, and `rebel_inbox_update`. Do not use `rebel_navigate_app`, `rebel_get_app_screenshot`, screenshot-capture skills, or any live UI inspection to understand Actions.
- **Do NOT archive user-request items** — the user explicitly added them.
- **Drafts/clarifying questions are a caution flag, not an absolute block.** Do not archive a pending draft just because it exists. However, if exact source/reference evidence or a targeted search shows the underlying open loop was already completed by the user or another responsible teammate, archive it. Example: an item drafted as "ask Josh whether Operators is feature-flagged" can resolve if Josh/product already answered that in the referenced thread.
- **Do NOT archive items less than 24 hours old.**
- **Prefer targeted email searches** over broad ones to minimize API usage and cost.
- **Cap at 15 existing items per enrichment run** to keep cost bounded.
- **Resolve from evidence, not vibes.** Do not archive because a related topic was mentioned; archive only when the evidence closes the user's open loop.
- **Backlog sweep receipts should be user-facing.** After an authorised backlog sweep, report: "Rebel found X Actions that were already handled and cleared them." Keep the receipt short; do not create a new Action for the receipt.
- **Every archive passes `resolution`.** Use `resolution: 'completed'` when there is evidence the task is genuinely done (reply sent, PR merged, issue closed, document finalised) — it lands in Completed, attributed to Rebel. Use `resolution: 'stale'` when the item is no longer relevant rather than done (past meeting, non-attendance, superseded, system receipts, delegated work) — it lands in the Auto-archived log the user reviews. Pass the evidence in `evidenceNote` (preferred) or `archiveReason`.
- **Every resolved/dismissed item needs evidence.** Add a short evidence note naming the connector/source and why it closes the loop. Receipts must include counts by outcome and connector work performed. Never hide uncertainty; uncertain items stay active or go to needs-user-review.
- **User-request items have the highest bar.** Never resolve explicit user-request items from indirect evidence unless exact-source evidence proves the user's requested outcome is complete, or the user authorises the cleanup result.
- **Do NOT create meeting prep items in this automation** — Source Capture owns meeting-prep creation (it queries the upcoming calendar and creates "Prep for [meeting]" items in Actions). Morning Triage only triages and enriches existing items; creating prep items here too would duplicate them.
