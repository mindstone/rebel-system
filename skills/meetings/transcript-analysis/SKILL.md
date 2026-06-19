---
name: transcript-analysis
description: Process meeting transcripts with context enrichment and follow-up proposals
triggers:
  - transcript ready
  - meeting transcript
  - analyze recording
output_shape:
  default_surface: file_artifact
  chat_contract: concise_summary
  artifact_expected: true
  max_chat_words: 180
  source_policy: artifact_sources
---

# Transcript Analysis

Process a meeting transcript to extract context, identify action items, and create follow-up proposals.

## When This Runs

This skill is triggered automatically when a meeting transcript is saved from ANY source:
- **Recall/Desktop SDK** - Rebel Notetaker (video calls)
- **Plaud** - Physical voice recorder (in-person meetings)
- **Fireflies/Fathom** - External transcription services

## User Customization

**IMPORTANT**: Before executing this skill, check if the user has created their own `transcript-analysis` skill in `Chief-of-Staff/skills/meetings/transcript-analysis/`.

If found:
1. Read the user's skill file
2. Apply their preferences and additional instructions
3. User preferences override system defaults

This allows users to add custom processing like CRM updates, specific follow-up templates, or routing rules.

## Input (Event Context)

You'll receive context about the transcript:

- `filePath` - Absolute path to the saved transcript file
- `sourceSystem` - Where it came from: `recall`, `desktop_sdk`, `plaud`, `fireflies`, `fathom`
- `meetingTitle` - Title of the meeting
- `startTime` - When the meeting occurred (ISO string)
- `duration` - Meeting duration in seconds
- `participants` - Array of participant names/emails (may be empty for Plaud)
- `meetingUrl` - Video call URL (for Recall/Fireflies/Fathom)
- `calendarEventId` - Calendar event ID if linked

## Source-Aware Processing

### For Plaud recordings (no calendar link)

Plaud recordings upload later without calendar context. You must search for context:

1. **Read the transcript** to identify:
   - Names mentioned (potential participants)
   - Topics discussed (for matching to calendar titles)
   - Time references ("yesterday's call", "our Monday sync")

2. **Search calendar** (past 14 days) using Google Workspace or similar MCP:
   - Search by participant names
   - Search by topic keywords
   - Look for meetings around the recording date (±3 days)

3. **If calendar match found**:
   - Note the match and confidence level
   - Use calendar participants if available
   - Link to related documents if mentioned

4. **If no match found**:
   - Note that context search was attempted
   - Proceed with transcript-only analysis

### For Recall/Desktop SDK (has calendar link)

Calendar context is already attached via `meetingUrl` and `calendarEventId`:

1. Focus on extracting action items and decisions
2. Identify follow-up opportunities
3. Connect to existing projects/topics in memory

### For Fireflies/Fathom (external providers)

Basic metadata is available. Focus on:

1. Extracting action items and decisions
2. Creating actionable follow-up proposals
3. Summarizing key discussion points

## Output - Chief of Staff Briefing Style

Think like a Chief of Staff briefing a CEO. Don't dump everything into one item - break it down into **separate, actionable items** by category. Each item should be scannable in 5 seconds.

**IMPORTANT**: The `text` field is REQUIRED for every item. It appears as the subtitle in the Actions UI — items without it look empty. Write 1-3 sentences of actionable context: what happened, who's involved, and what needs to happen next. Never set `text` to the same value as `title`.

Use `rebel_inbox_add` from the RebelInbox MCP (not `rebel_inbox_add_item`) for each item.

### Categories to Extract

**Only create items for categories that apply.** Skip empty categories.

#### 1. Meeting Summary (optional - only if notable)

For meetings with significant strategic content worth remembering later:

```
rebel_inbox_add({
  title: "Acme sync: Q2 expansion greenlit",
  text: "Agreed to expand to 3 regions. Sarah owns pricing, John flagged support capacity risk.",
  source: "Acme Corp meeting",
  references: ["{transcript_path}"],
  urgent: false,
  important: false,
  tags: ["expansion", "acme"]
})
```

