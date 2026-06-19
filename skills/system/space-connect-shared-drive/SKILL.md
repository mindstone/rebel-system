---
name: space-connect-shared-drive
description: "Connect a shared Google Drive folder as a Rebel space: verify access, help request it if needed, resolve the local sync path, and set up the space."
last_updated: 2026-03-21
agent_type: main_agent
tools_required: [list_workspace_accounts, list_drive_files, search_drive_files]
dependencies: [space-add/SKILL.md, space-memory-populate/SKILL.md]
---

# Space Connect Shared Drive

**Agent Instructions**: This skill connects a shared Google Drive folder (or Shared Drive) as a Rebel space. It handles the full flow: verifying access, helping the user request access if needed, resolving the local sync path, and delegating space creation to the `space-add` skill.

> **Note**: If your organisation has configured shared drives in Rebel's admin panel, they may already appear as spaces automatically via the shared-drive reconciliation service. This skill is for ad-hoc shared folders not covered by that automation.

## See Also

- [space-add](../space-add/SKILL.md) — creates or connects a space under the Rebel workspace root (used in the final step)
- [space-shared-folders](../../help-for-humans/space-shared-folders.md) — user-facing guide for shared folder spaces
- [google-drive-desktop-local-sync](../../help-for-humans/google-drive-desktop-local-sync.md) — Google Drive Desktop setup
- [google-workspace](../../help-for-humans/connectors/google-workspace.md) — Google Workspace connector overview
- [space-memory-populate](../space-memory-populate/SKILL.md) — populate space memory after creation

## Prerequisites

- **Google Workspace MCP** must be connected (at least one account via Settings → Connectors → Google Workspace)
- **Google Drive Desktop** must be installed and syncing the target shared folder locally

## Process

### 1. Gather input

