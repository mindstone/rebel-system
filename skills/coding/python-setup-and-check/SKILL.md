---
name: python-setup-and-check
description: "This skill should be used when helping non-technical users set up Python and virtual environments for the first time on Mac or Windows."
---

# Python Setup - First Time

**Purpose**: Guide users through their first Python setup with virtual environments, handling platform-specific differences automatically.

**When to use**: When a user needs to run a Python script that requires external packages (dependencies), but hasn't set up Python/venv yet.

---

## Context

Mindstone Rebel generally uses Python scripts with **only built-in libraries** (see `skills/documentation/writing-scripts.md`). However, some scripts (like PDF extraction, advanced AI features) require external packages managed via `pip` and `requirements.txt`.

This skill helps non-technical users get from "never used Python" to "can run scripts with dependencies" in a few simple steps.

---

## Automated Setup (Recommended)

Instead of manual steps, use the bundled setup scripts in this skill's `scripts/` folder:

### Mac/Linux:
```bash
./scripts/setup-python.sh
# Check-only mode (idempotent, does no harm):
./scripts/setup-python.sh --check
```

### Windows:
```bash
scripts\setup-python.bat
REM Check-only mode (idempotent, does no harm):
scripts\setup-python.bat --check
```

These scripts automate Python detection, venv creation, dependency installation, and provide helpful error messages.

---

## Check Mode (Idempotent)

Use the `--check` flag to validate setup without changing anything:
- Confirms Python is installed and reachable
- Detects `.venv/` (or `venv/`) and verifies interpreter exists
- If `requirements.txt` exists, verifies installed packages match via `pip freeze` and runs `pip check`
- Prints a concise status and recommended next steps

Exit codes:
- `0` = All good
- `1` = Something needs attention (will list exactly what)

---

## Manual Workflow

If the automated scripts aren't suitable, follow these manual steps:

### 1. Detect User's Platform

Determine from system info:
- **Mac**: `darwin` in OS version
- **Windows**: `Windows` in OS version

### 2. Check Python Installation

Run appropriate check command:
- **Mac**: **do NOT run `python3 --version` to probe.** `/usr/bin/python3` is an Apple xcode-select *stub*; running it pops the OS "install the command line developer tools" dialog when those tools aren't installed (the user experiences this as a surprise "download python3" prompt). Detect availability *without* executing the stub:
  ```bash
  py="$(command -v python3 || true)"   # command -v resolves the path; it does NOT run python3
  if [ -n "$py" ] && { [ "$py" != /usr/bin/python3 ] || xcode-select -p >/dev/null 2>&1; }; then
    "$py" --version                    # safe: a real Python, or the stub with developer tools present
  else
    echo "No usable Python found (the macOS /usr/bin stub needs developer tools, or install a real Python)"
  fi
  ```
  Simplest path: just run `./scripts/setup-python.sh --check`, which performs this stub-safe detection for you.
- **Windows**: `py --version` (preferred) or `python --version`

**If Python not found:**

#### Mac Users:
macOS does **not** ship a usable Python by default — `/usr/bin/python3` is only an Apple placeholder that triggers the developer-tools install dialog when run, not a working interpreter. Install a real Python:
1. Easiest: `brew install python` (Homebrew). Or download the `.pkg` from https://www.python.org/downloads/macos/ and install it.
2. Verify (now safe, because a real Python is installed): `python3 --version`

#### Windows Users:
1. Download from https://www.python.org/downloads/windows/
2. **CRITICAL**: During installation, CHECK the box "Add Python to PATH"
3. Restart terminal after installation
4. Verify: `python --version`

### 3. Create Virtual Environment

Navigate to the appropriate directory (usually workspace root or script location).

**Mac/Linux:**
```bash
python3 -m venv .venv
```

**Windows (preferred):**
```bash
py -3.11 -m venv .venv  # preferred
# if 3.11 not available:
py -3 -m venv .venv
# as a fallback:
python -m venv .venv
```

This creates a `.venv/` directory containing an isolated Python environment.

### 4. Activate Virtual Environment

**Mac/Linux:**
```bash
source .venv/bin/activate
```

