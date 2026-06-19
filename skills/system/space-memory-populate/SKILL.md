---
name: space-memory-populate
description: "Onboarding workflow to populate a space's memory from connected MCPs (Gmail, Slack, Calendar, etc.) in two phases: quick scan (2-3 days) with people directory for fast initial results, then optional deep dive with comprehensive source capture. Chains to transcription-vocabulary-suggest afterward."
last_updated: 2026-03-24
agent_type: main_agent
---

# Space Memory Populate

Bulk-populate a space's memory from connected MCP tools (Gmail, Slack, Calendar, Linear, Notion, etc.). Uses a two-phase approach: **Phase 1 (Quick Scan)** gives fast initial results from the last 2-3 days, then **Phase 2 (Deep Dive)** offers comprehensive population with people directories and extended source capture.

## See also

- [onboarding-discovery](../onboarding-discovery/SKILL.md) - Non-interactive variant for onboarding; also generates use cases and action items
- [source-capture](../../memory/source-capture/SKILL.md) - Captures meetings, documents, and threads as source files (used extensively by this skill)
- [memory-update](../../memory/memory-update/SKILL.md) - Automatic memory maintenance after conversations (follow these guidelines for README vs topics)
- [transcription-vocabulary-suggest](../transcription-vocabulary-suggest/SKILL.md) - **Run after this skill** to update transcription vocabulary with discovered names/terms
- [slack-mcp-work-with](../../communication/slack-mcp-work-with/SKILL.md) - Slack team directory format (used for internal people directory)
- [spaces](../../help-for-humans/spaces.md) - Overview of spaces and the `emails` frontmatter field for account associations
- [SLACK_MCP.md](../../../../docs/project/mcps/SLACK_MCP.md) - Slack MCP tools reference (esp. `list_slack_users` for people directory)
- [SPACES.md](../../../../docs/project/SPACES.md) - Spaces architecture and frontmatter fields
- [MEMORY_SAFETY.md](../../../../docs/project/MEMORY_SAFETY.md) - Memory approval system (Chief-of-Staff is permissive; shared spaces require approval)
- [bulk-export](../bulk-export/SKILL.md) - **Alternative for data analysis**: exports raw MCP data to NDJSON files for ripgrep search. Use BulkExport when the goal is data analysis (not memory population) and the dataset is large.


## What this does

Gathers information from connected MCPs and populates a space's memory in two phases:

**Phase 1 - Quick Scan (2-3 days):**
1. **Asks which space** to populate upfront
2. **Identifies relevant MCPs** based on space's email associations
3. **Builds people directory** (Internal Team Directory) — quick win, helps with future interactions
4. **Scans recent content** (last 2-3 days) from selected sources
5. **Captures key sources** using [source-capture](../../memory/source-capture/SKILL.md) for recent meetings
6. **Creates initial topics** for active projects and immediate context
7. **Returns quickly** with actionable results

**Phase 2 - Deep Dive (offered after Phase 1):**
1. **Extended timespan** - Goes back weeks or months based on user preference
2. **External contacts directory** - Expands people directories with clients, partners, vendors
3. **Comprehensive source capture** - Captures more meetings, substantive threads, key documents
4. **Pattern recognition** - Identifies recurring themes, projects, and relationships
5. **Updates README** with high-utility facts (50%+ threshold per [memory-update](../../memory/memory-update/SKILL.md))

**Re-runnable:** Safe to run multiple times — adds new information without overwriting existing memory.

**Read-only principle:** This skill only reads from external MCPs — no posting messages, reactions, or modifications. The only writes are to memory files and transcription vocabulary settings.


## Process

### 1) Ask which Space to use

**Always ask first** — don't assume. Present available spaces:

```
Which space should I populate?

Available spaces:
- Chief-of-Staff (personal context)
- Acme Corp (work - acme.com)
- Side Project (personal project)

[Or tell me about a new space to create]
```

