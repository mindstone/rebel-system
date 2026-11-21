// Reads saved emails (.eml, .msg) and calendar files (.ics) with Rebel's built-in libraries.
// Prints JSON. Usage:
//   node mail.cjs read <message.eml|message.msg> [attachments-folder]
//   node mail.cjs calendar <invite.ics>
const fs = require('node:fs');
const path = require('node:path');
function missingBundle() {
  throw new Error("Rebel's built-in document libraries were not found. This is a problem with the Rebel installation, not with your file: report it, and don't try to install packages.");
}
const bundled = require('node:module').createRequire(path.join(process.env.REBEL_BUNDLED_NODE_MODULES || missingBundle(), 'x.js'));

// A long newsletter must not flood the conversation; the cut is reported.
const MAX_TEXT = 100_000;
function clip(text) {
  const value = (text ?? '').trim();
  return value.length > MAX_TEXT ? { text: value.slice(0, MAX_TEXT), textTruncated: true } : { text: value, textTruncated: false };
}

// Attachment names come from the sender: keep the last path part, drop characters no system
// accepts (a ':' would name a hidden Windows stream), avoid Windows device names, never overwrite.
function safeName(name) {
  let safe = path.basename(String(name || '').replace(/\\/g, '/'))
    .replace(/[<>:"|?*\u0000-\u001f]/g, '_').replace(/^[.\s]+|[.\s]+$/g, '').slice(0, 200);
  if (/^(con|prn|aux|nul|com\d|lpt\d)(\.|$)/i.test(safe)) safe = `_${safe}`;
  return safe || 'attachment';
}
function saveAttachment(folder, name, content) {
  fs.mkdirSync(folder, { recursive: true });
  const { name: stem, ext } = path.parse(safeName(name));
  for (let n = 1; ; n++) {
    const target = path.join(folder, n === 1 ? `${stem}${ext}` : `${stem} (${n})${ext}`);
    try {
      fs.writeFileSync(target, content, { flag: 'wx' });
      return path.resolve(target);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
}

// Many emails have only an HTML part; its words are what the reader saw.
function htmlText(html) {
  return html ? bundled('html-to-text').convert(html, { wordwrap: false }) : '';
}

// Outlook stores an HTML body as bytes in the email's own character set.
const CODEPAGES = { 932: 'shift_jis', 936: 'gbk', 949: 'euc-kr', 950: 'big5', 20932: 'euc-jp', 50220: 'iso-2022-jp', 51932: 'euc-jp', 28591: 'iso-8859-1', 28592: 'iso-8859-2', 28605: 'iso-8859-15', 65001: 'utf-8' };
function decodeHtml(bytes, codepage) {
  const label = CODEPAGES[codepage] ?? (codepage >= 874 && codepage <= 1258 ? `windows-${codepage}` : 'utf-8');
  try {
    return new TextDecoder(label).decode(bytes);
  } catch {
    return new TextDecoder('utf-8').decode(bytes);
  }
}

async function readEml(file, folder) {
  const { simpleParser } = bundled('mailparser');
  const mail = await simpleParser(fs.readFileSync(file), { skipImageLinks: true });
  // A named group ("Team: bob@example.com, carol@example.com;") lists its members.
  const people = list => list.flatMap(a => (a.group ? people(a.group) : a.address ? [a.name ? `${a.name} <${a.address}>` : a.address] : a.name ? [a.name] : []));
  const addresses = field => (field ? [].concat(field).flatMap(header => people(header.value)) : []);
  return {
    subject: mail.subject ?? '',
    from: addresses(mail.from),
    to: addresses(mail.to),
    cc: addresses(mail.cc),
    date: mail.date ? mail.date.toISOString() : null,
    ...clip(mail.text || htmlText(mail.html)),
    attachments: mail.attachments.map(a => ({
      name: a.filename ?? 'attachment',
      type: a.contentType,
      bytes: a.size,
      ...(folder ? { savedTo: saveAttachment(folder, a.filename, a.content) } : {}),
    })),
  };
}

function readMsg(file, folder) {
  const MsgReader = bundled('@kenjiuno/msgreader').default;
  const reader = new MsgReader(fs.readFileSync(file));
  const data = reader.getFileData();
  if (data.error) throw new Error(`Not a readable Outlook .msg file: ${data.error}`);
  const person = r => (r.name && r.email && r.name !== r.email ? `${r.name} <${r.email}>` : r.email || r.name);
  const recipients = kind => (data.recipients ?? []).filter(r => (r.recipType ?? 'to') === kind).map(person);
  const sent = data.clientSubmitTime || data.messageDeliveryTime;
  return {
    subject: data.subject ?? '',
    from: [person({ name: data.senderName, email: data.senderSmtpAddress || data.senderEmail })].filter(Boolean),
    to: recipients('to'),
    cc: recipients('cc'),
    date: sent ? new Date(sent).toISOString() : null,
    ...clip(data.body || htmlText(data.bodyHtml || (data.html ? decodeHtml(data.html, data.internetCodepage) : ''))),
    attachments: (data.attachments ?? []).map(a => {
      // An email attached inside the email is saved as its own .msg, which this command reads too.
      const saved = folder ? reader.getAttachment(a) : null;
      const name = saved?.fileName || a.fileName || a.name || 'attachment';
      const entry = { name, type: a.attachMimeTag ?? null, bytes: a.contentLength ?? saved?.content.length ?? null };
      if (a.innerMsgContent) entry.attachedEmail = true;
      return saved ? { ...entry, savedTo: saveAttachment(folder, name, saved.content) } : entry;
    }),
  };
}

function knownZone(tzid) {
  try {
    new Intl.DateTimeFormat('en', { timeZone: tzid });
    return true;
  } catch {
    return false;
  }
}
// Clock time in a named zone to UTC, using the zone rules Node ships.
function zonedToUtc(time, tzid) {
  const wall = Date.UTC(time.year, time.month - 1, time.day, time.hour, time.minute, time.second);
  const format = new Intl.DateTimeFormat('en-US', { timeZone: tzid, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
  const offset = at => {
    const p = Object.fromEntries(format.formatToParts(new Date(at)).map(x => [x.type, Number(x.value)]));
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - at;
  };
  return new Date(wall - offset(wall - offset(wall))).toISOString();
}

function readCalendar(file) {
  const ICAL = bundled('ical.js');
  const calendar = new ICAL.Component(ICAL.parse(fs.readFileSync(file, 'utf8')));
  // A time is UTC when the file says where it is: UTC itself, a zone the file describes, or a
  // known zone name. A "floating" time (no zone) is the same clock time everywhere: kept as written.
  const when = (time, tzid) => {
    if (!time) return null;
    if (time.isDate) return time.toString();
    if (time.zone?.tzid === 'UTC' || (time.zone && time.zone.tzid !== 'floating' && time.zone !== ICAL.Timezone.localTimezone)) return time.toJSDate().toISOString();
    if (tzid && knownZone(tzid)) return zonedToUtc(time, tzid);
    return time.toString().replace(/Z$/, '');
  };
  const person = property => {
    const name = property.getParameter('cn');
    const email = String(property.getFirstValue() ?? '').replace(/^mailto:/i, '');
    return name ? `${name} <${email}>` : email;
  };
  const events = calendar.getAllSubcomponents('vevent').map(component => {
    const event = new ICAL.Event(component);
    const organizer = component.getFirstProperty('organizer');
    const startZone = component.getFirstProperty('dtstart')?.getParameter('tzid') ?? null;
    const dates = name => component.getAllProperties(name).flatMap(property => property.getValues()).map(value => when(value, startZone));
    const replaces = event.recurrenceId;
    return {
      title: event.summary ?? '',
      start: when(event.startDate, startZone),
      end: when(event.endDate, component.getFirstProperty('dtend')?.getParameter('tzid') ?? startZone),
      allDay: Boolean(event.startDate?.isDate),
      timeZone: startZone ?? (event.startDate && !event.startDate.isDate && event.startDate.zone?.tzid !== 'UTC' ? 'floating' : null),
      location: event.location ?? '',
      organizer: organizer ? person(organizer) : null,
      attendees: event.attendees.map(person),
      repeats: component.getFirstPropertyValue('rrule')?.toString() ?? null,
      alsoOn: dates('rdate'),
      except: dates('exdate'),
      ...(replaces ? { changesOccurrenceOn: when(replaces, component.getFirstProperty('recurrence-id')?.getParameter('tzid') ?? startZone) } : {}),
      status: component.getFirstPropertyValue('status') ?? null,
      ...clip(event.description),
    };
  });
  return { method: calendar.getFirstPropertyValue('method') ?? null, events };
}

async function main() {
  const [command, file, folder] = process.argv.slice(2);
  if (!file || !['read', 'calendar'].includes(command)) {
    throw new Error('Usage: mail.cjs read <message.eml|message.msg> [attachments-folder] | mail.cjs calendar <invite.ics>');
  }
  if (command === 'calendar') return readCalendar(file);
  const extension = path.extname(file).toLowerCase();
  if (extension === '.msg') return readMsg(file, folder);
  if (extension === '.eml' || extension === '') return readEml(file, folder);
  throw new Error(`Expected a .eml or .msg file, got ${extension}. For .ics use the calendar command; for .pst or .olm use outlook-email-export-parser.`);
}

// A damaged or hostile file can make a parser loop or ask for huge amounts of memory, so the
// work runs in a child Node with a memory cap and a time limit.
const LIMIT_MS = 120_000;
if (process.env.REBEL_MAIL_WORKER) {
  main().then(
    result => console.log(JSON.stringify(result, null, 2)),
    error => {
      console.error(`[mail] ${error.message}`);
      process.exit(1);
    },
  );
} else {
  const child = require('node:child_process').spawnSync(process.execPath, ['--max-old-space-size=1024', __filename, ...process.argv.slice(2)], {
    stdio: 'inherit', timeout: LIMIT_MS, env: { ...process.env, REBEL_MAIL_WORKER: '1' },
  });
  if (child.error?.code === 'ETIMEDOUT' || (child.signal && child.status === null)) {
    console.error(`[mail] Gave up on this file (${child.error?.code === 'ETIMEDOUT' ? 'still reading after 2 minutes' : `stopped by ${child.signal}`}): it looks damaged or is too large to read.`);
    process.exit(1);
  }
  if (child.error) throw child.error;
  process.exit(child.status ?? 1);
}
