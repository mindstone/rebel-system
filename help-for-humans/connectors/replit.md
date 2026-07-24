---
description: "Connect Replit to build hosted websites and apps — Rebel manages the project, Replit Agent does the coding"
---

# Replit (SSH)

Build hosted websites, apps, and tools on Replit — without writing code yourself. Just describe what you want, and Rebel prepares the instructions for Replit Agent to build it.

**Desktop app only.** The Replit connector requires the desktop version of Rebel.

> **Which Replit connector?** This doc covers the SSH connector (file access inside a running project). If you want Replit Agent to *build* apps for you — no SSH keys, works on the free plan — use the official [Replit](library://rebel-system/help-for-humans/connectors/replit-official.md) connector instead.


## Setup

You need to do two things once: generate an SSH key in Rebel, and add it to your Replit account.

### 1. Generate your SSH key

Ask Rebel: **"Set up Replit SSH"**

Rebel generates a key and gives you a block of text to copy. It looks like:
```
ssh-ed25519 AAAAC3NzaC1l... rebel-replit
```

### 2. Add the key to your Replit account

1. Go to [replit.com/account#ssh-keys](https://replit.com/account#ssh-keys). (Or: profile picture → **Account** → scroll down to **SSH Keys**.)
2. Click the blue **+ Add SSH key** button
3. Paste the key Rebel gave you
4. Click **Save**

This key works for all your Replit projects. You only do this once.

> SSH access requires a Replit Core (paid) plan.


## Connecting to a Project

When you want Rebel to work with a Replit project, it needs the project's connection details:

1. **Open your project** at replit.com
2. In the left panel, type **ssh** in the search bar → click **SSH** (under Advanced > Developer)
3. Click **Connect** (lightning bolt icon)
4. Scroll to **"Connect manually"** and copy the **Shell command**. It looks like:
   ```
   ssh -i ~/.ssh/replit -p 22 user@abc123-def456.riker.replit.dev
   ```
5. Paste the whole command into your Rebel chat. Rebel extracts what it needs.


## Troubleshooting

| Error | Fix |
|-------|-----|
| "SSH key not found" | Ask Rebel to "set up Replit SSH" |
| "Your Replit project appears to be sleeping" | Open the project at replit.com to wake it up, then retry |
| "SSH key is not registered" or "authentication failed — key not accepted" | Go to [replit.com/account#ssh-keys](https://replit.com/account#ssh-keys) and make sure Rebel's key is listed. If not, ask Rebel to "set up Replit SSH" and add the new key. SSH also requires a Replit Core (paid) plan. |
| "Cannot resolve hostname" | The hostname changes when a project restarts — copy a fresh SSH command from Replit |

**Your project must be open** in Replit for the connection to work. Rebel can tell the difference between a sleeping project and a wrong SSH key — follow the specific guidance in the error message.


## See Also

- [MCP connectors and tools](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
