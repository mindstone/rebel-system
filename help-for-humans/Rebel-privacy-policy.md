---
description: "Privacy policy for the Rebel app (managed app and open-source build)"
last_updated: "2026-08-16"
version: "3.3"
---



## See Also

- **[`what-data-can-leave-rebel.md`](what-data-can-leave-rebel.md)** - Plain-language inventory of every point where data can leave Rebel, and which of them you can switch off
- **[`google-drive-desktop-local-sync.md`](google-drive-desktop-local-sync.md)** - Google Drive setup and file sharing
- **[`GDPR-PII-tag-files.md`](../skills/system/gdpr-pii-tag-files/SKILL.md)** - GDPR compliance tagging for candidate/personal data
- **[`permissions.md`](permissions.md)** - AI agent command execution permissions
- **[`secrets-and-passwords.md`](secrets-and-passwords.md)** - Credential management practices
- **[`fair-source-and-open-source-build.md`](fair-source-and-open-source-build.md)** - The open-source build: bring-your-own-credentials and how telemetry differs

Rebel Privacy Policy
This Privacy Policy explains how Mindstone Learning Limited ("Mindstone", "we", "us", "our") handles your personal data when you use the Rebel desktop application ("Rebel") and what to expect when connecting third‑party AI services and integrations. This policy is intended for external customers, enterprise buyers, and prospective users.

Rebel is distributed in two builds — the **managed app** that Mindstone operates, and an **open-source build** that you install and run yourself. A few parts of this policy apply differently to each. Unless a section says otherwise, it describes the managed app; see "Open-Source / Self-Hosted Build" below for what differs.

Last updated: 16 Aug 2026 | Version: 3.3 | Owners: CTO & COO

How Rebel Works
Rebel is a desktop application that works with data on your local machine and connects to external services you authorise (for example, cloud storage, email, or collaboration tools). It uses AI to help you complete tasks against that data. Rebel itself does not store your content or conversations; it routes your instructions to the configured services and AI providers and, in the managed app, collects only limited telemetry to ensure reliability. (The open-source build sends Mindstone anonymous usage data by default, which you can switch off, and no error reports at all — see "Open-Source / Self-Hosted Build".)

Rebel operates on a local-first architecture: in desktop-only mode, your files, memory, and workspace remain under your control on your local device and chosen cloud storage (e.g. Google Drive, OneDrive). Mindstone does not host your content on its own servers in desktop-only mode.

Rebel also offers optional cloud features with different data flows. Cloud Continuity can mirror your conversations, Actions, and workspace to your own cloud instance so you can continue in mobile/browser clients. Meeting Notetaker can join meetings and return transcripts to your workspace. See Section 7 and Section 8 for how these optional modes handle data.

Executive Summary: Key Privacy Risks
Critical awareness points for Rebel users:

In desktop-only mode, Mindstone does not process or store your content or conversations — but data flows through multiple third parties

Shared storage visibility - Files in shared cloud locations are visible to colleagues with access — you control who that is by managing permissions in your cloud storage provider (e.g. Google Drive, OneDrive)

Multiple third-party services - Your data flows through Rebel, AI providers, and individual service APIs

Cloud continuity (optional) - Moves selected Rebel data to a cloud server you control (single-user instance) to keep desktop, mobile, and browser in sync. See Section 7.

Meeting Notetaker (optional) - Uses cloud services to join and transcribe meetings before returning transcripts to your workspace. See Section 8.

Personal memory system - Your system prompt (AGENTS.md) and Space README.md files, along with memory/ folders, may contain sensitive context in shared locations. Personal memory — stored in your private Chief-of-Staff Space — is only visible to you. Shared memory, stored in company Spaces, is visible to colleagues with access to that Space. See Section 6 for details.

MCP access scope - When you authorise MCP tools, you grant access to entire services (all Gmail, all Slack messages, etc.) MCP connectors are integrations that allow Rebel to interact with external services on your behalf — for example, reading emails or creating calendar events. You choose which MCPs to connect in Settings → Connectors, and you can configure each connector to allow only specific actions — for example, permitting Rebel to draft emails but not send them. You can disconnect any connector at any time.

Open-source build - If you run Rebel's open-source build, you bring your own AI and connector credentials and may use Rebel with no Mindstone account at all. Telemetry differs rather than disappearing: the open build sends Mindstone anonymous usage data by default (a random per-install identifier, never your account — switchable off in one click) and sends no error reports. Some other data flows differ too. See "Open-Source / Self-Hosted Build".

Telemetry is now yours to switch off - In the managed app, Settings → Privacy & Safety → Privacy & Data has two switches: Share usage analytics and Share crash & error reports. Both are on by default (including for existing users), both take effect immediately on that device, and — if you use Cloud Continuity, which is what carries the choice between your devices — your other devices follow when each next connects. They do not cover app updates, signing in, the AI providers you use, connectors you enable, or Mindstone's monitoring of its own cloud service. See "Your Telemetry Choices (Managed App)" below and what-data-can-leave-rebel.md for the full picture.

Good news:

In the managed app, Rebel's usage analytics and error monitoring include PII (email, IP address) but not your proprietary data (conversations, files, memories), and both can be switched off — see "Your Telemetry Choices (Managed App)". In the open-source build, what reaches Mindstone is anonymous usage data only (no error reports, no account identity), and that too can be switched off — see "Open-Source / Self-Hosted Build".

Several common Rebel AI providers — including Anthropic and OpenAI — state that API data sent through their APIs is not used for model training. Always check the providers you actually enable.

You have control over what goes in shared vs. private locations

Information We Collect
We collect the following categories of personal data:

1. Information You Provide Directly
Account information: name, email address, and credentials used to create and access your Rebel account

Open-build contact details (optional): during setup, the open-source build can ask — optionally — for your first name and email. If you choose to provide your email, that email (and your first name, if given) is sent to Mindstone as a consented contact, together with minimal source metadata (that it came from open-build onboarding, plus app version and platform). This is a volunteered contact detail, not a Mindstone account. Skip the field and nothing is sent. See "Open-Source / Self-Hosted Build".

Payment information: Mindstone invoices customers directly. We do not collect or store payment card data.

Communications: emails or messages you send to Mindstone (e.g. support requests, feedback)

