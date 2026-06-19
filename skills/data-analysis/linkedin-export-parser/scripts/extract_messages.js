#!/usr/bin/env node

/**
 * Extract and organize Messages from LinkedIn export
 * Groups messages into conversations by participant
 * 
 * Use cases:
 * - Find message history with specific person
 * - Export conversations for reference
 * - Search across all messages
 */

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const { parse } = require('csv-parse/sync');

function extractMessages(zipPath, options = {}) {
  const { output = null, groupByConversation = true, person = null, search = null, limit = 100 } = options;

  if (!fs.existsSync(zipPath)) {
    console.error(`Error: File not found: ${zipPath}`);
    process.exit(1);
  }

  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  // Find messages.csv
  const messagesEntry = entries.find(e => 
    e.entryName.toLowerCase().includes('messages') && 
    e.entryName.endsWith('.csv')
  );

  if (!messagesEntry) {
    console.error('Error: messages.csv not found in export');
    console.log('This might be a Basic export which does not include messages.');
    process.exit(1);
  }

  // Parse CSV
  let content = messagesEntry.getData().toString('utf8').replace(/^\uFEFF/, '');
  
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true
  });

  // Normalize records
  let messages = records.map(r => ({
    conversation_id: r['CONVERSATION ID'] || r['Conversation ID'] || r.conversation_id || '',
    conversation_title: r['CONVERSATION TITLE'] || r['Conversation Title'] || r.conversation_title || '',
    from: r['FROM'] || r['From'] || r.from || '',
    to: r['TO'] || r['To'] || r.to || '',
    date: r['DATE'] || r['Date'] || r.date || '',
    subject: r['SUBJECT'] || r['Subject'] || r.subject || '',
    content: r['CONTENT'] || r['Content'] || r.content || '',
    folder: r['FOLDER'] || r['Folder'] || r.folder || ''
  })).filter(m => m.from || m.to);

  // Apply filters
  if (person) {
    const personLower = person.toLowerCase();
    messages = messages.filter(m => 
      m.from.toLowerCase().includes(personLower) || 
      m.to.toLowerCase().includes(personLower) ||
      m.conversation_title.toLowerCase().includes(personLower)
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    messages = messages.filter(m =>
      m.content.toLowerCase().includes(searchLower) ||
      m.subject.toLowerCase().includes(searchLower)
    );
  }

  // Group by conversation if requested
  let result;
  if (groupByConversation && !person && !search) {
    const conversations = {};
    messages.forEach(m => {
      const key = m.conversation_id || m.conversation_title || `${m.from}-${m.to}`;
      if (!conversations[key]) {
        conversations[key] = {
          conversation_id: m.conversation_id,
          title: m.conversation_title,
          messages: []
        };
      }
      conversations[key].messages.push(m);
    });
    
    // Sort conversations by most recent
    result = Object.values(conversations)
      .sort((a, b) => {
        const aDate = a.messages[a.messages.length - 1]?.date || '';
        const bDate = b.messages[b.messages.length - 1]?.date || '';
        return bDate.localeCompare(aDate);
      })
      .slice(0, limit);
  } else {
    result = messages.slice(0, limit);
  }

  // Output
  const outputContent = JSON.stringify(result, null, 2);

  if (output) {
    fs.writeFileSync(output, outputContent);
    const count = Array.isArray(result) ? result.length : Object.keys(result).length;
    console.log(`Extracted ${count} ${groupByConversation ? 'conversations' : 'messages'} to ${output}`);
  } else {
    console.log(outputContent);
  }

  return result;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const zipPath = args[0];
  
  if (!zipPath) {
    console.log('Usage: node extract_messages.js <path-to-export.zip> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --person <name>       Filter by participant name');
    console.log('  --search <text>       Search message content');
    console.log('  --output <file>       Write to file instead of stdout');
    console.log('  --flat                Output flat message list (no grouping)');
    console.log('  --limit <n>           Max results (default: 100)');
    console.log('');
    console.log('Examples:');
    console.log('  node extract_messages.js export.zip');
    console.log('  node extract_messages.js export.zip --person "John Smith"');
    console.log('  node extract_messages.js export.zip --search "fundraising"');
    process.exit(1);
  }

  const options = {
    output: args.includes('--output') ? args[args.indexOf('--output') + 1] : null,
    person: args.includes('--person') ? args[args.indexOf('--person') + 1] : null,
    search: args.includes('--search') ? args[args.indexOf('--search') + 1] : null,
    groupByConversation: !args.includes('--flat'),
    limit: args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : 100
  };

  extractMessages(zipPath, options);
}

module.exports = { extractMessages };
