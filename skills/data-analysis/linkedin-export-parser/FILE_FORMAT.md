# LinkedIn Export File Format Reference

Technical reference for LinkedIn data export structure and contents.

## Export Types

### Basic Export
Arrives within minutes. Contains:
- `Connections.csv`
- `Profile.csv`
- Basic account data

### Complete/Full Archive
Arrives within 24 hours. Contains everything in Basic, plus:
- `messages.csv`
- `Endorsements Received.csv`
- `Endorsements Given.csv`
- `Recommendations Received.csv`
- `Recommendations Given.csv`
- `Skills.csv`
- `Positions.csv`
- `Education.csv`
- `Certifications.csv`
- `Invitations.csv`
- `Comments.csv`
- `Shares.csv`
- `Articles/` folder with drafts and media

## CSV File Schemas

### Connections.csv

```csv
First Name,Last Name,URL,Email Address,Company,Position,Connected On
John,Doe,https://www.linkedin.com/in/johndoe,john@example.com,Acme Corp,CEO,17 Jan 2026
```

| Column | Type | Notes |
|--------|------|-------|
| First Name | string | May contain Unicode |
| Last Name | string | May contain Unicode |
| URL | URL | LinkedIn profile URL |
| Email Address | string | Often empty (privacy) |
| Company | string | Current company |
| Position | string | Current title |
| Connected On | date | Format: "DD Mon YYYY" |

### messages.csv

```csv
CONVERSATION ID,CONVERSATION TITLE,FROM,TO,DATE,SUBJECT,CONTENT,FOLDER
abc123,Chat with John,John Doe,Jane Smith,2026-01-15 10:30:00 UTC,Re: Meeting,Sounds good!,INBOX
```

| Column | Type | Notes |
|--------|------|-------|
| CONVERSATION ID | string | Thread identifier |
| CONVERSATION TITLE | string | Thread name |
| FROM | string | Sender name |
| TO | string | Recipient name |
| DATE | datetime | "YYYY-MM-DD HH:MM:SS UTC" |
| SUBJECT | string | May be empty |
| CONTENT | string | Message body, may contain newlines |
| FOLDER | string | INBOX, SENT, ARCHIVE |

### Profile.csv

Single row with profile data. Columns vary but typically include:
- First Name, Last Name
- Headline
- Summary
- Industry
- Current Position
- Location

### Positions.csv

```csv
Company Name,Title,Description,Location,Started On,Finished On
Acme Corp,CEO,Leading the company,San Francisco,Jan 2020,
```

### Education.csv

```csv
School Name,Start Date,End Date,Notes,Degree Name,Activities
MIT,2005,2009,,BS Computer Science,
```

### Skills.csv

```csv
Skills
Python
JavaScript
Machine Learning
```

## Date Formats

LinkedIn uses several date formats:

| Format | Example | Where Used |
|--------|---------|------------|
| DD Mon YYYY | 17 Jan 2026 | Connected On |
| YYYY-MM-DD HH:MM:SS UTC | 2026-01-17 10:30:00 UTC | Message dates |
| Mon YYYY | Jan 2020 | Position dates |
| YYYY | 2020 | Education dates |

## Encoding Issues

LinkedIn's official warning:
> "CSV and vCard files don't support all characters, particularly extended character sets like Chinese, Japanese, and Hebrew."

Best practices:
- Parse as UTF-8
- Handle BOM (Byte Order Mark) at file start
- Expect some characters may be garbled

## Known Quirks

### Preamble Text
Some CSVs start with "Notes:" section before the actual data:
```
Notes:
This file contains your connections data.

First Name,Last Name,URL,...
```

Parsers should skip to the header row.

### Malformed Quotes
Some CSVs have unbalanced quotes in fields. Use `relax_quotes: true` when parsing.

### Empty Rows
Connections.csv may have rows with empty names but valid dates:
```csv
,,,,,,02 Jun 2022
```

These can be filtered out during parsing.

### Field Name Variations
Different export dates may use different column names:
- "First Name" vs "first_name"
- "Connected On" vs "Connected Date"
- "URL" vs "url"

Parsers should check multiple variants.

## File Size Expectations

Typical sizes for active users:
- Connections.csv: 100KB - 2MB (1K-10K connections)
- messages.csv: 1MB - 50MB (varies greatly)
- Total ZIP: 5MB - 500MB

## Requesting an Export

1. Go to LinkedIn Settings
2. Click "Data privacy"
3. Click "Get a copy of your data"
4. Choose "Download larger data archive" for full export
5. Wait for email (Basic: minutes, Full: up to 24h)
6. Download from link in email

Export links expire after a few days.
