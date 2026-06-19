#!/usr/bin/env node
// This file should be run via the ./rebel wrapper or with tsx directly

/**
 * Run command for rebel-system CLI
 *
 * Executes a skill through the Claude API with AGENTS.md context.
 *
 * Usage:
 *   rebel-cli run <skill> [message] [options]
 *
 * Options:
 *   --model <model>          Claude model (default: claude-sonnet-4-20250514)
 *   --context <file>         Additional context file to append to message
 *   --dry-run                Show composed prompt without calling Claude
 *   --no-stream              Wait for complete response instead of streaming
 *   --workspace <path>       Set workspace path (auto-loads Chief-of-Staff)
 *   --chief-of-staff <file>  Explicitly load Chief-of-Staff content
 *   --spaces <file>          JSON file with spaces array
 *   --packages <file>        JSON file with connected packages
 *
 * Environment:
 *   ANTHROPIC_API_KEY        Required unless --dry-run
 *   REBEL_CLI_MODEL          Override default model
 */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { callClaude, DEFAULT_MODEL } from '../lib/claude.js';
import { buildContextFromOptions } from '../lib/context.js';
import { renderAndValidate } from '../lib/template.js';
import { scanSkills, findSkillByName, getRebelSystemRoot } from '../lib/scanner.js';
import type { RunOptions, SkillMetadata } from '../lib/types.js';

// ============================================================================
// Constants
// ============================================================================

const SEPARATOR = '\n\n---\n\n';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets the effective model from options, environment, or default.
 */
function getEffectiveModel(options: RunOptions): string {
  // CLI option takes precedence
  if (options.model) {
    return options.model;
  }
  // Then environment variable
  if (process.env.REBEL_CLI_MODEL) {
    return process.env.REBEL_CLI_MODEL;
  }
  // Then default
  return DEFAULT_MODEL;
}

/**
 * Reads the AGENTS.md content from rebel-system root.
 */
