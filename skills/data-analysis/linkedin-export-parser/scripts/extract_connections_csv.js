#!/usr/bin/env node

/**
 * Extract and clean Connections.csv from LinkedIn export
 * Outputs a clean CSV or JSON file ready for analysis
 * 
 * Use cases:
 * - Export to spreadsheet for manual review
 * - Feed into CRM systems
 * - Generate mailing lists
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { parse } = require('csv-parse/sync');

// Header pattern for connections CSV
const CONNECTIONS_HEADER = /^"?First Name"?,.*"?Last Name"?,.*"?(Connected On|Connected Date)"?/i;

function skipToHeader(content) {
  const lines = content.split('\n');
  
  // Check if first line is already the header
  if (CONNECTIONS_HEADER.test(lines[0].trim())) {
    return content;
  }
  
  // Search for header row, skipping preamble (Notes:, quoted text, empty lines)
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('Notes:') || line.startsWith('"')) continue;
    if (CONNECTIONS_HEADER.test(line)) {
      return lines.slice(i).join('\n');
    }
  }
  return content;
}

function extractConnections(zipPath, options = {}) {
  const { format = 'json', output = null, includeUrl = true, includeEmail = true } = options;

  if (!fs.existsSync(zipPath)) {
    console.error(`Error: File not found: ${zipPath}`);
    process.exit(1);
  }

  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  // Find Connections.csv
  const connectionsEntry = entries.find(e => 
    e.entryName.toLowerCase().includes('connections') && 
    e.entryName.endsWith('.csv')
  );

  if (!connectionsEntry) {
    console.error('Error: Connections.csv not found in export');
    process.exit(1);
  }

  // Parse CSV
  let content = connectionsEntry.getData().toString('utf8').replace(/^\uFEFF/, '');
  content = skipToHeader(content);

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true
  });

  // Normalize and clean records
  const cleaned = records.map(r => {
    const conn = {
      first_name: r['First Name'] || r.first_name || '',
      last_name: r['Last Name'] || r.last_name || '',
      company: r['Company'] || r.company || '',
      position: r['Position'] || r.position || '',
      connected_on: r['Connected On'] || r['Connected Date'] || r.connected_on || ''
    };

    if (includeEmail) {
      conn.email = r['Email Address'] || r.email || '';
    }
    if (includeUrl) {
      conn.url = r['URL'] || r.url || '';
    }

    return conn;
  }).filter(c => c.first_name || c.last_name); // Remove empty rows

  // Output
  let outputContent;
  if (format === 'csv') {
    const headers = Object.keys(cleaned[0] || {});
    const csvLines = [headers.join(',')];
    cleaned.forEach(r => {
      const values = headers.map(h => {
        const val = r[h] || '';
        return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
      });
      csvLines.push(values.join(','));
    });
    outputContent = csvLines.join('\n');
  } else {
    outputContent = JSON.stringify(cleaned, null, 2);
  }

  if (output) {
    fs.writeFileSync(output, outputContent);
    console.log(`Extracted ${cleaned.length} connections to ${output}`);
  } else {
    console.log(outputContent);
  }

  return cleaned;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const zipPath = args[0];
  
  if (!zipPath) {
    console.log('Usage: node extract_connections_csv.js <path-to-export.zip> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --format json|csv     Output format (default: json)');
    console.log('  --output <file>       Write to file instead of stdout');
    console.log('  --no-url              Exclude LinkedIn URLs');
    console.log('  --no-email            Exclude email addresses');
    console.log('');
    console.log('Examples:');
    console.log('  node extract_connections_csv.js export.zip');
    console.log('  node extract_connections_csv.js export.zip --format csv --output connections.csv');
    process.exit(1);
  }

  const options = {
    format: args.includes('--format') ? args[args.indexOf('--format') + 1] : 'json',
    output: args.includes('--output') ? args[args.indexOf('--output') + 1] : null,
    includeUrl: !args.includes('--no-url'),
    includeEmail: !args.includes('--no-email')
  };

  extractConnections(zipPath, options);
}

module.exports = { extractConnections };
