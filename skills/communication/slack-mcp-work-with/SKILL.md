---
name: slack-mcp-work-with
description: "Send DMs and channel posts as the authenticated user via Slack MCP; fetch messages over time ranges; optional team directory in memory spaces for accurate attribution; preview + approval required before sending."
last_updated: 2025-12-30
agent_type: main_agent
---

# Work With Slack MCP (User-Sent)

Use this when you need to: (1) post a DM to a user (with preview + approval), (2) post an announcement to a channel (supports @mentions and templates), or (3) fetch messages from a channel for a given time period. All messages are sent as the authenticated user.


## Quick Reference

| Tool ID | Purpose |
|---------|---------|
| `slack_user_list_channels` | List Slack channels |


## [AGENT USE]
- Post a direct message to a specific user, with preview and explicit approval before sending
- Post an announcement to a channel as the authenticated user, with optional templates and mentions
- Fetch messages from a channel within a time window for auditing, follow-up, or summaries


## [PERSONA]
You are a careful Slack operator. You prioritize safety (preview, explicit approval), auditability (IDs, permalinks), and correctness (resolving recipients and channels reliably). You never open new IMs unless explicitly allowed; prefer using existing IM channels.


## [GOAL]
Execute Slack actions safely and repeatably as the authenticated user, producing clear outputs with identifiers and links, and avoiding accidental or duplicate sends.


## [CONTEXT]
- Actions are executed through Slack MCP using the authenticated user’s token
- Useful actions: list users, list channels/IMs, post message as user, reply in thread, search or fetch history
- Default posture: preview before sending; send only on explicit approval; avoid opening new IMs (lookup-only)


## [PREREQUISITES]
- Slack MCP connected (see [Settings > Connectors](rebel://settings/tools))
- Authenticated user has permission to DM recipients or to post in target channels


## [INPUTS]
```yaml
action: "dm" | "channel_post" | "fetch_messages"

dm:
  recipient: "Firstname Lastname | @handle | email"   # hint for user match
  text: "..."                                        # message body
  preview: true                                       # default true; require approval
  imStrategy: "im_lookup_only"                        # do not open new IMs

channel:
  channelHint: "#channel-name | C123456"              # name or ID
  text: "..."                                        # message body
  template: "announcement" | null                     # optional formatting preset
  preview: true                                       # default true; require approval

fetch:
  channelHint: "#channel-name | C123456"              # name or ID
  after: "2025-10-01T00:00:00Z"                       # ISO (inclusive)
  before: "2025-10-31T23:59:59Z"                      # ISO (inclusive)
  limit: 500                                           # optional

teamDirectory:
  useDirectory: false                                  # if true, check for team directory first
  # The team directory is a Markdown file stored in a user's memory space
  # (not in rebel-system, which is read-only)
```


## [PROCESS]
1) Resolve IDs (users/channels)
   - **First, check for team directory**: Look for `Slack-Team-Directory.md` in the user's memory spaces (see [TEAM DIRECTORY] section)
   - If found, use it to resolve user IDs to canonical names before making attribution claims
   - Otherwise:
     - Users: list users and fuzzy match on `real_name`, `display_name`, or email; capture `userId`
     - Channels: list channels (include `public_channel`, `private_channel`, `mpim`, `im` as relevant); capture `channelId`
   - For DMs, list `im` channels and match `im.user == userId` (do not open new IMs by default)
   - **Conservative attribution**: If you cannot confidently identify a user, label them as `[User ID: U123...] (display_name)` and explicitly state uncertainty rather than guessing

2) For action == "dm"
   - Construct the message text (optionally apply lightweight template formatting)
   - Show preview for approval (recipient name + text)
   - On approval, post as the authenticated user to the existing IM `channelId`
   - Return: `ok`, `channelId`, `ts`, and `permalink` if available

3) For action == "channel_post"
   - Resolve `channelId` from `channelHint`
   - Apply optional `template: announcement` formatting (e.g., bold title, separators)
   - Show preview for approval (channel + text)
   - On approval, post as the authenticated user
   - Return: `ok`, `channelId`, `ts`, `permalink`

4) For action == "fetch_messages"
   - Resolve `channelId`
   - Prefer channel history action; if unavailable, use search with `in:#channel after:YYYY-MM-DD before:YYYY-MM-DD`
   - Return: normalized messages (user, text, ts, permalink)

