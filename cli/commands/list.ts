/**
 * List Command
 *
 * Lists all available skills in rebel-system with their descriptions.
 * Supports multiple output formats: grouped by category (default), flat, or JSON.
 *
 * Usage:
 *   rebel-cli list                    # Default: grouped by category
 *   rebel-cli list --flat             # Flat list without grouping
 *   rebel-cli list --json             # JSON output
 *   rebel-cli list --category coding  # Filter by category
 */

import { groupSkillsByCategory, scanSkills } from '../lib/scanner.js';
import type { ListOptions, SkillMetadata } from '../lib/types.js';

// ============================================================================
// Output Formatting
// ============================================================================

/**
 * Format skills as a grouped list by category.
 *
 * Output format:
 *   documentation/
 *     write-skill                  Creates well-structured skills
 *     write-planning-doc           Planning document templates
 *
 *   coding/
 *     git-commit-changes           Git commit best practices
 */
function formatGrouped(skills: SkillMetadata[]): string {
  const groups = groupSkillsByCategory(skills);
  const lines: string[] = [];

  for (const group of groups) {
    lines.push(`${group.name}/`);

    // Calculate max skill name length for alignment
    const maxNameLength = Math.max(...group.skills.map((s) => s.name.length));

    for (const skill of group.skills) {
      const padding = ' '.repeat(maxNameLength - skill.name.length + 2);
      lines.push(`  ${skill.name}${padding}${skill.description}`);
    }

    lines.push(''); // Empty line between categories
  }

  // Remove trailing empty line
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
}

/**
 * Format skills as a flat list.
 *
 * Output format:
 *   coding/git-commit-changes       Git commit best practices
 *   documentation/write-skill       Creates well-structured skills
 */
function formatFlat(skills: SkillMetadata[]): string {
  // Sort by category then name
  const sorted = [...skills].sort((a, b) => {
    const catCompare = a.category.localeCompare(b.category);
    if (catCompare !== 0) return catCompare;
    return a.name.localeCompare(b.name);
  });

  // Calculate max path length for alignment
  const maxPathLength = Math.max(...sorted.map((s) => `${s.category}/${s.name}`.length));

  const lines: string[] = [];
  for (const skill of sorted) {
    const path = `${skill.category}/${skill.name}`;
    const padding = ' '.repeat(maxPathLength - path.length + 2);
    lines.push(`${path}${padding}${skill.description}`);
  }

  return lines.join('\n');
}

/**
 * Format skills as JSON.
 *
 * Output format:
 *   [
 *     {
 *       "name": "git-commit-changes",
 *       "description": "Git commit best practices",
 *       "category": "coding",
 *       "path": "skills/coding/git-commit-changes"
 *     },
 *     ...
 *   ]
 */
function formatJson(skills: SkillMetadata[]): string {
  // Sort for consistent output
  const sorted = [...skills].sort((a, b) => {
    const catCompare = a.category.localeCompare(b.category);
    if (catCompare !== 0) return catCompare;
    return a.name.localeCompare(b.name);
  });

  // Extract only the relevant fields for JSON output
  const output = sorted.map((skill) => ({
    name: skill.name,
    description: skill.description,
    category: skill.category,
    path: skill.path,
  }));

  return JSON.stringify(output, null, 2);
}

// ============================================================================
// Command Implementation
// ============================================================================

/**
 * Execute the list command.
 *
 * @param options - Command options
 * @returns Exit code (0 for success, 1 for error)
 */
export async function listCommand(options: ListOptions): Promise<number> {
  try {
    // Scan skills directory
    const scanOptions = {
      rootPath: options.root,
      categories: options.category ? [options.category] : undefined,
    };

    const result = await scanSkills(scanOptions);

    // Check if we found any skills
    if (result.skills.length === 0) {
      if (options.category) {
        console.error(`No skills found in category: ${options.category}`);
      } else {
        console.error('No skills found');
      }
      return 1;
    }

    // Format output based on options
    let output: string;
    if (options.json) {
      output = formatJson(result.skills);
    } else if (options.flat) {
      output = formatFlat(result.skills);
    } else {
      output = formatGrouped(result.skills);
    }

    console.log(output);
    return 0;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error listing skills: ${message}`);
    return 1;
  }
}
