---
description: "Guide to the ElevenLabs connector: music generation, text-to-speech, sound effects, voice browsing, and speech-to-text — all built into Rebel"
last_updated: "2026-04-16"
---

# ElevenLabs Connector

ElevenLabs gives Rebel a full audio toolkit. You can use it for Rebel's built-in voice features — faster speech-to-text with **ElevenLabs Scribe** and extra spoken voices — and for creative audio jobs like music generation, sound effects, and standalone text-to-speech. It comes bundled with Rebel, so there's nothing extra to install beyond your API key.


## Quick Setup

1. Open **Settings → Connectors**
2. Find **ElevenLabs** and click **Set up**
3. Paste your ElevenLabs API key (starts with `sk_`)
4. Click **Connect**
5. If you want ElevenLabs in everyday voice conversations, also go to **Settings → Agent & Voice → Voice** and choose **ElevenLabs Scribe** for transcription or an ElevenLabs voice for spoken replies

### Getting an API Key

1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Go to your [API Keys page](https://elevenlabs.io/app/settings/api-keys)
3. Create and copy your API key

> **Note:** ElevenLabs changes pricing, credit rules, and usage limits from time to time. Check your current plan and usage at [elevenlabs.io/app/usage](https://elevenlabs.io/app/usage) before doing large batches or long audio generations.


## How ElevenLabs Fits Into Rebel Voice

There are two places ElevenLabs shows up in Rebel:

- **Settings → Connectors** — connect your ElevenLabs account so Rebel can use ElevenLabs-powered tools such as music generation, sound effects, voice browsing, standalone speech generation, and audio transcription
- **Settings → Agent & Voice → Voice** — choose how Rebel handles everyday voice conversations

Inside **Settings → Agent & Voice → Voice**:

- Choose **ElevenLabs Scribe** if you want ElevenLabs to transcribe what you say
- Pick an **ElevenLabs voice** if you want Rebel to speak replies back in an ElevenLabs voice

See [Voice and Audio](library://rebel-system/help-for-humans/voice-and-audio.md) for the full built-in voice setup.


## What You Can Do

### Generate Music

Ask Rebel to compose original music from a text description. Anything from a 3-second jingle to a 10-minute score.

**Examples:**
- "Compose a 30-second lo-fi hip hop beat with soft piano and vinyl crackle"
- "Create a 60-second cinematic score that builds from soft strings to full orchestra"

For more control, ask Rebel to **create a composition plan** first — this is free (no credits used). You can review and tweak the plan before generating audio.

### Text-to-Speech

Generate natural-sounding spoken audio from text, with over 1,000 voices to choose from. Useful for narration, presentations, or hearing a draft read aloud.

**Examples:**
- "Read this summary aloud in a warm, professional voice"
- "Generate speech for this paragraph using the Josh voice"

Ask Rebel to **list available voices** or search for voices by style ("find British professional voices").

### Sound Effects

Generate sound effects from a text description — rain, explosions, footsteps, whatever the scene needs.

**Examples:**
- "Create the sound of rain on a tin roof for 10 seconds"
- "Generate a doorbell chime sound effect"

### Transcribe Audio

Transcribe speech from audio files. Point Rebel at a file and get text back.

**Example:**
- "Transcribe the audio from ~/Downloads/interview.mp3"


## Voice Selection

ElevenLabs offers a wide variety of voices:
- **Pre-made voices** — various accents, genders, and styles (Rachel, Josh, Bella, and hundreds more)
- **Voice cloning** — create custom voices from your own samples via the ElevenLabs website

Browse available voices in the ElevenLabs web interface or ask Rebel to search for voices after connecting.


## Usage and Billing

ElevenLabs usage is billed by ElevenLabs, not Rebel. In practice:

- Music generation, sound effects, transcription, and speech generation may count against your ElevenLabs plan
- Voice browsing and setup are lightweight, but the exact rules can change
- For current limits, credits, and plan details, rely on your [ElevenLabs usage page](https://elevenlabs.io/app/usage) rather than memorising numbers from this doc


## Troubleshooting

| Problem | Solution |
|---------|----------|
| "API key not configured" | Open Settings → Connectors → ElevenLabs and enter your key |
| "Authentication failed" | Your key may be invalid or expired — regenerate it at [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys) |
| "Usage limit reached" | Check your current usage or plan limits at [elevenlabs.io/app/usage](https://elevenlabs.io/app/usage) |
| "No voice found matching…" | Ask Rebel to list available voices to get exact names |


## See Also

- [Voice and Audio](library://rebel-system/help-for-humans/voice-and-audio.md) — Rebel's built-in voice input and spoken responses
- [Settings and Configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — Where **Agent & Voice** and **Connectors** live
- [Connectors](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — Overview of all connectors
- [Secrets and Passwords](library://rebel-system/help-for-humans/secrets-and-passwords.md) — API key security guidance
- [ElevenLabs Documentation](https://elevenlabs.io/docs) — Official API reference