If only Chief-of-Staff exists, confirm: "Should I populate your Chief-of-Staff space with personal context?"


### 1b) Adapt for shared spaces

Read the space's `README.md` frontmatter — specifically `sharing` and `sensitivity`. If `sharing` is `team`, `company-wide`, or `public`, this is a shared space. Adapt the rest of the process:

- **Content filtering**: Exclude 1:1 emails, personal calendar items, DMs, HR/compensation discussions, and personal reminders. Only include content relevant to the team/company. When in doubt, ask the user.
- **README writes**: Be conservative — skip README updates in Phase 1 entirely. In Phase 2, only promote facts that are stable and broadly relevant to the team. Personal working context stays in topics.
- **Memory safety**: The platform's safety system enforces approval for shared-space writes. Be aware that writes may be staged to `Chief-of-Staff/memory/pending/` for review rather than landing directly.

For private spaces (Chief-of-Staff, personal), proceed with the standard flow.


### 2) Check MCP Connectors

**Read space's email associations:**
Check the space's `README.md` frontmatter for the `emails` field. This contains email addresses (e.g., `user@acme.example`) or domain wildcards (e.g., `acme.example`).

**Match MCPs to space:**
Check connected MCPs in Settings > Connectors. For each MCP, compare its account email against the space's `emails` field:
- **Exact match:** MCP account `user@acme.example` matches space email `user@acme.example`
- **Domain match:** MCP account `user@acme.example` matches space domain `acme.example`

**Present connector summary:**

```
Connected tools for [Space Name]:

Matched by email association (acme.example):
  ✓ Gmail (user@acme.example)
  ✓ Google Calendar (user@acme.example)
  ✓ Slack (Acme Corp workspace)

Other connected tools:
  ? Linear (user@acme.example) — not in space's email associations
  ? Notion (personal workspace) — different account

Which sources should I use? I'll ask before adding anything sensitive.
```

If no `emails` configured on the space, list all connected MCPs and ask which accounts apply to this space.


### 3) Determine scan depth (first run vs. re-run)

**Check if this is first run:**
- Look for existing content in `memory/topics/` and `memory/sources/`
- If minimal or empty → this is a first run → use **Phase 1 Quick Scan**
- If substantial content exists → offer choice: "quick refresh" (2-3 days) or "deep dive" (extended)

**First run default:** Always start with Phase 1 Quick Scan to deliver value quickly.

```
This looks like the first time I'm populating [Space Name].

I'll start with a quick scan of the last 2-3 days to get you immediate context,
then offer a deeper dive to build out comprehensive memory.

Any specific projects or topics I should prioritize in this initial scan?
```


---

## Phase 1: Quick Scan (2-3 days)

Fast initial population — return results within a few minutes.


### 4) Gather focus areas (brief)

Ask 1-2 quick questions max:
- What's most top-of-mind right now?
- Any specific project or person I should focus on?

**For shared spaces**, also ask:
- What are the team's current priorities or key initiatives?
- Which Slack channels or projects are the canonical ones for this team?
- Are there any key team documents I should capture (e.g., OKRs, project plans, onboarding docs)?
- Anything to explicitly exclude from the shared space?

Don't deep-dive on context — save that for Phase 2.


### 5) Build Internal Team Directory (Phase 1)

**Start the people directory early** — it's quick, low-cost, and immediately useful for future interactions.

**For Slack workspaces:** Call `list_slack_users` to get the full user list. This is a single API call that returns everyone.

**For Microsoft 365 / Teams:** No direct user list API currently available. Build from email senders/recipients and calendar attendees instead.

**For email-only setups:** Extract people from recent sent/received emails and calendar attendees.

Create `memory/topics/Internal-Team-Directory.md` (format in Phase 2 section). Start with key fields only — can enrich in Phase 2.

