---
description: "How to use Rebel Actions to save tasks for later and have Rebel execute them on demand."
last_updated: "2026-05-22"
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
- **Stale items** — Items tied to events that have already passed are automatically cleaned up

**Duplicate detection:** Rebel catches near-identical items before they clutter your Actions list — using similarity checks to spot items that say the same thing in slightly different words. If a meeting generates two action items that are essentially the same, only one makes the cut.

**Meeting-sourced filtering:** Items created from meeting transcripts get extra scrutiny. Rebel filters out noise like vague action items assigned to other people or items that duplicated something you've already captured, keeping only the genuinely actionable items from your meetings.

**Categories:** Each action item is tagged with a category — like *meeting action*, *follow-up*, or *user request* — so you can quickly scan what's what. These categories also help Rebel prioritise items in the Eisenhower Matrix.

This filtering works both for new items and retroactively: when Rebel's filtering improves, it revisits your existing Actions list and tidies up anything that no longer meets the bar. The result is an Actions list that stays lean without you having to maintain it.


## Viewing and Executing

Rebel Actions shows three sections:

**Today** — Items tied to meetings happening now or soon surface here so you can act on them in the moment.

**Pending** — Tasks waiting for you. Each shows:
- Title and description
- When it was added
- Priority indicator (if set)
- Any referenced files, links, or emails — including Linear issues, GitHub PRs, and Asana tasks
- Draft content (if Rebel has prepared something ahead of time)

**Executed** — Tasks you've run with Rebel, with links to their conversations.

**Archived** — Tasks you've handled outside Rebel or put away for later.

### Opening an item

Click any item to open its **detail view** — a focused panel showing the full title, description, any references (files, links, emails), and draft content if Rebel has prepared something. From here you can add context, execute, archive, or dismiss the item without losing your place.

Context fields on both Today and Actions cards **auto-expand** as you type, so longer notes don't get cramped into a single line. Just keep typing — the field grows to fit.

### To execute a task:

1. Click the action button on any item — the label adapts to what the item needs:
   - **Review** — the default for most items
   - **Send** — when Rebel has a draft ready to go
   - **Decide** — when Rebel needs your direction on a clarifying question
   - **Catch up** — for meeting notes and recordings
2. Optionally add context in the text field or use the **mic button** for voice input
3. Rebel starts a new conversation to complete the task
4. While executing, the task shows a progress indicator

Use the split button dropdown for additional options like **Auto-done** — when on, the conversation is marked done automatically once the task finishes; leave it off to keep the conversation active after completion.

**Voice input:** Click the mic button to dictate your context. Double-tap the mic to send and mark done immediately — great for quick task dispatch.

When you execute or archive an item, it moves immediately with a smooth animation — no waiting around. Changed your mind? An **Undo** option appears briefly so you can reverse the action before it's final.


## Eisenhower Matrix

Actions includes a 2x2 grid for prioritising tasks by urgency and importance — the Eisenhower Matrix.

### The Four Quadrants

| | Urgent | Not Urgent |
|---|---|---|
| **Important** | **Do Now** — Handle these immediately | **Schedule** — Plan time for these |
| **Not Important** | **Delegate** — Pass these to others | **Consider** — Decide if they're worth doing |

Rebel places items into quadrants based on urgency and importance flags. You can drag items between quadrants or set priority explicitly.

### Focus Mode

Click any quadrant header to drill down into just those tasks. Useful when you need to knock out your Do Now items without distraction, or batch-process your Delegate pile.

Press **Esc** or click the header again to return to the full matrix view.


## Scheduling

Move items between time groups — Today, This Week, Later — to plan when you'll get to them.

**Ways to schedule:**
- **Dropdown** — Click the schedule control on any item and pick a time group
- **Selection bar** — Select multiple items, then choose a time group from the bar that appears
- **Keyboard shortcut** — Press **S** with an item selected to open the schedule picker

**Batch scheduling:** Select several items at once and schedule them all to the same time group in one action. Useful for triaging a full Actions list in the morning.

**Changed your mind?** An **Undo** option appears briefly after scheduling, so you can reverse it before it sticks.


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


## Sharing Content

Some items include share buttons (Twitter, LinkedIn, Facebook) for content Rebel created — like social posts or summaries. Click to share directly.


## Example Workflow

> **You:** "Add to my actions: write a LinkedIn post about our new feature launch"
>
> **Rebel:** Added "Write a LinkedIn post about our new feature launch" to Rebel Actions.

Later, open Rebel Actions, click the item to open it, then click **Review** to have Rebel draft the post. Use the share buttons to post it.


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

