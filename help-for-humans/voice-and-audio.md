---
description: "Guide to Rebel's voice features: talking to Rebel, hearing spoken responses, choosing transcription providers (including OpenRouter and Mindstone), unified mic buttons, and custom vocabulary"
last_updated: "2026-07-02"
---

# Voice and Audio

Rebel is designed as a voice-first assistant. The most natural way to use it: press to speak, let Rebel think, hear it respond. Text works just as well if you prefer typing or need to work quietly.

Voice input works on **desktop, web companion, and mobile** — speak to Rebel from whichever device you're on.


## Quick Start

1. **Tap the microphone button** in the composer to start talking

That's it. On supported desktop platforms, Rebel uses built-in on-device transcription by default — no API key needed. Speak naturally, and Rebel will transcribe what you said and respond.

**Already on OpenRouter or a Mindstone plan?** Rebel can transcribe using that connection you already have — no separate voice API key. On a Mindstone subscription, transcription is included. It works on your computer and your phone. Spoken replies (text-to-speech) still need a separate cloud voice provider — OpenRouter isn't wired for speaking back.

For other cloud providers with higher accuracy, go to **Settings → Agent & Voice → Voice**, choose a provider, and enter your API key.


## Talking to Rebel

### Microphone Button

The microphone button appears in the composer area (bottom of the conversation). Tap it to start recording, speak your message, then tap again to stop. Rebel transcribes your speech and treats it like any typed message. This works on desktop, web companion, and mobile.

### Microphones around Rebel

Microphone buttons appear in several places — the main conversation box, the Home page, question cards Rebel asks mid-task, and Actions/Today cards. They now look and behave the same everywhere.

Only one can record at a time. If one is already listening, the others grey out with a tooltip: "Finish the other recording first."

On the **Home page**, you can **double-tap the mic while recording** to stop and send immediately — handy when you know what you want to say and don't need to review the transcript first.

