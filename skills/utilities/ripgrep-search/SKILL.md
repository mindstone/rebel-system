---
name: ripgrep-search
description: "Reference guide for using ripgrep (rg) as a fast, flexible workspace search tool, mainly for large folders and codebases where basic search isn’t enough."
last_updated: 251116
agent_type: either
dependencies: []
---

# ripgrep Search Tool ✓

ripgrep (`rg`) is a fast, modern search tool that works brilliantly across large folders containing Markdown, docs, config files, and code. Like `sd`, it is **optional** and usually only worth bothering with when you’re doing **a lot of searching across a big folder or repo**, especially on macOS/Linux.

On **Windows**, especially in corporate environments, strongly prefer **built-in search tools** (IDE search, PowerShell `Select-String`, or existing `rg` if IT has installed it) rather than having agents try to install `ripgrep` themselves.

If you think it would be really valuable to install ripgrep, suggest it to the user. It really needs to be valuable to bother with on Windows.


## See Also

- **`sd` find-replace tool**: See [`SD-string-displacement-find-replace.md`](SD-string-displacement-find-replace/SKILL.md) for safe, large-scale find-replace operations once you’ve located strings with `rg`.
- **Ripgrep installation (macOS + Windows)**: See [`../system/ripgrep-installation-macos-windows.md`](../system/ripgrep-installation-macos-windows/SKILL.md) for when/how to install `rg` safely using Homebrew/Chocolatey, and key IT/security considerations.
- **Evergreen docs guidance**: See [`../documentation/write-help-evergreen-doc.md`](../documentation/write-help-evergreen-doc/SKILL.md) for general documentation patterns this skill follows.

## When to Use ripgrep (and When Not To)

- **Use ripgrep when**:
  - You’re searching **large folders/repositories** and need speed.
  - You want to search **Markdown and docs** as well as code (`-tmd`, `--type-add` patterns).
  - You need **powerful patterns** (regex) or consistent CLI behavior across machines.
  - You’re pairing `rg` with other tools (e.g. `sd` for refactors) or AI-assisted workflows.

- **Probably don’t bother when**:
  - You’re only searching **a small folder** or a handful of files.
  - IDE or editor search is already fast enough.
  - On **Windows in locked-down enterprise IT environments**, where installing `rg` (and especially Chocolatey) may be painful or require approvals.

- **For Windows agents/users**:
  - Treat `rg` as **nice-to-have**, not required.
  - Prefer **existing tools**:
    - Visual Studio Code / IDE search
    - PowerShell `Select-String`
    - Any `rg` installation that IT has **already** provided
  - Avoid trying to bootstrap package managers (e.g. Chocolatey) without explicit human/IT approval.

## Key Benefits

- **Very fast on large folders**: Optimized for speed, even on very large repos and doc trees.
- **Great for non-code content**: Works just as well on Markdown, notes, config, and logs as on code.
- **Smart defaults**:
  - Recursive search
  - Respects `.gitignore` and skips binary files
  - Smart case matching (`rg foo` matches `Foo` if you don’t use capitals)
  - Line numbers and context options built in
- **Flexible filtering**: File type filters (`-tmd`, `-tsql`, etc.) and globs (`--glob '!archive/**'`) make it easy to control scope.
- **LLM-friendly**: Predictable, scriptable CLI that works nicely with automation.

## Installation (Humans Only)

**Important for agents**: Do **not** silently install Homebrew or Chocolatey. Installation commands below are for humans or IT admins to run, not for unattended AI automation.

### macOS

If Homebrew is already installed and approved:

```bash
brew install ripgrep
```

If Homebrew is **not** installed:

- Treat installing `rg` as a **human/IT decision**, not something an agent does on its own.
- In personal/small-team setups, you can recommend “Install Homebrew, then `brew install ripgrep`”.
- In corporate setups, ask IT to deploy `ripgrep` centrally if it’s going to be relied on.

### Linux (Debian/Ubuntu example)

```bash
sudo apt update
sudo apt install ripgrep
```

Other distros often have `ripgrep` in their package manager (e.g. `dnf`, `pacman`).

### Windows

- **Preferred**: Have IT install `ripgrep` using their standard tooling (Intune/SCCM/etc.).
- **If Chocolatey is already installed and approved**, a human can run:

