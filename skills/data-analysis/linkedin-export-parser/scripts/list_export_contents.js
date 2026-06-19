#!/usr/bin/env node

/**
 * List contents of a LinkedIn data export ZIP
 * Shows what files are available before parsing
 * Useful for understanding Basic vs Complete export differences
 */

const fs = require('fs');
const AdmZip = require('adm-zip');

function listExportContents(zipPath) {
  if (!fs.existsSync(zipPath)) {
    console.error(`Error: File not found: ${zipPath}`);
    process.exit(1);
  }

  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  const files = [];
  const folders = new Set();

  entries.forEach(entry => {
    if (entry.isDirectory) {
      folders.add(entry.entryName);
    } else {
      const size = entry.header.size;
      files.push({
        name: entry.entryName,
        size: size,
        sizeFormatted: formatBytes(size)
      });
    }
  });

  // Categorize files
  const csvFiles = files.filter(f => f.name.endsWith('.csv'));
  const mediaFiles = files.filter(f => !f.name.endsWith('.csv'));

  console.log(`\nLinkedIn Export: ${zipPath}`);
  console.log('='.repeat(60));

  console.log(`\nCSV Files (${csvFiles.length}):`);
  csvFiles.sort((a, b) => b.size - a.size);
  csvFiles.forEach(f => {
    console.log(`  ${f.sizeFormatted.padStart(10)}  ${f.name}`);
  });

  if (mediaFiles.length > 0) {
    console.log(`\nMedia/Other Files (${mediaFiles.length}):`);
    mediaFiles.slice(0, 20).forEach(f => {
      console.log(`  ${f.sizeFormatted.padStart(10)}  ${f.name}`);
    });
    if (mediaFiles.length > 20) {
      console.log(`  ... and ${mediaFiles.length - 20} more files`);
    }
  }

  if (folders.size > 0) {
    console.log(`\nFolders (${folders.size}):`);
    Array.from(folders).sort().forEach(f => {
      console.log(`  ${f}`);
    });
  }

  // Summary
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  console.log(`\nSummary:`);
  console.log(`  Total files: ${files.length}`);
  console.log(`  CSV files: ${csvFiles.length}`);
  console.log(`  Total size: ${formatBytes(totalSize)}`);

  // Identify export type
  const hasMessages = csvFiles.some(f => f.name.toLowerCase().includes('messages'));
  const hasArticles = files.some(f => f.name.toLowerCase().includes('articles'));
  const hasMedia = folders.has('Articles/') || mediaFiles.length > 0;

  console.log(`\nExport Type:`);
  if (hasMessages && (hasArticles || hasMedia)) {
    console.log(`  Complete/Full archive (includes messages, articles, media)`);
  } else if (hasMessages) {
    console.log(`  Complete archive (includes messages)`);
  } else {
    console.log(`  Basic archive (connections/profile only)`);
  }

  return { files, csvFiles, mediaFiles, folders: Array.from(folders) };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

if (require.main === module) {
  const zipPath = process.argv[2];
  if (!zipPath) {
    console.log('Usage: node list_export_contents.js <path-to-linkedin-export.zip>');
    process.exit(1);
  }
  listExportContents(zipPath);
}

module.exports = { listExportContents };