**Note:** Run this while other scans proceed, but **sequence Slack operations** (don't parallelize multiple Slack API calls due to rate limits).


### 6) Parallel subagent execution

**Before launching subagents**, scan existing `memory/topics/` and `memory/sources/` to build a list of what already exists. Pass this list into each subagent prompt so they return merge/update decisions for existing topics rather than creating duplicates.

**Launch subagents in parallel** for each selected source (except Slack — see note above).

```
Launching parallel scans:
- People directory: building from Slack/email (can run alongside)
- Gmail: last 3 days sent/received
- Calendar: last 3 days + upcoming week
- Meetings: any transcripts from last 3 days
- Slack: last 3 days in key channels (sequenced, not parallel)
```

**Subagent prompt template:**

```
GOAL: Scan [SOURCE] for the last 3 days and extract key information for [SPACE NAME].

CONTEXT:
- Space: [space name and description]
- Sharing level: [private/team/company-wide]
- Focus areas: [user's stated priorities]
- Email associations: [relevant emails/domains]
- Existing topics: [list of filenames from memory/topics/]
- Existing sources: [list of filenames from memory/sources/]

DELIVERABLE - Return structured JSON:
{
  "meetings": [{ "title", "date", "participants", "key_points", "source_url" }],
  "active_projects": [{ "name", "status", "recent_activity" }],
  "key_people": [{ "name", "email", "role", "recent_interaction" }],
  "action_items": [{ "description", "owner", "due_date", "source" }],
  "topics_to_create": [{ "filename", "summary", "utility_estimate" }]
}

CONSTRAINTS:
- Last 3 days only
- Patterns over exhaustive lists
- Flag but don't include sensitive content
- Include source URLs for traceability
- Check existing topics before proposing new ones — update/merge into existing files where the same project, person, or company is already covered
- For shared spaces: exclude 1:1 messages, personal calendar items, DMs, HR/compensation — only include team-relevant content
```

**Launch simultaneously** (except Slack):
- Subagent 1: Gmail scan
- Subagent 2: Calendar + Meetings scan
- Subagent 3: Linear/Notion scan (if connected)
- Subagent 4: Slack scan (run after others complete, or sequence Slack calls within one subagent)

**Slack rate limit note:** Slack has strict rate limits (especially for non-Marketplace apps). Don't parallelize multiple Slack API calls. Run Slack scans sequentially or in a single subagent.


### 7) Process results and capture sources

**For meetings found:** Always create source files using [source-capture](../../memory/source-capture/SKILL.md):
```
Capturing recent meetings:
- 260108_1000_meeting_team-standup.md (Team standup)
- 260109_1430_meeting_client-review.md (Client review with Acme)
```

**For other content:** Create initial topic files for active projects and immediate context.


### 8) Quick review and write

Present a brief summary:

```
Quick scan complete for [Space Name] (last 3 days):

People directory:
- Internal-Team-Directory.md - 12 team members catalogued

Source files captured:
- 2 meetings captured in memory/sources/

Topics created:
- Project-Phoenix.md - Active Q1 initiative
- Customer-Acme.md - Recent client interactions

Proceed? Then I'll offer a deeper dive to build comprehensive memory.
```

After approval, write the files.


### 9) Offer Phase 2 Deep Dive

```
Quick scan complete! [Space Name] now has initial context.

Would you like me to do a deeper dive? This will:
- Go back further (2 weeks? 1 month? 3 months?)
- Build external contacts directory (clients, partners, vendors)
- Enrich the internal team directory with more detail
- Capture more meetings and substantive threads
- Identify patterns in projects, communication, and priorities

How far back should I look?
```


---

## Phase 2: Deep Dive (Extended)

Comprehensive population — takes longer but builds rich context.


### 10) Extended content gathering

**Timespan:** Based on user preference (default: 4 weeks, offer 1-3 months).

**Before launching**, scan `memory/topics/` and `memory/sources/` again (content may have been added since Phase 1). Pass existing filenames into subagent prompts. Apply the same shared-space content filtering as Phase 1 (see step 1b).

**Use parallel subagents** with extended date ranges:

```
Launching deep scan (last [X weeks/months]):
- Gmail: Extended thread analysis
- Slack: Channel history + team patterns  
- Calendar: Recurring meetings + schedule patterns
- Meetings: All transcripts in range
- Linear/Notion: Project documentation
```


### 11) Build External Contacts Directory

The Internal Team Directory was created in Phase 1. Now enrich it and create the External Contacts Directory.

**Enrich Internal Team Directory** (`memory/topics/Internal-Team-Directory.md`):
- Add team/group structures discovered from extended history
- Add key channels and their purposes
- Fill in roles and reporting relationships **only when explicitly stated** (email signatures, Slack profile titles, introductions, org charts). Leave blank if unclear rather than guessing.

Uses format from [slack-mcp-work-with](../../communication/slack-mcp-work-with/SKILL.md) team directory.

**Create External Contacts Directory** (`memory/topics/External-Contacts-Directory.md`):

```markdown
---
description: "External contacts for [Company/Space]"
last_updated: 2026-01-10
---

# External Contacts Directory

## Clients

| Name | Company | Role | Email | Last Contact | Notes |
|------|---------|------|-------|--------------|-------|
| Sarah Johnson | Acme Corp | VP Engineering | sarah@acme.com | 2026-01-08 | Key decision maker |

## Partners

| Name | Company | Role | Relationship |
|------|---------|------|--------------|
| Mike Wong | TechPartner | CEO | Integration partner |

## Vendors

| Name | Company | Service | Contact |
|------|---------|---------|---------|
| Support Team | CloudCo | Hosting | support@cloudco.com |
```

**Build from:** External email addresses, meeting attendees with non-matching domains, Slack guests.


### 12) Comprehensive source capture

Use [source-capture](../../memory/source-capture/SKILL.md) for:
- **All meetings** in the timespan (meetings always get source files)
- **Substantive email threads** (5+ messages, decisions made)
- **Important Slack discussions** (decision threads, architectural discussions)
- **Key documents** (specs, plans, important Notion pages)

Topics should cite these sources with wikilinks for provenance.


### 13) Pattern recognition and classification

Classify gathered information by utility:

| Utility | Destination | Examples |
|---------|-------------|----------|
| **50%+** | README.md (AI Working Context) | Key collaborators, active projects, communication patterns |
| **25-49%** | topics/ + README reference | Important customers, major initiatives |
| **<25%** | topics/ only | Project details, meeting summaries, historical context |

**For shared spaces**: be conservative with README promotion. One person's "high-utility" context may reflect their individual perspective, not the team's. Only promote facts that are stable, broadly relevant, and clearly team-level (e.g., team structure, shared projects, company-wide priorities). Personal working context and individual interpretations stay in topics.

**Organization checklist:**
- [ ] Combine related items? (don't create one topic per email)
- [ ] Check for duplication with existing memory?
- [ ] Add wikilinks between related topics?
- [ ] Cite sources where applicable?
- [ ] Flag sensitive items for review?


### 14) Review before writing

Present comprehensive summary:

```
Deep dive complete for [Space Name] (last [X] weeks):

README.md updates:
- [List high-utility additions]

Source files to create:
- 12 meetings captured
- 3 substantive email threads
- 2 key Slack discussions

New topic files:
- Internal-Team-Directory.md - 15 team members catalogued
- External-Contacts-Directory.md - 8 external contacts
- Project-Phoenix.md - Q1 initiative, timeline and stakeholders
- Customer-Acme.md - relationship context and key contacts
- [Additional topics...]

Sensitive items for review:
- [Any flagged items]

Proceed? You can modify before I write.
```


### 15) Write updates

After approval:
1. Create source files using [source-capture](../../memory/source-capture/SKILL.md) format
2. Create people directory files
3. Create/update topic files with wikilinks to sources
4. Update README.md with high-utility facts
5. Never overwrite existing content — only add or update sections

**Acknowledge completion:**
```
Deep dive complete for [Space Name]:
- Created 17 source files in memory/sources/
- Enriched Internal-Team-Directory.md (15 people)
- Created External-Contacts-Directory.md (8 contacts)
- Created 5 topic files
- Updated README.md with working context

Rebel will automatically maintain memory after each conversation via [memory-update](../../memory/memory-update/SKILL.md).
```

### 16) Offer transcription vocabulary update

**Always offer this after completing either phase:**

```
I've discovered several names, companies, and terms that could improve your transcription accuracy.

Would you like me to update your transcription vocabulary now? This helps with:
- People's names (especially non-English or unusual spellings)
- Company and product names
- Technical terms and acronyms

[Yes, update vocabulary] / [No, skip for now]
```

If yes, run [transcription-vocabulary-suggest](../transcription-vocabulary-suggest/SKILL.md).


---

## Privacy guidelines

- **Default to safe sources:** No DMs, no private channels without asking
- **Ask before sensitive content:** Always confirm before writing potentially sensitive information
- **Respect space boundaries:** Don't mix personal and work content
- **Check before writing:** Review what will be written, especially for shared spaces
- **Shared-space filtering:** When populating a shared space, exclude 1:1 emails, private calendar events, direct messages, HR/compensation threads, and personal reminders. These rules apply equally to email and calendar sources (not just Slack)


## Re-running this skill

Safe to run multiple times:
- **Existing sources:** Deduplication prevents duplicates (checked by source_uid)
- **Existing topics:** Always scan `memory/topics/` before creating new files. Merge new facts into existing topic files where the same project, person, or company is already covered — don't create overlapping topics (e.g., `Project-Phoenix.md` alongside `Phoenix-Project.md`)
- **New content:** Discovers content added since last run
- **People directories:** Updated with new contacts discovered

**Re-run scenarios:**
- **Quick refresh:** Run Phase 1 only to catch up on recent days
- **New connectors:** Run Phase 2 after connecting new MCPs
- **Extended history:** Run Phase 2 with longer timespan to backfill
- **Focus area:** Run Phase 2 targeting specific projects or contacts


## Troubleshooting

- **MCP tools not working:** Check Settings > Connectors to verify connections
- **No matching MCPs:** Add email associations to the space (Settings > Spaces > Edit)
- **Missing content:** Some MCPs have date range limits; try specifying a narrower focus
- **Slow execution:** Ensure subagents are launched in parallel, not sequentially
- **People directories incomplete:** Re-run Phase 2 with extended timespan


## Important

- **Always ask which space first** — don't assume based on context
- **Parallel subagents are critical** — launch Gmail, Calendar, Linear/Notion scans simultaneously (but NOT Slack)
- **Sequence Slack operations** — Slack has strict rate limits; don't parallelize multiple Slack API calls
- **Meetings always get source files** — use [source-capture](../../memory/source-capture/SKILL.md) for every meeting
- **Phase 1 should be fast** — target 2-3 minutes for initial results
- **Phase 2 is optional but valuable** — always offer it after Phase 1 completes
- **Internal team directory in Phase 1** — quick win that helps with future interactions
- **External contacts directory in Phase 2** — requires more history to identify external people
- **Cite sources in topics** — use wikilinks for provenance: `[[sources/yyMMdd/...]]`
- **Follow memory-update guidelines** — use 50%+ utility threshold for README updates
- **Shared spaces need extra care** — read `sharing` from frontmatter early; filter out personal/1:1 content; be conservative with README writes; the platform enforces approval for shared-space memory writes
- **Always scan existing topics before creating new ones** — merge into existing files rather than creating duplicates
- **Always offer vocabulary update** — after either phase, offer to run transcription-vocabulary-suggest
