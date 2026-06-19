---
name: git-hide-rebel-frontmatter
description: "Set up a git clean filter to automatically strip Rebel YAML frontmatter from README.md in commits, keeping the local file unchanged for Rebel."
last_updated: 2026-03-16
agent_type: main_agent
---

# Hide Rebel Frontmatter from Git Commits

## Purpose

When a git repo is added as a Rebel Space, Rebel writes YAML frontmatter (between `---` markers) into `README.md`. This is harmless locally but can pollute the README on GitHub/GitLab for public repos.

This skill sets up a **git clean filter** that automatically strips the frontmatter block from `README.md` during commits. The local file stays untouched — Rebel continues to read/write frontmatter normally.

## How It Works

Git clean/smudge filters transform file content between the working tree and the object database:
- **Clean filter** (working tree → commit): strips frontmatter before content enters a commit
- The local file on disk is **never modified** by the filter — only what git stores is affected

This means:
- `cat README.md` shows the file with frontmatter (the working copy Rebel uses)
- `git show HEAD:README.md` shows the committed version without frontmatter
- Rebel reads the local file and sees frontmatter as normal
- Remote repos never see the frontmatter

**Important caveat:** Because there is no smudge filter (restore on checkout), a fresh `git clone` or `git checkout` will materialise the stripped version (without frontmatter). Rebel will re-add frontmatter on its next write. This is by design — the filter ensures the *remote repo* is clean, while Rebel manages the local copy.

## Safety Properties

- **Non-destructive**: the local `README.md` is never modified by the filter
- **Reversible**: removing the filter restores normal commit behavior; no data is lost
- **Scoped**: only affects `README.md` in this specific repo (uses local git config, not global)
- **No executables installed**: the filter is a single inline `awk` command in git config
- **No dependencies**: uses only `awk` which ships with all platforms (macOS, Linux, Windows Git for Windows)
- **CRLF-safe**: the filter handles both LF and CRLF line endings

## Pre-Checks

Before proceeding, verify ALL of the following:

1. **Confirm the space is a git repo:**
   ```bash
   git -C "<space-path>" rev-parse --is-inside-work-tree
   ```
   If this fails, stop — this skill does not apply.

2. **Confirm README.md has well-formed Rebel frontmatter** (opening AND closing `---`):
   ```bash
   head -20 "<space-path>/README.md"
   ```
   Verify: line 1 is exactly `---`, and there is a second `---` line within the first ~20 lines. If line 1 is not `---`, there is no frontmatter to strip. If there is an opening `---` but no closing `---`, warn the user that the frontmatter is malformed and fix it before proceeding.

3. **STOP if the README uses frontmatter for other tools:**
   If this is a Jekyll, Hugo, or other static-site repo where README.md frontmatter is used by the build system, **do not use this skill**. The filter strips ALL leading frontmatter, not just Rebel fields. Ask the user:
   > "Does this README.md use YAML frontmatter for any other purpose (e.g., Jekyll, Hugo, or another static site generator)? If so, this filter will also strip that frontmatter from commits, which could break your build."

4. **Ask the user for confirmation:**
   > "This will set up a git filter so that Rebel's YAML frontmatter in README.md is automatically stripped from your git commits. The local file stays unchanged — Rebel will continue to work normally. This only affects this repo. Shall I proceed?"

## Setup (One-Time Per Repo)

Run all commands from the repo root (the space path).

### Step 1: Configure the git clean filter

This command is identical on all platforms (macOS, Linux, Windows Git for Windows):

```bash
git config --local filter.strip-rebel-frontmatter.clean "awk 'NR==1 && /^---[[:space:]]*$/ {skip=1; next} skip && /^---[[:space:]]*$/ {skip=0; next} skip {next} {print}'"
```

Note: `git config --local` writes to `.git/config` inside the repo. It does NOT modify the user's global `~/.gitconfig` or any system files.

**How the `awk` command works:**
- Line 1: if it matches `---` (with optional trailing whitespace/CR), enter skip mode
- While in skip mode: if a line matches `---`, exit skip mode and discard that line too
- While in skip mode: discard all lines (frontmatter content)
- Otherwise: print the line

The `[[:space:]]*$` pattern handles both LF (`---\n`) and CRLF (`---\r\n`) line endings. If line 1 is NOT `---`, skip mode is never entered and the entire file passes through unchanged.

**Safety property:** If the opening `---` has no matching closing `---`, ALL lines after line 1 are skipped. This is safe because: (a) Rebel always writes well-formed frontmatter, and (b) the pre-check verifies frontmatter is well-formed before setup.

