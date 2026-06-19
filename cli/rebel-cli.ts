#!/usr/bin/env node
// This file should be run via the ./rebel wrapper or with tsx directly

/**
 * Rebel-System CLI
 *
 * Command-line interface for working with rebel-system skills and content.
 * Designed for developers and CI testing rebel-system changes.
 *
 * Commands:
 *   list     - List all available skills
 *   validate - Validate rebel-system content
 *   run      - Execute a skill through Claude API
 *
 * Usage:
 *   ./cli/rebel-cli.ts list [--json] [--flat] [--category <name>]
 *   ./cli/rebel-cli.ts validate [--json] [--strict]
 *   ./cli/rebel-cli.ts run <skill> [message] [--dry-run]
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Required for 'run' command
 *
 * @see docs/plans/260103_rebel_system_cli.md for full specification
 */

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { listCommand } from './commands/list.js';
import { validateCommand } from './commands/validate.js';
import type { ListOptions, RunOptions, ValidateOptions } from './lib/types.js';

// ============================================================================
// Constants
// ============================================================================

const VERSION = '0.1.0';

// Get rebel-system root path (rebel-cli.ts is in scripts/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REBEL_SYSTEM_ROOT = resolve(__dirname, '..');

// ============================================================================
// Argument Parsing
// ============================================================================

interface ParsedArgs {
  command: string | undefined;
  positionals: string[];
  flags: Map<string, string | boolean>;
}

/**
 * Parse command-line arguments.
 *
 * Supports:
 *   --flag           Boolean flag
 *   --flag=value     Flag with value (equals)
 *   --flag value     Flag with value (space-separated)
 *   -f               Short boolean flag
 *   positional       Positional arguments
 *
 * @param args - Raw argv (excluding node and script path)
 * @returns Parsed arguments
 */
function parseArgs(args: string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags = new Map<string, string | boolean>();

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    if (arg === '--') {
      // Everything after -- is positional
      positionals.push(...args.slice(i + 1));
      break;
    }

    if (arg.startsWith('--')) {
      const equalsIndex = arg.indexOf('=');
      if (equalsIndex !== -1) {
        // --flag=value
        const key = arg.slice(2, equalsIndex);
        const value = arg.slice(equalsIndex + 1);
        flags.set(key, value);
      } else {
        // --flag or --flag value
        const key = arg.slice(2);
        const nextArg = args[i + 1];

        // Check if next arg is a value or another flag/positional
        if (nextArg && !nextArg.startsWith('-')) {
          // Could be a value, check if it's a boolean flag
          if (key === 'json' || key === 'flat' || key === 'strict' || key === 'dry-run' || key === 'no-stream') {
            flags.set(key, true);
          } else {
            flags.set(key, nextArg);
            i++;
          }
        } else {
          flags.set(key, true);
        }
      }
    } else if (arg.startsWith('-') && arg.length === 2) {
      // Short flag: -f
      flags.set(arg[1], true);
    } else {
      // Positional argument
      positionals.push(arg);
    }

    i++;
  }

  // First positional is the command
  const command = positionals.shift();

  return { command, positionals, flags };
}

// ============================================================================
// Help Text
// ============================================================================

function printUsage(): void {
  console.log(`
rebel v${VERSION} — Rebel-System CLI for skill development and testing

USAGE:
  rebel <command> [options]

COMMANDS:
  list      List all available skills
  validate  Validate rebel-system content
  run       Execute a skill through Claude API

OPTIONS:
  --help, -h     Show this help message
  --version, -v  Show version number
  --root <path>  Override rebel-system root path

EXAMPLES:
  # List all skills grouped by category
  rebel list

  # List skills as JSON
  rebel list --json

  # List skills in a specific category
  rebel list --category documentation

  # Validate rebel-system content
  rebel validate

  # Run a skill with a message
  rebel run web-researcher "What are the latest AI developments?"

  # Dry run to see composed prompt
  rebel run web-researcher "test" --dry-run

SETUP:
  From the rebel-system/cli directory, run './setup' to add the 'rebel' command to your shell.
  Then use 'rebel' from anywhere.

ENVIRONMENT:
  ANTHROPIC_API_KEY  Required for 'run' command (unless --dry-run)
  REBEL_CLI_MODEL    Override default model for 'run' command
`.trim());
}

