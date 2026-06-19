---
description: "How to use physical voice recorders like Limitless Pendant and Plaud to capture in-person meetings and conversations."
last_updated: "2026-04-16"
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
| No transcript after recording | Check that transcription is configured. Plaud follows your active voice provider; the live Limitless path still needs OpenAI set up today |


## Plaud Devices

Plaud devices (NotePin, Note, NotePro) sync via the cloud. Record on your device, sync through the Plaud mobile app, and Rebel pulls the recording automatically.

Plaud transcription follows the voice provider you have selected in **Settings → Agent & Voice → Voice**. That can be OpenAI Whisper, ElevenLabs Scribe, or a local model such as Moonshine (and Parakeet on desktop).

### Setup

1. Go to **Settings → Meetings → Voice Recorders**
2. Click **Connect Plaud**
3. Sign in to your Plaud account
4. Grant Rebel permission to access your recordings

### Recording Workflow

1. **Record** on your Plaud device as usual
2. **Sync** via the Plaud mobile app (recordings upload to Plaud's cloud)
3. **Wait** — Rebel checks for new recordings every 15 minutes
4. **Done** — Transcript appears in your workspace with an AI-generated title

Click **Sync Now** in Settings to import immediately instead of waiting.

### Where Transcripts Go

Same location as Limitless recordings:
- **Path:** `memory/sources/YYYY/MM-MMM/DD/`
- **Filename:** `yyMMdd_HHmm_meeting_plaud_smart-title.md`

### Large Recordings

Plaud recordings can be long — hour-long meetings, full-day conferences, the lot. Rebel handles this automatically:

- **Size-based chunking**: When a recording exceeds the active provider's file limit, Rebel splits it into optimally-sized pieces when needed
- **Per-chunk retries**: If any piece fails (timeout, network blip), just that piece is retried — not the entire recording
- **Parallel processing**: Chunks are transcribed concurrently for faster results on long recordings
- **Provider-aware behaviour**: ElevenLabs Scribe can usually handle very large files directly, while local providers such as Moonshine still work fine — they just follow their own processing path

You don't need to do anything special. Record as long as you like; Rebel figures out the rest.

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Recordings not syncing | Open Plaud mobile app and ensure recordings uploaded to cloud |
| "Not connected" error | Re-authenticate in Settings → Meetings |
| Missing old recordings | Rebel imports new recordings; very old ones may not appear |
| Sync stuck | Click **Sync Now** to force a fresh sync |
| Transcription fails after sync | Check the voice provider selected in **Settings → Agent & Voice → Voice**. Cloud providers need the right API key; local Moonshine also works if its model is installed |
| "Install ffmpeg for chunking" error | Very large recordings may need ffmpeg installed on your system for splitting. Most people won't hit this |


## Transcript Format

Both devices produce identical transcripts with:
- AI-generated title based on content
- Date, time, and duration
- Device type and account info
- Full transcript text

**Note:** Physical recordings produce single-speaker transcripts (no speaker labels) because they capture one mixed audio stream, unlike video meetings where each participant has separate audio.


## Tips

- **Long recordings:** Rebel automatically handles recordings of any length by splitting them into pieces and retrying any that fail. No manual intervention needed.
- **Background noise:** Find a quieter spot when possible — transcription quality depends on audio clarity
- **Battery life:** The Limitless indicator shows battery level; charge before important meetings
- **Multiple devices:** You can have both Limitless and Plaud connected simultaneously
- **Pending recordings:** If transcription fails, a counter appears near the microphone button. Tap it to see what's waiting, retry, or dismiss. See [Voice and Audio](library://rebel-system/help-for-humans/voice-and-audio.md) for details.
