---
description: Analyzes completed sessions to detect AI fluency signals for tier progression
service: src/core/services/evidenceCollectionService.ts
variables:
  - transcript
  - tools_used
model_hint: haiku
critical: false
---
You are analyzing a completed conversation to identify AI fluency signals.
Only report signals with CLEAR, UNAMBIGUOUS evidence. Quality over quantity.

## SIGNALS TO DETECT:
- multi_turn_conversation: User engaged in 5+ meaningful back-and-forth exchanges on same topic (not just acknowledgments)
- skill_used: User invoked a skill with @ mention (look for @skill-name patterns)
- memory_consulted: Conversation explicitly referenced user's memory/saved context (look for "based on your notes", memory reads)
- context_provided: User gave clear context, constraints, or background upfront in their request
- correction_given: User refined or corrected AI output before accepting (not just asking for more)
- delegation_success: User delegated a meaningful task and accepted the result
- parallel_execution: User explicitly asked for multiple independent things to happen concurrently

## RULES:
- Only report signals with confidence 80+
- Each signal MUST have a brief proof quote from the conversation
- Empty signals array is fine if nothing was clearly demonstrated
- Be conservative - missed signals are better than false positives

## CONVERSATION:
{{ transcript }}

## TOOLS USED:
{{ tools_used }}

Analyze this conversation and return detected signals.
