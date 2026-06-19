# The Software Engineer Workflow

Instructions for orchestrating coding tasks — building MCP servers, plugins, scripts, and integrations — by delegating to specialized subagents and synthesizing their outputs.

> **Sync Notice** — Derived from Rebel's internal engineering workflow (2026-04-09). Token-efficient user-facing derivative. When updating the upstream quality philosophy, core phase structure, or review principles, check whether changes should propagate here.

---

## Overview

This workflow coordinates structured coding work — the kind that benefits from codebase research, a staged plan, implementation with fresh-context subagents, and independent review before delivery.

**When to use this workflow:** When a coding task is complex enough to benefit from planning and review. Examples:

- "Build me an MCP server for [service]" (→ also reference the [build-custom-mcp-server](../../skills/coding/build-custom-mcp-server/SKILL.md) skill)
- "Create a plugin that shows [dashboard/tracker/view]" (→ also reference the [build-custom-plugin](../../skills/system/build-custom-plugin/SKILL.md) skill)
- "Write a script that processes [data] and outputs [format]"
- "Integrate [API] with [existing system]"
- Any multi-file coding task requiring research, planning, and verification

**When NOT to use this workflow:** For quick, single-file edits, config changes, copy updates, or tasks where the solution is immediately obvious. Just do those directly.

This workflow uses four roles:

| Role | Responsibility |
|------|----------------|
| **Main Agent (You)** | Coordinates workflow, captures user intent, challenges the approach, synthesizes review feedback. **You are the final arbiter** — independently verify every reviewer finding before acting on it. |
| **Planner** | Researches the codebase or API, creates a staged plan. Fresh instance. |
| **Implementer** | Implements one stage at a time. Fresh instance per stage. |
| **Reviewer** | Reviews the completed implementation through a cross-family lens. **Single reviewer, mandatory, different model family from the main agent.** |

**Why this architecture?**
- **Subagents get fresh context** — They bring full intelligence to focused tasks without accumulated confusion
- **Main agent coordinates** — Lightweight synthesis, continuous context to bridge handoffs
- **Working document is the memory** — All agents read/write here, ensuring continuity without context bleed
- **Token-efficient** — Single planner, single reviewer. Quality through fresh perspective, not parallel redundancy.

**How this relates to existing skills:**
Skills are atomic operations (building an MCP server, creating a plugin). This workflow *orchestrates* skills and subagents across multiple steps. A Software Engineer task might invoke the `build-custom-mcp-server` skill's phases as part of its execution. Skills are the building blocks; the Software Engineer is the construction plan.

**When invoked by another skill:**
If another skill delegates coding work to this workflow (e.g., [build-custom-mcp-server](../../skills/coding/build-custom-mcp-server/SKILL.md) Phase 4, [extend-mcp-server](../../skills/coding/extend-mcp-server/SKILL.md) Phase 4), treat that skill as the **parent workflow**.

Rules:
- The parent skill's approved outputs, constraints, and linked references are the authoritative brief — use them as the source of truth for scope.
- Do not redo earlier parent-skill phases (discovery, research, tool planning) unless blocked by a real gap.
- Place the working document inside the project directory (e.g., `docs/build-plan.md`) so it ships alongside the source code and is included in any contribution PR.
- When complete, return control to the parent skill so it can continue its remaining phases (security validation, testing, contribution).

---

## Quality Philosophy

**Pursue the cleanest, most maintainable solution — even if it takes longer.** At the same time, **keep things as simple as the task allows.** Clean and robust does not mean over-engineered.

When evaluating approaches, ask:
- **Is this the cleanest way to solve this?** Not the fastest, not the most clever — the cleanest.
- **Will this be easy to change later?** Good modularity means changes are local, not cascading.
- **Would someone reading this code understand it quickly?** If not, simplify.
- **Am I building for a real need or a hypothetical one?** Solve today's problem well; don't pre-build for scenarios that may never arise.

Additional principles:
- **Simple and robust are not opposites** — the best solutions are both.
- **Reuse before reinventing** — always look for existing components, utilities, and patterns before writing new ones.
- **Root cause, not bandaid** — pursue clean, general fixes that address why the problem exists, not brittle workarounds.
- **Clean up as you build** — when touching a file, fix obvious issues: dead code, stale comments, inconsistent naming.

---

## Model Strategy

The Software Engineer workflow works with whatever models the user has available. The key constraint is **cross-family review**: the reviewer must be from a different model family than the main agent.

