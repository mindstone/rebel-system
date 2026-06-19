---
name: tasks-subagents
description: "Guidelines for effective use of subagents and task lists to manage context windows, parallelize work, and handle encapsulated sub-tasks."
last_updated: 2025-12-23
tools_required: []
agent_type: either
dependencies: []
---

# Context Window, Tasks, and Subagents

Use subagents where appropriate:
- They are especially valuable as a way to avoid filling up your context window
- They are also a good fit for encapsulated & well-defined tasks, i.e. tasks that don't need the full context of the conversation so far, and/or where we only need a summary of what was done in order to proceed
- Use subagents in parallel where possible (because this is faster), but only if there isn't a dependency between tasks (e.g. the output of this one is useful as input for the next)
- Give them lots of background so that they can make good decisions, e.g. about goals, point them to relevant help/code, what we've been changing, gotchas & things to avoid, relevant environment variables like $PORT for browser automation, using your test framework, the current date/time from `date`, and anything else that will help them to be effective but correct/careful.
- Tell subagents what to be cautious of, and to abort and provide feedback on what happened if there are problems or surprises (to avoid them going rogue and doing more harm than good)
- **Specify what output you need returned** — be explicit about what data/results the subagent should include in its final response. The subagent should return the ACTUAL DATA, not just a description of what they found or how they found it.

**Subagent output quality — good vs bad examples:**

❌ **BAD subagent output (metadata only):**
```
I used the Gmail API to search for emails matching your criteria. I found 3 results 
from the last week. The search was successful and I was able to read all emails.
Sources: gmail_search_emails, gmail_read_email
```

✅ **GOOD subagent output (actual deliverable):**
```
Here are the 3 emails matching your criteria:

1. **Subject:** Q4 Budget Review
   **From:** sarah@company.com
   **Date:** Dec 20, 2025
   **Summary:** Requesting approval for revised Q4 marketing budget of $50k...

2. **Subject:** Client Meeting Follow-up
   **From:** john@client.com  
   **Date:** Dec 19, 2025
   **Summary:** Thanks for the meeting, attached is the signed contract...

3. [...]

Sources used: Gmail API (gmail_search_emails, gmail_read_email)
```

The key difference: GOOD output delivers the actual content the main agent needs to complete the task. BAD output only describes the work that was done.

Use the task/todo list when you have more than a small number of things to track, or where ordering matters, or if you think it will help.