Ask the user for:
- The **Google Drive folder URL** (e.g. `https://drive.google.com/drive/folders/1ABC123xyz`) or the **name** of a Shared Drive / shared folder
- The **space name** they want in Rebel (there is no MCP tool to look up a folder's name by ID, so always ask the user)

#### Extracting the folder ID from a URL

Google Drive URLs come in several formats. Extract the folder ID and preserve the original URL separately (for browser-open in Step 5):

| URL format | How to extract ID |
|---|---|
| `drive.google.com/drive/folders/{ID}` | Take `{ID}` |
| `drive.google.com/drive/u/0/folders/{ID}` | Take `{ID}` (ignore `/u/N/`) |
| `drive.google.com/drive/u/1/folders/{ID}` | Take `{ID}` (ignore `/u/N/`) |
| `drive.google.com/open?id={ID}` | Take `{ID}` from query param |

Strip query parameters (`?usp=sharing`, etc.) from the **extracted ID only**. Preserve the full original URL including any `resourcekey` parameter — this is needed when opening the browser for access requests.

**Validate the extracted ID**: folder IDs are alphanumeric with hyphens and underscores only. If the ID contains other characters, tell the user the URL doesn't look right and ask them to double-check.

#### If no URL provided (name only)

Use `search_drive_files` to find matching folders:

```
search_drive_files(email: "<email>", options: { query: "name = '<folder name>' and mimeType = 'application/vnd.google-apps.folder'", pageSize: 10 }, returnJson: true)
```

Present results to the user and ask them to confirm which folder they mean. Use the confirmed folder's ID for subsequent steps.

### 2. Check Google Drive Desktop is installed

Before doing any API checks, confirm Google Drive Desktop is available locally — if it's not installed, there's no point verifying API access.

**Automatic detection** — scan standard locations:

- **macOS**: Check for directories matching `~/Library/CloudStorage/GoogleDrive-*`
- **Windows**: Check for `%LOCALAPPDATA%\Google\DriveFS`

If found, tell the user Drive Desktop is detected and continue.

If **not** found:
1. Tell the user: "Google Drive Desktop doesn't appear to be installed. You'll need it to sync the folder locally."
2. Direct them to [google-drive-desktop-local-sync](../../help-for-humans/google-drive-desktop-local-sync.md) for setup instructions
3. Stop and wait for them to install and configure it before continuing

### 3. Verify Google Workspace MCP is connected

Call `list_workspace_accounts` to check that at least one Google account is connected.

If no accounts are connected:
1. Tell the user: "You need to connect your Google account first."
2. Direct them to **Settings → Connectors → Google Workspace → Set up with Rebel**
3. Stop and wait for them to complete setup before continuing.

If multiple accounts are connected, note all of them — Step 4 will try each.

### 4. Check access to the folder

Try to list the folder contents using `list_drive_files` with the folder ID:

```
list_drive_files(email: "<user's connected email>", options: { folderId: "<FOLDER_ID>", pageSize: 1 }, returnJson: true)
```

**If multiple accounts** are connected, try each until one succeeds. Use the account that has access for all subsequent operations.

#### Handling the response

- **Success** (returns file list or empty list) — the user has access. An empty folder is still a successful access check. Skip to Step 6.
- **Permission denied / insufficient permissions** — the user needs to request access. Proceed to Step 5.
- **Not found / invalid ID** — the folder ID is likely wrong. Tell the user: "This folder wasn't found — please double-check the URL or folder name." Do **not** offer "Request access" for this case. Return to Step 1.
- **Other errors** (network, MCP not responding, token issues) — tell the user about the error and suggest retrying. Do not route to "Request access."

### 5. Help the user request access

Open the **original Google Drive URL** (not a reconstructed one — preserve `resourcekey` and other query params) in the user's default browser so they can use Google's built-in "Request access" button.

**IMPORTANT**: Validate the URL before passing it to the shell. It must start with `https://drive.google.com/`. Do not interpolate unsanitised user input into shell commands.

**macOS:**
```bash
open "<VALIDATED_ORIGINAL_URL>"
```

**Windows (cmd):**
```cmd
start "" "<VALIDATED_ORIGINAL_URL>"
```

**Windows (PowerShell):**
```powershell
Start-Process "<VALIDATED_ORIGINAL_URL>"
```

**Linux:**
```bash
xdg-open "<VALIDATED_ORIGINAL_URL>"
```

Tell the user:
> "I've opened the folder in your browser. If you see a 'Request access' button, click it to ask the owner for permission. Once you have access, let me know and I'll continue setting up the space. (Note: it can take a few minutes for permissions to propagate after being granted.)"

**Wait** for the user to confirm they now have access, then **re-verify** by calling `list_drive_files` again (Step 4).

If re-verification fails, inform the user and wait again. **After 3 failed re-verification attempts**, suggest:
- Checking with the folder owner whether access was actually granted
- Verifying they're using the correct Google account
- Trying again later (permissions can take a few minutes to propagate)

### 6. Resolve the local sync path

Now that API access is confirmed, find the folder on the local filesystem.

**Automatic resolution** — scan Google Drive Desktop sync locations for the folder name:

- **macOS**: Scan each `~/Library/CloudStorage/GoogleDrive-*/Shared Drives/` directory for a case-insensitive match on the folder name. Also check `~/Library/CloudStorage/GoogleDrive-*/My Drive/` for shared folders that live in someone's My Drive.
- **Windows**: Scan `%LOCALAPPDATA%\Google\DriveFS\*/Shared drives/` and `%LOCALAPPDATA%\Google\DriveFS\*/My Drive/` directories. Also scan mounted drive letters for `<letter>:\Shared drives\<name>`.

If a matching path is found, confirm it with the user: "I found this folder at `<path>` — is that correct?"

If **not found** or the user says the path is wrong:
1. Ask the user to provide the absolute path to where the folder syncs on their machine
2. If the folder isn't syncing locally, direct them to [google-drive-desktop-local-sync](../../help-for-humans/google-drive-desktop-local-sync.md) and ask them to make the folder available offline, then provide the path

**Caveat**: Shared Drives sync to `Shared Drives/<DriveName>/` while regular shared folders (from someone's My Drive) appear under `My Drive/`. The automatic scan checks both, but may not find folders in deeply nested locations.

### 7. Delegate to space-add

Once the folder is accessible via API and the local path is confirmed, delegate to the [space-add](../space-add/SKILL.md) skill to:
1. **Connect the folder** as a space via a symlink/junction under the Rebel workspace root
2. **Initialise the space structure** (README.md, skills/, memory/, scripts/)
3. **Configure the space** as the user wants (name, description, etc.)

Pass along:
- The confirmed local filesystem path to the synced Google Drive folder
- The desired space name
- That this is a "connect existing folder" operation (not "create new")

### 8. Offer follow-up

After the space is created, offer:
1. **Populate memory** — Run [space-memory-populate](../space-memory-populate/SKILL.md) to gather context from connected MCPs
2. **Share with team** — If the user wants team members to also have this space, remind them that each team member needs:
   - Access to the shared Google Drive folder
   - Google Drive Desktop installed and syncing the folder
   - To run this same skill on their own Rebel workspace

## Edge Cases

- **Multiple Google accounts**: If the user has multiple accounts connected, try each one when checking access (Step 4). Use the account that has access for subsequent operations.
- **Shared Drive vs shared folder**: The folder ID in the URL works the same for API access checks, but they resolve to different local paths — Shared Drives sync under `Shared Drives/` while shared folders from someone's My Drive appear under `My Drive/`. Step 6 handles both.
- **Folder already exists as a space**: Before delegating to `space-add`, check if a space with the same name or pointing to the same local path already exists. If so, inform the user and ask how they want to proceed.
- **URL points to a file, not a folder**: If `list_drive_files` returns an unexpected error or the ID doesn't behave as a folder, tell the user: "This looks like a file, not a folder. Please provide a folder URL instead."
- **No folder URL provided, only a name**: Use `search_drive_files` with a folder MIME type filter as shown in Step 1. Present results and ask for confirmation.
