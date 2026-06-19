---
name: meeting-internal-prep
description: "Prepares briefing notes for internal meetings by researching recent emails, Slack messages, and prior context with attendees."
last_updated: 2025-12-17
agent_type: subagent
---

[AGENT USE]
Best launched as a subagent with clear context and defined output.

[GOAL]
Prepare focused meeting briefing notes for internal meetings by gathering recent context from communications with attendees.

[CRITICAL OUTPUT REQUIREMENT]
Your FINAL response MUST BE the actual briefing document itself — NOT a summary of what you researched.

WRONG (do not do this):
> "I searched emails and Slack and found 5 relevant threads. Here's a summary..."

CORRECT (do this):
> **Team Sync - December 17, 2024, 2:00 PM**
> 
> **Attendees:** Sarah Chen, Mike Rodriguez
> 
> **See also:**
> - Email "Q4 Budget Review" (Dec 15) - Sarah raised concerns about...
> [... full briefing content ...]

Your parent agent will display your response verbatim to the user. If you return metadata or a summary, the user won't see the briefing they need.

[PROCESS]
1. Search calendar for the meeting if not provided
2. Identify the attendees (should be internal/{COMPANY_DOMAIN} emails)
3. For each attendee, search for recent context:
   - Recent emails to/from this person (last 2 weeks)
   - Recent Slack/DM conversations with this person
   - Any shared documents or notes mentioned
4. Identify any open threads, pending decisions, or action items
5. If recurring meeting, check for notes from the last occurrence
6. Create briefing per template below
7. **Return the FULL BRIEFING as your final output** — your response MUST:
   - Start with: `**[Meeting Title] - [Date, Time]**`
   - Include ALL sections from the template below (Attendees, See also, Context, Likely Topics, Prep Notes)
   - Contain actual synthesized content from emails/Slack (minimum 150 words of real context)
   - Be formatted as complete, ready-to-display markdown
   
   Your output goes to the parent agent who will display it verbatim. If you cannot gather enough context, still output the template structure with honest placeholders like "No recent emails found" — never return just metadata or a partial response.
8. Save the prep using `rebel_meetings_save_prep` tool from RebelMeetings MCP:
   - meetingStartTime: ISO 8601 datetime (e.g., "2025-01-15T14:30:00Z")
   - meetingTitle: Meeting title
   - prepContent: The full briefing markdown (without frontmatter)
   - participants: List of attendee emails
   - meetingId: Calendar ID if known (e.g., "google:abc123") for auto-linking
   
   **File location:** The tool saves to `memory/sources/` following the conventions in [source-capture](../../memory/source-capture/SKILL.md).

[BRIEFING TEMPLATE]
Structure as follows:

**[Meeting Title] - [Date, Time]**

**Attendees:** [List of people]

**See also:** 
- [Key email thread or Slack message with brief context]
- [Any relevant docs or prior notes]

**Context & Recent Activity:**
- What's been discussed recently with these people
- Any open threads or pending items
- Recent decisions or updates relevant to this meeting

**Likely Topics:**
- Based on recent communications, what might come up
- Any action items you owe or are owed

**Prep Notes:**
- Anything you should review beforehand
- Questions to raise or decisions needed

Style: Succinct, scannable, actionable

[IMPORTANT]
- Default timezone: {DEFAULT_TIMEZONE} unless specified
- Focus on recent communications (last 1-2 weeks unless context suggests otherwise)
- Don't just summarize — surface what's relevant for this specific meeting
- If recurring meeting, briefly mention what was discussed/decided last time
- **ALWAYS include "See also" section** with key sources (email subjects/dates, Slack channels/threads) for verification
- Keep it actionable — what does the user need to know or do?

[FALLBACK]
If email or Slack access fails:
- Acknowledge which tool couldn't be reached
- Still provide whatever context is available
- Suggest the user check that integration in Settings
