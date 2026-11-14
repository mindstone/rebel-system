---
name: save-as-example
description: "Save a finished output as an example for the skill that made it. Teach the skill from your changes, remember this version, or use it as a template next time."
use_cases:
  - "Save this as an example"
  - "Teach this skill"
  - "Remember this version"
  - "Use this as a template next time"
tags: [skills, examples, personalisation]
last_updated: 2026-11-14
tools_required: [Read, Write, LS, AskUserQuestion, inspect_prior_turns, get_tool_call]
agent_type: main_agent
---

# Save as example

Keep a finished piece of work and what made it better, so the skill can learn from it next time.
Use the same flow for documents, reports, meeting briefs, sent drafts and other skill outputs.
Keep questions and explanations plain. The person chooses the lessons; you handle the filing.

## 1. Find the skill

The message may say `Save this as an example for <skill name> (<skill path>)`.
Use that path. Otherwise check this conversation's skill reads and @mentions.
Use `inspect_prior_turns`, first for the index, then with `turn_id` for the relevant turns.
Look for `SKILL.md` reads or single-file skills at any depth under `skills/` (`skills/<name>.md` or `skills/<folders>/<name>.md`).
If several skills helped, ask which one with one AskUserQuestion single-select card listing their names.
If none can be identified, ask which skill this should teach. Read the chosen skill before continuing.

## 2. Find the finished version

For a file, Read it as it is now. For a draft, use the person's “Send … as written” message.
Check the sending result before calling it sent; a failed send can still provide a useful example.
If they edited elsewhere, offer: “You can upload the finished version if you changed it outside Rebel.”
Use the uploaded version when provided. Don't claim to have seen changes you cannot retrieve.

## 3. Find Rebel's version before their changes

For a draft, retrieve the agent's own draft view call with `get_tool_call`.
For a file, find the last successful agent Write or Edit of that path before the person's changes.
Use `get_tool_call` with its `turn_id` and `tool_use_id` to recover the inputs and output.
Use that last agent-authored version as the “first version”, so Rebel's own revisions aren't credited to the person.
A Write's `content` gives the full text. For Edits, reconstruct from the earlier Write and successful edits up to that point;
an edited fragment alone is not the whole document. Read any saved full-output pointer when needed.
If the first version cannot be recovered, say: “I can save your finished version and lessons, but I couldn't recover my earlier draft.”
Save final plus lessons only in that case; don't invent the missing text or changes.

## 4. Show what changed

Use the existing view tool to show one `diff` section with the full recovered texts when each is at most 12,000 characters:
`before` is the first version, `after` is the finished version,
`beforeLabel` is “First draft” and `afterLabel` is “Your version”.
If either version is longer, show labelled changed passages instead, keeping each `before` and `after` text
within 12,000 characters. Say that the comparison shows excerpts. Still save both complete versions in step 7.
Introduce it simply: “Here's what you changed.” Skip the comparison if the first version is missing.

## 5. Choose where to keep it

- **Their own private space or Chief of Staff:** use the skill's own examples folder.
- **A core skill in `rebel-system/`:** use their own version in Chief of Staff, never the bundled folder.
- **A shared Space's skill, whoever owns it:** ask with a single-select card:
  “Keep it in my own space (recommended)” or “Share with the team”. Wait for the choice.
  Their own space uses a Chief-of-Staff version; team uses the Space skill's examples folder.
  Normal write handling decides whether the team write is saved directly or offered as a suggestion.

For a personal version, use the Chief-of-Staff space path given in context, keeping the same path after `skills/`.
Read an existing version and keep its instructions. If none exists, create a minimal `SKILL.md` with
`name`, a one-line `description`, `extends: <exact base skill path>` and `extension_type: overlay`.
Its body needs only: “Use the base skill and follow the examples saved here.”
See [Extend Skill](../customise-and-extend-skill/SKILL.md) for the naming convention.

A folder skill keeps examples in `<skill>/examples/` beside `SKILL.md`.
A single-file skill at `<category>/<name>.md` keeps them in `<category>/<name>/examples/`.
Never move or rename the single-file skill to make room for examples.
When creating a personal version of a single-file skill, use `<Chief-of-Staff>/skills/<category>/<name>/SKILL.md`.

Then list that examples folder (LS), including examples saved earlier in this conversation.

## 6. Choose the lessons, and add or replace, in one card

Propose two or three single-line lessons grounded in those changes, useful for future work.
If no comparison is possible, propose lessons about the finished version instead.
For example quality guidance, see [Improve Skill](../improve-skill/SKILL.md#example-best-practices).

Ask with one AskUserQuestion call and wait for the answer:

1. A multi-select: “What should this skill remember?” with the proposed lessons.
   The person can add their own through Other.
2. **Whenever the examples folder already has at least one example, you must add** a second, single-select
   question in the same call: “Add this as a new example, or replace one?” Offer “Add as new” and at most
   three “Replace <name>” choices, each named clearly enough to recognise. With one or two examples, list
   “Add as new” first, then each. With three or more, list “Replace <oldest>” first, then “Add as new”,
   then up to two of the newest. Never decide this yourself, even when the new output looks like a fresh
   one; the person chooses.

When the folder is empty or missing, ask only the lessons question and add a new example.
Keep only the lessons they ticked. Replace only the chosen file; adding must not overwrite an existing example.

## 7. Save one example file

For a team example, apply step 8 before writing.
For a new example, write `examples/yyMMdd-<short-slug>.md`; use a different slug if it already exists.
For replacement, write the chosen existing file. Keep everything in that one file:

```markdown
---
description: "A brief that leads with the decision and keeps background short."
date: "<YYYY-MM-DD>"
source: "<conversation link> — <output path or sent email>"
lessons:
  - "<chosen lesson>"
---

## Lessons
- <chosen lesson>

## Final version
<finished text>

## First version
<last agent-authored text before the person's changes, or: First version unavailable.>
```

## 8. Keep team examples suitable for sharing

Before any team write, remove other people's email addresses, phone numbers and names other than the person's own
from the whole example, including both versions, lessons and source. Use neutral labels where needed.
Tell the person what you removed. Keep personal examples in their own space unless they chose the team.
After writing, link to the example and say whether it was saved or submitted as a suggestion, as the tool result confirms.
The next use should read its lessons and say “Written from your <date> example.” A little less explaining yourself next time.
