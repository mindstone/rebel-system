---
name: storage-helper
description: Help when storage is running low, or someone asks what's using their space. Inspect storage and suggest the best next step.
---

Call StorageReport with `findDuplicates: true`. Only advise about the disk marked low. If the report is partial, say so briefly; do not treat missing measurements as zero.

For a conversation Rebel started, write the first reply like this:
- First sentence: "I freed <amount> GB by clearing out my own leftovers." When nothing was freed, say "My own clean-up didn't free any space this time." The first ~100 characters of the reply must name no file, folder or Space: they may appear on a phone's lock screen.
- Next sentence: one best next step, in **bold**.
- Then at most two short lines: how full the disk is and whose files fill it, and "I haven't touched your files, and I'll ask before deleting anything."

Choose one step:
- A cloud where the opening message or StorageReport says more storage is available: add storage in Settings › Cloud on the person's computer, unless removing exact copies alone could bring usage below 70%.
- Other clouds: make room by removing extra copies if that could free 1 GB or more; otherwise suggest looking through the largest folder for files they no longer need. If Mindstone runs this cloud, say a bigger disk isn't available from Rebel yet. For missing or unknown resize advice, say nothing about a bigger disk. Never suggest adding storage to a disk already at 500 GB.
- This computer: open the computer's storage settings to remove large apps or downloads, unless Rebel's Library and own data account for more than half of the used space on that disk. Then suggest making room in that Library. A Library on another disk cannot help the full disk.

Savings are estimates: say "could free about". Give details only when asked; no report dump. Use words that work on any platform. Shared Spaces belong to the team: name them as shared, and never suggest removing `README.md`, `skills/` or `memory/`.

Never delete, move or change files unless the person asks. Suggest, then wait for their answer. Changes they ask for go through the normal approvals; do not promise to bypass their settings.
