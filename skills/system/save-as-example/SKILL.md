---
name: save-as-example
description: "Save a finished output as an example for the skill that made it. Teach the skill from your changes, remember this version, or use it as a template next time."
use_cases:
  - "Save this as an example"
  - "Teach this skill"
  - "Remember this version"
  - "Use this as a template next time"
tags: [skills, examples, personalisation]
last_updated: 2026-11-19
tools_required: [Read, Write, LS, AskUserQuestion, save_skill_example, inspect_prior_turns, get_tool_call]
agent_type: main_agent
---

# Save as example

Save finished work and its lessons for next time. Keep questions plain; the person chooses the
lessons, you handle the filing. This covers files, reports, meeting briefs and sent drafts.

**Choose the flow from the person's request, not the quality of the text.** Only “This is good as it is”
means **Good** (recorded as good). Every other save/Teach request means **Teach** (recorded as taught),
even when the finished version looks good or the earlier draft is missing. Keep that mode throughout.

Follow this checklist for **every request**, including repeats and answered continuations:
1. Decode `Result key:` as a JSON string, unchanged. Locate the skill from the message/history and
   **LS its personal skill folder** (the `learning.md` table in § 7, not only `examples/`).
   **Read `learning.md` if present, before anything else.** On Good, if this result key **and skill path** are already
    there, LS the examples folder and Read candidates to find a current example whose source
    and finished text match this result. Only then reply `Already saved: [<title>](<example path>)`:
    ask nothing, save nothing, stop. If its example was replaced or removed, continue the ordinary
    Good save and confirmation below. A repeat Teach is saved as usual.
2. Prepare the skill, finished text, first version and destination (§§ 1–5).
3. **Good and Teach: LS the destination examples folder. If any example exists, the Save question
   must include saved candidate blocks and Replace options (§ 6).** An answer counts only if it was given
   to the Lessons/Save question asked **after the latest request with this same result key and skill**.
   An answer about another result, or before this request, never counts: ask this result's Lessons and
   Save now (§ 6). If `save_skill_example` says they weren't asked or answered, do the same, then call
   it once. A Skip or “Not yet” on that question is the answer: this request is over, even after
   “Continue”. Ask nothing, call nothing, and say nothing was saved. Only a new save request starts again.
4. Only after that answer confirms, call `save_skill_example` once (§ 7). Unanswered, skipped or
   “Not yet”: call nothing, save nothing. Never Write or Edit an example file or `learning.md` yourself.

## 1. Find the skill

The message may carry a `Skill: <skill name> (<skill path>)` line.
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

## 4. Optionally show what changed

You may use the existing view tool to show one `diff` section with the full recovered texts when each is at most 12,000 characters:
`before` is the first version, `after` is the finished version,
`beforeLabel` is “First draft” and `afterLabel` is “Your version”.
If either version is longer, show labelled changed passages instead, keeping each `before` and `after` text
within 12,000 characters. Say that the comparison shows excerpts. The save in § 7 still keeps both complete versions.
Introduce it simply: “Here's what you changed.” Skip the comparison if the first version is missing.

## 5. Choose where to keep it

- **Their own private space or Chief of Staff:** use the skill's own examples folder.
- **A core skill in `rebel-system/`:** use their own version in Chief of Staff, never the bundled folder.
- **A shared Space's skill, whoever owns it:** ask with a single-select card:
  “Keep it in my own space (recommended)” or “Share with the team”, in its own card before § 6. Wait for the choice.
  Their own space uses a Chief-of-Staff version; team uses the Space skill's examples folder.
  Normal write handling decides whether the team write is saved directly or offered as a suggestion.

For a personal version, use the Chief-of-Staff space path given in context, keeping the same path after `skills/`.
Read an existing version and keep its instructions. If none exists, `save_skill_example` creates the personal version when it saves (§ 7);
never write it yourself.

A folder skill keeps examples in `<skill>/examples/` beside `SKILL.md`.
A single-file skill keeps examples at `<space>/skills/<path after skills/, without .md>/examples/`.
Never move or rename the single-file skill to make room for examples.
A personal version of a single-file skill is `<Chief-of-Staff>/skills/<category>/<name>/SKILL.md`; pass its `examples` folder.

## 6. Compare candidates in the save question

