---
description: "What to do when Rebel does something wrong: stopping, editing, diagnosing, and getting help"
---

# When AI Goes Wrong

What to do when Rebel does something unexpected or makes unwanted changes.


## See also

- [troubleshooting.md](library://rebel-system/help-for-humans/troubleshooting.md) — Common problems and solutions
- [diagnostics-logging.md](library://rebel-system/help-for-humans/diagnostics-logging.md) — Diagnostic bundles and what to review before sharing


## Step 1: Stop If Still Running

If Rebel is still working on something and you see it going wrong:

- **Press Escape** or click the stop button to interrupt the current action
- This prevents further unwanted changes while you figure out next steps


## Step 2: Ask Rebel to Reverse

The simplest fix: just tell Rebel what went wrong.

> "That's not what I wanted. Please undo those changes and instead..."

> "Revert what you just did to the email draft."

Rebel can often fix its own mistakes when you explain what went wrong.


## Step 3: Edit Your Message and Try Again

If you want to start fresh from a specific point:

1. Find your last message in the conversation
2. Click the **edit icon** (pencil) that appears on hover, or press **⌘/Ctrl+↑** when the composer is empty
3. Modify your instructions to be clearer
4. Send the edited message

**Important**: Editing removes Rebel's response and everything after it, then reruns with your updated message. This doesn't automatically undo any real-world actions Rebel already took (like sent emails or file changes). You'll need to ask Rebel to reverse those separately.


## Step 4: Diagnose the Conversation

If the problem keeps happening or you can't figure out what went wrong, ask Rebel to help diagnose:

1. Right-click the conversation in the sidebar (or click the three-dot menu)
2. Select **Diagnose Conversation**
3. Optionally describe what went wrong
4. Rebel will analyze the session and help identify the issue

This is the best first step when behavior is confusing or seems to repeat despite your corrections. Rebel can often spot what went wrong and suggest how to fix it.


## Step 5: Report to Support

If Rebel seriously misbehaved and local diagnosis didn't help:

- **Ask Rebel** — just say "report a bug" or "submit feedback" in the chat and Rebel can open the form for you, pre-filled with context from your conversation.
- **Or directly** — [Report a Bug](rebel://feedback/bug) or click the **help icon** (?) in the app, then **Feedback & Bugs**.

Diagnostic information is included automatically with your report to help the team investigate.


## What Rebel Cannot Undo

Rebel doesn't have automatic checkpoints or version control built in. It can't magically revert file changes—when you ask it to undo something, it's making new edits to reverse what it did, not restoring a saved snapshot.

Some actions are harder to reverse than others:

| Can ask Rebel to reverse | May need manual intervention |
|--------------------------|------------------------------|
| Draft changes | Sent emails |
| File edits (if still in session) | Calendar invites already sent |
| Scratchpad content | Messages posted to Slack/Teams |
| Memory updates | External API calls |

For irreversible actions, Rebel's safety checks should have asked for confirmation first. If an action happened without approval that should have required it, that's worth reporting.


## Recovering Files from Cloud Storage

If your Space is stored on a cloud drive (Google Drive, Dropbox, OneDrive, iCloud, or Box), you have a backup option: **cloud version history**.

Most cloud storage providers automatically save previous versions of your files. Check **Settings → Workspace → Spaces** to see which cloud service your Space uses (shown as an icon next to each Space).

If Rebel made unwanted changes to files and you need to restore them:

> "My Space is on [Google Drive / Dropbox / OneDrive]. Can you walk me through how to use version history to restore a file to how it was before?"

Rebel can search for the specific steps for your cloud provider and guide you through the recovery process.

**Typical version history retention:**
- **Google Drive**: 30 days (or 100 versions)
- **Dropbox**: 30–365 days depending on plan
- **OneDrive**: 25 versions for 30 days (personal), varies for business
- **iCloud**: 30 days
- **Box**: Varies by plan