2. Information Collected Automatically
Usage telemetry: feature usage counts, session duration, performance metrics, and error reports, collected via RudderStack/PostHog (behavioural analytics) and Sentry (error monitoring). This may include your email address and IP address but is not intended to include your conversational content, files, or memories. This automatic collection applies to the managed app, and you can switch both categories off in Settings — see "Your Telemetry Choices (Managed App)" below. The open-source build bundles no Mindstone analytics or error-monitoring credentials and does not include the behavioural-analytics client, so it sends Mindstone no error reports. It does send anonymous usage data by default, through a Mindstone-operated endpoint that holds the analytics credentials at its end; that data carries a random per-install identifier rather than your account, and you can switch it off — see "Open-Source / Self-Hosted Build".

In-app surveys: the occasional in-product survey (for example the "how likely are you to recommend Rebel" question and its free-text comment) is delivered through the same behavioural-analytics channel, and is therefore covered by the Share usage analytics switch.

Technical data: device type, operating system, app version

Log data: error logs and crash reports. These are filtered by a strict allow-list before they leave your device — only safe operational detail (error type, technical metadata) is sent, never your conversational content, calendar entries, message text, or files. This technical and log data is collected as part of the managed app's analytics and error monitoring, and the automatic reporting of it is covered by the Share crash & error reports switch — see "Your Telemetry Choices (Managed App)". In the open-source build, error monitoring is off (no Mindstone error-monitoring credentials are bundled), so this data is not sent to Mindstone; any error monitoring you enable with your own credentials goes to your own account, not Mindstone — see "Open-Source / Self-Hosted Build".

3. Information in Your Workspace (Not Collected by Mindstone)
Your prompts, AI outputs, files, and memory stored in your Rebel workspace remain on your local device and chosen cloud storage. Mindstone does not access, store, or process this content on its own servers. However, this content may be transmitted to third-party AI providers and services you authorise — see sections below.

4. Information from Third Parties
Single sign-on (SSO): if you sign in via Google or another identity provider, we receive basic profile information (name, email) from that provider

Integrated services: when you connect external services (Gmail, Slack, Notion, etc.) via MCP connectors, data from those services is processed locally by Rebel or passed to your chosen AI provider — it is not stored by Mindstone

How We Use Your Information
We use the personal data we collect for the following purposes:

Purpose

Legal Basis (GDPR)

Providing and operating the Rebel service

Contractual necessity

Processing payments and managing your account

Contractual necessity

Ensuring platform reliability and fixing errors

Legitimate interests

Improving Rebel features and performance (via aggregated telemetry)

Legitimate interests

Responding to support requests and communications

Contractual necessity / Legitimate interests

Detecting and preventing fraud, abuse, and security incidents

Legitimate interests / Legal obligation

Sending product updates and service communications

Contractual necessity

Sending marketing communications (with your consent, where required)

Consent / Legitimate interests

Complying with legal obligations

Legal obligation

We do not use your data to train AI models. See "AI Training and Your Data" below.

The telemetry-based purposes above (platform reliability, feature improvement) apply in full to the managed app. In the open-source build, the only telemetry Mindstone processes for these purposes is the anonymous usage data described under "Open-Source / Self-Hosted Build" — it carries no account identity and can be switched off. Error reports are not sent to Mindstone at all, and any analytics or error monitoring you wire up with your own credentials goes to your own account rather than Mindstone.

AI Training and Your Data
Mindstone and Rebel do not train AI models on your data.

More specifically:

Your prompts, outputs, files, and workspace content are never used by Mindstone to train, fine-tune, or improve AI models

Many providers supported by Rebel are used through API access rather than consumer apps. Anthropic and OpenAI, for example, state that API data is not used for model training. If you enable other providers, review their terms directly.

Third-party MCP providers you connect (Gmail, Slack, Notion, etc.) have their own policies; Rebel does not share your data with these providers for training purposes

If Mindstone ever introduces opt-in model improvement programmes in the future, this policy will be updated and explicit consent will be obtained before any such use.

Enterprise customers: see "Enterprise Customers" section below for additional protections.

Your Telemetry Choices (Managed App)
The managed app gives you two switches, in Settings → Privacy & Safety → Privacy & Data:

Share usage analytics — behavioural analytics via RudderStack/PostHog: which features you use and when, plus in-app surveys. In the managed app these events are linked to your Rebel account (including email and IP address); they are not anonymous. They do not include your conversations, files, or memories.

Share crash & error reports — automatic crash and error reports via Sentry: the technical trace of what failed, application file paths, on some crashes a memory snapshot, plus app state and your account identity. Your conversational content, files, calendar entries and message text are filtered out before the report leaves your device; that filtering is applied carefully but no redaction system is perfect, which is part of why the switch exists.

Defaults and grandfathering: both are on by default, including for people who were already using Rebel before these controls existed. Nothing was silently enabled or disabled for existing users.

Effect and timing: turning either off takes effect on that device immediately — Rebel stops accepting new events, discards what it was holding, does not flush anything on shutdown or re-enable, and clears the identity attached to that channel. Turning crash reports off also deletes crash files already waiting on disk to be sent. Your choice then travels to your other devices through Cloud Continuity — it is stored with your settings on your own cloud instance, and each device applies it the next time it connects or is brought to the front, on connection rather than pushed instantly. If you do not use Cloud Continuity, nothing carries the choice between devices and each keeps the setting you made on it.

Honest limits: a request already handed to the network cannot be recalled. For usage analytics specifically, the third-party analytics library holds undelivered events in a queue stored on the device; switching usage analytics off empties that queue and prevents it being written to again, so those events are discarded rather than delivered later or after an application restart. A session that starts with analytics already off loads no analytics client at all and sends nothing. Where two of your devices each change the setting while offline, the choice that survives is the one from whichever device reconnects last, not the one you made most recently — nothing in the synchronisation records when each choice was made. Reverting to a version of Rebel released before these controls existed will resume collection, because that version has no knowledge of your choice.

What these switches do not cover: application update checks (always on, so security fixes reach everyone), signing in and organisation-membership checks (always on; they carry your identity, not your telemetry choices), data you send to the AI providers you have chosen, data exchanged with connectors you have enabled, meeting capture and transcription providers you have configured, Cloud Continuity synchronisation to your own cloud instance, and Mindstone's monitoring of its own cloud service (which is operator observability of the service, not automatic reporting from your device). Bug reports you choose to submit yourself continue to work while automatic crash reporting is off, because each one is a deliberate act; where a rating or feedback item cannot be delivered under your choice, Rebel tells you so rather than reporting success.

