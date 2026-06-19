/**
 * Template renderer for rebel-system CLI
 *
 * Wraps Nunjucks with the same configuration as the Electron app.
 * Uses throwOnUndefined to catch missing variables early.
 *
 * NOTE: Nunjucks is imported dynamically to allow the CLI to work without
 * all dependencies installed (list/validate commands don't need nunjucks).
 */

import type { CompositePromptContext } from './context.js';

// ============================================================================
// Nunjucks Configuration (lazy-loaded)
// ============================================================================

// Cached nunjucks environment (lazy-loaded on first use)
let nunjucksEnv: import('nunjucks').Environment | null = null;

/**
 * Gets or creates the Nunjucks environment.
 * Lazy-loads nunjucks to allow list/validate to work without it.
 */
async function getNunjucksEnv(): Promise<import('nunjucks').Environment> {
  if (nunjucksEnv) {
    return nunjucksEnv;
  }

  try {
    const nunjucks = await import('nunjucks');
    nunjucksEnv = new nunjucks.Environment(null, {
      throwOnUndefined: true,
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true,
    });
    return nunjucksEnv;
  } catch {
    throw new Error(
      'Failed to load nunjucks. Make sure to run with the full shebang:\n' +
      '#!/usr/bin/env -S npx -y -p tsx@^4 -p nunjucks tsx\n\n' +
      'Or install the package: npm install nunjucks'
    );
  }
}

// ============================================================================
// Template Patterns
// ============================================================================

/**
 * Pattern to match EXTERNAL-IDE-FALLBACK blocks.
 * These blocks are only relevant for external IDEs (Cursor, Claude Code)
 * that read the file directly from disk without Nunjucks rendering.
 */
const EXTERNAL_IDE_FALLBACK_PATTERN =
  /<!--\s*EXTERNAL-IDE-FALLBACK:BEGIN\s*-->[\s\S]*?<!--\s*EXTERNAL-IDE-FALLBACK:END\s*-->/gi;

// ============================================================================
// Public API
// ============================================================================

/**
 * Strips EXTERNAL-IDE-FALLBACK blocks from rebel-system content.
 * These blocks are only relevant for Cursor/external IDE fallback.
 */
export function stripExternalIdeFallback(content: string): string {
  return content.replace(EXTERNAL_IDE_FALLBACK_PATTERN, '').trim();
}

/**
 * Renders a Nunjucks template string with the provided context.
 *
 * This function matches the Electron app's `renderCompositePrompt` behavior:
 * - Uses the same Nunjucks configuration
 * - Throws on undefined variables (context must be complete)
 * - No HTML escaping (for Markdown output)
 *
 * @param template - The template string (e.g., AGENTS.md content)
 * @param context - The context object with all required variables
 * @returns The rendered template string
 * @throws Error if rendering fails or variables are missing
 */
export async function renderTemplate(template: string, context: CompositePromptContext): Promise<string> {
  // Strip EXTERNAL-IDE-FALLBACK blocks when running in CLI
  // These are only relevant for external IDEs reading the file directly
  const templateContent = stripExternalIdeFallback(template);

  try {
    const env = await getNunjucksEnv();
    return env.renderString(templateContent, context);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Template rendering failed: ${message}`);
  }
}

/**
 * Validates that a rendered template has no leftover Nunjucks artifacts.
 *
 * @param rendered - The rendered template string
 * @returns Array of issues found (empty if valid)
 */
export function validateRenderedTemplate(rendered: string): string[] {
  const issues: string[] = [];

  // Check for leftover variable syntax
  const variableMatches = rendered.match(/\{\{[^}]+\}\}/g);
  if (variableMatches) {
    issues.push(
      `Found unrendered variables: ${variableMatches.slice(0, 5).join(', ')}${variableMatches.length > 5 ? ` (and ${variableMatches.length - 5} more)` : ''}`
    );
  }

  // Check for leftover block syntax
  const blockMatches = rendered.match(/\{%[^%]+%\}/g);
  if (blockMatches) {
    issues.push(
      `Found unrendered blocks: ${blockMatches.slice(0, 5).join(', ')}${blockMatches.length > 5 ? ` (and ${blockMatches.length - 5} more)` : ''}`
    );
  }

  // Check for leftover comment syntax (these should be stripped)
  const commentMatches = rendered.match(/\{#[^#]+#\}/g);
  if (commentMatches) {
    issues.push(`Found unrendered comments: ${commentMatches.length} found`);
  }

  return issues;
}

/**
 * Renders a template and validates the output.
 * Combines renderTemplate and validateRenderedTemplate for convenience.
 *
 * @param template - The template string
 * @param context - The context object
 * @returns Object with rendered content and any validation issues
 */
export async function renderAndValidate(
  template: string,
  context: CompositePromptContext
): Promise<{ rendered: string; issues: string[] }> {
  const rendered = await renderTemplate(template, context);
  const issues = validateRenderedTemplate(rendered);
  return { rendered, issues };
}
