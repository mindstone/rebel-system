#!/usr/bin/env node

const OLMReader = require('olm-reader');
const fs = require('fs');
const path = require('path');

const olmPath = process.argv[2];
const outDir = process.argv[3] || path.join(path.dirname(olmPath || '.'), 'outlook-export');

if (!olmPath) {
  console.error('Usage: node parse_olm.js <file.olm> [output-dir]');
  console.error('Example: node parse_olm.js ~/Desktop/export.olm ~/Desktop/outlook-export');
  process.exit(1);
}

if (!fs.existsSync(olmPath)) {
  console.error(`File not found: ${olmPath}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const manifest = [];
let count = 0;
const folderCounts = {};

function slugify(str, maxLen) {
  return (str || 'no-subject')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, maxLen || 50) || 'no-subject';
}

function uniquePath(dir, filename) {
  let filepath = path.join(dir, filename);
  if (!fs.existsSync(filepath)) return filepath;
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  let i = 2;
  while (fs.existsSync(filepath)) {
    filepath = path.join(dir, `${base}_${i}${ext}`);
    i++;
  }
  return filepath;
}

function getText(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj['#text'] || obj['_'] || String(obj);
}

console.log(`Parsing: ${olmPath}`);
console.log(`Output:  ${outDir}\n`);

const reader = new OLMReader(null, false, false);

reader.setCallback('email', (email, fullPath) => {
  try {
    const subject = getText(email.OPFMessageCopySubject);
    const from = getText(email.OPFMessageCopyFromAddresses);
    const senderName = getText(email.OPFMessageCopySenderName) || from;
    const to = getText(email.OPFMessageCopyToAddresses);
    const cc = getText(email.OPFMessageCopyCCAddresses);
    const bcc = getText(email.OPFMessageCopyBCCAddresses);
    const sentTime = getText(email.OPFMessageCopySentTime);
    const body = getText(email.OPFMessageCopyBody);
    const htmlBody = getText(email.OPFMessageCopyHTMLBody);
    const isRead = getText(email.OPFMessageCopyIsRead) === '1';

    const date = sentTime ? new Date(sentTime) : null;
    const dateStr = date && !isNaN(date.getTime())
      ? date.toISOString().replace(/[:.]/g, '-').slice(0, 19)
      : 'nodate';
    const slug = slugify(subject, 50);
    const filename = `${dateStr}_${slug}.json`;
    const filepath = uniquePath(outDir, filename);

    const folder = fullPath || 'Unknown';

    const record = {
      subject: subject || '',
      from: from || '',
      fromName: senderName || '',
      to: to || '',
      cc: cc || '',
      bcc: bcc || '',
      date: date && !isNaN(date.getTime()) ? date.toISOString() : null,
      body: body || '',
      bodyHtml: htmlBody || '',
      folder,
      hasAttachments: getText(email.OPFMessageCopyHasAttachments) === '1',
      numberOfAttachments: null,  // OLM format does not expose attachment count
      importance: null,           // OLM format does not expose importance
      isRead,
      conversationTopic: null,    // OLM format does not expose conversation topic separately
      internetMessageId: getText(email.OPFMessageCopyMessageID) || '',
    };

    fs.writeFileSync(filepath, JSON.stringify(record, null, 2), 'utf8');

    manifest.push({
      file: path.basename(filepath),
      date: record.date,
      from: record.from,
      fromName: record.fromName,
      subject: record.subject,
      folder,
    });

    folderCounts[folder] = (folderCounts[folder] || 0) + 1;
    count++;
    if (count % 200 === 0) {
      console.log(`  ...${count} exported`);
    }
  } catch (e) {
    console.warn(`Skipped one email: ${e.message}`);
  }
});

function writeManifestAndSummary() {
  const manifestData = {
    exportDate: new Date().toISOString(),
    sourceFile: path.basename(olmPath),
    totalEmails: count,
    folderCounts,
    emails: manifest,
  };

  fs.writeFileSync(
    path.join(outDir, '_manifest.json'),
    JSON.stringify(manifestData, null, 2),
    'utf8'
  );

  const sizeMB = (
    fs.readdirSync(outDir)
      .reduce((sum, f) => sum + fs.statSync(path.join(outDir, f)).size, 0) / (1024 * 1024)
  ).toFixed(1);

  console.log(`\nDone! ${count} emails exported to: ${outDir}`);
  console.log(`Total size: ${sizeMB} MB`);
  console.log('\nEmails per folder:');
  for (const [folder, c] of Object.entries(folderCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${c.toString().padStart(5)}  ${folder}`);
  }
}

reader.readOLMFile(path.resolve(olmPath))
  .then(writeManifestAndSummary)
  .catch(err => {
    if (err.message && err.message.includes('multi-disk')) {
      console.log('Retrying with streaming mode for multi-disk archive...');
      return reader.readOLMFile(path.resolve(olmPath), true)
        .then(writeManifestAndSummary);
    }
    console.error(`Error parsing OLM: ${err.message}`);
    process.exit(1);
  });
