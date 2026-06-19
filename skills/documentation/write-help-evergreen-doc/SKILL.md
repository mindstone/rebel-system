---
name: write-help-evergreen-doc
description: "Creates concise, well-structured evergreen documentation on how systems work, with proper cross-referencing and maintenance guidelines."
last_updated: 2025-10-28
tools_required: []
agent_type: main_agent
output_shape:
  default_surface: file_artifact
  chat_contract: concise_summary
  artifact_expected: true
  max_chat_words: 180
  source_policy: artifact_sources
---

# Writing evergreen documentation

**Before creating new documentation**: Always check first to see if similar documentation already exists.

see also:
- [signposting-to-single-source-of-truth.md](documentation/signposting-to-single-source-of-truth/SKILL.md) - guidelines for cross-referencing and avoiding content duplication
- [write-planning-doc.md](documentation/write-planning-doc/SKILL.md) - for writing ephemeral decision/planning docs
- [`documentation-update.md`](documentation-update/SKILL.md) - for keeping documentation current every so often
- [`../system/file-naming-and-organisation/SKILL.md`](../system/file-naming-and-organisation/SKILL.md) - consolidated naming conventions


## What are evergreen docs?

This is for writing evergreen, general documentation on how the system or codebase works.

Above all, evergreen docs must do two things well:
1. Capture intent, principles, design decisions - what was the problem being solved, what has specified by/agreed with the user?
2. Signposting/see also - point to relevant files/code/functions/docs

These should be a concise, clear, well-structured, complete-enough, up-to-date description of things. By "complete-enough", they should cover most of the important topics, if only to signpost to where more information can be found, or to the code itself.

t's easy for code documentation to become inaccurate, incomplete or out of date - so it's better to focus on describing the problem being solved, and point to the canonical location where the answer can be found.

**Single source of truth**: Documentation should refer to one another and avoid too much overlap in content, so that if information changes, we ideally only need to change the documentation in one place. See [signposting-to-single-source-of-truth.md](documentation/signposting-to-single-source-of-truth/SKILL.md) for detailed guidance.


## Format

They should be written in Markdown, stored as `Topic-Name.md`.

**Frontmatter**: All documentation files in `skills/`, `memory/`, and `help-for-humans/` must include YAML frontmatter with at least a one-line `description` field (may include other optional fields like `use_cases`, `last_updated`, `tools_required`, `dependencies`, `agent_type`).

**Storage location**: If it's a guide for humans that will probably be useful across the company, put it in `help/`. Otherwise, ask the user where to store.


## Filename Guidelines

Choose descriptive filenames that clearly indicate the document's content:

- **Be specific**: `Upload-Document-Processing-Pipeline.md` instead of just `Upload.md`
- **Include context**: `Navigation-Component-Design.md` instead of just `Navigation.md`
- **Keep existing names**: Where possible, include the current name as a prefix (e.g., `Setup-Development-Environment.md` keeps `Setup`)
- **Group related docs**: Use similar prefixes so related docs sort together (e.g., all `Database-*.md` files)
- **Maintain prefix conventions**: Keep category prefixes (Database-, Testing-, API-, etc.)

Good examples:
- `Database-Integration-Reference.md`
- `Testing-Automation-Overview.md`
- `API-Client-Integration.md`
- `Authentication-Security.md`


## Document structure

They might be organised into something like the following sections. Use your judgment. Probably only a few of these will be relevant for each doc, feel free to rename them, etc.


### Introduction

2-sentence summary of the topic, and what the document covers.

### See also

Bullet-point list of other relevant docs, code, urls, or other resources that provide related information, or more detail. Provide a 1-sentence summary or explanation of how each one is relevant.

See [signposting-to-single-source-of-truth.md](documentation/signposting-to-single-source-of-truth/SKILL.md) for complete guidance on cross-referencing best practices, two-way signposting, and avoiding content duplication.

Add references to and from this new doc (e.g. in relevant code, planning docs per [write-planning-doc.md](documentation/write-planning-doc/SKILL.md), etc) - use parallel AI assistance for this

Link to planning docs or architecture decision records for rationale.


### Principles, key decisions

- Include any specific principles/approaches or decisions that have been explicitly agreed with the user (over and above existing coding rules, project examples, best practices, etc).
- As you get new information from the user, update this doc so it's always up-to-date.


### [Provide a few detailed sections here, depending on the topic]

Include as appropriate:
- high-level overview, architecture
- common patterns, howtos
- examples
- gotchas
- limitations
- troubleshooting
- planned future work (only if explicitly agreed with the user)


### Appendix

Add any other important context here, e.g.
- example data
- other information that should be captured but doesn't fit neatly in the above sections


## Common Pitfalls to Avoid

1. **Information duplication** - Creates maintenance burden when things change
2. **Vague status descriptions** - Be specific about implementation state
3. **Missing cross-references** - Always link to related documentation
4. **Outdated examples** - Ensure code samples match current patterns
5. **Forgotten transitions** - Update docs as systems migrate


## Quality Checklist

Before committing documentation:
- [ ] Cross-references are valid and helpful
- [ ] No contradictions with other documents
- [ ] Examples match current code patterns
- [ ] Transitional states are clearly marked
- [ ] "See also" sections are comprehensive

