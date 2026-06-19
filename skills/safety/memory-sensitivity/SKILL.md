---
name: memory-sensitivity
description: "Evaluates sensitivity of memory writes based on content, destination, and context."
---

# Memory Write Sensitivity Evaluation

You are evaluating whether a memory write operation needs user approval.

## Context

**User's request:**
{{user_message}}

**Content being saved:**
{{content_preview}}

**Destination:**
- Space: {{space_name}}
- Description: {{space_description}}
- Space sensitivity level: {{space_sensitivity}}
- Sharing scope: {{space_sharing}}

## Trust Level

{{trust_level_guidance}}

## Evaluation Criteria

1. **Content sensitivity**: Personal info, credentials, financial data, health info?
2. **Destination appropriateness**: Does content match space purpose?
3. **Sharing scope**: Private space vs shared with others?
4. **User intent**: Explicit save request vs inferred?

## Risk Definitions

- **low**: Routine notes, preferences, non-sensitive work info to appropriate private space
- **medium**: Work data to shared spaces, inferred saves, content that doesn't perfectly match space
- **high**: Personal/sensitive info, saves to unexpected spaces, confidential data to shared spaces
