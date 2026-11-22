---
name: edit-automation
description: Modifies existing automations through conversation. Change schedules, skill files, or settings without navigating complex forms.
use_cases:
  - "Change automation schedule to run at a different time"
  - "Update which skill file an automation uses"
  - "Enable/disable an automation"
  - "Add additional run times to an existing automation"
tools_required:
  - rebel_automations_list
  - rebel_automations_update
  - rebel_automations_run
  - rebel_automations_toggle
  - rebel_automations_delete
last_updated: "2026-11-19"
---

# Edit Automation

You're helping the user modify an existing automation. The automation details have been provided in the conversation context.

## Context Provided

When this skill is invoked, you'll receive context like:
- Automation name and ID
- Current schedule (formatted)
- Current skill file path
- Whether it's enabled

## Common Edit Operations

### Change Schedule

**User**: Make it run at 10am instead of 9am

```json
{
  "id": "<automation-id>",
  "schedule": {
    "type": "daily",
    "time": "10:00"
  }
}
```

### Add Additional Times

**User**: Also run it Friday afternoons at 5pm

For daily schedules with additional times:
```json
{
  "id": "<automation-id>",
  "schedule": {
    "type": "daily",
    "time": "09:00",
    "additionalTimes": ["17:00"]
  }
}
```

Or convert to weekly if user wants different days:
```json
{
  "id": "<automation-id>",
  "schedule": {
    "type": "weekly",
    "daysOfWeek": [1, 5],
    "time": "09:00"
  }
}
```

### Change Skill File

**User**: Use my new weekly-summary-v2 skill instead

```json
{
  "id": "<automation-id>",
  "filePath": "skills/weekly-summary-v2/SKILL.md"
}
```

### Change What It Does

**User**: Also send me the summary as a draft email

Each run receives only the skill file and `userInstructions`, never `description`, so a change to the task goes in `userInstructions`. Send the whole new text, starting from the current "Your instructions" that `rebel_automations_list` shows (it replaces the old text); keep `description` a short card summary.
```json
{
  "id": "<automation-id>",
  "userInstructions": "Summarize my week and list what to prepare for next week. Also save the summary as a draft email to me."
}
```

### Change Run Location (Desktop ↔ Cloud)

**User**: Run this in the cloud so it fires even when my laptop is closed

Use `rebel_automations_update`:
```json
{
  "id": "<automation-id>",
  "executeIn": "cloud"
}
```

Cloud runs 24/7 on the user's Rebel Cloud (timezone is captured automatically). It needs Cloud continuity set up (Settings → Workspace → Cloud sync) — without it the automation still runs on the desktop, so mention that if they're not set up. Use `executeIn: "local"` to switch back. Event-triggered and built-in system automations always run locally.

### Enable/Disable

**User**: Pause this automation for now

Use `rebel_automations_toggle`:
```json
{
  "id": "<automation-id>",
  "enabled": false
}
```

### Delete

**User**: Delete this automation

Use `rebel_automations_delete`:
```json
{
  "id": "<automation-id>"
}
```

## Conversation Flow

1. **Acknowledge current state**: "This automation currently runs [schedule] using [skill file]."
2. **Understand the change**: What specifically do they want to modify?
3. **Preview the change**: "I'll change the schedule from X to Y. Does that look right?"
4. **Apply and confirm**: Make the change, confirm it's done.
5. **Re-run if instructions changed**: If the skill file or instructions changed significantly, offer a test run to check the updated instructions (see below).

## Test Runs After Instruction Changes

When the user changes the **skill file** or significantly modifies the automation's instructions, a test run can check the updated instructions:

1. After applying the update, offer a test run to check the updated instructions.
2. If they accept, request a run with `rebel_automations_run` and report its acknowledgement accurately. Claim a result only after observing it, for example with `rebel_automations_list`. For an observed `completed_with_blocks` result, tell the person “some actions didn't run” and point to Automations for the recorded reasons. Never call this success. **Do not repeat `completed_with_blocks`, “completed with blocks”, or any other internal status name in the user's reply, even as an extra status line or explanation.** Explain an observed refusal only from its recorded reason. **A status alone gives no cause:** if the checked result includes no reason, say only “Some actions didn't run. See that run in Automations for the recorded reasons.” Do not suggest Safety Rules, missing approvals, manual input, or other possible causes unless the recorded reason states them. Describe an approval request only when one actually exists. Keep tool names out of user-facing prose.
3. If they decline, the automation still runs on schedule under their existing Safety Rules. A test run does not automatically expand access rules.

This is NOT needed for schedule-only changes, enable/disable, or other non-instruction edits.

## Example Conversation

**Context**: Edit automation "Weekly Summary" (ID: abc123). Current schedule: Every Friday at 5:00 PM. Skill file: skills/weekly-review/SKILL.md

**User**: Can you also run it Monday mornings?

**Rebel**: Currently, "Weekly Summary" runs every Friday at 5:00 PM.

To add Monday mornings, I'll change it to run:
- **Monday** at 9:00 AM
- **Friday** at 5:00 PM

Does that schedule work, or would you like a different time on Monday?

**User**: Make Monday at 8:30am

**Rebel**: Got it. Updating "Weekly Summary" to run:
- Monday at 8:30 AM
- Friday at 5:00 PM

*[Uses rebel_automations_update tool]*

Done! Your automation now runs twice a week. Next run will be Monday at 8:30 AM.

## Tips

- Always show current state before making changes
- Confirm schedule interpretations before applying
- For complex schedule changes, explain the new schedule clearly
- After updates, mention when the next run will be
- If disabling, ask if they want to re-enable later or if they'd prefer to delete
- If instructions/skill file changed, offer a test run to check the updated instructions
