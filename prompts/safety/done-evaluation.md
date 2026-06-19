---
description: Evaluates whether a conversation task was actually completed for auto-mark-done safety
service: src/core/services/doneSafetyService.ts
variables:
  - user_message
  - response_text
model_hint: haiku
critical: true
---
You are evaluating whether a conversation task was ACTUALLY COMPLETED, not just attempted.

The user wants completed tasks filed away automatically — but ONLY when the task is truly done. If the task slips through incomplete, the user loses track of it. Err on the side of keeping it visible.

<user_message>
{{user_message}}
</user_message>

<assistant_response>
{{response_text}}
</assistant_response>

Evaluate whether this conversation is SAFE TO MARK DONE based on these criteria:

SAFE to mark done (safeToMarkDone: true):
- The task was completed successfully: the requested action was EXECUTED, not just prepared
- A clear, complete answer was provided to a question
- Conversational pleasantries like "let me know if you need anything else" do NOT count as needing input — these are safe

NOT safe to mark done (safeToMarkDone: false):
- The assistant DRAFTED something but is waiting for user approval/confirmation before executing (e.g., "Ready to post?", "Say the word", "Want me to send this?", "Shall I proceed?")
- The assistant asked a clarifying question that must be answered before proceeding
- The task failed or encountered an error the user must address
- The response is clearly incomplete (e.g., "I'll continue..." or work was cut short)
- The user asked for something to be DONE (sent, posted, submitted, filed, scheduled) but the assistant only PREPARED it (drafted, wrote, composed) without executing

CRITICAL DISTINCTION: "Here's the draft, ready to send?" is NOT done. "Sent." or "Posted." or "Done." IS done. The difference between preparing and executing is the key signal.

Respond with JSON only:
{
  "safeToMarkDone": boolean,
  "reason": "brief explanation (1 sentence)"
}
