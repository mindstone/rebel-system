---
description: "Step-by-step visual guide for finding SSH details in Replit's UI — tells Rebel exactly what the user will see at each step"
---

# Replit SSH Setup — Visual Guide

This reference describes the exact Replit UI screens a user navigates when setting up SSH. Use these descriptions to give the user precise, confident directions. Screenshots are in `screenshots/` for developer reference.

**Displaying screenshots to users:** Use workspace-relative paths in Markdown images. These render inline in Rebel conversations.

Screenshots:
- `screenshots/01-search-ssh.png` — Searching "ssh" in project settings
- `screenshots/02-ssh-connect-keys.png` — SSH section showing Connect and Keys
- `screenshots/03-ssh-connect-manually.png` — The Connect page with the shell command
- `screenshots/04-account-ssh-keys.png` — Account Settings > SSH Keys page

To show a screenshot to the user, use:
```
![Search for SSH](rebel-system/skills/coding/replit-project-manager/references/screenshots/01-search-ssh.png)
```


## Finding the SSH Command (for connecting to a project)

The user needs to get the SSH command from their Replit project. Here's exactly what they'll see:

### Step 1: Open the project settings
In the Replit project editor, there's a search/command bar at the top of the left panel. Tell the user:
> Type **ssh** in the search bar at the top of the left panel.

They'll see a result under **Advanced > Developer** labelled **SSH** with a terminal icon.

### Step 2: Click SSH
After clicking SSH, they see two options:
- **Connect** (lightning bolt icon) — this is where the command is
- **Keys** (key icon) — this is for project-level keys, NOT what they need for account-wide setup

Tell the user:
> Click **Connect**

### Step 3: Copy the shell command
The Connect page shows three sections:
- "Connect to VS Code" — not relevant
- "Connect to Cursor" — not relevant  
- **"Connect manually"** — this is the one they need

Under "Connect manually" it says "Use the command below to connect via CLI or another IDE" and shows:

```
Shell command
ssh -i ~/.ssh/replit -p 22 <uuid>@<uuid>-<hash>.<subdomain>.replit.dev
```

Tell the user:
> Under **"Connect manually"** at the bottom, copy the **Shell command** that starts with `ssh -i`

**Important parsing note for Rebel:** The command format is `ssh -i <key> -p <port> <user>@<host>`. Parse both:
- **user**: the UUID before the `@` sign (e.g., `e8466636-7adf-4f46-9904-a0c8abf47828`)
- **host**: everything after `@` ending in `.replit.dev` (e.g., `e8466636-...-d2w3zi895p1s.spock.replit.dev`)

Both are required for the MCP tools. The subdomain (e.g., `spock`, `riker`) rotates when the project restarts.


## Adding SSH Key to Replit Account (one-time setup)

The user needs to register their public key with Replit. This is in a completely different place from the project SSH settings.

### Where to go
Tell the user:
> Go to [replit.com/account#ssh-keys](https://replit.com/account#ssh-keys)
> 
> Or: click your profile picture (top left) → **Account** → scroll down to **SSH Keys**

### What they'll see
The SSH Keys section shows:
- A heading "SSH Keys"
- A blue **+ Add SSH key** button
- Text: "Authorized keys for SSH access to Apps owned by you."
- A list of any previously added keys (may be empty)

### What to do
Tell the user:
1. Click the blue **+ Add SSH key** button
2. Paste the public key that Rebel provided
3. Click **Save** (or the confirmation button)

**Key format note:** The public key should look like:
```
ssh-ed25519 AAAAC3NzaC1l... some-comment
```
It must have three parts separated by spaces: algorithm, key data, and comment.


## Common Confusion Points

1. **Project SSH Keys vs Account SSH Keys**: The "Keys" option inside a project (Step 2 above) is for project-specific SSH keys. For Rebel to connect to ANY project, the key must be added at the ACCOUNT level (replit.com/account#ssh-keys).

2. **The `-i ~/.ssh/replit` in the command**: Replit's default command references `~/.ssh/replit` but Rebel uses its own key path. The user doesn't need to worry about this — Rebel uses the key configured in their SSH config.

3. **"Connect to VS Code" / "Connect to Cursor"**: These one-click options auto-configure SSH for those editors. They're not relevant for Rebel — Rebel uses the manual connection method.

4. **Replit Core plan**: SSH access requires a Replit Core (paid) plan. If the key is registered but connection still fails, this may be the reason.
