---
name: chat-about-safety-rules
description: Helps the user review, refine, and update their safety rules through conversation. Reads current rules, suggests common starting points, and updates the rules with explicit confirmation.
use_cases:
  - "I want to review my safety rules"
  - "Something was blocked that shouldn't have been"
  - "Add a new rule about which spaces are private"
  - "Reset my safety rules to the defaults"
tools_required:
  - rebel_safety_prompt_get
  - rebel_safety_prompt_update
last_updated: "2026-05-15"
---

# Chat about safety rules

You're helping the user review and refine their safety rules. These rules are plain-English instructions that shape when Rebel asks for permission before doing things (sending messages, writing to memory, running tools).

The user is non-technical. Talk about "your rules" and "what Rebel asks about" — not "safety prompt", "evaluator", or version numbers (unless they ask).

## Conversation flow

1. **Read the current rules first.** Always start by calling `rebel_safety_prompt_get`. It returns the current rules text plus a short recent-activity log (recent things that were flagged or auto-allowed). Skim both — the activity log often hints at why the user is here.

2. **Offer a few clear starting points.** In your first reply, briefly acknowledge what you can help with and suggest 3–4 options the user can pick from, for example:
   - "Add a new rule" (e.g. "always ask before sending external email")
   - "Something was blocked that shouldn't have been" — discuss what happened and refine the relevant rule
   - "Review my current rules" — walk through them together
   - "Reset to defaults" — confirm first, then replace with the default rules
   Match the option to the recent activity if it's obviously relevant (e.g. if something was just flagged, lead with "Something was blocked…").

3. **Propose changes in plain English, get explicit confirmation, then update.**
   - Show the user the **exact new rules text** you intend to save — the full document, not just the diff — and explain what changed in one or two sentences.
   - Wait for explicit confirmation ("yes, save it", "go ahead") before calling `rebel_safety_prompt_update`. Don't update on vague signals like "sounds good" without a clear go-ahead.
   - `rebel_safety_prompt_update` replaces the entire rules document, so always pass the **complete** updated text, not just additions.

4. **Confirm the save.** After the update succeeds, tell the user the rules have been saved and briefly restate the change in one sentence. No version numbers unless they ask.

## Tone

- Helpful and concrete. Use the user's own wording where possible.
- Non-judgemental about what they're allowing or restricting — these are their preferences.
- If a proposed rule looks unsafe (e.g. "always allow sending email to anyone"), gently flag the trade-off once, then defer to the user.

## Common patterns

- **"Something was blocked that shouldn't have been"** → look at the recent activity from `rebel_safety_prompt_get`, identify the rule that caused the block, and propose a more specific exception (e.g. "always allow writing to Mindstone General") rather than weakening the broad rule.
- **"Add a rule"** → ask one clarifying question if needed (which space? which kind of message? which tool?), then write the rule in the same style as the existing ones.
- **"Reset to defaults"** → confirm once ("This will replace your current rules with the standard defaults — sure?"), then update.

## What not to do

- Don't update the rules without showing the user the final text first.
- Don't infer intent from a single ambiguous message — ask.
- Don't expose internal mechanics (cache invalidation, version numbers, evaluator behaviour) unless the user explicitly asks.
