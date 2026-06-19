#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { parse } = require('csv-parse/sync');

/**
 * Parse LinkedIn full data export ZIP
 * Extracts CSVs and converts to JSON for querying
 */

// Known header patterns for LinkedIn CSV files
const HEADER_PATTERNS = {
  connections: /^"?First Name"?,.*"?Last Name"?,.*"?(Connected On|Connected Date)"?/i,
  messages: /^"?(CONVERSATION ID|FROM)"?,.*"?(FROM|TO|DATE)"?/i,
  profile: /^"?(First Name|Contact Info)"?/i,
  generic: /^"?[A-Za-z][A-Za-z0-9 _-]*"?,.*"?[A-Za-z]/  // Generic CSV header
};

/**
 * Skip preamble text and find the actual CSV header row
 * LinkedIn CSVs often start with "Notes:" followed by quoted explanatory text
 */
function skipToHeader(content, fileName) {
  const lines = content.split('\n');
  
  // Determine which header pattern to use
  let pattern = HEADER_PATTERNS.generic;
  const lowerFileName = fileName.toLowerCase();
  if (lowerFileName.includes('connections')) {
    pattern = HEADER_PATTERNS.connections;
  } else if (lowerFileName.includes('messages')) {
    pattern = HEADER_PATTERNS.messages;
  } else if (lowerFileName.includes('profile')) {
    pattern = HEADER_PATTERNS.profile;
  }

  // Check first line - if it's already a valid header, return as-is
  const firstLine = lines[0].trim();
  if (pattern.test(firstLine)) {
    return content;
  }

  // Search for header row in first 30 lines
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Skip lines starting with Notes: or quoted text (preamble)
    if (line.startsWith('Notes:') || line.startsWith('"')) {
      continue;
    }
    
    // Check if this looks like a valid header
    if (pattern.test(line)) {
      return lines.slice(i).join('\n');
    }
    
    // Also check generic pattern for other files
    if (!lowerFileName.includes('connections') && !lowerFileName.includes('messages') && HEADER_PATTERNS.generic.test(line)) {
      const parts = line.split(',');
      if (parts.length >= 2) {
        return lines.slice(i).join('\n');
      }
    }
  }
  
  // Fallback: return original content
  return content;
}

/**
 * Slugify filename for consistent output naming
 */
function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
}

/**
 * Get default output directory for parsed data
 * Uses temp folder to avoid storing personal data in skill directory
 */
function getDefaultOutputDir() {
  const tmpBase = process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp';
  return path.join(tmpBase, 'linkedin-parser', 'parsed_data');
}

