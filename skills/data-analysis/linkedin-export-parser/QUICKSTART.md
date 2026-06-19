# LinkedIn Export Parser - Quickstart

Get started in 2 minutes.

## 1. Install

```bash
cd rebel-system/skills/data-analysis/linkedin-export-parser/scripts
npm install
```

## 2. Find Your Export

LinkedIn exports are typically in Downloads or Desktop:

```bash
# macOS
mdfind -name "linkedin" | grep -i "export\|data" | grep ".zip"

# Or check common locations
ls ~/Downloads/*[Ll]inked[Ii]n*.zip
ls ~/Desktop/*[Ll]inked[Ii]n*.zip
```

## 3. Quick Stats

Get network overview without full parsing:

```bash
node network_stats.js ~/Downloads/linkedin-export.zip
```

## 4. Find Someone

Parse and search for a person:

```bash
node parse_linkedin_export.js ~/Downloads/linkedin-export.zip
node query_linkedin_data.js find-person --name "Adrian"
```

## 5. Export Connections to CSV

```bash
node extract_connections_csv.js ~/Downloads/linkedin-export.zip --format csv --output ~/Desktop/my_connections.csv
```

## Common Commands

```bash
# See what's in the export
node list_export_contents.js export.zip

# Full parse
node parse_linkedin_export.js export.zip

# Find people
node query_linkedin_data.js find-person --name "Smith"

# Find by company
node query_linkedin_data.js connections-by-company --company "Google"

# Search messages
node query_linkedin_data.js messages-search --query "meeting"

# Network stats
node query_linkedin_data.js stats
```

## Need More?

- See `SKILL.md` for full documentation
- See `EXAMPLES.md` for detailed workflows