### Step 2: Add the `.gitattributes` entry

Check if `.gitattributes` already exists and has the filter:
```bash
grep -q 'filter=strip-rebel-frontmatter' .gitattributes 2>/dev/null
```

If not present, append it (ensuring a newline before the append):
```bash
[ -f .gitattributes ] && [ -n "$(tail -c1 .gitattributes)" ] && echo '' >> .gitattributes; echo 'README.md filter=strip-rebel-frontmatter' >> .gitattributes
```

This ensures no corruption if the existing `.gitattributes` lacks a trailing newline.

If `.gitattributes` does not exist yet, just:
```bash
echo 'README.md filter=strip-rebel-frontmatter' > .gitattributes
```

### Step 3: Verify the filter works

Force git to re-process the file through the filter:
```bash
git add --renormalize README.md
```

Then check what git will commit:
```bash
git diff --cached README.md | head -20
```

The diff should show the frontmatter lines as "removed". The body content should be unchanged.

### Step 4: Advise on `.gitattributes` commit

Tell the user:
> "The `.gitattributes` file should be committed so the filter rule persists. Anyone who clones the repo will also need to run the `git config` command (Step 1) for the filter to be active on their machine. Without the config, git silently ignores the filter — no errors, just no stripping."

```bash
git add .gitattributes
git commit -m "chore: add git filter to strip Rebel frontmatter from README.md"
```

## Verification

After setup, confirm:

1. **Local file has frontmatter** (Rebel still works):
   ```bash
   head -1 README.md
   ```
   Should output `---`.

2. **Committed content has no frontmatter** (clean for GitHub):
   ```bash
   git show HEAD:README.md | head -3
   ```
   Should NOT start with `---`.

3. **Future commits auto-strip** — edit the README.md body, commit, and verify `git show HEAD:README.md` still has no frontmatter.

## Uninstall

To remove the filter and go back to committing frontmatter normally:

```bash
git config --local --unset filter.strip-rebel-frontmatter.clean
```

Optionally remove the line from `.gitattributes`:
```bash
grep -v 'filter=strip-rebel-frontmatter' .gitattributes > .gitattributes.tmp && mv .gitattributes.tmp .gitattributes
```

This portable approach works on macOS, Linux, and Windows Git Bash (avoids `sed -i` portability issues).

## Edge Cases

- **README.md has no frontmatter**: the filter is a no-op — skip mode is never entered if line 1 is not `---`.
- **README.md has non-Rebel frontmatter** (e.g., Jekyll/Hugo): this filter strips ALL leading YAML frontmatter. The pre-check should catch this — **do not use this skill if frontmatter is needed by other tools.**
- **Malformed frontmatter (no closing `---`)**: the filter will skip all lines after line 1. The pre-check verifies well-formed frontmatter before setup. If the user later breaks the frontmatter, the next commit will have only line 1's content — but the local file is unaffected and Rebel will repair it on next write.
- **Multiple `---` blocks in the file**: only the first block (line 1 to next `---`) is removed. Content after the closing `---`, including any later `---` lines, is untouched.
- **Collaborators cloning the repo**: `.gitattributes` is committed but `git config` is local. Collaborators without the config see the filter rule but git silently ignores it (no error, no stripping). This is fine — only the repo owner needs the filter.
- **Windows line endings (CRLF)**: the `[[:space:]]*$` pattern in the awk command matches both `---\n` and `---\r\n`, so the filter works regardless of `core.autocrlf` settings.
- **Fresh clone/checkout**: since there is no smudge filter, a fresh checkout materialises the stripped version. Rebel will re-add frontmatter on its next metadata write. This is expected behavior.
- **UTF-8 BOM**: if README.md starts with a UTF-8 BOM (`EF BB BF`), the BOM precedes `---` on line 1, and the pattern won't match. The filter becomes a no-op (safe, but frontmatter is not stripped). This is extremely rare for README.md files.

## Troubleshooting

- **Filter not working (frontmatter still in commits):**
  - Check the config is set: `git config --local filter.strip-rebel-frontmatter.clean`
  - Check `.gitattributes` is in the repo root (not a subdirectory)
  - Force git to re-apply the filter: `git add --renormalize README.md`

- **`awk` not found:**
  - On macOS/Linux: `awk` is always available
  - On Windows: Git for Windows bundles `awk` via MSYS2. Ensure Git for Windows is installed.

- **User wants to commit frontmatter once (override):**
  - Temporarily disable: `git -c filter.strip-rebel-frontmatter.clean=cat add README.md`
