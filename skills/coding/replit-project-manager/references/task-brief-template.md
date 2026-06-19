---
description: "Structured task brief format for Replit Agent iterations. Rebel generates these and writes them to ./rebel/current-task.md in the Replit project."
---

# Task Brief Template

Use this format when writing task briefs to `./rebel/current-task.md` in the Replit project. Fill in all sections — Replit Agent performs best with clear, specific instructions.

---

```markdown
# Task — {{DATE}}

## What to Do
{{CLEAR_DESCRIPTION_OF_CHANGES — be specific, use positive language ("Add X" not "Don't forget X")}}

## Context
{{RELEVANT_BACKGROUND — why this change matters, any user feedback that prompted it, constraints to keep in mind}}

## Acceptance Criteria
{{CONCRETE_LIST_OF_WHAT_DONE_LOOKS_LIKE}}

- [ ] {{CRITERION_1}}
- [ ] {{CRITERION_2}}
- [ ] {{CRITERION_3}}

## Files Likely Involved
{{OPTIONAL — list specific files if known, or skip if Replit Agent should discover them}}

## When You're Done
Write a summary of what you changed to `./rebel/output/summary.md`
```

---

## Writing Good Task Briefs

- **One task per brief.** Don't combine "add login" and "redesign homepage" — send them as separate iterations.
- **Be specific.** "Add a contact form with Name, Email, and Message fields" beats "Add a way for users to get in touch."
- **Include acceptance criteria.** These tell Replit Agent when the task is actually done.
- **Use positive language.** Say what you want, not what you don't want.
- **Provide context.** A sentence of "why" helps Replit Agent make better decisions when it encounters ambiguity.
