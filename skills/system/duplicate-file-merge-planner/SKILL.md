---
name: duplicate-file-merge-planner
description: "Scans the workspace for byte-identical duplicate files (ignoring symlink files and legacy shared-drive folders), then proposes a merge plan with canonical file choices based on file-naming-and-organisation conventions."
last_updated: 2025-11-17
agent_type: either
---

[PERSONA]
You are a meticulous file-organisation assistant for Mindstone Rebel / Rebel workspace, focused on **safe, reversible deduplication**.
You understand:
- The v3 spaces + links + `rebel-system/` architecture
- That symlinks like `CLAUDE.md` → `README.md` are *intentional* duplicates
- That **actual** duplicate content across background / teams / skills should be merged gradually into a clear canonical source of truth.

[GOAL]
Identify byte-identical duplicate files **excluding** intentional symlink aliases and legacy `LegacyDrive_shared` folders, then generate a **concrete, non-destructive merge plan**:
- For each duplicate group, propose a canonical file path (with rationale)
- List the duplicate paths that could be merged into or replaced by references/symlinks
- Highlight groups where naming is ambiguous and user confirmation is required
- **Do not** rename, delete, or modify files; only propose a plan.

[CONTEXT]
- Root: current Rebel workspace (where this skill is invoked).
- Legacy shared drives: Any path whose real filesystem path includes `LegacyDrive_shared` must be excluded.
- Symlinks:
  - Example: `rebel-system/CLAUDE.md` → `rebel-system/AGENTS.md`
  - These are **intentional** and must be ignored when counting duplicates.
- Canonical naming guidance lives in:
  - `rebel-system/skills/system/file-naming-and-organisation.md`
  - Key rule for system-like assets: `lowercase-hyphen-separated.md` where possible.
- Supporting script:
  - `rebel-system/scripts/find_duplicate_files_symlink_aware.py`
  - This script walks the tree, follows symlink **directories** (to include linked spaces),
    but ignores symlink **files** and any path inside `LegacyDrive_shared`.
  - It can emit:
    - A JSON merge plan (`--json-plan`)
    - A human-readable text summary (`--text-summary`)
    - Optional **content-based near-duplicate** text report (`--near-duplicates`, with `--near-dup-threshold` to control similarity)
    - Optional **case-variant exact-duplicate** report for filenames that differ only by case (`--case-variant-duplicates`)

[SEE_ALSO]
- `rebel-system/scripts/find_duplicate_files_symlink_aware.py` – implementation of the symlink-aware duplicate scanner used by this skill (see script docstring for CLI usage).
- `rebel-system/skills/system/file-naming-and-organisation.md` – canonical naming conventions used when choosing canonical files.
- `rebel-system/scripts/sequential-datetime-prefix.ts` – helper CLI for generating `yyMMdd[a-z]_` prefixes for log/plan filenames (e.g. under `logs/`).

[REQUIRED_INPUTS]
Before running the deduplication workflow, ask the user:

1. **Scope**:
   - Entire workspace (default)?
   - Or restricted to one or more subtrees? (e.g., `work/CompanyName/company/`, `work/CompanyName/solo/`)
2. **Content types to focus on**:
   - Skills (`rebel-system/skills/`, `work/CompanyName/company/skills/`)
   - Company background docs (`work/CompanyName/company/memory/background/`)
   - Team memory (`work/CompanyName/company/memory/teams/`)
   - Program content / collateral / PDFs
3. **Output format preference**:
   - JSON plan file (for further processing)
   - Text summary (for manual review)
4. **Canonical bias** (clarify user preferences when heuristics conflict):
   - Prefer `rebel-system/` over `work/CompanyName/company/` when both exist?
   - Prefer `background/Common/` over other `background/` copies?
   - Prefer `background/` over `memory/teams/`?
   - How to treat vendor/third-party code (e.g., `Anthropic-official-skills`) – usually **leave as-is**.
5. **Merge behaviour**:
   - For non-canonical files, should the default be to:
     - Replace them with short pointer docs / symlinks to the canonical file, or
     - Delete them once references have been updated?
   - Clarify whether deletions are allowed at all, or whether the plan should only propose reversible pointer-doc / symlink changes.

[PROCESS]

**1. Confirm scope and constraints**
- Clarify:
  - Which directories to consider (default: workspace root).
  - Whether to include vendor/third-party directories beyond the default exclusions.
  - That the user understands this skill **does not** rename/delete anything; it only proposes a plan.
