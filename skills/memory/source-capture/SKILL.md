---
name: source-capture
description: "Capture citable sources (meetings, documents, files, media, web content) as structured files in memory/sources/ with provenance metadata for traceability."
last_updated: 2026-01-06
tools_required: []
agent_type: main_agent
---

# Source Capture

Capture citable sources as structured markdown files in `memory/sources/`. Sources provide provenance for facts in topic files and enable traceability back to canonical content.

**What qualifies as a source:** Any raw, original, or canonical content that could be cited as evidence or detail for a topic — meetings, documents, files, images, web pages, database exports, PDFs, spreadsheets, research papers, etc.

**How this skill is used:** Invoked on-demand when the user asks to save a source, during memory population from connectors, or automatically when high-value content is detected. Can also be triggered by phrases like "save this meeting", "capture this PDF", "store this research", or "archive this page".

## See also

- [memory-update](../memory-update/SKILL.md) — Extracts facts to topics during conversations; topics should cite sources
- [memory-cleanup](../beta/memory-cleanup/SKILL.md) — Maintains memory hygiene; handles stale sources
- [share-across-spaces](../share-across-spaces/SKILL.md) — For user-requested cross-space sharing of a captured source (the automated path is transcript-distribution)

## Persona

Archivist and knowledge curator, skilled at capturing external content with proper metadata and provenance to enable future retrieval and fact verification.

## Goal

Create well-structured source files that preserve first-party content with full provenance metadata, enabling topics to cite sources for traceability and allowing users to trace facts back to their origin. Always preserve the raw/original content so it can be interrogated or processed in different ways later.

## Context

Sources (`memory/sources/`) capture citable content that topics can reference:

**Communication sources:**
- **Meetings** — Transcripts from Fireflies, Otter, Fathom, Zoom, etc.
- **Slack/Teams threads** — Substantive discussions from messaging platforms
- **Email threads** — Important conversations from Gmail, Outlook, etc.

**Document sources:**
- **Notion/Confluence docs** — Pages and databases from knowledge bases
- **PDFs** — Reports, contracts, research papers, specifications
- **Spreadsheets** — Data exports, financial reports, analysis results
- **Linear/Jira tickets** — Feature specs, architectural decisions

**Media sources:**
- **Images** — Screenshots, diagrams, photos (store description + reference)
- **Web pages** — Articles, documentation, reference material
- **Database exports** — Query results, data snapshots

**Key distinction:** Sources are captured content with provenance. Topics are curated knowledge synthesized from sources and conversations. Topics cite sources; sources do NOT backlink to topics (one-way linking).

**Storage location:** Sources live in `Chief-of-Staff/memory/sources/`, organized by date. Distribution to shared spaces is handled separately by the distribution automation.

## Process

### 1. Determine if source file is warranted

**General principle:** Create a source file when the content is **citable** — you'd want to reference it later as evidence, support a claim, or trace back to the original. Skip when facts can be extracted directly to topics without losing important context.

**Decision heuristics:**

| Create Source File When... | Just Extract to Topics When... |
|---------------------------|-------------------------------|
| Content may be cited as evidence | Facts are self-evident, no provenance needed |
| Multiple facts could be extracted over time | Single fact, already captured |
| Original format/context matters | Only the conclusion matters |
| You'd want to "show your work" | Summary is sufficient |
| Content is from an authoritative/canonical source | Content is ephemeral or derivative |

**Common source types:**

| Source Type | Create Source File When... | Just Extract to Topics When... |
|-------------|---------------------------|-------------------------------|
| **Meetings** | Always (high-value by default) | Never — meetings always get files |
| **Documents (PDF, Notion, etc.)** | Rich, frequently-referenced content | Simple pages, ephemeral notes |
| **Message threads (Slack, email)** | Substantive discussions (5+ messages, decisions made) | Quick Q&A, logistics |
| **Tickets (Linear, Jira)** | Major features, architectural decisions | Bug fixes, small tasks |
| **Web pages** | Reference material, documentation, research | Transient content, news |
| **Data exports** | Snapshots you'll reference (reports, queries) | One-time lookups |
| **Images/media** | Diagrams, screenshots worth referencing | Decorative, ephemeral |

