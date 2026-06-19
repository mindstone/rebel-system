#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Query parsed LinkedIn data
 * Provides various query operations on connections, messages, etc.
 */

/**
 * Get default data directory (matches parse_linkedin_export.js)
 */
function getDefaultDataDir() {
  const tmpBase = process.env.TMPDIR || process.env.TMP || process.env.TEMP || '/tmp';
  return path.join(tmpBase, 'linkedin-parser', 'parsed_data');
}

// Data directory - can be overridden via --data-dir option
let dataDir = getDefaultDataDir();

function loadData(fileName) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// IMPROVEMENT: Normalize field names across different LinkedIn export versions
function getField(record, fieldNames) {
  for (const fieldName of fieldNames) {
    if (record[fieldName] !== undefined && record[fieldName] !== null) {
      return record[fieldName];
    }
  }
  return '';
}

// IMPROVEMENT: Parse various LinkedIn date formats
function parseLinkedInDate(dateStr) {
  if (!dateStr) return null;

  // Handle "17 Jan 2026" format
  if (/^\d{1,2}\s+\w{3}\s+\d{4}$/.test(dateStr)) {
    return new Date(dateStr);
  }

  // Handle ISO format "2026-01-17"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }

  // Handle "1/17/26, 5:09 PM" format
  if (/^\d{1,2}\/\d{1,2}\/\d{2},?\s+\d{1,2}:\d{2}/.test(dateStr)) {
    return new Date(dateStr.replace(',', ''));
  }

  // Fallback: try native Date parsing
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  } catch (e) {
    // Ignore parse errors
  }

  return null;
}

function getStats() {
  const connections = loadData('connections.json') || [];
  const messages = loadData('messages.json') || [];
  const index = loadData('index.json') || {};

  // Analyze connections
  const companies = new Set();
  const positions = new Set();
  let earliestConnection = null;
  let latestConnection = null;

  connections.forEach(conn => {
    const company = getField(conn, ['Company', 'company']);
    const position = getField(conn, ['Position', 'position']);

    if (company) companies.add(company);
    if (position) positions.add(position);

    const connDateStr = getField(conn, ['Connected On', 'Connected Date', 'connected_on']);
    const connDate = parseLinkedInDate(connDateStr);

    if (connDate) {
      if (!earliestConnection || connDate < earliestConnection) earliestConnection = connDate;
      if (!latestConnection || connDate > latestConnection) latestConnection = connDate;
    }
  });

  return {
    connections: {
      total: connections.length,
      companies: companies.size,
      positions: positions.size,
      date_range: {
        earliest: earliestConnection ? earliestConnection.toISOString().split('T')[0] : null,
        latest: latestConnection ? latestConnection.toISOString().split('T')[0] : null
      }
    },
    messages: {
      total: messages.length
    },
    parsed_at: index.parsed_at
  };
}

function connectionsByCompany(companyQuery, limit = 100) {
  const connections = loadData('connections.json') || [];

  const matches = connections.filter(conn => {
    const company = getField(conn, ['Company', 'company']);
    return company.toLowerCase().includes(companyQuery.toLowerCase());
  });

  return matches.slice(0, limit).map(conn => ({
    name: `${getField(conn, ['First Name', 'first_name'])} ${getField(conn, ['Last Name', 'last_name'])}`.trim(),
    company: getField(conn, ['Company', 'company']),
    position: getField(conn, ['Position', 'position']),
    connected_on: getField(conn, ['Connected On', 'Connected Date', 'connected_on']),
    email: getField(conn, ['Email Address', 'email']),
    url: getField(conn, ['URL', 'url'])
  }));
}

function connectionsByDate(year, month = null) {
  const connections = loadData('connections.json') || [];

  const matches = connections.filter(conn => {
    const dateStr = getField(conn, ['Connected On', 'Connected Date', 'connected_on']);
    const date = parseLinkedInDate(dateStr);

    if (!date) return false;

    if (year && date.getFullYear() !== parseInt(year)) return false;

    if (month) {
      if (date.getMonth() + 1 !== parseInt(month)) return false;
    }

    return true;
  });

  return matches.map(conn => ({
    name: `${getField(conn, ['First Name', 'first_name'])} ${getField(conn, ['Last Name', 'last_name'])}`.trim(),
    company: getField(conn, ['Company', 'company']),
    position: getField(conn, ['Position', 'position']),
    connected_on: getField(conn, ['Connected On', 'Connected Date', 'connected_on'])
  }));
}

// NEW: Find person by name
function findPerson(nameQuery, limit = 20) {
  const connections = loadData('connections.json') || [];

  const matches = connections.filter(conn => {
    const firstName = getField(conn, ['First Name', 'first_name']).toLowerCase();
    const lastName = getField(conn, ['Last Name', 'last_name']).toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();
    const query = nameQuery.toLowerCase();

    return fullName.includes(query) || firstName.includes(query) || lastName.includes(query);
  });

  return matches.slice(0, limit).map(conn => ({
    name: `${getField(conn, ['First Name', 'first_name'])} ${getField(conn, ['Last Name', 'last_name'])}`.trim(),
    company: getField(conn, ['Company', 'company']),
    position: getField(conn, ['Position', 'position']),
    connected_on: getField(conn, ['Connected On', 'Connected Date', 'connected_on']),
    email: getField(conn, ['Email Address', 'email']),
    url: getField(conn, ['URL', 'url'])
  }));
}

