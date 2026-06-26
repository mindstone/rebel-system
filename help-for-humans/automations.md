---
description: "How to schedule recurring or event-triggered work in Rebel, including built-in automations, transcript triggers, Focus automations, and run status meanings"
last_updated: "2026-06-26"
---

# Automations

Automations are scheduled or event-triggered tasks Rebel runs in the background.

Open [Automations](rebel://automations) to create them, pause them, run them now, or review what happened afterwards.

The app's own summary for this feature is nicely blunt: **Rebel works while you don't.**

## See also

- [Using Skills](library://rebel-system/help-for-humans/using-skills.md) — many automations run a skill behind the scenes
- [Actions](library://rebel-system/help-for-humans/actions.md) — for “save this for later” instead of “run this on a schedule”
- [Meetings and notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) — where transcript-triggered automations fit in
- [Security and tool safety](library://rebel-system/help-for-humans/security-and-tool-safety.md) — why approvals still apply
- [Memory folders and approvals](library://rebel-system/help-for-humans/memory-folders-and-approvals.md) — what happens when an automation wants to save something

## How automations work

You tell Rebel:

- **what** to do
- **when** to do it

Rebel then runs it as a background conversation and saves the result for you to review later.

For scheduled automations, keep Rebel open in your dock or menu bar so it can run on time.

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

## Troubleshooting

### It never ran

- Check that it is **enabled**
- Check the schedule
- Keep Rebel open for scheduled runs

### It says “Blocked by security”

- Review the staged approval
- Update the automation's permissions if needed

### It says “Completed with issues”

- The automation finished, but some steps still need your attention
- Open the run details and check what was staged or skipped

### It seems stuck

Rebel automatically aborts silent runs after a few minutes, so truly hung automations shouldn't sit there forever.

### Rebel stopped a run on its own

Sometimes Rebel halts a task that's looping or running away. When that happens, it now says plainly what occurred — not a vague "try again" message that doesn't match what actually happened.

For a **scheduled automation**, the message explains that Rebel will try again on its **next scheduled run**. You don't need to resend anything; there was no message from you to resend. Open the run in [Automations](rebel://automations) to see what happened, or wait for the next run if you're happy to let it retry.

A **manual "Run now"** or event-triggered run won't retry on a schedule — re-run it from [Automations](rebel://automations) if you want another attempt.