function printListHelp(): void {
  console.log(`
rebel list — List all available skills

USAGE:
  rebel list [options]

OPTIONS:
  --json           Output as JSON array
  --flat           Output as flat list (no category grouping)
  --category <n>   Filter by category name (e.g., 'documentation', 'coding')
  --root <path>    Override rebel-system root path

EXAMPLES:
  # Default: grouped by category
  rebel list

  # JSON output
  rebel list --json

  # Flat list
  rebel list --flat

  # Filter by category
  rebel list --category documentation
`.trim());
}

function printValidateHelp(): void {
  console.log(`
rebel validate — Validate rebel-system content

USAGE:
  rebel validate [options]

OPTIONS:
  --json           Output as JSON object
  --strict         Treat warnings as errors (exit code 2)
  --root <path>    Override rebel-system root path

CHECKS:
  - SKILL.md exists in each skill folder
  - SKILL.md is non-empty
  - Frontmatter has required fields (name, description)
  - Name matches folder name (hyphen-case)
  - No invalid characters in name
  - No duplicate skill names across categories

EXIT CODES:
  0  All validations passed
  1  Errors found
  2  Warnings found (with --strict)

EXAMPLES:
  # Validate with human-readable output
  rebel validate

  # Validate with JSON output
  rebel validate --json

  # Strict mode (warnings become errors)
  rebel validate --strict
`.trim());
}

function printRunHelp(): void {
  console.log(`
rebel run — Execute a skill through Claude API

USAGE:
  rebel run <skill> [message] [options]

ARGUMENTS:
  <skill>     Name of the skill to execute (see 'rebel list')
  [message]   User message to send to Claude (optional, defaults to "Execute the <skill> skill.")

OPTIONS:
  --model <model>            Claude model (default: claude-sonnet-4-20250514)
  --context <file>           Additional context file to append to message
  --dry-run                  Show composed prompt without calling Claude
  --no-stream                Wait for complete response instead of streaming
  --workspace <path>         Set workspace path (auto-loads Chief-of-Staff/README.md)
  --chief-of-staff <file>    Explicitly load Chief-of-Staff content
  --spaces <file>            JSON file with spaces array
  --packages <file>          JSON file with connected packages
  --finish-line <criterion>  Stop when this criterion is met. Example: --finish-line "the draft is ready to send"
  --root <path>              Override rebel-system root path

ENVIRONMENT:
  ANTHROPIC_API_KEY        Required unless --dry-run
  REBEL_CLI_MODEL          Override default model

EXIT CODES:
  0  Success
  1  Error (skill not found, API error, etc.)

EXAMPLES:
  # Basic usage
  rebel run web-researcher "What are the latest AI developments?"

  # Dry run to see composed prompt
  rebel run web-researcher "test" --dry-run

  # With workspace context
  rebel run meeting-external-prep "Prep for Monday's call" --workspace ~/my-project

  # With explicit context file
  rebel run writing-coach "Review this" --context ./draft.md

  # With custom model
  rebel run code-reviewer "Review this PR" --model claude-opus-4-20250514

  # With a finish line
  rebel run writing-coach "Polish this draft" --finish-line "ready to send to the client"

  # Non-streaming mode
  rebel run summarizer "Summarize this" --no-stream
`.trim());
}

// ============================================================================
// Command Routing
// ============================================================================

/**
 * Main entry point.
 */
