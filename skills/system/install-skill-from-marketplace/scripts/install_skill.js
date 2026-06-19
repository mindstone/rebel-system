#!/usr/bin/env node

/**
 * Install Skill Script
 *
 * Validates and installs a downloaded skill to the target location.
 * Part of the install-skill-from-marketplace skill.
 *
 * Usage:
 *   echo '{"security_review": {...}}' | node install_skill.js \
 *     --source "/tmp/skill-xyz/skill-name" \
 *     --target "/path/to/skills/skill-name"
 *
 * Security review JSON is read from stdin and merged into provenance.
 *
 * Output (JSON to stdout):
 *   Success: { success: true, installed: "/path/to/skills/skill-name", provenance: "/path/to/.skill-provenance.json" }
 *   Failure: { success: false, error: "error message" }
 *
 * Exit codes:
 *   0 - Success
 *   1 - Failure
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseArgs } from 'node:util';

// =============================================================================
// Helpers
// =============================================================================

/**
 * Output JSON result and exit
 * @param {object} result - Result object to output
 * @param {boolean} success - Whether operation succeeded
 */
function outputResult(result, success) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(success ? 0 : 1);
}

/**
 * Output error and exit with code 1
 * @param {string} message - Error message
 */
function outputError(message) {
  outputResult({ success: false, error: message }, false);
}

/**
 * Read all data from stdin
 * @returns {Promise<string>}
 */
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

/**
 * Validate SKILL.md frontmatter
 * @param {string} content - File content
 * @returns {{ valid: boolean, name?: string, description?: string, error?: string }}
 */
function validateFrontmatter(content) {
  // Check for frontmatter delimiters
  if (!content.startsWith('---')) {
    return { valid: false, error: 'No YAML frontmatter found (must start with ---)' };
  }

  // Extract frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return { valid: false, error: 'Invalid frontmatter format (missing closing ---)' };
  }

  const frontmatter = match[1];

  // Check required fields
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  if (!nameMatch) {
    return { valid: false, error: "Missing required 'name' field in frontmatter" };
  }

  const descMatch = frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  if (!descMatch) {
    return { valid: false, error: "Missing required 'description' field in frontmatter" };
  }

  const name = nameMatch[1].trim().replace(/^["']|["']$/g, '');
  const description = descMatch[1].trim();

  // Validate name format (hyphen-case)
  if (!/^[a-z0-9-]+$/.test(name)) {
    return {
      valid: false,
      error: `Invalid name format: "${name}". Must be hyphen-case (lowercase letters, digits, and hyphens only)`,
    };
  }

  // Check for consecutive hyphens or leading/trailing hyphens
  if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
    return {
      valid: false,
      error: `Invalid name format: "${name}". Cannot start/end with hyphen or contain consecutive hyphens`,
    };
  }

  return { valid: true, name, description };
}

/**
 * Copy directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// =============================================================================
// Main Install Function
// =============================================================================

/**
 * Install a skill from source to target
 * @param {object} options
 * @param {string} options.source - Source directory (downloaded skill)
 * @param {string} options.target - Target directory
 * @param {object} options.securityReview - Security review data from stdin
 */
