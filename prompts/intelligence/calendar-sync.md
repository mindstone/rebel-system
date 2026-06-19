---
description: Calendar sync prompt that queries connected calendar MCPs and populates meeting cache
service: src/core/services/calendarSyncService.ts
variables: []
model_hint: sonnet
critical: false
---
You are syncing the user's calendar to populate the meeting cache.

## Your Task

1. Query all connected calendar MCPs for meetings in the time range: **7 days ago to 7 days ahead** (14 day window):
   - If Google Workspace is connected, use list_workspace_calendar_events with `return_json: true` for structured data (response is `{ timezoneInfo, referenceTimeUTC, events }` — extract events from the `events` field)
   - If Microsoft 365 is connected, use list_events with `returnText: false` for structured data (response is `{ timezoneInfo, referenceTimeUTC, events }`)
   - Query ALL connected calendar accounts (there may be multiple Google/Microsoft accounts)
   - Pass the user's timezone (from the system prompt timezone field) for fallback resolution: Google calendar tools use `device_timezone` (snake_case); Microsoft calendar tools use `deviceTimezone` (camelCase)

2. For each meeting found, extract:
   - id: Create a composite ID like "google:{eventId}" or "microsoft:{eventId}"
   - calendarEventId: The provider's event ID
   - calendarSource: "google" or "microsoft"
   - title: Meeting title
   - startTime: ISO 8601 datetime
   - endTime: ISO 8601 datetime
   - meetingUrl: Video call URL if available (OMIT this field entirely if no URL found - do NOT pass null or empty string). Check these fields for URLs:
     * conferenceData.entryPoints[].uri (Google - prefer video type)
     * hangoutLink (Google)
     * onlineMeeting.joinUrl (Microsoft)
     * location field (often contains Zoom/Teams links)
     * description field (scan for zoom.us, meet.google.com, teams.microsoft.com URLs)
   - participants: List of attendee names/emails (OMIT if empty - do NOT pass null)

3. Call rebel_meetings_sync (from RebelMeetings MCP) with:
   - meetings: Array of all meetings found
   - syncWarnings: Array of warnings for any calendar sources that failed
     - Example: ["Microsoft365Calendar: auth error", "GoogleWorkspace: 502 Bad Gateway"]
     - If a calendar tool returns an error or empty error, add it to syncWarnings
     - Only add warnings for sources you actually tried to query

4. If no calendar MCPs are connected, call rebel_meetings_sync with:
   - meetings: []
   - syncWarnings: ["No calendar sources connected"]

## Important

- Include meetings from 7 days ago to 7 days ahead (for meeting history tracking)
- Include only meetings the user has accepted (Google: attendee with self:true should have responseStatus "accepted"; Microsoft: current user's responseStatus should be "accepted" or "organizer")
- Exclude cancelled events (status: "cancelled")
- Deduplicate if the same meeting appears in multiple calendars
- Extract meeting URLs thoroughly - check conferenceData, hangoutLink, location, description, and onlineMeeting fields. Missing URLs means meetings won't appear in the UI.
- ALWAYS report syncWarnings for any calendar source that fails or returns errors
- This is a background sync - be efficient and don't ask questions
