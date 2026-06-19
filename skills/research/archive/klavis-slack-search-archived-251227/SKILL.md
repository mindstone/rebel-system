---
name: klavis-slack-search-archived-251227
description: "Guide for efficiently searching Slack messages using correct query patterns, with working and non-working search syntax examples."
last_updated: 2025-10-26
agent_type: either
dependencies: []
---

[GOAL]
To efficiently search Slack messages using the correct query patterns

[PROCESS]
1. Identify search parameters: user, channel, timeframe, keywords
2. Build query using patterns that work (see below)
3. Execute search sorted by timestamp descending
4. Refine if needed using alternative approaches

[PATTERNS THAT WORK]
- Day names: on:friday, on:yesterday, on:today
- Users: from:username
- Channels: in:channel-name
- Combined: from:username in:channel-name
- Exact phrases: "specific phrase"
- Date ranges: after:2024-11-01 before:2024-11-30

[PATTERNS THAT DON'T WORK]
- Specific dates: on:2024-11-29
- Time qualifiers: before:12pm
- Relative dates: after:-7d

[IMPORTANT]
- Use day names not specific dates
- Combine filters for precision
- Always sort by timestamp descending