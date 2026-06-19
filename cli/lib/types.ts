/**
 * Shared TypeScript types for rebel-system CLI
 *
 * These types define the data structures used across the CLI commands
 * for skill discovery, validation, and execution.
 */

// ============================================================================
// Constants
// ============================================================================

/** Default Claude model for run command */
export const DEFAULT_MODEL = 'claude-sonnet-4-20250514';

// ============================================================================
// Frontmatter Types
// ============================================================================

/**
 * Raw frontmatter parsed from a SKILL.md file.
 * Contains all possible fields that may appear in skill frontmatter.
 */
export interface SkillFrontmatter {
  /** Required: Must match folder name, lowercase-hyphen-case */
  name: string;
  /** Required: When Claude should use this skill */
  description: string;
  /** Optional: Recommended model alias/profile for this skill */
  model?: string;
  /** Optional: Recommended thinking effort */
  effort?: 'low' | 'medium' | 'high' | 'max';
  /** Optional: License file reference */
  license?: string;
  /** Optional: ISO date string of last update */
  last_updated?: string;
  /** Optional: Type of agent (main_agent, subagent) */
  agent_type?: 'main_agent' | 'subagent' | string;
  /** Optional: Example use cases */
  use_cases?: string[];
  /** Optional: Required tools/MCP servers */
  tools_required?: string[];
  /** Optional: Skill dependencies */
  dependencies?: string[];
}

/**
 * Result of parsing frontmatter from a markdown file.
 */
export interface FrontmatterParseResult<T = Record<string, unknown>> {
  /** Whether frontmatter was found */
  found: boolean;
  /** Parsed frontmatter data (empty object if not found) */
  data: T;
  /** Raw frontmatter string (empty if not found) */
  raw: string;
  /** Content after the frontmatter block */
  content: string;
}

// ============================================================================
// Skill Types
// ============================================================================

/**
 * Metadata for a discovered skill.
 */
export interface SkillMetadata {
  /** Skill name from frontmatter (should match folder name) */
  name: string;
  /** Skill description from frontmatter */
  description: string;
  /** Category (parent folder name, e.g., 'documentation', 'coding') */
  category: string;
  /** Relative path from rebel-system root (e.g., 'skills/documentation/write-skill') */
  path: string;
  /** Absolute path to skill folder */
  absolutePath: string;
  /** Full parsed frontmatter */
  frontmatter: SkillFrontmatter;
}

/**
 * A skill that failed to parse or validate.
 */
export interface SkillError {
  /** Relative path to the skill folder */
  path: string;
  /** Absolute path to the skill folder */
  absolutePath: string;
  /** Error message describing what went wrong */
  error: string;
  /** Error code for programmatic handling */
  code: SkillErrorCode;
}

/**
 * Error codes for skill validation failures.
 */
export type SkillErrorCode =
  | 'MISSING_SKILL_MD'
  | 'EMPTY_SKILL_MD'
  | 'MISSING_FRONTMATTER'
  | 'MISSING_NAME'
  | 'MISSING_DESCRIPTION'
  | 'NAME_MISMATCH'
  | 'INVALID_NAME_FORMAT'
  | 'PARSE_ERROR';

// ============================================================================
// Scanner Types
// ============================================================================

/**
 * Options for the skill scanner.
 */
export interface ScannerOptions {
  /** Root directory of rebel-system (defaults to derived from script location) */
  rootPath?: string;
  /** Only scan specific categories */
  categories?: string[];
  /** Include skills with validation errors in results */
  includeInvalid?: boolean;
}

/**
 * Result of scanning the skills directory.
 */
export interface ScanResult {
  /** Successfully parsed skills */
  skills: SkillMetadata[];
  /** Skills that failed to parse or validate */
  errors: SkillError[];
  /** Total number of skill folders found */
  totalFound: number;
  /** Root path that was scanned */
  rootPath: string;
  /** Categories that were scanned */
  categories: string[];
}

/**
 * A skill grouped by category for display purposes.
 */
export interface CategoryGroup {
  /** Category name */
  name: string;
  /** Skills in this category */
  skills: SkillMetadata[];
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Severity level for validation issues.
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * A single validation issue.
 */
export interface ValidationIssue {
  /** Path to the file/folder with the issue */
  path: string;
  /** Human-readable message */
  message: string;
  /** Issue severity */
  severity: ValidationSeverity;
  /** Error code for programmatic handling */
  code: string;
}

/**
 * Result of validating rebel-system content.
 */
export interface ValidationResult {
  /** Whether validation passed (no errors) */
  valid: boolean;
  /** All validation issues found */
  issues: ValidationIssue[];
  /** Count of errors */
  errorCount: number;
  /** Count of warnings */
  warningCount: number;
  /** Count of info messages */
  infoCount: number;
  /** Summary statistics */
  summary: {
    totalSkills: number;
    validSkills: number;
    categories: number;
  };
}

// ============================================================================
// CLI Types
// ============================================================================

/**
 * Common CLI options shared across commands.
 */
export interface CommonCliOptions {
  /** Output as JSON instead of human-readable format */
  json?: boolean;
  /** Override rebel-system root path */
  root?: string;
}

/**
 * Options for the 'list' command.
 */
export interface ListOptions extends CommonCliOptions {
  /** Output flat list instead of grouped by category */
  flat?: boolean;
  /** Filter by specific category */
  category?: string;
}

/**
 * Options for the 'validate' command.
 */
export interface ValidateOptions extends CommonCliOptions {
  /** Treat warnings as errors */
  strict?: boolean;
}

/**
 * Options for the 'run' command.
 */
export interface RunOptions extends CommonCliOptions {
  /** Claude model to use */
  model?: string;
  /** Additional context file to append to message */
  context?: string;
  /** Show composed prompt without calling Claude */
  dryRun?: boolean;
  /** Wait for complete response instead of streaming */
  noStream?: boolean;
  /** Workspace path for context */
  workspace?: string;
  /** Path to Chief-of-Staff file */
  chiefOfStaff?: string;
  /** Path to spaces JSON file */
  spaces?: string;
  /** Path to packages JSON file */
  packages?: string;
  /** User-set success criterion; renders into AGENTS.md as a dominant stop signal */
  finishLine?: string;
}
