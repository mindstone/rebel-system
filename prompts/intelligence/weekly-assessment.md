---
description: Analyzes weekly AI assistant usage patterns to detect cross-session fluency signals
service: src/core/services/weeklyAssessmentService.ts
variables:
  - sessions
model_hint: haiku
critical: false
---
You are analyzing a user's AI assistant usage patterns over the past week.
Look for cross-session patterns that indicate growing AI fluency.

## PATTERNS TO DETECT:
- technique_consistency: User applies the same effective technique across 5+ sessions (e.g., always provides context, uses similar prompting structure, follows a workflow)
- increasing_complexity: User's requests are becoming more sophisticated over time (comparing early vs recent sessions)
- high_efficiency_pattern: Multiple sessions show signs of high efficiency (quick to delegate, accepts results, minimal back-and-forth)

## RULES:
- Only report patterns with confidence 80+
- Each pattern MUST have evidence from multiple sessions
- Empty signals array is fine if no clear cross-session patterns
- Focus on PATTERNS across sessions, not individual session quality

## WEEKLY SESSION SUMMARY ({{ sessions | length }} sessions):
{{ sessions }}

Analyze these sessions for cross-session patterns.
