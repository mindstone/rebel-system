---
name: claude-max-token-setup
description: "Automated Claude Max token setup — Rebel runs all commands itself (install, verify, generate token). User never opens Terminal. OS-aware, cross-platform (Mac + Windows), real-time troubleshooting. Works for employees and customers."
use_cases:
  - "Help me set up Claude Max"
  - "Help someone set up their Claude Max token"
  - "Walk me through Claude Max setup"
  - "I need to connect my Claude Max subscription to Rebel"
  - "claude setup-token isn't working"
  - "I can't get my API token into Rebel"
  - "Onboard someone to Claude Max"
  - "Set up Claude Max for me"
  - "My Claude Max token expired"
last_updated: 2026-03-19
tools_required:
  - Bash
agent_type: main_agent
author: Team Member
contributors:
  - Team Member
---
# Claude Max Token Setup (Automated)

Rebel automates Claude Max token generation — user never opens Terminal. Rebel runs all install/verify/generate commands itself. The user's only manual steps are completing browser sign-in and pasting the token.

**Source of truth for commands:** [claude-max-setup.md](../../../help-for-humans/claude-max-setup.md)

**Previous version:** Emma's instructional walkthrough (2026-03-16) guided users through Terminal commands. This version has Rebel execute those commands directly.

## [PERSONA]

Calm, confident setup assistant. Frame this as easy: "I'll handle all the technical bits — you just need to sign in once in your browser." Never use jargon. If something fails, stay reassuring and try the fix before escalating.

## [GOAL]

Get the user's Claude Max token generated and pasted into Rebel settings with minimal user effort. Rebel handles all command-line work.

## [CONTEXT]

Non-technical users struggle because the old process required opening Terminal, typing commands, and debugging PATH issues. Rebel can run all these commands itself via Bash. The only irreducible manual steps are: (1) browser OAuth sign-in, and (2) pasting the token into Settings (no MCP tool exists for auth writes yet).

## [PROCESS]

### 1. Confirm eligibility

Ask: "Do you have a personal **Claude Pro or Max subscription** from [claude.ai](https://claude.ai/upgrade)?"

- **Yes** → continue
- **No / unsure** → "You'll need a personal subscription first — [sign up here](https://claude.ai/upgrade). Team and Enterprise plans use API keys instead — select 'API Key' in [Settings > Agents & Voice](rebel://settings/agents)."
- **Team/Enterprise** → stop, direct to API key flow
- **Token expired / need to regenerate** → skip to step 5

### 2. Detect OS

Run silently — do not ask the user:

```bash
uname -s
```

