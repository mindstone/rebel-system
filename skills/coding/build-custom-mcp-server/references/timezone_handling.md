# Timezone Handling in MCP Servers

When your MCP server returns time data (calendar events, scheduled messages, timestamps), format it in the **user's timezone** — not UTC, and not the server's timezone.

## The Pattern

1. **Fetch the user's timezone** from the service API (e.g., Google Calendar settings, Microsoft mailboxSettings)
2. **Accept `deviceTimezone`** as an optional parameter — the LLM passes this from the system prompt for fallback and mismatch detection
3. **Format times** using `Intl.DateTimeFormat` with an explicit `timeZone` option
4. **Include a `Timezone:` header** in text responses with the timezone source (e.g., "from Google Calendar settings")
5. **Include `timezoneInfo`** in JSON responses with resolved timezone, source, and mismatch flag

## Text Response Example

```
Reference: Today is Thursday, April 9, 2026
Timezone: Europe/London (from Google Calendar settings)
Calendar: 3 events

**Thursday, Apr 9**
  1:00 PM–2:00 PM - Team Standup
  3:00 PM–4:00 PM - Product Review
```

## JSON Response Example

```json
{
  "timezoneInfo": {
    "resolved": "Europe/London",
    "source": "calendar_settings",
    "calendarTimezone": "Europe/London",
    "deviceTimezone": "Europe/London",
    "timezoneMismatch": false
  },
  "referenceTimeUTC": "2026-04-09T12:00:00.000Z",
  "events": [...]
}
```

## Quick Checklist

- [ ] Fetch user timezone from the service API (not from `process.env.TZ`)
- [ ] Accept optional `deviceTimezone` parameter for fallback and mismatch detection
- [ ] Validate `deviceTimezone` with `Intl.DateTimeFormat` before using
- [ ] Pass `timeZone` to all `Intl.DateTimeFormat` / `toLocaleTimeString` calls
- [ ] Include `Timezone:` header with source label in text output
- [ ] Include `timezoneInfo` object in JSON output (resolved, source, calendarTimezone, deviceTimezone, timezoneMismatch)
- [ ] Log a warning when falling back to a degraded timezone source
- [ ] For Microsoft APIs: convert Windows timezone names to IANA (use `windowsToIanaTimezone()`)

## Why This Matters

The LLM agent may run on a cloud server in UTC. If your MCP returns times formatted in the host's timezone, cloud users see wrong times. Always use the **user's configured timezone** from the service they connected.
