---
name: build-workflow
description: "Guides users from a use case idea to a working workflow — determines the right delivery mechanism (prompt, skill, automation, or full pipeline) and orchestrates creation step by step."
use_cases:
  - "Turn a use case into a recurring automation"
  - "Build a workflow for a task I do every week"
  - "Set up a skill and automate it"
  - "Create a full pipeline with automation and Actions"
---

# Build Workflow

Guide a user from a use case idea to a working workflow. Determine the right delivery mechanism, then orchestrate creation step by step.

## See also

- [write-skill](../../documentation/write-skill/SKILL.md) - For creating reusable skill files
- [create-automation](../create-automation/SKILL.md) - For scheduling recurring runs
- [edit-automation](../edit-automation/SKILL.md) - For modifying existing automations
- [rebel-os-use-case-finder](../rebel-os-use-case-finder/SKILL.md) - For discovering use cases to build workflows around
- [interview-me-to-look-for-ai-automations](../../thinking/interview-me-to-look-for-ai-automations/SKILL.md) - For deeper discovery conversations
- [Automations (help)](../../../help-for-humans/automations.md) - End-user docs on automations
- [Actions (help)](../../../help-for-humans/actions.md) - End-user docs on Actions

## Delivery Mechanisms

Choose based on frequency and whether the user wants hands-on or fire-and-forget:

| Type | When | What it looks like |
|------|------|-------------------|
| **Prompt** | One-off or exploratory | Text the user speaks or types into a conversation |
| **Skill** | Repeatable, user wants consistency | Markdown skill file invoked by name |
| **Automation** | Recurring (weekly+), fire-and-forget | Skill + schedule — runs unattended |
| **Actions workflow** | Produces items for review/triage | Automation populates Actions for user review |
| **Pipeline** | Complex, multi-feature | Automation + skill + Actions + multiple connectors |

## [PROCESS]

1. **Understand the use case.** What does the user want to achieve? If they came from use-case-finder, they'll already have a clear description. If not, clarify the task, frequency, and desired output.
2. **Determine delivery mechanism.** Key question: how often will this run, and does the user want to trigger it or have it happen automatically?
   - **One-off or exploring** → just help them do it now (a prompt is fine)
   - **Repeatable, wants consistency** → create a skill
   - **Weekly+ recurring** → create a skill, then an automation
   - **Produces items for review** → skill + automation + explain Actions flow
3. **Create the skill** (if needed). Follow [write-skill](../../documentation/write-skill/SKILL.md). Keep it focused on a single task.
4. **Create the automation** (if needed). Follow [create-automation](../create-automation/SKILL.md). This includes the supervised first run for access rules.
5. **Explain the Actions flow** (if relevant). If the automation produces items for the user to review (e.g., client briefs, weekly summaries), explain that these will appear in their Actions. Point them to [Actions (help)](../../../help-for-humans/actions.md) if they're unfamiliar.
6. **Confirm it's working.** Give the user a concrete way to verify: "You'll see [specific output] in your Actions by [time]. Check that it caught [specific thing] — if not, we can adjust."

## Worked Example: Weekly Client Brief

| Step | Action |
|------|--------|
| Use case | "I want a weekly summary of everything happening with each active client." |
| Delivery | Weekly frequency, fire-and-forget → skill + automation + Actions |
| Skill | Create `weekly-client-brief` — searches Gmail + Slack + transcripts, produces structured brief per client |
| Automation | Monday 8am via create-automation. Supervised first run generates access rules |
| Actions | Each brief lands as an action item for morning review |
| Verify | "Monday morning, check your Actions for client briefs. Confirm it found the right threads and transcripts." |

## [IMPORTANT]

- Match delivery mechanism to frequency — don't over-engineer one-off tasks into automations
- Always create the skill first, then the automation that uses it
- The supervised first run (in create-automation) is critical — don't skip it
- If the user's use case is vague, ask what success looks like before building anything
