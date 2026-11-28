---
name: onboarding-discovery
description: "Combined onboarding workflow: populates memory, generates personalized use cases, and seeds Actions with immediate tasks - all from a single data crawl. For onboarding use only (non-interactive)."
last_updated: 2026-01-28
agent_type: main_agent
---

# Onboarding Discovery

Single-pass discovery workflow for new users. Crawls connected tools once and produces three outputs:
1. **Memory files** - People directories, topics, and sources
2. **Use cases** - 3 personalized workflows saved to the library
3. **Action items** - Immediate tasks discovered across the Eisenhower grid

This skill is optimized for **onboarding only** - it runs non-interactively with hardcoded defaults. For interactive memory population, use [space-memory-populate](../space-memory-populate/SKILL.md).


## See also

- [space-memory-populate](../space-memory-populate/SKILL.md) - Interactive version with Phase 2 deep dive
- [rebel-os-use-case-finder](../../operations/rebel-os-use-case-finder/SKILL.md) - Standalone use case discovery (reference for quality criteria)
- [source-capture](../../memory/source-capture/SKILL.md) - Meeting/thread capture format
- [memory-update](../../memory/memory-update/SKILL.md) - README vs topics guidelines


## What this does

**Single crawl, multiple outputs:**

| Output | Destination | What's Created |
|--------|-------------|----------------|
| Memory | `Chief-of-Staff/memory/` | People directory, 2-3 topics, recent meeting sources |
| Use cases | Use case library | 3 personalized workflows (saved via `rebel_usecases_add`) |
| Actions | Actions panel | 5-12 items across all quadrants (saved via `rebel_inbox_add`) |
| Identity | Settings | User's first name and email (saved via `rebel_user_identity_set`) |

**Constraints (non-negotiable for onboarding):**
- Target: Chief-of-Staff space only
- Time range: Last three days only (no future calendar window)
- Non-interactive; writes still follow the existing bands and approvals
- Phase 1 only (no deep dive offer)
- Speed over completeness


## Process

### 1) Identify connected MCPs

The launch message names the allowed providers and services, for example Gmail, Google Calendar, Outlook Mail, Outlook Calendar and Slack. Read **only those named providers/services**, and only accounts with readable access. Never broaden a category such as email to another provider, or open other linked tools. Do not discover additional providers for this crawl.

Email or calendar must be readable to start this crawl; Slack alone is opened only when a piece of work needs it. If no allowed provider is readable, or every read fails/returns nothing useful, save no invented identity, memory, use cases or Actions. Report that nothing was readable and go to step 7. Fewer than three evidenced use cases is fine: save only what the read supports.

### 2) Launch parallel subagents for data gathering

Launch up to 3 subagents simultaneously for the most valuable connected tools.

**Email subagent prompt:**
```
Scan last 3 days of email. Return JSON:
{
  "user_identity": { "first_name": string|null, "email": string|null },
  "active_threads": [{ "subject", "participants", "summary", "needs_response": bool, "urgency": "high"|"medium"|"low", "importance": "high"|"medium"|"low" }],
  "key_people": [{ "name", "email", "role_guess", "interaction_count" }],
  "potential_tasks": [{ "title", "description", "source_subject", "urgency": "high"|"medium"|"low", "importance": "high"|"medium"|"low" }]
}
Extract user's name/email from sent mail "From" field or signature.
Focus on threads with external participants or requiring action.
Classify importance: involves key relationships, revenue, strategy, or direct reports = high.
Classify urgency: needs action within 48 hours = high.
```

**Calendar subagent prompt:**
```
Scan only the last 3 days of the named calendar provider; no future events. Return JSON:
{
  "recent_meetings": [{ "title", "date", "attendees", "has_transcript": bool }],
  "recurring_patterns": [{ "name", "frequency", "typical_attendees" }]
}
Extract only what the recent events establish; do not fetch a future window.
```

**Slack subagent prompt:**
```
Scan only last 3 days of activity from the named Slack provider. Return JSON:
{
  "team_directory": [{ "name", "email", "title", "department" }],
  "active_channels": [{ "name", "purpose", "recent_topics" }],
  "mentions_needing_response": [{ "channel", "from", "summary", "timestamp", "urgency": "high"|"medium"|"low" }]
}
Derive people only from that activity. Focus on DMs and mentions; no full directory crawl.
```


