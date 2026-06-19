#!/usr/bin/env node

/**
 * Limitless Lifelog to Markdown Converter
 * Converts JSON lifelogs to Rebel-compatible markdown files with frontmatter.
 * 
 * Usage:
 *   node convert-to-markdown.js [options]
 * 
 * Options:
 *   --input DIR     Input directory containing JSON files (default: ./lifelogs)
 *   --output DIR    Output directory for markdown files (default: ./transcripts)
 *   --force         Overwrite existing files
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    input: path.join(process.cwd(), 'lifelogs'),
    output: path.join(process.cwd(), 'transcripts'),
    force: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':
        options.input = args[++i];
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--force':
        options.force = true;
        break;
      case '--help':
        console.log(`
Limitless Lifelog to Markdown Converter

Usage:
  node convert-to-markdown.js [options]

Options:
  --input DIR     Input directory containing JSON files (default: ./lifelogs)
  --output DIR    Output directory for markdown files (default: ./transcripts)
  --force         Overwrite existing files
  --help          Show this help
`);
        process.exit(0);
    }
  }

  return options;
}

// Format ISO timestamp to human-readable
function formatTime(isoTimestamp) {
  if (!isoTimestamp) return '';
  const date = new Date(isoTimestamp);
  return date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
  });
}

// Format date for frontmatter
function formatDate(isoTimestamp) {
  if (!isoTimestamp) return new Date().toISOString().split('T')[0];
  return isoTimestamp.split('T')[0];
}

// Generate a slug from title
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

// Generate description from first few content items
function generateDescription(lifelog) {
  if (lifelog.title && lifelog.title !== 'Untitled') {
    return lifelog.title;
  }
  
  // Try to extract from first heading or content
  const contents = lifelog.contents || [];
  for (const item of contents) {
    if (item.type === 'heading1' || item.type === 'heading2') {
      return item.content;
    }
    if (item.type === 'blockquote' && item.content) {
      const preview = item.content.substring(0, 100);
      return preview + (item.content.length > 100 ? '...' : '');
    }
  }
  
  return 'Limitless pendant recording';
}

// Convert lifelog JSON to markdown
function convertToMarkdown(lifelog) {
  const lines = [];
  
  // Frontmatter
  lines.push('---');
  lines.push(`description: "${generateDescription(lifelog).replace(/"/g, '\\"')}"`);
  lines.push('source_type: meeting');
  lines.push('source_system: limitless');
  lines.push(`source_uid: limitless_${lifelog.id}`);
  lines.push(`source_url: "urn:limitless:lifelog:${lifelog.id}"`);
  lines.push(`occurred_at: ${formatDate(lifelog.startTime)}`);
  lines.push(`stored_at: ${formatDate(new Date().toISOString())}`);
  if (lifelog.isStarred) {
    lines.push('starred: true');
  }
  lines.push('---');
  lines.push('');

  // Title
  const title = lifelog.title || 'Limitless Recording';
  lines.push(`# ${title}`);
  lines.push('');

  // Process contents
  const contents = lifelog.contents || [];
  let currentSection = '';

  for (const item of contents) {
    switch (item.type) {
      case 'heading1':
        // Skip if same as title
        if (item.content !== title) {
          lines.push(`# ${item.content}`);
          lines.push('');
        }
        break;

      case 'heading2':
        currentSection = item.content;
        lines.push(`## ${item.content}`);
        lines.push('');
        break;

      case 'blockquote':
        if (item.content) {
          const speaker = item.speakerName || 'Speaker';
          const time = formatTime(item.startTime);
          const isUser = item.speakerIdentifier === 'user';
          
          // Format: > **Speaker** (HH:MM:SS): Content
          const speakerLabel = isUser ? `**${speaker}** (you)` : `**${speaker}**`;
          lines.push(`> ${speakerLabel} (${time}): ${item.content}`);
          lines.push('');
        }
        break;

      default:
        // Handle any other content types
        if (item.content) {
          lines.push(item.content);
          lines.push('');
        }
    }
  }

  // Fallback to markdown field if no contents
  if (contents.length === 0 && lifelog.markdown) {
    lines.push(lifelog.markdown);
  }

  return lines.join('\n');
}

// Generate output filename
function generateFilename(lifelog) {
  const date = new Date(lifelog.startTime);
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '').substring(0, 4);
  const titleSlug = slugify(lifelog.title || 'recording');
  
  return `${dateStr}_${timeStr}_limitless_${titleSlug}.md`;
}

// Process a single file
function processFile(inputPath, outputDir, force) {
  const filename = path.basename(inputPath);
  
  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const lifelog = JSON.parse(content);
    
    const outputFilename = generateFilename(lifelog);
    const outputPath = path.join(outputDir, outputFilename);
    
    if (!force && fs.existsSync(outputPath)) {
      console.log(`  Skipping existing: ${outputFilename}`);
      return { status: 'skipped' };
    }
    
    const markdown = convertToMarkdown(lifelog);
    fs.writeFileSync(outputPath, markdown);
    console.log(`  Created: ${outputFilename}`);
    return { status: 'created' };
    
  } catch (error) {
    console.error(`  Error processing ${filename}: ${error.message}`);
    return { status: 'failed' };
  }
}

// Main function
function main() {
  const options = parseArgs();

  // Ensure directories exist
  if (!fs.existsSync(options.input)) {
    console.error(`Input directory not found: ${options.input}`);
    console.error('Run download-lifelogs.js first to fetch lifelogs.');
    process.exit(1);
  }

  if (!fs.existsSync(options.output)) {
    fs.mkdirSync(options.output, { recursive: true });
  }

  console.log('\nLimitless Lifelog to Markdown Converter');
  console.log(`Input: ${options.input}`);
  console.log(`Output: ${options.output}`);
  console.log('');

  // Get all JSON files
  const files = fs.readdirSync(options.input)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(options.input, f));

  if (files.length === 0) {
    console.log('No JSON files found in input directory.');
    return;
  }

  console.log(`Processing ${files.length} file(s)...\n`);

  const stats = { created: 0, skipped: 0, failed: 0 };

  for (const file of files) {
    const result = processFile(file, options.output, options.force);
    stats[result.status]++;
  }

  console.log('\nComplete!');
  console.log(`  Created: ${stats.created}`);
  console.log(`  Skipped: ${stats.skipped}`);
  console.log(`  Failed: ${stats.failed}`);
}

main();
