---
name: email-quoting
description: "Formatting conventions for email replies and forwards — quoting previous threads, attribution lines, and forward headers"
last_updated: 2026-03-25
tools_required: []
dependencies: []
agent_type: main_agent
---

# Email Quoting Conventions

Every connected mail account can reply in a thread: Gmail's `send_workspace_email` with `reply_to_message_id`, Outlook's `reply_to_email`, and other mail tools' reply-to-message field. Use that route for every reply.

Below your reply, quote the message you are answering, so recipients who read outside a threaded view (non-threaded clients, notifications) still see what you are replying to. Outlook's `reply_to_email` adds the quote itself: there, write only your reply. For Gmail and other mail tools, fetch the conversation first (e.g. `get_workspace_email_thread`) and quote as below.

**Quoting is good practice, never a reason to hold back a reply.** Once the user has approved a reply, send it. If you can't quote the earlier message, send the reply without the quote. If the tool warns that threading failed, tell the user. A forward always includes the original message, since that is its content.


## Reply formatting

### Plain text
```
Your new reply content here.

On Mon, Jan 6, 2026 at 10:00 AM, Alice <alice@example.com> wrote:
> Original message line 1
> Original message line 2
```

### HTML
```html
<p>Your new reply content here.</p>
<br>
<div>On Mon, Jan 6, 2026 at 10:00 AM, Alice &lt;alice@example.com&gt; wrote:</div>
<blockquote style="margin:0 0 0 0.8ex;border-left:1px solid #ccc;padding-left:1ex">
Original message line 1<br>
Original message line 2
</blockquote>
```


## Forward formatting

```
Your message about why you're forwarding.

---------- Forwarded message ----------
From: Alice <alice@example.com>
Date: Mon, Jan 6, 2026
Subject: Meeting Tomorrow
To: You <you@example.com>

Original message body here.
```


## Key rules

- Always include an attribution line before quoted content (`On DATE, SENDER wrote:`)
- For multi-message threads, quote messages in reverse chronological order (most recent first)
- Preserve the original formatting as closely as possible
- For HTML emails, use `<blockquote>` with conventional styling
