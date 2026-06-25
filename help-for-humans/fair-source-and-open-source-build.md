---
description: "The fair-source open build of Rebel — how it differs from the managed app, bring-your-own-credentials for AI models and connectors, and the anonymous usage data it shares by default (opt-out)."
last_updated: "2026-06-26"
---

# The Open Build

Rebel comes in two flavours. Most people use the **managed app** — the one Mindstone looks after for you, with a plan, sign-in, and the comfortable defaults already wired up. This guide is about the other one: the **open build**, Rebel's fair-source edition that you run yourself.

Same Rebel underneath — same agent, same voice, same safety layer, the same Spaces and skills and connectors. The difference isn't what Rebel *can* do. It's who holds the keys, who pays the bills, and who keeps the lights on. In the open build, that's you.

If you didn't go out of your way to install Rebel from its public source code, you almost certainly have the managed app, and this guide is just good background reading.

One part is open to *everyone*, managed app included: **rebel-system** — the bundled library of skills, help docs, and agent instructions Rebel runs on — is MIT-licensed and developed in the open. Anyone can read, fork, or contribute to the exact skills and instructions powering their copy of Rebel. Nothing up our sleeve.

## Who it's for

The open build is aimed at **individuals and small teams** who want Rebel running entirely on their own terms — their own AI accounts, their own infrastructure, and full control over what leaves their machine. If that sounds like a lot of switches to set, it is, a little. The reward is that nothing is hidden: the one thing the open build sends back automatically is **anonymous usage data** to help us improve Rebel (no personal information, no conversation content), and you can switch even that off in one click. Everything else reaches Mindstone only if you choose to send it (see [What goes to Mindstone](#what-goes-to-mindstone)).

It is *not* trying to be the easy option for a large organisation to roll out across hundreds of people. The features that make Rebel tidy to deploy at company scale — central accounts, managed billing, shared administration — stay with the managed app on purpose.

## How it differs from the managed app

| | **Managed app** | **Open build** |
|---|---|---|
| Who runs it | Mindstone | You |
| Sign-in and accounts | Mindstone account | None — Rebel runs as a guest on your machine |
| AI models | Use a [Mindstone plan](rebel://library/rebel-system%2Fhelp-for-humans%2Fmindstone-plans-and-billing.md), or bring your own | **Bring your own** (your AI accounts or access codes) |
| Connectors (Slack, Google, etc.) | Ready to connect out of the box | **You supply each connection's credentials** (see below) |
| Cloud continuity & mobile | Mindstone Cloud, or your own | **Your own cloud only** (self-hosted) |
| Usage data (telemetry) | On, to keep the service reliable | **Anonymous usage data on by default** — opt-out anytime; never includes personal info or conversation content |
| Meeting recorder | Built in | An optional add-on you install once (see below) |
| Updates | Arrive automatically | You update it yourself |

The headline: the open build ships with the doors locked and the keys handed to you. A few things that "just work" in the managed app are deliberately switched off until you turn them on with your own credentials. That's the trade — more setup, in exchange for total control.

## Bring your own credentials

The single biggest difference. The open build carries **no Mindstone-supplied keys** — not for AI, not for connectors. You bring your own. (Anonymous usage data is the one exception that works without you wiring anything up — it's routed through Mindstone for you, and it's described in full under [Anonymous usage data](#anonymous-usage-data-on-by-default) below.)

### AI models

You connect at least one AI provider using **your own account or access code (API key)** — for example ChatGPT Pro, OpenRouter, or Anthropic. There's no "included with your plan" shortcut here; the bill goes straight to the provider you choose.

This is the same screen everyone uses, so the full walkthrough applies: see [AI models](rebel://library/rebel-system%2Fhelp-for-humans%2FAI-models.md). One connection is enough to get going.

### Connectors (your apps and tools)

Connections (MCP) to outside services — Slack, Google Workspace, Notion, and the rest — work a little differently in the open build. In the managed app you just click **Connect** and sign in. In the open build, a service that needs its own connection details stays switched off until **you register your own credentials** for it, because Rebel isn't shipping anyone else's.

Rebel walks you through this in the app, with setup guidance for each connector that needs it as you switch it on. Where setup is required, it's a one-time step. After that, connecting and disconnecting works exactly as it does everywhere else — see [Connectors, tools and integrations](rebel://library/rebel-system%2Fhelp-for-humans%2Fmcp-connectors-tools-and-integrations.md).

For **Google, Microsoft, Slack, and HubSpot**, you paste your own app credentials in [Settings → Connectors](rebel://settings/tools) or during **onboarding** — no editing config files or restarting from a terminal. It's a one-time setup per connector. Change a key later and Rebel reminds you to reconnect so it takes effect.

### Cloud continuity (phone and browser)

If you want Rebel to follow you onto your phone or browser, the open build supports it — on **your own cloud account**, not Mindstone's. The full how-to is the same one self-hosting users already follow: [Self-managed cloud setup](rebel://library/rebel-system%2Fhelp-for-humans%2Fself-managed-cloud-setup.md).

### Where credentials live

On your desktop, your keys and sign-ins stay on your machine — the open build doesn't change that. The one exception is the same as in the managed app: if you switch on cloud continuity to use Rebel on your phone or browser, your connector sign-ins are relayed to **your own** cloud instance so it can do the work for you. For how Rebel stores and protects credentials, see [Secrets and passwords](rebel://library/rebel-system%2Fhelp-for-humans%2Fsecrets-and-passwords.md).

## Anonymous usage data (on by default)

This is the one place the open build phones home automatically, so here's exactly what happens — no fine print.

To help us understand how Rebel is used and make it better, the open build sends Mindstone **anonymous usage data by default**: which features get used, when something breaks, and similar product signals. You can turn it off in one click (see below), and we tell you about it when you first set Rebel up. We've designed it to be honest about the default-on rather than bury it.

**What's actually sent.** Only a fixed, published list of *event names* (like "onboarding step viewed" or "automation created") and a fixed list of *non-identifying properties* — categories, numbers, booleans, and short labels (a step name, a count, how long something took, your app version and operating system). That's it. The list is an allowlist, which means anything not on it simply can't be sent — free text, file paths, the names of your companies, contacts, meetings, or Spaces, and anything you type are all **impossible to include**, not merely filtered out.

**What's never sent.** No conversation content. No files. No email address. No personal information of any kind. The data isn't tied to your email or any account, even when you're signed in — it carries only a **random per-install ID** that identifies your installation, not you.

**Where it goes.** The data travels to a Mindstone endpoint, which forwards it to our analytics provider (RudderStack). The open build doesn't carry any analytics keys itself — Mindstone holds those server-side — so the open source code stays clean, and the only thing on the wire is the anonymous data above.

This is separate from the services you actually use. When you connect an AI provider, link a connector, or run your own cloud, your data naturally travels to *those* places — that's how each feature does its job. This section is only about the anonymous usage data going back to Mindstone.

### Turning it off

Open **Settings → Safety → Privacy & Data** and switch off **"Share anonymous usage data."** It takes effect right away, and Rebel stops sending. Your choice sticks.

### Pointing it at your own analytics instead

Prefer to keep usage data entirely in your own hands — say you run Rebel for a small team and want your own reliability dashboard? You can wire up your **own** analytics credentials in Settings. When you do, Rebel sends to *your* analytics account and the Mindstone anonymous channel switches off for that install — it's one or the other, never both.

In short: anonymous usage data is on by default and easy to switch off, it never carries personal information or your content, and if you'd rather, you can point it at your own analytics instead of ours.

## What goes to Mindstone

Apart from the anonymous usage data above (on by default, opt-out), there are a couple of things the open build *can* send us, and only if you decide to. The first: when you set Rebel up, it offers an optional **"About you"** step asking for your first name and email. Your name lets Rebel address you; your email helps it tell your meetings and messages apart from everyone else's. Both are used locally, on your machine, to personalise how Rebel works for you.

If you fill in the email, that detail — your email, plus your first name if you gave it, and a little minimal source metadata (that it came from open-build onboarding, plus the app version and your platform) — is also shared with Mindstone, so we can keep in touch with you about the open build. It goes to us on purpose, because you chose to share it. It's separate from telemetry (which stays off), it doesn't create a Mindstone account, and it's entirely skippable — leave the email blank and nothing is sent. Change your mind later? Just ask us to delete it (hello@mindstone.com) and we will.

**Bug reports you send in the open build.** When you use *Feedback & Bugs* to report a bug, the report — what you wrote, plus a screenshot and diagnostics if you opted in, and the name and email you gave Rebel during setup — is sent to Mindstone so the team can look into it. It's separate from automatic telemetry, which stays off. You choose when to send it by submitting a report. Reports submitted before this was switched on stayed on your device and are not sent retroactively.

Rebel can capture and transcribe your meetings in the open build too — but it goes about it differently from the managed app.

The managed app sends a notetaker that joins your call as its own participant, run on Mindstone's infrastructure. That joining bot is a managed-app feature; the open build doesn't include it. Instead, the open build records through **your own meeting-recording account** — the recording runs from your machine and connects directly to a recording service (Recall) that you sign up for, rather than going through Mindstone. So this part, like everything else, is bring-your-own. In practice that's two one-time steps:

1. **Install the recorder add-on.** It isn't bundled in by default. Under [Settings → Meetings](rebel://settings/meetings), click **Set up recorder** — Rebel walks you through an install dialog, shows progress, and then asks you to **Restart Rebel** when it's done. You only do this once. If the guided install can't run on your machine, Rebel offers a copy-paste terminal command as a fallback.
2. **Connect your own recording account.** Add your access code for the recording service in Settings. It's pay-as-you-go, billed to you directly, and some live-transcription features may ask for an additional transcription key.

Once that's set up, transcripts, summaries, and meeting prep behave as described in [Meetings and Notetaker](rebel://library/rebel-system%2Fhelp-for-humans%2Fmeetings-and-notetaker.md) — though anything in that guide about Mindstone's cloud notetaker bot is a managed-app feature that won't apply to the open build.

## See also

- [Is Rebel open source? Licensing, explained](rebel://library/rebel-system%2Fhelp-for-humans%2Flicensing-and-fair-source.md) — what licence Rebel uses, what you can do with it, and when each version becomes fully open
- [AI models](rebel://library/rebel-system%2Fhelp-for-humans%2FAI-models.md) — connecting ChatGPT Pro, OpenRouter, or Anthropic with your own account
- [Connectors, tools and integrations](rebel://library/rebel-system%2Fhelp-for-humans%2Fmcp-connectors-tools-and-integrations.md) — adding and managing connections
- [Self-managed cloud setup](rebel://library/rebel-system%2Fhelp-for-humans%2Fself-managed-cloud-setup.md) — running cloud continuity on your own cloud account
- [Secrets and passwords](rebel://library/rebel-system%2Fhelp-for-humans%2Fsecrets-and-passwords.md) — how Rebel stores your keys and tokens
- [Meetings and Notetaker](rebel://library/rebel-system%2Fhelp-for-humans%2Fmeetings-and-notetaker.md) — recording and transcribing meetings
- [Settings and configuration](rebel://library/rebel-system%2Fhelp-for-humans%2Fsettings-and-configuration.md) — where all of these controls live
