#!/usr/bin/env node

/**
 * Generate network statistics from LinkedIn export
 * Provides insights about your professional network
 * 
 * Outputs:
 * - Connection growth over time
 * - Top companies in network
 * - Top positions/roles
 * - Connection date distribution
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

function generateNetworkStats(zipPath, options = {}) {
  const { output = null, topN = 20 } = options;

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

  // Analyze connections
  const companies = {};
  const positions = {};
  const connectionsByYear = {};
  const connectionsByMonth = {};
  let withEmail = 0;
  let withUrl = 0;

  records.forEach(r => {
    const company = r['Company'] || r.company || '';
    const position = r['Position'] || r.position || '';
    const dateStr = r['Connected On'] || r['Connected Date'] || r.connected_on || '';
    const email = r['Email Address'] || r.email || '';
    const url = r['URL'] || r.url || '';

    // Count companies
    if (company) {
      companies[company] = (companies[company] || 0) + 1;
    }

    // Count positions
    if (position) {
      positions[position] = (positions[position] || 0) + 1;
    }

    // Parse and count dates
    const date = parseDate(dateStr);
    if (date) {
      const year = date.getFullYear();
      const month = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      connectionsByYear[year] = (connectionsByYear[year] || 0) + 1;
      connectionsByMonth[month] = (connectionsByMonth[month] || 0) + 1;
    }

    // Count emails and URLs
    if (email) withEmail++;
    if (url) withUrl++;
  });

  // Sort and limit
  const topCompanies = Object.entries(companies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({ name, count }));

  const topPositions = Object.entries(positions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({ name, count }));

  const yearlyGrowth = Object.entries(connectionsByYear)
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year: parseInt(year), count }));

  // Calculate date range
  const dates = records
    .map(r => parseDate(r['Connected On'] || r['Connected Date'] || r.connected_on || ''))
    .filter(d => d);
  
  const earliestDate = dates.length ? new Date(Math.min(...dates)) : null;
  const latestDate = dates.length ? new Date(Math.max(...dates)) : null;

  const stats = {
    overview: {
      total_connections: records.length,
      with_email: withEmail,
      with_email_pct: records.length > 0 ? ((withEmail / records.length) * 100).toFixed(1) + '%' : '0%',
      unique_companies: Object.keys(companies).length,
      unique_positions: Object.keys(positions).length,
      date_range: {
        earliest: earliestDate ? earliestDate.toISOString().split('T')[0] : null,
        latest: latestDate ? latestDate.toISOString().split('T')[0] : null
      }
    },
    top_companies: topCompanies,
    top_positions: topPositions,
    connections_by_year: yearlyGrowth
  };

  // Output
  const outputContent = JSON.stringify(stats, null, 2);

  if (output) {
    fs.writeFileSync(output, outputContent);
    console.log(`Network stats written to ${output}`);
  } else {
    // Pretty print for console
    console.log('\n=== LinkedIn Network Statistics ===\n');
    console.log(`Total Connections: ${stats.overview.total_connections}`);
    console.log(`Connections with Email: ${stats.overview.with_email} (${stats.overview.with_email_pct})`);
    console.log(`Unique Companies: ${stats.overview.unique_companies}`);
    console.log(`Date Range: ${stats.overview.date_range.earliest || 'N/A'} to ${stats.overview.date_range.latest || 'N/A'}`);
    
    console.log(`\nTop ${Math.min(10, topCompanies.length)} Companies:`);
    topCompanies.slice(0, 10).forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.name} (${c.count})`);
    });

    console.log(`\nTop ${Math.min(10, topPositions.length)} Positions:`);
    topPositions.slice(0, 10).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p.count})`);
    });

    console.log('\nConnections by Year:');
    yearlyGrowth.forEach(y => {
      const bar = '█'.repeat(Math.ceil(y.count / 50));
      console.log(`  ${y.year}: ${String(y.count).padStart(4)} ${bar}`);
    });
  }

  return stats;
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // "17 Jan 2026" format
  if (/^\d{1,2}\s+\w{3}\s+\d{4}$/.test(dateStr)) {
    return new Date(dateStr);
  }
  
  // ISO "2026-01-17" format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }
  
  // US "1/17/26" format
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(dateStr)) {
    return new Date(dateStr);
  }
  
  // Fallback
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const zipPath = args[0];
  
  if (!zipPath) {
    console.log('Usage: node network_stats.js <path-to-export.zip> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --output <file>   Write JSON to file');
    console.log('  --top <n>         Number of top items to show (default: 20)');
    console.log('');
    console.log('Examples:');
    console.log('  node network_stats.js export.zip');
    console.log('  node network_stats.js export.zip --output stats.json');
    process.exit(1);
  }

  const options = {
    output: args.includes('--output') ? args[args.indexOf('--output') + 1] : null,
    topN: args.includes('--top') ? parseInt(args[args.indexOf('--top') + 1]) : 20
  };

  generateNetworkStats(zipPath, options);
}

module.exports = { generateNetworkStats };
