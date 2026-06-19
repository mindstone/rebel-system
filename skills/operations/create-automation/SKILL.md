---
name: create-automation
description: Creates scheduled automations through natural language conversation. Rebel interprets schedule intent, configures the automation, and runs a supervised first run to generate access rules.
use_cases:
  - "Set up a weekly summary automation"
  - "Create a daily standup prep that runs at 8:30am"
  - "Automate meeting follow-ups when transcripts are ready"
tools_required:
  - rebel_automations_create
  - rebel_automations_run
  - rebel_automations_list
last_updated: "2026-02-21"
---

# Create Automation

You're helping the user set up a scheduled automation. Your job is to understand what they want automated, when they want it to run, configure it, and do a supervised first run so access rules can be generated.

## Conversation Flow

1. **Understand the task**: What should the automation do? Get a clear description.
2. **Identify the skill file**: Which skill or file should be executed? Help them pick from their Library.
3. **Parse the schedule**: Convert natural language like "every Monday at 9am" into a schedule.
4. **Confirm and create**: Show what will be created, then create it.
5. **Supervised first run**: Run the automation right now so Rebel can learn what tools it needs. This is a real run — the user gets value from it and any tool approvals happen inline as normal.
6. **Access rules**: After the run, access rules are auto-generated and auto-approved. If the automation tries something outside its rules in the future, those actions get staged for the user's approval — and the rules expand automatically once approved.

## One-Off (Once) Automations

For `once` automations, **do NOT do a supervised first run**. A successful first run marks the automation as completed, which permanently prevents the scheduled run from firing. Instead, just create it and let it run at the scheduled time. If the automation needs tool approvals, those will be staged for the user's approval when it runs.

Also: when calculating the `dateTime` for a once-schedule, compute the ISO timestamp **immediately before** calling `rebel_automations_create` — not earlier in the conversation. Agent processing time can eat into tight windows.

## Supervised First Run (Important)

For **recurring** automations, you MUST trigger a first run using `rebel_automations_run` after creation. **Skip this for `once` automations** (see above). This is critical because:

- Automations run unattended on a schedule, but they need **access rules** to know what they're allowed to do without asking the user
- The first run observes which tools the automation uses and auto-generates access rules from that
- Access rules are auto-approved after the first run — no manual approval step needed
- If future runs try something new, those actions are staged for the user's approval and rules expand automatically

Tell the user something like:
> "I'll run this now so Rebel can learn what it needs access to. This is a real run — you'll get the results. Any actions that need your approval will ask you inline. After this, Rebel will know what the automation is allowed to do and it'll run on its own going forward. If it ever needs to do something new, it'll stage those actions for your review and update its rules once you approve."

If the user declines the first run, that's fine — let them know the automation will still run on schedule, but may need to stage actions for approval the first time since it hasn't learned what tools it needs yet.

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

Done! Now I'll run it so Rebel can learn what it needs access to. This is a real run — you'll get your weekly summary now, and any actions that need your go-ahead will ask you inline.

*[Uses rebel_automations_run tool]*

All done! Your summary is ready.

That's it! Rebel now knows what this automation needs access to and it'll run on its own every Friday at 5pm. If it ever tries something new that isn't covered by the current rules, it'll stage those actions for your review and update its rules once you approve.

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
- After the first run, let the user know the automation is ready to go — access rules are auto-approved
