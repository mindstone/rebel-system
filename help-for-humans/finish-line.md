---
description: "Setting a Finish line — a success criterion that tells Rebel when to stop"
last_updated: "2026-05-16"
---

# Finish Line

A Finish line is a short, written criterion that tells Rebel when to consider its work done. Set one when you want Rebel to stop precisely when your goal is met — not before, not after.

---

## When to use it

- "I want Rebel to draft the email and stop, not generate five alternatives."
- "Research this topic until I have three citable sources, then stop."
- "Summarise the meeting notes and stop — no follow-up actions yet."

It's most useful when the default "this feels complete" judgment isn't precise enough for your situation. Setting a Finish line is an explicit choice, not a default — Rebel works fine without one.

---

## How Rebel uses it

The criterion becomes the dominant stop signal in Rebel's decision-making. When Rebel believes the Finish line is met, it stops — without asking for confirmation.

> **Note:** There's no "Crossed the finish line" message yet. Rebel simply stops when the criterion is met. This is expected to improve in a future release.

---

## Setting it on desktop

In the composer, click the **Flag** icon on the right side of the session controls.

- **Empty state:** outline Flag icon. Tooltip reads "Tell Rebel what finished looks like."
- **Click the icon:** an inline editor opens in the composer area.
- **Enter your criterion** (up to 500 characters), then **Save**.
- A **chip** appears above the composer showing "Finish line: {criterion}" — click it to edit again. Click the **×** on the chip to clear it.
- If you'd started typing a message but hadn't sent it yet, setting a Finish line no longer erases that draft — it stays put.

---

## Setting it on mobile

In an open conversation, tap the **Flag** icon next to the attach button.

- A sheet opens with a text field.
- Enter your criterion and tap **Save**.
- When a Finish line is set, a chip appears above the composer. Tap it to edit or clear.

---

## Setting it for Automations

In the **Automations** panel, open an automation's detail view.

- A **Finish line** field appears alongside the description editor.
- The criterion is inherited by every session this automation runs.
- Editing at the conversation level overrides the automation's default for that run specifically.

---

## Setting it via CLI or MCP

**CLI:**
```bash
rebel run -p "draft the Q3 brief" --finish-line "Brief is ready to send"
rebel chat --finish-line "Stop when 3 sources are gathered"
```

The `--finish-line` flag sets the criterion for that single run, overriding any session or automation default.

**MCP:**
```json
rebel_run_turn({ "prompt": "...", "finishLine": "Email is ready to send" })
```

---

## Precedence

When multiple Finish lines are set, the most specific one wins:

| Source | Precedence |
|---|---|
| Per-turn override (CLI / MCP) | Highest — applies to this run only |
| Session-level (composer) | Overrides automation defaults |
| Automation default | Used if no session-level criterion is set |

**Example:** You set an automation's default Finish line to "Three sources gathered." Later, during one specific conversation, you set a session-level criterion of "Five sources gathered." That conversation uses the session-level value. Other sessions from the same automation still use the automation's default.

---

## What happens when it's met

Rebel stops. It doesn't send a special confirmation yet — it simply ends the turn. If it overshot or undershot, you can continue the conversation and clarify.

Future releases will surface an explicit "Crossed the finish line" message when Rebel stops on this criterion.
