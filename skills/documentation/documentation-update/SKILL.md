---
name: documentation-update
description: "Maintain accurate, up-to-date housekeeping documentation including READMEs, AGENTS.md, and organizational files to help users navigate the project."
last_updated: 2025-10-26
tools_required: []
agent_type: main_agent
---

# Update Documentation

**Goal**: Maintain accurate, up-to-date housekeeping documentation (READMEs, AGENTS.md, and organizational files) that helps users navigate the project.

- [See also](#see-also)
- [Key Files to Update](#key-files-to-update)
- [Process](#process)


## See also

- [write-help-evergreen-doc](write-help-evergreen-doc/SKILL.md) - for guidelines on writing/maintaining individual documentation files


## Key Files to Update

- **Directory READMEs** (e.g., [skills/README](../../README.md))
   - Keep aligned with actual directory contents
   - Update when files are added/removed/reorganized

- **AGENTS.md** and **README.md** files
   - Make focused updates - be cautious/minimal in what you change, because these are critical docs.
   - Emphasize the most important/common things
   - Overview of what the project/directory contains
   - Structure and organization
   - Links to key resources
   - CRITICAL: Ask for express permission before updating the main `README.md` as it affects everyone


## Process

1. **Scan the project**: Use `find . -name "*.md"` or `list_dir` to identify all markdown files
2. **Assess relevance**: Focus on user-facing documentation, guides, and prompts (skip generated logs, temp files, personal memory folders)
3. **Identify issues**: Flag documentation that is broken, incomplete, out-of-date, missing, or confusing
4. **Propose changes**: Present a summary of what needs updating and get user approval before making extensive changes
5. **Update structure docs**: Ensure READMEs and organizational files accurately reflect current state
6. **Check links**: Verify internal links, wikilinks, and cross-references still work
7. **Maintain signposting**: Ensure "See also" sections connect related documentation
8. **Avoid duplication**: Use cross-references rather than duplicating content across multiple docs

