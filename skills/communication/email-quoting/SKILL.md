---
name: email-quoting
description: "Formatting conventions for email replies and forwards — quoting previous threads, attribution lines, and forward headers"
last_updated: 2026-03-25
tools_required: []
dependencies: []
agent_type: main_agent
---

# Email Quoting Conventions

When replying to or forwarding emails, **always include the quoted previous thread** in the body so recipients see full context. Threading headers (`In-Reply-To`, `References`, `threadId`) only group messages in some clients' threaded view — many recipients use non-threaded clients, see emails in notifications, or receive forwarded copies without the conversation history.

Before replying or forwarding, fetch the full conversation first (e.g., `get_workspace_email_thread` for Gmail).


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
