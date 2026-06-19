---
name: calendar-create-event-mcp
description: "Create Google Calendar events using Google Calendar MCP with proper datetime formatting and rich descriptions"
agent_type: main_agent
last_updated: 2025-01-07
---

# Create Calendar Events with MCP

## [GOAL]

Create Google Calendar events using Google Calendar MCP with proper formatting, rich descriptions, and user-friendly titles.

## [CONTEXT]

Google Calendar MCP provides access to Google Calendar. This skill covers the technical details for creating events correctly.

## [IMPORTANT]

**Critical requirements:**

- **Use simplified datetime format**: Google Calendar MCP uses `start_datetime` and `end_datetime` (NOT nested objects)
- **ISO 8601 format**: `"2025-11-11T14:00:00+00:00"` with timezone offset
- **Rich descriptions**: Include context, "note to future me", implementation intentions, success criteria
- **Clear titles**: Use descriptive titles with context tags (e.g., "MINDSTONE_OS: Weekly Review")
- **Set reminders**: Add appropriate reminders (e.g., 15 minutes before, at event time)
- **Get confirmation**: Always review proposed events with user before creating

## [PROCESS]

1. **Determine event details**:
   - Title (clear, motivating, with context tag if relevant)
   - Start datetime (ISO 8601 with timezone)
   - End datetime (ISO 8601 with timezone)
   - Description (rich, includes user's own words about "why")
   - Reminders (if needed)

2. **Format datetime correctly**:
```json
{
  "start_datetime": "2025-11-11T14:00:00+00:00",
  "end_datetime": "2025-11-11T15:00:00+00:00"
}
```

3. **Create rich description** including:
   - **"Note to future me"**: User's own words about why this matters
   - **Implementation intention**: When-then plan
   - **Success criteria**: What success looks like
   - **Resources**: Links to docs, tools, or context

4. **Call Google Calendar MCP** with parameters:
   - `summary`: Event title
   - `start_datetime`: ISO 8601 format
   - `end_datetime`: ISO 8601 format
   - `description`: Rich text with context
   - `reminders`: Array of reminder objects (optional)

5. **Confirm with user**: Show created event details and get confirmation

## [EXAMPLES]

### Single Event
```json
{
  "summary": "MINDSTONE_OS: 2-Week Check-in with Chief of Staff",
  "start_datetime": "2025-11-23T10:00:00+00:00",
  "end_datetime": "2025-11-23T10:30:00+00:00",
  "description": "Note to future me: I want to see if my daily AI habit is actually saving me time, or if I'm just playing with new toys.\n\nReview questions:\n- What's working with my AI-first approach?\n- What's not working?\n- What do I need to adjust?\n\nSuccess: I have clarity on whether to continue, adjust, or stop my current approach."
}
```

### Peer Accountability Meetup
```json
{
  "summary": "MINDSTONE_OS: Founder Peer Accountability Meetup",
  "start_datetime": "2025-11-25T16:00:00+00:00",
  "end_datetime": "2025-11-25T17:00:00+00:00",
  "description": "Note to future me: I'm meeting with [Name] and [Name] from the ICE AI workshop to share progress, tips, and help unblock each other.\n\nAgenda:\n- Quick wins this week\n- Biggest challenge\n- One specific ask for help\n\nSuccess: I leave with one concrete tip I can use, and I helped someone else move forward."
}
```

## See Also

- [accountability-buddy-calendar-commitments](../thinking/accountability-buddy-calendar-commitments/SKILL.md) - main accountability planning skill that uses this
- [calendar-check-availability](../meetings/calendar-check-availability/SKILL.md) - checking calendar availability before scheduling

