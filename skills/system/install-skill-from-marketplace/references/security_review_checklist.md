# Security Review Checklist

Instructions for the security review subagent when examining a downloaded skill.

## Overview

This is a **defense-in-depth** review. It catches obvious issues but **cannot protect against sophisticated attacks**. The user is ultimately responsible for trusting the source.

## Required Steps

### 1. List All Files

First, list every file in the skill folder:
- Record text files (reviewable)
- Record binary files (NOT reviewable - user must acknowledge)

Text file extensions to review:
- `.md`, `.txt`, `.json`, `.yaml`, `.yml`, `.toml`
- `.js`, `.ts`, `.mjs`, `.cjs`
- `.py`, `.sh`, `.bash`, `.zsh`
- `.html`, `.css`, `.xml`

Binary files (cannot review content):
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.ico`
- `.woff`, `.woff2`, `.ttf`, `.eot`
- `.pdf`, `.doc`, `.docx`
- `.zip`, `.tar`, `.gz`
- Executables, libraries, etc.

### 2. Read Every Text File

For each text file, read the ENTIRE content. Do not skip or summarize.

### 3. Flag Red Flags

**RED FLAGS** (high risk - strongly recommend against installation):

| Pattern | Why It's Risky |
|---------|----------------|
| `eval()`, `exec()`, `Function()` | Arbitrary code execution |
| `require()` with variable path | Dynamic module loading |
| `child_process`, `spawn`, `execSync` | Shell command execution |
| `fetch()`, `http.request()`, `axios` | Network requests to external servers |
| `fs.writeFile` outside skill folder | File system modification |
| `process.env` access | Environment variable exposure |
| Base64 encoded strings | Could be obfuscated code |
| Minified/obfuscated code | Cannot review intent |
| `__proto__`, `prototype` manipulation | Prototype pollution |
| `new WebSocket()` | Persistent external connection |

### 4. Flag Yellow Flags

**YELLOW FLAGS** (moderate risk - note but don't necessarily reject):

| Pattern | Why It's Notable |
|---------|------------------|
| `fs.readFile`, `fs.readdir` | File system reading |
| Complex regex patterns | Could be ReDoS |
| `setTimeout`, `setInterval` | Delayed execution |
| `process.cwd()`, `__dirname` | Path detection |
| String concatenation in paths | Potential path injection |
| `JSON.parse` without try-catch | Could crash on bad input |

### 5. Summarize What the Skill Does

Write 2-3 sentences explaining:
- What is the skill's stated purpose?
- What does the code actually do?
- Any discrepancies between stated and actual behavior?

### 6. Present Findings

Report to the user:

```
## Security Review Summary

**Files Reviewed:** 5 text files
**Binary Files (not reviewed):** 2 files (icon.png, assets/logo.svg)

### Red Flags: NONE | 2 found
[List any red flags with file/line references]

### Yellow Flags: 3 found
[List any yellow flags with file/line references]

### What This Skill Does
[2-3 sentence summary]

### Recommendation
[SAFE | CAUTION | NOT RECOMMENDED]
[Brief explanation]

---
⚠️ **Reminder**: This review catches obvious issues but cannot detect sophisticated attacks.
Only install skills from sources you trust.
```

## Binary File Warning

If binary files are present, add this prominent warning:

```
⚠️ **Binary Files Cannot Be Reviewed**

This skill contains N binary files that were not analyzed:
- assets/icon.png
- assets/logo.svg

Binary files could contain malicious code. Do you acknowledge this risk?
```

The user MUST explicitly acknowledge before proceeding.

## Example Review

```
## Security Review: skills/pdf

**Files Reviewed:** SKILL.md, scripts/extract.py
**Binary Files:** assets/icon.png

### Red Flags: NONE

### Yellow Flags: 1 found
- scripts/extract.py:15: Uses subprocess.run() to call pdftk CLI
  This executes an external command. Ensure pdftk is trusted.

### What This Skill Does
Extracts text content from PDF files using the pdftk command-line tool.
The code reads PDF files from the workspace and outputs extracted text.
Behavior matches the documented purpose.

### Recommendation: SAFE
The skill does what it claims. The subprocess call is for a well-known 
CLI tool (pdftk) commonly used for PDF processing.

---
⚠️ **Reminder**: This review catches obvious issues but cannot detect sophisticated attacks.
```