If the content doesn't warrant a source file, extract relevant facts directly to topic files using the memory-update skill instead.

### 2. Choose capture depth

Once you've decided to create a source file, determine whether to capture **full content** or **summary-only**.

**Guiding principles:**

1. **Meetings always get full capture** — Nuance lives in the detail of conversations. A summary might miss critical context, tone, or commitments. Never summarize-only for meetings.

2. **Stable URLs reduce duplication need** — If the canonical source has a reliable, permanent URL (e.g., a well-maintained Notion doc, published API docs), a summary with link is often sufficient. The user can always follow the link for detail.

3. **Bias toward summary for documents** — Especially for long documents, docs likely to change, or docs in well-organized systems. Full capture is warranted only for critical reference material you'll revisit often.

4. **Use judgment on likely reference patterns** — Will you cite specific passages? (Full capture.) Will you mostly just need "the gist" plus a way to find the original? (Summary-only.)

**Capture depth decision:**

| Source Type | Default Depth | Full Capture When... | Summary-Only When... |
|-------------|---------------|---------------------|---------------------|
| **Meetings** | Full | Always | Never |
| **Documents** | Summary | Critical reference, frequently cited, unstable URL | Long, likely to change, stable canonical URL |
| **Threads** | Full | Substantive decisions, complex discussions | N/A (if not worth full capture, skip the source file) |
| **Web pages** | Summary | Core reference material, may go offline | Stable docs site, easily re-findable |
| **Data exports** | Full | Snapshot-in-time evidence | N/A |

**Raw content is always preserved:** Regardless of capture depth, the full/raw transcript or text must always be included as an Appendix at the end of the file (when available). Summary and Key Takeaways sit above it for quick scanning, but the raw content is the evidentiary backbone — it enables re-processing, different analyses, and direct citation of the original. For summary-depth captures, add `capture_depth: summary` to frontmatter, but still include the Appendix.

### 3. Destination: Chief-of-Staff

All source capture writes go to Chief-of-Staff. Place every captured source under `Chief-of-Staff/memory/sources/`, regardless of source type, participants, sensitivity, or content. Do not route sources to any other space — distribution to shared spaces is handled separately by the distribution automation after a source has been captured and reviewed.

> **Reference: Meeting Sensitivity Classification (preserved for the distribution phase)**
>
> The guidance below is not used by source capture — source capture always writes to Chief-of-Staff. It is kept here as reference for the separate distribution automation, which decides whether a captured source is eligible to be shared into other spaces.
>
> - **Always-private meetings (no exceptions):** 1:1 meetings, performance reviews, PIPs, HR meetings, salary/compensation discussions, disciplinary meetings, manager-report/feedback meetings, and any meeting that appears to involve individual performance, employment matters, or personal HR topics based on the title, invite body, or transcript. These are never eligible for distribution.
> - **Broadcast-style meetings** — all-hands, town halls, company-wide announcements, large cross-team kickoffs. A high attendee count (e.g., 10+) or broadcast/informational format are signals of company-wide content that may be eligible for distribution. Use judgment — a 6-person board meeting is still company-wide and sensitive.
> - **Space exclusion policy check:** When evaluating distribution into a shared space, read that space's `README.md` and check for content exclusion policies. Look for phrases like "excludes", "no internal meetings", "personal HR", "private", "confidential", or "restricted". If the content matches any exclusion rule, keep it in Chief-of-Staff.

### 4. Generate filename and path

**Directory structure:** `memory/sources/YYYY/MM-MMM/DD/` where:
- `YYYY` — Four-digit year (e.g., `2025`)
- `MM-MMM` — Two-digit month with abbreviated name (e.g., `12-Dec`)
- `DD` — Two-digit day

