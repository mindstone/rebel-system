---
name: gmail-mcp-work-with
description: "Key gotchas and practical tips for using Gmail MCP, based on real usage experience"
last_updated: 2025-01-07
tools_required: '["gmail MCP"]'
dependencies: []
agent_type: main_agent
---

# Gmail MCP - Practical Tips and Gotchas

Key tips and gotchas from real usage of Gmail MCP.


## Quick Reference

| Tool ID | Purpose |
|---------|---------|
| `search_workspace_emails` | Search/list emails with query filters |
| `get_workspace_email_thread` | Get full thread conversation by thread ID |
| `send_workspace_email` | Send email or reply (use `replyToMessageId` for replies) |
| `list_workspace_drafts` / `get_workspace_draft` | Browse and inspect existing drafts |
| `create_workspace_draft` / `update_workspace_draft` | Create or edit drafts (with optional attachments) |
| `send_workspace_draft` / `delete_workspace_draft` | Send or discard a draft |
| `download_workspace_attachment` / `upload_workspace_attachment` / `delete_workspace_attachment` | Per-action attachment tools |


## See also

- [Slack-MCP-work-with.md](Slack-MCP-work-with/SKILL.md) - Slack message search patterns


## Critical limitations

### Cannot download attachments

**THE BIG ONE:** Gmail MCP **cannot download attachment files**.

**Workaround:** Generate URLs for manual access:

```
https://mail.google.com/mail/u/0/#inbox/{message_id}
```

Use the message `id` from search results as `{message_id}`.

**Example workflow:**
1. Search emails with MCP
2. Extract message IDs from results
3. Generate Gmail URLs for each message
4. Write URLs to checklist markdown for user to open manually

```markdown
- [ ] [Invoice from vendor](https://mail.google.com/mail/u/0/#inbox/18c5f3a2b4d6e789)
```


## Date format gotcha

**Format:** Must use `YYYY/MM/DD` for `after:` and `before:`

✅ **Good:** `after:2024/11/01 before:2024/11/30`  
❌ **Bad:** `after:11/01/2024` or `after:2024-11-01`


## Multiple Gmail accounts

Different Gmail MCP instances may connect to different Google Workspace accounts.

**Tip:** Make sure you're using the correct instance for the account you're searching (personal vs work vs client-specific).


## Search syntax tips

**Common operators that work well:**
- `from:sender@domain.com` - filter by sender
- `has:attachment` - only emails with attachments
- `after:2024/01/01` - date filters (use YYYY/MM/DD format)
- `subject:"exact phrase"` - subject line search
- `keyword OR otherkeyword` - combine terms

**Watch out for:**
- Email addresses are case-sensitive in practice - use exact casing
- OR must be uppercase
- Parentheses in searches may not work as expected - avoid them


## Batch processing

When building checklists from multiple email searches, use **parallel tool calls** to search multiple queries simultaneously.

**Generate all URLs in one pass:**
```python
for message in search_results:
  url = f"https://mail.google.com/mail/u/0/#inbox/{message.id}"
  checklist.append(f"- [ ] [{message.subject}]({url})")
```


## Replying to and forwarding emails

`send_workspace_email` with `reply_to_message_id` replies in the thread: it sets the threading headers for you. It does not add the earlier message to the body, so quote that yourself.

- **Reply:** Use `get_workspace_email_thread` to fetch the conversation, write your reply with the message you are answering quoted below it, then send with `send_workspace_email` using `reply_to_message_id`. Quoting is good practice, never a reason to hold back an approved reply: if you can't quote, send the reply anyway.
- **Forward:** Fetch the original message, compose body with forwarded message block, send with `send_workspace_email` (no `replyToMessageId`).

See [email-quoting skill](../email-quoting/SKILL.md) for formatting conventions: plain text `> ` quoting, HTML `<blockquote>`, forward headers, and attribution lines.


## MCP connectivity

**If Gmail MCP fails:**
- Check MCP server is running
- Verify auth tokens haven't expired
- Fall back to Superhuman or Gmail web if needed
- **Always warn user immediately** - MCP failure may block workflows

