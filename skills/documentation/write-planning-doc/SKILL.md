---
name: write-planning-doc
description: "Creates structured planning documents for projects and initiatives, breaking down complex work into stages with clear actions and validation points."
last_updated: 2025-10-26
agent_type: main_agent
output_shape:
  default_surface: file_artifact
  chat_contract: decision_brief
  artifact_expected: true
  max_chat_words: 200
  source_policy: artifact_sources
---

# Planning Document Guide

This is a guide for writing planning/project management `.md` files for any type of project or initiative. These are for thinking through & documenting decisions, breaking down complex projects into multiple stages, and tracking progress.

Store planning docs in the relevant space’s `memory/planning/` folder (for example `personal/memory/planning/`, `work/[COMPANY-NAME]/solo/memory/planning/`, or `Chief-of-Staff/memory/planning/` for cross-space/meta planning).

Aim to keep these concise, but emphasise & clearly capture all the decisions, responses, and requirements from the user.

If you're starting the doc from scratch:
- Run `date +"%y%m%d"` to get the current date for naming the file
- Ask the user questions about their project requirements to clarify key decisions
- See [sounding-board-mode](../../thinking/sounding-board-mode/SKILL.md) for guidance on effective discovery conversations

See also: [write-help-evergreen-doc](../write-help-evergreen-doc/SKILL.md) for instructions on writing evergreen docs


## File naming conventions

Planning docs should follow this naming format: `yyMMdd[letter]_description_in_normal_case.md`

- Date prefix: `yyMMdd` format (e.g., `250526` for 26 May 2025)
- Auto-incrementing letter: append a letter (a, b, c...) based on creation order within the same day
  - First doc created on a given day gets `a`
  - Second doc gets `b`, and so on
  - This ensures files sort alphanumerically by creation date
  - Sometimes we might end up with multiple docs with the same day and letter - don't worry if this happens
- Description: Use lowercase words separated by underscores
  - Exception: Keep proper capitalisation for acronyms like `ToC` (Table of Contents)
  - Example: `250526a_customer_onboarding_workflow.md`

Update this doc regularly to keep the actions up-to-date. When you change it, make minimal, focused changes, based on new user input.


## Document structure

Don't include a `Date` section at the top since it's implicit from the filename.


### Goal, context

- Clear problem/goal statement(s) at top, plus enough context/background to pick up where we left off
- If the goal is complex, break things down in detail about the desired behaviour.


### References

- Mention relevant background docs (from `memory/`), other planning docs (from this space’s `memory/planning/`), files, links, stakeholders, or anything else that could provide context
- Try and be fairly precise and comprehensive (e.g. the specific documents/sections/people)
- Provide a brief 1-sentence summary for each of what it's about/why it's relevant
- Roughly prioritise most important/relevant/useful references at the top


### Principles, key decisions

- Include any specific principles/approaches or decisions that have been explicitly agreed with the user (over and above existing project rules, examples, best practices, etc).
- As you get new information from the user, update this doc so it's always up-to-date.
- If there are any surprises/issues, stop immediately, and discuss with the user before proceeding.


### Stages & actions

Overall approach:
- Break into lots of stages. Start with a really simple working v1, and gradually layer in complexity, ending each stage with validated outputs.
- List stages and actions in the order that they should be tackled
- Don't number the stages, so that it's easier to move them around without having to renumber everything
- Use `[ ]` and `[x]` checkboxes to indicate todo/done
- Include subtasks with clear acceptance criteria
- Refer to specific docs, files, examples, links, stakeholders, etc, so it's clear exactly what needs to be done
- If there are actions that the user needs to do, add those in too, so we can track progress and remind the user
- Add actions to stop & review with user where appropriate, e.g. when we get to a good stopping point, to validate outputs, get stakeholder feedback, etc
- Add actions to search the web where appropriate, e.g. for research, determining best practices, finding examples, etc
- Add actions to update relevant evergreen docs (see [write-help-evergreen-doc](../write-help-evergreen-doc/SKILL.md))
- If you think we need a new evergreen doc, ask the user
- Explicitly say to use subagents for encapsulated tasks or where the task will create a lot of verbose content, e.g. research, data analysis, etc
- Try to surface potential risks early. For example, if the whole plan depends on getting stakeholder approval or accessing certain data, validate that early
- Try to organise the stages so that we frontload the business value, so that we could stop partway and still have delivered something useful

Upfront preparatory actions:
- Gather any necessary background materials, data, or context before starting
- Identify key stakeholders and decision-makers early

Early stages:
- Add actions to search the web for research where appropriate, e.g. determining best practices, finding examples, understanding the landscape
- Add actions to validate key assumptions or dependencies that the project relies on

After creating the initial planning doc:
- **External review stage**: Get feedback on the planning approach
  - Share the initial planning doc with relevant stakeholders, domain experts, or advisors
  - Update planning doc with feedback and revisions
  - Save the revised version

At the end of stage (where appropriate):
- **Add validation/quality checks** - Ask the user what validation is appropriate for this type of work. Examples might include:
  - **Stakeholder review**: Getting sign-off from key decision-makers
  - **Quality review**: Checking outputs meet standards or requirements
  - **Data validation**: Verifying accuracy and completeness of data or analysis
  - **Compliance check**: Ensuring adherence to policies, regulations, or guidelines
  - **User testing**: Getting feedback from end users or test groups
  - **Budget check**: Confirming we're on track financially
  - Use judgment about which checks are appropriate based on the specific project and stage
- Update this planning doc with progress so far, log useful learnings/surprises/changes of plan/etc
- Add an action to stop & review with user where appropriate, e.g. when we get to a good stopping point
- Save/document the current state appropriately

In later stages:
- Add actions to update relevant evergreen docs (see [write-help-evergreen-doc](../write-help-evergreen-doc/SKILL.md)). If you think we need a new evergreen doc, ask the user
- Add actions to update any ongoing documentation, handbooks, or process docs as needed

As final actions:
- **Final validation** - Ask the user what final checks are needed before considering this complete. Examples might include:
  - Final stakeholder sign-off
  - Quality assurance review
  - Documentation completeness check
  - Handover preparation (if applicable)
  - Success criteria verification
- **Cleanup and documentation** - Ensure everything is properly documented and organized:
  - Update any relevant evergreen docs
  - Archive or organize working files
  - Create handover materials if needed
- Move the planning doc to an appropriate archive location in this space (e.g. `memory/planning/finished/`)

Example stages & action (no need to include the words `TODO` or `DONE` explicitly, since the `[ ]` todo-checkboxes capture that):

```
### Stage: High-level description of this stage
- [ ] This is a top-level action
  - [ ] It can have sub-actions that get ticked off
    - You can add bulletpoint notes with extra detail/context to help plan & shape future actions

### ✅ This stage has already been completed
  - ✅ This action has already been completed
    - 📔 You could journal about useful/unexpected discoveries when you update progress on completed tasks
  - ❌ This action has failed/been skipped
```

# Appendix

Add any other important context here, e.g.
- Summary of research findings
- Example data or case studies
- Relevant quotes or references
- Rich background and context, especially from conversations/decisions with stakeholders
- Alternative approaches that were considered but discarded - describe the criteria, tradeoffs, and the rationale for the chosen approach
- Supporting materials, calculations, or analysis
- Other information that should be captured but didn't fit neatly in the above sections

