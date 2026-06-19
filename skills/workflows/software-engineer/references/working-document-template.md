---
workflow: software-engineer
type: working-document
created: YYYY-MM-DD
status: planning | approved | implementing | reviewing | complete
complexity: low | medium | high
review_mode: cross-family-single
models:
  orchestrator: <model>
  planner: <model>
  implementer: <model>
  reviewer: <model>
---

# Task: <Title>

## User Intent
<!-- Capture WHY this matters, not just WHAT to build.
     Preserve the user's own words where possible. -->
- **What's needed:** <the code, tool, or system to build>
- **Why:** <the underlying goal — what problem this solves>
- **Success criteria:** <what "done well" looks like — how the user would verify it works>
- **Constraints:** <language, framework, APIs, performance, security, compatibility>
- **Out of scope:** <what we're explicitly not building>

## Current State
<!-- Keep this up to date. Subagents should read this FIRST. -->
- **Completed stages:** <list with one-line outcome each>
- **Next stage:** <number + title>
- **Open questions:** <anything unresolved>
- **Blockers:** <anything preventing progress>

## Source Inventory
<!-- APIs, libraries, patterns, and prior work discovered during research. -->

### APIs & Services
- <API/service>: <what it provides, auth method, key endpoints>

### Libraries & Dependencies
- <library>: <version, what it's used for>

### Existing Patterns
- <pattern>: <where it's used, how to follow it>

### Prior Work
- <relevant file/module>: <what it does, how it relates>

### Information Gaps
- <what's unknown>: <how to find out>

## Approach

### Stage 1: <title>
- Status: pending | in-progress | complete
- Produces: <what this stage outputs>
- Files: <files to create or modify>
- Depends on: <prior stages or external input>
- Description: <what happens>

**Implementation Notes:** (added by implementer)
- What was done: ...
- Decisions made: ...
- Deviations from plan: ...

### Stage 2: <title>
...

## Assumptions
| # | Assumption | If wrong | How to validate |
|---|-----------|----------|----------------|
| A1 | ... | ... | ... |

## Deliverables
<!-- Record every file created or modified. -->
| Deliverable | Location | Status |
|-------------|----------|--------|
| <description> | <path> | draft | complete |

## Review History
<!-- Record each review round: who reviewed, key feedback, what was accepted/rejected. -->
- <date>: <reviewer (model)> — <summary of feedback and response>

## Activity Log
<!-- Append-only log of key workflow events. -->
- <timestamp>: <event — e.g., "Plan created (3 stages). Planner confidence: 92%.">
- <timestamp>: <event — e.g., "Stage 1 implemented. Implementer confidence: 88%.">
- <timestamp>: <event — e.g., "Cross-family review complete. Accepted 2/3 issues. Reviewer at 90%.">