Relationship to your rights: usage telemetry is processed on the basis of legitimate interests (see "Legal Bases for Processing"). These switches are the in-product way to exercise your right to object to that processing. You can also contact hello@mindstone.com; see "Your Rights".

The full plain-language inventory of every point where data can leave Rebel — including everything the switches do not cover — is in what-data-can-leave-rebel.md, which is bundled with the app.

Open-Source / Self-Hosted Build
Rebel ships in two builds, and a few parts of this policy apply differently depending on which you run:

The managed app — the standard Rebel application distributed and operated by Mindstone, with a Mindstone account, managed billing, and Mindstone-supplied service credentials. Unless a section says otherwise, this policy describes the managed app.

The open-source build (the "open build") — Rebel's open-source edition, which you install from its public source code and run yourself. It carries no Mindstone-supplied credentials: you bring your own AI provider accounts, your own connector credentials, and (optionally) your own self-hosted cloud. You can run it with no Mindstone account at all. For a plain-language overview, see fair-source-and-open-source-build.md.

What's different in the open build:

No Mindstone account required. The open build can run as a guest on your machine. If you never create a Mindstone account, Mindstone does not hold account information (name, email, credentials) for you. One exception, and only if you choose it: if you fill in the optional email in the open build's "About you" setup step, Mindstone holds that email (and your first name, if given) as a consented contact so it can keep in touch about the open build — see "Optional contact details in the open build" below. That is a volunteered contact, not an account, and it is entirely skippable.

Bring your own credentials. Your AI provider keys, connector sign-ins, and any cloud or meeting-recording credentials are yours and are configured by you. Data you send to those services travels to the providers you choose, under their terms — Mindstone is not in that path.

Telemetry differs from the managed app: anonymous usage data is on by default and can be switched off, and no error reports go to Mindstone (see "Telemetry in the open build" below).

Meeting recording is bring-your-own. The open build does not use Mindstone's hosted meeting notetaker bot. Instead it records through your own Recall account, which you sign up for directly — you become Recall's customer, and Mindstone is not in that data path. See Section 8.

Who is the data controller for a self-hosted open build:

When you run the open build yourself — particularly with your own self-hosted cloud and your own provider accounts — you (or your organisation) generally determine the purposes and means of any personal data processing. Mindstone's position is that, in that configuration, you (or your organisation) act as the data controller while Mindstone supplies the software and does not operate the service or process personal data on your behalf — that is, Mindstone acts as a software provider rather than as your processor. Your agreements with the AI providers, connectors, and cloud or hosting services you choose govern those data flows directly.

Telemetry in the open build:

"Telemetry" here means usage analytics and error reports sent back to Mindstone — not the data that naturally flows to the AI providers, connectors, or cloud you choose to use.

The open build sends Mindstone anonymous usage data by default, and no error reports.

Error reports: none. The open build ships with no Mindstone error-monitoring credentials built in, and no crash or error reports are sent to Mindstone. If you want error monitoring for your own deployment, you can wire up your own credentials, in which case that data goes to your own account and is never routed to Mindstone.

Anonymous usage data: on by default, and you can switch it off. The open build carries no analytics credentials of its own either; instead it posts to a Mindstone-operated endpoint that holds those credentials at its end and forwards the data to Mindstone's analytics provider. What is collected is a fixed allow-list of event names and non-identifying properties — categories, counts, durations, app version, operating system. What is not collected: your email address, a Mindstone account (the open build may not have one), your conversations, files, or memories. Each installation is identified only by a random identifier generated on that device, so the data is pseudonymous by design and is not linked to you.

Lawful basis for this usage data is legitimate interests, with an in-product opt-out: Settings → Privacy & Safety → Privacy & Data has a single Share anonymous usage data switch, and turning it off stops collection on that installation immediately. If you configure your own analytics credentials, Rebel sends to your account instead and the Mindstone channel switches off for that installation — it is one or the other, never both.

This telemetry statement is about usage analytics and error reports. It does not cover the optional contact details you may volunteer during setup — if you fill in the optional email in the "About you" step, that contact is sent to Mindstone on purpose, as a separate, consented channel (not analytics). See "Optional contact details in the open build" below.

A note on earlier versions of this policy: version 3.2 described this Mindstone-routed channel as planned and not yet active. It has since shipped, and the description above replaces that statement.

Optional contact details in the open build:

The open build's setup includes an optional "About you" step that can ask for your first name and email. Alongside the anonymous usage data described above, this is one of two other things the open build sends to Mindstone — the other is a bug report you submit yourself, described next — and it is sent only if you choose it: a separate channel from telemetry, and unlike the anonymous usage data it identifies you.

What is sent, and when: if (and only if) you fill in the optional email, that email — plus your first name, if you gave one, and minimal source metadata (that it came from open-build onboarding, plus app version and platform) — is sent to Mindstone. Leave the email blank and nothing is sent.

What it is used for: keeping in touch with you about the open build. It does not create a Mindstone account, and it is not used as analytics.

Lawful basis: consent. Submitting the optional details, with this disclosure shown at the point of entry, is how you give that consent. Providing them is entirely voluntary, and the open build works exactly the same if you skip the step.

Retention and deletion: Mindstone keeps a contact you volunteer this way until you ask for it to be deleted. You can request deletion at any time using the contact route in "Your Rights" below (hello@mindstone.com); Mindstone will delete the contact on request.

Bug reports you submit in the open build:

This is the second channel, alongside the optional contact details above, through which the open build sends something to Mindstone beyond the anonymous usage data. If you use Feedback & Bugs to report a bug, that report is sent to Mindstone so the team can look into it.

What is sent: what you wrote (your description, plus any steps to reproduce and expected behaviour you added), the first name and email you gave Rebel during setup if you provided them, and your app version and platform. Extra diagnostics — a screenshot, a redacted diagnostics summary, and filtered application logs — are included only if you opt in in the report dialog, which says so at the point of submission. A report scoped to a conversation includes that conversation's transcript only if you separately opt in to attaching it; that transcript can contain your own messages, Rebel's replies, and text from files you attached, which is what opting in consents to.

When it is sent: only when you submit a report. Nothing here is sent automatically, and reports submitted before this channel was switched on stayed on your device and are not sent retroactively. This channel is unrelated to automatic error reporting, which the open build does not send to Mindstone at all.

Lawful basis: responding to support requests (see "Legal Bases for Processing"). The optional diagnostics, screenshot, and conversation transcript are included on the basis of your consent, given by opting in at the point of submission.

