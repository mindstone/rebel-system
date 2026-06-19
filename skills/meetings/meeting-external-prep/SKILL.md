---
name: meeting-external-prep
description: "Prepares comprehensive meeting briefing notes for external meetings using internal CRM research and web research for participant and company context."
last_updated: 2025-12-17
agent_type: subagent
---

[AGENT USE]
Best launched as a subagent with clear context and defined output.

[GOAL]
Prepare best possible meeting briefing notes, 1 per external meeting

[CRITICAL OUTPUT REQUIREMENT]
Your FINAL response MUST BE the actual briefing document itself — NOT a summary of what you researched.

WRONG (do not do this):
> "I researched the company and found several articles. I also checked emails..."

CORRECT (do this):
> **Meeting: December 17, 2024 - Partnership Discussion with Acme Corp**
> 
> **See also:**
> - Email "Follow-up from demo" (Dec 10) - They expressed interest in...
> [... full briefing content ...]

Your parent agent will display your response verbatim to the user. If you return metadata or a summary, the user won't see the briefing they need.

[PROCESS]
1. Search calendar for the meeting if not provided
2. Continue only if attendees include non-{COMPANY_DOMAIN} emails
3. Run internal-CRM-researcher for emails/transcripts with the same people
4. Run web-researcher for company + individual participant research
5. Create briefing per template below
6. **Return the FULL BRIEFING as your final output** — your response MUST:
   - Start with: `**Meeting: [date] - [meeting title]**`
   - Include ALL sections from the template below (See also, Meeting goal, Participant info, Company info, Industry context)
   - Contain actual researched content (minimum 200 words of real context from emails, web research, etc.)
   - Be formatted as complete, ready-to-display markdown
   
   Your output goes to the parent agent who will display it verbatim. If you cannot gather enough context, still output the template structure with honest placeholders like "No prior emails found" — never return just metadata or a partial response.
7. Save the prep using `rebel_meetings_save_prep` tool from RebelMeetings MCP:
   - meetingStartTime: ISO 8601 datetime (e.g., "2025-01-15T14:30:00Z")
   - meetingTitle: Meeting title
   - prepContent: The full briefing markdown (without frontmatter)
   - participants: List of attendee emails
   - meetingId: Calendar ID if known (e.g., "google:abc123") for auto-linking
   
   **File location:** The tool saves to `memory/sources/` following the conventions in [source-capture](../../memory/source-capture/SKILL.md).

[BRIEFING TEMPLATE]
Structure as follows:
- **Title**: Meeting: [date] - [meeting title]
- **See also** section at top: Key sources (emails, Slack messages, .md files, URLs) with brief context for each - follow [signposting-to-single-source-of-truth](../../documentation/signposting-to-single-source-of-truth/SKILL.md) guidelines
- Meeting goal
- Participant info (relevant background)
- Company info (recent news relevant to meeting)
- Industry context (anecdotes, climate, examples)

Style: Succinct, complete, tailored, easy to read

[IMPORTANT]
- Default timezone: {DEFAULT_TIMEZONE} unless specified
- Date field format: {"start": "YYYY-MM-DD"}
- Make sure the date is part of the title of the note you save
- If database errors: try title-only first, omit complex fields
- Set date/tag fields appropriately when saving
- Be extremely detailed in your output
- If the meeting is a recurring meeting, briefly mention what was discussed last time as well
- **ALWAYS include "See also" section at top** with key sources (emails by subject/date, Slack messages, .md files with relative paths, URLs). Keep concise - one line per source with brief context. Good signposting enables verification and follow-up