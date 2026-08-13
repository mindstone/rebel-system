---
description: "Guide to Rebel's voice features: dictation, Live conversations, read-aloud, transcription providers, unified mic buttons, and custom vocabulary"
last_updated: "2026-08-12"
---

# Voice and Audio

Rebel gives you two pleasantly literal ways to use your voice: tap the microphone to dictate a message, or hold it to start a Live conversation where Rebel talks back. Ordinary conversations reply in writing, which is useful when your office has ears.

Voice input works on **desktop, web companion, and mobile** — speak to Rebel from whichever device you're on.


## Quick Start

1. **Tap the microphone button** to dictate a message
2. **Hold the microphone button** to start a spoken Live conversation

That's it. On supported desktop platforms, Rebel uses built-in on-device transcription by default — no API key needed. Speak naturally, and Rebel will transcribe what you said and respond.

**Already on OpenRouter or a Mindstone plan?** Rebel can transcribe using that connection you already have — no separate voice API key. On a Mindstone subscription, transcription is included. It works on your computer and your phone.

For other cloud providers with higher accuracy, go to **Settings → Agent & Voice → Voice**, choose a provider, and enter your API key.


## How Rebel picks your transcription provider

Rebel tries to match voice transcription to how you already use Rebel — so you are not stuck configuring a second service.

- **Mindstone or OpenRouter plan** — Rebel uses that same connection for transcription when it is available (included on a Mindstone plan, or billed to your OpenRouter account if you connected your own).
- **ChatGPT with an OpenAI key** — Rebel uses OpenAI Whisper when you have a real OpenAI API key saved.
- **Everyone else on desktop** — Rebel uses **Built-in** transcription on your computer (free, private, on-device).

If you pick a voice provider yourself in **Settings → Agent & Voice → Voice**, Rebel keeps your choice. Changing your AI plan later will not override a provider you selected on purpose.


## Talking to Rebel

### Microphone Button

The microphone button appears in the composer area (bottom of the conversation). Tap it to start recording, speak your message, then tap again to stop. Rebel transcribes your speech and treats it like any typed message. This works on desktop, web companion, and mobile.

### Live mode — an actual conversation

**Hold** the microphone button for a moment (instead of tapping) and Rebel enters **Live mode**: a proper back-and-forth conversation out loud. Rebel speaks its replies, listens while it talks, and stops when you start — you can interrupt mid-sentence the way you would with a person. To leave, close the Live view; you're back to normal.

The difference from tapping is worth knowing:

| | **Tap** the mic | **Hold** the mic |
|---|---|---|
| What it does | Dictates a message | Starts a spoken conversation |
| Rebel replies | In writing | Out loud |
| Interrupting | n/a | Just start talking |

It's the same Rebel behind the voice, with everything it normally has — your connected apps, your files, your Spaces — so you can ask it to actually go and do things, not just chat. "Look at my calendar and tell me what I'm walking into" works out loud.

**When Rebel isn't sure yet.** Talking is faster than working, so Rebel will sometimes answer while it's still checking. It'll say so, and if what it finds changes the answer, it comes back and corrects itself rather than letting the earlier version stand.

**One voice at a time.** If a meeting coach is already speaking, Live waits its turn — they won't talk over each other.

Live mode needs an **OpenAI API key** (Settings → Voice). Without one, Rebel tells you so and points you at the right place.

### Microphones around Rebel

Microphone buttons appear in several places — the main conversation box, the Home page, question cards Rebel asks mid-task, and Actions/Today cards. They now look and behave the same everywhere.

Only one can record at a time. If one is already listening, the others grey out with a tooltip: "Finish the other recording first."

On the **Home page**, you can **double-tap the mic while recording** to stop and send immediately — handy when you know what you want to say and don't need to review the transcript first.

