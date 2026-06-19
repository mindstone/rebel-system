---
name: rename-or-move-and-update-references
description: "Safely rename or move files while automatically updating all references across the codebase, including imports, documentation, and configuration files."
last_updated: 2025-11-22
agent_type: either
---

# Rename or Move Files and Update References

- Rename or move a file or files as per the user's explicit instructions. 
  - If asked to propose/discuss, then don't make changes until they have been agreed with the user.
  - If things are confusing, or you see potential problems, or have a better idea, then you should ask questions, raise concerns, make suggestions, etc.
  - **CRITICAL**: After renaming/moving, confirm the old file is deleted and make ALL subsequent edits to the NEW filename only (to avoid accidentally recreating the old file)
  - Prefer a true rename (`git mv` if version-controlled, else `mv`) rather than creating a new file and deleting the old one, to avoid unnecessary Delete notifications.

- If there are multiple files, use tasks and subagents (provided with rich context) to:
  - Do the rename/move
    - Prefer to use `git mv` rather than `mv`, where appropriate. Or if there is a special tool for doing the move (e.g. a syntactically-aware refactoring tool, use that)
  - Search carefully for all the places that refer to each file, and update them appropriately.
    - Use **sd** for updating references across the codebase (see [SD-string-displacement-find-replace.md](../utilities/SD-string-displacement-find-replace/SKILL.md))
    - Be careful not to break/disrupt functionality.

- IMPORTANT: If in doubt, or you notice any issues/surprises/complications stop and ask.

## See also

- [file-naming-and-organisation.md](file-naming-and-organisation/SKILL.md) - naming conventions to follow when renaming or creating files

## Process Guidelines

### Before Starting
1. **Understand the scope** - How many files are affected?
2. **Check destination** - Does a file already exist at the destination path? Are there similarly-named files nearby that might be duplicates? If yes, STOP and check with the user before proceeding.
3. **Check for references** - What refers to these files?
4. **Identify risks** - What could break with this change?
5. **Plan the approach** - Git mv, refactoring tools, or simple moves?

### During Execution
1. **Use appropriate tools**:
   - `git mv` for version-controlled files
   - Search and replace for documentation references
   - IDE refactoring tools for code (see Code-Specific section below)
   - For case-only renames: `mv Name.md Name.tmp && mv Name.tmp name.md` (or `git mv` twice)
   
2. **Search thoroughly for references**:
   - Documentation links
   - Configuration files
   - Build scripts and manifests
   - Comments and README files
   - Import/require statements (for code files)
   - Test files (for code files)

3. **Verify changes**:
   - Check documentation links
   - Review all updated references

### Common Reference Patterns
- **Code**: `import './old-name'`, `require('../old-path')`
- **Documentation**: `[link](old-path/SKILL.md)`, `see old-file.js`
- **Configuration**: File paths in package.json, tsconfig.json, etc.
- **Build systems**: File references in build scripts, CI configs
- **URLs**: Repository links, deployment paths

### Safety Checks
- **Backup important changes** before large moves
- **Use git status** to review all affected files
- **Test functionality** after the move
- **Review commit diff** before finalizing

### Complex Scenarios
For large refactoring operations:
1. Break into smaller, atomic moves when possible
2. Use subagents to handle different aspects (code vs docs vs config)
3. Consider doing a trial run or creating a branch first
4. Coordinate with team members if this affects shared code

## Code-Specific Considerations

When renaming/moving code files, additional steps are needed:

### Code Reference Patterns
- **Import/require statements**: `import './old-name'`, `require('../old-path')`
- **Test files**: References in test imports and test file names
- **Module exports**: Re-exports that reference the old path

### Code-Specific Tools
- **IDE refactoring tools**: Use language-aware refactoring when available (e.g., VS Code, IntelliJ)
- **Language-specific tools**: TypeScript compiler for checking imports, linters, etc.

### Code-Specific Verification
1. **Compile check**: Ensure code still compiles without errors
2. **Run tests**: Execute relevant test suites
3. **Type checking**: Run type checker if using TypeScript/Flow/etc.
4. **Linter**: Check for any new linter errors

### Case-Insensitive Filesystems
On macOS/Windows (case-insensitive filesystems), renaming `File.md` → `file.md` (or vice versa) requires a two-step rename:
```bash
mv "File.md" "TEMP-file.md" && mv "TEMP-file.md" "file.md"
```
Direct renames fail because the filesystem treats both names as identical.

Do this with `&&`-chaining if you can, so that it's atomic.

Remember: It's better to ask questions and move carefully than to break working functionality.