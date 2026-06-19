/**
 * Skill Directory Scanner
 *
 * Scans the rebel-system/skills directory to discover all skills,
 * parse their frontmatter, and return structured metadata.
 *
 * Handles:
 * - Recursive directory traversal
 * - Symlink detection and skipping
 * - Frontmatter parsing and validation
 * - Error collection for invalid skills
 */

import { readdir, readFile, stat, lstat } from 'node:fs/promises';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseSkillFrontmatter, validateSkillFrontmatter, validateSkillName } from './frontmatter.js';
import type {
  CategoryGroup,
  ScannerOptions,
  ScanResult,
  SkillError,
  SkillErrorCode,
  SkillMetadata,
} from './types.js';

// ============================================================================
// Path Resolution
// ============================================================================

/**
 * Get the rebel-system root path.
 *
 * Algorithm:
 * - This file is at: rebel-system/cli/lib/scanner.ts
 * - So root is: rebel-system/
 *
 * @returns Absolute path to rebel-system root
 */
export function getRebelSystemRoot(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // lib/ -> cli/ -> rebel-system/
  return resolve(__dirname, '..', '..');
}

/**
 * Get the skills directory path.
 *
 * @param rootPath - Optional override for rebel-system root
 * @returns Absolute path to skills directory
 */
export function getSkillsPath(rootPath?: string): string {
  const root = rootPath ?? getRebelSystemRoot();
  return join(root, 'skills');
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a path is a symlink.
 *
 * @param filePath - Path to check
 * @returns True if the path is a symlink
 */
async function isSymlink(filePath: string): Promise<boolean> {
  try {
    const stats = await lstat(filePath);
    return stats.isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * Check if a directory exists and is accessible.
 *
 * @param dirPath - Path to check
 * @returns True if the directory exists
 */
async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a file exists and is accessible.
 *
 * @param filePath - Path to check
 * @returns True if the file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stats = await stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Create a SkillError object.
 *
 * @param skillPath - Relative path to skill folder
 * @param absolutePath - Absolute path to skill folder
 * @param error - Error message
 * @param code - Error code
 * @returns SkillError object
 */
function createError(
  skillPath: string,
  absolutePath: string,
  error: string,
  code: SkillErrorCode
): SkillError {
  return { path: skillPath, absolutePath, error, code };
}

// ============================================================================
// Skill Parsing
// ============================================================================

/**
 * Parse a single skill from its directory.
 *
 * @param skillDir - Absolute path to skill directory
 * @param category - Category name (parent folder)
 * @returns SkillMetadata on success, SkillError on failure
 */
async function parseSkill(
  skillDir: string,
  category: string
): Promise<SkillMetadata | SkillError> {
  const skillName = basename(skillDir);
  const relativePath = join('skills', category, skillName);
  const skillMdPath = join(skillDir, 'SKILL.md');

  // Check SKILL.md exists
  if (!(await fileExists(skillMdPath))) {
    return createError(relativePath, skillDir, 'SKILL.md not found', 'MISSING_SKILL_MD');
  }

  // Read SKILL.md content
  let content: string;
  try {
    content = await readFile(skillMdPath, 'utf-8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return createError(relativePath, skillDir, `Failed to read SKILL.md: ${message}`, 'PARSE_ERROR');
  }

  // Check for empty file
  if (!content.trim()) {
    return createError(relativePath, skillDir, 'SKILL.md is empty', 'EMPTY_SKILL_MD');
  }

  // Parse frontmatter
  const parseResult = parseSkillFrontmatter(content);

  if (!parseResult.found) {
    return createError(relativePath, skillDir, 'No frontmatter found in SKILL.md', 'MISSING_FRONTMATTER');
  }

  // Validate required fields
  const validation = validateSkillFrontmatter(parseResult.data);
  if (!validation.valid) {
    // Check for invalid types first
    if (validation.invalidFields.includes('name')) {
      return createError(relativePath, skillDir, 'Field "name" must be a string', 'INVALID_NAME_FORMAT');
    }
    if (validation.invalidFields.includes('description')) {
      return createError(relativePath, skillDir, 'Field "description" must be a string', 'MISSING_DESCRIPTION');
    }
    // Then check for missing fields
    if (validation.missingFields.includes('name')) {
      return createError(relativePath, skillDir, 'Missing required field: name', 'MISSING_NAME');
    }
    if (validation.missingFields.includes('description')) {
      return createError(
        relativePath,
        skillDir,
        'Missing required field: description',
        'MISSING_DESCRIPTION'
      );
    }
  }

  const frontmatter = parseResult.data;

  // Validate name format
  const nameValidation = validateSkillName(frontmatter.name);
  if (!nameValidation.valid) {
    return createError(
      relativePath,
      skillDir,
      `Invalid name format: ${nameValidation.error}`,
      'INVALID_NAME_FORMAT'
    );
  }

  // Validate name matches folder
  if (frontmatter.name !== skillName) {
    return createError(
      relativePath,
      skillDir,
      `Name mismatch: frontmatter has "${frontmatter.name}", folder is "${skillName}"`,
      'NAME_MISMATCH'
    );
  }

  return {
    name: frontmatter.name,
    description: frontmatter.description,
    category,
    path: relativePath,
    absolutePath: skillDir,
    frontmatter,
  };
}

// ============================================================================
// Directory Scanning
// ============================================================================

/**
 * Scan a single category directory for skills.
 *
 * @param categoryDir - Absolute path to category directory
 * @param categoryName - Category name
 * @param rootPath - Rebel-system root path
 * @returns Arrays of skills and errors found
 */
async function scanCategory(
  categoryDir: string,
  categoryName: string,
  rootPath: string
): Promise<{ skills: SkillMetadata[]; errors: SkillError[] }> {
  const skills: SkillMetadata[] = [];
  const errors: SkillError[] = [];

  let entries: string[];
  try {
    entries = await readdir(categoryDir);
  } catch {
    return { skills, errors };
  }

  // Sort for consistent ordering
  entries.sort();

  for (const entry of entries) {
    // Skip hidden files/folders
    if (entry.startsWith('.')) continue;

    const entryPath = join(categoryDir, entry);

    // Skip symlinks (like CLAUDE.md)
    if (await isSymlink(entryPath)) continue;

    // Check if it's a directory (potential skill)
    if (!(await directoryExists(entryPath))) continue;

    // Check for nested categories (e.g., Anthropic-official-skills/document-skills)
    // A nested category would have subdirectories with SKILL.md files
    const hasSkillMd = await fileExists(join(entryPath, 'SKILL.md'));

    if (hasSkillMd) {
      // This is a skill directory
      const result = await parseSkill(entryPath, categoryName);
      if ('error' in result) {
        errors.push(result);
      } else {
        skills.push(result);
      }
    } else {
      // This might be a nested category - scan recursively
      const nestedCategory = `${categoryName}/${entry}`;
      const nested = await scanCategory(entryPath, nestedCategory, rootPath);
      
      if (nested.skills.length > 0 || nested.errors.length > 0) {
        // Found skills/errors in subdirectories - this is a valid nested category
        skills.push(...nested.skills);
        errors.push(...nested.errors);
      } else {
        // No skills found in subdirectories and no SKILL.md here
        // This might be an empty category (allowed) or a broken skill folder
        // Check if it looks like a skill folder (has hyphenated name typical of skills)
        const looksLikeSkillFolder = /^[a-z][a-z0-9-]*$/.test(entry) && entry.includes('-');
        if (looksLikeSkillFolder) {
          // Warn about potential missing SKILL.md
          const relativePath = join('skills', categoryName, entry);
          errors.push(createError(
            relativePath,
            entryPath,
            'Directory looks like a skill folder but has no SKILL.md',
            'MISSING_SKILL_MD'
          ));
        }
        // Otherwise it's probably just an empty category or utility folder - ignore
      }
    }
  }

  return { skills, errors };
}

/**
 * Scan the skills directory and return all discovered skills.
 *
 * @param options - Scanner options
 * @returns Scan result with skills, errors, and statistics
 */
export async function scanSkills(options: ScannerOptions = {}): Promise<ScanResult> {
  const rootPath = options.rootPath ?? getRebelSystemRoot();
  const skillsPath = getSkillsPath(rootPath);

  const allSkills: SkillMetadata[] = [];
  const allErrors: SkillError[] = [];
  const scannedCategories: string[] = [];

  // Verify skills directory exists
  if (!(await directoryExists(skillsPath))) {
    return {
      skills: [],
      errors: [],
      totalFound: 0,
      rootPath,
      categories: [],
    };
  }

  // Get category directories
  let categoryEntries: string[];
  try {
    categoryEntries = await readdir(skillsPath);
  } catch {
    return {
      skills: [],
      errors: [],
      totalFound: 0,
      rootPath,
      categories: [],
    };
  }

  // Sort for consistent ordering
  categoryEntries.sort();

  for (const entry of categoryEntries) {
    // Skip hidden files, README, etc.
    if (entry.startsWith('.') || entry === 'README.md') continue;

    const categoryPath = join(skillsPath, entry);

    // Skip symlinks
    if (await isSymlink(categoryPath)) continue;

    // Must be a directory
    if (!(await directoryExists(categoryPath))) continue;

    // Filter by category if specified
    // Support both exact match (e.g., "documentation") and nested category prefix (e.g., "Anthropic-official-skills/document-skills")
    if (options.categories) {
      const matchesCategory = options.categories.some(cat => 
        cat === entry || cat.startsWith(`${entry}/`)
      );
      if (!matchesCategory) {
        continue;
      }
    }

    scannedCategories.push(entry);
    const { skills, errors } = await scanCategory(categoryPath, entry, rootPath);
    allSkills.push(...skills);
    allErrors.push(...errors);
  }

  // Post-filter for nested categories (e.g., --category Anthropic-official-skills/document-skills)
  // The scan above gets the whole top-level category, so we need to filter to exact matches
  let filteredSkills = allSkills;
  let filteredErrors = allErrors;
  
  if (options.categories) {
    filteredSkills = allSkills.filter(skill => 
      options.categories!.some(cat => skill.category === cat || skill.category.startsWith(`${cat}/`))
    );
    filteredErrors = allErrors.filter(error =>
      options.categories!.some(cat => {
        // Extract category from error path (skills/<category>/<skill-name>)
        const parts = error.path.split('/');
        if (parts.length >= 3) {
          const errorCategory = parts.slice(1, -1).join('/');
          return errorCategory === cat || errorCategory.startsWith(`${cat}/`);
        }
        return false;
      })
    );
  }

  return {
    skills: filteredSkills,
    errors: options.includeInvalid !== false ? filteredErrors : [],
    totalFound: filteredSkills.length + filteredErrors.length,
    rootPath,
    categories: scannedCategories,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Group skills by category for display.
 *
 * @param skills - Array of skill metadata
 * @returns Array of category groups, sorted by category name
 */
export function groupSkillsByCategory(skills: SkillMetadata[]): CategoryGroup[] {
  const groups = new Map<string, SkillMetadata[]>();

  for (const skill of skills) {
    const existing = groups.get(skill.category) ?? [];
    existing.push(skill);
    groups.set(skill.category, existing);
  }

  // Convert to array and sort
  const result: CategoryGroup[] = [];
  for (const [name, categorySkills] of groups) {
    // Sort skills within category by name
    categorySkills.sort((a, b) => a.name.localeCompare(b.name));
    result.push({ name, skills: categorySkills });
  }

  // Sort categories by name
  result.sort((a, b) => a.name.localeCompare(b.name));

  return result;
}

/**
 * Find a skill by name.
 *
 * @param skills - Array of skill metadata
 * @param name - Skill name to find
 * @returns Skill metadata if found, undefined otherwise
 */
export function findSkillByName(skills: SkillMetadata[], name: string): SkillMetadata | undefined {
  return skills.find((s) => s.name === name);
}

/**
 * Check for duplicate skill names across categories.
 *
 * @param skills - Array of skill metadata
 * @returns Array of duplicate names with their locations
 */
export function findDuplicateNames(skills: SkillMetadata[]): Array<{ name: string; paths: string[] }> {
  const nameToSkills = new Map<string, SkillMetadata[]>();

  for (const skill of skills) {
    const existing = nameToSkills.get(skill.name) ?? [];
    existing.push(skill);
    nameToSkills.set(skill.name, existing);
  }

  const duplicates: Array<{ name: string; paths: string[] }> = [];
  for (const [name, group] of nameToSkills) {
    if (group.length > 1) {
      duplicates.push({ name, paths: group.map((s) => s.path) });
    }
  }

  return duplicates;
}