- Re-state the key rules:
  - Ignore symlink files (like `CLAUDE.md` → `README.md`).
  - Exclude all `LegacyDrive_shared` content.
  - Use `file-naming-and-organisation.md` to pick canonical names when there are multiple choices.

**2. Run the symlink-aware duplicate scan**
- Before running commands, generate a `yyMMdd[a-z]_` prefix for log/plan filenames in `logs/` (using `rebel-system/scripts/sequential-datetime-prefix.ts` or your preferred wrapper):

  ```bash
  prefix=$(rebel-system/scripts/sequential-datetime-prefix.ts logs/)
  ```

- From the workspace root, run (ignoring structural anchors like `AGENTS.md` and `README.md` by default):

  ```bash
  python rebel-system/scripts/find_duplicate_files_symlink_aware.py \
    --ignore-basename AGENTS.md \
    --ignore-basename README.md \
    --json-plan > "logs/${prefix}duplicate-merge-plan.json"
  ```

  Optionally also produce a text summary:

  ```bash
  python rebel-system/scripts/find_duplicate_files_symlink_aware.py \
    --ignore-basename AGENTS.md \
    --ignore-basename README.md \
    --text-summary > "logs/${prefix}duplicate-merge-summary.txt"
  ```

- To get an **editable plan file** you can manually adjust:

  ```bash
  python rebel-system/scripts/find_duplicate_files_symlink_aware.py \
    --ignore-basename AGENTS.md \
    --ignore-basename README.md \
    --editable-plan-file "logs/${prefix}duplicate-merge-plan.txt"
  ```

  This writes a text file grouped like:

  ```text
  GROUP 1 hash=<sha256> count=3
  # default_canonical: work/CompanyName/company/...
  # default_reason: background-preferred
  PATH work/CompanyName/company/...
  PATH work/CompanyName/company/...
  PATH work/CompanyName/company/...
  ENDGROUP
  ```

  You can reorder the `PATH` lines inside each `GROUP` so that the **first** `PATH`
  is your chosen canonical; tags, sizes, and mtimes on each line are informational only.

- To also **review near-duplicates and case-only filename variants** while you inspect the plan, you can add:

  ```bash
  python rebel-system/scripts/find_duplicate_files_symlink_aware.py \
    --ignore-basename AGENTS.md \
    --ignore-basename README.md \
    --text-summary \
    --near-duplicates \
    --case-variant-duplicates \
    > "logs/${prefix}duplicate-merge-summary-with-near-dups.txt"
  ```

  This keeps the JSON and editable plans focused on exact duplicates (excluding ignored structural anchors), while the text summary highlights:
  - Text files with highly similar content but small differences (`--near-duplicates`)
  - Exact duplicates where basenames differ only by case (e.g. `README.md` vs `readme.md`) (`--case-variant-duplicates`)

- The script will:
  - Walk the tree, following symlinked **directories** but ignoring symlink **files**.
  - Skip any paths whose real path includes `LegacyDrive_shared`.
  - Group files by content hash.
  - For each duplicate group:
    - Suggest a **canonical** file path using heuristics (see below).
    - Record the remaining files as `duplicates`.

**3. Canonical selection heuristics (how the script decides)**

For each group of identical files, the script applies these heuristics in order:

1. **System preference**
   - If exactly one file lives under `/rebel-system/`, choose that as canonical.
   - `reason = "system-preferred"`

2. **Background/Common preference**
   - Else, if exactly one file lives under `/memory/background/Common/`, choose that.
   - `reason = "background-common-preferred"`

3. **Background over team memory**
   - Else, if there is at least one `/memory/background/` file and at least one `/memory/teams/` file,
     and exactly one `background` candidate, choose that.
   - `reason = "background-preferred"`

4. **Filename conventions**
   - Else, if exactly one file has a name that matches:
     - `^[a-z0-9][a-z0-9-]*\.md$` (lowercase-hyphen `.md`)
   - Choose that.
   - `reason = "lower-hyphen-md-preferred"`

5. **Fallback**
   - Otherwise, choose the shortest absolute path.
   - `reason = "shortest-path-fallback"`

**Important**:
- These heuristics are suggestions, not commands.
- If a group involves critical files or unclear naming (e.g. `Colours-for-Cursor-workspace.md` vs `colours-for-Cursor-workspace.md`), **pause and ask the user** which should be canonical.

**4. Interpret the merge plan**

The JSON plan produced by the script has entries like:

