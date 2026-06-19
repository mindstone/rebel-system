#!/usr/bin/env node

/**
 * Download Skill Script
 *
 * Downloads a skill folder from a GitHub repository with security protections.
 * Part of the install-skill-from-marketplace skill.
 *
 * Usage:
 *   node download_skill.js \
 *     --repo "owner/repo" \
 *     --path "skills/skill-name" \
 *     --branch "main" \
 *     --adm-zip-path "/path/to/node_modules/adm-zip"
 *
 * Output (JSON to stdout):
 *   Success: { success: true, path: "/tmp/skill-xyz/skill-name", archive_sha256: "...", files: [...], provenance_path: "..." }
 *   Failure: { success: false, error: "error message" }
 *
 * Exit codes:
 *   0 - Success
 *   1 - Failure
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { parseArgs } from 'node:util';
import { createRequire } from 'node:module';

// =============================================================================
// Constants
// =============================================================================

const MAX_ARCHIVE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 1000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB uncompressed

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
 * Compute SHA256 hash of a buffer
 * @param {Buffer} buffer - Data to hash
 * @returns {string} Hex-encoded SHA256 hash
 */
function computeSha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Check if a path is safely within the target directory (zip-slip protection)
 * @param {string} entryPath - Path from ZIP entry
 * @param {string} targetDir - Target extraction directory
 * @returns {boolean} True if path is safe
 */
function isPathSafe(entryPath, targetDir) {
  const resolved = path.resolve(targetDir, entryPath);
  // Must be exactly the target or start with target + separator
  return resolved === targetDir || resolved.startsWith(targetDir + path.sep);
}

/**
 * Check if a ZIP entry might be a symlink (heuristic)
 * Note: ZIP symlink detection is unreliable - this is defense-in-depth
 * @param {object} entry - AdmZip entry object
 * @returns {boolean} True if entry looks suspicious (might be symlink)
 */
function isSuspiciousEntry(entry) {
  // Check for symlink mode bits in external attributes
  // Unix symlinks have mode 0o120000 in high 16 bits
  const attr = entry.header?.attr || 0;
  const externalAttr = attr >>> 16;
  const fileMode = externalAttr & 0o770000;

  // 0o120000 = symlink
  if (fileMode === 0o120000) {
    return true;
  }

  // Also check for suspicious path patterns
  const entryName = entry.entryName || '';
  if (entryName.includes('..') || entryName.startsWith('/')) {
    return true;
  }

  return false;
}

/**
 * Parse GitHub repo string
 * @param {string} repo - Repo string like "owner/repo"
 * @returns {{ owner: string, repo: string } | null}
 */
