#!/usr/bin/env node
// Date calculation utility - timezone-safe (UTC-based, no local time drift)
// Usage:
//   node date-calc.js day-of-week YYYY-MM-DD
//   node date-calc.js add-days YYYY-MM-DD N
//   node date-calc.js days-between YYYY-MM-DD YYYY-MM-DD

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(`Invalid date format: ${s} (expected YYYY-MM-DD)`);
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (isNaN(dt.getTime())) throw new Error(`Invalid date: ${s}`);
  return dt;
}

function formatDate(dt) {
  return dt.toISOString().slice(0, 10);
}

const [, , cmd, ...args] = process.argv;

try {
  switch (cmd) {
    case 'day-of-week': {
      const dt = parseDate(args[0]);
      console.log(WEEKDAYS[dt.getUTCDay()]);
      break;
    }
    case 'add-days': {
      const dt = parseDate(args[0]);
      const n = parseInt(args[1], 10);
      if (isNaN(n)) throw new Error(`Invalid number of days: ${args[1]}`);
      dt.setUTCDate(dt.getUTCDate() + n);
      console.log(formatDate(dt));
      break;
    }
    case 'days-between': {
      const a = parseDate(args[0]);
      const b = parseDate(args[1]);
      console.log(Math.round((b - a) / 86400000));
      break;
    }
    default:
      console.log(`Usage:
  node date-calc.js day-of-week YYYY-MM-DD           → weekday name
  node date-calc.js add-days YYYY-MM-DD N            → date N days later (negative for earlier)
  node date-calc.js days-between YYYY-MM-DD YYYY-MM-DD → signed difference in days`);
      process.exit(cmd ? 1 : 0);
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
