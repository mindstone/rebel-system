---
description: "How Rebel captures meeting transcripts automatically, participates in discussions with live captions, and helps you prepare for upcoming meetings."
last_updated: "2026-06-18"
---

# Meetings and Notetaker

Rebel can join your video meetings as a notetaker, capturing transcripts and generating summaries automatically. It also helps you prepare for meetings with contextual briefings.


## See Also

- [actions.md](library://rebel-system/help-for-humans/actions.md) — Meeting analysis results appear in your Actions
- [spaces.md](library://rebel-system/help-for-humans/spaces.md) — Where transcripts are stored
- [settings-and-configuration.md](library://rebel-system/help-for-humans/settings-and-configuration.md) — Customize meeting behavior in Settings
- [automations.md](library://rebel-system/help-for-humans/automations.md) — Trigger workflows automatically when transcripts arrive
- [voice-and-audio.md](library://rebel-system/help-for-humans/voice-and-audio.md) — Voice recording providers and Plaud transcription options
- [open-source-build.md](rebel://library/rebel-system%2Fhelp-for-humans%2Fopen-source-build.md) — In the open build the recorder is a one-time add-on you install yourself, using your own recording account


## Getting Started

New accounts start with the meeting notetaker turned off — no surprise bot appearances in your first week. When you're ready:

1. Go to **Settings → Meetings**
2. Toggle the notetaker on
3. Choose your preferred join mode

Once enabled, Rebel detects your video meetings (Zoom, Google Meet, or Microsoft Teams) and offers to send a notetaker. The notetaker joins as a participant, records the conversation, and saves a transcript to your workspace when the meeting ends.

**Open-source build:** The managed notetaker above isn't included there — you install a local recorder add-on instead. See [The Open-Source Build — The meeting recorder](library://rebel-system/help-for-humans/open-source-build.md#the-meeting-recorder) for the one-time **Set up recorder** flow in [Settings → Meetings](rebel://settings/meetings).


## Sending a Notetaker

When Rebel detects a meeting, a banner appears in the title bar. You have options depending on your settings:

| Join Mode | Behavior |
|-----------|----------|
| **Ask me first** (default) | Rebel prompts you before joining — you can configure how many minutes before the meeting to show the prompt |
| **Auto-join** | Rebel automatically sends a notetaker to all meetings with video links. Meetings starting within 15 minutes use instant join so the bot arrives on time. |
| **Auto-schedule** | Rebel schedules the notetaker in advance for your upcoming meetings |

Click **Join with Rebel** to send the notetaker immediately.

**Paste a meeting link:** You can also paste any meeting URL (Zoom, Google Meet, or Teams) directly into the composer to schedule a notetaker instantly — no calendar sync required. Handy for ad-hoc meetings or links someone sends you in Slack.

**Pre-scheduled meetings:** If a notetaker is already scheduled for an upcoming meeting, you'll see a "pre-scheduled" indicator in the meeting preview. Rebel prevents duplicate bots from being scheduled for the same meeting.

**Personalized notetaker:** The notetaker joins with a friendly name based on your first name (e.g., "Josh & co.") so other participants know who requested it.

Configure these options in **Settings → Meetings**, which shows your connected meeting services in a card-based layout.


## During the Meeting

The title bar shows the notetaker's status:

- **Dispatching** — Bot is being created
- **Joining** — Waiting to be admitted (may need host approval)
- **Recording** — Actively capturing the meeting

If the bot waits too long in a waiting room, you'll see a warning. Some meetings require the host to admit participants manually.

**Error banners:** If something goes wrong, an error banner appears. You can dismiss these banners once you've acknowledged them.


## Active Participation

Beyond just recording, Rebel can actively contribute to your meetings — offering relevant input, answering questions, and surfacing context in real time.

### How It Works

When active participation is enabled, the meeting bot listens to the conversation and contributes when it has something useful to add:

- **Adaptive frequency** — Rebel contributes more during natural pauses and less when the conversation is flowing. It won't talk over people.
- **Yield on overlap** — If you start speaking while Rebel is responding, it stops and waits. No more "sorry, go ahead" moments.
- **Live captions** — A caption overlay shows what Rebel is hearing and thinking, so you can follow along without surprises.

### Enabling Participation

Active participation builds on the interactive avatar feature. When the avatar is enabled for a meeting, Rebel can both respond to direct questions (see Q&A below) and proactively contribute when it has relevant input.

Configure participation behavior in **Settings → Meetings**.


## Real-Time Meeting Coaching

Rebel can coach you during meetings — surfacing insights, suggestions, and reminders at conversationally relevant moments rather than interrupting at random intervals.

### How Coaching Works

Instead of contributing on a fixed schedule, Rebel evaluates the flow of conversation and speaks up when it has something genuinely useful to add. A quality gate scores each potential contribution — if it doesn't meet the bar, Rebel stays quiet. The result: fewer interruptions, higher signal.

Coaching might surface things like:
- A question you planned to ask that hasn't come up yet
- Context from a previous meeting that's relevant to the current discussion
- A decision that needs confirming before the meeting ends

### Exec Strategy Coach

For leadership meetings, strategy sessions, and executive conversations, the **Exec Strategy Coach** skill takes a more structured approach:

- **Socratic questioning** — Prompts you to think through assumptions and blind spots
- **Blind-spot surfacing** — Flags perspectives or risks that haven't been discussed
- **Commitment-driving** — Helps ensure decisions get made and next steps are clear

Enable this skill in your meeting settings when you want a more active thinking partner during high-stakes conversations.

### Clearing the Coach

When a meeting ends, you can clear the coaching context. This resets any meeting-specific state so it doesn't carry over into your next conversation.


## Interactive Q&A During Meetings

When the meeting bot has the interactive avatar enabled, you can talk to Rebel during the meeting:

**To get Rebel's attention:**
- Say "Rebel" (or your configured trigger word) to interrupt or get a response
- When Rebel has something to say, the avatar shows a "ready to speak" animation
- Say "go ahead" to let Rebel speak, or it will wait for you

**Visual cues:**
- **Static avatar:** Rebel is listening
- **Pulsing animation:** Rebel is thinking about a response
- **Slow rotation:** Rebel has a response ready — say "go ahead"
- **Active animation:** Rebel is speaking

**Long responses:** Rebel chunks long answers for natural delivery. You can interrupt between chunks by saying the trigger word again.

**No more getting cut off:** Rebel waits for natural pauses before responding, so you won't be interrupted mid-sentence. No more "wait, I wasn't fin—" moments.

Configure the trigger word and response mode (voice or chat) in **Settings → Meetings**.


### Knowledge Q&A Toggle

During a meeting, you'll see a brain icon (🧠) in the recording indicator. This controls whether Rebel can search your Spaces to answer questions:

| Setting | What Rebel Can Answer From | Example |
|---------|---------------------------|---------|
| **Off (default)** | Only what's been said in this meeting | "What did Sarah just say about the deadline?" |
| **On** | Your Spaces — notes, docs, past transcripts | "What deadline did we agree on in last week's meeting?" |

**How to use it:**

1. When Rebel is recording, click the brain icon in the title bar
2. When enabled, the icon highlights to show Knowledge Q&A is active
3. Meeting participants can ask questions like "Spark, what was the budget we discussed last month?"
4. Rebel searches your Spaces and speaks (or chats) the answer

**Privacy consideration:** When Knowledge Q&A is on, answers drawn from your Spaces are shared with everyone in the meeting — either spoken aloud or posted in the meeting chat. Only enable this when you're comfortable sharing information from your notes with the current participants.

**When it's useful:**
- Client calls where you need to reference past agreements
- Team meetings where historical context helps
- Recurring meetings where you want to recall previous decisions

**When to leave it off:**
- Meetings with external parties where your notes contain sensitive info
- When you're unsure what's in your Spaces
- General meetings where transcript-only context is sufficient


## Meeting Status States

Here's what each status means and what action (if any) you should take:

| Status | Meaning | What to Do |
|--------|---------|------------|
| **Scheduled** | Bot will join at your meeting time | Nothing needed — it's queued up |
| **Dispatching** | Bot is being created | Wait a moment |
| **Joining** | Bot is connecting to the meeting | May need host to admit from waiting room |
| **Recording** | Actively capturing your meeting | Meeting in progress |
| **Processing** | Transcript is being generated | Usually 1–5 minutes after meeting ends |
| **Upgrading** | Enhanced transcript in progress | May take a few more minutes for higher quality |
| **Complete** | Ready to view | Check your space for the transcript |
| **Failed** | Something went wrong | See troubleshooting below |

**About transcript upgrades:** Rebel captures a basic transcript immediately using closed captions. A higher-quality version is then generated in the background using AI-powered cleanup — improving accuracy, formatting, and readability while extracting decisions and open questions. This "upgrading" phase usually completes within a few minutes but can take up to 3 hours in rare cases. Both versions are usable; the upgrade makes it significantly easier to work with.


## After the Meeting

When the meeting ends:

1. **Transcript saved** — A markdown file appears in your workspace under `meeting-transcripts/YYYY/MM/`, including extracted decisions and open questions
2. **AI summary generated** — Key points, action items, decisions, and participants extracted
3. **Action item created** — Review the analysis in your Rebel Actions

During the meeting, Rebel builds a structured understanding of the conversation — tracking topics, decisions, and questions as they happen. This feeds into richer post-meeting analysis and more useful Q&A answers.

**Note:** Transcript quality may improve a few minutes after the meeting ends as AI-powered cleanup processes the full recording.


## Local Fallback Recording

If cloud transcription is unavailable (network issues, service outages), Rebel automatically falls back to local recording:

- **Automatic:** No action needed — Rebel detects the issue and switches seamlessly
- **Where stored:** Local recordings are saved in your workspace alongside cloud transcripts
- **Quality:** Local recordings capture the full audio but may have simpler speaker identification

When cloud service is restored, Rebel will use cloud transcription for future meetings. Your meetings are captured either way.


## How the Notetaker Works Behind the Scenes

The notetaker runs as a cloud service, not on your computer. When you send a notetaker to a meeting, Rebel's backend dispatches a bot that joins as a participant.

- **Cloud-based capture** — Rebel sends your meeting request to the backend, where the notetaker bot is launched.
- **Infrastructure** — The notetaker uses a Mindstone backend service (Cloudflare) and Recall.ai for meeting capture. Meeting data is temporarily processed through these services to generate your transcript.
- **Data flow** — Your meeting link is sent to the backend, which dispatches a bot to join. The bot captures audio and generates a transcript, which is then downloaded to your computer and saved in your workspace.
- **Temporary storage** — Meeting metadata and limited meeting artifacts (such as chat messages used for interactive features) are stored temporarily (up to 7 days) for coordination — for example, to avoid duplicate bots when multiple Rebel users are in the same meeting. Transcripts are not permanently stored on the backend.
- **Local fallback** — If the cloud service is unavailable, Rebel falls back to a local capture method. This fallback still uses cloud services for transcription processing.
- **Security** — Each bot session uses a unique security credential so only you (and other Rebel users in the same meeting) can retrieve the transcript.

For full details on data handling, see the [Privacy Policy](library://rebel-system/help-for-humans/Rebel-privacy-policy.md).


## What's in a Transcript

Transcripts include:
- Meeting title (enriched from your calendar event when available), date, and duration
- Participant list
- Full timestamped transcript with cleaned-up formatting
- AI-generated summary
- **Decisions** — Key decisions made during the meeting, extracted automatically
- **Open questions** — Unresolved questions or items that need follow-up

The transcript is cleaned up automatically after the meeting — filler words are reduced, speaker attribution is improved, and the text is formatted for readability. The raw capture is preserved; the cleanup makes it easier to scan and reference later.


## Meeting Prep

Before a meeting, ask Rebel to prepare you:

> "Prep me for my 2pm meeting with Sarah"

Rebel will:
- Look up who's attending
- Check your recent interactions with them
- Surface relevant context from your spaces
- Suggest talking points

Prep documents are saved and **automatically linked to the meeting transcript afterward** through document frontmatter—so you can jump between your prep notes and what actually happened. When Rebel analyzes a transcript, it includes your prep notes to compare what you intended to discuss with what actually came up.

Focus automations also classify each meeting relative to your goals—flagging whether it's productive, a blocker, noise, or travel—so your prep reflects what actually matters. Weekly briefings check previous briefings for follow-up accountability, surfacing anything that slipped through the cracks.


## Transcript Storage

Transcripts are routed to your spaces based on meeting type:

| Meeting Type | Default Location |
|--------------|------------------|
| 1:1 meetings | Chief of Staff space |
| Group meetings | Team or Company space |

Configure routing in **Settings → Meetings → Transcript Storage**.


## Physical Recording Devices

Rebel supports physical voice recorders for capturing in-person meetings, conversations, and ideas when you're away from your computer.

### Plaud Voice Recorder

Rebel integrates with Plaud devices (NotePin, Note, NotePro) for portable voice recording:

1. **Connect your Plaud** — Sync your device via USB or enable cloud sync in your Plaud account
2. **Record anywhere** — Use your Plaud during meetings, interviews, or while brainstorming
3. **Auto-process** — Recordings sync automatically and Rebel transcribes them
4. **Smart filing** — Transcripts are saved with AI-generated titles and summaries

**Features:**
- **Large file support** — Long recordings are automatically chunked for reliable transcription
- **Local transcription** — Option to transcribe locally for privacy (no audio leaves your device)
- **Cloud sync** — Full cloud sync integration for seamless transfer
- **Actions notification** — Get a summary in your Actions when processing completes

To process a Plaud recording manually, ask Rebel: *"Process my Plaud recording"*


### Limitless Pendant

Rebel integrates with the Limitless Pendant for in-person meeting capture:

1. **Connect your Pendant** — Go to **Settings → Meetings** and connect your Limitless account
2. **Record in person** — Use your Pendant during meetings, workshops, or conversations
3. **Physical button** — Press the button on your pendant to start/stop recording
4. **Auto-import** — Transcripts sync automatically to your workspace

Pendant recordings follow the same transcript storage and AI analysis workflow as video meetings. Your in-person conversations get the same treatment as your video calls.


## External Providers

Already using Fireflies or Fathom? Rebel can import transcripts from these services:

1. Go to **Settings → Meetings**
2. Select your provider and enter your API key
3. Click **Connect**
4. Click **Sync now** to import recent transcripts

Imported transcripts get the same AI analysis as native recordings.

### How Sync Works

- **Automatic sync:** Rebel checks for new transcripts every 30 minutes in the background
- **Manual sync:** Click **Sync now** in Settings → Meetings to import immediately
- **Where they go:** Imported transcripts are saved to your workspace under `meeting-transcripts/YYYY/MM/`

### Troubleshooting External Providers

**Fireflies issues:**

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Regenerate your API key at fireflies.ai and re-enter in Settings |
| Sync finds no meetings | Check that your Fireflies account has transcripts from recent meetings |
| Rate limit errors | Wait 15–30 minutes, then try again — Fireflies limits API requests |
| Missing older meetings | Rebel imports recent transcripts; very old meetings may not appear |

**Fathom issues:**

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Get a fresh API key from Fathom's settings and re-enter |
| "Meeting not found" | Ensure the meeting was recorded with Fathom (not another service) |
| Partial transcript | Fathom API returns what's available; check Fathom directly for full content |

**Interrupted imports:**

If a transcript import is interrupted — for example, by closing Rebel mid-sync or a temporary network issue — it won't stay blocked. The next time Rebel starts or you click **Sync now**, any incomplete imports are automatically retried. You don't need to do anything special to recover; just restart and sync again.

**General tips:**

- **Already imported:** Rebel tracks which transcripts it's already imported to avoid duplicates
- **Check your Actions:** Imported transcripts appear in your Actions after AI analysis completes
- **Provider limits:** Some providers limit how many transcripts you can fetch per time period


## Shared Meetings

When multiple people in the same meeting use Rebel, only one notetaker joins (not one per person). Everyone who requested a notetaker receives the same transcript to save in their own workspace.

**Collaborator access:** If someone else's Rebel is already recording a meeting you're in, you'll see a notification that their bot is active. You'll automatically receive the transcript too — no need to send your own notetaker. The transcript saves to your workspace just like any other meeting.


## Avatar Selection

Choose which Rebel character represents you in meetings:

- **Dash** — The speedster
- **Glitch** — The hacker
- **Rogue** — The rebel
- **Scout** — The explorer  
- **Spark** — The creator (default)

Select your avatar in **Settings → Meetings**.


## Troubleshooting

### Bot Didn't Join My Meeting

| Possible Cause | Solution |
|----------------|----------|
| Calendar not connected | Go to **Settings → Connectors** and connect Google Workspace |
| Meeting has no video link | Only meetings with Zoom, Meet, or Teams links are detected |
| Meeting URL not recognized | Ensure the calendar invite includes a valid meeting URL |
| Join mode set to "Ask" | Check title bar — you may need to click "Join with Rebel" |
| Corporate security | Some enterprise Zoom/Teams accounts block external bots |

### Bot Stuck in Waiting Room

- The meeting host needs to admit the Rebel notetaker from the waiting room
- If the bot waits too long (more than 2 minutes), you'll see a warning in the title bar
- Some corporate meeting settings automatically reject unfamiliar participants

### No Transcript After Meeting

| Possible Cause | Solution |
|----------------|----------|
| Still processing | Wait 5–10 minutes — processing takes time after meeting ends |
| Check status | Look at the title bar or Settings → Meetings for current status |
| Stuck on "Upgrading" | Transcript upgrade can take up to 3 hours; basic transcript is usually available sooner |
| Connection issue | If cloud transcription failed, check for a local fallback recording |
| Brief network blip during save | Rebel now retries saving the transcript instead of treating a momentary drop as final — give it a few minutes before assuming it's lost |
| Check your Actions | Look in your Rebel Actions for error notifications |

### Transcript Quality Issues

- **Speaker names wrong:** Rebel uses meeting platform captions; speaker identification varies by platform
- **Missing sections:** If someone's audio was poor, those portions may be less accurate
- **Upgrade pending:** Wait for the "Upgrading" status to complete for best quality

### Transcript Stuck on "Upgrading"

The enhanced transcript upgrade usually completes within minutes, but can take up to 3 hours in rare cases:

- **Check progress:** The status indicator shows current state
- **Use basic version:** The initial transcript is immediately available and usable
- **Wait it out:** Most upgrades complete within 30 minutes
- **If it's been hours:** The basic transcript is your fallback — it's still useful

### Missing Meetings in The Spark

- Ensure your calendar is connected (Google Calendar via Google Workspace integration)
- Only meetings with video links (Zoom, Meet, Teams) appear in the Today's Meetings section
- Check that the meeting is on your primary calendar
