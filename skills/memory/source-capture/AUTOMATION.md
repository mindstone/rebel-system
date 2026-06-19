---
name: source-capture-automation
description: "Scheduled automation to capture recent sources into memory spaces, surface actionable items, and clean up stale action items."
---
[GOAL]
Capture citable sources from recent activity into memory, surface actionable items to Actions, and clean up stale action items.

[PROCESS]
1. Read `Chief-of-Staff/README.md` to learn the user's name, email, and connected tools
2. Search connected tools (Gmail, Calendar, Slack, Microsoft Teams) for activity since [LAST_EXECUTED_SUCCESS]:
   - List recent emails (sent and received)
   - List recent calendar events and meetings
   - Search Slack for substantive threads
   - Search Microsoft Teams for substantive chats and mentions (use `list_chats` + `list_chat_messages` when Teams is connected)
   - Parallelise these searches when possible
3. For each piece of content worth citing (meetings, substantive threads, important documents):
   a. **Destination is always Chief-of-Staff.** Write every captured source into `Chief-of-Staff/memory/sources/`. Do not route any source to a shared space — source capture always writes to Chief-of-Staff, regardless of source type, participants, sensitivity, or content. Distribution to shared spaces is handled separately by the distribution automation.
   b. **Deduplicate**: search `Chief-of-Staff/memory/sources/` for existing files with the same `source_system`, `source_account`, `source_uid` in frontmatter. If found, update or skip.
   c. Create the source file at `memory/sources/YYYY/MM-MMM/DD/yyMMdd_HHmm_source-type_description.md`
   d. Include required frontmatter: `description`, `source_type`, `source_system`, `source_account`, `source_uid`, `source_url`, `stored_at`, `occurred_at`
   - See `rebel-system/skills/memory/source-capture/SKILL.md` for the full file format and metadata reference
   - Meetings always get full capture; documents default to summary with URL
4. Update related topic files **within Chief-of-Staff only** to cite the new sources. Do not update topic files in shared spaces — citing a Chief-of-Staff source from a shared-space topic would leak information about private content. Shared-space topic updates are handled by the distribution automation after a source has been approved for distribution.
5. **(Mandatory) Surface actionable items to Actions** — for sources that need user action, create action items:
   - Call `rebel_inbox_list` first to check for existing items (avoid duplicates)
   - Call `rebel_inbox_feedback` scoped to this automation (`automationId: "system-source-capture"`, `automationName: "source-capture"`, `limit: 5`) before creating new items. Treat returned dismissals as weak examples of what missed for this user and source, not as rules. Do not blacklist people, clients, topics, keywords, or recurring meeting names. Skip a candidate only when it has the same kind of source, action shape, and user-value problem as a dismissed example.
   - For each source captured in steps 2-3, evaluate: does this need the user to DO something?
   - **Emails needing a reply**: received email from a real person (not automated/newsletter), no reply sent yet, seems to expect a response → create action item with title "Reply to [person] about [subject]", `category: 'follow-up'`, `dueBy` set to 48h from now, email reference in `references`, `source: { kind: 'automation', automationId: 'system-source-capture', automationName: 'source-capture' }`. ALWAYS include `references: [{ kind: 'email', threadId: '<thread-id>', messageId: '<message-id>', provider: 'gmail' or 'outlook' }]` — this is required for reply detection and correct CTA labeling.
   - **Calendar events needing prep**: upcoming meetings (today or tomorrow) where the user is an attendee and has no prep notes → create action item with title "Prep for [meeting title]", `category: 'meeting-action'`, `relevantDate` set to the meeting start time, `dueBy` set to 1h before meeting
   - **Slack threads needing response**: thread where the user was mentioned or asked a question, no response yet → create action item with title "Respond to [person] in [channel] about [topic]", `category: 'follow-up'`, `dueBy` set to 24h from now. Include a URL or workspace reference to the specific thread when the tool output provides one; this lets freshness checks inspect the exact thread before searching broadly.
   - **Teams messages needing response**: thread where the user was mentioned or asked a question, no response yet → create action item with title "Respond to [person] in Teams about [topic]", `category: 'follow-up'`, `dueBy` set to 24h from now. Include a URL or workspace reference to the specific chat/thread when available.
   - **Document/Notion review items**: create only when the user personally needs to review, approve, comment, or decide. Include a URL or workspace reference to the exact document/page/comment when available. Do NOT create the item if the captured source already shows the user approved/commented, the owner accepted the review, or the review was completed by someone else.
   - **Only create action items for things the user personally needs to act on** — not FYI, not other people's tasks, not automated notifications
   - **Deduplicate**: before creating, check BOTH active and archived items:
     1. Check `rebel_inbox_list` results for items with similar titles or matching email/thread references
     2. Also call `rebel_inbox_query(archivedOnly: true, search: "<person or topic name>")` to check archived items
     3. For archived matches, verify it's the **same underlying signal** (same email thread, same meeting, same Slack/Teams thread, same document/page/comment) — not just the same person or topic. Recurring contacts and topics are expected; only skip if the specific actionable signal was already handled.
     4. Skip if a true duplicate is found in either active or archived items
   - **Always set `text`** with 1-3 sentences of actionable context: who it's from, when it arrived, and what specifically needs the user's attention. The `text` field appears as the subtitle in the Actions UI — items without it look empty and unhelpful. Never set `text` to the same value as `title`.
   - Cap at 5 new items per run to avoid overwhelming Actions