### Role-to-Model Mapping

| Role | Needs | Model Tier |
|------|-------|------------|
| **Orchestrator (You)** | Judgment, synthesis, coordination | The user's configured model |
| **Planner** | Strategic thinking, task decomposition | Same as orchestrator, or one step down |
| **Implementer** | Execution: writing code, following patterns | Mid-tier is sufficient — does the most writing |
| **Reviewer** | Critical reading, pattern recognition | Different model **family** from orchestrator |

### Principles

1. **Cross-family review is non-negotiable.** Different model families catch genuinely different things. If the orchestrator is Claude, the reviewer should be GPT, Gemini, or another family. If only one family is available, use a different model size and log a warning.
2. **Reading is cheaper than writing.** The reviewer (reads a lot, writes short feedback) costs less than the implementer (writes the deliverable). Don't skimp on review.
3. **Adapt to what's available.** Don't assume specific models exist. Assess what's available and assign roles accordingly.

Log: `[SOFTWARE-ENGINEER] Model assignments: orchestrator=<model>, planner=<model>, implementer=<model>, reviewer=<model>`

---

## Workflow Phases

### Phase 1: Understand

**You do this. Do NOT delegate.**

Before any planning, you must be confident you understand what the user wants built.

**Actions:**

1. Restate your understanding of the task in 2-3 sentences: what's being built, why, and what success looks like.
2. Assess your confidence (0-100%) that you understand:
   - **What** the user wants built
   - **Why** they want it (the underlying goal)
   - **What success looks like** (how they'd verify it works)
   - **What's out of scope** (what they explicitly don't want)
   - **What constraints exist** (language, framework, APIs, performance, security)
3. If confidence < 90%, ask targeted clarifying questions. **Batch your questions** — 2-4 focused questions, not a long interrogation.
4. If the user has provided extensive detail, don't ask unnecessary questions — just confirm your understanding.

**Do NOT proceed to Phase 2 until you're >= 90% confident in the user's intent.**

Log: `[SOFTWARE-ENGINEER] Intent confidence: X%. Clarifications needed: Y/N`

### Phase 2: Plan

**Delegate to Planner subagent.**

The planner brings fresh context and full intelligence to researching the codebase or API and structuring the approach.

**Prompt to Planner:**

> "Create a plan for the following coding task:
>
> **Task:** <task description from user>
> **User intent:** <from Phase 1 — what, why, success criteria, constraints>
>
> Instructions:
> 1. **Research** — Read relevant files, understand existing patterns and conventions. Check APIs, libraries, and dependencies. If building an MCP, review the [MCP development standard](../../skills/coding/build-custom-mcp-server/references/mcp-development-standard.md) and [MCP testing guide](../../skills/coding/build-custom-mcp-server/references/mcp-testing-guide.md).
> 2. **Design the approach** — Break the task into stages. Each stage should produce a concrete, testable output. Consider:
>    - What needs to be built first (dependencies)?
>    - What patterns to follow from existing code?
>    - Where can work happen in parallel?
> 3. **Create the working document** at a sensible location using the [template](references/working-document-template.md)
> 4. Include:
>    - Research notes (files examined, patterns, dependencies)
>    - Staged breakdown with rationale
>    - Assumptions and what breaks if wrong
>    - Alternatives considered
> 5. Report your confidence level (0-100%)
>
> Flag any blocking unknowns."

**After receiving the plan:**
1. Log: `[SOFTWARE-ENGINEER] Plan created (confidence: X%, stages: N)`
2. Review the plan — does it address the task? Are stages logical? Anything missing?
3. If planner confidence < 85%, investigate the gaps yourself or with a researcher subagent before proceeding.
4. **Staff Engineer Challenge** — Before proceeding, briefly assess:
   - Is this the right approach to the underlying problem?
   - Are there simpler alternatives worth considering?
   - Does this align with existing patterns?

**Present the plan to the user:**

> "Here's the plan for your task:
>
> **Working Document:** `<path>`
>
> **Approach:**
> <brief summary of stages>
>
> **Assumptions:**
> <key assumptions>
>
> **Shall I proceed?**"

If the user approves, proceed to Phase 3.

### Phase 3: Implement

**Delegate to Implementer subagent. Fresh instance for each stage.**

**Prompt to Implementer:**

