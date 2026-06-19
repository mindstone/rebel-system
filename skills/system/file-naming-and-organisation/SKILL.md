---
name: file-naming-and-organisation
description: "Guide for file naming conventions and organisation standards across the Company OS for skills, documentation, and other materials."
last_updated: 2025-11-06
tools_required: []
agent_type: either
dependencies: []
---

# File naming and organisation

Naming conventions across Mindstone Rebel.


## See also

- [write-skill](../documentation/write-skill/SKILL.md) - full skill writing guide
- [write-help-evergreen-doc](../documentation/write-help-evergreen-doc/SKILL.md) - documentation writing standards
- [signposting-to-single-source-of-truth](../documentation/signposting-to-single-source-of-truth/SKILL.md) - cross-referencing and avoiding content duplication
- [memory-folders-and-approvals.md](../../help-for-humans/memory-folders-and-approvals.md) - memory organisation
- [rename-or-move](rename-or-move-and-update-references/SKILL.md) - **IMPORTANT** safe renaming/moving of files while keeping references updated


## Naming conventions by type

### Skills (folder-based structure)

Skills follow the [Anthropic Agent Skills Spec](https://github.com/anthropics/skills). Each skill is a **folder** containing a `SKILL.md` file.

**Folder naming**:
- **Format**: `lowercase-hyphen-separated` (required - no `.md` extension)
- **Examples**: `web-researcher/`, `meeting-external-prep/`, `pdf-read-extract/`
- The folder name must match the `name` field in the SKILL.md frontmatter

**Structure**:
```
skill-name/
├── SKILL.md          # Required
├── scripts/          # Optional - executable code
├── references/       # Optional - docs to load as needed
└── assets/           # Optional - templates, images
```

**Frontmatter** (required in SKILL.md):
```yaml
---
name: skill-name       # Must match folder name exactly
description: "..."     # What this skill does
---
```

See [write-skill](../documentation/write-skill/SKILL.md) for full guide.


### Core system files (`help-for-humans/`, `scripts/`)

**Format**: `lowercase-hyphen-separated.md` (required for consistency)

These are shared system files that everyone uses, so consistency is important.

Examples: `meeting-external-prep.md` · `web-researcher.md` · `Postgres-database-migrations.md`

**Exception**: Use capitalisation for proper nouns, acronyms, and established product names where appropriate (e.g., `GitHub`, `API`, `GDPR`, your company name).

**IMPORTANT**: don't change special all-caps files like `AGENTS.md`, `CLAUDE.md`, `README.md` (unless expressly asked by the user)

Principles:
- Be specific and descriptive
- Include context (not just `navigation.md` but `navigation-component-design.md`)
- Group related docs with prefixes (`database-*.md`, `testing-*.md`)
- Put the searchable term first - the word users would look for (e.g., `Mixpanel-API-access.md` not `access-Mixpanel-API.md`, but `undoing-AI-changes.md` not `AI-changes-undoing.md` since users search for "undoing")


### User files (`memory/people/`, `memory/teams/`)

**Format**: User's choice - use spaces or hyphens as you prefer

Personal and team memory files can use whatever naming works best for you:
- ✅ `meeting notes.md` or `meeting-notes.md` 
- ✅ `project ideas.md` or `project-ideas.md`

For filenames with dates:
- ✅ `251022_meeting-notes.md`
- ✅ `251022a_research-brief.md`


### Folders

**Format**: Use spaces for human readability (recommended)

Examples: `Customer Success/` · `User Personas/` · `AI Programs/`

Avoid these characters:
- `/` `\` `< > : " | ? *`
- Leading/trailing spaces


### Team paths

**Format**: Title case with spaces

Examples:
- ✅ `memory/teams/Customer Success/`
- ✅ `memory/teams/Product Marketing/`


## Organisation by content type

**Generic/reusable skills** → appropriate `skills/<category>/` (documentation, system, research, thinking, meetings, memory, utilities, communication)

**Team-specific skills** → `memory/teams/[TEAM-NAME]/`

**Evergreen company knowledge** → `background/[Team]/`

**Ephemeral/task output** → `memory/teams/` or `memory/people/`

**Utilities/scripts** → `scripts/`


## Scripting with spaces

When writing shell scripts or CLI operations:
- **Always quote paths**: `cd "Customer Success"` not `cd Customer Success`
- **Python**: Use `pathlib.Path` (handles spaces automatically)
- **Bash**: Quote variables: `"$filepath"` not `$filepath`


## Date stamps

**Format**: `yyMMdd` (e.g., `251022` for October 22, 2025)

Use as prefix for ephemeral/timestamped content:
- ✅ `251022_meeting-notes.md`
- ✅ `251022a_research-brief.md` (append letter for multiple on same day)

