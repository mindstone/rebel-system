---
description: "What Rebel knows about you, what it uses that information for, and where to update it"
last_updated: "2026-04-16"
---

# What Rebel knows about you

Rebel does not need your autobiography. It does need a few practical details so it can address you properly, show the right times, and know where your files live.

## The basics Rebel may use

- **Your name** — for your profile and a more natural experience across the app
- **Your email address** — for your account and connected services
- **Your timezone** — so meetings, reminders, and scheduling do not become interpretive art
- **Your workspace location** — so Rebel knows where your spaces, files, and memory live

## How to update it

### Name and email

Open **Settings → Account & Preferences → Profile** to review and update your profile details.

### Timezone

Rebel usually follows your device timezone and, when relevant, the timezone information from your connected calendars.

If times look wrong:
1. Check your computer's timezone first
2. If the problem is calendar-specific, reconnect that calendar in **Settings → Connectors**

### Workspace location

Open **Settings → Workspace** to review workspace-related settings.

If you move your workspace or want to confirm where Rebel is looking, this is the place.

## Template variables

Some Rebel skills and templates use `{COMPANY_NAME}`. It is not a global "who employs me?" field. It means **the organisation whose data the skill is operating on**.

Resolution rule:

1. **If the skill is invoked inside a tool call targeting a specific space and that space's `organisation` is set in `<spaces_available>`** → use that organisation's display name.
2. **Else if the current Chief-of-Staff context has a single `<spaces_available>` org-grouping that covers the active topic** → use that organisation.
3. **Else** → Rebel should ask: "Which organisation should I use for this — <available organisations>?" It should not infer silently from paths, file contents, or recent message history.

## Good to know

- Your connector passwords are not stored in your workspace files
- Rebel keeps app settings and connector sign-ins separate from your workspace documents
- If something about your profile or timing looks off, updating the source setting usually fixes it everywhere

## See also

- [Settings and configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — where profile, workspace, and advanced settings live
- [Where Rebel stores things](library://rebel-system/help-for-humans/where-rebel-stores-things.md) — workspace vs app data in plain English
- [Secrets and passwords](library://rebel-system/help-for-humans/secrets-and-passwords.md) — where sign-ins and access codes are kept