Privacy Layers
Rebel involves multiple privacy boundaries. Your data flows through several systems:

Your prompts and files
    ↓
Rebel App (local + limited telemetry)
    ↓
AI Providers (Anthropic, OpenAI, Google Gemini, etc.)
    ↓
Individual Services (Gmail, Slack, Notion, etc.)
    ↓
Cloud Storage (Google Drive, OneDrive, Dropbox, Box, etc.)
Each layer has different data handling practices. The sections below explain each component.

1. Cloud Storage and Shared Locations
Risk level: Medium - Visibility to team members

What's shared:

Anything saved in your chosen cloud storage or shared locations (e.g., Google Drive, Microsoft OneDrive/SharePoint, Dropbox, Box) can be visible to colleagues with access (you control who has access to your shared storage locations)

Personal files may live in shared locations unless you explicitly work in a private local directory

Implications:

Do not put truly private/confidential information in shared folders

In organisation‑managed environments, your organisation administers permissions and access controls for shared local storage and cloud repositories

Mitigation:

Use your Chief-of-Staff Space for sensitive work (this Space is private within Rebel and never shared by the app; however, if your workspace is in shared cloud storage, the underlying files are still accessible to colleagues with folder access)

Tag sensitive files with GDPR-PII-sensitive: true frontmatter

Provider privacy policies (examples):

Google: https://policies.google.com/privacy

Microsoft: https://privacy.microsoft.com/privacystatement

Dropbox: https://www.dropbox.com/privacy

Box: https://www.box.com/legal/privacypolicy

2. Rebel App
Risk level: Low in desktop-only mode - Limited telemetry only, no content storage

Mode caveat: If you enable Cloud Continuity, this data handling changes and selected Rebel data is stored on your cloud instance. See Section 7.

Build caveat: In the open-source build, no Mindstone analytics or error-monitoring keys are bundled. The error monitoring described below does not reach Mindstone at all; usage data reaches it only through the anonymous, opt-out channel described in "Open-Source / Self-Hosted Build", which carries no account identity.

What Rebel does:

Pass data to the 3rd-party AI providers you choose (for example Anthropic, OpenAI, Google, OpenRouter-routed models, or ElevenLabs for voice), using the credentials or provider connections you configure

Connect to external services (Google Workspace, Slack, Notion, etc.) via built-in connectors that keep OAuth tokens local on your device in desktop-only mode (in Cloud Continuity mode, tokens are relayed to your cloud instance — see Section 7)

Tracks usage telemetry (e.g., feature usage counts, performance/error metrics) via RudderStack/PostHog (behavioural analytics) and Sentry (error monitoring) to keep the platform reliable. This telemetry includes PII such as email address and IP address. Mindstone makes a best effort to exclude and redact proprietary user data (conversational content, memories, files, API keys, etc.) from monitoring, analytics, and logs, though no redaction system is perfect. In the managed app both categories can be switched off in Settings → Privacy & Safety → Privacy & Data (see "Your Telemetry Choices (Managed App)"); in the open-source build no Mindstone analytics or error-monitoring keys are bundled, so error monitoring does not reach Mindstone and the usage data that does is the anonymous, opt-out channel — a random per-install identifier, no email address and no account (see "Open-Source / Self-Hosted Build").

Produces aggregated usage statistics for reporting (no content, no user‑identifiable transcripts)

What Rebel does not do:

In desktop-only mode, does not process or store your text, files, or conversations in a Mindstone backend server at all

Does not train AI models on your data

Does not sell your personal data

3. MCP Integrations
Risk level: Medium - Varies by integration

Key considerations:

When you connect external services via MCP, your data flows through those service providers

Each service has its own data handling policies

Rebel's built-in connectors keep OAuth tokens local to your device

MCP (Model Context Protocol) connectors are integrations that allow Rebel to interact with external services on your behalf — for example, reading your emails, accessing your calendar, or creating documents. You choose which connectors to enable in Settings → Connectors.

Each connector can be configured to allow specific actions only — for example, you can permit Rebel to draft emails but disable the ability to send them, or allow read access to a service without write access.

When you authorise an MCP connector, you grant Rebel access to that service on your behalf. Rebel does not store the retrieved data; it is processed locally or passed to your chosen AI provider.

Mitigation:

Understand what you're authorising when connecting services

Review service provider privacy policies

Disconnect services you no longer need

To revoke access: go to Settings → Connectors and disconnect the relevant service. Any OAuth tokens are deleted from your device immediately.

4. LLM Model Providers (Third‑Party AI APIs)
Risk level: Variable - Depends on provider and configuration

If you choose to use external AI APIs from Rebel, the inputs you send and the outputs you receive are processed by the providers you configure. That may include Anthropic, OpenAI, Google Gemini, OpenRouter-routed models, or other compatible services. Anthropic and OpenAI state that data submitted via their APIs is not used for model training. If you configure other providers, review their specific terms.

Provider policies:

Anthropic Privacy Policy: anthropic.com/legal/privacy

OpenAI Privacy Policy: openai.com/policies/privacy-policy

Google Privacy Policy: policies.google.com/privacy

Additional API‑specific terms and data usage pages:

OpenAI API Data Usage: openai.com/policies/api-data-usage

Google Gemini API Terms: ai.google.dev/terms

Anthropic API Docs (Data Usage): docs.anthropic.com

Always verify the latest provider terms before sending sensitive content.

5. Voice and Speech Features (TTS/STT)
Text-to-Speech (TTS)

Rebel supports spoken responses through the voice provider you enable. The built-in options today are:

OpenAI TTS (recommended, default): Text is sent to OpenAI to generate speech.

OpenAI API Data Usage: https://openai.com/policies/api-data-usage

OpenAI Privacy Policy: https://openai.com/policies/privacy-policy

ElevenLabs TTS (alternative): Text is sent to ElevenLabs to generate speech.

ElevenLabs Privacy Policy: https://elevenlabs.io/privacy

Outputs are audio files/streams returned to your device; Rebel does not store your content or the generated audio.

Speech-to-Text (STT)

Rebel offers several options for voice input:

Local transcription via Moonshine (desktop default, also available on mobile) - Audio never leaves your device.

Moonshine keeps transcription on-device and does not send your recording to Mindstone or an external speech provider for transcription.

Local transcription via Parakeet v3 (alternative desktop-only local option) - Audio never leaves your computer.

