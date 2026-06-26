---
description: "How Rebel protects you from risky actions and what requires your explicit permission"
last_updated: "2026-06-26"
---

# Security and Tool Safety

Rebel has access to powerful tools — your files, connectors, and system settings. This page explains how Rebel keeps you safe and what actions require your explicit permission.


## The Approval System

At the centre of Rebel's safety system are your **Safety Rules** — natural language rules you write yourself. Every time Rebel is about to use a tool or write to memory, it evaluates the action against your rules. If the rules say it's OK, Rebel proceeds. If not, you get an approval prompt.

Think of Safety Rules as a personalised safety policy. You write things like "always ask before emailing external contacts" or "never modify files in the Finance folder without asking," and Rebel follows them. You can view and edit your rules in **[Settings → Privacy & Safety](rebel://settings/safety)** — they're at the top of the Privacy & Safety section.

See [Your Safety Rules](#your-own-rules-custom-safety-instructions) below for details on writing effective rules.


## When Rebel Asks for Approval

When Rebel pauses for your approval, a bar appears at the bottom of the conversation: **"Rebel paused. X action(s) need your OK"** — click **View** to open the notification drawer.

The notification drawer (the panel on the right) groups pending approvals by conversation. You can review them one at a time or use **Allow all** / **Deny all** to handle a batch. When the drawer is closed, a subtle notification pill appears to let you know approvals are waiting — it's unobtrusive but hard to miss, so nothing slips through the cracks.

### Tool approvals

When a tool action needs your OK, the approval card shows what Rebel wants to do, in plain language, with quick **Allow** and decline buttons right there. Each prompt also has a **Why?** toggle — tap it to see why Rebel is asking for this particular action. Open the request (or expand it) and you get the full set of choices:

| Option | What it means |
|--------|--------------|
| **Allow once** | Approves just this one action. Rebel will ask again next time. (In an automation, this reads **Allow this run only**.) |
| **Allow for conversation** | Approves this type of action for the rest of the current conversation. Useful when Rebel needs the same tool repeatedly — approve once and it won't interrupt you again until the conversation ends. |
| **Allow and remember…** | Approves the action *and* opens a quick choice of how broadly to remember it (see [Learning rules from approvals](#rule-learning) below). This appears when Rebel paused because of your Safety Rules. |
| **Deny once** | Declines this one action. Rebel skips it and moves on. |
| **Don't allow…** | Declines *and* lets you add a rule so similar actions are declined automatically in future. |

The reason and option descriptions use plain language — no technical jargon. You'll see clear explanations of what Rebel wants to do and why it's asking.

For memory writes the wording differs slightly — you can allow the save, allow it for the rest of the conversation, keep it private instead, or discard it — but the idea is the same. Memory writes that were paused by your Safety Rules can also show **Allow and remember…**.

The **Allow and remember…** / **Don't allow…** options appear when Rebel paused because of your Safety Rules. They won't appear for actions flagged by other checks (like automatic sensitivity detection). They're the fastest way to teach Rebel what you're comfortable with — no need to open Settings.

### What the approval card tells you

Approval cards are built to be readable at a glance, so you're making a real decision rather than rubber-stamping:

- **A plain-language reason** — what Rebel wants to do, where, and to what. For example: "Post the message 'Q3 numbers are in' to **#leadership** in Slack."
- **A blast-radius summary** — three quick read-outs: **Where** the action lands (the destination, with the full file path for file actions), **Who can see it** ("Private to you", "Shared workspace", "Company-wide", or "Public"), and **Afterwards** (whether it's easy or hard to undo). Small chips flag the things worth noticing — *Shared*, *Leaves Rebel*, *Hard to undo*.
- **A risk badge** so high-impact actions stand out.

The single fastest safety check is usually "is that the destination — or the file — I think it is?" The card is designed to answer that in a second.

### Memory write approvals (staged files)

When Rebel stages a file for your review before saving to memory:

| Option | What it means |
|--------|--------------|
| **Allow once** | Publish to the target space. |
| **Deny** | Redirect to your private memory — the content isn't lost, just kept private. |
| **Allow and remember…** | Same as above — adjust the rule that flagged it. |
| **Preview** | View the content or diff before deciding. |

### Memory write approvals (direct writes)

When Rebel asks about a direct memory write:

| Option | What it means |
|--------|--------------|
| **Save** | Write to the target space. |
| **Keep private** | Redirect to your private memory — nothing is lost. |
| **Discard** | Skip the write entirely. |
| **Preview** | View the content before deciding. |
| **Always allow this file** | Remember to always allow this specific file in future. |

After you approve or decline, a compact receipt confirms your decision — so you always have a record without the prompt staying on screen.

### Live rule updates

If you update your Safety Rules while approvals are pending, Rebel automatically re-evaluates them. Actions that now pass your updated rules auto-resolve — no need to approve them manually.


## What Never Requires Permission

Some actions are considered inherently safe and run without prompting:

- **Read-only operations** — Searching, listing, and retrieving data from connectors
- **Web search** — Looking things up online
- **Writing to temporary files** — Scratch work that doesn't touch your important data
- **Trusted tools** — Tools you've marked as always allowed in [Settings → Privacy & Safety](rebel://settings/safety) skip routine checks (with two exceptions: a few especially consequential actions like calendar changes still ask every time, and [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md) suspends trusted-tool auto-allow)
- **Built-in safe tools** — Operations that are safe by design

These skip the approval flow so you're not interrupted by routine lookups.


## Admin-Disabled Tools

If your organization uses Rebel's admin controls, workspace admins can disable specific connector tools. These tools are **hard-blocked** — they don't trigger an approval prompt, they simply can't be used. If you ask Rebel to use an admin-disabled tool, it will explain that the tool has been disabled by your organization's administrator and suggest alternatives.

Admin-disabled tools are configured centrally by your organization. You can see which tools are disabled in **Settings → Connectors** — they show a shield icon and a "Disabled" badge. See [Admin-disabled tools](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md#admin-disabled-tools) for details.


## What Requires Approval by Default

By default, these actions trigger an approval prompt — but your Safety Rules are the final authority. If you've written a rule that permits an action, Rebel follows your rules.

- **Sending emails or messages** — Outbound communication to others
- **Deleting files or data** — Especially bulk deletions
- **Bulk operations** — Actions affecting many items at once
- **Purchases or financial transactions** — If connected to such services
- **Changing your security settings** — Rebel won't lower its own guardrails without your say-so


## How Rebel Decides Whether to Ask

When Rebel is about to use a tool, a fast AI model checks the action against your Safety Rules in the background. A few things shape that decision — and they're worth understanding, because they're what keep approvals meaningful instead of constant.

**It reads the context, not just the action.** The check sees what you actually asked for — your request, and the recent back-and-forth in the conversation — not just the bare tool name. So if you say "reply to Dana and let her know I'll be late," Rebel understands that sending *that* reply is the thing you asked for. In a normal interactive conversation, clearly asking for something is itself permission for that specific action (unless one of your rules says otherwise). This is why Rebel doesn't pester you to approve the very thing you just requested.

**Automations are held to a stricter standard.** When Rebel is working unattended (an automation, or acting in a background role), your earlier messages are treated as helpful context but *not* as standing permission. Anything with real-world effects that your rules don't clearly cover gets staged for your review rather than done on a hunch. (See [Automations](library://rebel-system/help-for-humans/automations.md).)

**Actions with real-world effects clear a higher bar.** For anything that sends, posts, deletes, pays, or otherwise changes something out in the world, Rebel only proceeds if it's *confident* your rules cover the case — not merely that nothing forbids it. If it's only somewhat sure, it asks. For routine, reversible, read-only work the bar is lower, so you're not interrupted for lookups. In short: **silence is not permission for actions that have consequences** — when in doubt, Rebel asks.

**Some actions always ask, even for trusted tools.** A small set of especially consequential actions — creating or changing calendar events is the classic example — pause for your explicit OK every time, regardless of your rules or trusted tools.


## Calendar Safety

Rebel reads your calendar freely to help with meeting prep and scheduling — but **creating or modifying calendar events** always requires your explicit consent. Before Rebel adds, edits, or deletes a calendar event, it will pause and explain what it wants to do, then wait for your go-ahead.

This applies whether you're asking Rebel directly ("schedule a meeting with Alex on Thursday") or Rebel is acting on your behalf during an automation. Your calendar is read-only by default; you stay in control of what goes on it.


## App Settings and Configuration

Rebel can technically modify its own settings (stored locally on your device). However:

**CRITICAL: Rebel will only modify app settings with your explicit request and permission.**

This includes:
- API keys and model preferences
- Safety Rules and trusted tools
- Connector configurations
- Any stored preferences

Why this matters:
- Modifying settings could break Rebel's functionality
- A compromised prompt could try to lower security settings
- Changes to settings affect all future conversations

If Rebel suggests a settings change, it will explain what and why, then wait for your go-ahead.


## Protecting Against Prompt Injection

External content (emails, documents, web pages) could contain hidden instructions trying to manipulate Rebel. Rebel is designed to:

- Treat your direct requests as the primary instruction source
- Be skeptical of "instructions" found in documents or messages
- Never override its core safety rules, even if content claims to be from "the user"

If something seems off — like Rebel suddenly wanting to do something you didn't ask for — stop the conversation and start fresh.


<a id="your-own-rules-custom-safety-instructions"></a>

## Your Safety Rules

Safety Rules are the heart of Rebel's safety system. They're natural language rules you write to tell Rebel what's OK and what needs your approval. Find them at the top of **[Settings → Privacy & Safety](rebel://settings/safety)**.

### How It Works

Every time Rebel is about to use a tool or write to memory, a fast AI model evaluates the action against your Safety Rules in the background — you won't even notice the check. If the action passes your rules, Rebel proceeds. If not, you get an approval prompt.

This isn't vague guidance — your rules are the policy engine. Rebel takes them seriously.

### What Makes a Good Rule

Rules work best when they're specific and actionable. Think about the situations where you'd want Rebel to pause and check with you.

**Examples that work well:**

| Rule | What it does |
|------|-------------|
| "Always ask before emailing anyone outside our company" | Flags outbound emails to external recipients for approval |
| "Never modify files in the Finance folder without asking" | Adds caution around a sensitive area |
| "Slack messages to #general always need my approval" | Prompts before posting to a high-visibility channel |
| "Calendar invites with external attendees require approval" | Flags outbound meeting requests |
| "You can draft emails freely, but always ask before actually sending one" | Lets Rebel prepare work without firing it off |
| "Don't delete any Google Drive files without asking, even if they look like duplicates" | Prevents overzealous cleanup |

**Less effective rules:**

| Rule | Why it's less useful |
|------|---------------------|
| "Be careful" | Too vague — Rebel doesn't know what to be careful about |
| "Don't do anything dangerous" | Your default rules already handle this |
| "Ask me about everything" | Consider [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md) instead |

### Managing Your Rules

- **Version history** — Every edit is saved. You can revert to any previous version if a change doesn't work out.
- **Reset to defaults** — Start fresh with Rebel's default safety rules if you've strayed too far.
- **Chat with Rebel about your rules** — Not sure what to write? Click the chat button to discuss your safety needs with Rebel and refine your rules together.

### Tips

- **Be specific about the action or context** — mention tool names, folder paths, channels, or recipient types
- **You can have multiple rules** — write them on separate lines, like a short checklist
- **Rules are the authority** — they determine what gets approved automatically and what triggers a prompt
- **Rules apply to all conversations** — they're a global setting, not per-conversation
- **Update them as your needs change** — working on something sensitive this week? Add a temporary rule, then remove it later

### Allowing some actions but not others

A common wish is "let Rebel *prepare* things but never *pull the trigger*" — draft the email but don't send it, build the post but don't publish it. You have two ways to do this:

- **Write a rule that distinguishes the actions.** Because your rules are read in plain English, you can say "Drafting emails is fine; always ask before sending" and Rebel will treat the two differently. This is the flexible option — it keeps the helpful half and gates the risky half.
- **Turn an individual tool off entirely.** In **[Settings → Connectors](rebel://settings/tools)** you can disable a single tool within a connected app — for example, switch off "send email" while leaving "draft email" and "read email" on. A disabled tool simply can't be used; it's the firmest version of "never."

Rules are the right tool when you want nuance; turning a tool off is the right tool when you want a hard, no-exceptions boundary.

### What's personal, and what your team shares

Your Safety Rules are **yours** — they live on your device and aren't shared with or inherited from teammates. Two people on the same team can have completely different rules, and that's fine. If your organisation needs a control that applies to *everyone*, that's done a different way — an administrator can centrally switch specific tools off for the whole company (see [Admin-Disabled Tools](#admin-disabled-tools) above). For the full picture of what's shared versus personal when several people use Rebel together, see [Teams and admin controls](library://rebel-system/help-for-humans/teams-and-admin-controls.md).

<a id="rule-learning"></a>

### Learning Rules from Approvals

You don't have to write rules from scratch. The most natural way to build up your rules is from real approval prompts — when Rebel asks for permission and you want it to remember your preference.

**How it works:**

1. Rebel asks for approval on an action (e.g., "Post message to #general in Slack")
2. You click **Allow and remember…**
3. Rebel offers three ready-made options at different scopes, plus a free-text option:
   - **This only** — a narrow rule for this specific action
   - **Similar** — a broader rule covering related actions
   - **Always** — trust this tool entirely (skips approval for all its actions)
   - **Other…** — write your own custom rule
4. You pick the one that feels right
5. The rule is saved automatically

**Example:** Rebel asks before posting to Slack. You click **Allow and remember…** and see something like:

| Option | What it does |
|--------|-------------|
| **This only** | "Allow posting messages to #general in Slack" — adds a specific rule |
| **Similar** | "Allow posting messages to any Slack channel" — adds a broader rule |
| **Always** | Trusts the Slack tool entirely — no more approval prompts for any Slack action |
| **Other…** | You type a custom rule in your own words |

Pick the one that matches your comfort level. Narrower rules mean Rebel will still ask about related-but-different actions. Broader rules mean fewer interruptions but less oversight. (Declining works the same way: **Don't allow…** offers the matching **This only / Similar / Always block** scopes so you can teach Rebel what to *stop* doing.)

**Where does the rule go?**

- **This only**, **Similar**, and **Other…** add a written rule to your Safety Rules (visible in **[Settings → Privacy & Safety](rebel://settings/safety)** → **Your own rules**). You can edit or remove these at any time.
- **Always** works differently — it adds the tool to your trusted tools list (or, for memory writes, sets the space to save without asking). This is a separate setting, not a written rule.

**What happens after you update a rule:**

- Any other pending approvals that the new rule covers are checked again automatically — if the rule allows them, they're resolved without you having to click through each one
- If your rules become long or repetitive over time, Rebel can tidy them up — merging overlapping rules and removing duplicates while keeping your intent intact

**Saving rules from chat:**

You can also state a durable approval directly in the conversation — for example, "you can always read from my Notion personal-projects database without asking." If Rebel is confident the request is specific enough to act on as a rule, it saves it to your Safety Rules and shows a small toast confirming the rule was added. Broader or ambiguous statements still get treated as one-time permissions for the current turn, so accidental approvals don't leak into your global rules.


## What You Can Do

**Review before approving:**
When the approval bar appears, click View and take a moment to understand what Rebel wants to do. Each prompt shows the tool, the action, and what triggered the check.

**Start fresh if something's wrong:**
If a conversation seems compromised or Rebel is behaving strangely, close it and start a new one. Your settings and memory are preserved.

**Update your Safety Rules:**
Fine-tune what Rebel can do without asking in [Settings → Privacy & Safety](rebel://settings/safety). Your rules are the primary control.

**Review the Activity log:**
Check the Activity section in [Settings → Privacy & Safety](rebel://settings/safety) to see what Rebel evaluated and why. Safety decisions Rebel makes while running in the cloud now appear here too, tagged **Cloud** so you can tell where each check happened. If something shouldn't have been allowed, flag it with "This wasn't OK."

**Write your own rules:**
Add custom safety rules to shape when Rebel asks for permission. See [Your Safety Rules](#your-own-rules-custom-safety-instructions) above.


## Automations and Unattended Safety

When Rebel runs automations in the background, it uses the same Safety Rules system plus a staging flow. Actions that pass your rules run automatically. Actions that don't are **staged for your approval** — they appear in the notification drawer with an "Automation" badge.

See [Automations](library://rebel-system/help-for-humans/automations.md) for the full details on how safety works during unattended runs.


## See Also

- [Secrets and Passwords](library://rebel-system/help-for-humans/secrets-and-passwords.md) — How Rebel handles your credentials
- [Privacy Mode](library://rebel-system/help-for-humans/privacy-mode.md) — Extra controls for sensitive conversations
- [Automations](library://rebel-system/help-for-humans/automations.md) — Scheduling tasks and safety for unattended runs
- [Troubleshooting](library://rebel-system/help-for-humans/troubleshooting.md) — When things go wrong
