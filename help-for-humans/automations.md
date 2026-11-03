---
description: "How to schedule recurring or event-triggered work in Rebel, including built-in automations, transcript triggers, Focus automations, and run status meanings"
last_updated: "2026-11-02"
---

# Automations

Automations are scheduled or event-triggered tasks Rebel runs in the background.

Open [Automations](rebel://automations) to create them, pause them, run them now, or review what happened afterwards.

The app's own summary for this feature is nicely blunt: **Rebel works while you don't.**

## See also

- [Using Skills](library://rebel-system/help-for-humans/using-skills.md) — many automations run a skill behind the scenes
- [Cloud continuity](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md) — how scheduled work can carry on while your computer sleeps
- [Actions](library://rebel-system/help-for-humans/actions.md) — for “save this for later” instead of “run this on a schedule”
- [Meetings and notetaker](library://rebel-system/help-for-humans/meetings-and-notetaker.md) — where transcript-triggered automations fit in
- [Security and tool safety](library://rebel-system/help-for-humans/security-and-tool-safety.md) — why approvals still apply
- [Memory folders and approvals](library://rebel-system/help-for-humans/memory-folders-and-approvals.md) — what happens when an automation wants to save something

## How automations work

You tell Rebel:

- **what** to do
- **when** to do it

Rebel then runs it as a background conversation and saves the result for you to review later.

Each automation also has a **where**: it can run on this computer or in your cloud. See [Where automations run](#where-automations-run) below.

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

## Where automations run

Scheduled automations you make have a **Runs on** choice in [Automations](rebel://automations):

- **This computer** — the starting default. Runs while Rebel is open on this computer. With Cloud continuity on and your cloud up to date, your cloud can run it instead while this computer sleeps, about ten minutes after the scheduled time. Otherwise, missed runs follow this computer's usual catch-up rules.
- **My cloud** — runs in your cloud, so this computer does less. If your cloud misses a run, this computer picks it up about ten minutes later, once your cloud confirms it hasn't run it. If your cloud is down, scheduled automations wait and run when it's back, if there's still time. A run that has waited too long is skipped rather than run very late.

Cloud runs need [Cloud continuity](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md), turned on in [Settings → Cloud](rebel://settings/cloud). Without it, My cloud is unavailable as a new choice; anything already set to My cloud runs on this computer instead. Your cloud is the one you connected, whether Mindstone hosts it or you run it yourself.

When your cloud is up to date, the Automations page asks once per computer, if you have scheduled automations, whether **new** automations should use your cloud by default. **Use my cloud** also offers to move your existing scheduled automations; **Only new ones** leaves them where they are. Change the default later in **Settings → Cloud → New automations run on**. Changing the default never moves existing work by itself.

Every started run says **Ran on this computer** or **Ran in your cloud** in its history. If a run in your cloud needs a tool that only works on your computer, its history says so: the run may be incomplete and won't restart by itself. For a This computer automation, your cloud then leaves it to this computer until you edit it. If it's set to My cloud, switch Runs on to This computer.

A few details matter:

- This computer schedules follow this computer's time zone. My cloud schedules keep the time zone chosen for them.
- Event-triggered automations run where the event happens. They and Rebel's built-ins have no Runs on control, though scheduled built-ins can still run in your cloud while this computer sleeps.
- Automations made in chat on web or phone run in your cloud. That chat cannot put one on your computer. You can still list, change, pause, delete or run the cloud's copies there. A change to one your computer runs applies to the **cloud's copy**; this computer keeps running its own. Moving it to My cloud there doesn't change this computer's copy, so this computer may still run it. Use the desktop Automations page to change what this computer runs.
- In a web or phone chat, state your time zone for wall-clock schedules (for example, “weekdays at 9am, Europe/Berlin”). Otherwise the cloud machine's time zone is used.
- Before a scheduled run starts, Rebel asks your cloud whether it has already run, so one run doesn't happen in two places. That stops almost all repeats, but it can't promise every run succeeds or that an outside action, like a sent email, never repeats.
- If this computer cannot reach its cloud, scheduled work can wait even when this computer is awake. That includes when you're signed out of your cloud or a network blocks it. Your cloud can run it only if it already has this computer's automations; otherwise the run may be skipped once it has waited too long. This computer won't run it without hearing from your cloud, in case your cloud already did.

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
| **Asked you a question** | Asked for your answer in its conversation |
| **Some actions held back** | Finished, but some actions still needed review or were blocked |
| **Didn't finish** | Couldn't complete its work; open the conversation for the reason |
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

You can also reply in a run's conversation to ask a follow-up. Your reply is treated like any other chat: approvals ask as usual, and it doesn't borrow the automation's "for this automation" permissions.

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
- Check **Runs on** and [where automations run](#where-automations-run). Without an updated cloud and Cloud continuity, This computer work needs Rebel open. Built-ins and event-triggered automations have no Runs on control.

### It says “Blocked by security”

- Review the staged approval
- Update the automation's permissions if needed

### It says “Some actions held back”

- The automation finished, but some steps still need your attention
- Open the run details and check what was staged or skipped

### It seems stuck

Rebel automatically aborts silent runs after a few minutes, so truly hung automations shouldn't sit there forever.

### Provider not ready / your key was rejected

If Rebel tries to run an automation and your AI provider keeps turning down your key, it will try once more. If the rejection keeps happening, Rebel **pauses your automations** and tells you plainly: which provider is the problem, that missed runs **won't be replayed** (so you won't come back to a flood of catch-up work), and what to do — **Update key** takes you straight to the right field.

Once you replace the key and a turn succeeds again, automations resume on their own. This is separate from Rebel halting a run that's looping or stuck — see below.

### A scheduled run was delayed by a connection hiccup

If your cloud is not answering when a scheduled automation is due, Rebel waits and tries again. It runs when your cloud is back, if there is still time; after the allowed time it is skipped. This can affect This computer automations too. The connection notice explains the wait.

If you were away while this happened (desktop closed, or mid-reconnect), the run still shows up in your history in [Automations](rebel://automations) once things reconnect — so you're not left wondering whether it actually ran.

This is different from the **provider not ready** case above: a connection hiccup is temporary and safe to catch up automatically, so it does; a rejected AI provider key needs you to fix it first, so those runs are deliberately not replayed.

### Rebel stopped a run on its own

Sometimes Rebel halts a task that's looping or running away. When that happens, it now says plainly what occurred — not a vague "try again" message that doesn't match what actually happened.

For a **scheduled automation**, the message explains that Rebel will try again on its **next scheduled run**. You don't need to resend anything; there was no message from you to resend. Open the run in [Automations](rebel://automations) to see what happened, or wait for the next run if you're happy to let it retry.

A **manual "Run now"** or event-triggered run won't retry on a schedule — re-run it from [Automations](rebel://automations) if you want another attempt.
