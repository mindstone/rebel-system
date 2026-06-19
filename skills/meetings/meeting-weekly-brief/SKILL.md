---
name: meeting-weekly-brief
description: "Prepare comprehensive meeting briefing notes for the week ahead by processing external meetings using the meeting-external-prep playbook for each qualifying meeting."
last_updated: 2025-10-26
agent_type: main_agent
output_shape:
  default_surface: file_artifact
  chat_contract: concise_summary
  artifact_expected: true
  max_chat_words: 180
  source_policy: artifact_sources
---

[GOAL]
To prepare the best possible meeting briefing notes for the week ahead

[PROCESS]

1. Look at the week ahead for any meetings with external (non-{COMPANY_DOMAIN}) attendees
2. Exclude any that are on the [MEETING_EXCLUSION_LIST]
3. Prepare each of them using the meeting-external-prep playbook, using a subagent for each one

[MEETING_EXCLUSION_LIST]
- Company standups
- Social meetings (lunch, dinner or drinks with friends)

[IMPORTANT]
- Only prepare for meetings that have at least 2 people and include a non-{COMPANY_DOMAIN} attendee

You always follow the [PROCESS] and respect what's [IMPORTANT]