---
name: notion-read-page
description: "Efficiently read Notion page content via Notion MCP with minimal steps using optimized workflow patterns."
last_updated: 2025-01-07
agent_type: technical_skill
---

# Read Notion Page

Efficiently read Notion page content via Notion MCP with minimal steps.


## See also

- [Notion-pull-pages](../companyos/Notion-pull-pages/SKILL.md) - Full playbook for syncing Notion pages to local Markdown files
- [MCP-tools-and-other-knowledge-sources](../help-for-humans/mcp-connectors-tools-and-integrations.md) - MCP setup and available servers
- [Notion-access-and-syncing](../help-for-humans/Notion-access-and-syncing.md) - Context on Notion integration strategy


## Quick reference

**Extract page ID from URL:**
```
https://www.notion.so/[workspace]/[title]-[PAGE_ID]
Example: <NOTION_PAGE_ID>
```

**Read page content in 1 step:**
```
execute_action:
- server_name: notion
- category_name: NOTION_BLOCKS
- action_name: get_block_children
- path_params: {"block_id": "<PAGE_ID>"}
```


## Full workflow

### 1. Extract page ID from URL

Given: `https://www.notion.so/{WORKSPACE_NAME}/Communication-Context-<NOTION_PAGE_ID>`

Extract: `<NOTION_PAGE_ID>`

### 2. Get page content blocks

Use the Notion MCP's `execute_action` tool:

```
execute_action:
- server_name: "notion"
- category_name: "NOTION_BLOCKS"
- action_name: "get_block_children"
- path_params: {"block_id": "<NOTION_PAGE_ID>"}
```

This returns all top-level blocks on the page (paragraphs, headings, callouts, child pages, etc.).

### 3. Handle nested content (if needed)

If blocks have `has_children: true`, recursively call `get_block_children` with each child block's ID to retrieve nested content.


## What to skip

**Don't call these unless you need specific metadata:**

- ❌ `discover_server_categories_or_actions` - you already know Notion has `NOTION_BLOCKS` category
- ❌ `get_category_actions` - you already know the action is `get_block_children`
- ❌ `get_action_details` - you already know the schema (block_id in path_params)
- ❌ `retrieve_a_page` (via `NOTION_PAGES` category) - only needed for page metadata/properties, not content

**When you DO need page metadata:**

Use `NOTION_PAGES` / `retrieve_a_page` if you need:
- Page title
- Properties/database fields
- Created/edited timestamps
- Parent page info


## Performance comparison

**Slow (7 steps):**
1. discover_server_categories_or_actions
2. get_category_actions (for NOTION_PAGES)
3. get_action_details (for retrieve_a_page)
4. execute_action (retrieve_a_page)
5. get_category_actions (for NOTION_BLOCKS)
6. get_action_details (for get_block_children)
7. execute_action (get_block_children)

**Fast (1 step):**
1. execute_action (get_block_children with page_id)
