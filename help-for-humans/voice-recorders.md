---
description: "How Plaud transcript sync and Rebel's Quick Capture recorder handle in-person meetings, waiting transcripts, and recoverable audio"
last_updated: "2026-08-29"
---

# Voice Recorders

For a conversation happening in the room, Rebel offers two routes: connect Plaud and import the transcript Plaud has already made, or use **Quick Capture** to record from your computer's microphone.

## See Also

- [Voice and Audio](rebel://library/rebel-system%2Fhelp-for-humans%2Fvoice-and-audio.md) — Voice providers, dictation, and audio settings
- [Meetings and Notetaker](rebel://library/rebel-system%2Fhelp-for-humans%2Fmeetings-and-notetaker.md) — Video meetings, imports, and meeting transcripts
- [Spaces](rebel://library/rebel-system%2Fhelp-for-humans%2Fspaces.md) — Where transcripts and successful recording audio are stored
- [Actions](rebel://library/rebel-system%2Fhelp-for-humans%2Factions.md) — Where Plaud waiting reminders and meeting follow-ups appear

## Plaud Devices

Plaud devices such as NotePin, Note, and NotePro sync through Plaud's cloud. Record on the device, open the Plaud app, and let Plaud upload and transcribe the recording. Rebel imports Plaud's finished transcript; it does not download the recording and transcribe it again.

Your Voice provider in Rebel therefore does not affect Plaud imports.

### Setup

1. Go to **Settings → Meetings → Voice Recorders**.
2. Choose **Connect Plaud** and sign in.
3. Allow Rebel to access your Plaud recordings.

### What happens after you record

1. Sync the recording in the Plaud app.
2. Let Plaud finish its transcript.
3. Rebel checks for finished transcripts every 15 minutes by default. Choose **Sync** in Settings if you would rather not wait for the next check.
4. The imported transcript is filed in your meeting transcript destination with a useful title.

### If Plaud has not transcribed it yet

Rebel shows the recording as waiting. Waiting is not failure, and Rebel does not invent a transcript or quietly send the audio somewhere else.

If it is still waiting after a day, Rebel adds an Action explaining what is missing and checks again daily. Open the Plaud app, finish the transcription there, then choose **Sync** or wait for the next check.

There is no **Retranscribe** action in Rebel. Plaud owns the Plaud transcript, which keeps one recording from acquiring two competing versions of what was said.

### Plaud troubleshooting

| Problem | What to do |
|---------|------------|
| Recording is waiting for a transcript | Open the Plaud app and let Plaud finish transcribing it, then choose **Sync** |
| Recordings are not appearing | Check that they uploaded in the Plaud app and that Plaud shows a finished transcript |
| Plaud says it is not connected | Reconnect it in **Settings → Meetings → Voice Recorders** |
| Sync looks stuck | Choose **Sync** for a fresh check |

## Quick Capture

Quick Capture is Rebel's built-in voice-note recorder. Open the Notetaker menu at the top of Rebel and choose **Record from mic**. Speak for as long as you need, then stop the recording.

Quick Capture uses whichever Voice provider you configured in Rebel. That includes your Rebel plan, OpenRouter, your own provider key, and supported on-device transcription. Long recordings are handled in several pieces at once, with visible **Transcribing n of total…** progress.

### Where the recording goes

On success, Rebel saves the transcript in your configured meeting transcript destination and keeps the audio beside it.

If transcription fails, Rebel keeps the original WAV instead of throwing away the only copy. The error includes **Show file**; choose it to reveal the recording on your computer. You can preserve or transcribe it elsewhere while you sort out the Voice setting or provider error.

If you selected an on-device provider and it fails, Rebel tells you. It does not silently send that recording through a managed cloud key. You can choose a different provider in **Settings → Voice** and make a new recording when you are ready.

### Quick Capture troubleshooting

| Problem | What to do |
|---------|------------|
| **Record from mic** cannot start | Check microphone permission, then try again |
| Transcription failed | Choose **Show file** first so you know where the kept WAV is, then check **Settings → Voice** |
| On-device model is not ready | Download or repair it in **Settings → Voice**, or explicitly choose another provider |
| A long recording seems busy | Leave Rebel open; the progress count shows completed pieces |

## Transcript notes

In-room recordings usually contain one mixed audio stream, so they may not have reliable speaker labels. The resulting transcript still follows the same storage and meeting-analysis workflow as other meeting sources.