Parakeet is an additional local desktop option. Like Moonshine, it keeps transcription on-device.

OpenAI Whisper - Audio is sent to OpenAI for transcription. OpenAI states that, by default, data submitted via API is not used to train models.

OpenAI API Data Usage: https://openai.com/policies/api-data-usage

OpenAI Privacy Policy: https://openai.com/policies/privacy-policy

Whisper (Speech-to-Text) Docs: https://platform.openai.com/docs/guides/speech-to-text

ElevenLabs Scribe - Audio is sent to ElevenLabs for transcription.

ElevenLabs Privacy Policy: https://elevenlabs.io/privacy

Local transcription provides transcription only — the on-device models transcribe, they do not speak, so read-aloud never runs on your device. One voice-provider setting covers both directions, so your transcription choice decides this one too: with a local transcription model selected, read-aloud is unavailable and nothing is sent; with a speech-capable cloud voice provider selected, the passage you asked Rebel to read is sent to that provider.

Additional considerations

Ensure you have the necessary rights and consent for any voices, recordings, or content you submit.

If you are using Rebel Note Taker to record meetings, Rebel Note Taker will announce itself at the start of the meeting and tell everybody that it's recording.

Avoid submitting sensitive or regulated information in audio where not strictly necessary.

6. Personal Memory System
Risk level: Medium - Contains your work context, may be in shared storage

What's in your memory:

AGENTS.md - The main system prompt in rebel-system/

README.md (in each Space) - Auto-loaded context sections (50%+ utility)

memory/topics/ - On-demand detailed context

May contain: project details, meeting notes, client information, work patterns

Rebel has two types of memory storage with different privacy implications:

Personal memory (Chief-of-Staff Space): stored only on your local device and private cloud storage. Visible only to you.

Shared memory (company Spaces): stored in your organisation's shared cloud storage. Visible to colleagues who have access to those Spaces.

Privacy consideration:

If stored in shared cloud locations, colleagues with access can read it

Be thoughtful about what personal/confidential information you include

Best practices:

Keep truly private information in your Chief-of-Staff/ Space (private within Rebel; ensure your workspace is on a private local drive for full confidentiality)

Use GDPR tags for candidate/personal data

Review your memory files periodically

When in doubt, keep things private — you can always share later

7. Cloud Continuity and Mobile (Optional)
Risk level: Medium-High - Your Rebel data is stored in a dedicated cloud instance when enabled

Build caveat: The Mindstone-hosted cloud option, and the account login and provisioning control at rebel.mindstone.com described below, apply to the managed app. In the open-source build there is no Mindstone-hosted cloud and no Mindstone account — Cloud Continuity runs on your own self-managed cloud only. See "Open-Source / Self-Hosted Build".

What it does:

Cloud Continuity mirrors your Rebel state (including pinned conversations, Actions, and workspaces) to a cloud server so you can continue across desktop, mobile, and browser clients.

Infrastructure:

Default hosting is on Fly.io (region iad in US East by default, with user-selectable region options). Bring-your-own-cloud deployments are also supported on DigitalOcean (nyc1) and Hetzner (fsn1).

Cloud Continuity uses a single-user model: one cloud instance per user.

What data moves to cloud:

When Cloud Continuity is enabled, your cloud instance becomes authoritative for sessions, settings, workspace files, memory, MCP tool execution, search index, Actions, and automations.

OAuth tokens and connected services:

In desktop-only mode, OAuth tokens stay local. In Cloud Continuity mode, connector OAuth tokens are relayed to your cloud volume so your cloud instance can access connected services (for example Slack, Google, and Microsoft).

Additional cloud behaviors:

Push notifications for mobile are delivered via Expo's push service. Notifications may include limited preview text such as titles or status labels, but not full conversation content.

You can create shared conversation links (including optional password protection).

Voice requests may be proxied by your cloud instance to speech providers for STT/TTS.

Authentication and OAuth infrastructure:

rebel.mindstone.com handles account login and cloud provisioning control.

rebel-auth.mindstone.com (Cloudflare Worker) handles OAuth callback redirects.

Mitigation:

Cloud Continuity is opt-in.

Each deployment is a single-user instance with encrypted cloud volumes.

If you disconnect Cloud Continuity, Rebel returns to desktop-only local processing.

Automatic updates: The cloud service periodically checks for software updates and may restart to apply them. Updates are deferred while work is in progress.

Important note on in-app Privacy & Data statements:

Privacy & Data statements in the Safety tab (for example, "No conversation storage" and "Secrets stay local") apply to desktop-only mode. When Cloud Continuity is enabled, data is stored on your cloud instance. The Share crash & error reports switch in that same section covers the automatic reports the Rebel app sends from your device; it does not cover Mindstone's monitoring of the cloud service itself, which continues under Mindstone's operation of that service. In the open-source build, that same Safety-tab section shows a single Share anonymous usage data switch, on by default: anonymous usage data goes to Mindstone until you switch it off, no error reports are sent to Mindstone at all, and the one other thing that can reach Mindstone is consented — if you fill in the optional email during the "About you" setup step, that contact is sent on purpose (see "Optional contact details in the open build").

8. Meeting Notetaker (Optional)
Risk level: Medium - Meeting transcription uses dedicated cloud services

What it does:

Meeting Notetaker joins meetings as a bot, captures transcripts, and returns transcripts to your Rebel workspace.

Infrastructure:

Mindstone runs the meeting backend on a Cloudflare Worker.

Recall.ai (us-west-2.recall.ai) provides the underlying meeting capture/transcription infrastructure.

Data flow:

Desktop app → Mindstone Cloudflare Worker → Recall.ai → transcript back to desktop app → saved to workspace.

Temporary storage:

Cloudflare KV stores bot metadata and limited meeting artifacts (such as chat messages used for interactive features) with a 7-day time-to-live (TTL).

Interactive features:

Cloudflare Durable Objects provide WebSocket relay for live captions/avatar interactions.

Avatar web assets are hosted on Cloudflare Pages, with media assets in Cloudflare R2.

Local fallback recording:

"Local fallback" uses Recall Desktop SDK capture, but still uploads through the cloud pipeline for transcription.

Multi-user meetings:

Only one bot is placed into a meeting (deduplicated across users), and each user gets their own transcript copy in their own workspace.

Per-bot security:

Each bot is assigned a random client secret stored locally on your device.

Mitigation:

Meeting Notetaker is opt-in.

