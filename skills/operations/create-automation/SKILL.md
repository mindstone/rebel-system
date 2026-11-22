---
name: create-automation
description: Creates scheduled automations through natural language conversation. Rebel interprets schedule intent, configures the automation, and requests a supervised first run for recurring automations.
use_cases:
  - "Set up a weekly summary automation"
  - "Create a daily standup prep that runs at 8:30am"
  - "Automate meeting follow-ups when transcripts are ready"
tools_required:
  - rebel_automations_create
  - rebel_automations_run
  - rebel_automations_list
last_updated: "2026-11-19"
---

# Create Automation

You're helping the user set up a scheduled automation. Your job is to understand what they want automated, when they want it to run, configure it, and request a supervised first run for recurring automations.

## Conversation Flow

1. **Understand the task**: What should the automation do? Get the task and its constraints (what to make, for whom, where to save it, what to avoid).
2. **Identify the skill file**: Which skill or file should be executed? Help them pick from their Library.
3. **Parse the schedule**: Convert natural language like "every Monday at 9am" into a schedule.
4. **Confirm and create**: Show what will be created, then create it.
5. **Supervised first run**: Request the recurring automation's first run with `rebel_automations_run`. The schedule is saved; requesting a run does not confirm its result.
6. **Confirm what is known**: Report the saved schedule and run acknowledgement accurately; its result will appear in Automations. Claim an outcome only after observing it, for example with `rebel_automations_list`. For an observed `completed_with_blocks` result, tell the person “some actions didn't run” and point to Automations for the recorded reasons. Never call this success. **Do not repeat `completed_with_blocks`, “completed with blocks”, or any other internal status name in the user's reply, even as an extra status line or explanation.** Explain an observed refusal only from its recorded reason. **A status alone gives no cause:** if the checked result includes no reason, say only “Some actions didn't run. See that run in Automations for the recorded reasons.” Do not suggest Safety Rules, missing approvals, manual input, or other possible causes unless the recorded reason states them. Describe an approval request only when one actually exists. Keep tool names out of user-facing prose.

## One-Off (Once) Automations

For `once` automations, **do NOT do a supervised first run**. A successful first run marks the automation as completed, which permanently prevents the scheduled run from firing. Instead, just create it and let it run at the scheduled time. Report the scheduled run's outcome when known; do not promise a result or an approval request in advance.

**Times:** for a relative time ("in 10 minutes", "in 2 hours"), use `{type:"once", inMinutes:N}`: the tool works out the clock time, so don't look the time up first. For a wall-clock time ("tomorrow at 3pm"), use `dateTime`. The tool's reply says how long until the run (e.g. "in 10 min"): check it matches what the person asked, and tell them that, not a time you worked out yourself.

## Supervised First Run (Important)

For **recurring** automations, you MUST trigger a first run using `rebel_automations_run` after creation. **Skip this for `once` automations** (see above). This is critical because:

- The first run attempts the task now; its result appears in Automations
- The person's Safety Rules still apply. A run can complete, wait for a real approval or answer, or record that some actions did not run; report only what is known

When `rebel_automations_run` actually reports that the run started or was requested, tell the user:
> "The schedule is saved. I've requested its first run; its result will appear in Automations."

If rebel_automations_run comes back saved for review, tell the person in one sentence: "The first run is waiting for your OK: approve it to run now, or skip it and the automation still runs on schedule." Don't say it's waiting again unless you know it still is: once they decline it, that's finished with.

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

*[Uses rebel_automations_run tool]*

The schedule is saved. I've requested its first run; its result will appear in Automations.

It'll run on its own every Friday at 5pm, following your Safety Rules.

## Tool Usage

**Where the task goes**: each run receives only the skill or file and `userInstructions`, never `description`. Put the person's task and its constraints in `userInstructions`, in their words, whenever the file alone doesn't say exactly what to do, as with a general skill. Keep `description` a short summary for the automation's card.

Use `rebel_automations_create` with:

```json
{
  "name": "Weekly Summary",
  "description": "Summarizes your week and prepares for the next one",
  "userInstructions": "Summarize my week from my meetings and Actions, and list what to prepare for next week. Save it in Notes/Weekly.",
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

**Run location**: leave `executeIn` out unless the person says where this automation should run. Rebel then uses their "New automations run on" choice (Settings → Workspace → Cloud sync), and this computer if they haven't made one. Sending `executeIn` overrides that choice, so only send it when they asked: `"cloud"` for always-on requests ("even when my laptop is closed", "overnight", "across time zones"), `"local"` for "on this computer". Cloud execution needs Cloud continuity set up (Settings → Workspace → Cloud sync); without it the automation still runs on the desktop, so tell them if that's missing. When you confirm the automation, say where it runs from what `rebel_automations_create` returned, not from what you assumed.

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
- Report the run acknowledgement and confirm the schedule. Claim a result only after observing it; otherwise say its result will appear in Automations
