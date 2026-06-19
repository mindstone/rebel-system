---
name: rebel-browser-install
description: "Fallback guidance for installing the Rebel Browser extension. The primary setup path is the deterministic rebel_bridge_prepare_install tool."
use_cases:
  - "install Rebel Browser"
  - "set up Rebel Browser extension"
  - "connect Rebel Browser"
  - "Rebel Browser extension setup"
last_updated: 2026-04-25
tools_required:
  - rebel_bridge_prepare_install
  - rebel_bridge_diagnose
  - rebel_browser_status
agent_type: main_agent
---

# Rebel Browser Install

[GOAL]

Install the Rebel Browser extension into the user's Chromium-based browser using the deterministic setup tool. A successful setup ends with `rebel_browser_status({})` reporting the extension connected, and with the user seeing one concrete example of what they can now do.

[PRIMARY PATH]

1. Say one short sentence explaining that Rebel Browser is a small extension that lets Rebel read and act on open tabs.
2. Call `rebel_bridge_prepare_install({})` immediately.
3. If it returns `setupStatus: "needs_browser_choice"`, ask the user which browser to use from `data.browserChoices`, then call `rebel_bridge_prepare_install({ browser_id: "<chosen id>" })`.
4. If it returns `setupStatus: "awaiting_user_handoff"` or `"degraded"`, use `data.nextStep` and `data.steps` to guide the user through the browser handoff:
   - enable Developer Mode on the extensions page if needed;
   - load or reload the revealed Rebel Browser extension folder;
   - reply once the Rebel icon appears or if something looks wrong.
5. If the tool returns `ok: false`, read `userMessage`, offer `instructions`, and stop unless the user asks to retry.
6. After the user says it is loaded, call `rebel_browser_status({})` once.
7. On success, say it is connected and offer one useful example: summarise the current page, fill a form, extract key details, or compare tabs.
8. On failure, call `rebel_bridge_diagnose` with the browser id and install session alias if `prepare_install` returned one, then translate the result into one plain next step.

[IMPORTANT]

- Use `browser_id` when calling `rebel_bridge_prepare_install`; `browserId` is legacy compatibility only.
- Do not expose raw file paths, tokens, stack traces, or internal route details in visible prose.
- Do not claim the extension is installed when `prepare_install` only reports `awaiting_user_handoff`; the browser still needs the user's manual load/reload step.
- The old code-based pairing flow is obsolete. Do not generate a security code, wait for pair events, or follow older notes that describe that flow.
- Keep the user-facing wording short, calm, and practical. No emoji. No exclamation points.
- Lower-level tools are for diagnostics/manual recovery. The primary setup path is `rebel_bridge_prepare_install`.