function messagesSearch(query, limit = 50) {
  const messages = loadData('messages.json') || [];

  const matches = messages.filter(msg => {
    const content = getField(msg, ['CONTENT', 'Content', 'content']);
    const from = getField(msg, ['FROM', 'From', 'from']);
    const to = getField(msg, ['TO', 'To', 'to']);

    const searchText = `${content} ${from} ${to}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  });

  return matches.slice(0, limit).map(msg => ({
    from: getField(msg, ['FROM', 'From', 'from']),
    to: getField(msg, ['TO', 'To', 'to']),
    date: getField(msg, ['DATE', 'Date', 'date']),
    content: getField(msg, ['CONTENT', 'Content', 'content']).substring(0, 200)
  }));
}

function messagesWith(personName, limit = 100) {
  const messages = loadData('messages.json') || [];

  const matches = messages.filter(msg => {
    const from = getField(msg, ['FROM', 'From', 'from']).toLowerCase();
    const to = getField(msg, ['TO', 'To', 'to']).toLowerCase();
    const name = personName.toLowerCase();

    return from.includes(name) || to.includes(name);
  });

  return matches.slice(0, limit).map(msg => ({
    from: getField(msg, ['FROM', 'From', 'from']),
    to: getField(msg, ['TO', 'To', 'to']),
    date: getField(msg, ['DATE', 'Date', 'date']),
    content: getField(msg, ['CONTENT', 'Content', 'content']).substring(0, 200)
  }));
}

function profileSummary() {
  const profile = loadData('profile.json');
  return profile;
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  
  // Check for --data-dir option
  const dataDirIdx = args.indexOf('--data-dir');
  if (dataDirIdx !== -1) {
    dataDir = args[dataDirIdx + 1];
    args.splice(dataDirIdx, 2); // Remove from args
  }
  
  const command = args[0];

  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Error: No parsed data found at ${dataDir}`);
    console.error(`Run parse_linkedin_export.js first, or specify --data-dir`);
    process.exit(1);
  }

  let result;

  switch (command) {
    case 'stats':
      result = getStats();
      break;

    case 'find-person': {
      const nameIdx = args.indexOf('--name');
      const limitIdx = args.indexOf('--limit');

      if (nameIdx === -1) {
        console.error('Usage: node query_linkedin_data.js find-person --name "Person Name" [--limit 20]');
        process.exit(1);
      }

      const name = args[nameIdx + 1];
      const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : 20;

      result = findPerson(name, limit);
      break;
    }

    case 'connections-by-company': {
      const companyIdx = args.indexOf('--company');
      const limitIdx = args.indexOf('--limit');

      if (companyIdx === -1) {
        console.error('Usage: node query_linkedin_data.js connections-by-company --company "Company Name" [--limit 50]');
        process.exit(1);
      }

      const company = args[companyIdx + 1];
      const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : 100;

      result = connectionsByCompany(company, limit);
      break;
    }

    case 'connections-by-date': {
      const yearIdx = args.indexOf('--year');
      const monthIdx = args.indexOf('--month');

      if (yearIdx === -1) {
        console.error('Usage: node query_linkedin_data.js connections-by-date --year 2020 [--month 6]');
        process.exit(1);
      }

      const year = args[yearIdx + 1];
      const month = monthIdx !== -1 ? args[monthIdx + 1] : null;

      result = connectionsByDate(year, month);
      break;
    }

    case 'messages-search': {
      const queryIdx = args.indexOf('--query');
      const limitIdx = args.indexOf('--limit');

      if (queryIdx === -1) {
        console.error('Usage: node query_linkedin_data.js messages-search --query "search term" [--limit 50]');
        process.exit(1);
      }

      const query = args[queryIdx + 1];
      const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : 50;

      result = messagesSearch(query, limit);
      break;
    }

    case 'messages-with': {
      const personIdx = args.indexOf('--person');
      const limitIdx = args.indexOf('--limit');

      if (personIdx === -1) {
        console.error('Usage: node query_linkedin_data.js messages-with --person "Person Name" [--limit 100]');
        process.exit(1);
      }

      const person = args[personIdx + 1];
      const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : 100;

      result = messagesWith(person, limit);
      break;
    }

    case 'profile-summary':
      result = profileSummary();
      break;

    default:
      console.log('LinkedIn Data Query Tool\n');
      console.log('Available commands:');
      console.log('  stats                         - Overall statistics');
      console.log('  find-person                   - Find connections by name');
      console.log('  connections-by-company        - Find connections at a company');
      console.log('  connections-by-date           - Find connections from a time period');
      console.log('  messages-search               - Search message content');
      console.log('  messages-with                 - View messages with specific person');
      console.log('  profile-summary               - Display profile information');
      console.log('\nGlobal options:');
      console.log('  --data-dir <dir>              - Specify parsed data directory');
      console.log('\nExamples:');
      console.log('  node query_linkedin_data.js stats');
      console.log('  node query_linkedin_data.js find-person --name "Adrian"');
      console.log('  node query_linkedin_data.js connections-by-company --company "Google"');
      console.log('  node query_linkedin_data.js connections-by-date --year 2020 --month 6');
      console.log('  node query_linkedin_data.js messages-search --query "fundraising"');
      console.log('  node query_linkedin_data.js messages-with --person "Jane Smith"');
      console.log(`\nDefault data directory: ${getDefaultDataDir()}`);
      process.exit(0);
  }

  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  getStats,
  findPerson,
  connectionsByCompany,
  connectionsByDate,
  messagesSearch,
  messagesWith,
  profileSummary
};
