---
description: "Friendly guide for non-technical users to set up Python and virtual environments on Mac or Windows"
---

# Coding Setup with Python

> **For**: Non-technical users who need to run Python scripts with external packages (dependencies)

This guide walks you through setting up Python and virtual environments on your computer. Don't worry if you're new to this—we'll make it as simple as possible!

---

## Do I Need This?

You need Python setup if:
- ✅ You want to run a script that has a `requirements.txt` file
- ✅ You see errors like "ModuleNotFoundError: No module named 'xyz'"
- ✅ Someone told you to "install dependencies"

You DON'T need this if:
- ✅ The script only uses Python's built-in features (like most Mindstone Rebel scripts)
- ✅ Python is already set up and working for you

---

## Quick Start (Recommended)

The easiest way is to ask Rebel to set up Python for you:

1. Tell Rebel: "Set up Python for my project" or "I need to run a Python script with dependencies"
2. Rebel will check if Python is installed, create a virtual environment, and install any required packages
3. If anything is missing, Rebel will guide you through installing it

If you prefer to set things up yourself, follow the manual steps below.

---

## Manual Setup (If You Want to Understand)

If you prefer to understand each step or troubleshoot issues, here's the manual process:

### Step 1: Install Python

#### Mac Users:
Python 3 is usually already installed on modern Macs!

Check by opening Terminal and typing:
```bash
python3 --version
```

If you see something like `Python 3.11.5`, you're good! Skip to Step 2.

If not, download and install from: https://www.python.org/downloads/mac-osx/

#### Windows Users:
1. Go to: https://www.python.org/downloads/windows/
2. Download the latest Python installer
3. **⚠️ IMPORTANT**: During installation, CHECK the box "Add Python to PATH"
4. Complete the installation
5. Restart any open terminals or Cursor

Verify it worked by opening Command Prompt and typing (preferred launcher):
```bash
py --version
# or:
python --version
```

### Step 2: Create a Virtual Environment

A "virtual environment" is like a separate, clean workspace for your Python project. It keeps dependencies organized and prevents conflicts.

#### On Mac/Linux:
```bash
python3 -m venv .venv
```

#### On Windows (preferred):
```bash
py -3.11 -m venv .venv  # preferred
# if 3.11 not available:
py -3 -m venv .venv
# as a fallback:
python -m venv .venv
```

This creates a folder called `.venv` in your current directory.

### Step 3: Activate the Virtual Environment

Before you can use the virtual environment, you need to "activate" it.

#### On Mac/Linux:
```bash
source .venv/bin/activate
```

#### On Windows (Command Prompt):
```bash
.venv\Scripts\activate.bat
```

#### On Windows (PowerShell):
```bash
.venv\Scripts\Activate.ps1
```

**If PowerShell gives an error**, run this first:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Success indicator**: Your terminal prompt should now start with `(.venv)`. This means you're "inside" the virtual environment.

### Step 4: Install Dependencies

If your project has a `requirements.txt` file, install everything listed in it:

```bash
pip install -r requirements.txt
```

Optionally upgrade build tools first (recommended):
```bash
python -m pip install -U pip setuptools wheel
```

This might take a minute or two. You'll see progress messages as packages are downloaded and installed.

### Step 5: You're Ready!

Now you can run your Python scripts:

```bash
python your-script.py
```

When you're done, deactivate the virtual environment:

```bash
deactivate
```

---

## Common Issues

### "Python not found" (Windows)

**Problem**: You installed Python but the terminal doesn't recognize the `python` command.

**Solution**: 
1. Uninstall Python
2. Reinstall, making sure to check "Add Python to PATH"
3. Restart your terminal/Cursor

### "Permission denied" (Mac)

**Problem**: You get permission errors when running commands.

**Solution**: 
- Use `python3` instead of `python`
- If running a script: `chmod +x script-name.sh` first

### "Scripts cannot be loaded" (Windows PowerShell)

**Problem**: PowerShell blocks script execution for security.

**Solution**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use Command Prompt instead of PowerShell.

### "Virtual environment not activating"

**Problem**: After running the activate command, you don't see `(venv)` in your prompt.

**Solution**:
- Make sure you're in the right directory (where the `.venv` folder is)
- Check that `.venv` was created successfully (you should see a `.venv` folder with `bin` or `Scripts` inside)
- Try the full path: `source /full/path/to/.venv/bin/activate`

### "ModuleNotFoundError" even after installing

**Problem**: You installed packages but Python still can't find them.

**Solution**:
1. Make sure your virtual environment is activated (look for `(venv)` in prompt)
2. Install packages while activated: `pip install -r requirements.txt`
3. Verify with: `pip list` (should show your installed packages)

---

## Best Practices

### ✅ Do This:
- Create a new `.venv` for each project
- Add `.venv/` (and `venv/`) to your `.gitignore` file
- Keep your `requirements.txt` up to date
- Activate the venv before running scripts
- Use descriptive names for venvs if you have many: `venv-projectname`

### ❌ Don't Do This:
- Don't commit the `venv` folder to git (it's huge and unnecessary)
- Don't install packages without activating the venv first
- Don't share venvs between different projects
- Don't delete the `venv` folder while it's activated

---

## Next Steps

Once Python is set up:

1. **Try running a script**: Pick a Python script from the `scripts/` folder
2. **Create your own**: Ask the AI assistant to help you write a simple Python script
3. **Learn more**: Check out Python tutorials at https://www.python.org/about/gettingstarted/

---

## Getting Help

If you're stuck:

1. **Ask the AI assistant**: Just describe the error you're seeing
2. **Ask for help**: Share your error message through your usual Rebel support route
3. **Check the troubleshooting section** above

Remember: Everyone finds this confusing at first. It gets easier with practice!

---

## Related Documentation

- **For AI assistants**: See `skills/coding/Python-setup-and-check.md`
- **Script guidelines**: See `skills/documentation/writing-scripts.md`
- **Quick reference**: The scripts in `scripts/` folder show examples