The bot announces itself in meetings before recording/transcription begins.

Transcripts are returned to and saved in your workspace.

Subprocessor note:

Recall.ai is a subprocessor for Meeting Notetaker functionality. This describes the managed app.

Open-source build: The open build does not use Mindstone's hosted notetaker bot or Cloudflare backend. It records through your own Recall account, which you configure — you contract with Recall directly and become their customer, so Recall is your subprocessor (not Mindstone's), and Mindstone is not in that data path. See "Open-Source / Self-Hosted Build".

Data Retention
Mindstone retains the limited personal data it collects for the following periods:

Data Type

Retention Period

Usage telemetry (PostHog/RudderStack)

2 years

Error logs (Sentry)

12 months

Account information (name, email)

6 years after account closure

Payment records

6 years (as required by applicable financial regulations)

Support communications

6 years after resolution

In desktop-only mode, your conversational content, files, and workspace data are not stored by Mindstone and therefore have no Mindstone retention period.

If you enable Cloud Continuity, your data is stored on your dedicated cloud instance for as long as you remain connected. When you disable Cloud Continuity, the last-synced data remains on your cloud instance until the instance is deleted. For Mindstone-managed instances, contact hello@mindstone.com for retention details. For self-managed instances, consult your cloud provider's policies.

Usage telemetry used to ensure reliability and generate aggregated usage reports is retained for the periods above.

These retention periods apply to data Mindstone actually collects. In the open-source build, Mindstone collects no error reports, so there is nothing of that kind to retain; the anonymous usage data the open build sends by default is retained under the usage-telemetry periods above, and because it carries only a random per-install identifier and no account, it cannot be tied back to an individual. A contact you choose to volunteer is separate: if you fill in the optional email during the "About you" setup step, Mindstone keeps that contact until you ask for it to be deleted (see "Optional contact details in the open build").

Retention periods for third‑party providers (cloud storage, MCP connectors, AI APIs) are governed by their policies.

On account closure: we will delete your account data from our active systems within 30 days. Anonymised aggregated telemetry may be retained beyond this period.

Enterprise Customers
Mindstone offers additional data protections for enterprise customers:

Data Processing Agreement (DPA): A DPA is available upon request for enterprise customers requiring GDPR compliance documentation. Contact hello@mindstone.com.

No training on enterprise data: Mindstone and Rebel do not use enterprise customer data to train AI models. Your organisation's data is never used for model improvement.

Subprocessors: Our key subprocessors include Anthropic (AI processing), OpenAI (AI processing and voice), RudderStack (analytics), PostHog (analytics), Sentry (error monitoring), Cloudflare (meeting bot backend and OAuth callback handling), and Recall.ai (meeting capture and transcription). A full subprocessor list is available upon request. This list reflects the managed app. The open-source build bundles no Mindstone analytics or error-monitoring credentials (Sentry is not used for Mindstone-bound reporting), connects only to the providers you configure, and uses your own Recall account for meeting recording rather than Mindstone's hosted bot — so for a self-hosted open build those are your subprocessors, chosen and contracted by you, not Mindstone's. The exception is the anonymous usage data channel, which is on by default: it routes through a Mindstone-operated endpoint to Mindstone's analytics providers, making them recipients of that anonymous, per-install-identified data unless you switch the channel off.

Workspace admin access: Rebel workspace administrators within your organisation may have access to shared Spaces in accordance with your organisation's access controls. The Chief-of-Staff Space is private to individual users and not accessible to administrators via Rebel.

Custom retention: Enterprise customers requiring specific data retention configurations should contact hello@mindstone.com.

Frequently Asked Questions
Q: Can my colleagues see my prompts to the AI? A: No. Your Rebel conversations are local to your machine/account. But colleagues can see any files you create/edit in shared cloud storage.

Q: What happens to my data when I enable cloud continuity? A: Cloud Continuity stores selected Rebel data (including sessions, settings, workspace files, memory, MCP execution data, search index, Actions, and automations) on your single-user cloud instance so desktop/mobile/browser clients stay in sync. If you disable Cloud Continuity, Rebel returns to desktop-only local processing.

Q: Where does the meeting notetaker run? A: In the managed app, Meeting Notetaker runs through Mindstone's Cloudflare Worker backend and Recall.ai infrastructure, then returns transcripts to your desktop app and saves them to your workspace. In the open-source build, recording uses your own Recall account instead, with no Mindstone backend in the data path — see "Open-Source / Self-Hosted Build".

Q: Are my OAuth tokens safe in cloud mode? A: In desktop-only mode, connector OAuth tokens stay on your device. In cloud mode, tokens are relayed to your cloud volume so your cloud instance can access connected services. You can revoke this by disconnecting connectors or disabling Cloud Continuity.

Q: Is client data safe if I use it in AI prompts? A: Many providers people use with Rebel state that API data is not used for training, but the exact protection depends on which providers you enable. Your data still flows through Rebel, MCP connectors, and those model providers. For highly sensitive client work, use anonymised examples instead of real data.

Q: What's the biggest privacy risk? A: The main risk is shared cloud storage — colleagues can read files you create in shared locations. Always be mindful of what you store in shared Spaces.

Q: Does Rebel sell my data? A: No. Mindstone does not sell your personal data. In the managed app, usage telemetry is collected for reliability and aggregated reporting only; in the open-source build, Mindstone receives anonymous usage data by default — used for the same purposes, tied to no account, and switchable off.

Q: What happens to my voice recordings? A: Audio sent to cloud transcription providers such as OpenAI Whisper or ElevenLabs Scribe is processed for transcription. Text sent to a cloud TTS provider is processed for speech generation. Rebel doesn't store the audio or generated speech. For maximum privacy, use local transcription such as Moonshine (the desktop default) or Parakeet so audio stays on your device. Review your chosen providers' retention policies for the exact details.

Q: Can I turn telemetry off? A: Yes. In the managed app, Settings → Privacy & Safety → Privacy & Data has two switches — Share usage analytics and Share crash & error reports. Both are on by default, both take effect on that device immediately, and if you use Cloud Continuity your choice reaches your other devices when each next connects (without it, each device keeps its own setting). The open build has a single Share anonymous usage data switch in the same place, also on by default. They do not cover app update checks, signing in, the AI providers you use, connectors you enable, meeting transcription providers you configure, Cloud Continuity sync, or Mindstone's monitoring of its own cloud service. See "Your Telemetry Choices (Managed App)" and what-data-can-leave-rebel.md.

