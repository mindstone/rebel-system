#!/usr/bin/env node

/**
 * Limitless Lifelog Downloader
 * Downloads Limitless pendant transcripts via the official API.
 * 
 * Usage:
 *   LIMITLESS_API_KEY="your_key" node download-lifelogs.js [options]
 * 
 * Options:
 *   --date YYYY-MM-DD    Fetch lifelogs for a specific date
 *   --days N             Fetch lifelogs from the last N days (default: 7)
 *   --output DIR         Output directory (default: ./lifelogs)
 *   --timezone TZ        IANA timezone (default: UTC)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_BASE_URL = 'https://api.limitless.ai/v1';
const DEFAULT_DAYS = 7;
const LIMIT = 10; // API max per request

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    date: null,
    days: DEFAULT_DAYS,
    output: path.join(process.cwd(), 'lifelogs'),
    timezone: 'UTC',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--date':
        options.date = args[++i];
        break;
      case '--days':
        options.days = parseInt(args[++i], 10);
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--timezone':
        options.timezone = args[++i];
        break;
      case '--help':
        console.log(`
Limitless Lifelog Downloader

Usage:
  LIMITLESS_API_KEY="your_key" node download-lifelogs.js [options]

Options:
  --date YYYY-MM-DD    Fetch lifelogs for a specific date
  --days N             Fetch lifelogs from the last N days (default: 7)
  --output DIR         Output directory (default: ./lifelogs)
  --timezone TZ        IANA timezone (default: UTC)
  --help               Show this help
`);
        process.exit(0);
    }
  }

  return options;
}

// Make HTTP request to Limitless API
function apiRequest(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.LIMITLESS_API_KEY;
    if (!apiKey) {
      reject(new Error('LIMITLESS_API_KEY environment variable not set'));
      return;
    }

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 429) {
          reject(new Error('Rate limited. Wait 60 seconds and retry.'));
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`API error ${res.statusCode}: ${data}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// Format timestamp for filename
function formatTimestampForFilename(timestamp) {
  return timestamp
    .replace(/[:-]/g, '_')
    .replace(/\.[0-9]*[-+][0-9:]*/g, 'Z')
    .replace('T', '_')
    .replace('Z', '');
}

// Fetch lifelogs for a single date with pagination
async function fetchLifelogsForDate(date, timezone) {
  const lifelogs = [];
  let cursor = null;

  console.log(`  Fetching lifelogs for ${date}...`);

  while (true) {
    const params = {
      date,
      timezone,
      limit: LIMIT,
      includeContents: true,
    };
    if (cursor) params.cursor = cursor;

    const response = await apiRequest('/lifelogs', params);
    const items = response.data?.lifelogs || [];
    lifelogs.push(...items);

    cursor = response.meta?.lifelogs?.nextCursor;
    if (!cursor || items.length === 0) break;

    console.log(`    Found ${items.length} lifelogs, fetching more...`);
  }

  return lifelogs;
}

// Generate date strings for the last N days
function getDateRange(days, specificDate = null) {
  if (specificDate) {
    return [specificDate];
  }

  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

// Save lifelog to file
function saveLifelog(lifelog, outputDir) {
  const timestamp = formatTimestampForFilename(lifelog.startTime);
  const filename = `${timestamp}_${lifelog.id}.json`;
  const filepath = path.join(outputDir, filename);

  if (fs.existsSync(filepath)) {
    console.log(`    Skipping existing: ${filename}`);
    return false;
  }

  fs.writeFileSync(filepath, JSON.stringify(lifelog, null, 2));
  console.log(`    Saved: ${filename}`);
  return true;
}

// Main function
async function main() {
  const options = parseArgs();

  // Ensure output directory exists
  if (!fs.existsSync(options.output)) {
    fs.mkdirSync(options.output, { recursive: true });
  }

  console.log(`\nLimitless Lifelog Downloader`);
  console.log(`Output directory: ${options.output}`);
  console.log(`Timezone: ${options.timezone}`);

  const dates = getDateRange(options.days, options.date);
  console.log(`Fetching lifelogs for ${dates.length} day(s)...\n`);

  let totalFetched = 0;
  let totalSaved = 0;

  for (const date of dates) {
    try {
      const lifelogs = await fetchLifelogsForDate(date, options.timezone);
      totalFetched += lifelogs.length;

      for (const lifelog of lifelogs) {
        if (saveLifelog(lifelog, options.output)) {
          totalSaved++;
        }
      }

      if (lifelogs.length === 0) {
        console.log(`  No lifelogs found for ${date}`);
      }
    } catch (error) {
      console.error(`  Error fetching ${date}: ${error.message}`);
    }
  }

  console.log(`\nComplete!`);
  console.log(`  Total fetched: ${totalFetched}`);
  console.log(`  New files saved: ${totalSaved}`);
}

main().catch((error) => {
  console.error(`\nFatal error: ${error.message}`);
  process.exit(1);
});
