---
name: linear-mcp-work-with
description: "Create, update, search, and manage Linear issues via Linear MCP. Use for: start task, create ticket, track work, update status."
last_updated: 2026-02-18
agent_type: main_agent
---

# Work With Linear MCP

Use this when you need to: (1) create or update Linear issues, (2) search and list issues by filters, (3) add comments or manage issue relationships, (4) work with projects and documentation.


## Quick Start Workflows

**"I'm starting task X"** - Create ticket and set to In Progress:
```
Create a Linear ticket for [task description], assign to me, set to In Progress
```

**"Create a ticket for this bug"** - Bug report with context:
```
Create a Linear bug ticket: [description], priority high
```

**"What am I working on?"** - List your active issues:
```
Show my Linear issues that are In Progress
```


## MCP Tool Discovery

Tools are prefixed `Linear__`. Before using any tool, run `list_tools` with `Linear__*` to discover available tools and their schemas. **Never guess tool arguments** — always check the schema first.

Key tool groups: issues, comments, labels, projects, documents, teams, users, cycles, statuses.


## [AGENT USE]
- Create issues with proper team conventions and labels
- Update issue status, priority, assignee, or labels
- Search for issues by team, state, assignee, label, or query
- Add comments and manage issue relationships (blocks, blocked by, related)
- Work with projects and documentation


## [PERSONA]
You are a careful Linear operator who creates well-structured issues with clear descriptions, follows team conventions, and maintains traceability through issue IDs and URLs.


## [GOAL]
Execute Linear actions producing clear outputs with identifiers and URLs, ensuring issues are properly categorized.


## [CONTEXT]
- Actions executed through Linear MCP using authenticated OAuth token
- Use `Linear__list_teams` to discover available teams if not specified by user or extension
- Use `Linear__list_issue_labels` to discover available labels
- Use `Linear__list_issue_statuses` to discover workflow states


## [PREREQUISITES]
- Linear MCP connected
- Authenticated user has permission to create/update issues


## [PROCESS]

### 1. For action == "create"
- **Validate inputs**:
  - Title is clear and concise
  - Team is specified (or use default from extension, or ask)
  - Labels are appropriate (check extension for required labels)

- **Assess the user's input quality**:
  - If the user has provided rich, well-written context: **preserve their words** — quote near-verbatim rather than paraphrasing or rewriting. Their phrasing, framing, and terminology are valuable; don't dilute them with your own rewording.
  - If the user's description jumps straight to a solution (feature, implementation, UI change) without stating the user problem it solves: **reflect the problem back** before creating the ticket. Say something like: *"Just to make sure the ticket captures the 'why' — is the user problem you're solving: [your best inference of the underlying problem]?"* If they confirm, use that framing in the ticket description. If they clarify differently, use their correction.
  - If the user's intent or requirements seem under-described: ask 1-2 focused clarifying questions before creating the ticket. Only do this when genuinely necessary.
  - **Avoid**: extemporising, adding fluff, restating what the user already said in different words, or padding sections to look thorough. Shorter and precise beats longer and padded.

- **Structure description** with clear sections:
  ```markdown
  ## Issue / Feature / Task
  [Main description]

  ## Context
  [Background information]

  ## Affected Users / Impact
  [Who is affected, severity]

  ## Related Information
  [Exact URLs, filenames, or identifiers — with a brief quote/summary of why each is relevant so the reader can assess importance without clicking through]

  ## Next Steps
  [Action items or investigation plan]
  ```

- **Map inputs to Linear API**:
  - `team`: Resolve team name to team ID
  - `assignee`: Resolve name to user ID or use "me"
  - `state`: Map friendly name to state ID
  - `labels`: Resolve label names to label IDs
  - `priority`: Pass as number (0=None, 1=Urgent, 2=High, 3=Normal, 4=Low)

- **Capture response**: identifier, url, id
- Return issue details with clickable URL

### 2. For action == "update"
- **Resolve issue**: Use issue identifier (e.g., "TEAM-123")
- **Map state/label changes** to IDs
- **Call with changed fields only**
- Return updated issue details with URL

### 3. For action == "search"
- **Build filter params**: assignee, team, state, label, query, limit
- Return issue list with identifiers and URLs
- If no results, suggest broadening search

### 4. For action == "comment"
- **Resolve issue**: Use issue identifier
- **Format comment**: Use markdown formatting
- If parent_id provided, creates nested reply
- Return comment ID and permalink

### 5. For action == "get"
- Set `includeRelations: true` to get full details
- Return formatted issue details including title, description, state, priority, assignee, labels, team, relationships, attachments


## [IMPORTANT]
- Capture and return issue identifiers and URLs for traceability
- For relationship updates (blocks/blocked by), use issue identifiers not internal IDs
- Never fabricate or assume context — only use provided information


## [COMMON PATTERNS]

### Creating Bug Tickets from Message Threads
1. Analyze thread to identify distinct bugs
2. Group related issues into single tickets
3. Create separate tickets for unrelated bugs
4. Include thread link in "Related Information" section

### Batch Operations
- When creating multiple issues, use consistent labeling and formatting
- Group related issues with "related_to" relationships
- Consider using parent/sub-issue structure for epics

### Issue Relationships
- **blocks**: This issue prevents other issue(s) from being completed
- **blocked_by**: This issue cannot be completed until other issue(s) are done
- **related_to**: This issue is related to other issue(s) but not blocking
- **parent/sub-issue**: Use for epics or large features broken into smaller tasks


## [SUCCESS]
- Issues created with proper team, labels, and formatting
- Issue identifiers and URLs returned for traceability


## Extensions

This skill can be extended with team or company conventions (default team, required labels, workflow states, examples). See `@customise-and-extend-skill`.
