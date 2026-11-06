---
name: create-automation
description: Creates scheduled automations through natural language conversation. Rebel interprets schedule intent, configures the automation, and runs a supervised first run so the person can see it work.
use_cases:
  - "Set up a weekly summary automation"
  - "Create a daily standup prep that runs at 8:30am"
  - "Automate meeting follow-ups when transcripts are ready"
tools_required:
  - rebel_automations_create
  - rebel_automations_run
  - rebel_automations_list
last_updated: "2026-11-06"
---

# Create Automation

You're helping the user set up a scheduled automation. Your job is to understand what they want automated, when they want it to run, configure it, and do a supervised first run so they can see it work.

## Conversation Flow

1. **Understand the task**: What should the automation do? Get a clear description.
2. **Identify the skill file**: Which skill or file should be executed? Help them pick from their Library.
3. **Parse the schedule**: Convert natural language like "every Monday at 9am" into a schedule.
4. **Confirm and create**: Show what will be created, then create it.
5. **Supervised first run**: Run the automation right now so the person can see it work. This is a real run — the user gets value from it and any tool approvals happen inline as normal.
6. **Confirm the result**: Tell the person what actually ran and what, if anything, needs their review. Future runs follow their Safety Rules; actions that need approval are saved for review.

## One-Off (Once) Automations

For `once` automations, **do NOT do a supervised first run**. A successful first run marks the automation as completed, which permanently prevents the scheduled run from firing. Instead, just create it and let it run at the scheduled time. If the automation needs tool approvals, those will be staged for the user's approval when it runs.

**Times:** for a relative time ("in 10 minutes", "in 2 hours"), use `{type:"once", inMinutes:N}`: the tool works out the clock time, so don't look the time up first. For a wall-clock time ("tomorrow at 3pm"), use `dateTime`. The tool's reply says how long until the run (e.g. "in 10 min"): check it matches what the person asked, and tell them that, not a time you worked out yourself.

## Supervised First Run (Important)

For **recurring** automations, you MUST trigger a first run using `rebel_automations_run` after creation. **Skip this for `once` automations** (see above). This is critical because:

- The first run is a real run so the person can see the automation work and get its results now
- Actions that need approval ask as normal; future unattended runs save those actions for review under the person's Safety Rules

Tell the user something like:
> "I'll run this now so you can see it work and get the results. Any actions that need your approval will ask as usual. After this, it'll run on schedule and save any actions that need your OK for review."

If rebel_automations_run comes back saved for review, tell the person in one sentence that the first run is waiting for their OK, and that if they'd rather skip it the automation still runs on schedule. Don't say it's waiting again unless you know it still is: once they decline it, that's finished with.

## Schedule Parsing

Convert natural language to schedule types:

| User says | Schedule type | Configuration |
|-----------|--------------|---------------|
| "every day at 9am" | daily | time: "09:00" |
| "weekday mornings at 8:30" | weekly | daysOfWeek: [1,2,3,4,5], time: "08:30" |
| "every Monday at 9am" | weekly | daysOfWeek: [1], time: "09:00" |
| "twice a week, Mon and Fri" | weekly | daysOfWeek: [1,5], time (ask) |
| "every 3 days" | every_n_days | intervalDays: 3, time (ask) |
| "first of every month" | monthly | daysOfMonth: [1], time (ask) |
| "when a transcript is ready" | event | trigger: "transcript-ready" |
| "in 10 minutes", "in 2 hours" | once | {type:"once", inMinutes:10} / {type:"once", inMinutes:120} |
| "do this tomorrow at 3pm" | once | {type:"once", dateTime:"<ISO datetime>"} |
| "run this on Friday at 5pm, just this once" | once | {type:"once", dateTime:"<ISO datetime for next Friday 17:00>"} |

Day of week values: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6

## Example Conversation

**User**: I want to set up a weekly summary automation

**Rebel**: I can help with that. A few quick questions:

1. **What should this automation do?** (e.g., summarize your week, review actions, compile meeting notes)
2. **When should it run?** (e.g., "every Friday at 5pm", "Monday mornings")
3. **Is there a specific skill or file in your Library you want it to use?**

**User**: It should summarize my week and prepare for the next one. Friday at 5pm works. Use my weekly-review skill.

**Rebel**: Perfect. Here's what I'll create:

**Weekly Summary**
- Runs: Every Friday at 5:00 PM
- Uses: `skills/weekly-review/SKILL.md`
- Does: Summarizes your week and prepares for the next one

Creating this now...

*[Uses rebel_automations_create tool]*

Done! Now I'll run it so you can see it work. This is a real run — you'll get your weekly summary now, and any actions that need your go-ahead will ask you inline.

*[Uses rebel_automations_run tool]*

All done! Your summary is ready.

That's it! It'll run on its own every Friday at 5pm. Any actions that need your OK will be saved for review under your Safety Rules.

## Tool Usage

Use `rebel_automations_create` with:

```json
{
  "name": "Weekly Summary",
  "description": "Summarizes your week and prepares for the next one",
  "filePath": "skills/weekly-review/SKILL.md",
  "schedule": {
    "type": "weekly",
    "daysOfWeek": [5],
    "time": "17:00"
  },
  "enabled": true,
  "catchUpIfMissed": true
}
```

**Run location**: leave `executeIn` out unless the person says where this automation should run. Rebel then uses their "New automations run on" choice (Settings → Cloud), and this computer if they haven't made one. Sending `executeIn` overrides that choice, so only send it when they asked: `"cloud"` for always-on requests ("even when my laptop is closed", "overnight", "across time zones"), `"local"` for "on this computer". Cloud execution needs Cloud continuity set up (Settings → Cloud); without it the automation still runs on the desktop, so tell them if that's missing. When you confirm the automation, say where it runs from what `rebel_automations_create` returned, not from what you assumed.

Then trigger the first run with `rebel_automations_run`:

```json
{
  "id": "<automation-id-from-create-response>"
}
```

## Tips

- Always confirm the schedule interpretation before creating
- If no skill file is specified, offer to help find one in the Library
- Suggest sensible defaults (e.g., "09:00" if no time specified)
- For event-triggered automations, explain what events are available (transcript-ready, etc.)
- Always do the supervised first run after creation for recurring automations — don't just tell the user to test it later. **Exception: skip the first run for `once` automations.**
- After the first run, report its actual result and confirm that the automation will run on schedule