- `Darwin` → **Mac flow**
- `MINGW*` / `MSYS*` / `CYGWIN*` → **Windows flow** (Rebel's shell on Windows)
- Other → ask user: "Are you on Mac or Windows?"

Tell the user: "I can see you're on **Mac/Windows** — I'll handle everything from here."

### 3. Check if Claude Code is already installed

Try the absolute path first (avoids PATH issues entirely), then fall back:

**Mac:**

```bash
"$HOME/.local/bin/claude" --version 2>/dev/null || claude --version 2>/dev/null
```

**Windows (PowerShell):**

```powershell
$claude = "$env:USERPROFILE\.local\bin\claude.exe"; if (Test-Path $claude) { & $claude --version } else { claude --version }
```

- **Version number returned** → tell user "Claude Code is already installed ✓" → skip to step 5
- **Command not found / error** → continue to step 4

### 4. Install Claude Code

Tell the user: "I need to install a small free tool called Claude Code — it's made by Anthropic and generates your token. I'll run the install now."

**Mac:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows — first check Git (required dependency):**

```powershell
git --version
```

- If Git missing, try:

```powershell
winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements
```

- If `winget` fails (corporate lockdown, older OS): tell user "I wasn't able to install Git automatically. Please download it from [https://git-scm.com/downloads/win](https://git-scm.com/downloads/win) — install with all defaults, then tell me when it's done." Wait for confirmation before continuing.

**Windows — install Claude Code:**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**After install — verify using absolute path (no terminal restart needed):**

**Mac:**

```bash
"$HOME/.local/bin/claude" --version
```

**Windows:**

```powershell
& "$env:USERPROFILE\.local\bin\claude.exe" --version
```

- **Version number** → "Installed successfully ✓"
- **Still failing on Mac** → try PATH fix then verify:

```bash
export PATH="$HOME/.local/bin:$PATH" && claude --version
```

- **Still failing on Windows** → try PATH fix then verify:

```powershell
$env:PATH += ";$env:USERPROFILE\.local\bin"; claude --version
```

- **Still failing after PATH fix** → switch to **Fallback Mode** (see below)

### 5. Generate token

Tell the user: "Now I'll generate your token. **A browser window is about to open** — sign in with your personal Claude Max account and click Authorize (or Allow/Continue — the wording varies). Come back here when you're done."

Use absolute path to avoid PATH issues. **Critical:** `claude setup-token` requires an interactive TTY (raw mode stdin) which Rebel's built-in shell does not provide. Wrap with `script` (Mac) or `winpty`/`cmd` (Windows) to allocate a pseudo-TTY.

**Mac:**

```bash
script -q /dev/null "$HOME/.local/bin/claude" setup-token 2>&1
```

> **Why `script -q /dev/null`?** Claude Code's `setup-token` command uses Ink (a React-for-CLI framework) which requires raw mode on stdin. Rebel's shell doesn't support raw mode, causing an immediate crash. The `script` utility allocates a pseudo-TTY, satisfying Ink's requirement. `-q` suppresses the "Script started" header, `/dev/null` discards the typescript file (we only need stdout).

**Windows — try `winpty` first (ships with Git for Windows), fall back to `cmd /c`:**

```powershell
winpty "$env:USERPROFILE\.local\bin\claude.exe" setup-token 2>&1
```

If `winpty` is not available:

```powershell
cmd /c "$env:USERPROFILE\.local\bin\claude.exe" setup-token 2>&1
```

Wait for the command to complete (it blocks until the user finishes the browser flow). This may take 30-60+ seconds — use a generous timeout (300000ms / 5 minutes).

**If "Raw mode is not supported" error despite the wrapper:** The pseudo-TTY approach failed. Switch to **Fallback Mode** — guide the user to run `claude setup-token` in their own Terminal/PowerShell (one command, 30 seconds).

**If browser didn't open automatically:** Tell the user: "If no browser window appeared, look for a URL in the output above — copy and paste it into your browser."

**If auth error:** "Make sure you're signing in with your *personal* Claude Pro/Max account, not a Team or Enterprise account."

### 6. Copy and paste token

Once the command completes, the token (`sk-ant-oat01-...`) will be visible in the command output.

Tell the user:

> "Done! Your token is shown in the output above — it's the long string starting with `sk-ant-oat01-...`
>
> **Copy it**, then go to [Settings > Agents & Voice](rebel://settings/agents), select **Claude Max Token**, and paste it in."

⚠️ **Security note for skill developers:** The token will appear in Rebel's command output. This is a known Layer 1 limitation; see the internal tracker for the planned `RebelAuth__set_claude_max_token` MCP tool to capture and store the token securely without it appearing in conversation history.

### 7. Validate

After the user confirms they've pasted the token:

> "Try sending me a quick message in a new conversation — if I respond normally, your Claude Max token is working. You're all set! 🎉"

**If issues after pasting:**

- **Token error** → may have been truncated during copy. Re-run step 5.
- **Model error** → confirm they selected "Claude Max Token" (not "API Key") in Settings
- **Rate limiting** → Claude Max has usage limits; heavy usage may temporarily hit a ceiling

---

### Fallback Mode

If automated install/verification fails after all retries, switch to guided manual mode — walk the user through the same steps but as instructions they execute in their own Terminal/PowerShell. Use the original step-by-step approach from [claude-max-setup.md](../../../help-for-humans/claude-max-setup.md). One step at a time, confirm each before moving on.

## [IMPORTANT]

- **Rebel runs all commands** — user should never need to open Terminal/PowerShell
- **Absolute paths** (`$HOME/.local/bin/claude`) eliminate "restart terminal" and PATH issues
- **One step at a time** — confirm each step before proceeding
- **Token is a secret** — never share it, never post in Slack/email, never store in memory files
- **Generous timeouts** — `claude setup-token` blocks on browser OAuth; use 300s timeout
- **Windows is harder** — Git dependency, `winget` may not exist, corporate lockdowns. Be patient, fall back gracefully.
- **Token expiry** — tokens can expire. Fix is always: re-run `claude setup-token` (step 5)
- **Claude Max is personal only** — Team/Enterprise use API keys. See [AI-models.md](../../../help-for-humans/AI-models.md) for details.
- If stuck beyond troubleshooting → [Rebels community](https://rebels.mindstone.com/) or their support contact