Example: December 25, 2024 → `memory/sources/2024/12-Dec/25/`

**Filename format:** `yyMMdd_HHmm_source-type_description.md`
- `yyMMdd_HHmm` — Date and time the source occurred (e.g., `251215_1000` for 15 Dec 2025 at 10:00 AM). Use `0000` for time if unknown.
- `source-type` — Lowercase descriptor: `meeting`, `doc`, `pdf`, `thread`, `email`, `ticket`, `web`, `data`, `image`, etc.
- `description` — Brief hyphenated description (e.g., `quarterly-review`, `budget-discussion`)

**Examples:**
- `memory/sources/2025/12-Dec/15/251215_1000_meeting_q3-review.md`
- `memory/sources/2025/12-Dec/18/251218_1430_thread_architecture-discussion.md`
- `memory/sources/2025/12-Dec/20/251220_0000_pdf_annual-report.md`
- `memory/sources/2025/12-Dec/22/251222_0900_web_api-documentation.md`

Create the directory hierarchy if it doesn't exist.

### 5. Check for existing source (deduplication)

Before creating a new source file, search for existing sources with the same canonical identifier:
- Unique key: `{source_system}:{source_account}:{source_uid}`
- Search **within `Chief-of-Staff/memory/sources/`** for matching `source_system`, `source_account`, and `source_uid` in frontmatter

If a matching source exists in Chief-of-Staff:
- **Update** the existing file if the source content has changed (keep original `stored_at`, add `updated_at` if desired)
- **Skip** creation if the content is identical
- Report what was found to the user

### 6. Gather source metadata

Collect required frontmatter fields:

| Field | Description | Example |
|-------|-------------|---------|
| `description` | Brief description of this source | `Q3 quarterly review with leadership` |
| `source_type` | Category of source | `meeting`, `doc`, `pdf`, `thread`, `email`, `ticket`, `web`, `data`, `image` |
| `source_system` | Tool/platform that produced it | `fireflies`, `notion`, `slack`, `gmail`, `browser`, `postgres` |
| `source_account` | User account or workspace | `user@company.com`, `company-workspace` |
| `source_uid` | Unique ID within system+account | `abc123`, `page_xyz`, `thread_456` |
| `source_url` | URL to canonical source (or file path) | `https://fireflies.ai/meeting/abc123` |
| `stored_at` | Date file was created (YYYY-MM-DD) | `2025-12-15` |
| `occurred_at` | Date source was created/published (YYYY-MM-DD) | `2025-12-15` |

**Optional fields** (include when applicable):
- `participants` — List of people involved (for meetings/threads)
- `duration_minutes` — Meeting length
- `truncated` — Set to `true` if content was truncated
- `file_type` — Original file format (for documents: `pdf`, `xlsx`, `docx`, etc.)
- `author` — Creator/author of the source (for documents, articles)
- `capture_depth` — Set to `summary` for summary-only captures (omit for full captures)

### 7. Prepare content

Structure the source file content:

**Summary section:** Write a 3-5 sentence summary of key outcomes, decisions, or main points.

**Key Takeaways section:** Extract 3-7 bullet points of the most important facts, decisions, or action items.

**Appendix (raw content):** Always include the complete, unedited source content (transcript, document text, thread, etc.) as the final section of the file. This is the raw material — preserve it exactly as received so it can be re-interrogated, processed differently, or cited as evidence. The Summary and Key Takeaways above are derived from this; the Appendix is the canonical record.

**Truncation handling:** If full content exceeds 1MB:
1. Set `truncated: true` in frontmatter
2. Include a note at the start of the Appendix with the actual URL: `*Content truncated due to size. See full source at https://actual-url-here*`
3. Include as much content as fits under 1MB, prioritizing the beginning and any marked highlights
4. The Summary and Key Takeaways should still reflect the full source

