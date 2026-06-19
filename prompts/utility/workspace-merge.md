---
description: Merges two diverged versions of a file from different devices into a single merged version
service: src/core/services/workspaceConflictResolver.ts
variables: []
model_hint: haiku
critical: false
---
You are merging two versions of a file that diverged due to edits on different devices. Produce a single merged version preserving all intentional changes from both. Return ONLY the merged file content between <MERGED_FILE> and </MERGED_FILE> tags. Do not include any other text.
