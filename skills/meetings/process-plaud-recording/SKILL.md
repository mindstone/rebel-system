---
name: process-plaud-recording
description: Process a voice recording synced from a Plaud device (NotePin, Note, NotePro)
---

# Process Plaud Recording

Process a voice recording synced from a Plaud device (NotePin, Note, NotePro).

## When to Use

This skill is invoked automatically by Rebel's Plaud sync service when a new recording is downloaded from the Plaud cloud. You don't need to invoke it manually.

## Input

You'll receive paths to two files in the staging area:

1. **Audio file**: `{userData}/plaud/pending/{id}.mp3` - The recording audio
2. **Metadata file**: `{userData}/plaud/pending/{id}.meta.json` - Recording info from Plaud

The metadata file contains:
```json
{
  "id": "<PLAUD_RECORDING_ID>",
  "name": "2026-01-11 14:37:34",
  "created_at": "2026-01-11T15:39:48",
  "start_at": "2026-01-11T14:37:34",
  "duration": 72000,
  "serial_number": "8801030169934415"
}
```

Note: `duration` is in milliseconds (divide by 60000 for minutes).

## Steps

### 1. Read the metadata file

Parse the JSON to get recording details.

### 2. Transcribe the audio

Use Whisper to transcribe the MP3 file. The audio is 16kHz mono MP3, which Whisper accepts directly.

**For files > 24MB**: Use ffmpeg to split into 10-minute chunks before transcription:
```bash
ffmpeg -i input.mp3 -f segment -segment_time 600 -c copy chunk_%03d.mp3
```
Then transcribe each chunk and concatenate the results.

### 3. Generate a smart title

Analyze the transcript to create a meaningful title. Good titles describe:
- The main topic or purpose of the conversation
- Key participants if identifiable
- The type of meeting (standup, review, interview, etc.)

Examples:
- "Q1 Budget Review with Finance Team"
- "Product Roadmap Planning Session"
- "One-on-One with Sarah - Performance Review"

**Fallback**: If the transcript is too short or unclear, use: `Plaud Recording - {date} {time}`

### 4. Determine destination space

Check the user's settings for `physicalMeetingSpaceId`. If not set, default to Chief of Staff space.

### 5. Generate the filename

**CRITICAL**: Follow this exact naming convention or the UI won't recognize it as a meeting:

```
Folder:   {space}/memory/sources/YYYY/MM-MMM/DD/
Filename: yyMMdd_HHmm_meeting_plaud_{sanitized-title}.md
```

Where:
- `YYYY` = 4-digit year (e.g., 2026)
- `MM-MMM` = 2-digit month + abbreviation (e.g., 01-Jan)
- `DD` = 2-digit day
- `yy` = 2-digit year
- `HHmm` = hours and minutes (24h format)
- `sanitized-title` = lowercase, hyphens only, max 50 chars

Example: `Chief-of-Staff/memory/sources/2026/01-Jan/11/260111_1437_meeting_plaud_q1-budget-review.md`

### 6. Create the file with frontmatter

Use this exact frontmatter schema:

```yaml
---
description: "Q1 Budget Review with Finance Team"
source_type: meeting
source_system: plaud
source_account: user@example.com
source_uid: plaud_<PLAUD_RECORDING_ID>
source_url: "urn:plaud:recording:<PLAUD_RECORDING_ID>"
occurred_at: 2026-01-11
stored_at: 2026-01-13
truncated: false
duration_minutes: 45
device: "Plaud"
review_status: pending
---
```

Required fields:
- `source_type: meeting` - always "meeting"
- `source_system: plaud` - identifies the source
- `source_uid: plaud_{id}` - prefixed for uniqueness
- `source_url` - URN format
- `occurred_at` - date (YYYY-MM-DD) from `start_at`
- `stored_at` - today's date
- `duration_minutes` - integer (duration / 60000)
- `review_status: pending` - enables review queue

### 7. Write the content

Format:
```markdown
# {Smart Title}

*Recorded in-person with Plaud*

## Full Content

{Whisper transcript}
```

### 8. Clean up staging files

Delete the `.mp3` and `.meta.json` files from the staging area after successful save.

### 9. Notify the user via Actions

Use the RebelInbox MCP to add a success notification. Write it like a capable chief of staff reporting back:

```
rebel_inbox_add({
  title: "Meeting saved: {Smart Title}",
  text: "{One sentence summary of what the meeting covered}",
  source: { kind: "text", label: "Plaud" }
})
```

Good summaries are conversational and informative:
- "Budget review covering Q1 projections and marketing spend allocations."
- "Weekly sync with the product team about launch timeline and blockers."  
- "Interview with a senior engineer candidate discussing system design."

### 10. Report success

Confirm the recording was processed successfully, mentioning the title and where it was saved.

## Error Handling

- If Whisper fails, report the error and leave staging files for retry
- If file write fails, report the error and leave staging files for retry
- If title generation fails, use the fallback title format
