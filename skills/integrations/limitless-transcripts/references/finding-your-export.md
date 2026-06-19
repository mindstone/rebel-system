# Finding Your Limitless Export

If you're not sure where your Limitless export is, or whether you have one, this guide will help.


## What the Export Looks Like

**Filename pattern:** `data-export_YYYY-MM-DD_HH-mm-ss.zip`

**Example:** `data-export_2025-12-07_11-47-23.zip`

**Typical size:** 50-200 MB (depends on how many recordings you had)

**File type:** Standard ZIP archive


## Common Locations

The export was likely downloaded to one of these locations:

| Location | Path |
|----------|------|
| Desktop | `~/Desktop/data-export_*.zip` |
| Downloads | `~/Downloads/data-export_*.zip` |
| Documents | `~/Documents/data-export_*.zip` |


## Search Commands

### macOS (Spotlight)

```bash
# Search by name
mdfind -name "data-export" | grep -i limitless

# Or search for any data-export zip from late 2025
mdfind -name "data-export_2025" | grep ".zip"
```

### Cross-platform (find)

```bash
# Search Desktop and Downloads
find ~/Desktop ~/Downloads -name "data-export_*.zip" 2>/dev/null

# Search entire home directory (slower)
find ~ -name "data-export_*.zip" 2>/dev/null
```

### Windows

```powershell
# Search common locations
Get-ChildItem -Path $env:USERPROFILE\Desktop,$env:USERPROFILE\Downloads -Filter "data-export_*.zip" -ErrorAction SilentlyContinue
```


## How to Verify It's a Limitless Export

Once you find a candidate file, verify it's a genuine Limitless export:

```bash
# List top-level contents (should show lifelogs/, audio/, chats/, etc.)
unzip -l ~/Desktop/data-export_2025-12-07_11-47-23.zip | head -20
```

Expected output shows folders like:
```
  Length      Date    Time    Name
---------  ---------- -----   ----
        0  12-07-2025 11:52   lifelogs/
        0  12-07-2025 11:52   audio/
        0  12-07-2025 11:52   chats/
        0  12-07-2025 11:52   meetings/
        0  12-07-2025 11:52   persons/
        0  12-07-2025 11:52   user/
```

If you see `lifelogs/` in the listing, it's a Limitless export.


## Don't Have an Export?

If you can't find an export and you're a UK/EU user:
- **Data was deleted Dec 19, 2025** - if you didn't export before then, the data is gone
- Check email for "Your Limitless Data Export" - may contain a download link
- Check browser download history from early December 2025

If you're a US user:
- You may still be able to use the API to download data
- See [api-access.md](api-access.md) for instructions


## Export Date Context

Limitless announced the Meta acquisition on **December 5, 2025**. Users had until **December 19, 2025** to export their data. Most exports will be dated between Dec 5-19, 2025.

If your export is from before Dec 5, 2025, it may be an earlier backup and might not include all your data.
