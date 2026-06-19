---
description: "Project-type replit.md templates for Replit Agent. Select the template closest to the user's project and customise."
---

# replit.md Templates

Select the template closest to the user's project type. Customise the placeholders (`{{...}}`) with project-specific details. Keep the final `replit.md` under 10KB.

Every template includes the **Rebel Integration** section — this tells Replit Agent where to read tasks and write output so Rebel can retrieve results later.

---

## Simple Website

For landing pages, portfolios, marketing sites, personal blogs.

```markdown
# {{PROJECT_NAME}}

## Overview
{{ONE_SENTENCE_DESCRIPTION}}

Target audience: {{WHO_IS_THIS_FOR}}

## Design Direction
- Style: {{STYLE — e.g. "clean and minimal", "bold and colourful", "professional corporate"}}
- Responsive: must work on mobile and desktop
- {{ADDITIONAL_DESIGN_NOTES}}

## Pages
{{LIST_OF_PAGES_WITH_BRIEF_DESCRIPTIONS}}

## Content
{{KEY_CONTENT_OR_PLACEHOLDER_NOTES}}

## Technical Notes
- Use modern CSS (flexbox/grid). No heavy frameworks unless needed.
- Optimise images and assets for fast loading.
- Include proper meta tags and basic SEO.

## Rebel Integration
- Read task briefs from: `./rebel/current-task.md`
- Place deliverables and status updates in: `./rebel/output/summary.md`
- When a task is complete, write a brief summary of what was done to the output file.
```

---

## Web Application

For dashboards, internal tools, SaaS apps, productivity tools.

```markdown
# {{PROJECT_NAME}}

## Overview
{{ONE_SENTENCE_DESCRIPTION}}

Target audience: {{WHO_IS_THIS_FOR}}
Core problem solved: {{WHAT_PROBLEM_DOES_THIS_SOLVE}}

## Core Features
{{NUMBERED_LIST_OF_FEATURES — keep to 3-5 for MVP}}

## User Flow
{{DESCRIBE_THE_MAIN_USER_JOURNEY — e.g. "User signs up → sees dashboard → creates a project → invites team"}}

## Data Model
{{KEY_ENTITIES_AND_RELATIONSHIPS — e.g. "Users have many Projects. Projects have many Tasks."}}

## Technical Preferences
- {{STACK_PREFERENCES — or "Choose the best modern stack for this project"}}
- Use a clean component structure
- Handle errors gracefully with user-friendly messages
- Include basic form validation

## Rebel Integration
- Read task briefs from: `./rebel/current-task.md`
- Place deliverables and status updates in: `./rebel/output/summary.md`
- When a task is complete, write a brief summary of what was done to the output file.
```

---

## API / Backend

For REST APIs, webhook handlers, data services, integrations.

```markdown
# {{PROJECT_NAME}}

## Overview
{{ONE_SENTENCE_DESCRIPTION}}

## Endpoints
{{LIST_OF_ENDPOINTS_WITH_METHODS_AND_DESCRIPTIONS}}

Example:
- `GET /api/items` — List all items (paginated)
- `POST /api/items` — Create a new item
- `GET /api/items/:id` — Get item by ID

## Data Model
{{KEY_ENTITIES_AND_FIELDS}}

## Authentication
{{AUTH_APPROACH — e.g. "API key in header", "JWT tokens", "No auth needed for MVP"}}

## Technical Notes
- Return consistent JSON responses: `{ "ok": true, "data": ... }` for success, `{ "ok": false, "error": "..." }` for errors
- Include input validation on all endpoints
- Log errors with context (not stack traces in responses)
- Add basic rate limiting if exposed publicly

## Rebel Integration
- Read task briefs from: `./rebel/current-task.md`
- Place deliverables and status updates in: `./rebel/output/summary.md`
- When a task is complete, write a brief summary of what was done to the output file.
```

---

## Script / Automation

For data processing, scheduled jobs, one-off tools, CLI utilities.

```markdown
# {{PROJECT_NAME}}

## Overview
{{ONE_SENTENCE_DESCRIPTION}}

## What It Does
Input: {{WHAT_GOES_IN — e.g. "CSV file of customer emails"}}
Process: {{WHAT_HAPPENS — e.g. "Validates emails, deduplicates, enriches with company data"}}
Output: {{WHAT_COMES_OUT — e.g. "Clean CSV with additional columns"}}

## Requirements
{{SPECIFIC_REQUIREMENTS_OR_RULES}}

## Error Handling
- Log progress so the user knows what's happening
- If something fails, report which item failed and continue with the rest
- Save partial results rather than losing everything on error

## Rebel Integration
- Read task briefs from: `./rebel/current-task.md`
- Place deliverables and status updates in: `./rebel/output/summary.md`
- When a task is complete, write a brief summary of what was done to the output file.
```

---

## Prototype / Spike

For quick explorations, proof of concepts, testing an idea fast.

```markdown
# {{PROJECT_NAME}}

## Overview
{{ONE_SENTENCE_DESCRIPTION}}

## Goal
We're testing whether: {{HYPOTHESIS — e.g. "a simple chatbot can answer customer FAQ questions accurately"}}

## What to Build
{{MINIMAL_DESCRIPTION — speed over polish}}

## Success Criteria
We'll know this works if: {{WHAT_GOOD_LOOKS_LIKE}}

## Technical Notes
- Speed over polish — working > perfect
- Use the simplest approach that validates the idea
- Document any findings or limitations you discover
- Don't worry about edge cases unless they affect the core test

## Rebel Integration
- Read task briefs from: `./rebel/current-task.md`
- Place deliverables and status updates in: `./rebel/output/summary.md`
- When a task is complete, write a brief summary of what was done, including any findings or limitations.
```