See [Rebel Interface — Voice Interaction](library://rebel-system/help-for-humans/Rebel-interface.md#voice-interaction) for where these surfaces live in the app.

### Global voice hotkey (desktop)

Press the global voice activation hotkey (default: **Ctrl+Alt+Space**, or customize it in Settings) to dictate without first bringing Rebel into focus. Rebel sends the transcript and replies in writing. For a continuing conversation out loud, use Live mode by holding the microphone button.


### Quick Capture (Voice Notes)

Sometimes you want to capture a thought without starting a full conversation. Quick Capture lets you record a voice note on the spot — tap the microphone, speak, and done. Rebel transcribes it and feeds the transcript into your context, so it's available the next time you need it.

Useful for capturing ideas while walking, jotting down a meeting takeaway, or noting something you want Rebel to remember. No conversation needed — just record and move on.


## Hearing Rebel Speak

Ordinary conversations stay quiet and reply in writing. When you want Rebel to speak, you have three intentional routes:

- **Live mode** for a continuing spoken conversation
- **Read aloud** when you ask Rebel to read particular text
- **Meeting coach** speech during a meeting, when you have enabled a speaking coach

For read-aloud and other configured speech, choose a voice in **Settings → Agent & Voice → Voice**. Options depend on your provider:
- **OpenAI** — Alloy, Echo, Fable, Onyx, Nova, Shimmer
- **ElevenLabs** — Rachel, Bella, Elli, Josh, Arnold, Adam, Sam (plus custom voices)

**Voice preview** — Click the play button next to any voice to hear a sample before selecting it. Try before you commit.


## Reading Text Aloud

Ask Rebel to read something aloud — a document, an email, a summary, anything on screen — and it plays through Rebel's own audio player. No external player, no shell command, nothing running in the background that Rebel can't reach.

**How it works:**
1. Ask in plain language: "Read this aloud", "Read me the summary", "Play the briefing"
2. Rebel reads the text using your configured voice
3. A **pause/stop bar** appears while audio is playing — tap pause to take a break, tap stop to end it early

The audio stays inside Rebel the whole time. You can pause or stop it at any point, and it never spawns a background process you'd have to chase down from a terminal.

**ElevenLabs note:** The ElevenLabs connector can generate speech audio files (for music, sound effects, or standalone narration), but those files don't play themselves. When you ask Rebel to read something aloud, it uses the built-in read-aloud player — not a raw audio file dump. See [ElevenLabs connector](library://rebel-system/help-for-humans/elevenlabs-text-to-speech.md) for what the connector is for.


## Choosing a Provider

| Provider | Best For | Requires |
|----------|----------|----------|
| **OpenRouter / Mindstone** | Use the AI connection you already have — no extra voice key; works on computer and phone | OpenRouter account, or a Mindstone subscription (transcription included) |
| **OpenAI Whisper** | Highest accuracy, especially for complex or technical speech | OpenAI API key |
| **ElevenLabs Scribe** | Faster transcription, variety of TTS voices | ElevenLabs API key |
| **Built-in** | Privacy, offline use, free on-device transcription (desktop) | One-time model download |

**Built-in** is Rebel's on-device option on desktop (macOS and Windows). Your audio stays on your computer — no API key and no cloud upload for transcription. Rebel picks it automatically when no cloud connection fits your setup, unless you chose something else yourself.

**OpenRouter / Mindstone** is the simplest path if you already power Rebel through OpenRouter or a Mindstone plan — transcription rides on the same connection, including on mobile. It covers turning speech into text only; Live and read-aloud use their own supported speech connections.

**OpenAI Whisper** is recommended if you need the highest accuracy. It handles accents, technical terms, and background noise better than alternatives.

**ElevenLabs Scribe** is faster and offers more voice options for read-aloud and other configured speech.

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

Beyond the built-in options, you can connect your own speech-to-text or text-to-speech service—anything compatible with the OpenAI audio API format. Go to **Settings → Agent & Voice → Voice**, select "Custom" as a provider, and enter your service URL and API key. Rebel will use your custom endpoint for transcription, read-aloud, or both, depending on what you configure.


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
- For Built-in: ensure the model is downloaded

**Live or read-aloud is silent**
- Ordinary conversation replies are written by design; hold the mic for Live or ask Rebel to read something aloud
- Verify your system volume and output device
- If using a Bluetooth device, ensure it's connected


## Built-in (on-device) transcription

On desktop, **Built-in** runs transcription on your computer instead of sending audio to the cloud. In **Settings → Agent & Voice → Voice**, it is the option labeled **Built-in** (not a separate Moonshine entry — that engine is used behind the scenes on mobile, not as a desktop setting).

| | Desktop (Built-in) | Mobile app |
|---|-------------------|------------|
| **Works on** | macOS and Windows | iOS and Android |
| **Download size** | About **500–700MB** | About **430MB** |
| **What to know** | Free, private, no API key | Toggle on-device transcription in the mobile app; uses a separate on-device engine |

**Setup on desktop:**
1. Go to **Settings → Agent & Voice → Voice**
2. Choose **Built-in**
3. Click **Download** if prompted
4. The mic button enables once the model is ready

**Current limitations:**
- Custom vocabulary not supported for Built-in transcription
- Quality can drop with heavy accents or noisy rooms
- Built-in gives you transcription only — Live and read-aloud use their supported speech connections
- Windows users may notice brief pauses during transcription

If privacy or offline use matters most, Built-in is the obvious choice on desktop. If you want the highest accuracy, OpenAI Whisper is still the safer bet.


## See Also

- [voice-dictation-apps](library://rebel-system/help-for-humans/voice-dictation-apps.md) — External dictation apps and tips for voice input
- [meetings-and-notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) — Physical recording devices (Plaud, Limitless) and meeting transcription
- [settings-and-configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — Full settings reference including voice options
- [ElevenLabs connector](library://rebel-system/help-for-humans/elevenlabs-text-to-speech.md) — Music generation, text-to-speech, sound effects, and more via the bundled ElevenLabs connector
- [keyboard-shortcuts-and-hotkeys](library://rebel-system/help-for-humans/keyboard-shortcuts-and-hotkeys.md) — All keyboard shortcuts including voice hotkey
