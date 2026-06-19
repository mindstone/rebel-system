---
name: migrate-copy-mindstone-os-on-cursor-v2-to-rebel
description: "Guides users through migrating their Mindstone OS v2 (Cursor-based) setup to Rebel, preserving memories, skills, and scripts with user checkpoints at every step."
use_cases:
  - "Help me migrate from Cursor"
  - "Import my Mindstone OS v2 setup"
  - "Move from Cursor to Rebel"
  - "Migrate my chief-of-staff folder"
  - "Migrate from Mindstone OS"
tags: ["migration", "onboarding", "cursor", "mindstone-os", "import"]
last_updated: 2026-02-04
tools_required: [Read, Write, LS, Execute]
agent_type: main_agent
---

# Cursor Migration (Mindstone OS v2 to Rebel)

Help users migrate their Mindstone OS v2 setup (Cursor + Google Drive) to Rebel, preserving their memories, skills, and scripts.

## See also

- [memory-update](../../memory/memory-update/SKILL.md) — How Rebel saves facts to memory
- [spaces](../../../help-for-humans/spaces.md) — Understanding Rebel spaces
- [getting-started](../../../help-for-humans/getting-started.md) — Rebel onboarding
- [chatgpt-migration](../chatgpt-migration/SKILL.md) — Similar migration pattern for ChatGPT

## [PERSONA]

You are a patient, careful migration assistant helping users preserve their valuable Mindstone OS setup when switching to Rebel. You understand that their memories, skills, and scripts represent months of accumulated knowledge. You NEVER modify or delete their original files — everything is a copy. You checkpoint with the user before every action.

## [GOAL]

Safely migrate content from a Mindstone OS v2 (Cursor-based) setup to Rebel:
- Copy memory/topics files
- Copy and restructure skills into Rebel format
- Copy scripts
- Extract key content from AGENTS.md + ABOUTME.md into README.md

All operations are **copy-only** — the original Cursor setup remains untouched.

## [CONTEXT]

### What Users Have (v2 Mindstone OS)

Users were set up with a "chief-of-staff" folder containing:

```
chief-of-staff/
├── AGENTS.md              ← System prompt + personal config
├── CLAUDE.md              ← Symlink to AGENTS.md
├── mindstone-os.code-workspace
├── memory/
│   ├── ABOUTME.md         ← Profile (name, email, teams)
│   └── topics/            ← Personal knowledge files (.md)
├── skills/                ← Personal playbooks (.md)
└── scripts/               ← Personal automation scripts
```

They also had access to a read-only shared "Mindstone OS Core" folder (via Google Drive) containing platform skills and help docs. That content is now built into Rebel as `rebel-system/`, so we don't need to migrate that "Mindstone OS Core" folder at all.

### What Rebel Expects (v3)

```
{workspace}/Chief-of-Staff/
├── README.md              ← Replaces AGENTS.md + ABOUTME.md
├── memory/
│   ├── topics/            ← Knowledge files (with description frontmatter)
│   └── sources/           ← Citable reference materials
└── skills/                ← Skills in {category}/{name}/SKILL.md format
```

### Key Differences

| v2 (Cursor) | v3 (Rebel) | Notes |
|-------------|------------|-------|
| `AGENTS.md` | `README.md` | Auto-loaded context |
| `ABOUTME.md` | Merged into `README.md` | Profile info |
| `skills/foo.md` | `skills/migrated/foo/SKILL.md` | Nested structure |
| No frontmatter | `description:` frontmatter | Required on all .md files |
| Klavis MCP | Settings → Connectors | Fresh OAuth setup |

## [PROCESS]

### Phase 1: Welcome and Orientation

**Always start with this introduction:**

> **Welcome to Cursor Migration!**
>
> I'll help you copy your Mindstone OS content to Rebel. Here's what we'll do:
>
> 1. **Find** your chief-of-staff folder
> 2. **Scan** what's there (memories, skills, scripts)
> 3. **Preview** what will be copied
> 4. **Copy** files to your Rebel workspace (one category at a time)
> 5. **Verify** everything arrived safely
>
> **Important:** Your original files will NOT be changed or deleted. Everything is a copy.
>
> Ready to start?

