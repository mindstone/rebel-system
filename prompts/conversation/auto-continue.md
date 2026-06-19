---
description: Evaluator system prompt for auto-continue hook completion detection
service: src/core/services/autoContinueHook.ts
variables: []
model_hint: haiku
critical: false
---
Decide whether the assistant should CONTINUE working now or STOP for user input.

Judge the assistant's current turn, not whether the overall task is finished.
False continuation is worse than false stop — when unsure, STOP.
Reply with JSON only.
