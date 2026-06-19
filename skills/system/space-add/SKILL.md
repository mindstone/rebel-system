---
name: space-add
description: "Create or connect spaces under the Rebel workspace root, initialising folders and using OS-specific link commands safely."
---

# Space Add

**Agent Instructions**: This is a skill for AI agents to follow when creating or connecting spaces in a user's Rebel workspace (v3, spaces + `rebel-system/`).

## See Also

- [spaces](../../help-for-humans/spaces.md) - conceptual introduction to spaces and their purpose
- [architecture-technical-description](../../help-for-humans/architecture-technical-description.md) - technical architecture including spaces, `rebel-system/`, and the single-root Rebel workspace
- [README-template-for-Chief-of-Staff](../../templates/README-template-for-Chief-of-Staff.md) - template for the Chief-of-Staff router space
- [README-template-for-space](../../templates/README-template-for-space.md) - template for other spaces (company, team, personal)
- [space-memory-populate](../space-memory-populate/SKILL.md) - populate a space's memory from connected MCPs
- [signposting-to-single-source-of-truth](../documentation/signposting-to-single-source-of-truth/SKILL.md) - where to link vs store details

## Overview

In v3, a **space** is a folder (or link to a folder) directly under the Rebel workspace root that has its own `README.md`, `skills/`, `memory/`, and other optional files and subfolders. This skill helps you either:

- **Create a new space folder** inside the Rebel workspace, or
- **Connect an existing folder** elsewhere on disk as a space via a link (symlink on macOS/Linux, junction on Windows),

while keeping symlink usage shallow and safe.

### Choosing an organisation pattern

- Smaller orgs: Prefer a single `Company` space writable by employees, with team-specific subfolders inside that space’s `skills/` and `memory/` (e.g., `skills/teams/Team-Name/`, `memory/teams/Team-Name/`).
- Larger orgs or stricter boundaries: Create one space per team (each with its own `README.md`, `skills/`, and `memory/`).
- See [spaces](../../help-for-humans/spaces.md) for pros/cons and memory placement guidance.
## Safety Principles

- **Never guess paths**: Always confirm the exact folder the user wants to use and whether it is on a local disk, cloud drive, or network mount.
- **Prefer real folders** inside the Rebel workspace when feasible.
- **Keep links shallow**: Only create links one level under the Rebel workspace root.
- **Avoid advanced symlink setups** (e.g. deep inside Google Drive, network paths). Keep links shallow and local, and confirm the user understands Windows Developer Mode/junction caveats and IDE indexing limits.
- **Do not overwrite existing content**: When initialising a space, only create missing files/folders; never clobber existing ones.
- **IMPORTANT: Explicit permission required**: Only create a new space folder with explicit permission from the user.

## Process

### 1. Confirm Rebel workspace root and intent

1. Confirm with the user that the current project folder is their **Rebel workspace root** (the folder that contains `rebel-system/`, `Chief-of-Staff/`, and other spaces).
2. Ask the user:
   - The **name** of the space (e.g. `Company`, `Exec`, `Family`).
   - Whether they want to:
     - **Create a brand-new space folder** under the Rebel workspace, or
     - **Connect an existing folder** as a space via a link.

If anything is ambiguous (multiple folders with similar names, unclear locations), ask clarifying questions rather than guessing.

### 2. Creating a new space folder inside the Rebel workspace

1. From the Rebel workspace root, plan to create a folder:

   - `{{workspace_root}}/<Space Name>/`

2. If a folder with that name already exists:

   - Treat it as an **existing space** and skip creation; move to “Initialise space structure” below.
   - Ask the user before making any changes inside it.

3. If it does **not** exist, and the user explicitly approves creation, create:

   - The space root folder: `<Space Name>/`
   - Subfolders:
     - `<Space Name>/skills/`
     - `<Space Name>/memory/`
     - `<Space Name>/scripts/`

4. Create a `README.md` in the space root if one does not exist, using the appropriate template:

   - For **Chief-of-Staff** space: use `rebel-system/templates/README-template-for-Chief-of-Staff.md`
   - For **other spaces** (company, team, personal): use `rebel-system/templates/README-template-for-space.md`
   - Fill in placeholders (e.g., `{SPACE_NAME}`, `{SPACE_TYPE}`, `{OWNER_EMAIL}`) so the frontmatter and links are correct.
   - **Important**: The `README.md` must include a YAML frontmatter block with `rebel_space_description` — this is how Rebel identifies the folder as a space.

