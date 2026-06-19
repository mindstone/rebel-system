---
name: calendar-check-availability
description: "Check when the user is free this week by analyzing their Google Calendar"
---

# Calendar Check Availability

Check the user's Google Calendar to find free time slots for the current week.

## Purpose

Quickly identify when the user has availability for meetings or focused work time by analyzing their calendar events for the current week.

## Process

1. **Determine the current week**
   - Get today's date
   - Calculate the start (Monday) and end (Sunday/Friday) of the current week
   - Default to Monday-Friday unless user specifies they want weekend availability

2. **Access Google Calendar via MCP**
   - Use the Google Calendar MCP to access calendar data
   - First discover the calendar actions available
   - Retrieve calendar events for the specified date range

3. **Analyze availability**
   - Identify time slots without scheduled events
   - Consider typical working hours (9 AM - 6 PM unless user specifies otherwise)
   - Group consecutive free slots together
   - Exclude very short gaps (< 30 minutes) unless user requests granular detail

4. **Present findings**
   - Organize by day of the week
   - Show free time slots in a clear, scannable format
   - Highlight longer blocks of free time (2+ hours) for deep work
   - Indicate if any days are completely free or completely booked

## Output Format

Present availability in this format:

```
📅 Week of [Date Range]

**Monday, [Date]**
- 9:00 AM - 10:30 AM (1.5 hours)
- 2:00 PM - 4:00 PM (2 hours)

**Tuesday, [Date]**
- Fully booked

**Wednesday, [Date]**
- 10:00 AM - 12:00 PM (2 hours)
- 3:30 PM - 6:00 PM (2.5 hours)

[etc.]

**Summary:**
- Longest free block: [Day], [Time] ([Duration])
- Most open day: [Day] ([X] hours free)
- Total free time this week: [X] hours
```

## Usage Examples

**Basic check:**
> "When am I free this week?"

**Specific need:**
> "When do I have 2+ hour blocks free this week for deep work?"

**Extended range:**
> "Show me my availability for the next two weeks"

**Specific days:**
> "Am I free on Thursday or Friday afternoon?"

## Parameters (Flexible)

- **Date range**: Default to current week (Mon-Fri), but can be adjusted based on user request
- **Working hours**: Default to 9 AM - 6 PM, but can be customized
- **Minimum slot duration**: Default to 30 minutes, but can show smaller gaps if requested
- **Calendar selection**: Default to primary calendar, but can specify which calendars to check

## Implementation Notes

- Use `mcp_discover_server_categories_or_actions` to find Google Calendar actions
- Use appropriate calendar list/event retrieval actions
- Handle timezone conversions appropriately
- Consider recurring events
- Respect calendar privacy settings

## Error Handling

- If Google Calendar access fails, guide user through authentication
- If no calendar found, suggest checking MCP connectivity
- If date parsing unclear, ask for clarification rather than assuming

## Related Skills

- [meeting-external-prep](meeting-external-prep/SKILL.md) - Prepare for upcoming meetings
- [meeting-weekly-brief](meeting-weekly-brief/SKILL.md) - Get weekly meeting overview





