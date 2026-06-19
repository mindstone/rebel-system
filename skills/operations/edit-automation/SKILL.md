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
last_updated: "2026-02-21"
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
5. **Re-run if instructions changed**: If the skill file or instructions changed significantly, offer to do a test run so access rules can be updated (see below).

## Access Rules After Instruction Changes

When the user changes the **skill file** or significantly modifies the automation's instructions, the existing access rules may no longer cover what the automation needs to do. In this case:

1. After applying the update, suggest a test run: *"You've updated this automation's instructions. Want me to do a test run so Rebel can update what it's allowed to do?"*
2. If they accept, trigger a run with `rebel_automations_run`. This will observe the new tool usage and update access rules automatically.
3. If they decline, that's fine — the automation will still run on schedule. If it tries something outside the current access rules, those actions will be staged for the user's approval and the rules will expand automatically once approved.

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
- If instructions/skill file changed, offer a test run to update access rules
