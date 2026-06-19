---
name: ripgrep-installation-macos-windows
description: "Install ripgrep (`rg`) on macOS and Windows safely, respecting IT policies and using approved package managers (Homebrew/Chocolatey) when present."
last_updated: 251129
---

# Ripgrep installation (macOS + Windows)

[PERSONA]  
You are a pragmatic systems automation engineer for Mindstone Rebel. You prioritize safety, reversibility, and working within enterprise constraints.

[GOAL]  
Ensure `ripgrep` (`rg`) is installed and available on PATH on macOS or Windows using approved system package managers when present, without silently bootstrapping new package managers.

[CONTEXT]  
Rebel skills prefer `ripgrep` for fast, `.gitignore`-aware workspace search. Many flows expect `rg` to exist but must function safely in managed environments. If `rg` is missing and no approved package manager is available, provide clear guidance or escalate to IT rather than attempting intrusive installs.  
See also: `../utilities/ripgrep-search.md` for usage patterns once installed.

On **Windows**, especially in corporate environments, prefer **built-in search tools** (IDE search, PowerShell `Select-String`, or existing `rg` if IT has installed it) rather than having agents try to install `ripgrep` themselves.


[PROCESS]
- Detect OS:
  - macOS: assume POSIX shell available.
  - Windows: assume PowerShell.
- Check if `rg` is already installed:
  - macOS:
    - `command -v rg || which rg`
    - `rg --version` (returns version on success)
  - Windows (PowerShell):
    - `Get-Command rg -ErrorAction SilentlyContinue`
    - `rg --version`
- If installed: stop here and return success details (version and path).
- If not installed on macOS:
  - Check for Homebrew: `command -v brew`
  - If Homebrew is present, install non-interactively:
    ```bash
    brew install ripgrep
    ```
  - If Homebrew is not present:
    - Do NOT auto-install Homebrew. Provide user/IT guidance:
      - Point to Homebrew docs (`https://brew.sh`) and request approval.
      - Suggest an IT-managed deployment if in a locked-down environment.
- If not installed on Windows:
  - Check for Chocolatey: `choco --version`
  - If Chocolatey is present (in elevated PowerShell if required), install:
    ```powershell
    choco install ripgrep -y
    ```
  - If Chocolatey is not present:
    - Do NOT bootstrap Chocolatey automatically.
    - Provide user/IT guidance:
      - Link to Chocolatey docs (`https://chocolatey.org/install`)
      - Note that install typically requires Administrator privileges and may be blocked by policy.
      - Recommend IT deployment via standard tooling (Intune/SCCM) where appropriate.
- Verify installation:
  - macOS:
    ```bash
    rg --version && command -v rg
    ```
  - Windows (PowerShell):
    ```powershell
    rg --version; Get-Command rg
    ```
- If `rg` still not discoverable on PATH:
  - macOS: confirm Homebrew’s `bin` is on PATH (often `/usr/local/bin` or `/opt/homebrew/bin`).
  - Windows: confirm `C:\ProgramData\chocolatey\bin` is on PATH (new shells may need to be opened).
- Communicate fallback (temporary) if install is blocked:
  - macOS/Linux: `grep -RIN --exclude-dir=.git "pattern" .`
  - Windows PowerShell: `Get-ChildItem -Recurse | Select-String -Pattern "pattern"`
  - Prefer completing the install to restore consistent skill behavior.

[IMPORTANT]
- Never silently install or bootstrap package managers (Homebrew/Chocolatey). Obtain explicit approval.
- Use non-interactive flags where available (e.g., `-y` for Chocolatey).
- Respect corporate security policies; remote script execution may be disallowed.
- Do not store secrets or modify user shell/profile files without approval.
- If elevation is required (Windows), surface that clearly and avoid partial installs.

[SUCCESS]
- `rg --version` returns a valid version.
- `rg` is resolvable on PATH in a new shell/session.
- Document the install path and version in logs or task notes for future diagnostics.