**Windows (Command Prompt):**
```bash
.venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```bash
.venv\Scripts\Activate.ps1
```

> **Note**: If PowerShell gives an error about execution policy, run:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

After activation, the prompt should show `(.venv)` prefix.

### 5. Install Dependencies

Upgrade build tooling first:
```bash
python -m pip install -U pip setuptools wheel
```

If a `requirements.txt` file exists:
```bash
pip install -r requirements.txt
```

If no `requirements.txt` but you know the packages needed:
```bash
pip install package-name-1 package-name-2
```

### 6. Verify Setup

Run a simple test:
```bash
python -c "import sys; print(f'Python {sys.version} from {sys.executable}')"
```

Should show the Python version and path inside the `.venv/` directory.

### 7. Future Use

**Every time** scripts with dependencies are needed:
1. Activate the virtual environment (step 4)
2. Run the script: `python script-name.py`
3. Deactivate when done: `deactivate`

---

## Troubleshooting

### "Python not found" on Windows
- Ensure "Add Python to PATH" was checked during installation
- Restart terminal/Cursor
- If still not working, reinstall Python with PATH option checked

### "Permission denied" on Mac
- Use `python3` (not `python`) on Mac
- If script isn't executable: `chmod +x script-name.sh`

### "Scripts cannot be loaded" on Windows PowerShell
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Or use Command Prompt instead

### Virtual environment not activating
- Check you're in the right directory (where `.venv/` folder exists)
- On Windows, try both Command Prompt and PowerShell
- Verify `.venv/` was created successfully (should contain `bin/` or `Scripts/` folder)

### Packages not found after installation
- Ensure virtual environment is activated (look for `(venv)` in prompt)
- Try upgrading pip first: `pip install --upgrade pip`
- Then retry: `pip install -r requirements.txt`

---

## Best Practices

1. **One venv per project** - Don't share venvs across different projects
2. **Use `.gitignore`** - Add `.venv/` (and `venv/`) to `.gitignore` (never commit it)
3. **Document dependencies** - Always maintain `requirements.txt`
4. **Activate before running** - Remember to activate venv before running scripts
5. **Keep it updated** - Periodically run `python -m pip install -U pip setuptools wheel` and `pip install --upgrade -r requirements.txt`

---

## When AI Assists

As the AI assistant, when helping users with Python setup:

1. **Auto-detect platform** from `<user_info>` and provide platform-specific commands
2. **Check for errors** by examining terminal output
3. **Do no harm**: default to `--check` first. Only make changes with explicit user confirmation.
4. **Offer to create setup** (no destructive actions; do not remove existing environments unless asked)
5. **Test the setup** by running a simple import or script
6. **Create .gitignore** only if creating a new `.venv/`
7. **Document the process** in a setup note if user wants

---

## Example Walkthrough

**User says**: "I need to run the PDF extraction script"

**AI response workflow**:
1. Check if Python is installed
2. If yes, check if `.venv/` exists in workspace
3. If no venv, offer to create it: "I'll set up a Python virtual environment for you..."
4. Run setup script or manual commands based on platform
5. Install requirements from the script's `requirements.txt`
6. Test by importing a key package: `python -c "import pdfplumber"`
7. Confirm to user: "Python environment ready! You can now run the PDF extraction script."

---

## Notes

- This skill is designed for **first-time setup**. Once venv is created, users typically just need to activate it.
- For projects that share the workspace, **don't commit venv/** to version control.
- Some Mindstone Rebel scripts intentionally use **only built-in libraries** to avoid this complexity—use those when possible!
- **Script placement**: Python scripts should be placed in `scripts/` (default to the primary zone's `scripts/` folder)

---

## Bundled Scripts

This skill includes:
- `scripts/setup-python.sh` - Mac/Linux automated setup script
- `scripts/setup-python.bat` - Windows automated setup script

## Related

- `help-for-humans/coding-setup-with-Python.md` - User-facing documentation
- `skills/documentation/writing-scripts.md` - Guidelines for creating scripts
- [PDF-read-extract](../utilities/PDF-read-extract/SKILL.md) - Example skill requiring external packages