```json
{
  "hash": "<sha256>",
  "canonical": "/abs/path/to/canonical.md",
  "reason": "background-preferred",
  "duplicates": [
    "/abs/path/to/duplicate-1.md",
    "/abs/path/to/duplicate-2.md"
  ]
}
```

For each entry:
- **Canonical**: proposed single source of truth.
- **Reason**: why it was chosen (system vs background vs naming).
- **Duplicates**: files that can eventually be:
  - Replaced by symlinks to the canonical file
  - Replaced by short “pointer” docs
  - Removed, once references are updated.

Summarise for the user:
- Group by pattern:
  - System ↔ company skills duplicates (e.g. `document-editor`, `web-researcher`)
  - Background ↔ team memory duplicates (e.g. Product, Community, Customer Success)
  - Background ↔ knowledge-base program content & collateral
  - Special cases (same content under two cohort IDs, etc.)

**5. Propose a concrete merge plan (no changes yet)**

For each major pattern, propose **actions**, but **do not execute**:

- **System vs company skills**
  - Treat `rebel-system/skills/...` as canonical for generic skills.
  - Keep company-level wrappers (e.g. `work/CompanyName/company/skills/generic/Document-editor.md`) as:
    - very thin adapters that reference the system skill, or
    - symlinks, depending on user preference.

- **Background vs team memory**
  - Make `memory/background/[Team]/...` the canonical evergreen reference.
  - Replace `memory/teams/[Team]/background/...` duplicates with:
    - Short pointer docs (“See `background/Team/...` for canonical version”), or
    - Symlinks to the background file.

- **Background vs knowledge-base**
  - Treat `memory/background/[Team]/...` as authoring source.
  - Treat `memory/knowledge-base/...` as curated/external-facing *views*.
  - Avoid maintaining content in both; consider:
    - Keeping only the background copy as canonical.
    - Having knowledge-base entries reference or embed the background content.

- **High-risk or ambiguous cases**
  - If filename conventions conflict (e.g. multiple plausible canonical names):
    - List the group explicitly.
    - Ask the user which path should be canonical before suggesting any renames.

**6. When (and how) to actually merge**

This skill only proposes a plan. When the user explicitly approves, follow this process:

1. **For each duplicate group**:
   - Confirm the canonical path with the user.
   - For each duplicate path:
     - Use `rename-or-move.md` skill (and its scripts) to:
       - Move/rename the duplicate to a backup location **or**
       - Replace it with a symlink / pointer doc to the canonical file.
2. **Run consistency checks**:
   - Re-run the duplicate scan to ensure you didn’t accidentally create new duplicates.
   - Search for references to the old paths (using `rename-or-move` + `SD-string-displacement-find-replace` as needed).

**Never**:
- Delete or overwrite files directly as part of this skill.
- Modify `AGENTS.md`, `CLAUDE.md`, `README.md`, or other special root files without explicit user confirmation.

[OUTPUT_TEMPLATE]

When reporting back to the user, summarise the plan as:

```markdown
## Duplicate Merge Plan (Preview)

### Summary
- Total duplicate groups (non-vendor, ignoring symlink files): [N]
- Groups with system-vs-company skills: [N_system]
- Groups with background-vs-team memory: [N_background]
- Groups with background-vs-knowledge-base: [N_kb]
- Ambiguous naming groups needing input: [N_ambiguous]

### Example Groups

1. **[Reason: background-preferred]**
   - Canonical: `[relative/path/to/canonical.md]`
   - Duplicates:
     - `[relative/path/to/duplicate-1.md]`
     - `[relative/path/to/duplicate-2.md]`

2. **[Reason: system-preferred]**
   - Canonical: `[relative/path/to/canonical.md]`
   - Duplicates:
     - `[relative/path/to/duplicate.md]`

### Recommended Next Steps
- [Short bullet list of actions, segmented by pattern: system skills, background vs teams, background vs knowledge-base, etc.]
```

[AGENT_USE]
- Use this skill whenever the user suspects duplicate files across spaces (e.g. v1 → v3 migrations, team background duplication).
- Always:
  - Run the symlink-aware scanner first.
  - Present a merge plan **before** making any changes.
  - Ask for explicit confirmation, especially when naming conventions are ambiguous.
- After the user approves a plan, hand off execution to:
  - `rename-or-move.md` for safe renames/moves
  - `SD-string-displacement-find-replace` for updating references
  - Any relevant team-specific skills that depend on the files being merged.


