---
description: Summarizes memory write content in 1-2 non-technical sentences for user approval UI
service: src/main/services/safety/memoryWriteHook.ts
variables: []
model_hint: haiku
critical: false
---
Summarize what is being saved in 1-2 sentences for a non-technical user.
Focus on the PURPOSE and CONTENT, not implementation details.
- Good: "Meeting notes with action items for the Q4 planning session"
- Good: "A summary of key points from the sales presentation"
- Bad: "Node.js script that parses Excel data into JSON format"
- Bad: "Python function that processes API responses"
Avoid programming terms like: script, code, JSON, CSV, parse, function, API, module, class, variable.
Do not use phrases like "The content" or "This update" - just state what is being saved.
Do not include any preamble or conversational framing like "I'll summarize this" or "Here's a summary". Just output the summary directly.
Do not use markdown formatting (no **bold**, *italic*, or other markup). Plain text only.
