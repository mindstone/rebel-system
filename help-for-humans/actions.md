---
description: "How to use Rebel Actions to save tasks for later and have Rebel execute them on demand."
last_updated: "2026-07-06"
---

# Rebel Actions

*Formerly known as Inbox.*

Rebel Actions is your "later list" — a place to save actionable items and have Rebel execute them when you're ready. Only the good stuff makes it in.

## See Also

- [Scratchpad](library://rebel-system/help-for-humans/scratchpad.md) — Quick-capture notes (lives in the Actions tab)
- [Keyboard shortcuts](library://rebel-system/help-for-humans/keyboard-shortcuts-and-hotkeys.md) — Quick access with ⌘/Ctrl+I, queue messages with Alt/Option+Enter

## How It Works

Ask Rebel to save something for later, and it appears in your Actions list. When you're ready, click an item and hit the action button to have Rebel run it as a new conversation.

**To open:** Click the **Actions** tab in the main navigation, or press **⌘/Ctrl+I**.

The Actions tab also includes the **Scratchpad** for quick note capture — switch between them using the tab bar at the top.


## Adding Items

Just ask naturally:

- "Add to my actions: summarise yesterday's meeting notes"
- "Remind me to draft the Q1 budget proposal"
- "Save for later: research competitor pricing"
- "I need to update the team wiki with the new process"

Rebel will confirm when it's added.

### Automatic Items

Rebel also adds items on your behalf. **Morning Triage** runs at 07:30 each day and surfaces actionable emails, so your day starts with a clear picture. Throughout the day, **Source Capture** watches for new actionable content — emails, notifications, updates, and prep for your upcoming meetings — and creates action items as they come in.


## Quality Filtering

Not everything deserves a spot in your Actions list. Rebel evaluates each item for relevance before it lands, so you only see things that are actionable and worth your attention.

**What gets filtered out:**

- **Low-signal items** — Vague reminders, redundant follow-ups, or items with no clear next step
- **Other people's tasks** — If a meeting generated an action item assigned to someone else, Rebel keeps it out of your list
- **Stale items** — Items tied to events that have already passed are tidied away automatically (you're told each time, and they're easy to get back — see **Auto-archived** below)

**Duplicate detection:** Rebel catches near-identical items before they clutter your Actions list — using similarity checks to spot items that say the same thing in slightly different words. If a meeting generates two action items that are essentially the same, only one makes the cut.

**Meeting-sourced filtering:** Items created from meeting transcripts get extra scrutiny. Rebel filters out noise like vague action items assigned to other people or items that duplicated something you've already captured, keeping only the genuinely actionable items from your meetings.

**Categories:** Each action item is tagged with a category — like *meeting action*, *follow-up*, or *user request* — so you can quickly scan what's what. Categories also feed the **Priority** filter, so you can pull up the items that matter most in a click.

This filtering works both for new items and retroactively: when Rebel's filtering improves, it revisits your existing Actions list and tidies up anything that no longer meets the bar. The result is an Actions list that stays lean without you having to maintain it.


## Viewing and Executing

A sidebar down the left lets you switch between four views:

**Active** — Everything still waiting for you. Items are grouped by when they're due — **Today**, **This Week**, **Future date**, and **Someday** — so the list reads like a plan, not a pile. Each item shows its title and description, when it was added, any referenced files, links, or emails (Linear issues, GitHub PRs, Asana tasks included), and draft content if Rebel prepared something ahead of time.

**Done** — Tasks you've completed, including ones Rebel finished for you.

**Dismissed** — Things you've cleared out. A short trail stays here in case you want them back.

**Auto-archived** — Stale items Rebel tidied away on your behalf, each with the reason and a one-click **Restore** (see **Auto-archived** below).

Above the list, **Search**, **From** (filter by source), and **Priority** narrow things down. When a filter is on, a **Clear filters** button appears so you're never stuck staring at an empty list wondering where everything went.

### Opening an item

Click any item to open its **detail view** — a focused panel showing the full title, description, any references (files, links, emails), and draft content if Rebel has prepared something. From here you can add context, execute, or dismiss the item without losing your place.

Context fields on both Today and Actions cards **auto-expand** as you type, so longer notes don't get cramped into a single line. Just keep typing — the field grows to fit.

### Editing an item

Got the title slightly wrong, or want to tweak a draft before sending? Click into an item's title, description, or draft and edit it in place. Your changes are saved as you go — no separate "edit mode" to toggle.

### To execute a task:

1. Type any extra context into the item's composer (or leave it blank) and hit **Send** — Rebel starts a new conversation to complete the task. The button reads **Send** on every item; whatever Rebel needs to do, you're handing it off the same way.
2. Prefer to talk? Use the **mic button** for voice input.
3. While executing, the task shows a progress indicator.

**Mark done when finished:** Open an item's detail view to toggle **Mark done when finished** — when on, the conversation is marked done automatically once the task completes; leave it off to keep it active. There's a global default in Settings, and each item can override it.

**Voice input:** Click the mic button to dictate your context instead of typing it.

When you execute or archive an item, it moves immediately with a smooth animation — no waiting around. Changed your mind? An **Undo** option appears briefly so you can reverse the action before it's final.


## Scheduling

Your Active list groups items by **Today**, **This Week**, **Future date**, and **Someday** — so when you'll get to something is baked into where it sits.

**Ways to schedule:**
- **Presets** — Click the schedule control on any item and pick **Today**, **Tomorrow**, **This Week**, or **Later**
- **Pick a date** — Choose "Pick a date…" for a specific day
- **Someday** — For things you'll get to eventually, with no deadline pressure. They tuck into their own group at the bottom, out of the way but not forgotten.
- **Keyboard shortcut** — Press **S** with an item selected to open the schedule picker

**Batch it.** Select several items and a toolbar appears — schedule, set priority, mark done, or dismiss the whole lot in one go. Handy for triaging a full Actions list in the morning.

**Scheduled means snoozed.** Give an action a future date and it goes quiet: it stays off your Home page until its day arrives, then returns to Today with a subtle highlight so you notice it's back. Items due this week stay visible so deadlines keep their lead time; **Someday** items wait patiently at the bottom until you're ready.

**Changed your mind?** An **Undo** option appears briefly after scheduling, so you can reverse it before it sticks.

**Auto-archived (what Rebel tidied away).** Rebel quietly clears out stale actions — meeting prep for meetings that already happened, "do this today" items from last week, and the like. So it never does this behind your back, two things are true: you get a small notice every time it happens ("Rebel tidied away 3 stale actions"), and everything it archived lives in its own **Auto-archived** view — separate from the things *you* dismissed — each with the reason it was cleared and a one-click **Restore**. Your own manually-added actions are never auto-archived. If Rebel tidied away something it shouldn't have, restore it — and stay tuned: teaching Rebel *why* is coming next.


## Today Card Actions

Items that surface on the **Today** section of your homepage have inline actions so you can triage without opening the full Actions view:

- **Done** — Mark an item as complete
- **Archive** — Put it away for later
- **Dismiss** — Clear it from your list (it keeps a short trail in the Dismissed view, and Undo brings it straight back)

**Auto-done:** Toggle this on for items where Rebel has already handled the task (e.g., after executing an action item). When auto-done is enabled, completed items are automatically marked as done so you don't have to.


## Archiving

Not every task needs Rebel to run it. Archive items when:
- You've handled them yourself
- They're no longer relevant
- You want to clean up your pending list

To archive: Click the archive button on any pending item.

To restore: Open the Archived section and click restore to move an item back to Pending.


## Message Queue

When Rebel is busy working on something and you want to send another message, you have options:

**Queue it:** Press **Enter** or click **Queue** to line up your message. It'll be sent automatically when Rebel finishes. (Alt/Option+Enter also works.)

**Send now:** Click **Send Now** to interrupt Rebel and send immediately. The current task stops, and your new message becomes the next thing Rebel works on.

**Clear the queue:** If you change your mind, remove individual messages or clear all queued messages from the tray above the composer.

This is handy when you're on a roll and want to chain multiple requests without waiting.

### What happens to the work in progress when you Send Now?

Short version: it isn't thrown away, and Rebel doesn't literally rewind — it stops, keeps what it had so far, and carries on from there with your new instruction.

- **Nothing already done is lost.** Whatever Rebel had written or worked out up to the moment you interrupted stays in the conversation. You don't start from a blank slate.
- **It's steering, not a fresh start.** Your new message isn't a brand-new, amnesiac request. Rebel can see everything it was doing and picks up with your new instruction in mind — so Send Now is the right tool for "actually, do it this way instead" or "also keep in mind X".
- **One thing to watch: interrupting mid-action.** If Rebel was part-way through an *action* with real-world effects — sending an email, editing a file, posting a message — interrupting can stop it partway. That step might not finish, or it might have already gone through. If Rebel is mid-action on something you care about, prefer **Queue** so it finishes cleanly first, or interrupt and then ask Rebel to double-check what actually happened before moving on.

**Rule of thumb:** Use **Send Now** to redirect or add information; use **Queue** when Rebel is mid-task on something you'd rather not leave half-done.


## Example Workflow

> **You:** "Add to my actions: write a LinkedIn post about our new feature launch"
>
> **Rebel:** Added "Write a LinkedIn post about our new feature launch" to Rebel Actions.

Later, open Rebel Actions, click the item, and hit **Send** to have Rebel draft the post — then take it from there in the conversation.


## Coaching Insights

After conversations, Rebel sometimes spots patterns — a win, a useful learning, a reflection, or a follow-up worth considering. These now live in **Coach** and its Homepage carousel by default, not in Actions.

If you explicitly ask Rebel to turn one into a task, it can become an Action. Otherwise, third-party-owned follow-ups and reflective material stay with Coach, where they belong. Not every thought needs a checkbox.

Insights auto-expire after **2 days** so Coach doesn't accumulate stale suggestions. If one catches your eye, act on it before it quietly sees itself out.

When you dismiss an insight or suggestion, Rebel treats that as scoped feedback about what not to suggest next time. It is not a brittle keyword blacklist; it is more of a polite note to self with boundaries.


## Email Integration

When Rebel works with your email (through [Google Workspace](library://rebel-system/help-for-humans/connectors/google-workspace.md) or similar connections), action items can include email references — showing you which messages are relevant to a task.

When you open an email-based action item, Rebel checks whether the email has already been resolved — so you won't waste time on something that's already handled.

**Replies and forwards** include the original thread content. Rebel quotes the prior conversation so recipients see the full context, even if their email client doesn't thread messages. No more "see below" pointing at nothing.


## Connection Status

The status indicator in the top-right shows:
- **Ready** — Good to go
- **Needs setup** — Click the status chip to configure

If setup is needed, click the indicator and follow the prompts. Rebel Actions uses a small helper that Rebel manages automatically.

