# === OUTLOOK EMAIL EXPORT (PowerShell) ===
# Fallback script: talks directly to a running Outlook instance via COM.
# Use when the Node.js PST parser isn't working.
# Requires: Windows + Outlook desktop app running.

# --- Adjust these three settings ---
$OutputDir = "$env:USERPROFILE\Desktop\outlook-export"
$DaysBack  = 90     # How far back to go. Set to 0 for everything.
$Folders   = @("Inbox", "Sent Items")  # Add/remove folder names as needed
# -----------------------------------

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$outlook   = New-Object -ComObject Outlook.Application
$namespace = $outlook.GetNamespace("MAPI")

$defaultFolderMap = @{
    "Inbox"         = 6
    "Sent Items"    = 5
    "Sent"          = 5
    "Drafts"        = 16
    "Deleted Items" = 3
    "Outbox"        = 4
}

$totalExported = 0
$allSummaries  = @()

foreach ($folderName in $Folders) {
    $folder = $null
    if ($defaultFolderMap.ContainsKey($folderName)) {
        $folder = $namespace.GetDefaultFolder($defaultFolderMap[$folderName])
    } else {
        $root = $namespace.DefaultStore.GetRootFolder()
        foreach ($f in $root.Folders) {
            if ($f.Name -eq $folderName) { $folder = $f; break }
        }
    }
    if (-not $folder) {
        Write-Warning "Folder '$folderName' not found -- skipping"
        continue
    }

    $items = $folder.Items
    $items.Sort("[ReceivedTime]", $true)

    if ($DaysBack -gt 0) {
        $cutoff = (Get-Date).AddDays(-$DaysBack).ToString("MM/dd/yyyy")
        $items = $items.Restrict("[ReceivedTime] >= '$cutoff'")
    }

    $folderCount = 0
    Write-Host "`nExporting '$($folder.Name)' ($($items.Count) items)..."

    foreach ($item in $items) {
        try {
            if ($item.Class -ne 43) { continue }  # 43 = mail items only

            $date = $item.ReceivedTime.ToString("yyyyMMdd_HHmmss")
            $slug = ($item.Subject -replace '[^\w\s-]','' -replace '\s+','-').ToLower()
            if ($slug.Length -gt 50) { $slug = $slug.Substring(0, 50) }
            if (-not $slug) { $slug = "no-subject" }
            $filename = "${date}_${slug}.json"

            $filepath = Join-Path $OutputDir $filename
            $i = 2
            while (Test-Path $filepath) {
                $filepath = Join-Path $OutputDir "${date}_${slug}_$i.json"
                $i++
            }

            $toList  = @()
            $ccList  = @()
            foreach ($r in $item.Recipients) {
                if ($r.Type -eq 1) { $toList += $r.Address }
                elseif ($r.Type -eq 2) { $ccList += $r.Address }
            }

            $attNames = @()
            foreach ($a in $item.Attachments) { $attNames += $a.FileName }

            $email = @{
                subject         = $item.Subject
                from            = $item.SenderEmailAddress
                fromName        = $item.SenderName
                to              = $toList
                cc              = $ccList
                date            = $item.ReceivedTime.ToString("o")
                body            = $item.Body
                folder          = $folder.Name
                hasAttachments  = ($item.Attachments.Count -gt 0)
                attachmentNames = $attNames
                conversationId  = $item.ConversationID
                importance      = $item.Importance
                isRead          = ($item.UnRead -eq $false)
            }

            $json = $email | ConvertTo-Json -Depth 3 -Compress:$false
            [System.IO.File]::WriteAllText($filepath, $json, [System.Text.Encoding]::UTF8)

            $allSummaries += @{
                file    = (Split-Path $filepath -Leaf)
                date    = $item.ReceivedTime.ToString("o")
                from    = $item.SenderEmailAddress
                subject = $item.Subject
                folder  = $folder.Name
            }

            $folderCount++
            $totalExported++
            if ($folderCount % 100 -eq 0) {
                Write-Host "  ...$folderCount exported"
            }
        }
        catch {
            Write-Warning "Skipped one item: $_"
        }
    }
    Write-Host "  $folderCount emails from $($folder.Name)"
}

$manifest = @{
    exportDate  = (Get-Date).ToString("o")
    totalEmails = $totalExported
    daysBack    = $DaysBack
    folders     = $Folders
    emails      = $allSummaries
} | ConvertTo-Json -Depth 3
[System.IO.File]::WriteAllText(
    (Join-Path $OutputDir "_manifest.json"),
    $manifest,
    [System.Text.Encoding]::UTF8
)

$sizeMB = [math]::Round(
    (Get-ChildItem $OutputDir -File | Measure-Object -Property Length -Sum).Sum / 1MB, 1
)
Write-Host "`nDone! $totalExported emails exported to:`n  $OutputDir`nTotal size: ${sizeMB} MB"