**Summary-only captures:** Even for summary-depth captures, include the raw content as an Appendix when available. Only omit the Appendix when the raw content is genuinely inaccessible (e.g., behind a login wall with no API, or content that can't be extracted). In that case, note why in the file and ensure `source_url` provides the path to the original.

### 8. Create the source file

Use this template:

```markdown
---
description: [Brief description]
source_type: [meeting|notion|slack|email|linear]
source_system: [system name]
source_account: [account identifier]
source_uid: [unique id]
source_url: [canonical URL]
stored_at: [YYYY-MM-DD]
occurred_at: [YYYY-MM-DD]
truncated: false
---

# [Title]

## Summary

[3-5 sentence summary of key outcomes and decisions]

## Key Takeaways

- [Important fact or decision 1]
- [Important fact or decision 2]
- [Important fact or decision 3]

## Appendix: Raw Content

[Complete, unedited content from source — full transcript with speaker attribution for meetings, full document text, full thread, etc. Preserve exactly as received.]
```

### 9. Update related topics to cite the source

After creating the source file, automatically update topic files **within Chief-of-Staff only** to reference it:

1. **Search for related topics in Chief-of-Staff** using `@files` semantic search on the source's key subjects (people, projects, concepts from Key Takeaways). Restrict the search to Chief-of-Staff topic files.
2. **Update each relevant Chief-of-Staff topic** per [memory-update](../memory-update/SKILL.md): add source citation to "Sources" section, add new facts with timestamps
3. **Create new Chief-of-Staff topics** if warranted for significant subjects with no existing topic

Do not update topic files in shared spaces — citing a Chief-of-Staff source from a shared-space topic would leak information about private content. Shared-space topic updates are handled by the distribution automation after a source has been approved for distribution.

Do not ask permission — this is automatic maintenance following the source capture.

### 10. Freshness check (Actions cleanup)

After completing source capture, check if any active action items have been resolved by activity you observed during capture:
- Call rebel_inbox_list to get active items
- Cross-reference against the emails, calendar events, Slack activity, and documents you already retrieved in earlier steps
- If you find HIGH confidence evidence of completion (e.g., sent email to the exact person, document finalised), archive the item via rebel_inbox_update with archived=true and `resolution: 'completed'`, plus a short `evidenceNote` naming the evidence, plus `expectedTitle` (the item's exact title, copied verbatim) and `expectedThreadId` when it has an email reference — the server rejects the call if these don't match the id, so you never resolve the wrong item when handling several at once
- If an item is no longer relevant rather than done (e.g., its meeting is 24h+ past), archive with `resolution: 'stale'` plus a short `evidenceNote`, and — exactly as for `completed` above — `expectedTitle` (the item's exact title, copied verbatim) and `expectedThreadId` when it has an email reference; the server rejects the call if these don't match the id. It lands in the Auto-archived log the user reviews, not Completed
- Only archive when confident. When in doubt, leave it — false positives are worse than stale items
- Do NOT archive items less than 24 hours old

### 11. Acknowledge completion

Report source creation and topic updates:

```
Source captured:
- Created [Space Name](workspace://path/to/source/file.md): [brief description]

Topics updated:
- Updated [Space Name](workspace://path/to/topic.md): added source citation
```

If no related topics found: "No related topics to update"

## Source-Type Specific Guidance

The examples below cover common source types. For unlisted types, follow the general pattern: capture metadata that enables retrieval and verification, preserve the original content structure, and summarize key points.

### Meetings

**Always create source files for meetings** — they are high-value by default.

**Source systems:** Fireflies, Otter, Fathom, Zoom transcripts, Google Meet, Teams
**Getting content:** Use the appropriate MCP connector to retrieve meeting transcripts
**Key metadata:** Include `participants` and `duration_minutes`
**Content format:** Preserve speaker attribution in the transcript (e.g., `**Jane:** We should...`)

**Example frontmatter:**
```yaml
source_type: meeting
source_system: fireflies
source_account: user@company.com
source_uid: abc123xyz
source_url: https://app.fireflies.ai/view/abc123xyz
participants: [Jane Smith, Bob Chen, Carol Davis]
duration_minutes: 45
```

#### Handling Duplicate Meeting Sources

When the same meeting is captured by multiple notetakers (e.g., Rebel + Fireflies, or multiple external providers), **consolidate into a single source file** rather than creating duplicates.

**Detection:** Before creating a meeting source, search for existing meetings with:
- Same `occurred_at` date (within same day)
- Overlapping `participants`
- Similar title or meeting URL

**Consolidation approach:**

1. **Pick a canonical source** using this priority order: Rebel > Fathom > Fireflies > Notion > Zoom
2. **Use the canonical source's frontmatter** (`source_system`, `source_uid`, `source_url`)
3. **Add alternate sources** to frontmatter:
   ```yaml
   alternate_sources:
     - system: fireflies
       uid: abc123
       url: https://app.fireflies.ai/view/abc123
     - system: fathom
       uid: xyz789
       url: https://fathom.video/call/xyz789
   ```
4. **Merge content thoughtfully:**
   - Compare transcripts and summaries from each source
   - Use the best quality transcript (usually highest-priority source)
   - If sources disagree on key facts or quotes, note discrepancies at the top of the Summary section
   - Combine unique insights from each source's AI-generated summary into Key Takeaways

**Example discrepancy note:**
```markdown
## Summary

> **Note:** This meeting was captured by both Rebel and Fireflies. The sources differ on the Q2 budget figure ($450k vs $480k) — verify with Jane.

[Rest of summary...]
```

**When to keep separate files:** If the "duplicate" is actually a different segment of the same calendar event (e.g., breakout rooms, or someone joined late), keep them as separate source files with clear titles indicating the segment.

### Notion Docs

**Create source files for:** Rich, frequently-referenced documents, important specs, decision records
**Skip for:** Simple pages, ephemeral notes, personal scratch docs

**Source systems:** Notion
**Getting content:** Use Notion MCP to retrieve page content
**Key metadata:** Include page ID as `source_uid`, workspace as `source_account`

**Example frontmatter:**
```yaml
source_type: notion
source_system: notion
source_account: company-workspace
source_uid: 12345-abcde-67890
source_url: https://notion.so/page/12345-abcde-67890
```

### Slack Threads

**Create source files for:** Substantive discussions (5+ messages), threads with decisions, architectural discussions
**Skip for:** Quick Q&A, logistics, ephemeral chat

**Source systems:** Slack
**Getting content:** Use Slack MCP to retrieve thread messages
**Key metadata:** Include channel name and thread timestamp as identifier

**Example frontmatter:**
```yaml
source_type: slack
source_system: slack
source_account: company-workspace
source_uid: C01234567:1234567890.123456
source_url: https://company.slack.com/archives/C01234567/p1234567890123456
participants: [jane, bob, carol]
```

### Email Threads

**Create source files for:** Important negotiations, contract discussions, decision chains, long threads (5+ messages)
**Skip for:** Routine updates, FYIs, newsletters

**Source systems:** Gmail, Outlook
**Getting content:** Use Gmail/Outlook MCP to retrieve thread
**Key metadata:** Include thread ID, participants

**Example frontmatter:**
```yaml
source_type: email
source_system: gmail
source_account: user@company.com
source_uid: thread_abc123
source_url: https://mail.google.com/mail/u/0/#inbox/thread_abc123
participants: [jane@company.com, client@external.com]
```

### Tickets (Linear, Jira)

**Create source files for:** Major features, architectural decisions, important specs
**Skip for:** Bug fixes, small tasks, routine maintenance

**Source systems:** Linear, Jira, GitHub Issues
**Getting content:** Use appropriate MCP to retrieve issue details
**Key metadata:** Include issue identifier, project, status

**Example frontmatter:**
```yaml
source_type: ticket
source_system: linear
source_account: company-workspace
source_uid: ABC-123
source_url: https://tracker.example.com/company/issue/ABC-123
```

### PDFs and Documents

**Create source files for:** Reports, contracts, research papers, specifications worth referencing
**Skip for:** Ephemeral documents, drafts, documents already in a linked knowledge base

**Source systems:** Local files, Google Drive, Dropbox, email attachments
**Getting content:** Extract text content; for complex layouts, summarize key sections
**Key metadata:** Include `file_type`, `author` if known, original filename in description

**Example frontmatter:**
```yaml
source_type: pdf
source_system: gdrive
source_account: user@company.com
source_uid: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
source_url: https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
file_type: pdf
author: Research Team
```

### Web Pages

**Create source files for:** Reference documentation, research articles, important external content
**Skip for:** Transient news, pages likely to change frequently, content you won't cite

**Source systems:** Browser, web archives
**Getting content:** Capture the relevant content sections, not navigation/ads
**Key metadata:** Include page title, publication date if available

**Example frontmatter:**
```yaml
source_type: web
source_system: browser
source_account: personal
source_uid: docs.example.com/api/v2/authentication
source_url: https://docs.example.com/api/v2/authentication
author: Example Inc
```

### Data Exports

**Create source files for:** Query results, report snapshots, data you'll reference as evidence
**Skip for:** One-time lookups, frequently-refreshed data

**Source systems:** Database clients, BI tools, spreadsheets
**Getting content:** Include the query/parameters used to generate the data
**Key metadata:** Include query details or export parameters

**Example frontmatter:**
```yaml
source_type: data
source_system: postgres
source_account: analytics-db
source_uid: quarterly_revenue_2025q3
source_url: internal://analytics/quarterly_revenue_2025q3
```

### Images and Media

**Create source files for:** Diagrams, screenshots, photos you'll reference or cite
**Skip for:** Decorative images, screenshots of text (capture the text instead)

**Getting content:** Store a description of the image content; reference the actual file location
**Key metadata:** Describe what the image shows; include dimensions if relevant

**Example frontmatter:**
```yaml
source_type: image
source_system: screenshot
source_account: local
source_uid: architecture-diagram-v2
source_url: workspace://assets/diagrams/architecture-v2.png
```

**Content format:** For images, the "Full Content" section should contain a detailed description of what the image shows, not the image itself. Include the path/URL to the actual image file.

## Important

- **One-way linking only** — Sources do NOT backlink to topics. Topics cite sources for provenance.
- **Always preserve raw content** — Every source file must include the full/raw transcript or text as an Appendix (when available). This is non-negotiable — raw materials enable re-processing, different analyses, and direct citation of the original as evidence.
- **Meetings always get files** — Never skip source file creation for meetings.
- **Provenance is mandatory** — Every source must have `source_url` pointing to the canonical source.
- **Use exact dates** — `occurred_at` is when the source happened, not when you captured it. `stored_at` is today.
- **Respect 1MB limit** — Truncate and set `truncated: true` if content exceeds 1MB. Always note where to find full content.
- **Uniqueness via compound key** — `source_system:source_account:source_uid` must be globally unique. Check before creating.
- **All capture writes go to Chief-of-Staff** — sensitivity does not change routing; every captured source lands in `Chief-of-Staff/memory/sources/`. Distribution to shared spaces is a separate, post-capture decision made by the distribution automation.
- **Don't duplicate existing files** — Always check for existing sources with the same identifier before creating.
- **Summary and Key Takeaways should reflect full content** — Even if truncated, these sections should summarize the complete source.
- **Optimize for semantic search** — Front-load key topics/keywords in Summary section; these files are indexed and the first ~500 chars heavily influence `@files` retrieval.

## Success Criteria

- Source file created with complete frontmatter metadata
- Content properly structured with Summary, Key Takeaways, and Appendix (raw content) sections
- File placed in Chief-of-Staff and date-based directory
- No duplicate source files for the same canonical source
- Truncation handled correctly if content exceeds 1MB
- User informed of completion with file path