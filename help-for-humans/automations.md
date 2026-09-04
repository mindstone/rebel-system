---
description: "How to schedule recurring or event-triggered work in Rebel, including built-in automations, transcript triggers, Focus automations, and run status meanings"
last_updated: "2026-08-07"
---

# Automations

Automations are scheduled or event-triggered tasks Rebel runs in the background.

Open [Automations](rebel://automations) to create them, pause them, run them now, or review what happened afterwards.

The app's own summary for this feature is nicely blunt: **Rebel works while you don't.**

## See also

- [Using Skills](library://rebel-system/help-for-humans/using-skills.md) — many automations run a skill behind the scenes
- [Cloud continuity](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md) — what lets an automation run 24/7, even with your laptop closed
- [Actions](library://rebel-system/help-for-humans/actions.md) — for “save this for later” instead of “run this on a schedule”
- [Meetings and notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) — where transcript-triggered automations fit in
- [Security and tool safety](library://rebel-system/help-for-humans/security-and-tool-safety.md) — why approvals still apply
- [Memory folders and approvals](library://rebel-system/help-for-humans/memory-folders-and-approvals.md) — what happens when an automation wants to save something

## How automations work

You tell Rebel:

- **what** to do
- **when** to do it

Rebel then runs it as a background conversation and saves the result for you to review later.

Each automation also has a **where**: it can run on your desktop or in your Rebel Cloud. See [Where automations run](#where-automations-run-desktop-or-cloud) below.

## Creating an automation

The easiest method is conversational:

> “Run my morning briefing at 8am on weekdays”  
> “Every Friday at 5pm, draft my weekly update”  
> “When transcripts arrive, create follow-up notes”

Rebel understands natural language well enough to spare you most of the tedious setup.

## Schedule types

| Schedule type | What it does |
|---|---|
| **Once** | Runs one time at a specific date and time |
| **Hourly** | Runs every hour at a chosen minute |
| **Daily** | Runs every day at one or more times |
| **Every N days** | Runs at a repeating interval |
| **Weekly** | Runs on selected days of the week |
| **Monthly** | Runs on selected days of the month |
| **Event trigger** | Runs when something happens instead of at a fixed time |

## Where automations run: Desktop or Cloud

Every automation has a **Runs on** control in [Automations](rebel://automations) with two choices:

- **Desktop** — the default. Runs while Rebel is open on your computer. If Rebel is closed when a run comes due, it catches up next time you open it (hourly automations excepted — they just wait for the next slot).
- **Cloud** — runs on your Rebel Cloud around the clock, even when your laptop is closed. Handy for anything that should fire at 3am your time, or while you're on a beach pretending not to check.

**Once Cloud continuity takes over scheduled automations, this control goes away.** Your scheduled
automations then run on your Rebel Cloud by default — which is the point: they keep their schedule
whether or not your laptop is open, instead of quietly waiting for you. The Automations page tells you
when this has happened. Automations triggered by something on your computer still run there, because
that is where the thing that triggered them happened.

Cloud runs need [Cloud continuity](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md) set up first (Settings → Cloud). If it isn't, the **Cloud** option shows greyed out — hover over it and Rebel tells you what's missing. No phone or mobile app is required: your Rebel Cloud runs on its own, and the mobile app is just one way of looking in on it.

A few things worth knowing:

- Cloud automations fire at the wall-clock time in **your** timezone (captured when you switch to Cloud), wherever in the world the cloud happens to be.
- If the cloud connection has a rough patch when a run is due, Rebel catches the run up once it's back — see [A scheduled run was delayed by a connection hiccup](#a-scheduled-run-was-delayed-by-a-connection-hiccup).
- **Event-triggered** automations and Rebel's **built-in** automations always run on the desktop, so they don't offer the choice.
- You can also just ask Rebel in a desktop conversation — "run this one in the cloud" — and it will move the automation for you.

## Transcript event triggers

For event-triggered automations, the meeting-related options are the important ones.

The user-facing wording you'll most often see is:

- **When transcripts arrive** — any meeting transcript

Under the hood, Rebel can also be more specific:

- **Rebel Notetaker transcripts only**
- **External transcripts only** (for example imported transcripts)
- **Transcript ready for distribution to spaces** — after the transcript has reached final quality

These are especially useful if you want Rebel to react automatically after meetings.

## Built-in automations

Rebel includes system automations out of the box. You can usually enable or disable them, but they aren't regular user-created automations.

### Day-to-day automations

| Built-in automation | What it does |
|---|---|
| **Morning Triage** | Reviews what matters today across inbox, calendar, and related context |
| **Daily Wins & Learnings** | Surfaces useful wins, lessons, and signals from the last day |
| **Source Capture** | Captures citable sources such as meetings, documents, and files into memory |
| **Community Highlights** | Pulls relevant topics from the Rebels community |
| **Community Video Picks** | Monthly curation of relevant community talks |
| **Calendar Sync (Other Providers)** | Calendar syncing for non-Google / non-Microsoft setups; off by default |

### Meeting and Focus automations

| Built-in automation | What it does |
|---|---|
| **When Transcript Arrives** | Processes meeting transcripts and suggests follow-ups |
| **Distribute Transcript to Spaces** | Routes finished transcripts to the right spaces |
| **Focus: Weekly Prep** | Weekly chief-of-staff style briefing around calendar, goals, and priorities |
| **Focus: Monthly Review** | Monthly retrospective on time, patterns, and adjustments |

If you use Rebel heavily for meetings, these are the ones doing the clever background lifting.

## What happens while you're chatting

Scheduled automations try not to stomp on your live conversation.

If one becomes due while you're actively chatting, Rebel waits briefly for a natural gap, then continues. Manual **Run now** actions and event-triggered runs start immediately.

## Run status names

These are the current status labels to know:

| Status | Meaning |
|---|---|
| **Pending** | Waiting for its turn |
| **Running** | Currently in progress |
| **Completed** | Finished successfully |
| **Completed with issues** | Finished, but some actions still needed review or were blocked |
| **Failed** | Something went wrong |
| **Blocked by security** | Stopped because approvals or safety rules blocked it |
| **Cancelled** | Stopped before completion |

If an automation has never run, the card simply shows **Not yet run**.

## Results and history

Each run creates a conversation you can open later.

From the Automations area, you can:

- open the finished conversation
- watch a currently running automation live
- review recent run history
- see rough usage and cost for each run

Automation conversations stay out of your **Active** list on purpose. They won't show up there, in the pinned tabs, in unread counts, or in the "active" lists on Homepage and mobile — so they don't crowd your working conversations. Open them from each run's history in [Automations](rebel://automations) (they remain in the **All** tab if you want to see everything).

## Approvals still apply

Automations are more independent than normal conversations, but they do **not** get extra powers.

Your safety rules still apply. If an automation tries to do something outside its rules, Rebel stages it for review instead of pretending everything is fine.

That includes memory writes as well as tool actions.

Automations also respect the price of the model you chose for them: if one outgrows that model, Rebel switches only to an available model that can handle the longer task and costs no more; otherwise it stops with a clear reason instead of quietly upgrading to a pricier model. And because automations run without you, Rebel skips the post-run “was anything worth remembering?” check it uses after your own conversations — it almost never was.

## Troubleshooting

### It shows under “Couldn't load”

An automation whose saved schedule is broken — for example a weekly one with no days picked, which a few older versions could create — is paused and listed under **Couldn't load** in the Automations panel instead of firing at the wrong time (an empty weekly schedule used to fire every day). The fix: delete it there and recreate it with the days you want — it goes straight back to its proper cadence.

### It never ran

- Check that it is **enabled**
- Check the schedule
- Check **Runs on**: a **Desktop** automation only fires while Rebel is open; if you need it to run with the laptop closed, switch it to **Cloud** (needs Cloud continuity). If you don't see the control, Cloud continuity has already taken over your scheduled automations and they run in the cloud anyway

### It says “Blocked by security”

- Review the staged approval
- Update the automation's permissions if needed

### It says “Completed with issues”

- The automation finished, but some steps still need your attention
- Open the run details and check what was staged or skipped

### It seems stuck

Rebel automatically aborts silent runs after a few minutes, so truly hung automations shouldn't sit there forever.

### Provider not ready / your key was rejected

If Rebel tries to run an automation and your AI provider keeps turning down your key, it will try once more. If the rejection keeps happening, Rebel **pauses your automations** and tells you plainly: which provider is the problem, that missed runs **won't be replayed** (so you won't come back to a flood of catch-up work), and what to do — **Update key** takes you straight to the right field.

Once you replace the key and a turn succeeds again, automations resume on their own. This is separate from Rebel halting a run that's looping or stuck — see below.

### A scheduled run was delayed by a connection hiccup

If your cloud connection has a rough patch right when a scheduled automation is due, Rebel doesn't just skip it silently. You'll see a calm "on hold" banner while the connection's out, and as soon as it's back, Rebel catches the run up on its own — nothing to do, and nothing's lost.

If you were away while this happened (desktop closed, or mid-reconnect), the run still shows up in your history in [Automations](rebel://automations) once things reconnect — so you're not left wondering whether it actually ran.

This is different from the **provider not ready** case above: a connection hiccup is temporary and safe to catch up automatically, so it does; a rejected AI provider key needs you to fix it first, so those runs are deliberately not replayed.

### Rebel stopped a run on its own

Sometimes Rebel halts a task that's looping or running away. When that happens, it now says plainly what occurred — not a vague "try again" message that doesn't match what actually happened.

For a **scheduled automation**, the message explains that Rebel will try again on its **next scheduled run**. You don't need to resend anything; there was no message from you to resend. Open the run in [Automations](rebel://automations) to see what happened, or wait for the next run if you're happy to let it retry.

A **manual "Run now"** or event-triggered run won't retry on a schedule — re-run it from [Automations](rebel://automations) if you want another attempt.
