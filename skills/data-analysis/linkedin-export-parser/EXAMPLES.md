# LinkedIn Export Parser - Examples

Detailed workflows for common use cases.

## Example 1: Investor Discovery

**Goal:** Find investors and VCs in your network for fundraising.

### Step 1: Parse the export
```bash
node parse_linkedin_export.js ~/Downloads/linkedin-export.zip
```

### Step 2: Search for VC-related companies
```bash
# Venture firms
node query_linkedin_data.js connections-by-company --company "Ventures" > ventures.json

# Capital firms
node query_linkedin_data.js connections-by-company --company "Capital" > capital.json

# Partners firms
node query_linkedin_data.js connections-by-company --company "Partners" > partners.json
```

### Step 3: Combine and analyze
```bash
# Count results
echo "Ventures: $(cat ventures.json | jq 'length')"
echo "Capital: $(cat capital.json | jq 'length')"
echo "Partners: $(cat partners.json | jq 'length')"

# Get unique companies
cat ventures.json capital.json partners.json | \
  jq -s 'flatten | .[].company' | sort -u
```

### Step 4: Check warm intros via messages
```bash
# For each top prospect, check message history
node query_linkedin_data.js messages-with --person "Jane Smith"
```

---

## Example 2: Meeting Prep

**Goal:** Prepare for a meeting by reviewing connection history.

### Quick lookup
```bash
node query_linkedin_data.js find-person --name "Jane Smith"
```

**Output:**
```json
[
  {
    "name": "Jane Smith",
    "company": "Acme Corp",
    "position": "VP Engineering",
    "connected_on": "15 Mar 2019",
    "url": "https://www.linkedin.com/in/janesmith"
  }
]
```

### Check messages
```bash
node query_linkedin_data.js messages-with --person "Jane Smith"
```

### Get mutual connections at their company
```bash
node query_linkedin_data.js connections-by-company --company "Acme Corp"
```

---

## Example 3: Network Growth Analysis

**Goal:** Understand when and how you grew your network.

### Get yearly breakdown
```bash
node network_stats.js ~/Downloads/linkedin-export.zip
```

**Output:**
```
Connections by Year:
  2010:   45 █
  2011:  128 ███
  2012:  203 ████
  2013:  187 ████
  ...
  2025:  134 ███
  2026:   17 
```

### Find connections from a specific period
```bash
# Summer 2020
node query_linkedin_data.js connections-by-date --year 2020 --month 6
node query_linkedin_data.js connections-by-date --year 2020 --month 7
node query_linkedin_data.js connections-by-date --year 2020 --month 8
```

---

## Example 4: Export to CRM

**Goal:** Import connections into HubSpot, Salesforce, or other CRM.

### Export as CSV
```bash
node extract_connections_csv.js ~/Downloads/linkedin-export.zip \
  --format csv \
  --output ~/Desktop/linkedin_for_crm.csv
```

### Customize fields
```bash
# Without personal URLs
node extract_connections_csv.js ~/Downloads/linkedin-export.zip \
  --format csv \
  --no-url \
  --output ~/Desktop/linkedin_for_crm.csv
```

### Import process
1. Open CRM import tool
2. Select `linkedin_for_crm.csv`
3. Map fields:
   - first_name → First Name
   - last_name → Last Name
   - company → Company
   - position → Title
   - email → Email
4. Import and deduplicate

---

## Example 5: Find Old Colleagues

**Goal:** Reconnect with former coworkers.

### Find everyone from a company
```bash
node query_linkedin_data.js connections-by-company --company "Acme Corp"
```

### Cross-reference with messages
```bash
# Save connections
node query_linkedin_data.js connections-by-company --company "Acme Corp" > colleagues.json

# For each person, check last message
for name in $(cat colleagues.json | jq -r '.[].name'); do
  echo "=== $name ==="
  node query_linkedin_data.js messages-with --person "$name" --limit 1
done
```

---

## Example 6: Message Archive Search

**Goal:** Find old conversations about a topic.

### Search by keyword
```bash
node query_linkedin_data.js messages-search --query "fundraising"
```

### Search directly from ZIP
```bash
node extract_messages.js ~/Downloads/linkedin-export.zip --search "acquisition"
```

### Multiple keywords
```bash
node query_linkedin_data.js messages-search --query "investor" > investor_msgs.json
node query_linkedin_data.js messages-search --query "raise" > raise_msgs.json
node query_linkedin_data.js messages-search --query "funding" > funding_msgs.json

# Combine
cat investor_msgs.json raise_msgs.json funding_msgs.json | \
  jq -s 'flatten | unique_by(.date + .from)'
```

---

## Example 7: Company Research

**Goal:** Understand your network depth at target companies.

### Get all connections at target companies
```bash
for company in Google Meta Apple Amazon Microsoft; do
  count=$(node query_linkedin_data.js connections-by-company --company "$company" | jq 'length')
  echo "$company: $count"
done
```

### Analyze positions
```bash
# What roles do you know at Google?
node query_linkedin_data.js connections-by-company --company "Google" | \
  jq '.[].position' | sort | uniq -c | sort -rn | head -10
```

---

## Example 8: Spreadsheet Analysis

**Goal:** Do custom analysis in Excel/Google Sheets.

### Export full network
```bash
node extract_connections_csv.js ~/Downloads/linkedin-export.zip \
  --format csv \
  --output ~/Desktop/full_network.csv
```

### In Excel/Sheets:
1. Open `full_network.csv`
2. Create Pivot Table
3. Analyze by Company, Position, or Year

### Export stats as JSON
```bash
node network_stats.js ~/Downloads/linkedin-export.zip \
  --output ~/Desktop/network_stats.json \
  --top 100
```

---

## Example 9: Privacy Audit

**Goal:** See what data LinkedIn has about you.

### List all files
```bash
node list_export_contents.js ~/Downloads/linkedin-export.zip
```

### Check profile data
```bash
node query_linkedin_data.js profile-summary
```

### See who has your email
```bash
cat parsed_data/connections.json | \
  jq '[.[] | select(.["Email Address"] != "")] | length'
```

---

## Example 10: Combine with jq

Advanced filtering using jq:

### Connections with email from specific company
```bash
cat parsed_data/connections.json | \
  jq '[.[] | select(.Company == "Google" and .["Email Address"] != "")]'
```

### Group by company, sorted by count
```bash
cat parsed_data/connections.json | \
  jq 'group_by(.Company) | 
      map({company: .[0].Company, count: length}) | 
      sort_by(.count) | 
      reverse | 
      .[0:20]'
```

### Connections from last 90 days
```bash
cutoff=$(date -v-90d +%Y-%m-%d)
cat parsed_data/connections.json | \
  jq --arg cutoff "$cutoff" '[.[] | 
    select(.["Connected On"] != null) | 
    select(.["Connected On"] > $cutoff)]'
```

---

## Tips

### Save frequently-used queries
```bash
# Create aliases in your shell
alias li-stats='node ~/path/to/query_linkedin_data.js stats'
alias li-find='node ~/path/to/query_linkedin_data.js find-person --name'
```

### Pipe to other tools
```bash
# Pretty print
node query_linkedin_data.js stats | jq .

# Count results
node query_linkedin_data.js connections-by-company --company "Google" | jq 'length'

# First result only
node query_linkedin_data.js find-person --name "Smith" | jq '.[0]'
```

### Save JSON for later
```bash
# Save all queries to files
mkdir -p ~/linkedin-analysis
node query_linkedin_data.js stats > ~/linkedin-analysis/stats.json
node query_linkedin_data.js connections-by-company --company "Google" > ~/linkedin-analysis/google.json
```
