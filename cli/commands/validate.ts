/**
 * Validate Command
 *
 * Validates rebel-system content including skills, checking for:
 * - SKILL.md exists in each skill folder
 * - SKILL.md is non-empty
 * - Frontmatter has required fields (name, description)
 * - Name matches folder name (hyphen-case)
 * - No invalid characters in name
 * - No duplicate skill names across categories
 * - Symlinks are properly skipped
 *
 * Usage:
 *   rebel-cli validate                # Default: human-readable output
 *   rebel-cli validate --json         # JSON output
 *   rebel-cli validate --strict       # Treat warnings as errors
 */

import { findDuplicateNames, scanSkills } from '../lib/scanner.js';
import type { ValidateOptions, ValidationIssue, ValidationResult, ValidationSeverity } from '../lib/types.js';

// ============================================================================
// Output Formatting
// ============================================================================

/**
 * Format validation result as human-readable output with checkmarks and crosses.
 *
 * Output format:
 *   Validating rebel-system content...
 *
 *   ✓ 92 skills found
 *   ✓ All skills have valid frontmatter
 *   ✗ 2 issues found:
 *     - skills/demo/example: name mismatch (expected: example, got: demo-example)
 *
 *   Summary: 1 error, 0 warnings
 */
function formatHumanReadable(result: ValidationResult): string {
  const lines: string[] = [];

  lines.push('Validating rebel-system content...');
  lines.push('');

  // Skills found
  const { totalSkills, validSkills, categories } = result.summary;
  if (totalSkills === 0) {
    lines.push('✗ No skills found');
  } else {
    lines.push(`✓ ${totalSkills} skill${totalSkills !== 1 ? 's' : ''} found across ${categories} ${categories !== 1 ? 'categories' : 'category'}`);
  }

  // Validation status
  if (result.errorCount === 0 && result.warningCount === 0) {
    lines.push('✓ All skills have valid frontmatter');
  } else {
    // Group issues by severity for display
    const errors = result.issues.filter((i) => i.severity === 'error');
    const warnings = result.issues.filter((i) => i.severity === 'warning');

    if (errors.length > 0) {
      lines.push(`✗ ${errors.length} error${errors.length !== 1 ? 's' : ''} found:`);
      for (const issue of errors) {
        lines.push(`  - ${issue.path}: ${issue.message}`);
      }
    }

    if (warnings.length > 0) {
      if (errors.length > 0) lines.push('');
      lines.push(`⚠ ${warnings.length} warning${warnings.length !== 1 ? 's' : ''} found:`);
      for (const issue of warnings) {
        lines.push(`  - ${issue.path}: ${issue.message}`);
      }
    }
  }

  // Summary
  lines.push('');
  const errorText = `${result.errorCount} error${result.errorCount !== 1 ? 's' : ''}`;
  const warningText = `${result.warningCount} warning${result.warningCount !== 1 ? 's' : ''}`;
  lines.push(`Summary: ${errorText}, ${warningText}`);

  return lines.join('\n');
}

/**
 * Format validation result as JSON.
 *
 * Output format:
 *   {
 *     "valid": true,
 *     "issues": [],
 *     "errorCount": 0,
 *     "warningCount": 0,
 *     "summary": {
 *       "totalSkills": 92,
 *       "validSkills": 92,
 *       "categories": 16
 *     }
 *   }
 */
function formatJson(result: ValidationResult): string {
  return JSON.stringify(result, null, 2);
}

// ============================================================================
// Validation Logic
// ============================================================================

/**
 * Create a validation issue.
 */
function createIssue(
  path: string,
  message: string,
  severity: ValidationSeverity,
  code: string
): ValidationIssue {
  return { path, message, severity, code };
}

/**
 * Perform comprehensive validation of rebel-system content.
 *
 * @param options - Validate options
 * @returns Validation result
 */
async function performValidation(options: ValidateOptions): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];

  // Scan all skills including invalid ones to collect errors
  const scanResult = await scanSkills({
    rootPath: options.root,
    includeInvalid: true,
  });

  // Convert scan errors to validation issues
  for (const error of scanResult.errors) {
    issues.push(createIssue(error.path, error.error, 'error', error.code));
  }

  // Check for duplicate skill names across categories
  const duplicates = findDuplicateNames(scanResult.skills);
  for (const dup of duplicates) {
    const paths = dup.paths.join(', ');
    issues.push(
      createIssue(
        dup.paths[0],
        `Duplicate skill name "${dup.name}" found in: ${paths}`,
        'error',
        'DUPLICATE_NAME'
      )
    );
  }

  // Calculate counts
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  // Unique categories from valid skills
  const uniqueCategories = new Set(scanResult.skills.map((s) => s.category.split('/')[0]));

  return {
    valid: errorCount === 0,
    issues,
    errorCount,
    warningCount,
    infoCount,
    summary: {
      totalSkills: scanResult.totalFound,
      validSkills: scanResult.skills.length,
      categories: uniqueCategories.size,
    },
  };
}

// ============================================================================
// Command Implementation
// ============================================================================

/**
 * Execute the validate command.
 *
 * @param options - Command options
 * @returns Exit code:
 *   0 - success (no errors)
 *   1 - errors found
 *   2 - warnings found and --strict mode enabled
 */
export async function validateCommand(options: ValidateOptions): Promise<number> {
  try {
    const result = await performValidation(options);

    // Format and print output
    const output = options.json ? formatJson(result) : formatHumanReadable(result);
    console.log(output);

    // Determine exit code
    if (result.errorCount > 0) {
      return 1;
    }

    if (options.strict && result.warningCount > 0) {
      return 2;
    }

    return 0;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error validating content: ${message}`);
    return 1;
  }
}
