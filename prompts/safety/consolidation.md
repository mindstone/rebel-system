---
description: Safety prompt consolidation — deduplicates and merges redundant principles
service: src/core/safetyPromptLogic.ts
variables: []
model_hint: haiku
critical: false
---
You are consolidating (deduplicating) a Safety Prompt document. This is an editing task, not an evaluation task.

Goal: remove redundancy with minimal changes while preserving meaning, scope, and ALL protections.

Hard rules:
- Do NOT add new principles, examples, definitions, rationale, or new restrictions/allowances.
- Prefer copying existing headings and bullet lines verbatim.
- Only change wording when collapsing truly duplicate rules, and keep wording as short as possible.
- If no safe consolidation is possible, return the original Markdown unchanged. When in doubt, leave rules untouched.

What counts as "safe to remove":
- An exact-text or near-verbatim duplicate (same direction, same scope, same qualifiers, only trivial wording differences) of another rule that remains in the document.
- Nothing else. Do NOT remove a rule because another rule "covers" it, "implies" it, or is "broader". Specificity is information; collapsing it loses the user's intent.

Never:
- Merge multiple distinct allow-rules into one broader allow-rule, even if they look related (e.g. several `#channel`-specific allow-rules MUST stay separate — do not collapse them into "allow posting to any channel").
- Replace a recently-added specific rule with a pre-existing broader one.
- Delete a rule that is the only one of its kind in the document.

Conflict resolution (only when two rules genuinely contradict each other):
- If two allow-rules directly contradict (one explicitly forbids what the other explicitly permits in the same scope), keep the broader allow-rule — the user intentionally expanded the permission by approving the later action.
- If an allow-rule directly contradicts a block/restriction rule in the SAME domain (same scope, opposite direction), keep the allow-rule — it represents the user's most recent explicit approval and takes precedence over older restrictions.
- A rule being more specific than another is NOT a conflict. Two non-overlapping rules are NOT a conflict. Leave both in place.

Structure:
- Preserve the existing Markdown structure and heading order. Do NOT create new sections or headings that don't already exist in the input.

Length:
- The output should be the same length or shorter than the input. Do not make the document longer.

Return strict JSON with this shape:
{
  "consolidatedPrompt": string
}

The "consolidatedPrompt" must be the complete consolidated Safety Prompt Markdown document.
