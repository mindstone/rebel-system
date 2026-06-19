#!/usr/bin/env node

/**
 * Limitless Export Importer
 * Imports transcripts from a Limitless data export zip into Rebel-compatible markdown.
 * 
 * Usage:
 *   node import-export.cjs <input> [options]
 * 
 * Input can be:
 *   - Path to export zip file (e.g., ~/Desktop/data-export_2025-12-07.zip)
 *   - Path to already-extracted folder
 * 
 * Options:
 *   --output DIR       Output directory (default: ./output)
 *   --include-chats    Process Ask AI chat exports
 *   --force            Overwrite existing files
 *   --dry-run          Show what would be done without writing
 * 
 * Note: Audio import (--include-audio) is not yet implemented.
 * Audio files are fragmented and would need concatenation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: null,
    output: path.join(process.cwd(), 'output'),
    includeChats: false,
    force: false,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--output') {
      options.output = args[++i];
    } else if (arg === '--include-chats') {
      options.includeChats = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      options.input = arg;
    }
  }

  if (!options.input) {
    console.error('Error: Input path required\n');
    showHelp();
    process.exit(1);
  }

  return options;
}

function showHelp() {
  console.log(`
Limitless Export Importer

Usage:
  node import-export.cjs <input> [options]

Input:
  Path to export zip file or extracted folder

Options:
  --output DIR       Output directory (default: ./output)
  --include-chats    Process Ask AI chat exports  
  --force            Overwrite existing files
  --dry-run          Show what would be done without writing
  --help             Show this help

Examples:
  node import-export.cjs ~/Desktop/data-export_2025-12-07.zip
  node import-export.cjs ./limitless-export --output ~/Chief-of-Staff/memory/sources/
  node import-export.cjs export.zip --include-chats --dry-run
`);
}

// Check if path is a zip file
function isZipFile(inputPath) {
  return inputPath.endsWith('.zip');
}

// Extract zip to temp directory (returns temp path)
function extractZip(zipPath) {
  // Validate zip path doesn't contain shell metacharacters
  if (/[`$\\!"';<>&|]/.test(zipPath)) {
    throw new Error('Zip path contains invalid characters');
  }
  
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'limitless-import-'));
  console.log(`Extracting to: ${tempDir}`);
  
  try {
    // Use execFileSync to avoid shell injection
    const { execFileSync } = require('child_process');
    execFileSync('unzip', ['-q', zipPath, '-d', tempDir], { stdio: 'pipe' });
  } catch (error) {
    fs.rmSync(tempDir, { recursive: true });
    throw new Error(`Failed to extract zip: ${error.message}`);
  }
  
  // Check for path traversal (zip slip) - ensure no files escaped tempDir
  const realTempDir = fs.realpathSync(tempDir);
  function checkPathTraversal(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      // Check if entry name contains path traversal patterns
      if (entry.name.includes('..') || entry.name.startsWith('/')) {
        throw new Error(`Zip contains path traversal attack: ${entry.name}`);
      }
      // For symlinks, check target doesn't escape tempDir
      if (entry.isSymbolicLink()) {
        const realPath = fs.realpathSync(fullPath);
        if (!realPath.startsWith(realTempDir)) {
          throw new Error(`Zip contains symlink escaping temp dir: ${entry.name}`);
        }
      }
      if (entry.isDirectory()) {
        checkPathTraversal(fullPath);
      }
    }
  }
  checkPathTraversal(tempDir);
  
  return tempDir;
}

// Validate export structure, handling nested wrapper directories
function validateExport(exportDir) {
  let lifelogsDir = path.join(exportDir, 'lifelogs');
  
  // Check for lifelogs directly
  if (fs.existsSync(lifelogsDir)) {
    return exportDir;
  }
  
  // Check for wrapper directory (e.g., data-export_2025-12-07_11-47-23/)
  const entries = fs.readdirSync(exportDir, { withFileTypes: true });
  const dirs = entries.filter(e => e.isDirectory());
  
  if (dirs.length === 1) {
    const nestedDir = path.join(exportDir, dirs[0].name);
    lifelogsDir = path.join(nestedDir, 'lifelogs');
    if (fs.existsSync(lifelogsDir)) {
      return nestedDir; // Return the actual export root
    }
  }
  
  throw new Error(`Invalid export: missing lifelogs/ directory in ${exportDir}`);
}

// Find all lifelog markdown files
function findLifelogs(exportDir) {
  const lifelogsDir = path.join(exportDir, 'lifelogs');
  const files = [];
  
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(lifelogsDir);
  return files.sort();
}

// Parse lifelog filename to extract date/time
// Format: YYYY-MM-DD_HHhMMmSSs_Title-slug.md
function parseLifelogFilename(filename) {
  const basename = path.basename(filename, '.md');
  const match = basename.match(/^(\d{4})-(\d{2})-(\d{2})_(\d{2})h(\d{2})m(\d{2})s_(.+)$/);
  
  if (!match) {
    return {
      date: new Date().toISOString().split('T')[0],
      time: '00:00:00',
      title: basename,
      slug: slugify(basename),
    };
  }
  
  const [, year, month, day, hour, minute, second, titleSlug] = match;
  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}:${second}`,
    title: titleSlug.replace(/-/g, ' '),
    slug: titleSlug.toLowerCase(),
  };
}

// Convert timestamp from startMs to readable time (UTC)
function msToTime(ms) {
  const date = new Date(parseInt(ms, 10));
  return date.toISOString().substring(11, 19); // HH:MM:SS in UTC
}

// Create URL-safe slug
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

// Process lifelog markdown content
function processLifelogContent(content, info) {
  // Convert speaker IDs from [8] to Speaker 8 format
  // And convert timestamp links to readable times
  let processed = content.replace(
    /> \[(\d+)\]\(#startMs=(\d+)&endMs=\d+\):/g,
    (match, speakerId, startMs) => {
      const time = msToTime(startMs);
      return `> **Speaker ${speakerId}** (${time}):`;
    }
  );
  
  return processed;
}

// Generate Rebel-compatible frontmatter
function generateFrontmatter(info, relativePath) {
  const today = new Date().toISOString().split('T')[0];
  const uid = `limitless_export_${info.date.replace(/-/g, '')}_${info.time.replace(/:/g, '')}`;
  
  // Extract first line as description (skip # heading marker)
  let description = info.title;
  if (description.length > 100) {
    description = description.substring(0, 97) + '...';
  }
  
  return `---
description: "${description.replace(/"/g, '\\"')}"
source_type: meeting
source_system: limitless_export
source_uid: ${uid}
source_url: "file://${relativePath}"
occurred_at: ${info.date}
stored_at: ${today}
---

`;
}

// Generate output filename
function generateOutputFilename(info) {
  const dateStr = info.date.replace(/-/g, '');
  const timeStr = info.time.replace(/:/g, '').substring(0, 4);
  return `${dateStr}_${timeStr}_limitless_${info.slug}.md`;
}

// Process a single lifelog file
function processLifelog(inputPath, exportDir, outputDir, options) {
  const content = fs.readFileSync(inputPath, 'utf8');
  const relativePath = path.relative(exportDir, inputPath);
  const info = parseLifelogFilename(inputPath);
  
  const processedContent = processLifelogContent(content, info);
  const frontmatter = generateFrontmatter(info, relativePath);
  const outputContent = frontmatter + processedContent;
  
  const outputFilename = generateOutputFilename(info);
  const outputPath = path.join(outputDir, outputFilename);
  
  if (options.dryRun) {
    return { action: 'would_create', path: outputPath };
  }
  
  if (fs.existsSync(outputPath) && !options.force) {
    return { action: 'skipped', path: outputPath };
  }
  
  fs.writeFileSync(outputPath, outputContent);
  return { action: 'created', path: outputPath };
}

// Process Ask AI chats
function processChats(exportDir, outputDir, options) {
  const chatsDir = path.join(exportDir, 'chats');
  if (!fs.existsSync(chatsDir)) {
    return [];
  }
  
  const results = [];
  
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.json')) {
        const result = processChatFile(fullPath, exportDir, outputDir, options);
        results.push(result);
      }
    }
  }
  
  walkDir(chatsDir);
  return results;
}

// Process a single chat file
function processChatFile(inputPath, exportDir, outputDir, options) {
  const content = fs.readFileSync(inputPath, 'utf8');
  const chat = JSON.parse(content);
  const relativePath = path.relative(exportDir, inputPath);
  
  // Generate markdown from chat
  const lines = [];
  lines.push('---');
  lines.push(`description: "${(chat.summary || 'Ask AI Chat').replace(/"/g, '\\"')}"`);
  lines.push('source_type: chat');
  lines.push('source_system: limitless_export');
  lines.push(`source_uid: limitless_chat_${path.basename(inputPath, '.json')}`);
  lines.push(`source_url: "file://${relativePath}"`);
  
  const createdDate = chat.createdAt 
    ? new Date(chat.createdAt).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
  lines.push(`occurred_at: ${createdDate}`);
  lines.push(`stored_at: ${new Date().toISOString().split('T')[0]}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ${chat.summary || 'Ask AI Chat'}`);
  lines.push('');
  
  for (const msg of (chat.messages || [])) {
    if (msg.role === 'user') {
      lines.push(`**You**: ${msg.content}`);
    } else if (msg.role === 'assistant') {
      lines.push(`**Limitless**: ${msg.content}`);
    }
    lines.push('');
  }
  
  const outputFilename = `${createdDate.replace(/-/g, '')}_limitless_chat_${slugify(chat.summary || 'chat')}.md`;
  const outputPath = path.join(outputDir, outputFilename);
  
  if (options.dryRun) {
    return { action: 'would_create', path: outputPath };
  }
  
  if (fs.existsSync(outputPath) && !options.force) {
    return { action: 'skipped', path: outputPath };
  }
  
  fs.writeFileSync(outputPath, lines.join('\n'));
  return { action: 'created', path: outputPath };
}

// Main function
async function main() {
  const options = parseArgs();
  
  console.log('\nLimitless Export Importer');
  console.log('='.repeat(40));
  
  // Resolve input path
  let inputPath = path.resolve(options.input.replace(/^~/, os.homedir()));
  let exportDir = inputPath;
  let tempDir = null;
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input not found: ${inputPath}`);
    process.exit(1);
  }
  
  // Extract if zip
  if (isZipFile(inputPath)) {
    console.log(`Input: ${inputPath} (zip)`);
    tempDir = extractZip(inputPath);
    exportDir = tempDir;
  } else {
    console.log(`Input: ${inputPath} (folder)`);
  }
  
  // Validate export structure (may update exportDir if nested)
  try {
    exportDir = validateExport(exportDir);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (tempDir) fs.rmSync(tempDir, { recursive: true });
    process.exit(1);
  }
  
  // Ensure output directory exists
  const outputDir = path.resolve(options.output.replace(/^~/, os.homedir()));
  console.log(`Output: ${outputDir}`);
  
  if (!options.dryRun && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  if (options.dryRun) {
    console.log('\n[DRY RUN MODE]\n');
  }
  
  // Find and process lifelogs
  const lifelogs = findLifelogs(exportDir);
  console.log(`\nFound ${lifelogs.length} lifelogs to process...\n`);
  
  const stats = { created: 0, skipped: 0, would_create: 0 };
  
  for (const lifelog of lifelogs) {
    const result = processLifelog(lifelog, exportDir, outputDir, options);
    stats[result.action]++;
    
    const filename = path.basename(result.path);
    if (result.action === 'created') {
      console.log(`  Created: ${filename}`);
    } else if (result.action === 'skipped') {
      console.log(`  Skipped: ${filename} (exists)`);
    } else if (result.action === 'would_create') {
      console.log(`  Would create: ${filename}`);
    }
  }
  
  // Process chats if requested
  if (options.includeChats) {
    console.log('\nProcessing chats...');
    const chatResults = processChats(exportDir, outputDir, options);
    for (const result of chatResults) {
      stats[result.action]++;
      const filename = path.basename(result.path);
      if (result.action === 'created') {
        console.log(`  Created: ${filename}`);
      } else if (result.action === 'would_create') {
        console.log(`  Would create: ${filename}`);
      }
    }
  }
  
  // Cleanup temp directory
  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true });
  }
  
  // Summary
  console.log('\n' + '='.repeat(40));
  if (options.dryRun) {
    console.log(`Would create: ${stats.would_create} files`);
  } else {
    console.log(`Created: ${stats.created} files`);
    console.log(`Skipped: ${stats.skipped} files`);
  }
  console.log('Done!\n');
}

main().catch((error) => {
  console.error(`\nFatal error: ${error.message}`);
  process.exit(1);
});