> "Implement the following stage:
>
> **Working Document:** `<path>`
> **Stage:** <N> — <title>
>
> ### What to Do
> <description of the stage's goal>
>
> ### Files in Scope
> - `<file>` — <what to change>
>
> ### Definition of Done
> - [ ] <criterion>
> - [ ] Tests pass
> - [ ] No new lint/type errors in modified files
>
> ### Known Constraints
> - <relevant constraints>
>
> ### Previous Learnings
> - <key decisions from earlier stages>
>
> Read the working document first for full context. Update the Implementation Notes for your stage before declaring complete. Report confidence (0-100%)."

**After each stage:**
1. Log: `[SOFTWARE-ENGINEER] Stage <N> implemented (confidence: X%)`
2. If the implementer reports low confidence (< 80%), investigate before proceeding
3. Run available validation (lint, type check, tests) on modified files
4. Update the working document with stage results
5. Proceed to next stage, or Phase 4 if all stages complete

### Phase 4: Review

**Delegate to a single Reviewer subagent from a different model family.**

> **Cross-family review is mandatory.** This is the single most important quality gate. A reviewer from a different model family catches genuinely different classes of issues. Never skip this phase.

**Prompt to Reviewer:**

> "Review this implementation:
>
> **Working Document:** `<path>`
> **What Changed:** <summary of all stages>
> **Files Modified:** <list>
>
> ### Review Focus
> 1. **Correctness** — Does the code do what the plan says? Any bugs or logic errors?
> 2. **Quality** — Is this clean, maintainable, well-structured? Any code smells?
> 3. **Completeness** — Is anything missing? Edge cases unhandled?
> 4. **Security** — Any secrets exposed, injection risks, unsafe operations?
> 5. **Root cause** — Is this solving the actual problem, or working around a symptom?
>
> ### Additional focus when the task is an MCP connector (build or extend)
> a. **No `dist/` committed** and `.gitignore` excludes build output.
> b. **LICENSE file present** AND `package.json` has a matching `"license"` field.
> c. **No personal absolute paths** (`/Users/<name>/`, `/home/<name>/`, `C:\\Users\\<name>\\`) anywhere in README, source, or tests.
> d. **Every `spawn()` / `exec()` / `execFile()` passes an explicit `timeout` option** — a stalled child hangs the whole MCP server.
> e. **Tool annotations match reality** — any tool that runs a subprocess, shells out, executes AppleScript, or triggers a host-visible side effect must set `destructiveHint: true`, regardless of what the underlying binary "usually" does.
> f. **CLI flag semantics honoured** — when a tool wraps a binary, its flags are used as documented (e.g. `--input-path` / `--input-file` expects a filesystem path, not raw text).
> g. **Tests import real schemas from `src/`** — test files must not redefine `z.object(...)` inline; parallel copies silently diverge from the implementation.
> h. **No internal references** (`mindstone`, `rebel`, `nspr`) inside source or test files — docs can reference the source org in PR metadata only.
>
> ### Required Output
> - Confidence (0-100%)
> - Must-address issues (blocks delivery)
> - Suggestions (nice-to-have improvements)
> - If confidence < 85%, explain specifically why
>
> Read the working document first. Read actual source files, not just descriptions."

**After receiving review:**
1. Log: `[SOFTWARE-ENGINEER] Review received (confidence: X%)`
2. For each piece of feedback:
   - **Verify it** — Does the concern actually apply?
   - **Accept** what you genuinely agree with — fix directly or delegate to implementer
   - **Reject** what you disagree with — document your reasoning
3. If reviewer confidence < 85%, address their specific concerns and request a re-review (maximum 2 iterations)
4. Run validation after all fixes

Log: `[SOFTWARE-ENGINEER] Review synthesized. Accepted: N, Rejected: M. Final confidence: X%`

### Phase 5: Test & Deliver

**You do this.**

1. **Run the full test/validation suite:**
   - Run all available validation commands (lint, type check, build)
   - Run tests — both existing and any new tests added
   - For MCPs: verify startup, tool registration, and basic tool execution
   - For plugins: verify the plugin loads and renders

2. **Verify completeness** — Check the working document's definition of done. Has every item been addressed?

3. **Present the completed work:**

> "Here's what I've built:
>
> **Summary:** <what was built>
>
> **Files created/modified:**
> - <list>
>
> **How to test:**
> <concise steps to verify it works>
>
> **Assumptions to verify:**
> <things the user should double-check>
>
> **Known limitations:**
> <any noted items>"

4. **Offer follow-up actions:**
   - "Would you like me to commit these changes?"
   - "Want me to adjust anything?"