async function installSkill({ source, target, securityReview }) {
  // Validate source exists
  if (!fs.existsSync(source)) {
    throw new Error(`Source directory does not exist: ${source}`);
  }

  // Validate SKILL.md exists
  const skillMdPath = path.join(source, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    throw new Error(`SKILL.md not found in source: ${source}`);
  }

  // Validate SKILL.md frontmatter
  const skillMdContent = fs.readFileSync(skillMdPath, 'utf-8');
  const validation = validateFrontmatter(skillMdContent);
  if (!validation.valid) {
    throw new Error(`Invalid SKILL.md: ${validation.error}`);
  }

  // Validate provenance exists (created by download script)
  const provenancePath = path.join(source, '.skill-provenance.json');
  if (!fs.existsSync(provenancePath)) {
    throw new Error(`.skill-provenance.json not found in source. Was this skill downloaded with download_skill.js?`);
  }

  // Check target doesn't exist (no overwrites)
  if (fs.existsSync(target)) {
    throw new Error(`Target already exists: ${target}. Remove it first if you want to reinstall.`);
  }

  // Check target parent exists
  const targetParent = path.dirname(target);
  if (!fs.existsSync(targetParent)) {
    throw new Error(`Target parent directory does not exist: ${targetParent}`);
  }

  // Load and update provenance
  let provenance;
  try {
    provenance = JSON.parse(fs.readFileSync(provenancePath, 'utf-8'));
  } catch (err) {
    throw new Error(`Failed to read provenance: ${err.message}`);
  }

  // Update provenance with install details
  provenance.installed_at = new Date().toISOString();
  provenance.installed_by = process.env.USER || process.env.USERNAME || 'unknown';

  // Add security review to provenance
  if (securityReview) {
    provenance.security_review = securityReview;
  }

  // Write updated provenance back to source (will be copied)
  fs.writeFileSync(provenancePath, JSON.stringify(provenance, null, 2), 'utf-8');

  // Atomic install: copy to staging directory then rename
  // Staging dir is in same parent as target for same-filesystem rename
  const stagingDir = path.join(targetParent, `.staging-${path.basename(target)}-${Date.now()}`);

  try {
    // Copy to staging
    copyDirRecursive(source, stagingDir);

    // Rename to final target (atomic on same filesystem)
    fs.renameSync(stagingDir, target);
  } catch (err) {
    // Clean up staging on error
    if (fs.existsSync(stagingDir)) {
      fs.rmSync(stagingDir, { recursive: true, force: true });
    }
    throw new Error(`Failed to install skill: ${err.message}`);
  }

  // Clean up source temp directory (only if it's in system temp and looks like our temp pattern)
  try {
    // Go up one level to get the temp root (source is like /tmp/skill-uuid/skill-name)
    const tempRoot = path.dirname(source);
    const osTempDir = os.tmpdir();
    const baseName = path.basename(tempRoot);
    // Only clean up if:
    // 1. It's different from source (not already at root)
    // 2. It's directly under system temp dir
    // 3. Basename starts with 'skill-' (matches our UUID pattern)
    if (
      tempRoot !== source &&
      path.dirname(tempRoot) === osTempDir &&
      baseName.startsWith('skill-')
    ) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup errors - not critical
  }

  return {
    success: true,
    installed: target,
    provenance: path.join(target, '.skill-provenance.json'),
    skill_name: validation.name,
  };
}

// =============================================================================
// CLI Entry Point
// =============================================================================

async function main() {
  // Parse command-line arguments
  let args;
  try {
    args = parseArgs({
      options: {
        source: { type: 'string' },
        target: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
      strict: true,
    });
  } catch (err) {
    outputError(`Invalid arguments: ${err.message}`);
  }

  const { values } = args;

  // Show help
  if (values.help) {
    console.log(`
Install Skill Script

Validates and installs a downloaded skill to the target location.

Usage:
  echo '{"security_review": {...}}' | node install_skill.js --source <path> --target <path>

Options:
  --source    Path to downloaded skill directory [required]
  --target    Path where skill should be installed [required]
  -h, --help  Show this help

The security review JSON is read from stdin and merged into the skill's provenance log.

Example:
  echo '{"reviewer":"gpt5.2","findings":{...}}' | node install_skill.js \\
    --source "/tmp/skill-abc123/pdf" \\
    --target "/Users/me/spaces/Chief-of-Staff/skills/pdf"
`);
    process.exit(0);
  }

  // Validate required arguments
  if (!values.source) {
    outputError('Missing required argument: --source');
  }
  if (!values.target) {
    outputError('Missing required argument: --target');
  }

  // Read security review from stdin (may be empty)
  // Expects {"security_review": {...}} wrapper - extract the security_review field
  let securityReview = null;
  try {
    const stdinData = await readStdin();
    if (stdinData.trim()) {
      const parsed = JSON.parse(stdinData);
      // Accept either {"security_review": {...}} wrapper or direct object
      securityReview = parsed.security_review ?? parsed;
    }
  } catch (err) {
    outputError(`Invalid JSON on stdin: ${err.message}`);
  }

  // Execute install
  try {
    const result = await installSkill({
      source: values.source,
      target: values.target,
      securityReview,
    });
    outputResult(result, true);
  } catch (err) {
    outputError(err.message);
  }
}

main();
