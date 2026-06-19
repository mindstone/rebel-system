---
name: notion-pull-pages
description: "Fetches Notion pages and their hierarchies, converts them to Markdown with proper frontmatter, and saves them to the Company OS filesystem with attachments."
last_updated: 2025-10-26
agent_type: main_agent
---

# Pull from Notion

Fetch Notion pages and save them as Markdown files in Mindstone Rebel.


## Usage example

```
Run @Notion-pull-pages.md on https://www.notion.so/{COMPANY_WORKSPACE}/YOUR-URL-HERE-abc123 into `background/[YOUR-PATH]/`
```


## See also

- [Notion-access-and-syncing](../help-for-humans/Notion-access-and-syncing.md) - context on why we sync to flat files instead of using Notion MCP directly
- [Notion-read-page](../research/Notion-read-page/SKILL.md) - efficient pattern for reading Notion pages via {MCP_GATEWAY}
- `background/` - where synced Notion content lives


## Instructions

1. **Fetch the page** using the Notion MCP
2. **Pull hierarchy by default**: If the page contains links to child pages, pull the entire hierarchy (default).
   - Only skip subtrees if the hierarchy is extraordinarily large AND you cannot complete within session; clearly report what's done and what's pending.
3. **Create directory structure**:
   - If pulling a hierarchy: create a directory named after the page (in Title-Case), with the parent page as `<Page-Title>.md` inside that directory
   - If pulling a single page: create a single `.md` file
4. **File naming**: Use the page title, converted to kebab-case (e.g., "User Personas Context" → `User-Personas-Context.md`)
5. **Frontmatter**: Add YAML frontmatter to each file:
   ```yaml
   ---
   source_url: https://www.notion.so/{COMPANY_WORKSPACE}/xxx
   last_synced: YYYY-MM-DD
   notion_id: xxx (without dashes)
   ---
   ```
6. **Content**: Preserve the Notion content as-is, converting from Notion-flavored Markdown to standard Markdown where appropriate
7. **Index file for directories**: When pulling a hierarchy, create a `<Page-Title>.md` file (using the actual page title in Title-Case) that:
   - Contains the parent page content and metadata
   - Lists all sub-pages with relative links (typically at the top or in a "Contents" section)
   - Preserves any content from the parent page

8. **Attachments (files & images)**:
   - Detect file/image blocks in the fetched Notion Markdown (e.g., `![alt](https://.../prod-files-secure...)` or `[filename](https://.../prod-files-secure...)`).
   - For each Notion-hosted URL, download the file to an `assets/` subfolder next to the destination `.md` file (create it if missing).
   - Rename safely (keep the original filename when possible). Avoid collisions by prefixing with the Notion block/page id if needed.
   - Update the Markdown to use relative links, e.g., `![alt](./assets/filename.ext)` or `[filename](./assets/filename.ext)`.
   - Notion-hosted file URLs expire after ~1 hour. If a download returns 403/expired, re-fetch the page to refresh the URL and retry once.
   - If a file still can’t be downloaded, add a short “Missing attachments” note at the top of the destination file listing the affected filenames/URLs, and notify the user.


## Notes

- Prefer on-demand Notion MCP for most use cases to avoid staleness and extra maintenance. See [Notion-read-page](../research/Notion-read-page/SKILL.md) and [Notion-access-and-syncing](../help-for-humans/Notion-access-and-syncing.md). Use this pull when you need a durable local set of critical background pages you'll reference repeatedly, or when offline copies/attachments are required.
- The Notion MCP returns content in Notion-flavored Markdown - preserve structure but clean up formatting as needed
- See [Notion-access-and-syncing](../help-for-humans/Notion-access-and-syncing.md) for context on why we sync to flat files
- Always pull the entire hierarchy by default; use a tasklist if large.
  - If the hierarchy is enormous and can't be completed:
    - Add a list of `skipped` pages to the frontmatter of the appropriate `README.md`
    - Explicitly tell the user what's completed and what's remaining
- If files already exist, compare `last_synced` and content hash:
  - Skip if up-to-date.
  - Update if out of date (including frontmatter `last_synced`).
  - Notify the user if this happens
- See below re handling large pages
- Use subagents in parallel if available.
- The default Notion base url is the `{COMPANY_NAME} OS` page at https://www.notion.so/{COMPANY_WORKSPACE}/{COMPANY_NAME}-OS-{PAGE_ID}, which includes sub-pages for each team


## Handling large pages and timeouts

Use this flow when a Notion page is very large (e.g., 100+ lines) or the Notion MCP intermittently times out.

1. Fetch page metadata and content
   - Use Notion MCP `fetch` on the page URL (prefer the slug URL form).
   - If `fetch` times out, retry up to 3x with a short backoff (e.g., 2s, 5s, 10s).
2. Prepare/update the destination file
   - Path: `background/.../<Title-in-Kebab-Case>.md`.
   - Ensure YAML frontmatter exists and is updated:
     - `source_url`: the slug URL (e.g., `https://www.notion.so/{COMPANY_WORKSPACE}/...-<notion_id>`)
     - `last_synced`: today's date `YYYY-MM-DD`
     - `notion_id`: the page ID without dashes
3. Full replace if possible
   - Replace the entire body after the frontmatter with the fetched Notion Markdown content.
   - Preserve structure; do minimal cleanup from Notion-flavored Markdown.
4. Chunked fallback (only if the full replace fails due to size)
   - Strategy A (append-in-chunks):
     - Replace the body with a short placeholder header.
     - Append the content in chunks of ~10k characters per edit until complete.
   - Strategy B (section-based):
     - Split on top-level headings (e.g., `## `) and insert section-by-section.
   - Verify the final file contains all sections in the original order.
5. Validation
   - Confirm the file begins with correct frontmatter and the H1 title.
   - Spot-check several sections near the start, middle, and end for completeness.
6. Logging (optional but recommended)
   - Note the `last_synced` date and that a chunked write path was used if applicable.

If you have problems, notify the user and make it very clear at the top of the destination file that it is incomplete.

Tips:
- Prefer slug URLs in `source_url` for readability; keep `notion_id` stable for tracking.
- For repeated timeouts, consider temporarily narrowing to subsections if the source page is a directory index.