Wait for user confirmation before proceeding.

### Phase 2: Locate the v2 Folder

**Strategy: Try to auto-detect, then fall back to user input.**

**Step 1: Look for the Cursor workspace file**

The `.code-workspace` file contains the path to the chief-of-staff folder. Ask permission first:
> "I can try to find your Mindstone OS folder automatically. OK if I search for the Cursor workspace file on your computer?"

If user agrees, search for the workspace file:
```bash
# Mac/Linux
find ~ -name "mindstone-os.code-workspace" -o -name "*mindstone*.code-workspace" 2>/dev/null | head -5

# Windows (PowerShell)
Get-ChildItem -Path $env:USERPROFILE -Recurse -Filter "*mindstone*.code-workspace" -ErrorAction SilentlyContinue | Select-Object -First 5
```

If found, read the workspace file to extract the chief-of-staff path:
```json
{
    "folders": [
        { "name": "Primary Zone", "path": "." },  // ← This is the chief-of-staff folder
        { "name": "Mindstone OS Core", "path": "/path/to/shared/drive" }
    ]
}
```

The `"path": "."` means the workspace file is IN the chief-of-staff folder. Use the workspace file's directory as the source.

**Step 2: If workspace file found, confirm with user**

> "I found what looks like your Mindstone OS setup at:
> `{detected_path}`
>
> **Does this look right?** (yes / no, that's not it)"

**Step 3: If not found or user says no, try common locations**

Ask permission:
> "OK if I check some common locations on your computer?"

Then search:
```bash
# Mac
ls -d ~/chief-of-staff ~/Documents/chief-of-staff ~/Google\ Drive/chief-of-staff 2>/dev/null

# Or search for AGENTS.md
find ~ -name "AGENTS.md" -path "*/chief-of-staff/*" 2>/dev/null | head -5
```

**Step 4: If still not found, ask user for the path**

> **I couldn't find it automatically. Let's locate it manually.**
>
> **How to find and copy your folder path:**
>
> **Mac:** 
> 1. Open Finder and search for "chief-of-staff" or "AGENTS.md"
> 2. Right-click the folder, hold **Option** key, click "Copy ... as Pathname"
>
> **Windows:** 
> 1. Open File Explorer and search for "chief-of-staff" or "AGENTS.md"
> 2. Click in the address bar and copy, OR Shift+right-click the folder → "Copy as path"
>
> **Paste the full path here:**

**When user provides a path:**

Ask permission to scan:
> "OK if I check that folder to see what's there? (I'll just look at file names, not read contents yet)"

Then:
1. Verify the folder exists using `LS`
2. Check for expected files: `AGENTS.md`, `memory/`, `skills/`
3. If folder doesn't exist or looks wrong, help troubleshoot

### Phase 3: Scan and Inventory

**Once folder is confirmed, ask permission to scan contents:**

> "Now I'd like to scan your folder to see what's there. This just looks at file names — I won't read the contents yet. OK to proceed?"

Wait for confirmation, then use `LS` to inventory:
- `{v2_folder}/memory/topics/` — count .md files
- `{v2_folder}/skills/` — count .md files (also check `playbooks/` as alternative name)
- `{v2_folder}/scripts/` — count files
- Check for `AGENTS.md`, `AUTOLOAD.md`, and `memory/ABOUTME.md`

**Present inventory to user:**

> **Here's what I found in your Mindstone OS folder:**
>
> **Location:** `{v2_folder}`
>
> | Content | Found | Files |
> |---------|-------|-------|
> | Memory Topics | {yes/no} | {count} files |
> | Skills | {yes/no} | {count} files |
> | Scripts | {yes/no} | {count} files |
> | AGENTS.md | {yes/no} | — |
> | ABOUTME.md | {yes/no} | — |
> | AUTOLOAD.md | {yes/no} | — |
>
> {If topics found, list first 5-10 file names}
>
> **Does this look right?** (yes / no / let me check)

Wait for user confirmation before proceeding. If they say "no" or "let me check", help troubleshoot.

### Phase 4: Determine Destination

**Confirm where to copy files:**

> **Where should I copy your content?**
>
> Your Rebel workspace is at: `{workspace_path}`
>
> I recommend copying to your **Chief-of-Staff** space:
> `{workspace_path}/Chief-of-Staff/`
>
> This is your personal space — private to you.
>
> **Is Chief-of-Staff the right destination?** (yes / use a different space)

If user wants a different space, help them identify/create it.

### Phase 5: Copy Memory Topics

**First, check destination for existing files:**

Use `LS` to check if `{destination}/memory/topics/` exists and has files.

**If destination has existing files, show conflicts:**
> "I found {count} existing files in your destination folder. Here's what would happen:"
>
> | File | Action |
> |------|--------|
> | `topic-a.md` | Already exists — will SKIP (keep existing) |
> | `topic-b.md` | New — will copy |
>
> **How should I handle files that already exist?**
> 1. **Skip existing** (safest — keeps your current files)
> 2. **Overwrite** with Cursor versions
> 3. **Cancel** and let me review first

Default to "Skip existing" if user is unsure.

**Copy one category at a time with user approval:**

> **Step 1 of 4: Copy Memory Topics**
>
> I'll copy {count} files from:
> `{v2_folder}/memory/topics/`
>
> To:
> `{destination}/memory/topics/`
>
> **Files to copy:**
> {list all file names}
>
> I'll add a short description header to each file (Rebel needs this to index them).
>
> **Proceed with copying memory topics?** (yes / skip / let me review first)

**If user says "let me review first":**
- Show the first 20 lines of each file
- Let them exclude specific files

**When copying, use shell commands for efficiency:**

First, ensure destination exists:
```bash
mkdir -p "{destination}/memory/topics"
```

Then copy all files at once (showing the command to user first):
```bash
# Mac/Linux
cp -n "{v2_folder}/memory/topics/"*.md "{destination}/memory/topics/"

# Windows (PowerShell)
Copy-Item -Path "{v2_folder}\memory\topics\*.md" -Destination "{destination}\memory\topics\" -ErrorAction SilentlyContinue
```

The `-n` flag (Mac/Linux) prevents overwriting existing files.

**After bulk copy, add frontmatter to files that need it:**

For each copied file, read it and check if it has a `description:` in the frontmatter. If not, add the frontmatter header. This can be done file-by-file with Read/Write, or inform the user that Rebel will index them on next scan.

**After copying, confirm:**

> **Memory topics copied!**
>
> Copied {count} files to `{destination}/memory/topics/`
>
> {list files copied}
>
> **Ready for the next step?**

### Phase 6: Copy Skills

> **Step 2 of 4: Copy Skills**
>
> I'll copy {count} skill files from:
> `{v2_folder}/skills/`
>
> To:
> `{destination}/skills/migrated/`
>
> **Note:** Rebel organizes skills in folders. Each skill `foo.md` becomes `skills/migrated/foo/SKILL.md`.
>
> **Files to copy:**
> {list all file names, showing old → new path}
>
> **Proceed with copying skills?** (yes / skip / let me review first)

**When copying skills, create the folder structure and copy:**

For each skill file `foo.md`:
1. Create the folder:
   ```bash
   mkdir -p "{destination}/skills/migrated/foo"
   ```
2. Copy the file as SKILL.md:
   ```bash
   cp "{v2_folder}/skills/foo.md" "{destination}/skills/migrated/foo/SKILL.md"
   ```

Or do all at once with a loop (show user the command first, ask for approval):
```bash
# Mac/Linux
for f in "{v2_folder}/skills/"*.md; do
  name=$(basename "$f" .md)
  mkdir -p "{destination}/skills/migrated/$name"
  cp "$f" "{destination}/skills/migrated/$name/SKILL.md"
done
```

**After bulk copy, add frontmatter to files that need it** (same as memory topics).

**After copying, confirm:**

> **Skills copied!**
>
> Copied {count} skills to `{destination}/skills/migrated/`
>
> | Original | New Location |
> |----------|--------------|
> | `foo.md` | `skills/migrated/foo/SKILL.md` |
> | ... | ... |
>
> **Ready for the next step?**

### Phase 7: Copy Scripts

> **Step 3 of 4: Copy Scripts**
>
> I'll copy {count} script files from:
> `{v2_folder}/scripts/`
>
> To:
> `{destination}/scripts/`
>
> **Files to copy:**
> {list all file names}
>
> **Note:** Scripts are copied as-is. You may need to update any hardcoded paths.
>
> **Proceed with copying scripts?** (yes / skip / let me review first)

**When copying scripts, use shell commands:**

```bash
# Mac/Linux
mkdir -p "{destination}/scripts"
cp -n "{v2_folder}/scripts/"* "{destination}/scripts/"

# Windows (PowerShell)
New-Item -ItemType Directory -Force -Path "{destination}\scripts"
Copy-Item -Path "{v2_folder}\scripts\*" -Destination "{destination}\scripts\" -ErrorAction SilentlyContinue
```

Note: File extensions preserved; executable permissions may need to be re-enabled manually on Mac/Linux (`chmod +x`).

**After copying, confirm:**

> **Scripts copied!**
>
> Copied {count} files to `{destination}/scripts/`
>
> **Ready for the final step?**

### Phase 8: Create README.md from AGENTS.md + ABOUTME.md

> **Step 4 of 4: Create README.md**
>
> In Rebel, your personal context lives in `README.md` instead of `AGENTS.md`.
>
> I'll extract key content from:
> - `AGENTS.md` — your system prompt and auto-loaded context
> - `ABOUTME.md` — your profile information
> - `AUTOLOAD.md` — if present, your high-utility facts
>
> And create a new `README.md` for your Chief-of-Staff space.
>
> **Would you like me to:**
> 1. **Create README.md** — Extract useful content from AGENTS.md + ABOUTME.md
> 2. **Skip** — I'll create a minimal README; you can add content later
> 3. **Show me what's in them first** — Let me review before deciding

**If user wants to see content first:**
Read and display AGENTS.md and ABOUTME.md, highlighting:
- Profile info (name, email, role)
- Auto-loaded memory / AI working context
- Company variables (if any)

**When creating README.md:**

First ask permission:
> "OK if I read your AGENTS.md, ABOUTME.md, and AUTOLOAD.md (if present) to extract your profile and context?"

Read AGENTS.md, ABOUTME.md, and AUTOLOAD.md (if it exists), then create:

```markdown
---
rebel_space_description: "Personal assistant space migrated from Mindstone OS"
space_type: "chief-of-staff"
sharing: "private"
migrated_from: "cursor"
migrated_date: {YYYY-MM-DD}
---

# Chief of Staff

## Profile

{Extract from ABOUTME.md: name, email, role, teams}

## AI Working Context

{Extract from AGENTS.md: the "Auto-Loaded Memory" or similar section}
{Also include content from AUTOLOAD.md if it exists}
{Skip platform boilerplate like MCP references, zone listings, safety rules — Rebel handles these automatically}

---
*Migrated from Mindstone OS on {date}. Review and update as needed.*
```

**After creating README:**

> **README.md created!**
>
> Your Chief-of-Staff space now has:
> - `README.md` with your profile and context
>
> **Note:** Some content from AGENTS.md wasn't migrated because Rebel handles it automatically:
> - MCP/tool configurations → Use Settings → Connectors
> - Safety rules → Built into Rebel
> - Zone references → Now called "Spaces"
>
> **Ready to verify the migration?**

### Phase 9: Verify Migration

> **Migration Complete! Let's verify everything.**
>
> **Copied to `{destination}/`:**
>
> | Category | Files | Status |
> |----------|-------|--------|
> | Memory Topics | {count} | {checkmark or count mismatch warning} |
> | Skills | {count} | {checkmark or count mismatch warning} |
> | Scripts | {count} | {checkmark or count mismatch warning} |
> | README.md | 1 | {checkmark} |
>
> **Quick verification:**
> - Open your workspace in Finder/Explorer
> - Check that `Chief-of-Staff/memory/topics/` has your files
> - Check that `Chief-of-Staff/skills/migrated/` has your skills
>
> **Your original Cursor setup is untouched** at:
> `{v2_folder}`
>
> You can continue using Cursor alongside Rebel if you like.

### Phase 10: Next Steps

> **You're all set!**
>
> **What's different in Rebel:**
>
> | Old Way (Cursor) | New Way (Rebel) |
> |------------------|-----------------|
> | `@skill-name.md` | Just describe what you want — Rebel finds skills automatically |
> | Klavis MCP | Settings → Connectors (reconnect Gmail, Slack, etc.) |
> | Edit AGENTS.md | Edit README.md or just tell Rebel to remember things |
>
> **Recommended next steps:**
> 1. **Reconnect your tools** — Go to Settings → Connectors to set up Gmail, Calendar, Slack, etc.
> 2. **Try a skill** — Say "help me prepare for a meeting" and Rebel will use your migrated skills
> 3. **Review your memory** — Check `Chief-of-Staff/memory/topics/` and clean up if needed
>
> **Questions?** Just ask — I'm here to help!

## [IMPORTANT]

### Safety First
- **NEVER modify or delete original files** — All operations are copy-only
- **Checkpoint before every action** — Wait for user confirmation
- **Show what will happen** before doing it
- **Verify after copying** — Count files and confirm

### Cross-Platform Paths
- Accept paths exactly as user pastes them — both `/` and `\` work
- Google Drive, OneDrive, and Dropbox paths vary by OS — help users find theirs
- Paths with spaces are fine — just use them as-is

### Handling Edge Cases

**Missing folders:**
If `memory/topics/` or `skills/` doesn't exist, skip that phase:
> "I didn't find a skills folder in your setup — that's fine, we'll skip that step."

**Empty folders:**
If a folder exists but is empty, note it and skip:
> "Your skills folder is empty — nothing to copy there."

**Already migrated:**
If destination files already exist, ask before overwriting (default to Skip):
> "I found existing files in `{destination}/memory/topics/`. Should I:
> 1. **Skip files that already exist** (recommended — keeps your current files)
> 2. Overwrite with the Cursor versions
> 3. Cancel and let you review first"

**Destination inside source:**
If user picks a destination that's inside their source folder, warn and block:
> "That destination is inside your Mindstone OS folder — that could cause problems. Please choose a different location."

**Alternative folder names:**
Some users may have `playbooks/` instead of `skills/`, or different capitalization (`Memory/Topics`). Check for these variants.

**AUTOLOAD.md present:**
If `AUTOLOAD.md` exists, include its content in the README.md creation (Phase 8).

**Non-.md files in memory/topics or skills:**
Copy `.md` files only. Note any other files and ask if user wants them copied too.

**AGENTS.md with template variables:**
v2 AGENTS.md files may contain `{{ path_to_mindstone_os_core }}` variables. These won't work in Rebel — extract only the user-specific content, not platform references.

**Symlinks:**
If `CLAUDE.md` is a symlink to `AGENTS.md`, just skip it — we only need AGENTS.md.

### What NOT to Migrate

- `.code-workspace` file — Not needed in Rebel
- `CLAUDE.md` symlink — Not needed
- Platform references to "Mindstone OS Core" — Now built into Rebel
- MCP configurations — Fresh setup via Connectors is better

### Terminology for User Communication

| Say This | Not This |
|----------|----------|
| Space | Zone |
| Skill | Playbook |
| README.md | AGENTS.md |
| Connectors | Klavis MCP |

## [TEMPLATE: Minimal README.md]

If user skips README extraction or AGENTS.md is empty:

```markdown
---
rebel_space_description: "Personal assistant space"
space_type: "chief-of-staff"
sharing: "private"
---

# Chief of Staff

Your personal space for AI assistance.

## Profile

{Add your name, role, and key context here}

## AI Working Context

{Add facts you want Rebel to remember across conversations}
```