- **Quadrant**: Consider (FYI) - `urgent: false, important: false`
- **No execute action** - purely informational
- **Skip for**: routine standups, quick syncs, status updates

#### 2. Decisions & Commitments

For each significant decision made or commitment given:

```
rebel_inbox_add({
  title: "Decision: Expand to APAC by Q2",
  text: "Approved in Acme sync. Budget: $500K. Sarah to draft implementation plan.",
  source: "Acme Corp meeting",
  references: ["{transcript_path}"],
  urgent: false,
  important: true,
  tags: ["expansion", "acme", "budget"]
})
```

- **Quadrant**: Schedule - `urgent: false, important: true`
- Include who decided and any constraints
- One item per major decision (don't bundle)

#### 3. Your Action Items

Tasks the USER specifically committed to or needs to do:

```
rebel_inbox_add({
  title: "Send pricing to Sarah by Friday",
  text: "Promised in Acme sync. Include volume discounts for 3-region deal.",
  source: "Acme Corp meeting",
  references: ["{transcript_path}"],
  urgent: true,
  important: true,
  actions: [{type: "execute"}],
  clarifyingQuestion: "Include enterprise tier?",
  tags: ["pricing", "acme"]
})
```

- **Quadrant**: Based on deadline - `urgent: true` if this week
- **Add execute action** if Rebel can help prepare/draft
- **clarifyingQuestion** if you need input before executing

#### 4. Delegation Candidates

Things someone else should handle (Rebel can draft the request):

```
rebel_inbox_add({
  title: "Get support capacity analysis from ops",
  text: "Draft message to ops team asking for support bandwidth analysis for APAC expansion. John raised this concern - need data before finalizing plan.",
  source: "Acme Corp meeting",
  references: ["{transcript_path}"],
  urgent: true,
  important: false,
  actions: [{type: "execute"}],
  clarifyingQuestion: "Send to ops-team Slack or email Sarah directly?",
  tags: ["ops", "acme", "expansion"]
})
```

- **Quadrant**: Delegate - `urgent: true, important: false`
- Include who should own it
- **Add execute action** - Rebel will draft the delegation request
- **clarifyingQuestion** to confirm channel/recipient

#### 5. Follow-up Drafts (actionable)

Emails, messages, or docs that Rebel should draft:

```
rebel_inbox_add({
  title: "Draft follow-up email to Acme",
  text: "Thank them for meeting. Confirm Q2 timeline, attach pricing by Friday. Mention support capacity review underway.",
  source: "Acme Corp meeting",
  references: ["{transcript_path}"],
  urgent: false,
  important: true,
  actions: [{type: "execute"}],
  clarifyingQuestion: "Formal or friendly tone?",
  tags: ["email", "acme", "follow-up"]
})
```

- **Quadrant**: Schedule - `urgent: false, important: true`
- **Always add execute action** - this is for Rebel to do
- **text** should be clear instructions for what to draft
- **clarifyingQuestion** for tone, recipients, or scope

### Example: Full Meeting Breakdown

**Meeting**: Customer sync with Acme Corp about Q2 expansion

**Items created** (5 separate `rebel_inbox_add` calls):

1. **Summary** (Consider): "Acme sync: Q2 APAC expansion greenlit"
2. **Decision** (Schedule): "Decision: $500K budget approved for APAC"  
3. **Your action** (Do Now): "Send pricing to Sarah by Friday"
4. **Delegate** (Delegate): "Get support capacity analysis from ops"
5. **Draft** (Schedule): "Draft follow-up email to Acme team"

### What NOT to do

❌ One giant item with everything:
```
title: "Meeting with Acme Corp"
text: "We discussed expansion, Sarah needs pricing, John raised concerns, need to follow up, also should check with ops team about capacity..."
```

✅ Separate items by type, each scannable in 5 seconds

## Error Handling

- If transcript file not found, report error and stop
- If MCP tools unavailable, proceed with transcript-only analysis
- If action item creation fails, report error but don't fail silently
- Always confirm what was accomplished in your final response