### 3) Process results and extract user identity

Merge subagent results. Extract user's first name and email from:
- Email "From" field (highest confidence)
- Email signature
- Calendar owner
- Slack profile

Validate: name 2-30 chars, starts with letter, not a placeholder like "null" or "user".

**Save identity immediately:**
```
rebel_user_identity_set({
  firstName: "Alex",
  email: "alex@example.com"
})
```


### 4) Write memory files

**People directory** (`memory/topics/Internal-Team-Directory.md`):
```markdown
---
description: "Team members from Slack and email interactions"
last_updated: YYYY-MM-DD
---

# Internal Team Directory

| Name | Email | Role | Department |
|------|-------|------|------------|
| ... from Slack + email data ... |
```

**Topics** (2-3 max, only if clear patterns):
- Active projects mentioned in multiple sources
- Key clients/customers with recent interaction

**Sources** (recent meetings only):
- Use [source-capture](../../memory/source-capture/SKILL.md) format
- Only meetings from last 3 days with transcripts


### 5) Generate and save use cases

From readable evidence, identify up to 3 high-impact personalized use cases. With no useful data, save none.

**Quality criteria** (from [rebel-os-use-case-finder](../../operations/rebel-os-use-case-finder/SKILL.md)):
- Title: Clear, action-oriented (5-8 words)
- Description: Uses "like" before 2-3 specific examples (companies, people, projects)
- Prompt: Full executable prompt
- Must feel personally crafted, not generic

**Save to library:**
```
rebel_usecases_add({
  useCases: [
    { title: "...", description: "...", prompt: "...", icon: "📋", qualityRating: 90 },
    { title: "...", description: "...", prompt: "...", icon: "📅", qualityRating: 90 },
    { title: "...", description: "...", prompt: "...", icon: "✉️", qualityRating: 90 }
  ]
})
```

If `rebel_usecases_add` unavailable, output JSON for manual saving.


### 6) Seed Actions across all quadrants

From potential_tasks, active_threads, mentions, and recent meetings, create 5-12 action items distributed across the Eisenhower grid.

**Do Now** (urgent=true, important=true):
- Email requiring response today from key stakeholder
- Follow-up from a recent meeting with an explicit deadline
- Explicit request with tight deadline

**Schedule** (urgent=false, important=true):
- Strategic thread to engage with this week
- Follow-up from a recent external meeting needing thought
- Important project update to review and respond to
- Relationship-building outreach to prioritize

**Delegate** (urgent=true, important=false):
- Request that could be forwarded to a team member
- Scheduling/logistics that needs handling but not by user directly
- FYI that needs acknowledgment but not deep engagement

**Consider** (urgent=false, important=false):
- Interesting thread to follow when time permits
- Newsletter or industry update worth reviewing
- Low-priority request that can wait

**Classification heuristics:**
- **Important** = involves key relationships, revenue, strategy, or direct reports
- **Urgent** = needs action within 48 hours

**Save each item:**
```
rebel_inbox_add({
  title: "Prep for Acme Corp sync on Thursday",
  text: "External meeting with Sarah (VP Eng) in 3 days. Review recent email thread about integration timeline.",
  urgent: false,
  important: true,
  source: "Onboarding Discovery",
  actions: [{ type: "execute" }]
})
```

**Balance guidance:**
- Aim for 2-3 items per quadrant (8-12 total)
- Don't force items - if only 5 things matter, only add 5
- Better to have fewer well-classified items than many poorly-classified ones


### 7) Output completion marker

End with this exact marker so the UI knows discovery is complete:

```
[ONBOARDING_DISCOVERY_COMPLETE]
```


## Important

- Launch subagents in parallel (except Slack - sequence due to rate limits)
- Never ask coaching questions; honour any approval required by the bands
- Speed over completeness - 2-3 minutes target
- Only write to Chief-of-Staff space
- If a tool fails, continue with others
- Extract user identity from email first (most reliable)
- Use cases must feel personalized (specific names, not generic)
- Action items should span all four quadrants, not just one
- Always call `rebel_user_identity_set` if name/email discovered
- Call `rebel_usecases_add` only for evidenced use cases; never fill a quota
- Always call `rebel_inbox_add` for each discovered task (5-12 items typical)