See [Rebel Interface — Voice Interaction](library://rebel-system/help-for-humans/Rebel-interface.md#voice-interaction) for where these surfaces live in the app.

### Voice Mode (Global Hotkey — Desktop)

For hands-free use on desktop, press the global voice activation hotkey (default: **Ctrl+Alt+Space**, or customize in Settings). This works even when Rebel isn't in focus—great for quick questions while working in other apps.

After speaking with the hotkey:
- **Stay in Voice Mode** — Rebel speaks its reply, then waits for your next voice input
- **Return to Text Mode** — Rebel speaks its reply, then switches back to text-only

Configure this behavior in Settings under "After the hotkey sends."


### Quick Capture (Voice Notes)

Sometimes you want to capture a thought without starting a full conversation. Quick Capture lets you record a voice note on the spot — tap the microphone, speak, and done. Rebel transcribes it and feeds the transcript into your context, so it's available the next time you need it.

Useful for capturing ideas while walking, jotting down a meeting takeaway, or noting something you want Rebel to remember. No conversation needed — just record and move on.


## Hearing Rebel Speak

When enabled, Rebel speaks responses aloud using text-to-speech. Toggle **Voice replies** in the session settings menu (bottom-right of the composer).

Choose a voice in **Settings → Agent & Voice → Voice**. Options depend on your provider:
- **OpenAI** — Alloy, Echo, Fable, Onyx, Nova, Shimmer
- **ElevenLabs** — Rachel, Bella, Elli, Josh, Arnold, Adam, Sam (plus custom voices)

**Voice preview** — Click the play button next to any voice to hear a sample before selecting it. Try before you commit.

Spoken responses stream in as they're generated, so you hear Rebel start talking before the full response is ready.


## Choosing a Provider

| Provider | Best For | Requires |
|----------|----------|----------|
| **OpenRouter / Mindstone** | Use the AI connection you already have — no extra voice key; works on computer and phone | OpenRouter account, or a Mindstone subscription (transcription included) |
| **OpenAI Whisper** | Highest accuracy, especially for complex or technical speech | OpenAI API key |
| **ElevenLabs Scribe** | Faster transcription, variety of TTS voices | ElevenLabs API key |
| **Local (Moonshine)** | Privacy, offline use, desktop default, mobile local option | One-time model download |
| **Local (Parakeet)** | Alternative desktop-only local transcription | One-time model download |

**Local (Moonshine)** is the newer built-in option and the default on desktop. It runs entirely on your device with no cloud dependency, and it's also the local transcription option on mobile. No API key required and no audio leaves your device.

**Desktop also includes Local (Parakeet)** as an alternative on-device model. It is desktop-only, older than Moonshine, and uses a larger download, but some people prefer how it handles their voice.

**OpenRouter / Mindstone** is the simplest path if you already power Rebel through OpenRouter or a Mindstone plan — transcription rides on the same connection, including on mobile. It covers turning speech into text only; for Rebel to speak back, pick OpenAI or ElevenLabs (or another voice provider) separately.

**OpenAI Whisper** is recommended if you need the highest accuracy. It handles accents, technical terms, and background noise better than alternatives.

**ElevenLabs Scribe** is faster and offers more voice options for spoken responses.

### Plaud Voice Recorder

Rebel integrates with Plaud voice recorders (NotePin, Note, NotePro) for high-quality meeting and conversation recordings:

- **Cloud sync**: Recordings sync from Plaud's mobile app automatically
- **Smart chunking**: Large recordings are split into manageable pieces for reliable transcription — even hour-long meetings
- **Per-chunk retries**: If a piece fails, Rebel retries just that piece instead of starting over
- **ElevenLabs option**: Can use ElevenLabs Scribe for faster transcription of large files (no chunking needed)

See [Voice Recorders](library://rebel-system/help-for-humans/voice-recorders.md) for full setup and troubleshooting.


## When Transcription Doesn't Stick

If a recording fails to transcribe, Rebel doesn't silently lose it — your recording is saved as a standard audio file you can play back anytime.

**What you'll see:** An indicator appears near the microphone button. Tap it to open the pending audio popover, which shows a plain-language explanation of what went wrong:
- **Temporary glitch** — a brief hiccup; usually resolves on retry
- **Billing issue** — your transcription provider account needs attention
- **Authentication problem** — your API key or login may need refreshing
- **Network error** — no internet connection at the moment
- **Provider issue** — the transcription service is having problems

**What you can do from the popover:**
- **Retry** — try transcription again
- **Reveal file** — open the saved recording in your file manager
- **Settings** — jump to voice settings (shown for billing or authentication issues)

Voice notes auto-retry in the background with increasing delays, so most failures resolve themselves. The popover is there for when you want visibility or manual control.


## Custom Voice Providers (Bring Your Own)

Beyond the built-in options, you can connect your own speech-to-text or text-to-speech service—anything compatible with the OpenAI audio API format. Go to **Settings → Agent & Voice → Voice**, select "Custom" as a provider, and enter your service URL and API key. Rebel will use your custom endpoint for transcription, voice synthesis, or both, depending on what you configure.


## Custom Vocabulary

Teach Rebel words it might mishear. Great for:
- Company and product names
- Technical terms and acronyms
- Names of people you work with
- Industry-specific jargon

**Set up:** Settings → Agent & Voice → Voice → Custom vocabulary

Enter one term per line. When you speak, Rebel pays extra attention to these words.

> **Note:** Custom vocabulary currently works with OpenAI Whisper only.


## Permissions

### Microphone Access

The first time you use voice input, your system will ask for microphone permission. Grant this to let Rebel hear you.

**If the mic button is disabled:**
1. Open your system settings (Rebel can open them for you from the button tooltip)
2. Find microphone permissions
3. Enable access for Rebel

### Missing API Key

If you see a disabled mic button with a tooltip about API keys:
1. Go to Settings → Agent & Voice → Voice
2. Enter your API key for your chosen provider
3. The mic button will enable automatically


## Troubleshooting

**Transcription is inaccurate**
- Speak clearly and at a moderate pace
- Reduce background noise
- Add problematic terms to Custom Vocabulary
- Try OpenAI Whisper if using another provider

**Transcription returns empty**
- Recording may have been too short—try speaking a bit longer
- Check microphone permissions in system settings
- Ensure your microphone is working (test in another app)

**Voice button is disabled**
- Check that your API key is entered correctly
- For Local provider: ensure the model is downloaded

**No spoken response**
- Check that Voice replies is enabled in the session settings menu
- Verify your system volume and output device
- If using a Bluetooth device, ensure it's connected


## Local Provider

Rebel offers built-in transcription that runs on your device instead of sending audio to the cloud.

| Model | Works on | Download size | What to know |
|-------|----------|---------------|--------------|
| **Moonshine** | Desktop and mobile | About **250MB** on desktop, about **430MB** on mobile | Newer option, desktop default, only local option on mobile |
| **Parakeet** | Desktop only | About **500-700MB** | Older desktop-only alternative |

**Setup on desktop:**
1. Go to **Settings → Agent & Voice → Voice**
2. Choose **Local (Moonshine)** or **Local (Parakeet)**
3. Click **Download** if prompted
4. The mic button enables once the model is ready

**On mobile:** Moonshine is the local option. Download it once, then voice transcription can stay on-device there too.

**Current limitations:**
- Custom vocabulary not supported for local models
- Quality can drop with heavy accents or noisy rooms
- Local transcription gives you transcription only — spoken replies still use a cloud voice provider
- Windows users may notice brief pauses during transcription

If privacy or offline use matters most, local transcription is the obvious choice. If you want the highest accuracy, OpenAI Whisper is still the safer bet.


## See Also

- [voice-dictation-apps](library://rebel-system/help-for-humans/voice-dictation-apps.md) — External dictation apps and tips for voice input
- [meetings-and-notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) — Physical recording devices (Plaud, Limitless) and meeting transcription
- [settings-and-configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — Full settings reference including voice options
- [ElevenLabs connector](library://rebel-system/help-for-humans/elevenlabs-text-to-speech.md) — Music generation, text-to-speech, sound effects, and more via the bundled ElevenLabs connector
- [keyboard-shortcuts-and-hotkeys](library://rebel-system/help-for-humans/keyboard-shortcuts-and-hotkeys.md) — All keyboard shortcuts including voice hotkey