5) Team directory maintenance
   - If you encounter a user ID not in the team directory, note it for potential addition
   - After completing the task, suggest updating the directory if new users were found
   - Never write to the team directory without explicit user approval


## [IMPORTANT]
- Send as the authenticated user only; preview + explicit approval required before sending
- Avoid opening new IMs unless the user explicitly asks; default `im_lookup_only`
- Do not post PII or sensitive data into public channels
- Always capture and return identifiers (`channelId`, `ts`, `permalink`) for auditability
- If Slack MCP auth is missing, produce a copy-ready message and request the user to enable auth


## [TEMPLATE]

Inputs
```yaml
action: "dm"
dm:
  recipient: "Jane Smith"
  text: "Heads-up: shipping the feature updates today. Ok to proceed?"
  preview: true
  imStrategy: "im_lookup_only"
```

Preview (example)
```markdown
To: Jane Smith

Heads-up: shipping the feature updates today. Ok to proceed?
```

Channel Announcement (example)
```yaml
action: "channel_post"
channel:
  channelHint: "#announcements"
  template: "announcement"
  text: "Product update: New feature rollout now includes documentation and quick-starts."
  preview: true
```

Fetch Messages (example)
```yaml
action: "fetch_messages"
fetch:
  channelHint: "#product"
  after: "2025-10-01T00:00:00Z"
  before: "2025-10-31T23:59:59Z"
  limit: 200
```


## [OUTPUT]
- For send actions: `ok`, `channelId`, `ts`, and optionally `permalink`
- For fetch: array of `{ userId, username, text, ts, permalink }`
- If unknown users encountered: suggest adding them to the team directory (with user approval)


## [TEAM DIRECTORY]

A team directory helps Rebel accurately identify people and channels in your Slack workspace. Without it, Rebel may misattribute messages or confuse team members with similar names.

**Where it lives**: Store as `Slack-Team-Directory.md` in `memory/topics/` within an appropriate space—ideally a shared company space if one exists, or your personal space. Do NOT create it inside `rebel-system/` or `skills/` (those are read-only).

**Standard filename**: `Slack-Team-Directory.md` (capitalised, in `memory/topics/`)

**Format**: Markdown file with YAML frontmatter:

```markdown
---
description: "Team directory for [Company] Slack workspace"
slack_workspace: "company-name"
last_updated: 2025-01-15
---

# Slack Team Directory

## Team Members

| Name | Slack ID | Role | Aliases/Notes |
|------|----------|------|---------------|
| Hannah Smith | U0A1M65FV6U | Engineering Lead | @hannah, "HS" |
| Sam Lee | U0B2N76GW7V | Product Manager | @sam |
| Sarah Johnson | U0C3O87HX8W | CEO | @sarah, usually posts in #leadership |

## Key Channels

| Channel | ID | Purpose |
|---------|-----|---------|
| #engineering | C0123456789 | Engineering team discussions |
| #announcements | C0987654321 | Company-wide announcements |
| #product | C0456789ABC | Product team and roadmap |

## User Groups

| Group | ID | Description |
|-------|-----|-------------|
| @eng | S012ABC34 | All engineers |
| @leadership | S056DEF78 | Leadership team |

## Notes

- #announcements requires @leadership approval to post
- @eng includes contractors in #eng-contractors
```

**When to suggest creating a team directory**:
- When fetching messages and attributing statements to people
- When the user asks "who said X" or needs to identify message authors
- After misidentifying someone (offer to create/update the directory to prevent future errors)
- Do NOT prompt for every simple DM or channel post

**When to suggest updating the directory**:
- When encountering a Slack user ID not in the directory
- When a user's role or status has changed
- Suggest updates passively with explicit user approval; don't prompt repeatedly

**Discovering IDs**:
- List users: Use Slack MCP's `list_users` action
- List channels: Use Slack MCP's `list_channels` action  
- IDs start with U for users, C for channels, S for usergroups

This directory is optional. The skill works without it by dynamically looking up IDs, but attribution accuracy improves significantly with a maintained directory.


## [SUCCESS]
- Messages sent only after preview and explicit approval; IDs and permalinks returned
- Channel posts follow consistent formatting; DMs target the intended recipient without opening new IMs
- Fetch returns the correct time-bounded set with permalinks for follow-up

