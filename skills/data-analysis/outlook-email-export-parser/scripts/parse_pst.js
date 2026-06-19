#!/usr/bin/env node

const { PSTFile } = require('pst-extractor');
const fs = require('fs');
const path = require('path');

const pstPath = process.argv[2];
const outDir = process.argv[3] || path.join(path.dirname(pstPath || '.'), 'outlook-export');

if (!pstPath) {
  console.error('Usage: node parse_pst.js <file.pst> [output-dir]');
  console.error('Example: node parse_pst.js ~/Desktop/export.pst ~/Desktop/outlook-export');
  process.exit(1);
}

if (!fs.existsSync(pstPath)) {
  console.error(`File not found: ${pstPath}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const pst = new PSTFile(path.resolve(pstPath));
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

function processFolder(folder, folderPath) {
  const name = folder.displayName || 'Root';
  const currentPath = folderPath ? `${folderPath}/${name}` : name;

  if (folder.hasSubfolders) {
    const subs = folder.getSubFolders();
    for (const sub of subs) {
      processFolder(sub, currentPath);
    }
  }

  let email = folder.getNextChild();
  while (email != null) {
    try {
      if (email.messageClass === 'IPM.Note' || email.messageClass === '' || !email.messageClass) {
        const date = email.clientSubmitTime || email.creationTime;
        const dateStr = date
          ? new Date(date).toISOString().replace(/[:.]/g, '-').slice(0, 19)
          : 'nodate';
        const slug = slugify(email.subject, 50);
        const filename = `${dateStr}_${slug}.json`;
        const filepath = uniquePath(outDir, filename);

        const record = {
          subject: email.subject || '',
          from: email.senderEmailAddress || '',
          fromName: email.senderName || '',
          to: email.displayTo || '',
          cc: email.displayCC || '',
          bcc: email.displayBCC || '',
          date: date ? new Date(date).toISOString() : null,
          body: email.body || '',
          bodyHtml: email.bodyHTML || '',
          folder: currentPath,
          hasAttachments: email.hasAttachments || false,
          numberOfAttachments: email.numberOfAttachments || 0,
          importance: email.importance,
          isRead: email.isRead || false,
          conversationTopic: email.conversationTopic || '',
          internetMessageId: email.internetMessageId || '',
        };

        fs.writeFileSync(filepath, JSON.stringify(record, null, 2), 'utf8');

        manifest.push({
          file: path.basename(filepath),
          date: record.date,
          from: record.from,
          fromName: record.fromName,
          subject: record.subject,
          folder: currentPath,
        });

        count++;
        folderCounts[currentPath] = (folderCounts[currentPath] || 0) + 1;

        if (count % 200 === 0) {
          console.log(`  ...${count} exported`);
        }
      }
    } catch (e) {
      console.warn(`Skipped one item in ${currentPath}: ${e.message}`);
    }
    email = folder.getNextChild();
  }
}

console.log(`Parsing: ${pstPath}`);
console.log(`Output:  ${outDir}\n`);

processFolder(pst.getRootFolder(), '');

const manifestData = {
  exportDate: new Date().toISOString(),
  sourceFile: path.basename(pstPath),
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
