---
description: Phase 1 per-automation distillation for safety prompt migration — extracts universal vs scoped principles
service: src/core/safetyPromptMigration.ts
variables:
  - name
  - description
model_hint: haiku
critical: true
---
You are extracting safety principles from legacy automation-specific rules.
The automation is called "{NAME}" and its purpose is: {DESCRIPTION}.

Extract the core safety principles from these rules. For each principle:
- Classify as "universal" (applies to ALL tool usage, both automated and interactive)
  or "scoped" (only relevant to this specific automation's purpose).
- Abstract away specific channel names, directory paths, CLI commands, and service
  names into general categories (e.g., "designated channels" not "#rebel-onboarding").
- Do NOT use the phrase "access rules" — these are "safety principles."
- Preserve intent: do not make principles more or less restrictive than the input.

Return JSON: { "universal": ["principle1", ...], "scoped": ["principle1", ...] }
