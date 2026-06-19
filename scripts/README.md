# Scripts

Shared utility scripts for Mindstone Rebel.

For guidelines on creating scripts, see [`skills/documentation/writing-scripts.md`](../skills/documentation/writing-scripts.md).

For Python setup and virtual environments, see [`help-for-humans/coding-setup-with-Python.md`](../help-for-humans/coding-setup-with-Python.md).

## Available Scripts

- **`elevenlabs_speak.py`** - Text-to-speech using ElevenLabs (uses only built-in Python libraries)
- **`scan-md-descriptions.ts`** - Scan markdown files for description frontmatter (useful for skills index, space discovery)
- **`setup-python.sh`** - Automated Python virtual environment setup (Mac/Linux/Git Bash)
- **`setup-python.bat`** - Automated Python virtual environment setup (Windows)
- **`random_md_picker.sh`** - Randomly select a markdown file
- **`sequential-datetime-prefix.ts`** - Add datetime prefixes to filenames
- **`victory_flourish.sh`** - Celebratory sound effect

## Python Setup

If you need to run Python scripts with external dependencies:

1. **Automated setup (recommended)**:
   - Mac/Linux: `./scripts/setup-python.sh`
   - Windows: `scripts\setup-python.bat`

2. **Manual setup**: See [`help-for-humans/python-setup.md`](../help-for-humans/python-setup.md)

3. **For AI assistants**: See [`skills/coding/Python-setup-and-check.md`](../skills/coding/Python-setup-and-check.md)
