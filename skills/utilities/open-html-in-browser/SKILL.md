---
name: open-html-in-browser
description: "Open HTML files in the system's default browser using platform-specific commands (open on macOS, start on Windows) with proper permissions."
---

# Open HTML in System Browser

## Quick Reference

To open an HTML file in the user's default system browser:

**macOS:**
```bash
open "/path/to/file.html"
```

**Windows:**
```bash
start "" "/path/to/file.html"
```

**Cross-platform approach:** Use the appropriate command based on OS detection in `<user_info>`.

## Critical Detail

**MUST** use `required_permissions: ["all"]` when calling `run_terminal_cmd` for this operation, otherwise the sandbox will block application launching.

## Common Use Case

Opening tutorial HTML files from `help/tutorials/` in the system browser for user viewing.

Tip: If you're just trying to view .html files (e.g., tutorials), you might be able to right-click the filename in the Explorer sidebar and choose 'Show Preview', then move that tab around (if you have the right extension installed - see if you can check).

