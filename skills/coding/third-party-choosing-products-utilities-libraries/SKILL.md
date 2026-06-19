---
name: third-party-choosing-products-utilities-libraries
description: "Structured process for evaluating and selecting third-party libraries, utilities, and products based on community longevity, API design quality, and project-specific criteria."
last_updated: 2026-04-05
agent_type: main_agent
---

# Third-Party Library Selection

## Selection Criteria

- **IMPORTANT** Long-lasting community, lots of help/discussion/examples (so there will be lots of pretraining data to help LLM coding models)
- Robust
- Well-designed API: Intuitive, composable, type-safe (for TypeScript)
- **Prefer platform built-ins over thin wrappers**: Use Node.js standard library (`child_process`, `fs`, `crypto`, `http`, etc.) unless the third-party package provides substantial value beyond convenience. Thin wrappers add transitive dependency risk (ESM-only breakage, supply chain, version churn) for marginal ergonomic gain. Also check that the package and its transitive dependency tree are compatible with the project's module system (CJS/ESM) and tooling (bundlers, tsx, Vitest, etc.).
- Plus any other criteria from the user


## Process
- Understand requirements first. see [`sounding-board-mode.md`](thinking/sounding-board-mode/SKILL.md). Ask questions if you need to clarify
- Read relevant code/docs to understand the relevant technology stack & architecture for this project
- Search the web. Evaluate options, tradeoffs
- Make a recommendation
- Discuss with user
- Write a doc describing the chosen library, as per `WRITE_DEEP_DIVE_DOC.md`

