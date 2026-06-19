---
workflow: showrunner
type: working-document
created: YYYY-MM-DD
status: planning | in-review | approved | executing | complete
complexity: low | medium | high
review_mode: cross-check | triple | full
models:
  orchestrator: <model>
  planner: <model>
  implementer: <model>
  reviewers: [<model>, ...]
  forager: <model>
lenses: [<lens>, ...]
sources_used: []
deliverables_produced: []
---

# Task: <Title>

## User Intent
<!-- Capture WHY this matters, not just WHAT to do.
     Preserve the user's own words where possible. -->
- **What's needed:** <the deliverable or outcome>
- **Why:** <the underlying goal — what problem this solves>
- **Audience:** <who will read/receive this>
- **Success criteria:** <what "done well" looks like>
- **Constraints:** <tone, format, length, deadline, sensitivity>
- **Out of scope:** <what we're explicitly not doing>

## Current State
<!-- Keep this up to date. Subagents should read this FIRST. -->
- **Completed stages:** <list with one-line outcome each>
- **Next stage:** <number + title>
- **Open questions:** <anything unresolved>
- **Blockers:** <anything preventing progress>

## Source Inventory
<!-- What's available, what was found, what's missing.
     Update sources_used in frontmatter as sources are consumed. -->

### Connected Tools
- <MCP/tool>: <what it provides for this task>

### Memories & Prior Work
- <relevant memory or conversation>: <what it contains>

### Documents & Files
- <file>: <what it contains>

### Information Gaps
- <what's missing>: <where to look or ask>

## Approach

### Stage 1: <title>
- Status: pending | in-progress | complete
- Produces: <what this stage outputs>
- Sources/tools: <what it uses>
- Depends on: <prior stages or user input>
- Description: <what happens>

**Execution Notes:** (added by implementer)
- What was done: ...
- Decisions made: ...
- Deviations from plan: ...

### Stage 2: <title>
...

## Assumptions
| # | Assumption | If wrong | How to check |
|---|-----------|----------|-------------|
| A1 | ... | ... | ... |

## Deliverables
<!-- Update deliverables_produced in frontmatter as files are created.
     Record every file created or modified, and every action taken. -->
| Deliverable | Location | Status |
|-------------|----------|--------|
| <description> | <path or "sent via MCP"> | draft | final | sent |

## Review History
<!-- Record each review round: who reviewed, key feedback, what was accepted/rejected. -->
- <date>: <reviewer (model)> — <summary of feedback and response>

## Activity Log
<!-- Append-only log of key workflow events. Keeps a readable timeline
     without requiring subagents to parse structured log lines. -->
- <timestamp>: <event — e.g., "Source discovery complete. 4 sources found, 2 gaps identified.">
- <timestamp>: <event — e.g., "Plan created (5 stages). Planner confidence: 90%.">
- <timestamp>: <event — e.g., "Stage 1 executed. Implementer confidence: 85%.">
- <timestamp>: <event — e.g., "Triple review complete. Accepted 3/5 suggestions. All reviewers >= 85%.">