function parseRepo(repo) {
  const match = repo.match(/^([^/]+)\/([^/]+)$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

// =============================================================================
// Main Download Function
// =============================================================================

/**
 * Download and extract a skill from GitHub
 * @param {object} options
 * @param {string} options.repo - GitHub repo (owner/repo)
 * @param {string} options.skillPath - Path to skill folder within repo
 * @param {string} options.branch - Branch name
 * @param {string} options.admZipPath - Path to adm-zip module
 */
async function downloadSkill({ repo, skillPath, branch, admZipPath }) {
  // Parse repo
  const parsed = parseRepo(repo);
  if (!parsed) {
    throw new Error(`Invalid repo format: "${repo}". Expected "owner/repo"`);
  }

  // Load adm-zip from specified path using createRequire (CommonJS module)
  let AdmZip;
  try {
    // adm-zip is a CommonJS module, use createRequire to load it
    const require = createRequire(import.meta.url);
    AdmZip = require(admZipPath);
  } catch (err) {
    throw new Error(`Failed to load adm-zip from "${admZipPath}": ${err.message}`);
  }

  // Construct download URL
  const downloadUrl = `https://codeload.github.com/${parsed.owner}/${parsed.repo}/zip/refs/heads/${branch}`;

  // Download the ZIP archive
  let response;
  try {
    response = await fetch(downloadUrl);
  } catch (err) {
    throw new Error(`Network error downloading from GitHub: ${err.message}`);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Repository or branch not found: ${repo} (branch: ${branch})`);
    }
    throw new Error(`GitHub download failed with status ${response.status}: ${response.statusText}`);
  }

  // Check content-length if available
  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_ARCHIVE_SIZE) {
    throw new Error(`Archive too large: ${contentLength} bytes exceeds ${MAX_ARCHIVE_SIZE} byte limit`);
  }

  // Read response body into buffer
  const arrayBuffer = await response.arrayBuffer();
  const archiveBuffer = Buffer.from(arrayBuffer);

  // Check actual size
  if (archiveBuffer.length > MAX_ARCHIVE_SIZE) {
    throw new Error(`Archive too large: ${archiveBuffer.length} bytes exceeds ${MAX_ARCHIVE_SIZE} byte limit`);
  }

  // Compute archive hash before extraction
  const archiveSha256 = computeSha256(archiveBuffer);

  // Load ZIP
  let zip;
  try {
    zip = new AdmZip(archiveBuffer);
  } catch (err) {
    throw new Error(`Failed to parse ZIP archive: ${err.message}`);
  }

  const entries = zip.getEntries();

  // GitHub ZIP structure: {repo}-{branch}/ prefix
  // e.g., "skills-main/skills/pdf/SKILL.md"
  const expectedPrefix = `${parsed.repo}-${branch}/`;

  // Find entries that match the skill path
  // Normalize skill path (remove leading/trailing slashes)
  const normalizedSkillPath = skillPath.replace(/^\/+|\/+$/g, '');
  const fullPrefix = `${expectedPrefix}${normalizedSkillPath}/`;

  // Filter entries to extract
  const entriesToExtract = entries.filter((entry) => {
    const name = entry.entryName;
    // Must start with our target prefix
    return name.startsWith(fullPrefix);
  });

  if (entriesToExtract.length === 0) {
    throw new Error(`Skill path "${skillPath}" not found in repository ${repo}`);
  }

  // Check file count limit
  if (entriesToExtract.length > MAX_FILES) {
    throw new Error(`Too many files: ${entriesToExtract.length} exceeds ${MAX_FILES} file limit`);
  }

  // Create isolated temp directory
  const tempId = crypto.randomUUID();
  const tempDir = path.join(os.tmpdir(), `skill-${tempId}`);
  fs.mkdirSync(tempDir, { recursive: true });

  // Wrap extraction in try-catch to ensure cleanup on failure
  let extractTarget;
  let extractedFiles;
  try {
    // Extract skill to temp directory
    const skillName = path.basename(normalizedSkillPath);
    extractTarget = path.join(tempDir, skillName);
    fs.mkdirSync(extractTarget, { recursive: true });

    extractedFiles = [];
    let fileCount = 0;

    for (const entry of entriesToExtract) {
      // Skip directories
      if (entry.isDirectory) {
        continue;
      }

      // Check for suspicious entries (symlinks)
      if (isSuspiciousEntry(entry)) {
        // Skip suspicious entries silently (defense-in-depth)
        continue;
      }

      // Calculate relative path within skill folder
      const relativePath = entry.entryName.slice(fullPrefix.length);
      if (!relativePath) {
        continue;
      }

      // Zip-slip protection
      const targetPath = path.join(extractTarget, relativePath);
      if (!isPathSafe(targetPath, extractTarget)) {
        throw new Error(`Zip-slip attack detected: "${relativePath}" escapes target directory`);
      }

      // Check uncompressed size from header
      const uncompressedSize = entry.header?.size || 0;
      if (uncompressedSize > MAX_FILE_SIZE) {
        throw new Error(`File too large: "${relativePath}" is ${uncompressedSize} bytes (limit: ${MAX_FILE_SIZE})`);
      }

      // Create parent directories
      const targetDir = path.dirname(targetPath);
      fs.mkdirSync(targetDir, { recursive: true });

      // Extract file
      const content = entry.getData();

      // Verify actual size matches header (defense against malformed ZIPs)
      if (content.length > MAX_FILE_SIZE) {
        throw new Error(`File too large after decompression: "${relativePath}" is ${content.length} bytes (limit: ${MAX_FILE_SIZE})`);
      }

      fs.writeFileSync(targetPath, content);

      extractedFiles.push(relativePath);
      fileCount++;

      // Double-check file count (defensive)
      if (fileCount > MAX_FILES) {
        throw new Error(`Too many files extracted: ${fileCount} exceeds ${MAX_FILES} limit`);
      }
    }

    if (extractedFiles.length === 0) {
      throw new Error(`No files found in skill path "${skillPath}"`);
    }

    // Create initial provenance log
    const provenance = {
      schema_version: '1.0',
      installed_at: null, // Will be set by install script
      installed_by: null, // Will be set by install script
      installer_context: {
        app_version: null, // Will be set by install script
        skill_version: '1.0.0',
        platform: process.platform,
        arch: process.arch,
      },
      source: {
        type: 'github',
        repo: repo,
        path: skillPath,
        branch: branch,
        commit_sha: null,
        commit_sha_note: 'unavailable - unauthenticated download via codeload.github.com',
        download_url: downloadUrl,
      },
      archive: {
        sha256: archiveSha256,
        bytes: archiveBuffer.length,
        downloaded_at: new Date().toISOString(),
      },
      installer_skill: 'install-skill-from-marketplace',
      discovery: null, // Will be populated by orchestrator
      security_review: null, // Will be populated by install script
    };

    const provenancePath = path.join(extractTarget, '.skill-provenance.json');
    fs.writeFileSync(provenancePath, JSON.stringify(provenance, null, 2), 'utf-8');

    return {
      success: true,
      path: extractTarget,
      archive_sha256: archiveSha256,
      files: extractedFiles.sort(),
      provenance_path: provenancePath,
    };
  } catch (err) {
    // Clean up temp directory on any extraction failure
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
    throw err;
  }
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
        repo: { type: 'string' },
        path: { type: 'string' },
        branch: { type: 'string', default: 'main' },
        'adm-zip-path': { type: 'string' },
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
Download Skill Script

Downloads a skill folder from a GitHub repository with security protections.

Usage:
  node download_skill.js --repo <owner/repo> --path <skill-path> [--branch <branch>] --adm-zip-path <path>

Options:
  --repo           GitHub repository (owner/repo format) [required]
  --path           Path to skill folder within repo [required]
  --branch         Branch name (default: main)
  --adm-zip-path   Path to adm-zip module [required]
  -h, --help       Show this help

Example:
  node download_skill.js \\
    --repo "anthropics/skills" \\
    --path "skills/pdf" \\
    --branch "main" \\
    --adm-zip-path "/app/node_modules/adm-zip"
`);
    process.exit(0);
  }

  // Validate required arguments
  if (!values.repo) {
    outputError('Missing required argument: --repo');
  }
  if (!values.path) {
    outputError('Missing required argument: --path');
  }
  if (!values['adm-zip-path']) {
    outputError('Missing required argument: --adm-zip-path');
  }

  // Execute download
  try {
    const result = await downloadSkill({
      repo: values.repo,
      skillPath: values.path,
      branch: values.branch || 'main',
      admZipPath: values['adm-zip-path'],
    });
    outputResult(result, true);
  } catch (err) {
    outputError(err.message);
  }
}

main();