```powershell
choco install ripgrep -y
```

- Avoid having agents:
  - Install Chocolatey themselves.
  - Run remote-install scripts to bootstrap package managers.
- If `rg` isn’t available, fall back to:
  - IDE search
  - PowerShell `Select-String`
  - Any other approved enterprise search tooling

## Basic Usage Patterns

### 1. Simple Search in Current Directory

```bash
rg "search term"
```

- Recursively searches from the current directory.
- Respects `.gitignore` and skips binary files.

### 2. Search Only Markdown / Docs

```bash
rg "meeting notes" -tmd
```

- `-tmd` restricts to Markdown files.
- Great for searching personal/company knowledge bases.

Exclude archive folders:

```bash
rg "OKR" --glob '!archive/**'
```

### 3. Limit by File Types or Extensions

```bash
rg "TODO" -tjs -tts
```

- `-tjs -tts` → search JavaScript and TypeScript files only.

Or via glob:

```bash
rg "feature-flag" --glob '**/*.{ts,tsx}'
```

### 4. Show Context Around Matches

```bash
rg "error" -n -C 3
```

- `-n` → show line numbers (on by default in many builds, explicit here for clarity).
- `-C 3` → show 3 lines of context before and after each match.

### 5. Fixed-String (Literal) Search

For strings with special regex characters, you may want **fixed-string** mode:

```bash
rg -F "app/[slug]/page.tsx"
```

- `-F` treats the pattern as a literal string (no regex), similar to `sd --string-mode`.

### 6. Case-Insensitive or Smart Case

```bash
rg -i "username"
```

- `-i` → force case-insensitive search.
- By default, `rg` uses **smart case**: if your pattern has no uppercase letters, it matches both cases; if it does, the match becomes case-sensitive.

## Safety & Enterprise Considerations

- **Read-only**: `rg` only reads files; it never modifies content. It’s safe from a data-modification perspective.
- **Respect IT boundaries**:
  - Don’t introduce new package managers (Homebrew, Chocolatey) without explicit approval.
  - For corporate Windows environments, assume that installing `rg` is an **IT task**, not an agent task.
- **Preferred pattern in enterprises**:
  - Ask IT to deploy `ripgrep` via standard tools.
  - Treat `rg` as an **assumed tool** once present; if missing, prompt the user/admin and suggest alternatives instead of trying to install it.

## Recommended Patterns for Agents

- **Check availability first**:
  - Run `rg --version` (or equivalent) and handle failure gracefully.
  - If unavailable, clearly explain options: IDE search, `grep`, PowerShell `Select-String`, or IT-installed `rg`.

- **Use narrow scopes when possible**:
  - Prefer searching within relevant subdirectories (`rg "term" docs/`).
  - Combine `--glob` and `-t` filters to keep searches focused.

- **Combine with other tools**:
  - Use `rg` to **find** locations, then `sd` (see `SD-string-displacement-find-replace.md`) to safely perform bulk replacements when needed.
  - Use `rg` results to guide documentation updates and refactors.

## Troubleshooting

- **No matches found**:
  - Check for typos or case issues.
  - Try `-i` for case-insensitive search.
  - Make sure the files aren’t excluded by `.gitignore` (use `--no-ignore` if needed).

```bash
rg -i "search term" --no-ignore
```

- **Too many results**:
  - Add file-type filters (`-tmd`, `-tjs`, etc.).
  - Use narrower directories or more specific patterns.
  - Add context flags (`-C`, `-A`, `-B`) only when really needed.

- **Performance concerns**:
  - `rg` is already fast; the main cost is **how much you ask it to search**.
  - Prefer targeted directories over searching the entire filesystem.

## Summary: When ripgrep is Worth It

- Use `ripgrep` when:
  - You’re working with **large repositories or doc trees**.
  - You need **fast, flexible, repeatable searches** that go beyond editor search.
- Skip it (or fall back to simpler tools) when:
  - You’re on **Windows in a locked-down environment** and `rg` isn’t already available.
  - The workspace is small enough that IDE search is sufficient.

In other words: treat `rg` as a **power tool for heavy-duty searching**, not a mandatory dependency, and especially avoid pushing it on Windows users unless IT has already embraced it.