Q: If I turn off crash reports, can I still report a bug? A: Yes. Reporting a bug yourself is a deliberate act each time, so it keeps working — use the Feedback button at the top of the window, or Feedback & bugs in the Help menu. What stops is the automatic reporting that happens without you asking. If you would rather send nothing at all, simply don't file one.

Q: What telemetry does Rebel collect? A: In the managed app, Rebel collects usage telemetry (feature usage counts, performance metrics, error reports) via RudderStack/PostHog and Sentry, which may include PII such as email address and IP address. It is not intended to include your conversational content, memories, or files. Mindstone applies automated redaction of sensitive information in monitoring and logs, though no redaction system is perfect. You can switch both categories off — see "Your Telemetry Choices (Managed App)". In the open-source build, no Mindstone analytics or error-monitoring keys are bundled and the analytics client isn't included, so no error reports reach Mindstone; anonymous usage data does, by default, through a Mindstone-operated endpoint — a fixed allow-list of event names and non-identifying properties under a random per-install identifier, with a single switch to turn it off. If you wire up your own credentials, that data goes to your own account instead. See "Open-Source / Self-Hosted Build".

Q: I'm running the open-source build — what's different? A: You bring your own AI and connector credentials, you can use Rebel with no Mindstone account, no error reports go to Mindstone while anonymous usage data does by default (one switch turns it off), and meeting recording uses your own Recall account rather than Mindstone's hosted bot. If you self-host, Mindstone's position is that you (or your organisation) act as the data controller and Mindstone is the software provider. See "Open-Source / Self-Hosted Build".

Q: Does Mindstone and Rebel use my data to train AI models? A: No. Mindstone and Rebel do not train AI models on your data. See "AI Training and Your Data" above.

Q: What age do users need to be to use Rebel? A: Rebel is intended for users aged 18 and over. We do not knowingly collect personal data from individuals under 18.

Children's Privacy
Rebel is not directed at children. We do not knowingly collect or process personal data from individuals under the age of 18. If you become aware that a minor has provided personal data to us, please contact us at hello@mindstone.com and we will investigate and delete the data as appropriate.

When in Doubt
General principle: When gathering information from MCPs (emails, Slack messages, etc.) or writing to memory systems, always consider privacy implications before proceeding with sensitive/private sources (DMs, private channels) or adding potentially sensitive information (credentials, confidential details, personal matters). Default to public/safe sources only.

If you're uncertain about privacy implications:

Consider what data is truly necessary for the task

Use generic examples instead of real sensitive data

Check if the information needs to be in shared locations

Default to more private/cautious approaches

Best Practices
For Sensitive Client Work
Assess data sensitivity before using AI tools

Use generic/anonymised examples where possible

Redact company names and personal details in prompts

Prefer your Chief-of-Staff Space for highly confidential work

Tag appropriately with GDPR-PII-sensitive

For Candidate/Hiring Data
Always tag files with GDPR-PII-sensitive: true

Minimise PII in prompts

Delete when appropriate after decisions

Respect GDPR data subject rights

For MCP Service Connections
Ask before accessing sensitive sources; default to public/safe sources

Understand that authorising a service (e.g., Gmail) typically exposes the entire account scope

Review authorisations periodically and disconnect what you do not need

For Personal Privacy
Review your Space README.md files and AGENTS.md system prompt for comfort with what's included

Use topics/ for selectively loaded, more detailed context

Prefer your Chief-of-Staff Space for truly private work

Run periodic privacy audits of shared storage locations

Security
We implement commercially reasonable technical and organisational measures designed to protect information from unauthorised access, disclosure, alteration, or destruction. No method of transmission or storage is 100% secure.

Mindstone is ISO 27001 compliant.

In the event of a personal data breach, we will notify affected users and, where required, the relevant supervisory authority within 72 hours of becoming aware of the breach.

International Transfers
Your personal data may be transferred to and processed in countries outside your own, including the United States, where our AI providers and analytics services operate. Where such transfers involve data from the European Economic Area (EEA) or the United Kingdom, we rely on appropriate transfer mechanisms, including Standard Contractual Clauses (SCCs) approved by the European Commission and the UK International Data Transfer Addendum. Our key third-party providers maintain their own transfer safeguards — see their respective privacy policies. In the managed app, this includes Mindstone's analytics and error-monitoring providers. In the open-source build, the AI providers and connectors are the ones you choose (your transfers, under their terms); the anonymous usage data the open build sends by default is transferred to Mindstone and its analytics providers under the same safeguards described above, until you switch that channel off.

Your Rights
Depending on your location, you may have the following rights regarding your personal data:

Access — request a copy of the personal data we hold about you

Rectification — correct inaccurate or incomplete data

Erasure ("right to be forgotten") — request deletion of your personal data

Restriction — ask us to limit how we process your data

Portability — receive your data in a structured, machine-readable format

Objection — object to processing based on legitimate interests

Withdrawal of consent — where processing is based on consent, withdraw it at any time

Automated decision-making — Mindstone does not make decisions about you based solely on automated processing that produce legal or similarly significant effects

To exercise any of these rights, contact us at hello@mindstone.com. We will respond within 30 days. We may need to verify your identity before processing your request.

You also have the right to lodge a complaint with your local data protection supervisory authority. In the UK, this is the Information Commissioner's Office (ICO): ico.org.uk. In the EU, contact your national data protection authority.

For rights relating to data held by third-party providers (AI providers, cloud storage, MCP services), contact those providers directly.

Legal Bases for Processing (GDPR)
For users in the European Economic Area and United Kingdom, we process personal data on the following legal bases:

Processing Activity

Legal Basis

Providing the Rebel service and managing your account

Contractual necessity (Article 6(1)(b))

Processing payments

Contractual necessity (Article 6(1)(b))

Usage telemetry for platform reliability

Legitimate interests (Article 6(1)(f)) — our interest in maintaining a reliable service

Detecting fraud, abuse, and security incidents

Legitimate interests (Article 6(1)(f)) / Legal obligation (Article 6(1)(c))

Responding to support requests

Contractual necessity / Legitimate interests

Product update communications

Contractual necessity

Marketing communications

Consent (Article 6(1)(a)) or Legitimate interests where permitted

Compliance with legal obligations

Legal obligation (Article 6(1)(c))

