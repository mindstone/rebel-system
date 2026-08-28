---
description: "How to use physical voice recorders like Limitless Pendant and Plaud to capture in-person meetings and conversations."
last_updated: "2026-08-28"
---

# Voice Recorders

Rebel integrates with physical voice recorders to capture in-person meetings, conversations, and ideas when you're away from your computer. Your recordings get the same AI analysis as video meetings.


## See Also

- [Voice and Audio](library://rebel-system/help-for-humans/voice-and-audio.md) — Voice input, transcription providers, and audio settings
- [Meetings and Notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) — Video meeting capture and notetaker
- [Spaces](library://rebel-system/help-for-humans/spaces.md) — Where transcripts are stored
- [Actions](library://rebel-system/help-for-humans/actions.md) — Meeting analysis results appear in your Actions


## Supported Devices

| Device | Connection | Best For |
|--------|------------|----------|
| **Limitless Pendant** | Bluetooth (real-time) | Always-on capture, instant access |
| **Plaud NotePin/Note** | Cloud sync | Portable recording, longer battery |


## Limitless Pendant

The Limitless Pendant connects via Bluetooth for real-time audio streaming. Press the button to start recording, and your transcript appears moments after you stop.

### Setup

1. Go to **Settings → Meetings → Voice Recorders**
2. Ensure Bluetooth is enabled on your computer
3. Click **Scan for devices**
4. Select your Limitless Pendant from the list
5. Wait for pairing to complete

Once paired, Rebel auto-connects to your Pendant on startup.

### Recording

- **Start:** Press the button on your Pendant (Rebel detects it automatically)
- **During:** You'll see a recording indicator with elapsed time
- **Stop:** Press the button again
- **After:** Transcript appears in your workspace within a minute or two

### What You'll See

When connected, a status indicator shows:
- Device name
- Battery level
- "Record" button (for manual start)

During recording, the meeting status indicator shows the active recording state.

### Where Transcripts Go

Transcripts are saved to your configured space:
- **Default:** Chief of Staff space
- **Path:** `memory/sources/YYYY/MM-MMM/DD/`
- **Filename:** `yyMMdd_HHmm_meeting_limitless_smart-title.md`

Change the destination in **Settings → Meetings → Transcript Storage**.

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Device not found | Ensure Bluetooth is enabled in System Settings |
| Won't connect | Try factory resetting the Pendant, then re-pair |
| Disconnects frequently | Move closer to your computer; check Pendant battery |
| No transcript after recording | Check that transcription is configured. The live Limitless path still needs OpenAI set up today |


## Plaud Devices

Plaud devices (NotePin, Note, NotePro) sync via the cloud. Record on your device, sync through the Plaud mobile app, and Rebel pulls the finished transcript automatically.

Plaud transcribes these recordings in its app. Your voice provider in Rebel does not affect Plaud sync.

### Setup

1. Go to **Settings → Meetings → Voice Recorders**
2. Click **Connect Plaud**
3. Sign in to your Plaud account
4. Grant Rebel permission to access your recordings

### Recording Workflow

1. **Record** on your Plaud device as usual
2. **Sync** via the Plaud mobile app and let Plaud finish the transcript
3. **Wait** — Rebel checks for finished transcripts every 15 minutes
4. **Done** — Transcript appears in your workspace with an AI-generated title

Click **Sync Now** in Settings to import immediately instead of waiting.

### Where Transcripts Go

Same location as Limitless recordings:
- **Path:** `memory/sources/YYYY/MM-MMM/DD/`
- **Filename:** `yyMMdd_HHmm_meeting_plaud_smart-title.md`

### Large Recordings

Plaud handles transcription before Rebel imports anything, including long recordings. If Plaud has not finished yet, Rebel waits and checks again. After a day, Rebel adds an Action explaining how to finish the transcript in Plaud; the next sync will pick it up.

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Recordings not syncing | Open the Plaud mobile app and ensure recordings uploaded and finished transcribing |
| "Not connected" error | Re-authenticate in Settings → Meetings |
| Missing old recordings | Rebel imports new recordings; very old ones may not appear |
| Sync stuck | Click **Sync Now** to force a fresh sync |
| Recording is waiting for a transcript | Open the Plaud app and let Plaud finish transcribing it, then click **Sync Now** or wait for the next check |


## Transcript Format

Both devices produce identical transcripts with:
- AI-generated title based on content
- Date, time, and duration
- Device type and account info
- Full transcript text

**Note:** Physical recordings produce single-speaker transcripts (no speaker labels) because they capture one mixed audio stream, unlike video meetings where each participant has separate audio.


## Tips

- **Long recordings:** Plaud handles its own transcription before Rebel imports the finished transcript.
- **Background noise:** Find a quieter spot when possible — transcription quality depends on audio clarity
- **Battery life:** The Limitless indicator shows battery level; charge before important meetings
- **Multiple devices:** You can have both Limitless and Plaud connected simultaneously
- **Pending recordings:** If transcription fails, a counter appears near the microphone button. Tap it to see what's waiting, retry, or dismiss. See [Voice and Audio](library://rebel-system/help-for-humans/voice-and-audio.md) for details.
