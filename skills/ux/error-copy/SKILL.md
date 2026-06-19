---
name: error-copy
description: "Rules for writing error messages, toasts, banners, and recovery copy in Rebel's voice — dry, calm, helpful, and never apologetic. Use whenever you add or rewrite any user-facing error string."
use_cases:
  - "Write a new error toast or banner"
  - "Rewrite a flat 'Failed to X' string"
  - "Decide whether voice belongs in a billing / auth / compliance message"
  - "Avoid breaking error classifiers and Sentry fingerprints when changing copy"
  - "Match the tone of `personaQuips.ts`, `useExternalDeliveryFailedToast.ts`, and `turnErrorRecovery.ts`"
last_updated: 2026-05-15
contributed:
  - "Rebel"
tools_required: []
agent_type: either
---

# Error Copy

[PERSONA]
You are writing error messages for Rebel: an agentic AI app for non-technical knowledge workers. Errors are not a hostile interruption — they're a moment where a calm, competent colleague tells the user what happened and what to do.

You are dry. You are honest. You are slightly amused. You are never theatrical and never apologetic.

[GOAL]
Every error string in Rebel should:

1. Tell the user what happened in plain words.
2. Tell them what (if anything) to do next.
3. Reassure that their work is safe — when it actually is.
4. Carry just enough voice that it feels like a person wrote it, not a 500-error page.

Bad: "Failed to load conversation."
Good: "That conversation didn't come back. Try once more?"

Bad: "An error occurred. Please try again."
Good: "Something went sideways. Try again, or check Settings → Diagnose."

Bad: "Error: Network connection failed."
Good: "Can't reach the internet. Check your connection and we'll pick this back up."

---

## Voice palette

These tones are in-bounds. Pick the calmest one that still reads like a person:

| Tone | When to use | Example |
|---|---|---|
| **Calm-and-direct** | Default. Most errors. | "Couldn't open that link. The path may have moved." |
| **Wry / dry** | Recoverable hiccup, low-stakes. | "That conversation didn't come back. Try once more?" |
| **Light self-aware** | Our fault, transient. | "The AI sneezed mid-sentence. Try again — your message is safe." |
| **Concierge** | User action required (settings, billing). | "Your Library isn't set up yet. Hop into Settings and we'll have one in a moment." |

These tones are **out of bounds**:

| Tone | Why we don't use it |
|---|---|
| Apologetic ("Sorry!", "Oops!") | Reads weak and chatbot-y. We don't apologize for the platform behaving like a platform. |
| Cheery ("Whoops!", "Uh-oh!") | Performs concern without being useful. |
| Theatrical / verbose ("Something terribly wrong has occurred…") | Manufactures urgency. |
| Tech-jargon ("ECONNREFUSED at port 443") | Already shown to be useless — humanize it. |
| Self-deprecating ("I'm dumb sometimes!") | Erodes trust. |

---

## The ten rules

1. **"Couldn't &lt;verb&gt;"** beats **"Failed to &lt;verb&gt;"** every time.
   - "Couldn't copy that link" > "Failed to copy that link"
   - "Couldn't reach the model" > "Failed to reach the model"

2. **Two-beat structure**: state what happened, then what to do. The second beat is optional only when there is genuinely nothing to do.
   - "Couldn't reach the model. Try again in a moment."
   - "Your storage is full. Free up some space and try again."

3. **Never apologize, never panic.** No "Sorry!", no "Oops!", no "Something terribly wrong." Rebel is a colleague, not a chatbot in distress.

4. **"Your X is safe"** is reserved for moments where the user might reasonably believe their work was lost. Use it. Don't use it filler-style.
   - Good: "The AI sneezed mid-sentence. Try again — your message is safe."
   - Bad: "Couldn't open Settings. Your message is safe." (their message was never in play)

5. **One voice flourish per surface.** A toast gets one wry beat, not two. A banner with "Your AI sneezed mid-sentence" doesn't also need "Try again, champ."

6. **Match the stakes.** Billing, auth, security, and legal text stay neutral and accurate. The "capable colleague" voice belongs in transient errors, recoverable hiccups, and confused-link copy — not in "Your card was declined."

7. **No filler verbs.** Strip "please", "kindly", "unfortunately". They add nothing. ("Please try again" → "Try again." or, better, "Try again — your message is safe.")

8. **No model names, no error codes, no stack traces.** Users don't need to see "OpenAI GPT 5.4 encountered an error." They need to see "The AI service had a hiccup."

9. **Punctuation does work.** A single em-dash or a one-word fragment can carry voice without adding words. "Tried once. Going around again." reads better than "Will retry automatically."

10. **Read it out loud.** If you'd be embarrassed to say it to a colleague in person, rewrite it.

---

## What to leave alone

Some error surfaces should stay flat and neutral. Don't punch voice into:

- **Billing / quota / spend-limit copy.** Users hitting these need calm, specific instructions, not jokes. "You've reached your usage limit" stays "You've reached your usage limit."
- **Auth / API-key copy.** Same — calm, specific, no quips.
- **Moderation / safety-filter copy.** Stays neutral by policy.
- **Permission denied / access denied** (file-system and OS). Brief, factual, never blamed on the user.
- **Anything inside a `<dialog>` that the user is reading to make a financial or security decision.**

If you're not sure whether a surface qualifies, default to neutral.

---

## Kind-first error classification — read before changing humanizer copy

Prefer structured error kinds over copy matching. New error UX should flow:

1. Classify the source failure as an `AgentErrorKind`.
2. Derive recovery metadata with `packages/shared/src/utils/classifyErrorUx.ts`.
3. Render the `AgentErrorResolution` in the surface (`SessionErrorNotice`, toast, or mobile equivalent).
4. Use substring fallback only when the kind is `unknown` or the event is legacy/unclassified.

