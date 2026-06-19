---
name: write-deep-dive-as-doc
description: "Conducts deep research on a topic and creates detailed reference documentation with source attribution and best practices."
last_updated: 2025-10-26
agent_type: main_agent
---

# Write Deep Dive as Documentation

**Before starting**: Use semantic search (`@files`) or browse `help-for-humans/` and `skills/` to see if documentation on this topic already exists.

Do a deep dive on the web about the topic that the user has asked about. If you need more clarification about the requirements to focus the search fruitfully, ask questions (ideally upfront). If you need more context from files, investigate for relevant code & docs.

Before you start, run `date` to get today's date, in case you need to assess how recent the search results are.

Then write this up as a detailed reference doc, following the instructions in [write-help-evergreen-doc.md](documentation/write-help-evergreen-doc/SKILL.md). Include URL links/references (as well as mentions of your own code/docs etc), so you can track down the original sources later if you need to.

**Frontmatter**: All documentation files must include YAML frontmatter with at least a one-line `description` field (may include other optional fields like `use_cases`, `last_updated`, `tools_required`, `dependencies`, `agent_type`).

## Process Guidelines

### 1. Clarify the Scope
Before diving into research, ask questions:
- What specific aspects of the topic are most important?
- What's the intended use case or application?
- Are there particular problems you're trying to solve?
- How deep should the technical detail go?
- What's the target audience for this documentation?
- etc

### 2. Research Strategy
- **Start broad** - Get an overview of the topic and ecosystem
- **Go specific** - Focus on the aspects most relevant to your needs
- **Check recency** - Note dates on articles, especially for fast-moving technologies
- **Multiple sources** - Cross-reference information, taking into account authoritativeness
- **Practical focus** - Prioritize actionable information over theory

### 3. Documentation Structure
Follow [`write-help-evergreen-doc.md`](documentation/write-help-evergreen-doc/SKILL.md) format as appropriate, e.g.:
- **Overview** - What is this technology/concept?
- **See also** section at top - Key sources with brief context (URLs, official docs, tutorials, tools, related .md files)
- **Use cases** - When and why to use it
- **Getting started** - Quick setup or hello world
- **Key concepts** - Essential understanding
- **Best practices** - Proven approaches and patterns
- **Common gotchas** - Known issues and how to avoid them

### 4. Source Attribution
**IMPORTANT**: Include "See also" section at top of document (after overview/intro) with all research sources:
- **Concise format** - One line per source with brief context (what it covers, why relevant)
- **Direct links** - Include URLs for all referenced sources
- **Date notation** - Note when sources were published/accessed (especially for fast-moving tech)
- **Authority assessment** - Prefer official docs, established experts, recent sources
- **Code attribution** - Reference any code examples with their source
- **Related docs** - Link to related .md files in the repository with relative paths

Remember: The goal is to create a reference that will explain, be up-to-date, help with decision-making, save time, and/or prevent mistakes/issues/surprises. Be proactive. Focus on the information that would be most valuable given the user's intent. Highlight anything worthy of remark.
