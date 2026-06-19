/**
 * YAML Frontmatter Parser
 *
 * Parses YAML frontmatter from markdown files without external dependencies.
 * Based on patterns from scan-md-descriptions.ts but extended for richer parsing.
 *
 * Frontmatter format:
 * ---
 * key: value
 * key2: "quoted value"
 * array_key:
 *   - item1
 *   - item2
 * ---
 */

import type { FrontmatterParseResult, SkillFrontmatter } from './types.js';

/**
 * Extract frontmatter block from markdown content.
 *
 * @param content - Raw markdown content
 * @returns Object with found flag, raw frontmatter, and remaining content
 */
function extractFrontmatterBlock(content: string): {
  found: boolean;
  raw: string;
  content: string;
} {
  // Strip BOM if present (common in Windows/VSCode files)
  const cleanContent = content.replace(/^\uFEFF/, '');
  
  // Frontmatter must start at the very beginning of the file
  const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match) {
    return { found: false, raw: '', content: cleanContent };
  }

  const raw = match[1];
  const remainingContent = cleanContent.slice(match[0].length);

  return { found: true, raw, content: remainingContent };
}

/**
 * Parse a simple YAML value (handles strings, numbers, booleans, inline arrays).
 *
 * @param value - Raw string value from YAML
 * @returns Parsed value
 */
function parseSimpleValue(value: string): string | number | boolean | unknown[] {
  // Strip CRLF artifacts and trim
  const trimmed = value.replace(/\r$/, '').trim();

  // Empty value
  if (!trimmed) {
    return '';
  }

  // Inline empty array: []
  if (trimmed === '[]') {
    return [];
  }

  // Quoted strings
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  // Booleans
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;

  // Numbers
  const num = Number(trimmed);
  if (!isNaN(num) && trimmed !== '') {
    return num;
  }

  // Plain string
  return trimmed;
}

/**
 * Parse YAML frontmatter into an object.
 *
 * Supports:
 * - Simple key: value pairs
 * - Quoted values (single and double quotes)
 * - Arrays with - item syntax
 * - Basic types: string, number, boolean
 *
 * Does NOT support:
 * - Nested objects
 * - Multi-line strings
 * - Complex YAML features (anchors, aliases, etc.)
 *
 * @param yamlContent - Raw YAML string (without --- delimiters)
 * @returns Parsed object
 */
function parseYaml(yamlContent: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yamlContent.split(/\r?\n/);

  let currentKey: string | null = null;
  let currentArray: string[] | null = null;

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      continue;
    }

    // Check for array item (starts with whitespace + dash)
    const arrayItemMatch = line.match(/^\s+-\s*(.*)$/);
    if (arrayItemMatch && currentKey && currentArray !== null) {
      const itemValue = arrayItemMatch[1].trim();
      // Remove quotes from array items
      if (
        (itemValue.startsWith('"') && itemValue.endsWith('"')) ||
        (itemValue.startsWith("'") && itemValue.endsWith("'"))
      ) {
        currentArray.push(itemValue.slice(1, -1));
      } else {
        currentArray.push(itemValue);
      }
      continue;
    }

    // Check for key: value pair
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      continue;
    }

    // If we were building an array, save it before moving on
    if (currentKey && currentArray !== null) {
      result[currentKey] = currentArray;
      currentArray = null;
    }

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1);

    // Skip if key is empty or looks like a nested key
    if (!key || key.startsWith(' ') || key.startsWith('-')) {
      continue;
    }

    currentKey = key;

    // Check if this is the start of an array (empty value after colon)
    if (!value.trim()) {
      currentArray = [];
      continue;
    }

    // Parse as simple value
    result[key] = parseSimpleValue(value);
  }

  // Don't forget to save the last array if we were building one
  if (currentKey && currentArray !== null) {
    result[currentKey] = currentArray;
  }

  return result;
}

/**
 * Parse frontmatter from markdown content.
 *
 * @param content - Raw markdown content
 * @returns Parse result with typed frontmatter data
 */
export function parseFrontmatter<T = Record<string, unknown>>(
  content: string
): FrontmatterParseResult<T> {
  const { found, raw, content: remainingContent } = extractFrontmatterBlock(content);

  if (!found) {
    return {
      found: false,
      data: {} as T,
      raw: '',
      content,
    };
  }

  const data = parseYaml(raw) as T;

  return {
    found: true,
    data,
    raw,
    content: remainingContent,
  };
}

/**
 * Parse frontmatter specifically for SKILL.md files.
 *
 * @param content - Raw SKILL.md content
 * @returns Parse result with SkillFrontmatter type
 */
export function parseSkillFrontmatter(content: string): FrontmatterParseResult<SkillFrontmatter> {
  return parseFrontmatter<SkillFrontmatter>(content);
}

/**
 * Validate that a skill frontmatter has required fields.
 *
 * @param frontmatter - Parsed frontmatter object
 * @returns Object with valid flag and list of missing/invalid fields
 */
export function validateSkillFrontmatter(frontmatter: Partial<SkillFrontmatter>): {
  valid: boolean;
  missingFields: string[];
  invalidFields: string[];
} {
  const requiredFields = ['name', 'description'] as const;
  const missingFields: string[] = [];
  const invalidFields: string[] = [];

  for (const field of requiredFields) {
    const value = frontmatter[field];
    
    // Check if field is missing or empty
    if (value === undefined || value === null || value === '') {
      missingFields.push(field);
      continue;
    }
    
    // Check if field is the correct type (must be string)
    if (typeof value !== 'string') {
      invalidFields.push(field);
      continue;
    }
    
    // Check if string is empty after trimming
    if (!value.trim()) {
      missingFields.push(field);
    }
  }

  return {
    valid: missingFields.length === 0 && invalidFields.length === 0,
    missingFields,
    invalidFields,
  };
}

/**
 * Validate skill name format according to Anthropic Agent Skills Spec.
 *
 * Rules:
 * - Lowercase letters, numbers, and hyphens only
 * - Cannot start or end with a hyphen
 * - Cannot have consecutive hyphens
 *
 * @param name - Skill name to validate
 * @returns Object with valid flag and error message if invalid
 */
export function validateSkillName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name) {
    return { valid: false, error: 'Name is empty' };
  }

  // Check for valid characters
  if (!/^[a-z0-9-]+$/.test(name)) {
    return {
      valid: false,
      error: 'Name must contain only lowercase letters, numbers, and hyphens',
    };
  }

  // Check for leading/trailing hyphens
  if (name.startsWith('-') || name.endsWith('-')) {
    return { valid: false, error: 'Name cannot start or end with a hyphen' };
  }

  // Check for consecutive hyphens
  if (name.includes('--')) {
    return { valid: false, error: 'Name cannot have consecutive hyphens' };
  }

  return { valid: true };
}