The cautionary case (see internal ticket history): `Stream must be true` looked transient by substring, but its known kind was `invalid_request`, so retrying was wrong. If the kind is known, trust the kind first.

## Legacy classifier-substring coupling — read before changing old humanizer copy

Some older surfaces still classify errors by **substring-matching the humanized copy**:

- **`src/renderer/features/agent-session/utils/classifySessionError.ts`** — assigns Sentry fingerprint categories (`api_error`, `rate_limit`, `workspace_error`, etc.). Substring matches against the user-facing message.
- **`packages/shared/src/utils/__tests__/friendlyErrors.test.ts`** — many assertions use `expect(result).toContain('billing attention' | 'hiccup' | 'mid-conversation' | 'safe' | 'too long' | 'momentarily busy' | 'few minutes' | 'few hours' | 'usage limit' | 'spending limit' | 'too large' | 'try again' | 'interrupted' | 'summarize' | 'different model' | 'Settings' | ...)`.

Do not add new substring classifiers for new error UX. Extend `AgentErrorKind`, `humanizeAgentError`, or `classifyErrorUx` instead.

**If you change a humanized error string, you must:**

1. **Preserve at least one anchor phrase** that both `classifySessionError` and `friendlyErrors.test.ts` rely on, OR
2. **Update the classifier substring list AND the test assertion AND the matching Sentry-grouping doc** in lockstep.

Anchor phrases currently in use (do not silently drop):

| Anchor | Used by | Meaning |
|---|---|---|
| `hiccup` | api_error classifier + 500/api_error test | Transient AI-service error |
| `momentarily busy` | provider routing 503/529 test | Provider routing transient |
| `mid-conversation` | tool_use_id test + api_error classifier | Mid-turn interruption |
| `rough patch` | api_error classifier | Repeated server-error retries |
| `hit a snag` | api_error classifier | Generic retry path |
| `having a moment` | api_error classifier | Provider status issue |
| `temporary hiccup` | api_error classifier | Transient stall |
| `took too long to respond` | api_error classifier | Timeout |
| `couldn't reach the internet` | api_error classifier | Connectivity loss |
| `multi-model setup` | api_error classifier | Alt-model retry init |
| `library isn't set up` | workspace_error classifier + test | Core-directory missing |
| `billing attention` | friendlyErrors test (4+ cases) | Generic billing |
| `usage limit` | friendlyErrors test (3+ cases) | Quota exhaustion |
| `spending limit` | friendlyErrors test (3+ cases) | API spend cap |
| `provider's rate limit` | friendlyErrors test (5+ cases) | 429 |
| `few minutes` / `few hours` | friendlyErrors test | Reset hint per-provider |
| `too long` + `summarize` | context overflow test | Context window |
| `too large` | size overflow test | Prompt too big |
| `different model` + `Settings` | chat-model test, model-unavailable test | User action |
| `interrupted` + `try again` | stream lifecycle test | SDK stream drop |
| `restart` / `Restart Rebel` / `Your files are still there` | spawn / EMFILE test | FD exhaustion |
| `safe` | many tests | Reassurance idiom |

If your rewrite changes one of these, change the test in the same PR and add the new substring to the classifier if you want the new phrasing to still bucket correctly.

---

## Worked examples

### Toast: "Failed to copy link"
- Flat: "Failed to copy link"
- Rebel: **"Couldn't copy that link. Try again?"**
- Wry: **"That link slipped. One more shot?"** (only on a low-stakes surface like a context menu)

### Banner: AI returned empty
- Flat: "The response was empty. Please try again."
- Rebel: **"The AI returned blank pages. Try once more."** *(preserves `empty` + `try again` test tokens? — check: no, it loses `empty`. Either preserve or update test.)*
- Safer (test-preserving): **"The response was empty. One more pass — your message is safe."**

### Surface error: "Something broke in this view"
- Flat: "Something broke in this view. Try refreshing."
- Rebel: **"This view tripped over its own feet. Refresh to recover — your conversation is safe."**

### Onboarding: "Failed to validate API key"
- Flat: "Failed to validate API key. Please check and try again."
- Rebel: **"That key didn't take. Double-check it — sometimes a stray space sneaks in."**

### Document save: ENOSPC
- Flat: "ENOSPC: no space left on device."
- Rebel: **"Your storage is full. Free up some space and try again."** *(already in `documentIoErrorClassification.ts` — leave it.)*

---

## Signposts

- Voice reference: [`docs/project/BRAND_VOICE.md`](../../../../docs/project/BRAND_VOICE.md)
- Voice gold standards in code:
  - `src/renderer/features/agent-session/work-surface/utils/personaQuips.ts`
  - `src/renderer/features/agent-session/hooks/useExternalDeliveryFailedToast.ts`
  - `src/main/services/turnErrorRecovery.ts`
- Changelog tone reference: [`rebel-system/help-for-humans/changelog.md`](../../../help-for-humans/changelog.md)
- Centralized humanizers (where most error copy lives):
  - `packages/shared/src/utils/friendlyErrors.ts` — substring → user-facing message
  - `packages/shared/src/utils/humanizeAgentError.ts` — classification-first humanizer
  - `src/renderer/utils/actionErrorMessage.ts` — extract / append helpers
  - `src/shared/utils/documentIoErrorClassification.ts` — POSIX errno → message
  - `src/core/navigation/types.ts` — `NAVIGATION_ERROR_COPY`
- Classifier (read this before changing humanizer copy):
  - `src/renderer/features/agent-session/utils/classifySessionError.ts`

When in doubt: prefer the calmest in-bounds tone, preserve test anchor phrases, and run `npm run validate:fast` plus `npm run test -- friendlyErrors classifySessionError documentIo` after changes.