6. **(Mandatory) Actions freshness check** — clean up stale action items:
   - Call rebel_inbox_list to get active items
   - **Connector/user agnostic**: resolve Actions using the systems this user normally uses for that action type. Infer the likely system from exact references first, then source provenance, `Chief-of-Staff/README.md`, connected tool packages, recent source history, and scoped feedback examples. Do not assume Gmail, Slack, Notion, Linear, GitHub, or any single connector is present.
   - **Evidence route**: exact reference first; same source thread/page/task second; user's normal tool for that person/topic third; at most one targeted cross-system search last. If those are inconclusive, leave active.
   - **Triage first, search second** — build a priority queue and process up to 10 per run. Prioritise: (1) overdue or due-today items, (2) items with exact email/URL/workspace/ticket references and completion-prone titles ("reply/respond/follow up/check/confirm/review/comment/approve"), (3) oldest remaining items. Skip items less than 24h old unless they have a specific email-thread reference with reply evidence. This keeps cost and time bounded without letting obvious resolved items sit behind old vague backlog.
   - **Backlog sweep exception**: if the user explicitly asks for a first-time cleanup / backlog sweep / "go through all my Actions", process all active items once in batches using the same priority order and high-confidence rules. First produce a dry-run receipt with counts by outcome (resolved, stale/obsolete, leave active, needs user review) and connector work performed. Only mark items resolved/dismissed after the user authorises the specific cleanup result.
   - **Hard budget stop**: use the existing automation cadence only. Normal runs must stop after the item cap, 30 read-only connector calls total, or 2 minutes, whichever comes first. Do not start a new background resolver, crawl whole workspaces, fetch large document bodies, or run per-item LLM judging. Backlog sweeps are dry-run receipts in batches and require user authorisation before applying.
   - Determine which email tools are available (Gmail: gmail:list_messages / gmail:get_message; Outlook: Microsoft365Mail tools). Use whichever the user has connected.
   - For each triaged item, determine its type from the title:
     a. **Email-action items** (title contains "reply to", "respond to", "follow up" + a person/company name, "email X about"):
        - Use a **targeted** search: search sent mail for the specific person/company/subject mentioned in the title (e.g., `from:me to:taberna newer_than:5d`). Match the search window to the item age, cap at 14 days. Do NOT fetch all sent mail.
        - If the item has an email reference with threadId and messageId, fetch that specific thread (cheapest check — do this first)
        - If the item has an email reference with a provider field, use that provider's tools; otherwise try all available email tools
        - If no threadId, search by person name, company name, or subject keywords
        - A colleague replying in the same thread counts as resolved
        - Do NOT require exact name matching — search for partial names, company names, or email domains
        - The 24h age guard does NOT apply to email items — if evidence of a reply exists, archive regardless of item age
     b. **Meeting/calendar items** (title contains "prep for", "prepare for", or has a relevantDate):
        - If the meeting/event date has passed by 24h+, archive
     c. **Messaging/communication items** ("respond to X in [channel/Teams]", "send X to Y", "share X with Y", "tell Y about X", "let Y know", "message Y", "ping Y", "forward X to Y", "notify Y", "ask Y about X", "loop in Y", "update Y on X", "check with X", "confirm with X"):
        - Use `list_tool_packages()` to discover connected messaging tools (Slack, Microsoft Teams, etc.)
        - If the item has a URL/workspace reference to a Slack/Teams thread, inspect that specific thread first. Only search more broadly if the reference is missing or inconclusive.
        - Search the user's connected messaging platforms for recent messages from the user mentioning the person or topic (match search window to item age, cap at 14 days)
        - For "send/share" items: search for messages from the user to or mentioning the named person, containing keywords from the item (e.g., for "Send Josh the Cornell bird ID app name", search for messages from the user mentioning "Josh" and "bird" or "Merlin" or "Cornell")
        - For communication-derived scheduling/follow-up items ("schedule/sync/call/meet/follow up with X"), use the originating communication system first, then the user's normal communication system for that person/topic. Archive when later same-thread, same-person, or same-topic evidence shows the sync/call happened, was scheduled, was cancelled, or is no longer needed. This applies to Slack, Teams, email, CRM comments, or any connected communication tool — do not hardcode one platform.
        - For "check/confirm with" items: archive when the referenced thread or a targeted recent search shows an explicit answer, decision, confirmation, or "handled/done" update from the named person, the user, or another clearly responsible teammate. A mere mention of the topic is not enough.
        - Use whichever messaging tools are available — do not assume any specific platform
        - Cap at 2 messaging searches per item to keep cost bounded
        - Only archive when you find HIGH confidence evidence of completion
        - The 24h minimum age guard applies
     d. **Document/review items** ("review X in Notion", "comment on X", "approve X", "check X doc", "review X criteria/proposal/spec"):
        - If the item has a URL/workspace reference, inspect that exact document/page/comment first. Do not crawl unrelated documents.
        - Archive when you find HIGH confidence evidence that the user approved/commented/edited, the user discussed or used the feedback in a later meeting/call, the requested reviewer has resolved the comment, the document status changed to approved/final/done, or the source thread explicitly says the review was handled by someone else.
        - Do NOT archive merely because the document exists, was updated, or contains the same topic keywords.
        - Cap at 1 document lookup plus 1 targeted messaging search per item.
        - The 24h minimum age guard applies.
     e. **Other items** (e.g., "Fix bugs", "Add instructions to Notion"):
        - Check connected messaging platforms for mentions of the task topic in the last few days
        - Check calendar for related completed events
        - For "push", "ship", "release", "deploy", "merge", "commit", "document", "fix", or "implement" items, check GitHub/Linear/Git evidence when available. Archive when a matching commit, merged PR, closed issue, or release note clearly covers the requested work. If a teammate owns/completed the work and the user has no remaining decision/action, archive as handled.
        - For meeting-prep items, check calendar status and later availability signals. Archive/dismiss when the user declined, is out of office during the event, or explicitly said they will not attend. Do not ask the user to prep for a meeting they are not attending.
        - For system receipts and automation logs ("memory hygiene completed", "draft saved", "source capture complete", "cleanup receipt"), dismiss/archive once recorded. These are audit trail entries, not Actions.
        - For delegated tasks ("Greg said he would check", "Harry is working on", "Josh will confirm"), archive/dismiss unless the item clearly asks the user to follow up by a deadline. Other people's owned work should not stay in the user's active Actions.
        - Only archive when you find HIGH confidence evidence of completion
        - The 24h minimum age guard applies to non-email items
     f. **Items with Linear/GitHub/Asana references** (item has references with kind 'linear', 'github', or 'asana'):
        - Check the relevant tool: Linear `get_issue` for status, GitHub `issues:get` or `pull_requests:get` for state, Asana `search_objects` for completion
        - If the issue/PR/task is closed, merged, or completed → archive
        - Only check when the relevant connector is available
   - Archive confirmed-complete items via rebel_inbox_update with archived=true
   - Drafts or clarifying questions are a caution flag, not an absolute block. Do not archive a pending draft just because it exists. However, if exact source/reference evidence or a targeted search shows the underlying open loop was already completed by the user or another responsible teammate, archive it. Example: an item drafted as "ask Josh whether Operators is feature-flagged" can resolve if Josh/product already answered that in the referenced thread.
   - After an authorised backlog sweep, add a short result note to the final response: "Rebel found X Actions that were already handled and cleared them." Do not create a new Action for the receipt.
   - Every resolved/dismissed item must have a short evidence note naming the connector/source and why it closes the loop. Receipts must include counts by outcome and connector work performed. Never hide uncertainty; uncertain items stay active or go to needs-user-review.
   - Never resolve explicit user-request items from indirect evidence unless exact-source evidence proves the user's requested outcome is complete, or the user authorises the cleanup result.
   - When in doubt, leave the item — false positives are worse than stale items

[IMPORTANT]
- If no new sources are found since [LAST_EXECUTED_SUCCESS], report "No new sources to capture" — this is a valid outcome. Still run steps 5 and 6.
- Steps 5 and 6 are mandatory even when no sources were captured — always surface actionable items and check Actions
- When creating action items (step 5), always set `dueBy` or `relevantDate` so items appear in the right temporal bucket (Today / This Week / Later)