function parseLinkedInExport(zipPath, outputDir = null) {
  console.log(`\n📦 Parsing LinkedIn export: ${zipPath}`);

  if (!fs.existsSync(zipPath)) {
    console.error(`❌ Error: File not found: ${zipPath}`);
    process.exit(1);
  }

  // Extract ZIP
  console.log('📂 Extracting ZIP archive...');
  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();

  // Output directory - use provided, or default to temp folder
  if (!outputDir) {
    outputDir = getDefaultOutputDir();
  }
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = {
    connections: [],
    messages: [],
    profile: {},
    other: {},
    errors: [] // Track parsing errors for debugging
  };

  // Parse each CSV file
  console.log('📄 Parsing CSV files...');

  zipEntries.forEach(entry => {
    const fileName = entry.entryName.toLowerCase();

    // Skip directories and non-CSV files
    if (entry.isDirectory || !fileName.endsWith('.csv')) {
      return;
    }

    console.log(`  Processing: ${entry.entryName}`);

    try {
      // Extract and parse CSV
      const csvContent = entry.getData().toString('utf8');

      // Remove BOM if present
      let cleanContent = csvContent.replace(/^\uFEFF/, '');

      // Skip LinkedIn preamble (Notes: section) and find real header
      // LinkedIn CSVs often start with "Notes:" followed by explanatory text,
      // then a blank line, then the actual CSV data
      cleanContent = skipToHeader(cleanContent, fileName);

      // Parse CSV with robust error handling
      const records = parse(cleanContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
        relax_column_count: true,
        relax_quotes: true, // IMPROVEMENT: Handle malformed quotes gracefully
        escape: '"',
        quote: '"'
      });

      // Categorize by file type
      if (fileName.includes('connections')) {
        results.connections = records;
        console.log(`    ✓ Found ${records.length} connections`);
      } else if (fileName.includes('messages')) {
        results.messages = records;
        console.log(`    ✓ Found ${records.length} messages`);
      } else if (fileName.includes('profile')) {
        results.profile = records[0] || {};
        console.log(`    ✓ Parsed profile data`);
      } else {
        // Store other files by name
        const baseName = path.basename(fileName, '.csv');
        results.other[baseName] = records;
        console.log(`    ✓ Found ${records.length} ${baseName} records`);
      }
    } catch (err) {
      const errorInfo = {
        file: entry.entryName,
        error: err.message,
        timestamp: new Date().toISOString()
      };
      results.errors.push(errorInfo);
      console.error(`    ✗ Error parsing ${entry.entryName}:`, err.message);
    }
  });

  // Write parsed data to JSON files
  console.log('\n💾 Writing parsed data...');

  if (results.connections.length > 0) {
    const connectionsPath = path.join(outputDir, 'connections.json');
    fs.writeFileSync(connectionsPath, JSON.stringify(results.connections, null, 2));
    console.log(`  ✓ connections.json (${results.connections.length} records)`);
  }

  if (results.messages.length > 0) {
    const messagesPath = path.join(outputDir, 'messages.json');
    fs.writeFileSync(messagesPath, JSON.stringify(results.messages, null, 2));
    console.log(`  ✓ messages.json (${results.messages.length} records)`);
  }

  if (Object.keys(results.profile).length > 0) {
    const profilePath = path.join(outputDir, 'profile.json');
    fs.writeFileSync(profilePath, JSON.stringify(results.profile, null, 2));
    console.log(`  ✓ profile.json`);
  }

  // Write other files
  Object.entries(results.other).forEach(([name, data]) => {
    if (data.length > 0) {
      const filePath = path.join(outputDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`  ✓ ${name}.json (${data.length} records)`);
    }
  });

  // Write error log if any errors occurred
  if (results.errors.length > 0) {
    const errorsPath = path.join(outputDir, 'parsing_errors.json');
    fs.writeFileSync(errorsPath, JSON.stringify(results.errors, null, 2));
    console.log(`  ⚠ parsing_errors.json (${results.errors.length} files with errors)`);
  }

  // Write index file
  const index = {
    parsed_at: new Date().toISOString(),
    source_file: zipPath,
    stats: {
      connections: results.connections.length,
      messages: results.messages.length,
      other_files: Object.keys(results.other).length,
      parsing_errors: results.errors.length
    }
  };

  const indexPath = path.join(outputDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`  ✓ index.json`);

  console.log(`\n✅ Parse complete! Output: ${outputDir}`);
  console.log('\n📊 Summary:');
  console.log(`  Connections: ${results.connections.length}`);
  console.log(`  Messages: ${results.messages.length}`);
  console.log(`  Other files: ${Object.keys(results.other).length}`);
  if (results.errors.length > 0) {
    console.log(`  ⚠ Parsing errors: ${results.errors.length} (see parsing_errors.json)`);
  }
  console.log(`\nNext: Use query_linkedin_data.js to explore the data`);
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const zipPath = args[0];
  
  // Parse --output option
  const outputIdx = args.indexOf('--output');
  const outputDir = outputIdx !== -1 ? args[outputIdx + 1] : null;

  if (!zipPath || zipPath.startsWith('--')) {
    console.log('Usage: node parse_linkedin_export.js <path-to-linkedin-export.zip> [--output <dir>]');
    console.log('\nOptions:');
    console.log('  --output <dir>   Output directory (default: system temp folder)');
    console.log('\nExamples:');
    console.log('  node parse_linkedin_export.js ~/Downloads/linkedin-export.zip');
    console.log('  node parse_linkedin_export.js ~/Downloads/linkedin-export.zip --output /tmp/my-linkedin');
    console.log(`\nDefault output: ${getDefaultOutputDir()}`);
    process.exit(1);
  }

  parseLinkedInExport(zipPath, outputDir);
}

module.exports = { parseLinkedInExport, getDefaultOutputDir };
