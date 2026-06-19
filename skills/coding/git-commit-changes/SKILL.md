---
name: git-commit-changes
description: "Guidelines for batching changes and writing safe, atomic git commits"
last_updated: 2025-12-19
agent_type: main_agent
---

# Git Commit Guidelines

## Initial Assessment
Have a look at Git diff. Batch the changes into commits, and make them one at a time.

## Commit Best Practices

### Don't ever do anything destructive

ABOVE ALL, don't do anything that could result in lost work or mess up yet-to-be-committed changes, unless EXPLICITLY instructed to by the user after warning them.


### Batching changes into commits
- Each commit should represent a small/medium feature, or stage, or cluster of related changes (e.g. tweaking a bunch of docs).
- But strike a balance, e.g. the code and docs changes for a given feature should be in the same commit.
- The codebase should (ideally) be in a working state after each commit.
- Try not to mix unrelated changes.
- Before making the commit, list all files that will be committed.
- Only commit changes relevant to your current task. (Still use reset/add/commit single-command chaining)
- When choosing the order of batches, prefer batches that concern files with older modification dates, in order to make it less likely that someone else is still working on them.


### Commit Message Format
```
<type>(<scope>): <Summary sentence 1. Summary sentence 2.>

<optional detailed description>
- Include a reference to current planning doc at the top of the commit body if there is one, e.g. "Planning doc: yyMMddx_feature_name.md"
- More detailed explanation
- Bullet points for multiple changes
```

Example:
```
feat(ui): Added dark mode toggle to settings. Users frequently requested theme switching for late-night work.

- Adds ThemeToggle component using existing design tokens
- Persists preference to settings store
```

Types: feat, fix, docs, style, refactor, test, chore


### Handling Concurrent Changes
Others may be changing the code while you work, and they might have added other files already.
- IMPORTANT: To minimise interference, ALWAYS chain the reset/add/commit operations (to make sure we unstage first, then stage, then commit, atomically):
  ```bash
  git reset && git add wanted-file && git commit -m "fix(auth): Fixed token refresh on expired sessions. Users were getting logged out unexpectedly."
  ```
- This reduces the window where another contributor's changes could interfere.


### Important Notes
- If the code is in a partial/broken state, prioritise commits that leave the codebase working
- If you encounter merge conflicts or ANY unexpected issues, stop and ask the user immediately
- When in doubt, ask the user before proceeding
- **ALWAYS quote file paths** when using git commands to avoid shell expansion issues:
  - `git add "frontend/src/routes/language/[target_language_code]/+page.svelte"`
  - This is especially important for SvelteKit routes with brackets: `[param]`
- Avoid committing generated artifacts or large binaries unless explicitly intended; update `.gitignore` accordingly.


### Gitignore

If you notice files that almost certainly shouldn't be committed (e.g. `node_modules`, `passwords.secret`), read the `.gitignore`, and stop to ask the user whether to add them to it.