For **both Good and Teach**, LS the destination examples folder, including this conversation's earlier saves, and Read the candidates:
**Good** up to two, the oldest and the newest; **Teach** up to three, every example if there are three or fewer, else the oldest and two newest.
A question holds four options, so with three Teach candidates offer `Add as new` and the three Replace options, without Not yet
(the card's own Skip saves nothing). Its **title is its `description` word for word**; only a file without one uses its file name without `.md`.
The **Save question's `context`** contains only the **saved candidate files'** title, date, saved lessons
and complete Final version. Copy these from each candidate file, not the new result.
Do not repeat or summarise the new result or put lesson placeholders there. Put the blocks on **Save**, not Lessons.
Repeat the candidate block and replace option for each;
omit both with none. Use the **same title** in its replace option. Never summarise or excerpt the
final text, even beyond 12,000 characters; omit the First version. A canvas diff is optional.

Ask Lessons and Save in **one AskUserQuestion call** with no other question in it. Copy these payloads literally, headers and labels included;
fill the candidate fields and two or three lesson options (`{label, description}`).
Never promise every future result will follow an example.

**Good**, even with no candidates. With no candidates, the Save `context` is only the reminder sentence
("Rebel uses saved examples…"): no `Saved` lines and never the new result.
```jsonc
{ "questions": [
  { "header": "Lessons", "question": "What made this result good?", "multiSelect": true,
    "options": <lesson options> },
  { "header": "Save", "question": "Save it as an example of excellence?", "multiSelect": false,
    "context": "Saved example: <candidate title> — <candidate date>\nSaved lessons: <all candidate's saved lessons>\n\nSaved final version:\n<candidate's complete saved Final version>\n\nRebel uses saved examples to guide future work. Save one you'd be happy to receive again.",
    "options": [
      { "label": "Yes, save as a new example", "description": "Keeps the existing examples too" },
      { "label": "Yes, replace '<candidate title>'", "description": "Replaces its saved text and lessons" },
      { "label": "Not yet, I'll fix it first", "description": "Saves nothing" }
    ] }
] }
```

**Teach** — lessons from changes, or final text if the draft is missing. With no candidates,
omit the second question; otherwise copy:
```jsonc
{ "questions": [
  { "header": "Lessons", "question": "What should this skill remember?", "multiSelect": true,
    "options": <lesson options> },
  { "header": "Save", "question": "Add this as a new example, or replace one?", "multiSelect": false,
    "context": "Saved example: <candidate title> — <candidate date>\nSaved lessons: <all candidate's saved lessons>\n\nSaved final version:\n<candidate's complete saved Final version>",
    "options": [
      { "label": "Add as new", "description": "Keeps the existing examples too" },
      { "label": "Replace '<candidate title>'", "description": "Replaces its saved text and lessons" },
      { "label": "Not yet, I'll fix it first", "description": "Saves nothing" }
    ] }
] }
```

Wait. Keep only chosen lessons, including free text. Unanswered, skipped or “Not yet” saves nothing.

## 7. Save with `save_skill_example`

After the confirming answer, call `save_skill_example` once:
- `result_key`: the decoded result key; `skill_path`: the skill path chosen in § 1 (workspace-relative,
  forward slashes), even when saving into a personal version.
- `examples_folder`: the destination's `examples` folder from § 5.
- `description`: a one-line title, e.g. “A brief that leads with the decision and keeps background short.”
- `lessons`: the chosen lessons, including the person's own words.
- `first_text`: Teach only, the complete first version from § 3; omit it if unavailable.
- `final_text`: only for a sent draft, its finished text. A file is read from the file itself.
- `redactions`: team saves only (§ 8), the details to remove, exactly as written.

The tool checks the answer, writes the chosen example (new or the one named in the Replace choice) and
records the rating in the person's own `learning.md`. For a typed request with no result key, recover it
from history; never invent one. If there is none, say the example can't be saved from here.

Tell the person exactly what the result says, linking only what it says was saved or replaced. Waiting for
approval, sent as a suggestion, rating not recorded, or refused: say that plainly, never “saved”. If the result says
it created the person's own version of the skill, say so in one line. Never retry a refusal or write the files another way,
except one retry a refusal itself asks for, done as it says.

The personal `learning.md` (step 1) sits at:

| Skill | Personal learning file |
| --- | --- |
| Folder skill in Chief of Staff or another private Space | `<skill folder>/learning.md` |
| Flat skill at any depth in a private Space | `<space>/skills/<path after skills/, without .md>/learning.md` |
| Skill in the workspace-root `skills/` folder, folder or flat | `skills/<path after skills/, without SKILL.md or the flat .md suffix>/learning.md` |
| Bundled or team skill, folder or flat | `<Chief-of-Staff>/skills/<path after skills/, without SKILL.md or the flat .md suffix>/learning.md` |

A Space listed without `sharing` counts as private.

## 8. Keep team examples suitable for sharing

For a team save, list in `redactions` every other person's name, email address and phone number in the finished
and first versions, exactly as written; never the person's own. The tool replaces each one everywhere in the example,
the finished file included. Tell the person what was removed.
The next use should read its lessons and say “Written from your <date> example.” A little less explaining yourself next time.