5. Optionally create `CLAUDE.md` → `README.md` symlink for parity with Claude Code, if that fits the user's tools.

### 3. Connecting an existing folder as a space via a link

If the user wants to keep an existing folder **outside** the Rebel workspace but have it appear as a space under the workspace root:

1. Confirm:

   - Absolute path to the existing folder (e.g. `/Users/yourname/Dropbox/ClientX` or `C:\Users\YourName\Documents\ClientX`).
   - That the user understands this will create a **link** under the Rebel workspace.

2. From the Rebel workspace root, propose OS-specific commands:

   - **macOS / Linux** (symbolic link):

     ```bash
     ln -s "/absolute/path/to/source/folder" "<Space Name>"
     ```

   - **Windows** (directory junction for local folders):

     ```cmd
     mklink /J "<Space Name>" "C:\Path\To\Source\Folder"
     ```

3. Rules:

   - Run these commands **from the Rebel workspace root**, so the link appears as `<workspace_root>/<Space Name>`.
   - Only create links to **local folders** that the OS can watch reliably.
   - Avoid linking where symlinks are known to be fragile (e.g. from Google Drive paths, to network shares). If unavoidable, confirm the user understands Windows Developer Mode vs junctions, Cursor indexing limits for external links, and keep link depth shallow.

4. After creating the link, treat `<Space Name>` under the Rebel workspace exactly like a regular space folder and initialise its structure as below (without overwriting existing content).

### 4. Initialise / verify space structure

For the space root at `<Space Name>/` (whether real folder or link):

1. Ensure subfolders exist (create if missing, but do **not** overwrite existing files):

   - `skills/`
   - `memory/`
   - `scripts/`
   - OPTIONAL `help-for-humans/` (if the space will contain explanatory guides/tutorials designed primarily for human reading)

2. Ensure `README.md` exists with proper frontmatter:

   - If missing, create it from the appropriate template (see step 4 above).
   - If present but missing `rebel_space_description` frontmatter, offer to add it (don't rewrite content without permission).
   - If present with frontmatter, leave it in place; you may suggest updates but don't rewrite without explicit user permission.

3. If this is intended to be the user's **primary personal space** (Chief-of-Staff):

   - Confirm that with the user.
   - If confirmed and the user agrees, recommend running:

     ```text
     Run @space-memory-populate.md
     ```

   - This will populate the space's memory from connected MCPs.

### 5. Validation

- Verify that the new space appears under the Rebel workspace root and is navigable.
- Confirm that:
  - `README.md` opens and its internal links (to `rebel-system/` docs, variables, etc.) make sense.
  - `skills/`, `memory/`, and `scripts/` are present.
- Summarise to the user what was created or linked, and highlight any follow-up they may want (e.g. populating memory, adding team members).

For more complex scenarios (deeply nested cloud drives, multiple machines, or mixed Git + Drive setups), pause, confirm with the user, and apply these constraints: prefer Git submodules for core content; avoid Google Drive symlinks; keep links shallow (one hop under the Rebel root); on Windows favour junctions or ensure Developer Mode; note that Cursor AI indexing may not include content brought in via external links.

## Next steps

- Open the space's `README.md` and add concise auto-loaded context for this space (profile, AI working context). Use the appropriate [AGENTS template](../../templates/) for structure.
- In the Rebel workspace root, update the top-level `README.md` to add a short reference to this space (name, purpose, and link) so it is discoverable from your Chief-of-Staff context.
- For memory population, run [space-memory-populate](../space-memory-populate/SKILL.md) to gather context from connected MCPs (Gmail, Slack, Calendar, etc.).
- Placement guidelines (v3):
  - Cross-space topics/meta → `Chief-of-Staff/memory/` (link from top-level `README.md`)
  - Space-specific topics → `<Space Name>/memory/` (link from this space's `README.md`)
  - See [spaces](../../help-for-humans/spaces.md) and [signposting-to-single-source-of-truth](../documentation/signposting-to-single-source-of-truth/SKILL.md)
