#!/usr/bin/env node
/**
 * Cursor to Rebel Conversation Importer
 * 
 * Imports conversations from Cursor IDE's local database into Rebel's session format.
 * Uses sqlite3 CLI (available on macOS/Linux/Windows) - no npm install needed.
 * 
 * Usage:
 *   node import-single-cursor-conversation.cjs [options]
 * 
 * Options:
 *   --list                   List available conversations (no import)
 *   --conversation <id>      Import specific conversation by ID
 *   --all                    Import most recent conversations (see --limit)
 *   --limit <N>              Number of conversations to list/import (default: 100)
 *   --output <path>          Output directory (default: ./imported-sessions)
 *   --db <path>              Custom path to state.vscdb
 *   --rebel-sessions         Output directly to Rebel's sessions folder
 *   --verbose                Enable verbose logging
 * 
 * Examples:
 *   node import-single-cursor-conversation.cjs --list
 *   node import-single-cursor-conversation.cjs --all --output ~/rebel-import
 *   node import-single-cursor-conversation.cjs --conversation abc-123
 */

const { execFileSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ============================================================================
// Configuration
// ============================================================================

const VERBOSE = process.argv.includes('--verbose');

function log(...args) {
  console.log('[import]', ...args);
}

function verbose(...args) {
  if (VERBOSE) console.log('[verbose]', ...args);
}

function error(...args) {
  console.error('[error]', ...args);
}

// ============================================================================
// Platform-specific paths
// ============================================================================

function getCursorGlobalStoragePath() {
  const platform = os.platform();
  const home = os.homedir();
  
  switch (platform) {
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', 'Cursor', 'User', 'globalStorage', 'state.vscdb');
    case 'win32':
      return path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'Cursor', 'User', 'globalStorage', 'state.vscdb');
    case 'linux':
      return path.join(home, '.config', 'Cursor', 'User', 'globalStorage', 'state.vscdb');
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

function getRebelSessionsPath() {
  const platform = os.platform();
  const home = os.homedir();
  
  switch (platform) {
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', 'mindstone-rebel', 'sessions');
    case 'win32':
      return path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'mindstone-rebel', 'sessions');
    case 'linux':
      return path.join(home, '.config', 'mindstone-rebel', 'sessions');
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

// ============================================================================
// SQLite helpers (using CLI)
// ============================================================================

function querySqlite(dbPath, sql, timeoutMs = 120000) {
  // Use execFileSync with stdin input - no shell, no injection risk, cross-platform safe
  try {
    const result = execFileSync('sqlite3', ['-json', dbPath], {
      input: sql,
      encoding: 'utf8',
      maxBuffer: 100 * 1024 * 1024, // 100MB buffer for large results
      timeout: timeoutMs,
    });
    
    if (!result.trim()) return [];
    return JSON.parse(result);
  } catch (err) {
    // Handle empty results (sqlite3 exits with 0 but empty output)
    if (err.stdout === '' || (err.status === 0 && !err.stdout)) {
      return [];
    }
    // Check for JSON mode not supported (older sqlite3 versions)
    if (err.stderr && err.stderr.includes('unknown option')) {
      throw new Error('Your sqlite3 version does not support -json output. Please upgrade to sqlite3 3.33.0 or later.');
    }
    throw err;
  }
}

// Escape single quotes for SQL strings (double them)
function escapeSql(str) {
  return str.replace(/'/g, "''");
}

function queryKeys(dbPath, pattern, limit = null) {
  let sql = `SELECT key, value FROM cursorDiskKV WHERE key LIKE '${escapeSql(pattern)}' ORDER BY key`;
  if (limit) sql += ` LIMIT ${limit}`;
  return querySqlite(dbPath, sql);
}

function queryKeysOnly(dbPath, pattern) {
  const sql = `SELECT key FROM cursorDiskKV WHERE key LIKE '${escapeSql(pattern)}' ORDER BY key`;
  return querySqlite(dbPath, sql);
}

function queryValue(dbPath, key) {
  const sql = `SELECT value FROM cursorDiskKV WHERE key = '${escapeSql(key)}'`;
  const rows = querySqlite(dbPath, sql);
  return rows.length > 0 ? rows[0].value : null;
}

// ============================================================================
// Cursor data parsing
// ============================================================================

function parseComposerData(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

function parseBubble(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

function extractBubbleText(bubble) {
  // Try various text fields (Cursor stores text in multiple places)
  if (bubble.text) return bubble.text;
  if (bubble.rawText) return bubble.rawText;
  if (bubble.richText) {
    try {
      const rich = JSON.parse(bubble.richText);
      // Lexical editor format - try to extract plain text
      if (rich.root?.children) {
        return rich.root.children
          .map(node => node.children?.map(c => c.text || '').join('') || '')
          .join('\n');
      }
    } catch {
      // Fall through
    }
  }
  return '';
}

function extractBubbleTimestamp(bubble) {
  // Try various timestamp sources
  if (bubble.timingInfo?.clientEndTime) return bubble.timingInfo.clientEndTime;
  if (bubble.timingInfo?.clientSettleTime) return bubble.timingInfo.clientSettleTime;
  if (bubble.timingInfo?.clientStartTime) return bubble.timingInfo.clientStartTime;
  if (bubble.timingInfo?.clientRpcSendTime) return bubble.timingInfo.clientRpcSendTime;
  if (bubble.timestamp) return bubble.timestamp;
  if (bubble.lastSendTime) return bubble.lastSendTime;
  return Date.now();
}

function formatToolCall(bubble) {
  // If bubble has tool call data, format it as text
  if (!bubble.toolFormerData) return '';
  
  const tool = bubble.toolFormerData;
  const parts = [];
  
  if (tool.name) {
    parts.push(`[Tool: ${tool.name}]`);
  }
  if (tool.status) {
    parts.push(`Status: ${tool.status}`);
  }
  if (tool.userDecision) {
    parts.push(`Decision: ${tool.userDecision}`);
  }
  
  return parts.length > 0 ? '\n\n' + parts.join(' | ') : '';
}

// ============================================================================
// Conversation listing
// ============================================================================

function listConversations(dbPath, limit = 100) {
  log('Listing conversations from:', dbPath);
  log('(Loading most recent conversations...)');
  
  // Use a smarter query: extract JSON fields directly in SQLite to avoid loading full blobs
  // This is MUCH faster than loading all 5000+ conversations
  const sql = `
    SELECT 
      key,
      json_extract(value, '$.composerId') as composerId,
      json_extract(value, '$.name') as name,
      json_extract(value, '$.createdAt') as createdAt,
      json_extract(value, '$.lastUpdatedAt') as lastUpdatedAt,
      json_extract(value, '$.unifiedMode') as unifiedMode,
      json_array_length(json_extract(value, '$.fullConversationHeadersOnly')) as messageCount
    FROM cursorDiskKV 
    WHERE key LIKE 'composerData:%'
    ORDER BY json_extract(value, '$.lastUpdatedAt') DESC
    LIMIT ${limit}
  `;
  
  const rows = querySqlite(dbPath, sql, 300000); // 5 min timeout for large DBs
  verbose(`Found ${rows.length} conversations`);
  
  const conversations = [];
  
  for (const row of rows) {
    const id = row.composerId || row.key.replace('composerData:', '');
    conversations.push({
      id,
      title: row.name || '(untitled)',
      createdAt: row.createdAt || 0,
      updatedAt: row.lastUpdatedAt || row.createdAt || 0,
      messageCount: row.messageCount || 0,
      mode: row.unifiedMode || 'unknown',
    });
  }
  
  return conversations;
}

function listAllConversationIds(dbPath) {
  log('Getting all conversation IDs...');
  
  const sql = `
    SELECT json_extract(value, '$.composerId') as composerId
    FROM cursorDiskKV 
    WHERE key LIKE 'composerData:%'
  `;
  
  const rows = querySqlite(dbPath, sql, 300000);
  return rows.map(r => r.composerId).filter(Boolean);
}

// ============================================================================
// Conversation import
// ============================================================================

function importConversation(dbPath, composerId) {
  verbose('Importing conversation:', composerId);
  
  // Load composer metadata
  const composerRows = querySqlite(dbPath, 
    `SELECT value FROM cursorDiskKV WHERE key = 'composerData:${composerId}'`
  );
  
  if (composerRows.length === 0) {
    throw new Error(`Conversation not found: ${composerId}`);
  }
  
  const composerData = parseComposerData(composerRows[0].value);
  if (!composerData) {
    throw new Error(`Failed to parse composer data for: ${composerId}`);
  }
  
  // Load all bubbles for this conversation
  const bubbleRows = queryKeys(dbPath, `bubbleId:${composerId}:%`);
  const bubblesById = new Map();
  
  for (const row of bubbleRows) {
    const bubble = parseBubble(row.value);
    if (bubble?.bubbleId) {
      bubblesById.set(bubble.bubbleId, bubble);
    }
  }
  
  // Get ordered bubble IDs from composer headers
  const headers = composerData.fullConversationHeadersOnly || [];
  
  // Build messages
  const messages = [];
  let turnCounter = 0;
  let currentTurnId = null;
  
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const bubble = bubblesById.get(header.bubbleId);
    
    if (!bubble) {
      verbose('Missing bubble:', header.bubbleId);
      continue;
    }
    
    const isUser = header.type === 1 || bubble.type === 1;
    const role = isUser ? 'user' : 'assistant';
    
    // Start new turn on user message
    if (isUser) {
      turnCounter++;
      currentTurnId = `cursor-turn-${turnCounter}`;
    }
    
    // If we haven't seen a user message yet, create a turn
    if (!currentTurnId) {
      turnCounter++;
      currentTurnId = `cursor-turn-${turnCounter}`;
    }
    
    let text = extractBubbleText(bubble);
    
    // Append tool call info for assistant messages
    if (!isUser) {
      text += formatToolCall(bubble);
    }
    
    // Skip empty messages
    if (!text.trim()) {
      verbose('Skipping empty message:', header.bubbleId);
      continue;
    }
    
    messages.push({
      id: bubble.bubbleId || `msg-${i}`,
      turnId: currentTurnId,
      role,
      text,
      createdAt: extractBubbleTimestamp(bubble),
    });
  }
  
  // Build title
  let title = composerData.name;
  if (!title || title === '(untitled)') {
    // Generate from first user message
    const firstUser = messages.find(m => m.role === 'user');
    if (firstUser) {
      title = '[CURSOR] ' + firstUser.text.slice(0, 50).replace(/\n/g, ' ');
      if (firstUser.text.length > 50) title += '...';
    } else {
      title = '[CURSOR] Imported conversation';
    }
  } else {
    title = '[CURSOR] ' + title;
  }
  
  // Build Rebel session format
  const session = {
    id: `cursor-${composerId}`,
    title,
    createdAt: composerData.createdAt || Date.now(),
    updatedAt: composerData.lastUpdatedAt || Date.now(),
    messages,
    eventsByTurn: {}, // Minimal - we don't have streaming events
    activeTurnId: null,
    isBusy: false,
    lastError: null,
    resolvedAt: composerData.lastUpdatedAt || Date.now(),
    origin: 'manual',
  };
  
  return session;
}

// ============================================================================
// Main
// ============================================================================

function printUsage() {
  console.log(`
Cursor to Rebel Conversation Importer

Usage:
  node import-single-cursor-conversation.cjs [options]

Options:
  --list                   List available conversations (no import)
  --conversation <id>      Import specific conversation by ID
  --all                    Import most recent conversations (see --limit)
  --limit <N>              Number of conversations to list/import (default: 100)
  --output <path>          Output directory (default: ./imported-sessions)
  --db <path>              Custom path to Cursor's state.vscdb
  --rebel-sessions         Output directly to Rebel's sessions folder
  --verbose                Enable verbose logging
  --help                   Show this help message

Examples:
  node import-single-cursor-conversation.cjs --list
  node import-single-cursor-conversation.cjs --all --output ~/cursor-import
  node import-single-cursor-conversation.cjs --conversation abc-123 --rebel-sessions
`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.length === 0) {
    printUsage();
    process.exit(0);
  }
  
  // Parse arguments
  const doList = args.includes('--list');
  const doAll = args.includes('--all');
  const useRebelSessions = args.includes('--rebel-sessions');
  
  let conversationId = null;
  const convIdx = args.indexOf('--conversation');
  if (convIdx !== -1 && args[convIdx + 1]) {
    conversationId = args[convIdx + 1];
  }
  
  let limit = 100; // Default to 100 most recent
  const limitIdx = args.indexOf('--limit');
  if (limitIdx !== -1 && args[limitIdx + 1]) {
    limit = parseInt(args[limitIdx + 1], 10) || 100;
  }
  
  let outputDir = './imported-sessions';
  const outIdx = args.indexOf('--output');
  if (outIdx !== -1 && args[outIdx + 1]) {
    outputDir = args[outIdx + 1];
  }
  
  if (useRebelSessions) {
    outputDir = getRebelSessionsPath();
  }
  
  let dbPath = null;
  const dbIdx = args.indexOf('--db');
  if (dbIdx !== -1 && args[dbIdx + 1]) {
    dbPath = args[dbIdx + 1];
  } else {
    dbPath = getCursorGlobalStoragePath();
  }
  
  // Validate database exists
  if (!fs.existsSync(dbPath)) {
    error('Cursor database not found at:', dbPath);
    error('Make sure Cursor is installed and has been used at least once.');
    error('You can also specify a custom path with --db <path>');
    process.exit(1);
  }
  
  // Check sqlite3 is available
  try {
    execSync('sqlite3 --version', { encoding: 'utf8' });
  } catch {
    error('sqlite3 command not found. Please install SQLite:');
    error('  macOS: brew install sqlite');
    error('  Ubuntu/Debian: sudo apt install sqlite3');
    error('  Windows: download from https://sqlite.org/download.html');
    process.exit(1);
  }
  
  log('Using database:', dbPath);
  
  // List conversations
  if (doList) {
    const conversations = listConversations(dbPath, limit);
    
    console.log(`\nShowing ${conversations.length} most recent conversations (use --limit N to show more):\n`);
    console.log('ID'.padEnd(40) + 'Messages'.padEnd(10) + 'Updated'.padEnd(25) + 'Title');
    console.log('-'.repeat(100));
    
    for (const conv of conversations) {
      const date = new Date(conv.updatedAt).toLocaleString();
      const title = conv.title.slice(0, 40);
      console.log(
        conv.id.slice(0, 38).padEnd(40) +
        String(conv.messageCount).padEnd(10) +
        date.padEnd(25) +
        title
      );
    }
    
    console.log(`\nTo import a specific conversation:`);
    console.log(`  node import-single-cursor-conversation.cjs --conversation <id> --output <dir>`);
    console.log(`\nTo import the ${limit} most recent conversations:`);
    console.log(`  node import-single-cursor-conversation.cjs --all --output <dir>`);
    return;
  }
  
  // Import conversations
  const toImport = [];
  
  if (conversationId) {
    toImport.push(conversationId);
  } else if (doAll) {
    const conversations = listConversations(dbPath, limit);
    toImport.push(...conversations.map(c => c.id));
  } else {
    error('Please specify --list, --conversation <id>, or --all');
    process.exit(1);
  }
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    log('Created output directory:', outputDir);
  }
  
  // Import each conversation
  let successCount = 0;
  let errorCount = 0;
  
  for (const id of toImport) {
    try {
      const session = importConversation(dbPath, id);
      const outputPath = path.join(outputDir, `${session.id}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(session, null, 2));
      log(`Imported: ${session.title} (${session.messages.length} messages)`);
      successCount++;
    } catch (err) {
      error(`Failed to import ${id}:`, err.message);
      errorCount++;
    }
  }
  
  console.log(`\nImport complete: ${successCount} succeeded, ${errorCount} failed`);
  console.log(`Output directory: ${outputDir}`);
  
  if (useRebelSessions) {
    console.log(`\nNote: Sessions were written directly to Rebel's sessions folder.`);
    console.log(`Restart Rebel to see the imported conversations in the sidebar.`);
  }
}

main();