Where we rely on legitimate interests for usage telemetry, the managed app provides an in-product way to exercise your right to object: the Share usage analytics and Share crash & error reports switches in Settings → Privacy & Safety → Privacy & Data. See "Your Telemetry Choices (Managed App)" for what they cover, what they do not, and their honest limits.

The data controller for users in the EEA and UK is: Mindstone Learning Limited, 85 Great Portland Street, First Floor, London, W1W 7LT. Contact: hello@mindstone.com.

For the open-source build, the telemetry basis differs from the managed app: no error reports reach Mindstone at all, and the anonymous usage data the open build sends by default is processed on the basis of legitimate interests. The in-product way to exercise your right to object is the single Share anonymous usage data switch in Settings → Privacy & Safety → Privacy & Data. Because that data carries only a random per-install identifier and no account, Mindstone cannot connect it to you — see "Open-Source / Self-Hosted Build".

No Data Protection Officer (DPO) is required.

CCPA Disclosure (California Residents)
If you are a California resident, the following applies under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):

Categories of personal information collected in the preceding 12 months:

Identifiers (name, email address, IP address)

Internet or other electronic network activity (usage telemetry, feature interactions)

Commercial information (payment and subscription records)

These categories reflect the managed app. In the open-source build, Mindstone does not necessarily collect any of them — for example, if you use Rebel with no Mindstone account and switch off the anonymous usage data channel, Mindstone collects no identifiers, network-activity, or commercial information from you. Left on (its default), that channel gives Mindstone network-activity information carrying a random per-install identifier and no account. The one exception is the optional contact details (first name and email) you may volunteer during open-build setup, which are identifiers collected on the basis of your consent — see "Optional contact details in the open build" under "Open-Source / Self-Hosted Build".

We do not sell your personal information. We do not share your personal information for cross-context behavioural advertising.

Your CCPA rights:

Right to know what personal information we collect, use, disclose, and sell

Right to delete your personal information

Right to correct inaccurate personal information

Right to opt out of sale or sharing (not applicable — we do not sell or share)

Right to non-discrimination for exercising your rights

To exercise your rights, contact hello@mindstone.com. You may also designate an authorised agent to submit requests on your behalf.

We do not knowingly sell or share personal information of residents under 16 years of age.

Changes to This Policy
We may update this policy to reflect operational, legal, or regulatory changes. We will indicate the date of the latest update at the top of this page. For material changes, we will make reasonable efforts to notify you (for example, by email or by displaying a prominent notice in the Rebel app).

Material change — Version 3.3 (16 Aug 2026): Adds a "Your Telemetry Choices (Managed App)" section describing the two new in-product switches — Share usage analytics and Share crash & error reports — including their default-on/grandfathered behaviour, their immediate effect on the device and connection-driven propagation to your other devices, the honest limits (requests already dispatched, and reverting to a pre-control version), what they deliberately do not cover (app updates, sign-in, AI providers, connectors, meeting transcription, Cloud Continuity sync, and Mindstone's monitoring of its own cloud service), and their relationship to the right to object where processing rests on legitimate interests. Clarifies that in-app surveys travel on the behavioural-analytics channel and are covered by the usage switch, that user-submitted bug reports continue to work while automatic crash reporting is off, and that undeliverable feedback is reported honestly rather than as success. Adds a cross-reference to what-data-can-leave-rebel.md, the bundled plain-language inventory of every egress point.

Also corrects four statements that had become inaccurate. First, the open-build telemetry section: version 3.2 described a Mindstone-routed telemetry channel as planned and not active, and stated that the open build sends Mindstone no telemetry. That channel has since shipped, so this version states what actually happens — anonymous usage data on by default through a Mindstone-operated endpoint, carrying a random per-install identifier and no account, processed on the basis of legitimate interests with a single in-product switch to turn it off; error reports still do not reach Mindstone at all. Second, the mechanism by which a telemetry choice reaches a user's other devices: it travels with settings through Cloud Continuity to the user's own cloud instance, not through sign-in, so devices not using Cloud Continuity each keep their own setting. Third, the open-build section described the optional contact details as the only thing besides anonymous usage data that the open build sends to Mindstone; a bug report the user submits is a second such channel, so this version adds "Bug reports you submit in the open build", setting out what a report contains, that extra diagnostics and any conversation transcript are opt-in, and that nothing is sent unless the user submits a report. Fourth, the voice section said that read-aloud and other supported speech use a cloud voice provider; because a single setting chooses the provider for both transcription and speech, and the on-device transcription models do not speak, selecting one of them leaves read-aloud unavailable rather than routing it to a cloud provider, and this version says so. All four corrections describe existing behaviour; none changes what Rebel does.

Material change — Version 3.2 (19 Jun 2026): Adds an "Open-Source / Self-Hosted Build" section and clarifies that, in the open-source build, telemetry is off by default, users bring their own credentials, a Mindstone account may not be required, and meeting recording uses the user's own Recall account; and sets out Mindstone's position that for a self-hosted open build the user or their organisation acts as the data controller and Mindstone is the software provider. It also describes the open build's optional "About you" setup step: if a user chooses to provide their email, that email (and first name, if given) is sent to Mindstone as a consented contact to keep in touch about the open build — separate from telemetry, on the lawful basis of consent, retained until the user requests deletion. This part of the policy is a draft pending broader legal sign-off for the open-build launch.

Contact Us
If you have questions about this policy or our practices, contact: hello@mindstone.com

Data controller: Mindstone Learning Limited 85 Great Portland Street, First Floor, London, W1W 7LT

Further Reading
Platform-specific details:

what-data-can-leave-rebel.md - Every point where data can leave Rebel, in plain language, and which ones you can switch off

permissions.md - What the AI can/cannot do automatically

AI-models.md - Available AI models (if available)

Usage guidance:

GDPR-PII-tag-files.md - GDPR compliance workflow

secrets-and-passwords.md - Credential management

memory-folders-and-approvals.md - Personal vs. shared workspace

Technical architecture:

architecture-technical-description.md - How data flows through the system

mcp-connectors-tools-and-integrations.md - External service connections (if available)

Appendix A: Using Rebel with External IDEs
Some users may choose to use Rebel alongside external IDEs like Cursor. For privacy considerations when using these tools, see the dedicated documentation:

Cursor Privacy Policy - Comprehensive details on Cursor's privacy modes, data collection, and security practices

Cursor Setup Guide - Configuration and usage

Note: External IDE support is considered legacy functionality. The Rebel desktop app is the recommended interface for most users.


