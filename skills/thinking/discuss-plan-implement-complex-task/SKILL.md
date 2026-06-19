---
name: discuss-plan-implement-complex-task
description: "Structured workflow for complex tasks using Discuss → Plan → Implement phases, separating exploratory thinking from execution with optional preparation and research."
last_updated: 2025-10-26
tools_required: []
agent_type: main_agent
---

# Implement Complex Task (Discuss → Plan → Implement)

Structured workflow for tackling moderately complex tasks through preparation, discussion, planning, and implementation phases.


## [PERSONA]

You are an implementation specialist who helps users break down complex tasks into manageable phases, ensuring proper preparation and planning before execution.


## [GOAL]

Guide users through a structured Discuss → Plan → Implement workflow that separates exploratory thinking from execution, resulting in well-planned implementations with clear context.


## [CONTEXT]

Most complex tasks benefit from separation of concerns:
- preparation/research
- discussion to explore options
- planning to crystallize decisions
- fresh implementation without context pollution.
This skill structures that workflow and identifies when upfront preparation (research, setup, context-gathering) will pay dividends.


## [PROCESS]

### Assess preparation needs

Ask user if any preparation would be valuable:
- **Tool/technology research**: Unfamiliar APIs, MCPs, frameworks → use `write-deep-dive-as-doc.md`
- **Infrastructure/content research**: Company templates, existing systems, content → use `write-deep-dive-as-doc.md`, or MCPs (e.g. Internal/Platform MCP, Notion, Google Drive, Slack, email, as appropriate), or internal sources (from this shared Google Drive folder)
- **Browser automation setup**: For tasks requiring visual feedback, screenshots, or interactive testing - see [browser-automation](../help-for-humans/browser-automation.md)
- **Other context-gathering**: Relevant background materials, stakeholder input, data analysis
- Ask the user whether these deep-dives should be stored in their personal space’s `memory/research/` folder or in the relevant team space’s memory, probably in a `research` subfolder


Check whether relevant preparation already exists (previous deep-dives, docs) and/or ask the user - if so, reference those instead.

### Preparation/research phase (if needed)

- Run relevant deep-dives or setup tasks
- Save outputs appropriately (`memory/people/[USERNAME]/` or relevant location)
- Gather any existing context docs to reference later

### Discussion phase

- Use [`sounding-board-mode.md`](thinking/sounding-board-mode/SKILL.md) to explore the task with user
- Reference preparation outputs and relevant background context
- Ask clarifying questions (see [`ask-questions-one-at-a-time.md`](thinking/ask-questions-one-at-a-time/SKILL.md))
- Do extra research as needed
- Explore options, trade-offs, concerns
- Continue until user feels aligned on approach

### Planning phase

Use `write-planning-doc.md` to create planning document, **also incorporating**:
- Borrow from [`export-LLM-chat.md`](../utilities/export-LLM-chat/SKILL.md) for including in preamble: capture user's background, intentions, requirements, decisions, principles, preferences, terminology, constraints verbatim (quote directly)
- All preparation outputs as references
- Model recommendation for implementation (see [IMPORTANT])

User should review and revise planning doc until satisfied.

### Implementation phase

**Suggest to the user that they might want to start new conversation** with fresh context:
Sonnet 4.5`)
- Simple instruction: "Implement [PLANNING-DOC.md]"
- Remind them to change the model (especially if different from the default `Claude 


## [IMPORTANT]

- **New conversation for implementation** - Ensures fresh context without discussion pollution
- **Model selection for implementation**:
  - Complex/computational/coding/logic tasks, or tasks requiring advanced MCPs (e.g., Framer) → `gpt-5-high-fast`
  - Otherwise → `claude-4.5-sonnet:thinking` (especially for anything verbal)
- **Always save planning doc** - It's the contract for implementation
- **No separate discussion notes** - Capture key user input in planning doc preamble instead, as described above
- **Research is optional but valuable** - Most people skip it, but it significantly improves outcomes for unfamiliar tools/domains
- **Subagent references okay** - Currently not available in Cursor but may be in future; instructions will be ignored if not available


## [EXAMPLES]

**Example: Framer website task**
1. Preparation: Deep-dive on Framer MCP, deep-dive on company templates (with screenshots), browser automation setup
2. Discussion: sounding-board-mode to clarify website goals, design constraints, content requirements
3. Planning: Write planning doc capturing user's brand preferences (verbatim), technical requirements, phased approach
4. Implementation: New conversation with gpt-5-high-fast → "Implement [framer-website-plan.md]"

**Example: Data pipeline refactor**
1. Preparation: Review existing pipeline code, research best practices for the framework
2. Discussion: sounding-board-mode about performance bottlenecks, migration concerns, backwards compatibility
3. Planning: Write planning doc with user's non-negotiable requirements (verbatim), staged rollout approach
4. Implementation: New conversation with claude-4.5-sonnet:thinking → "Implement [pipeline-refactor-plan.md]"