async function main(): Promise<void> {
  // Parse arguments (skip node and script path)
  const args = parseArgs(process.argv.slice(2));

  // Handle global flags
  if (args.flags.has('help') || args.flags.has('h')) {
    if (args.command === 'list') {
      printListHelp();
    } else if (args.command === 'validate') {
      printValidateHelp();
    } else if (args.command === 'run') {
      printRunHelp();
    } else {
      printUsage();
    }
    process.exit(0);
  }

  if (args.flags.has('version') || args.flags.has('v')) {
    console.log(`rebel v${VERSION}`);
    process.exit(0);
  }

  // Verify we're in a rebel-system directory
  const agentsMdPath = resolve(REBEL_SYSTEM_ROOT, 'AGENTS.md');
  if (!existsSync(agentsMdPath)) {
    console.error(`Error: Cannot find AGENTS.md at ${agentsMdPath}`);
    console.error('Are you running from within a rebel-system checkout?');
    process.exit(1);
  }

  // Get root path override if provided
  let rootPath: string | undefined;
  if (args.flags.has('root')) {
    const rootValue = args.flags.get('root');
    if (typeof rootValue === 'string') {
      rootPath = resolve(rootValue);
      // Verify override path exists
      if (!existsSync(resolve(rootPath, 'AGENTS.md'))) {
        console.error(`Error: Cannot find AGENTS.md at ${rootPath}`);
        process.exit(1);
      }
    }
  }

  // Route to command
  const command = args.command;

  if (!command) {
    console.error('Error: No command specified');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  switch (command) {
    case 'help': {
      printUsage();
      process.exit(0);
      break;
    }

    case 'list': {
      // Handle 'list help'
      if (args.positionals[0] === 'help') {
        printListHelp();
        process.exit(0);
      }

      const options: ListOptions = {
        json: args.flags.has('json'),
        flat: args.flags.has('flat'),
        root: rootPath,
      };

      // Handle category filter
      if (args.flags.has('category')) {
        const categoryValue = args.flags.get('category');
        if (typeof categoryValue === 'string') {
          options.category = categoryValue;
        }
      }

      const exitCode = await listCommand(options);
      process.exit(exitCode);
      break;
    }

    case 'validate': {
      // Handle 'validate help'
      if (args.positionals[0] === 'help') {
        printValidateHelp();
        process.exit(0);
      }

      const validateOptions: ValidateOptions = {
        json: args.flags.has('json'),
        strict: args.flags.has('strict'),
        root: rootPath,
      };

      const validateExitCode = await validateCommand(validateOptions);
      process.exit(validateExitCode);
      break;
    }

    case 'run': {
      // Dynamic import since run command has additional dependencies (nunjucks, @anthropic-ai/sdk)
      // These are loaded via the shebang when run.ts is executed directly,
      // but for dispatch from this file, we dynamically import
      const { runCommand } = await import('./commands/run.js');

      // Get skill name (first positional argument)
      const skillName = args.positionals[0];
      if (!skillName || skillName === 'help') {
        printRunHelp();
        process.exit(skillName === 'help' ? 0 : 1);
      }

      // Get message (second positional argument, or default)
      const message = args.positionals[1] || `Execute the ${skillName} skill.`;

      // Build run options
      const runOptions: RunOptions = {
        root: rootPath,
        json: args.flags.has('json'),
        dryRun: args.flags.has('dry-run'),
        noStream: args.flags.has('no-stream'),
      };

      // Handle string options
      if (args.flags.has('model')) {
        const modelValue = args.flags.get('model');
        if (typeof modelValue === 'string') {
          runOptions.model = modelValue;
        }
      }

      if (args.flags.has('context')) {
        const contextValue = args.flags.get('context');
        if (typeof contextValue === 'string') {
          runOptions.context = contextValue;
        }
      }

      if (args.flags.has('workspace')) {
        const workspaceValue = args.flags.get('workspace');
        if (typeof workspaceValue === 'string') {
          runOptions.workspace = workspaceValue;
        }
      } else if (process.env.REBEL_WORKSPACE) {
        // Use REBEL_WORKSPACE env var as fallback if --workspace not provided
        runOptions.workspace = process.env.REBEL_WORKSPACE;
      }

      if (args.flags.has('chief-of-staff')) {
        const chiefOfStaffValue = args.flags.get('chief-of-staff');
        if (typeof chiefOfStaffValue === 'string') {
          runOptions.chiefOfStaff = chiefOfStaffValue;
        }
      }

      if (args.flags.has('spaces')) {
        const spacesValue = args.flags.get('spaces');
        if (typeof spacesValue === 'string') {
          runOptions.spaces = spacesValue;
        }
      }

      if (args.flags.has('packages')) {
        const packagesValue = args.flags.get('packages');
        if (typeof packagesValue === 'string') {
          runOptions.packages = packagesValue;
        }
      }

      if (args.flags.has('finish-line')) {
        const finishLineValue = args.flags.get('finish-line');
        if (typeof finishLineValue !== 'string') {
          console.error('Error: --finish-line requires a value (the success criterion).');
          console.error('Example: --finish-line "the brief is ready to send"');
          process.exit(1);
        }
        runOptions.finishLine = finishLineValue;
      }

      const runExitCode = await runCommand(skillName, message, runOptions);
      process.exit(runExitCode);
      break;
    }

    default:
      console.error(`Error: Unknown command '${command}'`);
      console.error('Available commands: list, validate, run');
      console.error('Run with --help for usage information');
      process.exit(1);
  }
}

// Run main
main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
