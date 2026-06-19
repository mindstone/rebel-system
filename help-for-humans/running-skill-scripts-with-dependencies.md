---
description: "How Rebel handles skills that need extra software packages (dependencies) to run their scripts"
---

# Running Skill Scripts with Dependencies

Some skills include scripts that need extra software packages to work. When Rebel runs these, it handles the setup automatically -- but here's what's happening behind the scenes in case you're curious or run into issues.

## How It Works

1. Rebel copies the skill's scripts to a temporary folder on your computer
2. It installs the required packages there (using Node.js, which is built into Rebel)
3. It runs the script and delivers the results
4. The temporary folder can be safely deleted afterwards

This takes a few seconds the first time. You need an internet connection for the install step.

## Skills That Use This

- **PDF Fill Form** -- fills PDFs that have fillable fields and saves a `-filled` copy
- **Outlook Email Export Parser** -- parses `.pst` files (Windows Outlook) and `.olm` files (Mac Outlook) into searchable format
- **LinkedIn Export Parser** -- parses LinkedIn data exports for searching and analysis

## If Something Goes Wrong

**"Cannot find module" errors**: The package install may have failed. Ask Rebel to try again -- it will re-copy and re-install.

**Offline / no internet**: The install step needs internet access to download packages. If you're offline, this won't work until you're back online.

**Permission errors**: On some systems, the temporary folder location may not be writable. Ask Rebel to try a different location.

## Related

- [Coding Setup with Python](coding-setup-with-Python.md) -- similar guide for skills that use Python scripts
