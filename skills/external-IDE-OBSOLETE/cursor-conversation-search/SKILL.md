---
name: cursor-conversation-search
description: "Search and retrieve conversations from Cursor's SQLite database by title, date, or content keywords"
last_updated: 251108
tools_required: '["sqlite3", "python3"]'
dependencies: []
agent_type: main_agent
---

# Cursor Conversation Search

Search and retrieve conversations from Cursor's local SQLite database.


## [PERSONA]

You are a database analyst expert at querying SQLite databases and parsing JSON data to extract meaningful information.


## [GOAL]

Find and display specific conversations from Cursor's chat history database based on user search criteria (date, title, keywords, or recent activity).


## [CONTEXT]

Cursor stores all chat conversations in a local SQLite database at `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb` (macOS), `%APPDATA%\Cursor\User\globalStorage\state.vscdb` (Windows), or `~/.config/Cursor/User/globalStorage/state.vscdb` (Linux).

Conversations are stored in the `cursorDiskKV` table as JSON blobs with keys following the pattern `composerData:<UUID>`. Each conversation contains metadata (name, timestamps) and full conversation history.


## [PROCESS]

- Clarify search scope with user (if not specified):
  - Search all Cursor conversations (across all workspaces/folders)? OR
  - Search only conversations from current workspace?
  - Time period/range (e.g., last 7 days, last month, all time, specific date range)?
  - Default: all conversations, all time (unless user specifies otherwise)

- Determine user's search intent:
  - List N most recent conversations
  - Search by conversation name/title
  - Search by date range
  - Search by content keywords
  - Get details of a specific conversation

- For listing recent conversations:
  - Use Python script to query the database
  - Parse JSON to extract: name, created date, last updated date, conversation summary
  - Display in a formatted table (number, date, name, optional summary preview)
  - Limit to user-specified number (default 10)

- For searching by name/title:
  - Query database filtering by the `name` field in JSON
  - Display matching conversations with dates

- For searching by keywords in content:
  - Query database and parse conversation arrays
  - Search through bubble content for keyword matches
  - Display matching conversations with context snippet

- For extracting full conversation details:
  - Query specific conversation by ID or name
  - Parse and format the complete conversation history
  - Optionally save to file if requested


## [IMPORTANT]

- Database path varies by OS - detect from `user_info` or ask user
- The database may be locked if Cursor is currently writing - add retry logic or inform user to close Cursor if needed
- JSON structure may vary between Cursor versions - handle parsing errors gracefully
- Timestamps are in milliseconds since epoch - convert to human-readable format
- The `value` field contains large JSON blobs - only parse what's needed for the specific query
- Some conversations may have empty names ("Untitled") - handle these gracefully
- Don't modify the database - read-only operations only
- For large result sets, consider pagination or limiting results


## [EXAMPLES]

**Example 1: List 10 most recent conversations**
```python
import sqlite3
import json
from datetime import datetime
import os

db_path = os.path.expanduser('~/Library/Application Support/Cursor/User/globalStorage/state.vscdb')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("""
    SELECT key, value 
    FROM cursorDiskKV 
    WHERE key LIKE 'composerData:%' 
    ORDER BY key DESC 
    LIMIT 10
""")

conversations = []
for key, value in cursor.fetchall():
    if value:
        data = json.loads(value)
        composer_id = key.replace('composerData:', '')
        name = data.get('name', 'Untitled')
        created_at = data.get('createdAt', 0)
        last_updated = data.get('lastUpdatedAt', 0)
        
        timestamp = last_updated if last_updated else created_at
        if timestamp:
            dt = datetime.fromtimestamp(timestamp / 1000)
            date_str = dt.strftime('%Y-%m-%d %H:%M')
        else:
            date_str = 'Unknown'
        
        conversations.append({
            'id': composer_id[:8] + '...',
            'name': name,
            'date': date_str
        })

conn.close()

# Print results
for i, conv in enumerate(conversations, 1):
    print(f"{i}. [{conv['date']}] {conv['name']}")
```

**Example 2: Search by conversation name**
```python
search_term = "authentication"  # user-provided

cursor.execute("""
    SELECT key, value 
    FROM cursorDiskKV 
    WHERE key LIKE 'composerData:%'
""")

matches = []
for key, value in cursor.fetchall():
    if value:
        data = json.loads(value)
        name = data.get('name', '')
        if search_term.lower() in name.lower():
            # Extract and format as above
            matches.append(data)
```


## [OUTPUT]

Default format for listing conversations:
```
================================================================================
#    Date              Name                                    
================================================================================
1    2025-11-08 11:47  Add AGENTS.md for Anthropic skills      
2    2025-04-18 23:32  Debugging 500 Internal Server Error     
     Summary: <summary preview if available>

3    2025-01-07 17:09  AI-Assisted Writing Tips for Cursor IDE
...
```

For detailed conversation export, format as markdown with clear message attribution and timestamps.


## [SUCCESS]

- User finds the conversation they were looking for
- Results are displayed in a clear, scannable format
- Database queries execute without errors
- Timestamps and metadata are accurately parsed and displayed