5. **Log session summary:**
```
[SOFTWARE-ENGINEER-SESSION-SUMMARY] {"stages_completed":<N>,"reviewer":"<model>","review_rounds":<X>,"status":"<complete|partial|aborted>"}
```

---

## Artifacts Produced

### 1. Working Document (always produced)

The working document is the task's internal memory — the source of truth that all subagents read and write. It captures intent, approach, execution notes, and review history.

**Location:** Use a sensible location based on context — typically the relevant space's `memory/planning/` folder, or a `docs/plans/` directory for project-scoped work. When building an MCP server or extending a connector, place the working document inside the project directory (e.g., `docs/build-plan.md`) so it ships alongside the source code and is included in any contribution PR.

**Template:** [`software-engineer/references/working-document-template.md`](references/working-document-template.md)

**Lifecycle:** Created in Phase 2 (Planning), updated throughout, kept after completion for reference.

### 2. Deliverables (task-dependent)

The actual code, scripts, configurations, or other outputs the user asked for. Location depends on the task — MCP servers go in their project directory, plugins in the plugin system, scripts where specified.

---

## Working Document

The working document is the task's source of truth. All subagents read it for context.

**Template:** [`software-engineer/references/working-document-template.md`](references/working-document-template.md)

Key sections:

| Section | Purpose | Who updates |
|---------|---------|-------------|
| **Frontmatter** (YAML) | Metadata: workflow, status, models, complexity | Orchestrator |
| **User Intent** | What, why, success criteria, constraints | Orchestrator (Phase 1) |
| **Current State** | Authoritative snapshot — subagents read this FIRST | Orchestrator after each phase |
| **Source Inventory** | APIs, libraries, patterns, prior work discovered | Planner (Phase 2) |
| **Approach** | Staged breakdown with execution notes per stage | Planner (Phase 2), Implementer (Phase 3) |
| **Assumptions** | What we're taking for granted | Planner (Phase 2) |
| **Deliverables** | Every file created/modified | Implementer + Orchestrator |
| **Review History** | Reviewer feedback, what was accepted/rejected | Orchestrator (Phase 4) |
| **Activity Log** | Append-only timeline of key events | Orchestrator throughout |

---

## Domain-Specific Guidance

### MCP Servers

When invoked from [build-custom-mcp-server](../../skills/coding/build-custom-mcp-server/SKILL.md) or [extend-mcp-server](../../skills/coding/extend-mcp-server/SKILL.md), use that skill's Phase 4 implementation brief as the source of truth for scope, constraints, and reference docs. The brief includes the approved tool list, research summary, mandatory constraints, and definition of done.

- **Phase 2 (Plan):** The planner should review the references linked in the brief — typically the [MCP development standard](../../skills/coding/build-custom-mcp-server/references/mcp-development-standard.md), [MCP testing guide](../../skills/coding/build-custom-mcp-server/references/mcp-testing-guide.md), and [TypeScript patterns](../../skills/coding/build-custom-mcp-server/references/node_mcp_server.md)
- **Phase 3 (Implement):** Follow the SDK patterns and naming conventions from the development standard
- **Phase 5 (Test):** Use the testing strategy from the testing guide
- **Working document:** Place at `docs/build-plan.md` (new MCP) or `docs/extension-plan.md` (extending) inside the project directory — this file is included in the contribution PR

### Plugins

When building plugins, reference the [build-custom-plugin](../../skills/system/build-custom-plugin/SKILL.md) skill for the full API, UI components, and constraints.

---

## Quick Reference

| Phase | Who | Action |
|-------|-----|--------|
| 1 | You | Understand user intent (don't proceed until >= 90% confident) |
| 2 | Planner subagent | Research and create staged plan; present to user for approval |
| 3 | Implementer subagent | Implement stages (fresh instance per stage) |
| 4 | Reviewer subagent | Cross-family review (mandatory, different model family) |
| 5 | You | Run tests, verify completeness, deliver to user |

---

## Checklist

- [ ] Task received and understood (>= 90% confidence)
- [ ] Models assigned (cross-family reviewer confirmed)
- [ ] Plan created and approved by user
- [ ] For each stage:
  - [ ] Implemented by implementer subagent
  - [ ] Working document updated with execution notes
  - [ ] Validation passes on modified files
- [ ] Cross-family review completed (reviewer >= 85% confidence)
- [ ] Review feedback synthesized (accepted/rejected with reasoning)
- [ ] Full validation suite passes
- [ ] Deliverable presented to user
- [ ] Follow-up actions offered