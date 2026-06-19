# Rebel CLI

Command-line interface for testing and validating rebel-system content without the full Electron app.

## Setup (one-time)

```bash
# From the rebel-system/cli directory, run:
./setup
```

The setup script will:
1. Install CLI dependencies (tsx, nunjucks, @anthropic-ai/sdk)
2. Add the `rebel` command to your shell
3. Prompt for your Anthropic API key (for the `run` command)
4. Create your personal workspace at `~/rebel-workspace`

After setup, restart your terminal or run `source ~/.zshrc`.

## Quick Start

```bash
# List all skills
rebel list

# Validate rebel-system content
rebel validate

# Test a skill with dry-run (shows composed prompt)
rebel run git-commit-changes "test" --dry-run

# Actually call Claude API (uses API key from setup)
rebel run web-researcher "What's new in AI?"
```

## Commands

| Command | Description |
|---------|-------------|
| `list` | List all available skills grouped by category |
| `validate` | Validate rebel-system content (frontmatter, naming, structure) |
| `run <skill> [message]` | Execute a skill through Claude API |

## Common Options

```bash
# Output as JSON
rebel list --json

# Filter by category
rebel list --category documentation

# Dry run (shows prompt without calling API)
rebel run <skill> "message" --dry-run

# With workspace context
rebel run <skill> "message" --workspace ~/my-workspace

# Help
rebel --help
rebel run --help
```

## Without Setup

If you haven't run `./setup`, use `./rebel` from the cli directory:

```bash
cd rebel-system/cli
./rebel list
./rebel validate
./rebel run <skill> "message" --dry-run
```

## Windows

The shebang approach doesn't work on Windows. Use explicit npx invocation:

```powershell
npx -y -p tsx@^4 tsx cli/rebel-cli.ts list
npx -y -p tsx@^4 tsx cli/rebel-cli.ts validate

# run command needs additional packages
npx -y -p tsx@^4 -p @anthropic-ai/sdk -p nunjucks tsx cli/rebel-cli.ts run <skill> "message"
```

---

## Developer Guide

### Directory Structure

```
cli/
  rebel-cli.ts      # Main entry point, command routing
  commands/
    list.ts         # List skills command
    validate.ts     # Validate content command
    run.ts          # Execute skill via Claude API
  lib/
    claude.ts       # Anthropic SDK wrapper
    context.ts      # Context building for prompts
    frontmatter.ts  # YAML frontmatter parsing
    scanner.ts      # Skill directory scanning
    template.ts     # Nunjucks template rendering
    types.ts        # TypeScript type definitions
```

### Adding a New Command

1. Create `cli/commands/your-command.ts`:
   ```typescript
   export interface YourCommandOptions {
     // options
   }
   
   export async function yourCommand(options: YourCommandOptions): Promise<number> {
     // implementation
     return 0; // exit code
   }
   ```

2. Register in `cli/rebel-cli.ts`:
   ```typescript
   import { yourCommand } from './commands/your-command.js';
   
   // In the switch statement:
   case 'your-command':
     exitCode = await yourCommand(options);
     break;
   ```

3. Add help text to the `showHelp()` function.

### Key Utilities

- **`getRebelSystemRoot()`** - Returns absolute path to rebel-system/
- **`scanSkillsDirectory()`** - Discovers all skills with metadata
- **`callClaude()`** - Streams responses from Claude API
- **`buildContextFromOptions()`** - Assembles prompt context from workspace/spaces
