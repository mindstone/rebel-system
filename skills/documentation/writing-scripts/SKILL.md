---
name: writing-scripts
description: "Guidelines for creating shared utility scripts in the Company OS, prioritizing pre-installed languages and avoiding dependency bloat in Google Drive."
---

# Scripts

Shared utility scripts for the {COMPANY_OS_NAME}.

## Requirements for New Scripts

When adding scripts to this folder, follow these principles:

- **Easy for non-technical Mac or Windows users** - Should run with minimal setup
- **Pre-installed languages preferred** - So probably use Python 3 or shell scripts (both pre-installed on Mac)
- **Use built-in libraries** - Stick to standard library when possible
- **Clear documentation** - Include usage instructions in script docstring or companion README


## Using External Dependencies

**Default approach**: Use only built-in libraries (like `elevenlabs_speak.py` does).

**If external packages are needed**:
1. Create a `requirements.txt` file listing dependencies (see `templates/requirements-template.txt`)
2. Document in your script's docstring that setup is required
3. Point users to the automated setup scripts:
   - Mac/Linux: `./scripts/setup-python.sh`
   - Windows: `scripts\setup-python.bat`

For more details, see:
- **For users**: [`help-for-humans/python-setup.md`](../../help-for-humans/python-setup.md)
- **For AI assistants**: [`skills/coding/Python-setup-and-check.md`](../coding/Python-setup-and-check/SKILL.md)

## Future Considerations

We may eventually standardize on a package manager (npm, pip, etc.) if the benefits outweigh the complexity. For now, keep it simple.