async function readAgentsMd(rootPath: string): Promise<string> {
  const agentsMdPath = join(rootPath, 'AGENTS.md');
  try {
    return await readFile(agentsMdPath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read AGENTS.md: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Reads the skill's SKILL.md content.
 */
async function readSkillMd(skill: SkillMetadata): Promise<string> {
  const skillMdPath = join(skill.absolutePath, 'SKILL.md');
  try {
    return await readFile(skillMdPath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read SKILL.md: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Reads additional context file if specified.
 */
async function readContextFile(contextPath: string): Promise<string> {
  const resolvedPath = resolve(contextPath);
  if (!existsSync(resolvedPath)) {
    throw new Error(`Context file not found: ${contextPath}`);
  }
  try {
    return await readFile(resolvedPath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read context file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Composes the system prompt from rendered AGENTS.md and SKILL.md.
 */
function composeSystemPrompt(renderedAgentsMd: string, skillMd: string): string {
  // Combine rendered AGENTS.md with SKILL.md content
  // The SKILL.md provides specific instructions for the task
  return `${renderedAgentsMd}${SEPARATOR}# Active Skill\n\n${skillMd}`;
}

/**
 * Composes the user message with optional context file.
 */
function composeUserMessage(message: string, contextContent?: string): string {
  if (contextContent) {
    return `${message}\n\n---\n\n**Additional Context:**\n\n${contextContent}`;
  }
  return message;
}

// ============================================================================
// Dry Run Output
// ============================================================================

/**
 * Prints the dry run output showing the composed prompt.
 */
function printDryRun(
  skill: SkillMetadata,
  systemPrompt: string,
  userMessage: string,
  model: string
): void {
  console.log('='.repeat(80));
  console.log('DRY RUN - Composed Prompt');
  console.log('='.repeat(80));
  console.log();
  console.log(`Skill: ${skill.name}`);
  console.log(`Category: ${skill.category}`);
  console.log(`Model: ${model}`);
  console.log();
  console.log('-'.repeat(40));
  console.log('SYSTEM PROMPT');
  console.log('-'.repeat(40));
  console.log(systemPrompt);
  console.log();
  console.log('-'.repeat(40));
  console.log('USER MESSAGE');
  console.log('-'.repeat(40));
  console.log(userMessage);
  console.log();
  console.log('='.repeat(80));
  console.log('End of dry run. Use without --dry-run to call Claude API.');
  console.log('='.repeat(80));
}

// ============================================================================
// Main Command
// ============================================================================

/**
 * Run command implementation.
 *
 * @param skillName - Name of the skill to run
 * @param message - User message to send
 * @param options - Run options
 * @returns Exit code (0 success, 1 error)
 */
export async function runCommand(
  skillName: string,
  message: string,
  options: RunOptions
): Promise<number> {
  try {
    // Get root path
    const rootPath = options.root ? resolve(options.root) : getRebelSystemRoot();

    // 1. Find skill by name
    const scanResult = await scanSkills({ rootPath });
    const skill = findSkillByName(scanResult.skills, skillName);

    if (!skill) {
      // Check if it's a partial match or similar name
      const similarSkills = scanResult.skills.filter(
        (s) => s.name.includes(skillName) || skillName.includes(s.name)
      );

      console.error(`Error: Skill '${skillName}' not found.`);

      if (similarSkills.length > 0) {
        console.error('\nDid you mean one of these?');
        for (const s of similarSkills.slice(0, 5)) {
          console.error(`  - ${s.name} (${s.category})`);
        }
      } else {
        console.error('\nUse "rebel-cli list" to see all available skills.');
      }

      return 1;
    }

    // 2. Read AGENTS.md content
    const agentsMd = await readAgentsMd(rootPath);

    // 3. Read SKILL.md content
    const skillMd = await readSkillMd(skill);

    // 4. Get effective model
    const model = getEffectiveModel(options);

    // 5. Build context and render AGENTS.md
    const runOptions: RunOptions = {
      ...options,
      model, // Use effective model
    };

    const context = await buildContextFromOptions({
      rebelSystemMd: agentsMd,
      options: runOptions,
    });

    // Render AGENTS.md with context
    const { rendered: renderedAgentsMd, issues } = await renderAndValidate(agentsMd, context);

    if (issues.length > 0) {
      console.error('Warning: Template rendering issues detected:');
      for (const issue of issues) {
        console.error(`  - ${issue}`);
      }
      console.error('');
    }

    // 6. Compose system prompt
    const systemPrompt = composeSystemPrompt(renderedAgentsMd, skillMd);

    // 7. Compose user message (with optional context file)
    let contextContent: string | undefined;
    if (options.context) {
      contextContent = await readContextFile(options.context);
    }
    const userMessage = composeUserMessage(message, contextContent);

    // 8. Handle dry run
    if (options.dryRun) {
      printDryRun(skill, systemPrompt, userMessage, model);
      return 0;
    }

    // 9. Check for API key (required for actual calls)
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
      console.error('Set it with: export ANTHROPIC_API_KEY=your-api-key');
      console.error('Or use --dry-run to see the composed prompt without calling the API.');
      return 1;
    }

    // 10. Call Claude
    const result = await callClaude({
      systemPrompt,
      userMessage,
      model,
      stream: !options.noStream,
    });

    // Print result for non-streaming mode
    if (options.noStream) {
      console.log(result.text);
    }

    // Print usage stats to stderr (so they don't interfere with piped output)
    console.error('');
    console.error(`[${model}] Tokens: ${result.inputTokens} in / ${result.outputTokens} out`);

    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    return 1;
  }
}

// ============================================================================
// Help Text
// ============================================================================

/**
 * Prints help text for the run command.
 */
export function printRunHelp(): void {
  console.log(`
rebel-cli run — Execute a skill through Claude API

USAGE:
  rebel-cli run <skill> [message] [options]

ARGUMENTS:
  <skill>     Name of the skill to execute (see 'rebel-cli list')
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
  rebel-cli run web-researcher "What are the latest AI developments?"

  # Dry run to see composed prompt
  rebel-cli run web-researcher "test" --dry-run

  # With workspace context
  rebel-cli run meeting-external-prep "Prep for Monday's call" --workspace ~/my-project

  # With explicit context file
  rebel-cli run writing-coach "Review this" --context ./draft.md

  # With custom model
  rebel-cli run code-reviewer "Review this PR" --model claude-opus-4-20250514

  # Non-streaming mode
  rebel-cli run summarizer "Summarize this" --no-stream
`.trim());
}

// ============================================================================
// CLI Entry Point (when run directly)
// ============================================================================

/**
 * Parse command-line arguments for standalone execution.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  // Handle help
  if (args.includes('--help') || args.includes('-h')) {
    printRunHelp();
    process.exit(0);
  }
  
  // Parse arguments
  const positionals: string[] = [];
  const options: RunOptions = {};
  
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--no-stream') {
      options.noStream = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--model' && args[i + 1]) {
      options.model = args[++i];
    } else if (arg === '--context' && args[i + 1]) {
      options.context = args[++i];
    } else if (arg === '--workspace' && args[i + 1]) {
      options.workspace = args[++i];
    } else if (arg === '--chief-of-staff' && args[i + 1]) {
      options.chiefOfStaff = args[++i];
    } else if (arg === '--spaces' && args[i + 1]) {
      options.spaces = args[++i];
    } else if (arg === '--packages' && args[i + 1]) {
      options.packages = args[++i];
    } else if (arg === '--finish-line') {
      const next = args[i + 1];
      if (next === undefined || next.startsWith('--')) {
        console.error('Error: --finish-line requires a value (the success criterion).');
        console.error('Example: --finish-line "the brief is ready to send"');
        process.exit(1);
      }
      options.finishLine = args[++i];
    } else if (arg === '--root' && args[i + 1]) {
      options.root = args[++i];
    } else if (!arg.startsWith('-')) {
      positionals.push(arg);
    }
    i++;
  }
  
  // Check for skill name
  const skillName = positionals[0];
  if (!skillName) {
    console.error('Error: No skill name specified');
    console.error('Usage: run.ts <skill> [message] [options]');
    console.error('Run with --help for more information');
    process.exit(1);
  }
  
  // Get message or default
  const message = positionals[1] || `Execute the ${skillName} skill.`;
  
  // Use REBEL_WORKSPACE as fallback
  if (!options.workspace && process.env.REBEL_WORKSPACE) {
    options.workspace = process.env.REBEL_WORKSPACE;
  }
  
  // Run the command
  const exitCode = await runCommand(skillName, message, options);
  process.exit(exitCode);
}

// Run if executed directly (ESM guard)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}
