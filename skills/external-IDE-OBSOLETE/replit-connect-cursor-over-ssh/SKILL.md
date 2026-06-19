---
name: replit-connect-cursor-over-ssh
description: "End-to-end guide to connect Cursor to a Replit project over SSH, including Windows key setup."
last_updated: 251108
---

# Replit connect Cursor over SSH (Windows-focused)

This is the canonical guide.

## [GOAL]
Connect Cursor to a Replit project over SSH with a single, reliable flow.

## [PREREQUISITES]
- Your Repl shows an “SSH” or “Connect” area (SSH must be enabled for your plan/workspace).
- Cursor installed on Windows 10/11.

## [PROCESS]
- In Replit (UI steps)
  - Click the + on the top bar
  - Search “SSH” → open “Keys” / “Manage SSH keys”
  - Click “Add new SSH key”
  - Optional helper: Click “Learn how to generate” and press the Copy button (copies a keygen command)

- Set up your SSH key (Windows)
  - Open Windows Terminal (PowerShell), paste and run this one‑liner. It creates `~/.ssh/replit` if missing, copies your public key to the clipboard, and prints it:

```powershell
$pub="$env:USERPROFILE\.ssh\replit.pub"; if (!(Test-Path $pub) -or ((Get-Item $pub).Length -eq 0)) { ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\replit" -q -N "" }; $k=Get-Content $pub; $k | Set-Clipboard; $k
```

  - Note: The email/comment (`-C`) is optional and not used for authentication.

- Back in Replit
  - Paste (Ctrl+V) the key into the SSH Key field and click “Add”
  - Search “SSH” again → open “Connect”
  - If prompted to edit `.ssh/config`:
    - Copy the text Replit shows for `.ssh/config`
    - On Windows: run `notepad "$env:USERPROFILE\.ssh\config"` (create file if prompted), paste, save, close
  - Note the SSH details (Host, User, Port) or copy the ready‑made SSH command

- In Cursor
  - Press Ctrl+Shift+P → “Remote-SSH: Add New SSH Host…”
  - Paste this command (replace placeholders and YourName with your Windows username):

```bash
ssh -i "C:\Users\YourName\.ssh\replit" -p <PORT> <USER>@<HOST>
```

  - When prompted, save to the default SSH config
  - Connect: Ctrl+Shift+P → “Remote-SSH: Connect to Host…” → choose your host → select “Linux”
  - Approve prompts; the first connection may install components and reload

## [IMPORTANT]
- Using `-i` avoids needing an SSH agent; no extra setup required.
- Firewalls: allow prompts when asked.
- Comments (`-C "email"`) in keys are metadata only; they don’t impact auth.

## Troubleshooting
- Permission denied (publickey)
  - Ensure your key is added in Replit Keys and you used the exact Host/User/Port
  - Confirm the command points to `C:\Users\YourName\.ssh\replit`
- “ssh is not recognized”
  - Install “OpenSSH Client” (Settings → Apps → Optional features → View features → “OpenSSH Client” → Install)
  - Or install Git for Windows (includes ssh): https://git-scm.com/
- Timeouts / connection fails
  - Confirm SSH is enabled for the Repl and “Connect” shows details
  - Try again after saving `.ssh/config` if prompted by Replit


