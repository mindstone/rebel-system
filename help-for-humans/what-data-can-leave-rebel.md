---
description: "Every point where data can leave Rebel — usage analytics, crash reports, AI providers, connectors, meetings, updates, sign-in and cloud sync — which of them you can switch off, and exactly what the two Privacy & Data toggles do and don't cover"
last_updated: "2026-08-16"
---

# What Data Can Leave Rebel

Rebel runs on your machine, but it is not sealed off from the internet — no useful assistant is. This page is the complete list of the places data can go, in plain language, so you (or the person on your team who asks these questions for a living) can see the whole picture in one sitting.

Two of these you can switch off right now, in **[Settings → Privacy & Safety](rebel://settings/safety)** → Privacy & Data. The rest either can't be switched off (updates, signing in) or are switched off by simply not using the feature (connectors, meetings, cloud). All of them are listed below either way.

## The whole list, at a glance

| What can leave | Where it goes | Can you stop it? |
|---|---|---|
| **Usage analytics** — which features you use, and when | Mindstone | **Yes** — the *Share usage analytics* toggle |
| **Crash & error reports** — automatic reports when something breaks | Mindstone | **Yes** — the *Share crash & error reports* toggle |
| **Bug reports you file yourself** | Mindstone | Yes — by not filing one |
| **Your messages, and the files you ask about** | The AI provider you chose | Only by not using the AI |
| **Anything a connector reaches for** | The service you connected | Yes — disconnect it |
| **Meeting audio and transcripts** | Your meeting/transcription provider | Yes — don't use the notetaker |
| **Voice — dictation** (speaking instead of typing) | Your speech provider, or nowhere | **Yes** — choose an on-device model |
| **Voice — read-aloud** (Rebel speaking a passage) | A cloud voice provider | Only by not using read-aloud |
| **Voice — Live mode** (a spoken back-and-forth) | A cloud realtime voice provider | Yes — don't use Live mode |
| **Web searches and pages Rebel fetches** | The search provider, and the site itself | Yes — by not asking for it |
| **Your workspace, conversations and settings** | Your own cloud instance | Yes — Cloud Continuity is opt-in |
| **Update checks** | Mindstone's update service | No — always on |
| **Signing in and account checks** | Mindstone | No — required to sign in |

The rest of this page explains each one.

## What you can turn off

Both toggles live in **[Settings → Privacy & Safety](rebel://settings/safety)** → Privacy & Data. Both are on by default, including for people who have been using Rebel for a while — nothing changed under you when these controls arrived. Turning either off takes effect on this device immediately. Your other devices pick it up too — but only if you use Cloud Continuity, which is what carries the choice between them. Without it, each device keeps whatever you set on it. The fine print at the end spells this out.

### Share usage analytics

**What it is.** Counts and timings of what you do in the app: which features get used, when a conversation starts, which model was picked, how long something took. Also the occasional in-app survey — the "how likely are you to recommend Rebel" question and its free-text box go through this same channel, so turning analytics off turns those off too.

**Who you are in it.** Be clear on this one: in the Mindstone-managed app, these events are **linked to your Rebel account**, including your email address and IP address. They are not anonymous. What they don't contain is your work — no conversation text, no file contents, no memory, no names of the things you're working on.

**Why it exists.** To find out which parts of Rebel people actually use, and which parts quietly waste everyone's time.

**What happens when you turn it off.** Rebel stops sending immediately, discards anything it was holding to send, and forgets the identifier it was attaching. If Rebel starts up with this already off, it never even loads the analytics machinery — the app makes no analytics request of any kind for the whole session.

### Share crash & error reports

**What it is.** Automatic reports when Rebel crashes or hits an error it didn't expect. A report contains the technical trace of what broke (the chain of code that failed, file paths inside the app, and on some crashes a memory snapshot from the moment it died), plus context about the state of the app — app version, operating system, recent activity in the app, and your account identity so the report can be matched to the person who hit it.

Rebel filters these reports before they leave: only technical detail is meant to go, and your conversation content, file contents, calendar entries and message text are stripped. That filtering is careful and it is not perfect, which is why the toggle exists.

**Why it exists.** Most crashes are never reported by anybody. Without automatic reports, a bug that hits one in fifty people is invisible until it hits enough of them to generate complaints.

**What happens when you turn it off.** Rebel asks you to confirm, then stops. It shuts the reporting client down without letting it deliver whatever was queued, throws away crash files already sitting on disk waiting to be sent, and clears your identity from it. Nothing further is captured automatically.

**One thing it doesn't stop, on purpose:** you can still report a bug yourself, from **Settings → Support** or the Help menu. That's a deliberate action each time — you type what happened and press send — so it isn't covered by an automatic-sharing switch. If you'd rather send nothing at all, simply don't file one.

**One thing it changes quietly:** rating a conversation with thumbs-up/thumbs-down uses the same delivery channel. With crash sharing off, your rating is stored with the conversation but doesn't reach us, and Rebel says so plainly — the confirmation reads *"Rating saved, not sent"* rather than pretending it arrived.

### How to turn them off

1. Open **[Settings → Privacy & Safety](rebel://settings/safety)**.
2. Scroll to **Privacy & Data**.
3. Switch off **Share usage analytics**, **Share crash & error reports**, or both.

Turning crash reports off asks you to confirm. Turning them back on is the same switch, and takes effect straight away.

## What the toggles don't cover

This is the part most privacy pages leave out. These toggles cover Mindstone's automatic analytics and error reporting. They do not make Rebel an offline application, and nothing here is switched by them.

### App update checks — always on

Rebel checks for new versions and installs them. This can't be turned off, and that's deliberate: security fixes are worth very little if they only reach the people who remembered to go looking for them. The check tells the update service which version and platform you're on, so it knows what to offer you. It carries no usage data.

### Signing in and account checks — always on

Rebel signs you in to verify your account, work out whether you belong to an organisation, and apply any settings your organisation administers. Turning it off isn't offered, because it's the mechanism the rest of your account depends on. It carries who you are, not what you chose here — the toggles travel by a different road, described below.

### The AI itself

When you ask Rebel something, your message — along with any files, documents or search results it pulls in to answer — goes to the AI provider you've chosen (Anthropic, OpenAI, Google, or another you've configured). That isn't telemetry; that's the product doing its job. There's no way to have an AI assistant read your document without the document reaching the AI.

What you *do* control is which provider, and what you put in front of it. See the [privacy policy](rebel://library/rebel-system%2Fhelp-for-humans%2FRebel-privacy-policy.md) for the providers' own data-handling terms — the mainstream API providers state that API data isn't used to train their models, but that's their commitment, not ours to make.

### Connectors you've enabled

Every connector you turn on is a door you opened deliberately: Slack, Google Workspace, Microsoft, Notion, and the rest. When Rebel uses one, data moves between you and that service under that service's terms. Nothing connects itself.

Review or disconnect anything in **Settings → Connectors**. See [connectors and integrations](rebel://library/rebel-system%2Fhelp-for-humans%2Fmcp-connectors-tools-and-integrations.md).

### Web searches and pages Rebel fetches

When you ask Rebel to look something up, your search query goes to a search provider, and any page it opens gets a request from your machine. Ordinary web browsing, but worth naming: if you ask about something sensitive by name, that name is in the search query.

### Voice — dictation, read-aloud and Live mode

Three different things happen under the word "voice", and they don't have the same answer.

**Dictation** — speaking instead of typing — can stay entirely on your machine: pick one of the built-in on-device models in Settings and your audio never leaves. Pick a cloud provider instead and your audio goes to them.

**Read-aloud** — Rebel speaking a passage back to you — always uses a cloud voice provider. The on-device models transcribe; they don't speak. There is no local option to choose, so the only way to send nothing is not to use read-aloud.

**Live mode** — the spoken back-and-forth you enter from the composer — streams audio continuously in both directions to a cloud realtime voice provider for as long as you're in it. It is the largest amount of audio Rebel ever sends anywhere, and it starts and stops with you entering and leaving the mode.

See [voice and audio](rebel://library/rebel-system%2Fhelp-for-humans%2Fvoice-and-audio.md).

### Meetings and transcription

If you use the meeting notetaker, meeting audio goes to a transcription service, and the transcript comes back into your workspace. In the Mindstone-managed app that path runs through Mindstone's meeting backend and Recall.ai. If you've connected a different meeting tool — Fireflies, Fathom, or a hardware recorder — your meetings go to that provider, on your account, under their terms.

None of this happens unless you set the notetaker up. See [meetings and notetaker](rebel://library/rebel-system%2Fhelp-for-humans%2Fmeetings-and-notetaker.md).

### Cloud Continuity, mobile and browser access

If you switch on Cloud Continuity, your conversations, Actions, settings, memory and workspace files are mirrored to your own cloud instance so your phone and browser can reach them — and your connector logins are relayed there too, so the cloud instance can use them on your behalf. Mobile push notifications go via Expo's push service and can include short preview text such as a title or status.

That is a much bigger change to where your data lives than any telemetry toggle, and it's entirely opt-in. See [cloud continuity and mobile](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md).

Cloud Continuity is also the road the two toggles above travel: your choice is stored on your own cloud instance alongside the rest of your settings, and each of your devices reads it from there. That's why devices not connected to Cloud Continuity keep their own answer — there's nothing carrying the choice between them.

### Mindstone's monitoring of its own cloud service

If you use Cloud Continuity or mobile, part of Rebel runs on a server rather than on your desk. Mindstone monitors that service for faults, the way any operator monitors the software it runs, and that monitoring is not governed by your device's crash-report toggle — it isn't a report about you, it's a report about the service.

Your **Share crash & error reports** toggle covers the automatic reports the Rebel app sends from your device. It's an honest distinction, and this is the one place people most often assume otherwise.

## The fine print

A few things worth saying precisely, because "we stopped everything instantly" is rarely completely true of any software.

- **Requests already in flight can't be recalled.** When you switch either toggle off, Rebel stops immediately: it refuses new events, discards what it was holding, and doesn't flush anything on the way out. But a request already handed to the network has left, and nothing on your machine can call it back.
- **Usage analytics has one loose end we won't pretend is tidy.** The analytics library keeps its own delivery queue that Rebel can't inspect or empty. If you switch analytics off mid-session, events already handed to that queue may still be delivered — possibly even after a restart. We don't know how many or for how long, so we're not going to give you a number. The clean state is a session that *starts* with analytics off: as described above, the machinery is never loaded, so nothing is sent at all. If you want certainty, turn it off and restart Rebel.
- **Your other devices follow, they don't jump — and only if they're connected.** The choice travels through Cloud Continuity: it's stored on your own cloud instance, and each device applies it when it next checks in — when it reconnects, or when you next bring it to the front. A phone in your pocket, or a laptop that's asleep or offline, is still on its old answer until then. It is not instant, and we'd rather say so than imply otherwise. If you don't use Cloud Continuity, nothing carries the choice at all: two desktops with it switched off will never agree, and each simply keeps what you set on it.
- **If two devices decide different things while both are offline, the last one back wins.** Not the one you changed most recently — the last one to reconnect. Nothing in the sync records *when* you made each choice, so Rebel genuinely can't tell which was later. It's a corner you'd have to work at to reach, but "your other devices follow" isn't the same as "the newest decision wins", and you should know which one we can promise.
- **Going back to an older version undoes it.** These controls are new. If you install a version of Rebel from before they existed, it has no idea your choice was ever made, and it resumes sending. Turning the toggles off again on a current version restores your choice.

## If you're running the open build

Rebel's open-source build doesn't carry Mindstone's analytics or error-monitoring credentials at all. That settles the crash half outright: **it sends Mindstone no crash or error reports**, so there's no crash toggle to show.

Usage data is the part worth reading twice. The open build **does** send Mindstone anonymous usage data, and it is **on by default**. It doesn't need bundled credentials to do that, because the data goes to a Mindstone endpoint that holds them at its end — so "no keys in the code" is true and "nothing is sent" is not. What travels is a fixed list of event names and non-identifying details, tagged with a random per-install ID: not your email, not an account, not your content. The two toggles above are replaced by a single **Share anonymous usage data** switch, and turning it off stops it.

Prefer to keep that data yourself? Add your own analytics credentials in Settings and Rebel sends to your account instead — the Mindstone channel switches off for that install. It's one or the other, never both.

Everything else on this page — AI providers, connectors, meetings, web fetches — applies just the same, using the accounts you configured. See [the open-source build](rebel://library/rebel-system%2Fhelp-for-humans%2Ffair-source-and-open-source-build.md) for the full detail.

## See also

- [Rebel privacy policy](rebel://library/rebel-system%2Fhelp-for-humans%2FRebel-privacy-policy.md) — the formal version: legal bases, retention periods, your rights, subprocessors
- [Settings and configuration](rebel://library/rebel-system%2Fhelp-for-humans%2Fsettings-and-configuration.md) — where everything lives in Settings
- [Where Rebel stores things](rebel://library/rebel-system%2Fhelp-for-humans%2Fwhere-rebel-stores-things.md) — what stays on your disk
- [Security and tool safety](rebel://library/rebel-system%2Fhelp-for-humans%2Fsecurity-and-tool-safety.md) — what Rebel is allowed to do, and when it asks
- [Privacy Mode](rebel://library/rebel-system%2Fhelp-for-humans%2Fprivacy-mode.md) — make Rebel ask before every action
- [Connectors and integrations](rebel://library/rebel-system%2Fhelp-for-humans%2Fmcp-connectors-tools-and-integrations.md) — reviewing and disconnecting services
