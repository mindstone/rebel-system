# Changelog

What's new in Rebel. We ship fast, so there's always something.

---

## Unreleased

### Highlights

<!-- detail: rebel-system — the bundled library of skills, help docs, and agent instructions that Rebel runs on — is now MIT-licensed and developed in the open. Anyone can read, fork, or contribute to the exact skills and instructions your copy of Rebel uses. Part of Rebel's ongoing move to open up its building blocks. -->
- **Rebel's skills and instructions are now open source** — The library of skills, help, and instructions that Rebel runs on is now MIT-licensed and out in the open, so anyone can read, fork, or contribute to it. Nothing up our sleeve.

### Improvements

<!-- detail: Conversation-search reliability work (260619). F1: buildConversationResults no longer drops genuine keyword/title (FTS) matches via a vector-only cosine floor — keep-rule is lexicalHit||cosine>=threshold, ranked by RRF rankScore; lexical exemption is opt-in (sidebar + rebel_conversations_search), auto-context stays strict. F3: rename re-embeds so the new title is findable. F5: 1-2 char / proper-noun queries get an instant title-substring floor. -->
- **Sidebar search actually finds the conversation you mean** — Searching your conversations now reliably surfaces exact title and keyword matches instead of quietly hiding them behind a "close enough?" similarity score. Short names and acronyms return results instantly, and renaming a conversation makes it findable by its new name right away. Type the word you remember; get the conversation you meant.

<!-- detail: F2 (260619) + exhaustive-within-window (260620): the recency chip constrains the actual search. Quick search now scopes to the EXACT set of in-window conversations (from fresh session-summary timestamps, sessionId IN (...) on the LanceDB query) and ranks the whole windowed set — so a relevant match ranked beyond the old top-100 candidate pool now appears, and the type filter operates over the full in-window set. Above 500 in-window conversations it falls back to a 24h-grace prefilter (logged). "Search all messages" gets an updatedAfter bound + a muted "within the last 7 days" qualifier. F7: automations are indexed/searchable under the Automations filter. -->
- **The time filter actually filters — and checks everything in the window** — "Last 24 hours / 7 days / 30 days" now narrows the search itself, and within that window quick search looks at *every* matching conversation rather than ranking a sample and time-filtering the leftovers. So a relevant conversation from last week shows up even if hundreds of newer ones pile on top. Need to go wider? "Search all messages" scans the whole window. Automation runs are searchable too, under the Automations filter.

<!-- detail: FU-1 (260621) — cloud-executed turns write safety-activity-log entries to the cloud's own store; the desktop now pulls them via a server-allowlisted safety-activity-log:get catch-up (reconnect + panel open) and merges them into the local store (dedup by id, audit-immutable, local flag preserved). Cloud entries carry a muted "Cloud" execution-surface marker; a quiet sync-state note appears if the cloud sync hasn't landed. NOT a moot allowlist of the refresh signal — the data itself travels. -->
- **Your Safety Activity log now includes cloud-run work** — If Rebel runs a task in the cloud, the safety decisions it made there now show up in your Safety Activity log on this device, tagged with a quiet "Cloud" marker so you can tell where each check happened. Your safety history is complete again, not just the part that ran on your machine.

<!-- detail: 260622_library-reconnecting-tooltip. The Library "cloud-degraded" search notice ("Some files here are from folders that are reconnecting… showing your last-known results") gained two things, cloud-degraded variant only: (1) a focusable info (i) IconButton wrapped in the shared Tooltip giving a plain-language explanation of what reconnecting means and what to expect; (2) a "Manage in Settings" ghost button (rendered only when the onManageSpaces callback is wired) that opens Settings → Spaces, where the existing per-Space Re-check forces a reconnect. Threaded App → LibraryDrawer → LibraryNavigatorProvider → commandShelfProps → both notice render sites (rail embedded + main inline), entirely inside Notice.children. No new colors/tokens; reuses themed primitives. Other notice variants unchanged. -->
- **Library tells you what "reconnecting" means — and how to nudge it** — When a cloud folder (Dropbox, Google Drive, iCloud) is briefly out of reach, Library shows your last-known results with a calm note. Now there's a little (i) you can hover for a plain-English explanation of what's happening, plus a "Manage in Settings" button that takes you straight to Spaces, where you can give it a push. No more wondering whether something's broken — nothing is.

### Fixes

<!-- detail: 260622_feedback-bug-robustness. The "Feedback & Bugs" path is now robust by construction: the raw report is captured and durably written to disk before the dialog confirms (works offline, survives quitting/crashing the app), then replayed with retry until delivered. Capture no longer waits on best-effort enrichment (diagnostics gather, LLM analysis), so a broken provider/offline/hung environment — frequently the exact bug being reported — can't lose the report. Status copy is honest (got-it on durable save, never a fake "sent" on a non-confirming transport 2xx) and offers a Copy-report fallback if delivery is unavailable. Each report is its own issue. Do NOT mention Sentry/Linear internals. -->
- **"Feedback & Bugs" now reliably gets your report to us** — When you send a bug report, Rebel saves it safely first, then delivers it, and keeps trying if it can't get through right away. It works even when you're offline or the thing you're reporting has broken your AI connection, and it survives quitting or crashing the app. If we genuinely can't reach the team, Rebel tells you honestly and hands you a "Copy report" button so your words are never lost. Tell us what's wrong; we'll actually get it.
<!-- detail: (internal ticket) — consolidated class of ~15 prior per-tool autopilot tickets. When an approved tool action failed ARGUMENT VALIDATION (super-mcp use_tool wrapper ARG_VALIDATION_FAILED, per-tool -33003, or downstream-validation), the renderer surfaced the raw validator error — incl. agent-directed "Use get_tool_details / dry_run: true" — as a red "Approved, but the action failed: …" toast. The agent already self-recovers from this class. Now classified as arg-recovering → calm info toast ("Rebel is sorting that out") while the agent retries; the exhausted-retries case (super-mcp's "may require user clarification" stop signal) gets a distinct warning toast asking the user for more detail (no false reassurance). Genuine non-arg failures keep their error toast. Desktop-only by construction (cloud/mobile never surfaced the raw error). Refinement: both toasts now name the action (via the humanized display name, not the validator string) with a graceful generic fallback; agent-voiced "which field is missing" specifics were ruled out because the only signal is the forbidden validator jargon. -->
- **A friendlier nudge when a tool action needs tweaking** — When Rebel approves an action but the tool wants its inputs in a slightly different shape, you used to get an alarming red error full of developer jargon ("args must be an object", "use get_tool_details"). Now Rebel quietly says it's sorting out the details for that action and fixes them itself — and only asks you for help if it genuinely can't work them out on its own. Less cryptic, more capable colleague.

<!-- detail: Mobile (iOS): on a brand-new conversation, switching to text entry brought up the keyboard but the empty message list didn't fill the screen, so the keyboard could sit on top of the send button with no way to dismiss it — sending was impossible until the conversation already had a couple of exchanges. The empty conversation now flex-fills the viewport like a populated one, so the input/send dock stays put above the keyboard and you can swipe the list to dismiss the keyboard. -->
- **You can send the very first message on mobile again** — On a new conversation, tapping into the text box used to bring up the keyboard right on top of the send button, with no way to shoo it away — so you couldn't actually send anything until the chat already had a few messages in it. The send button now stays put above the keyboard from message one. First word, sent.

<!-- detail: In the installed app, PDF previews in the document editor could come up blank. Rebel now displays them through the same reliable path it already uses for video and audio, and always offers an "Open in default app" button as a fallback. -->
- **PDFs preview properly again** — Opening a PDF in the document editor could show a blank grey panel in the installed app. It renders the PDF now, with an "Open in default app" button always on hand. Look at that — a PDF.

- **A way out of Find Similar** — "Find similar conversations" had no obvious exit. Now there's a "Back to all conversations" button and the Escape key works. You're not trapped.

<!-- detail: Occasionally a message could get stuck before Rebel even began working on it (for example when the app was busy scanning a cloud-synced folder), leaving an endless spinner. Rebel now notices and lets you retry instead. Different from the "taking longer than usual" notice you'd see while waiting on the model. -->
- **Turns that never start now recover** — Occasionally a message would sit on a spinner without Rebel ever actually getting going. It catches that now and lets you retry instead of hanging forever. No more false starts.

<!-- detail: When your computer runs low on disk space, Rebel now shows a calm warning instead of failing in confusing ways, and is more resilient on very busy machines. -->
- **A heads-up when your disk is full** — When your machine runs out of disk space, Rebel now says so plainly instead of failing in puzzling ways. Forewarned is forearmed.

- **A tidier What's New card** — The "Try it" button no longer covers the info tooltip on the What's New card, and long titles wrap instead of overflowing. Less clutter, more news.

<!-- detail: If the app had been moved after installing, an update could leave it in a broken, half-installed state. Updates are now more careful, and report problems clearly instead of failing quietly. -->
- **Sturdier updates** — If Rebel has been moved after you installed it, an update could occasionally leave it half-installed. Updates are more robust now, and problems speak up instead of failing quietly. Update with confidence.

<!-- detail: On macOS, an update could occasionally download but never install, leaving the app stuck until it was force-quit and reopened. The updater now sees that through and completes the install on its own. -->
- **Updates that no longer get stuck** — Occasionally an update would download but quietly refuse to install, and the only way forward was to force-quit Rebel and open it again. It now sees the install through by itself. Restart and you're on the new version.

<!-- detail: F4: search:conversations-semantic returns { status, results }; useSessionSearch surfaces index_not_ready / embedding_unavailable / error distinctly from a genuine no-match. Sidebar shows "Getting search ready…" (warming, auto-resolves) and "Search is taking a breather" + Try again (error), never implying conversations are gone. -->
- **"No results" now means no results** — When search is still warming up or briefly unavailable, the sidebar says so ("Getting search ready…" or a calm "taking a breather" with a Try again) instead of claiming nothing matched. Your conversations were never gone — search just wasn't ready yet.

---

## v0.4.49 — Jun 16-18, 2026

### Highlights

<!-- detail: Restores full indexing/watching/search for HEALTHY cloud-symlinked spaces (Google Drive / Dropbox / iCloud / OneDrive / Box) that 0.4.48→0.4.49's library-scan-freeze fix had unconditionally excluded. An off-main-thread liveness prober (separate OS process, own libuv pool, parent-side timeout+kill) decides per-space health; a HEALTHY space is admitted to the normal walk/watch/index behind the experimental.cloudSymlinkIndexing flag; a slow/dead mount can't hang Rebel by construction (the main process never issues an unbounded blocking syscall against a cloud mount). A non-healthy space shows a per-space "Reconnecting" signal, keeps serving the last-known index (search never fs-checks a cloud entry; index removals are verdict-gated through one Removal Coordinator so a transient blip can't wipe it), and auto-recovers + re-indexes when the mount responds. -->
- **Your cloud spaces are searchable and up to date again — and a flaky Drive can't freeze Rebel** — When a recent fix stopped a stuck cloud folder from hanging the Library, it also stopped indexing your *healthy* Google Drive (and iCloud / Dropbox / OneDrive / Box) spaces, so cloud documents quietly dropped out of search. Now a healthy cloud space is fully indexed and searchable like a local one — while a slow or dead mount still can't wedge the app. If a mount goes flaky, that space shows a calm **Reconnecting** note, keeps serving your last-known files, and quietly re-syncs when it comes back. Searchable when it can be, honest when it can't.

<!-- detail: Open build only. Settings → Meetings → "Set up recorder" installs Recall's Desktop SDK for you (install → progress → "Restart Rebel"), with a plain-language error + retry, an honest macOS/Windows-only note, and the old copy-the-command path kept as a fallback. -->
- **One-click meeting recorder** — Setting up Rebel's meeting recorder used to mean pasting a command into a terminal and restarting by hand. Now there's a button for it in Settings → Meetings. Your meetings, captured without the chore.

<!-- detail: If a turn sits waiting on the model with no tokens yet, Rebel surfaces a calm inline note after ~30s with Try again and Stop — only before the first word arrives, so a slow but healthy stream stays on "thinking". Interactive turns only; automations unchanged. -->
- **Rebel tells you when it's waiting** — If a turn sits waiting on the model with nothing coming back, you now get a calm "still on this one — taking longer than usual" note with **Try again** and **Stop**, instead of an indefinite spinner with no way out. Patience has limits.

### Improvements

<!-- detail: Background and app-initiated automation sessions are excluded from Active lists, the pinned-tabs strip, unread/home/mobile controls, and can no longer leave hidden "active ghosts" when starred — filtered by session kind, not origin. -->
- **Automations stay out of your Active list** — Background and automation runs no longer sneak into Active conversations, pinned tabs, or unread counts — or leave ghost "active" conversations when you star them. Your list is for you. Automations have their own lane.

<!-- detail: Rebel now keeps up to 25,000 conversations locally (raised from 10,000) before older ones roll off. -->
- **More room for conversation history** — Rebel now keeps substantially more past conversations before trimming the oldest. The attic got bigger.

<!-- detail: super-mcp 2.6.0 repairs slightly malformed tool arguments from the tool's schema before failing the call, so connector actions survive small formatting mistakes. -->
- **Tools self-correct small mistakes** — When Rebel calls a connector and the request comes out slightly wrong, it now fixes it up and carries on instead of failing the call outright. Close enough counts.

<!-- detail: When a Gemini-backed gateway returns a thought_signature tool-call error, Rebel auto-marks that connection as unable to use tools and stops sending tool calls it can't handle — separate from the thinking-suppression already in 0.4.48. -->
- **Tool-shy connections, handled** — When a connection (such as a Gemini-backed gateway) can't handle a particular kind of tool call, Rebel remembers and routes around it instead of failing the same way every turn. Once bitten, twice shy.

- **Claude Fable stepped off stage** — While access is unavailable, Fable no longer appears in model pickers, so you can't pick a model that won't run. Out of sight until it's back.

### Fixes

<!-- detail: On Google Drive / iCloud / OneDrive workspaces the file scan followed links into cloud mounts and hung indefinitely on "Scanning your files and folders…". Rebel now stops scanning into cloud-mount folders — distinct from the memory-cap fix in 0.4.48. No data loss. -->
- **Cloud-synced folders no longer freeze the Library** — Workspaces on Google Drive, iCloud, or OneDrive could leave the Library stuck on "Scanning your files and folders…" forever. Rebel now knows when to stop probing cloud folders and gets on with showing your files. A different hang from the memory cap last release — this one never finished at all.

<!-- detail: Fixes the recurring cloud-sync duplicate-file loop (internal ticket) for workspaces that live inside a cloud-storage folder (Google Drive, Dropbox, iCloud, OneDrive, Box). Root cause: both the cloud app AND Rebel's own Cloud Sync were writing the same files between machines, which is exactly what makes the cloud app mint "(1)" conflict copies — and the copies could then self-feed. The fix: for cloud-storage-backed workspace paths, Rebel no longer writes EXISTING files down onto disk; it lets the cloud app deliver cross-device edits and stops being the second writer (the conflict generator). Rebel still UPLOADS local changes, so phone/web continuity is unaffected, and genuinely new cloud-only files are still delivered. Side effect: a file edited on phone/web (which the cloud app can't deliver to the desktop) now surfaces a one-click "Newer version available — Update to newest" pending update instead of being silently overwritten or left stale. Auto-applies on update; the existing duplicate pile still needs a one-time tidy-up. -->
- **The cloud-sync duplicate-file loop, fixed at the source** — If your workspace lived in Google Drive (or Dropbox, iCloud, OneDrive, Box), Rebel and your cloud app could both write the same files and spawn endless `note (1).md` copies. Rebel now steps back and lets your cloud app do the delivering, so the duplicates stop being created in the first place — not just tidied up after. Phone and web continuity carry on as normal; if you edit a file on another device, your computer shows a calm one-click "Newer version available" note to bring it current. One writer, no pile-ups.

<!-- detail: Outbound name resolution no longer competes on a tiny shared pool under load; meeting transcript saves bound their retries; the ChatGPT/Codex path retries once on a pre-response blip. -->
- **Connections hold up under pressure** — When Rebel was busy, outbound connections — meetings, connectors, model calls — were more likely to stall or fail. They now stay reliable when the app is under load. Busy is not an excuse.

- **Meeting saves stop hammering** — A failed meeting-transcript save could retry endlessly without ever counting attempts. Saves now give up gracefully instead of retry-storming. Enough already.

<!-- detail: A behind-the-scenes crash (classifying a malformed session) could break the conversation list and features like time-saved; the rebuild now isolates a bad file and recovers the rest from disk. -->
- **Conversations don't vanish after a hiccup** — A behind-the-scenes crash could hide most of your conversations from the sidebar and break everyday features like time-saved stats. Rebel shrugs off the bad file and shows what's actually on disk. Still there, always was.

<!-- detail: All store upgrades are non-destructive; quitting mid-save waits for in-flight writes; the conversation index serialises writes so several sessions saving at once can't drop one. -->
- **Your data survives updates and quitting** — Store upgrades are now non-destructive, quitting mid-save waits for in-flight writes instead of trampling them, and the conversation index can't drop a write when several sessions save at once. Close the lid without crossing your fingers.

- **Finished automations stay finished** — Automations you'd marked done could creep back into Active after a rebuild of the conversation list. Done means done.

<!-- detail: semantic and file/source search now report "temporarily unavailable" when the index is down, instead of returning an empty result that looks like "no matches". -->
- **Search says "unavailable" instead of "nothing found"** — When search itself was down, Rebel used to tell you there were no matching files — unhelpful and untrue. It now says search is temporarily unavailable. Honest beats hopeful.

<!-- detail: Workspace-health probe timeout races and false "critical" alerts are fixed; iCloud Documents folders are now recognised; the whole check is bounded by one deadline. -->
- **Workspace health stops crying wolf** — Rebel could falsely flag your workspace as critically unhealthy, especially with iCloud Documents folders. The checks are tighter and fairer now, and iCloud Documents are recognised. Calm down, it's fine.

- **System notices aren't editable anymore** — Behind-the-scenes failure messages were sometimes showing up as if you'd typed them, in an editable "you said" bubble. They're notices now, not impersonation.

<!-- detail: On reopening a conversation, duplicate result messages that had been materialised twice are now collapsed — separate from the mid-stream retry duplication fixed in 0.4.48. -->
- **Duplicate replies on reopen, gone** — Reopening a conversation could show the same reply twice after a refresh. One answer per question, even on second load.

- **A long wait ends cleanly** — A turn waiting on the model with no response now stops after five minutes with "That took too long — Try again" instead of spinning forever. Liberating.

<!-- detail: Each part of the diagnostic-bundle export has a time limit and always finishes, with honest skip notices and a minimal fallback. -->
- **Diagnostics download always finishes** — Exporting a diagnostic bundle could hang forever on "Preparing…" — awkward when you're trying to get help. Each section now has a time limit, the export always completes, and it tells you honestly if something had to be skipped. We need that bundle too.

## v0.4.48 — Jun 15-16, 2026

### Fixes

<!-- detail: A transient calendar-sync failure (e.g. a brief network/DNS blip that fails all connected accounts at once) was persisted and surfaced immediately as a mid-session "Calendar Cache needs attention" toast whose remediation said "check your Google Workspace connection" — misleading for a network problem, and with no debounce so a single failed sync nagged. A shared in-memory consecutive-failure streak now withholds failure-class sync issues (and lastSyncError) until the failure is sustained (>= 2 consecutive syncs); network-shaped errors are classified (cause: network) and get honest "couldn't reach your calendar, retrying" copy instead of connection blame. Recurrence of the 260611 calendar-cache toast (accepted residual DA-F2, now fixed). (internal ticket) -->
- **Calendar alerts wait for a real problem** — A brief network blip mid-sync could fire a "Calendar Cache needs attention — check your Google Workspace connection" warning, even when the connection was perfectly fine. Rebel now waits to confirm a problem is actually sticking before flagging it, and when the cause is just the network, it says so plainly instead of sending you to check a healthy connection. A blip is just a blip.

<!-- detail: On workspaces with very large (often cloud-synced) folders, the file tree could grow without bound and exhaust the app's memory — the Library would spin on "Scanning your files and folders…" indefinitely, and at worst the window crashed and crash-looped, surviving even a reinstall. The tree is now capped by construction (a ceiling on how many files and how much data are held in memory at once). When a workspace exceeds the cap, the Library honestly shows a "this is partial — your Library is very large" notice across every view (folders, cards, search, quick-open) instead of spinning or pretending a folder is empty. A separate crash from parsing oversized internal activity data was fixed at the same time. Your files on disk were never affected. -->
- **The Library can't run Rebel out of memory anymore** — On very large workspaces — big cloud-synced folders especially — the Library could hang forever on "Scanning your files and folders…", or crash the window in a loop that a reinstall couldn't cure. It now caps how much of your file list it loads at once and tells you plainly when your Library is too large to show in full, instead of spinning or crashing. Your files were always safe; now the app is too.

<!-- detail: After v0.4.47 moved to a newer Electron runtime, the background helper that builds on-device embeddings (which powers local search over your own files) could crash on startup — an escalating native crash on both Mac and Windows. The fix routes its loader onto an equivalent, non-crashing path, keeping embeddings working. Separately, on machines where the faster graphics path (WebGPU) wasn't available, this helper had been quietly failing to start and leaning on a slower fallback; it now starts correctly there too, so the fast path is used in more places. Search kept working throughout via the fallback — this makes it steadier and quicker. -->
- **Local search runs reliably on more machines** — The helper that powers searching your own files could crash on startup after the last update, and on some machines it had quietly been using a slower fallback instead of the fast path. Both are fixed, so on-device search runs properly — and faster — in more places. Quietly, as it should.

<!-- detail: If a brief connection hiccup happened after Rebel had already begun writing a reply, it would re-run the response from scratch and stitch the two together, so the saved conversation could show duplicated text. Now, once a reply has started streaming, a transient error ends the turn cleanly and offers "Try again" rather than silently re-sending. Blips before any text is written still self-heal as before. Applies to both the Anthropic and OpenAI model paths. -->
- **Replies don't repeat themselves after a hiccup** — A momentary connection blip while Rebel was mid-reply could make it start over and leave duplicated text behind — worst on unattended automations, where no one was watching. A blip now ends the turn cleanly with a "Try again" instead of fusing two attempts together. Said once, as intended.

<!-- detail: A single malformed conversation file could crash the routine that rebuilds the conversation index, aborting the whole rebuild and leaving almost every conversation invisible in the sidebar (one case dropped from ~2,700 visible to 67). The rebuild now isolates and repairs a bad conversation rather than treating it as fatal, and self-heals a suspiciously short index by recovering from the files on disk. No conversations were ever lost — this was a visibility problem, not data loss. -->
- **One bad file can't hide all your conversations** — A single corrupted conversation could take down the routine that lists everything, leaving your sidebar and folders looking nearly empty. The list now shrugs off a bad file and rebuilds from what's actually on disk. Nothing was ever lost — and now nothing vanishes.

- **Actions stop getting blocked for the wrong reason** — Rebel's behind-the-scenes safety check could hit an error with some of its models — including the default one — and block a tool or action that was perfectly fine, instead of allowing it. It now handles those models correctly, so legitimate actions go through. Caution, not paranoia.

- **Settings stays put when you add a model** — Opening "Add a model" in Settings could shove the whole app sideways off-screen. It holds its ground now.

- **"Mark as done" returns to foldered conversations** — The per-conversation "Mark as done" action had gone missing for conversations tucked inside a folder. Back where it belongs.

<!-- detail: When a provider/gateway returns an actionable 400 (e.g. a litellm→Vertex proxy: "thinking.type.enabled is not supported; use thinking.type.adaptive"), the error banner previously showed generic "Something went sideways"/"AI rejected the request" copy. extractHttpErrorMessage now recovers the embedded provider message from wrapped non-JSON bodies and classifyErrorUx surfaces it (redacted). And when a recoverable "model can't run on the active provider" terminal fires and a credential-reachable selectable profile serves that exact model, the recovery banner leads with a one-click "Use <profile>" that pins the turn through that profile's provider. (internal ticket) -->
- **When a model says no, Rebel says why** — A model rejecting a request used to surface a vague "something went sideways." Now you get the real reason — and when the catch is that the model can't run where it's pointed, a one-click button switches you to a setup that can. Less mystery, more fix.

<!-- detail: When a model is reached through a custom gateway that can't translate Rebel's reasoning/thinking parameter (e.g. a litellm→Vertex proxy rejecting reasoning_effort with "thinking.type.enabled is not supported"), running the model's Test records thinkingCompatibility:'incompatible', and from then on every egress path (direct OpenAI-compatible client, desktop local proxy, Codex passthrough) stops sending reasoning_effort for that profile — self-healing if a later Test succeeds. Suppression is purely this detected verdict; an earlier manual "Off" thinking toggle was removed in favour of it. (internal ticket) -->
- **Thinking that doesn't pick fights with your gateway** — Some company gateways can't handle Rebel's "thinking" setting and reject the request outright. Now, running a model's Test teaches Rebel that this gateway can't take it, and Rebel quietly stops sending it — no knobs to flip. Fix the gateway later and another Test brings thinking back.

## v0.4.47 — Jun 11-15, 2026

### Highlights

<!-- detail: The conversation quality slider gains a fifth notch, "Frontier" ($$$$$), which sets both the working and thinking models to Claude Fable 5 at maximum effort. Tier names are never stored — picking a tier writes the resolved models — so nothing moves to Fable unless you click it, existing "Maximum" setups keep their label, and behind-the-scenes tasks stay on cheaper models. You can also ask the agent to switch tiers; it knows about Frontier too. -->
- **New quality tier: Frontier** — the quality slider now goes to five. The top notch runs Claude Fable 5 everywhere: the newest model, the steepest bill, and the occasional principled refusal. Nothing changes unless you click it — Maximum stays Maximum.

<!-- detail: Settings → Usage was rebuilt. Earlier this spring an automated design cleanup quietly stripped most of the page's depth — the last-24-hours view, your most-expensive conversations, the per-model / per-payment-method / per-automation breakdowns, the day-by-day table, CSV export, the monthly projection. The data was always still being recorded; only the screen lost it. It is back, arranged so the page stays calm: a clean glance up top (with a new honest "You paid" headline, the spend-quality summary, and a spend-by-category list you can expand to see what is hiding inside "background housekeeping"), then four collapsible sections for anyone who wants to dig — by model, by payment method, by automation, your costliest conversation (click to open it), a day-by-day table you can export, and efficiency stats with a projected monthly cost. Lots of tooltips. Nothing shown that is not real. -->
- **Settings → Usage, properly rebuilt** — The Usage page used to tell you far more about where your time and money go, until a design tidy-up last spring quietly took most of it away. It's back, and calmer: a clean summary at a glance, then expandable sections for the curious — cost by model, by payment method, by automation, your most expensive conversation (one click to open it), a day-by-day table you can export, and a projected monthly bill. The detail was always being recorded; now you can see it again.

<!-- detail: When you open "Add a model" in Settings → Agents & Voice → Available models, you now see a search box (filter by name or provider), a curated "Recommended for most people" shortlist, and — if you have a Mindstone plan — a dedicated "Included with your plan" group showing exactly which models your subscription covers, ready to add with one click. -->
- **Your plan's models, one click away** — The "Add a model" screen now shows which models are included with your Mindstone plan, right up front - so you're not hunting through a long list for what you already have. There's also a search box and a recommended shortlist for when you want to explore beyond that. Discovery, streamlined.

<!-- detail: Several people use a Slack DM to themselves as a scratchpad and asked Rebel to drop notes there. Trouble is, Slack treats anything you send yourself as already-read, so those notes never produced a notification — they just sat there silently. Rebel now has a "send myself a note" tool that delivers the note as a DM from the Rebel bot instead, which Slack treats as a real message and actually notifies you about. It lands in a separate conversation from your own self-DM "notes to self" space (same idea, different thread). And if Rebel would otherwise have jotted a note by messaging you as yourself the old silent way, it now stops and routes through the notifying path instead. No reconnecting or new permissions needed. -->
- **Notes to self that actually notify you** — Using a Slack DM to yourself as a notepad? Those notes never pinged you — Slack counts anything you send yourself as already-read. Rebel can now send you a note as a DM *from Rebel* instead, so it arrives with a real notification. Same scratchpad habit, minus the silence. No reconnecting required.

### Improvements

<!-- detail: In the conversations sidebar, marking a conversation as "Done" already kept it in whatever folder it belonged to — but in the Active tab the folder only showed its active conversations, so the done ones vanished from view and could only be found by switching to the Done tab. Now each folder in the Active tab shows a collapsed "Done (N)" group tucked beneath its active conversations: click to expand and see the finished ones (muted, still fully openable — rename, star, reopen, delete all still work), click again to hide. The group is collapsed by default and remembers your choice per folder. Clicking a link to a done conversation auto-expands its folder and the Done group so you land on it. A folder where every conversation is done still drops out of the Active tab to the Done tab, as before. The Done tab continues to show the same folder grouping, scoped to each folder's finished conversations. -->
- **Finished conversations stay tucked in their folder** — Mark a conversation as done and it leaves your Active list without wandering off: it slips into a collapsed "Done" group right inside its folder, one click away when you want it. Expand to peek, collapse to forget — Rebel remembers which you prefer, per folder. Finish everything in a folder and it moves to the Done tab, as before. Out of the way, not out of reach.

- **Enable/disable models without removing them** — Each model in Settings → Agents & Voice → Available models now has a clearly labelled On/Off toggle. Switch a model off when you don't need it; it stays in your list, ready to switch back on. No more deleting and re-adding.

<!-- detail: The conversation sidebar's "Favourites" tab and the per-conversation "Favourite" action are now labelled "Starred" / "Star" everywhere — desktop, mobile, and web. Purely cosmetic: the icon was already a star, and this just makes the words match it (and match the code underneath). Nothing about which conversations are starred changes. -->
- **"Favourites" is now "Starred"** — The star tab and the star action go by "Starred" now, on every surface. The icon was always a star; the label finally agrees with it. Nothing else changes — your starred conversations stay starred.

<!-- detail: For developers writing Rebel plugins only: the conversation lifecycle field on the plugin API renamed from pinnedAt to doneAt (with the polarity flipped — doneAt is now set when a conversation is marked done, matching starredAt/deletedAt), and conversations.pin() became conversations.toggleDone(). This is a breaking change to the plugin conversation API. See PLUGINS_API_REFERENCE.md for the migration details. Most people have no plugins and are unaffected. -->
- **For plugin authors: a breaking rename in the conversation API** — If you build Rebel plugins, the conversation lifecycle API changed: `pinnedAt` became `doneAt` (and its meaning flipped to match), and `pin()` became `toggleDone()`. See PLUGINS_API_REFERENCE.md for what to update. If you don't write plugins, carry on — nothing to see here.

<!-- detail: Rebel's desktop app moved from Electron 39 (end-of-life since 2026-05-05, no longer receiving security patches) to Electron 42 — bringing a newer Chromium and a current Node runtime under the hood. The upgrade was de-risked by a full measurement spike before shipping (packaged build, boot, the whole automated test fleet, and the native file-watcher shutdown path, all green on macOS arm64/Intel and Windows). One non-obvious finding from that spike shaped the work: the safeguard that prevents a rare file-watcher leak from hanging the app at quit turns out to be permanent rather than something the new runtime made unnecessary — so it stays in place. No action needed; the app updates itself. -->
- **Newer, safer engine under the hood** — The desktop app now runs on a current Chromium and Node runtime (Electron 42), replacing a version that had reached end-of-life and stopped getting security updates. Nothing changes in how you use Rebel — it's the same app on fresher, better-patched foundations. The update arrives automatically.

### Fixes

<!-- detail: When the Rebel window was fairly narrow, the conversation transcript allowed a small amount of horizontal scrolling — a faint horizontal scrollbar — even though it's meant to scroll vertically only. The cause was content that can't shrink (e.g. an approval card or an embedded app view) rendering wider than the narrow window and nudging the whole transcript sideways. The transcript scroll region now refuses horizontal scrolling outright; genuinely wide content that needs it (code blocks, for instance) still scrolls within its own frame. Fix is `overflow-x: hidden` on the `.sessionLog` scroll container in `ConversationPane.module.css`. -->
- **No more sideways drift in a narrow window** — Make the window narrow and the conversation could slide a few pixels sideways, faint scrollbar and all, when it's only ever meant to go up and down. It now scrolls vertically and nothing else. Wide things like code blocks still scroll within their own frame.

<!-- detail: When the agent drafts a document (e.g. a Slack update or email), the inline "Document draft" card shows a Preview rendered through a strict Markdown reader that treats a single line break as a mere space — so a draft written with one bullet per line collapsed into one run-on paragraph, even though the raw Markdown (and the Markdown view) was fine. The Preview now honours single line breaks as actual line breaks, matching what you wrote. Only the document-draft preview changed; chat messages and other surfaces are untouched. -->
- **Document previews keep their line breaks** — Draft a Slack post or email and the inline preview used to mash every line into one wall of text — the draft itself was fine, the preview just didn't believe in line breaks. It does now. What you see is what you wrote.

<!-- detail: On the mobile and web companions, the "Star" button used to set a conversation's lifecycle to Active (the same field as marking it Done/active) instead of actually saving it as a favourite — so the star icon you saw wasn't reading from "favourited" at all. Starring now writes the real favourite field, so it does what it says, and we've split out a proper "Mark as done" control for the lifecycle action it used to hijack. One side effect of the fix: a few conversations you starred on your phone may lose their star, because under the hood they were never actually saved as favourites — re-star them and they'll stick. -->
- **Starring on mobile and web now actually saves favourites** — The "Star" button on the phone and web companions used to quietly mark a conversation active instead of saving it as a favourite. Starring now does exactly what it says, with a separate "Mark as done" control for the thing it used to do by mistake. A few conversations you starred on your phone may lose their star — they were never really saved under the hood; star them again and they'll stick.

<!-- detail: Rebel keeps long conversations going by periodically compressing older context into a compact summary behind the scenes. That step was failing ~97% of the time: it was asked to write the full summary but given far too small an output budget, so the summary was cut off mid-structure, came out unusable, and was discarded — every failed attempt still costing effort. Worse, when it fails the old context is never trimmed, which on very long conversations could build toward the kind of silent context-exhaustion reset we've fixed before. Now it has room to write (and the stored summary is capped so it can't grow without bound across a long session), so it succeeds reliably; on the rare genuine failure the Usage page labels it honestly under "Did not finish" instead of a vague catch-all. -->
- **The behind-the-scenes tidy-up for long conversations actually works now** — To keep long chats going, Rebel quietly compresses older context into a summary. That step was failing almost every time — asked to write a summary, then handed a postage stamp to write it on — so it produced nothing, wasted the effort, and on very long conversations risked the slow march toward a silent reset. It now has room to do its job, can't balloon over time, and owns up honestly on the Usage page the rare times it can't.

<!-- detail: The Usage page's big "Total spend" number counted API-equivalent value for every turn, including the ones covered by your ChatGPT or Mindstone subscription — so it could read ~$1,800 when the amount that actually left your wallet was closer to $130 (the rest absorbed by your subscription). The headline now leads with an honest "You paid" (true out-of-pocket only), shows what your subscription covered as reassuring context rather than a bill, and puts older "before cost tracking" spend on its own line instead of silently inflating the total. Two attribution fixes sit underneath: a managed Mindstone plan is now correctly counted as covered, and background context-compaction is now attributed to the subscription that actually ran it. -->
- **The Usage page now shows what you actually paid** — That big spend number used to count everything your subscription covered as if it had come out of your pocket — so it could look alarming when your real bill was a fraction of it. The headline now leads with honest out-of-pocket cost, frames subscription coverage as the good news it is, and stops lumping un-trackable old usage into your total. Less heart attack, more truth.

<!-- detail: Connecting ChatGPT Pro (Settings → Agents & Voice → ChatGPT Pro → Connect) could fail with "Failed to start callback server" on machines where another program — often OpenAI's own Codex command-line tool — was already using the local port Rebel needs for the sign-in handshake. The underlying bug: Rebel checked whether the port was free on one network address (IPv4) but ran the actual sign-in server on another (IPv6 localhost), so it would declare the port free and then immediately fail to start, with no recovery. Rebel now runs the server on the same address it checks, automatically tries a second permitted port if the first is busy, and — only if both are genuinely taken — tells you which program to quit instead of a generic failure. -->
- **Connecting ChatGPT Pro no longer trips over its own feet** — Signing in to ChatGPT Pro could fail with "Failed to start callback server" when another app (often OpenAI's Codex CLI) was holding the port Rebel needed. Rebel now knocks on the right door, tries a second one if the first is taken, and names who's blocking it when both are. Connection restored.

<!-- detail: A few ChatGPT Pro users got stuck in a maddening loop: conversations kept saying "ChatGPT is not connected", they'd go to Settings and reconnect, Settings would show "connected" — and conversations still did nothing. Two separate causes, both now fixed. (1) Reconnecting refreshed the ChatGPT sign-in but didn't restore which AI service the app was set to use, so turns kept being sent to a service the user had never set up. Reconnecting now repairs that setting too, on the desktop app, the web/mobile companions, and on the next launch for anyone already stuck. (2) If a conversation was set to use a Claude model — which ChatGPT Pro can't run — turns hit a dead end with an unhelpful "this other service needs a key" message. Now Rebel says plainly that Claude isn't available on ChatGPT Pro, your message is safe, and offers a one-click "Switch to [a GPT model]" instead of stranding you. Diagnosing this took longer than it should have because the error screen named the wrong service; that's been corrected behind the scenes too. -->
- **Reconnecting ChatGPT actually reconnects you now** — A few ChatGPT Pro users hit a loop straight out of a help-desk nightmare: conversations said "not connected", they'd reconnect, Settings would cheerfully say "connected", and conversations still sat there doing nothing. Two culprits, both gone. Reconnecting now restores your working session, not just the green tick. And if a conversation was set to a model ChatGPT Pro can't run, Rebel says so honestly and offers a one-click switch to one it can — instead of a dead end. Your messages were never lost; now neither is your patience.
<!-- detail: If one of your connected Google Workspace accounts had an expired sign-in, Rebel warned "Calendar Cache needs attention" on every launch — blaming the calendar cache (which was fine) and pointing you at a connectors page where every account looked healthy. Now Settings → Connectors marks the affected account with "Sign-in expired" and a Reconnect button that re-authenticates exactly that account, the warning names Google Workspace instead of the calendar cache and doesn't re-announce itself at every startup, you no longer get two warnings for the same expired sign-in, and any stale "needs reconnecting" state left behind by an old disconnect cleans itself up automatically. -->
- **The calendar warning that cried wolf** — An expired Google sign-in used to set off a "Calendar Cache needs attention" alert at every launch, pointing at a settings page where everything looked fine. Rebel now names the actual problem, marks the exact account with "Sign-in expired", and gives you a Reconnect button that fixes that account and nothing else. One problem, one message, one button.
<!-- detail: Since May, finishing onboarding lands you on Home with a "Start here" card that launches the intro conversation with Rebel — the intro no longer auto-starts. But if you'd already done the intro once and then re-ran onboarding from Settings → "Relaunch onboarding", a leftover done-flag quietly hid that card, so the wizard ended on a Home with no card and no way to start the intro at all. Relaunching now clears every "intro already done" signal (from one shared source of truth, so the two lists can't drift apart again), while your tutorial-checklist progress is left untouched — that has its own separate reset in Settings. -->
- **Re-running onboarding actually offers the intro again** — Relaunch onboarding from Settings and the "Start here" card now reappears on Home afterwards, instead of quietly assuming you'd already been introduced. Your tutorial progress stays put. Second first impressions, restored.

<!-- detail: The box on the Home screen where you start a new conversation was a fixed single line — type past the end and the text scrolled sideways out of view. It now grows downward as you type (Shift+Enter for a new line), wraps long text, and starts scrolling only once it reaches a sensible height — matching the message box inside a conversation, which already did this. Affects Home and the Automations prompt box. -->
- **The Home box grows with you** — The text box where you kick off a conversation used to be a single line that scrolled your words off the side. It now expands as you type and wraps like a proper text area — the same way the in-conversation box already worked. Room to think.
<!-- detail: A report containing an emoji (or any text trimmed at just the wrong spot) could end up with a half-character that our error-reporting service rejected as malformed — so the whole report, attachments and all, was thrown away in transit while the app told you "sent". Reports are now cleaned up before sending so this can't happen, text trimming no longer splits characters, and the confirmation message only promises what we can actually verify. If you filed a bug report from the Beta around June 10–11 and never heard back, that's why — please send it again. -->
- **Bug reports now actually reach us** — For a couple of days on Beta, a bug report could be quietly lost in transit on a technicality (an emoji split in half, if you can believe it) — while the app cheerfully reported "sent". Embarrassing, given the form's entire job. Fixed; if you filed one recently and heard nothing, please resend. We're listening again.
<!-- detail: Rebel's built-in file search opened files while scanning but didn't always close them. On a big workspace that added up to thousands of files quietly held open, and once the operating system's limit was reached, Rebel couldn't start any new helper processes — running commands, searching files, and similar tasks would all fail until you restarted the app. Files are now closed promptly and scanning stops once enough results are found. -->
- **No more gradual loss of abilities** — Searching a large workspace could leave thousands of files quietly held open, until Rebel slowly lost the power to run commands at all — curable only by a restart. Everything now gets closed properly behind the scenes. Rebel keeps its faculties.
<!-- detail: When your AI provider (e.g. ChatGPT Pro) hit a rate limit mid-task and Rebel couldn't switch to a backup, the error shown was a generic "something went wrong — try sending your message again", which is the one thing that makes a rate limit worse. Rebel now shows an honest provider-aware rate-limit message with guidance on when to retry or how to set up a backup provider. Nothing about retries or fallback behaviour changed — just the words. -->
- **Rate limits now say "rate limit"** — If your AI provider hit a rate limit mid-task, Rebel sometimes suggested resending your message — exactly what not to do against a rate limit. It now tells you what actually happened and when to try again. Honesty: the best recovery policy.
- **Less sentimental about old conversations** — Rebel no longer hoards memory from chats you already switched away from. Earlier conversations can rest now.
<!-- detail: If you connected OpenRouter via sign-in (OAuth) and then added your own custom OpenRouter model in Settings → Models, running it failed with a "missing credentials" error that effectively asked for an API key — even though signing in IS the credential, and no key field is ever shown for OpenRouter. The cause: only the models Rebel auto-added when you connected were wired to use your OpenRouter sign-in; models you added by hand weren't, so they fell through to a key that didn't exist. Now any OpenRouter model — auto-added or hand-typed — authenticates with your OpenRouter sign-in. If you paste a per-model API key it still takes precedence. -->
- **Custom OpenRouter models work with your sign-in** — Connect OpenRouter, add your own model by hand, and it now just runs — using the OpenRouter account you signed into. Previously it asked for an API key it never gave you a place to enter. The hand-added models were the only ones left out; they're back in the fold.

<!-- detail: Salesforce is a bring-your-own-credentials connector: you create a Connected App in your Salesforce org and enter the Consumer Key and Secret in Rebel's setup screen (Settings → Connectors). Those values were saved to settings, but when you clicked Connect Rebel still failed with "Salesforce OAuth credentials not configured" and told you to set environment variables — the resolver only looked at env vars, not what you'd already typed in. It now reads the key and secret from your saved setup, so the connect flow can finish without terminal commands. Environment variables still win for developers and self-hosted builds. Open connector source: github.com/mindstone/mcp-servers. -->
- **Salesforce setup uses the credentials you entered** — Connecting Salesforce means bringing your own Connected App key and secret; Rebel saved yours in Settings, then Connect claimed they weren't configured and pointed you at environment variables. It now reads what you typed in, so setup can actually finish. Your keys, remembered.

<!-- detail: A live diagnosis of the installed beta found Rebel quietly re-doing the same background work over and over while idle — re-trying file pulls that could never succeed, re-scanning the whole conversation store every few minutes, and re-running indexing passes that had nothing to do. Five of these loops were fixed at the root so they stop after one attempt (or skip entirely when nothing changed), and a flood of harmless "preserving legacy entries" log lines was quieted. Net effect: noticeably less idle CPU. -->
- **Quieter when you're idle** — Rebel now spends a lot less energy doing nothing. We tracked down several background loops that kept your processor busier than your actual work did — retrying things that couldn't succeed and re-scanning data that hadn't changed — and stopped them. Less heat, more battery, same Rebel.

---

## v0.4.46 — Jun 4-11, 2026

### Highlights

<!-- detail: Rebel can now package your whole setup — settings, spaces, memory, automations and more — into a single "Rebel transfer file" you export from Settings → Workspace, then import on a new machine during setup. Secrets and logins are deliberately left out of the file for safety, so you reconnect those once on the new machine via a short checklist. The import only ever lands on a fresh setup, and your existing data is always backed up aside first. -->
- **Move Rebel to a new computer** — Export your whole Rebel setup to a single transfer file, bring it over to a new machine during setup, then follow a short checklist to reconnect your logins. Switching computers, sorted.

<!-- detail: Rebel is being prepared to publish as source-available software. This release lands the groundwork: an automated public mirror with internal-only content stripped out, a community contribution/back-port pipeline, an open-source build that never sends analytics or crash data unless you opt in and supply your own keys, and connectors that walk you through bringing your own credentials. Source for the open connectors lives at github.com/mindstone/mcp-servers. -->
- **Rebel is going open source** — We're opening up Rebel under a source-available license. This release lays the foundation: a self-publishing public mirror, a community contribution pipeline, an open build that never phones home unless you turn it on, and clearer "bring your own credentials" connector setup. The open road begins.

<!-- detail: A new Mindstone-maintained Xero connector lets Rebel read and write invoices — including attachments, history/notes, and multi-currency invoices. Source is public at github.com/mindstone/mcp-servers. Connect it from Settings → Connectors. -->
- **New Xero connector** — Connect Xero to manage invoices (with attachments and multi-currency support), plus contacts, payments and more — now maintained as part of Rebel's open connector catalog. Your books, in the loop.

<!-- detail: Beyond your conversations, Rebel now takes copy-only snapshots of hard-to-reproduce data — settings, connected-account tokens, connector credentials, automations, memory, tasks and more — stored alongside (not inside) your app data so they survive a reset. Snapshots are size-capped (newest 10, 30-day prune, 200MB budget) and pruned automatically; secrets are written with locked-down file permissions and never appear in the manifest. It runs quietly at startup and never touches your originals. -->
- **Your settings and credentials, quietly backed up** — Rebel now keeps recent external snapshots of the things that are painful to set up again — settings, connected-account logins, automations, memory and more — safely beside your app data so they survive a reset. A safety net you'll hopefully never need.

<!-- detail: MiniMax M3 (minimax/minimax-m3) is now in the model catalog for OpenRouter users — a 512K-context frontier model with reasoning and tool support. It's available both as a main model and as a behind-the-scenes model. Pick it in Settings → Models. -->
- **New model: MiniMax M3** — A long-context frontier model (512K context, reasoning and tools) is now selectable if you connect through OpenRouter. More brains to choose from.

### Improvements

- **Clearer approvals** — Approval prompts now lead with the decision (allow or deny), keep the technical preview a tap away instead of front-and-centre, and explain safety pauses in plainer language. Decide first, dig into the details only if you want to.
- **Desktop or Cloud, made obvious** — Automations now have a clear Desktop | Cloud toggle instead of an ambiguous badge, and connector buttons show a "queued" state when they're waiting on a busy task rather than just spinning. No more guessing what it's doing.
- **A quiet "tools are back" all-clear** — When Rebel's tools briefly go offline and recover, you now get a one-time nudge that they're working again — instead of wondering whether it's safe to carry on. The all-clear, sounded.
- **Smoother first run** — The setup screens are clearer about starting fresh versus moving in from another computer, with a tidier "finish settling in" step. Less to puzzle over on day one.
- **Smoother model handling** — Conversations recover gracefully when a model response stalls or a single tool call fails, instead of hanging the whole turn — and the model shown in tooltips now matches the one Rebel actually uses. Fewer stalls, fewer surprises.
- **Honest "not connected" messages** — When an AI provider isn't set up yet, Rebel points you to connect it in Settings instead of wrongly claiming your credentials were rejected. It says what it means.
- **Rename a space's organisation anytime** — Click a space's organisation badge to rename it whenever you like, not only during setup.
- **Alt+Enter queues instead of cutting in** — While Rebel is busy, Alt/Option+Enter now adds your message to the queue (just like plain Enter) rather than interrupting the current turn. Need to cut in? That's what the "Send now" button is for. One fewer way to talk over yourself.

<!-- detail: As part of preparing Rebel for open source, connectors are being untangled from our hosted login. Zendesk is first: it now connects with an API token (subdomain + agent email + token from your Zendesk Admin Center) instead of a browser sign-in. Most of the open-source auth work is still under the hood and not yet switched on. -->
- **Zendesk connects with an API token** — Setting up Zendesk now uses your subdomain, agent email, and an API token instead of a browser sign-in — part of our wider move toward an open-source Rebel. One fewer hosted dependency.

- **Sharper bug reports** — When Rebel summarises a bug report, it now sticks to evidence it can actually see (error codes, counts, IDs) and clearly flags anything it's only guessing at, instead of confidently inventing causes. We taught it to say "I'm not sure."

### Fixes

<!-- detail: Conversation folders — the sidebar groupings you create to organise your chats — were silently lost when you migrated to the cloud or restored Rebel onto a new machine. The file holding your folders and which conversation sits in which was never uploaded or pulled back during migration. It now travels through the move in both directions and is restored automatically, with a round-trip safety check so this can't quietly come back. -->
- **Your sidebar folders survive the move** — Conversation folders (those sidebar groupings) could vanish when you migrated to the cloud or set up on a new machine. They now travel with everything else and reappear right where you left them. Your filing system, intact.

- **The "Rebel was interrupted" message tells the truth** — When a reply got cut off because the app closed or restarted, Rebel used to flash a "connection dropped" Wi-Fi warning — easy to misread as a network problem. It now says what actually happened: closed, restarted, or a genuine connection drop. No more false alarms.

- **No more stuck highlight** — A leftover "jump to this message" highlight could occasionally stay stuck on screen after you switched conversations. It now clears itself. Gone when it should be gone.

<!-- detail: A message added to the queue while Rebel was busy could cancel the running task instead of waiting its turn — most often when you switched to another conversation while it worked, because the queue released messages based on the conversation you were looking at rather than the one the message was for. Whatever the running task was doing mid-way (like editing a file) was lost. Queueing is now gated on the message's own target conversation at every level, and the engine itself refuses to let a queued message cancel a running task even in a race — it just goes back in line and sends when the task finishes. "Send now" still interrupts, on purpose. -->
- **Queued messages wait their turn, every time** — Adding a message to the queue while Rebel was busy could cancel the very task it was waiting for, especially if you switched conversations while it ran — losing whatever it was doing mid-way through. Queued messages now always wait for the running task to finish; only "Send now" interrupts. Cutting in line: cancelled.

- **The compose card no longer hangs** — Sending an email from a compose card could leave the Send button stuck forever, with no email sent and no error. It now recovers and tells you to check your Sent folder rather than freezing silently. No more mystery sends.
- **No more endless "Disconnecting…"** — Disconnecting a connector account (or pausing and resuming a connector) while an agent task was running could leave a spinner stuck for minutes. The change now applies immediately, and any remaining background tidy-up is queued with a clear "Change queued" notice. Click, done, move on.
- **No more endless "Connecting…" either** — The same was true on the way in: connecting an account (or "Add another account") while Rebel was busy with a task could spin for minutes. It now finishes right away, and if Rebel is mid-task you get a "Change queued" notice — the connection switches on as soon as the task wraps up. Both directions, unstuck.
- **No surprise "install developer tools" pop-up (Mac)** — On Macs without Apple's command line tools installed, Rebel could trigger the system "install developer tools" dialog out of nowhere. It now detects what it needs safely and won't summon that pop-up. Uninvited guest, shown the door.

<!-- detail: Quitting Rebel on macOS (including during an update's "Install & Relaunch") could intermittently end with the system "Mindstone Rebel quit unexpectedly" dialog — even though Rebel had already finished saving everything safely. The culprit was a file-watching component deep in the runtime that could be torn down in the wrong order at the very last moment of exit. Rebel now tracks every one of those native watchers and shuts down any stragglers itself right before the process exits, so the teardown race can't happen. Nothing was ever lost to this crash; it just looked alarming. -->
- **Fixed a crash that could appear when quitting the app on macOS** — Quitting Rebel could occasionally trigger a "quit unexpectedly" dialog after everything had already been saved safely. Rebel now shuts down its file watchers in exactly the right order at the final moment of exit, so quitting stays quiet. Exit stage left, no drama.
- **Lighter on the battery** — Rebel uses noticeably less processor and graphics power when it's idle or sitting in the background. Quieter when you're not looking.
- **A batch of reported fixes** — Picking GPT-5.5 (or another non-Anthropic model) for deep thinking no longer reverts; the compose form no longer opens blank; document search jumps to your first match; email review cards show formatting correctly; "approve always" sticks for Microsoft 365 drafts; search tells you when it's unavailable versus simply empty; and you get a clear toast if opening a file fails. A pile of small sharp edges, filed down.
- **Memory updates work on every provider** — Codex/ChatGPT and other non-Anthropic users no longer hit a spurious "Anthropic API key" error when Rebel updates its memory.
- **A clean slate on mobile sign-out** — Signing out or unpairing on mobile now fully clears the previous account's local data, including recordings, so nothing carries over to the next account.
- **Deleted conversations stay deleted** — A late background update could occasionally bring a cleared or deleted conversation back from the dead in your sidebar — and in one edge case a just-trashed conversation could go missing instead of resting in Trash. Both are fixed. No more zombie chats.

- **Stuck recordings now upload on their own** — On mobile, voice and meeting recordings that got stuck "waiting to send" could sit there indefinitely. They now retry automatically whenever Rebel is online, and pull-to-refresh gives the queue an immediate nudge. Your recordings were waiting for a bus that never came; we fixed the timetable.

<!-- detail: A follow-up to the earlier conflict-copy fix, which only suppressed file-level copies like foo (1).md. Cloud-storage sync can also mint whole folder copies (e.g. Project (1)/), and those were still propagating through Rebel's sync across machines. Rebel now suppresses machine-minted folder conflict shapes too, sibling-gated so the original folder still syncs, and deliberately narrow so an intentional folder like "Copy of Project" is left alone. -->
- **Conflict copies, now folders too** — Google Drive and Dropbox sometimes create duplicate folders (like `Project (1)`) the way they create duplicate files. Rebel already stopped the duplicate files spreading across your machines; now it stops the duplicate folders too. Tidiness, all the way down.

- **Steadier on mobile** — Fixed a background crash-loop when push notifications couldn't register on some devices, and a crash on the pairing/loading screens when touching certain controls. The app now degrades gracefully instead of retrying forever.

- **Fewer dead-end errors** — When a model can't be found, Rebel now cleanly falls back to a working one instead of throwing an error, and brief streaming hiccups mid-reply are retried rather than killing the turn. Direct-Anthropic-key users also stop seeing a misleading "issue with your API key" message for what was actually a routing quirk. Fewer dead ends, fewer shrugs.

<!-- detail: The default model on Mindstone managed plans (DeepSeek V4 Flash) can't view images, so whenever the agent read an image file mid-conversation, the very next model call failed with a generic "Something went sideways" — and retrying just failed again. Rebel now knows which models can see images: for text-only models it swaps the image for a short note so the conversation keeps going, while your image stays safely in history (switch to a vision-capable model and it sees the real thing). And if an image somehow still reaches a model that can't accept them, the error now says exactly that and offers a one-click model switch instead of a shrug. -->
- **Reading images no longer breaks text-only models** — If your current model can't view images (including the managed plan's default), the agent now carries on with a note about what it couldn't see, instead of the whole conversation dying with "Something went sideways." If a model genuinely can't accept images, the error now says so and points you to switch models. Sight optional, progress guaranteed.

- **Models in Settings tell the truth** — The model picker in Settings now reads each role's status from the exact same logic Rebel uses when it runs, so a row can no longer claim a model is fine when it would actually fail — or warn "needs setup" on a model that's running perfectly. Settings and reality finally agree.

- **The library editor no longer crashes on odd content** — Certain markdown shapes could make the document editor throw and take the screen down with it. It now falls back gracefully and keeps your text. Your weird formatting can stay weird, quietly.

- **Tighter privacy in diagnostic reports** — We audited what Rebel's crash and error reports send up and closed a gap where some everyday context (like calendar snippets) could ride along. Reports now apply a strict allowlist so only safe operational detail leaves your machine. Your data stays your business.

- **A rare background crash is gone** — When a local helper connection dropped at exactly the wrong moment, Rebel could hit a fatal error behind the scenes. Those hiccups are now handled quietly instead of bringing things down.

### Under the Hood

- **Open-source groundwork** — A lot of behind-the-scenes work to get Rebel ready to publish as source-available software: an automatic public mirror that strips internal-only content, a clean separation between the commercial and open builds, and a community contribution pipeline. The scaffolding for an open Rebel.
- **Fewer repeat bugs** — A wave of structural hardening added guardrails around tool availability, model selection, releases, async safety, the agent's own command-safety checks, and Rebel's internal contracts, so several recurring problems are much harder to bring back. New test harnesses now boot the real agent and check Rebel's internal message contracts to catch whole classes of bug before they ship. The kind of work you'll never notice. Which is the point.

---

## v0.4.45 — Jun 3, 2026

### Improvements

- **Privacy & Safety, front and center** — Privacy and safety controls are now their own top-level Settings destination instead of being tucked under Account & Preferences. Easier to find what protects you.

### Fixes

- **Plan mode works on your subscription** — If you're on a ChatGPT/Codex or OpenRouter subscription, plan mode no longer fails with a misleading "Credentials need attention" error. The planner now uses your own model instead of silently defaulting to Claude.
- **The right provider gets named** — Connection problems with the Mindstone managed provider now say "Mindstone" and send you to the correct Settings section, instead of being mislabelled as OpenRouter.
- **Fits your split screen** — Rebel lays out correctly at narrow split-screen widths, and the meeting header stays calm as the window shrinks.
- **Onboarding card stays put** — Fixed the coach intro card collapsing in the wide conversation layout.

---

## v0.4.44 — May 30 - Jun 2, 2026

### Highlights

<!-- detail: Rebel now runs on Claude Opus 4.8 (released May 28, 2026) as the default planning and thinking model for pay-as-you-go (Anthropic API key) and OpenRouter setups. Opus 4.7 and 4.6 stay selectable in Settings → Models if you prefer to pin a previous version. Pricing and context window match Opus 4.7. Mindstone flat-fee subscriptions keep their own curated model line-up. -->
- **Now on Claude Opus 4.8** — Rebel's default planning brain just got an upgrade. Opus 4.8 is the new default for Anthropic API key and OpenRouter setups; 4.7 and 4.6 are still there if you'd rather pin one. Smarter by default.

<!-- detail: Rebel now detects Google Drive / Dropbox "conflict copy" duplicates (foo (1).md, (conflicted copy), and nested chains) and offers a confirm-first cleanup that moves only byte-identical copies into a dated quarantine folder — never deletes, never overwrites, fully reversible via a manifest. It also stops those copies from multiplying through Rebel's cloud sync (the runaway foo (1) (1) (1)… fan-out), though your cloud-storage provider may still create the occasional first-level copy. For piles that built up before this release, ask Rebel to clean up the duplicates in a folder and it will run a safe, dry-run-first tidy-up. -->
- **Duplicate File Cleanup** — Cloud sync sometimes spawns armies of "conflicted copy" files. Rebel now stops them multiplying through its sync, spots the existing ones, and offers a one-click, fully reversible tidy-up that only ever touches exact duplicates. Ask it to clean up a messy folder and watch the clones go. Order, restored.

### Improvements

<!-- detail: The approval card was redesigned from a cluttered two-layer card into a calm trust row showing where something is going, who can see it, and how reversible it is — with a single "Review" button as the way to see full content and details. Review now reveals the actual content for every sensitive approval type on demand, and credential-risk saves get clearer high-risk styling so they no longer look routine. -->
- **Calmer Approvals** — The approval card is now a clean one-glance summary — destination, audience, reversibility — with a single Review button when you want the full picture. Less clutter, clearer stakes. Decide with confidence.

<!-- detail: The Turn Usage tooltip now reads each model's true role from the turn's own record rather than guessing by comparing names, so the Planner no longer shows up as two duplicate rows and the Behind-the-Scenes model now appears correctly (marked "not used this turn" when no background call ran). Each row shows a friendly model name plus its tokens and cost for the turn. -->
- **Turn Usage, Now Accurate** — The per-turn model breakdown stopped showing the Planner twice and started showing the Behind-the-Scenes model when it ran. Each row now lists a friendly name with its tokens and cost. The receipts add up now.

- **Sharper Recovery Messages** — When a long conversation recovers but the next attempt hits a network hiccup, Rebel no longer wrongly claims the conversation is "too large." You get the real reason instead. Honesty over hand-waving.

### Fixes

<!-- detail: Turn liveness is now a pure projection of the synced event log via one @core deriveTurnLiveness (idle|running|terminal|interrupted). The persisted isBusy/activeTurnId scalars are demoted to a recomputed cache stamped at a single persistence choke point, structurally eliminating the recurring "stuck isBusy / stale activeTurnId" bug family (7+ postmortems). A started-but-never-finished turn that goes stale (crash/quit) now derives 'interrupted' and surfaces a recovery affordance. -->
- **The Spinner Tells the Truth Now** — Conversations no longer keep showing "still working" after they've actually finished, and a turn cut short by a crash or quit now says "Interrupted — answer may be incomplete" with a one-tap Try again instead of stalling in silence. Less phantom thinking. More honest endings.

- **Meetings That Don't Vanish** — Meeting transcripts that failed to save now actually recover on relaunch (an old 24-hour cutoff had been quietly abandoning them), and a stray file in the recordings folder can no longer wipe out a transcript mid-save. Your meetings, kept.

- **Snappier Long Conversations** — Very long conversations stopped beachballing — the work behind each new message now scales gracefully instead of getting slower the longer you talk. Marathon chats, unblocked.

- **Cloud Machines Stop Choking on Startup** — Cloud instances no longer run out of memory while warming up their tool index, so they come online reliably instead of restarting in a loop. The warm-up, warmed down.

- **Reconnect Self-Healing** — A handful of provider-setup and self-update edge cases got smoothed over: managed-plan auto-select now respects when you've opted out, and cloud self-updates no longer fail with a cryptic manifest error. Fewer papercuts.

- **Connectors Keep Their Logins** — Notion (and other connectors) now stay signed in across restarts instead of occasionally needing a re-auth, Google Calendar commands stop failing on a name-format mismatch, and Google Shared Drives work end-to-end. Sign in once, stay in.

### Under the Hood

- **Quieter, Safer Internals** — Rebel's safety evaluator now degrades honestly when its checks can't run (staging things for review and suggesting a fallback model rather than failing silently), a big batch of noisy internal error reports got deduplicated, and large swaths of the codebase were re-architected to make whole classes of bugs impossible by construction. Boring on purpose.

---

## v0.4.43 — May 22-29, 2026

### Highlights

<!-- detail: Mindstone subscription tiers now provision a managed AI route after Stripe checkout, with server-supplied model defaults, tier allow-lists, unified AI provider settings, and recovery paths for checkout/upgrade races. The app shows allowance usage as a simple percentage, explains monthly reset timing, warns before exhaustion, and gives overflow options when needed. -->
- **Mindstone Plans** — Rebel can now use Mindstone-managed AI plans instead of asking every subscriber to bring and maintain their own provider key. Checkout, provider switching, model defaults, usage meters, and upgrade recovery all got wired into one calmer path. Billing, less artisanal.

<!-- detail: Library no longer treats Skills, Memory, Spaces, Atlas, folders, and plugins as unrelated tabs. They now share a Show x View lens model with richer cards, facet filters, focus-mode rail search/resizing, quick-open/editor shortcuts, plugin discovery, and repairs for Memory pagination, source-capture leakage, missing file-path prefixes, and card overlap. -->
- **Library Lens** — Skills, Memory, Spaces, Atlas, folders, and plugins now live in one cleaner Library model. Browse, filter, open, edit, and focus without jumping between four nearly-identical rooms. The costumes are gone. The files remain.

<!-- detail: Operators and live meeting coaches now share one OPERATOR.md frontmatter model with explicit roles. Rebel ships starter personas such as Brand Critic, Head of Marketing, Skeptical Engineer, Investor View, Customer Voice, and Risk & Compliance; you can set them up per Space, duplicate, rename, remove, personalise through an agent run, and use compatible personas as live meeting coaches. -->
- **Operators, Rebuilt as Perspectives** — Operators are now explicit perspectives you set up in a Space, not semi-autonomous teammates wandering the halls. Duplicate them, rename them, personalise them, use them in chat, or make them live meeting coaches when they have the right role. Opinionated help, on a shorter leash.

<!-- detail: On non-initial turns (especially follow-ups after you answer a question), Rebel now receives a structured summary of what it already looked up or did in prior turns. This cuts down on redundant work — tools aren't re-run just because the model forgot what it did two turns ago. Controlled by Settings → Agents → Enable prior-turns header. Architecture docs: docs/project/REBEL_CORE.md and docs/project/ARCHITECTURE_CONVERSATION_CONTEXT_CONTINUITY.md. -->
- **Cross-Turn Awareness** — When you answer a follow-up question, Rebel now remembers what it already looked up in prior turns. Less "let me search the same files again", more actually finishing the task. Enable it in Settings → Agents. Your call whether to flip the switch.

<!-- detail: Rebel now supports an inbound author policy for Slack with three modes: owner only, allowlist, and legacy permissive. New installs default to owner-only (strangers are silently ignored). Existing Slack users keep legacy permissive behavior until they review once, so nobody gets surprise lockouts. Blocked attempts are visible in Settings → Continuity & Messaging → Messaging under Recent message attempts, where users can allow or block by Slack ID. The policy is transport-agnostic (same logic works for any inbound channel that supplies a principal ID), includes per-principal rate limiting (10 per 60 seconds, owner-exempt), and layered self-loop suppression so accidental self-triggers are quietly absorbed rather than creating noisy back-chat. Cloud instances recover blocked attempts authoritatively so the Recent message attempts list is consistent across surfaces. Stage 9 also adds the operator runbook (docs/project/INBOUND_AUTHOR_POLICY_RUNBOOK.md) and a user-facing policy guide (rebel-system/help-for-humans/who-can-message-rebel.md). -->
- **Who Can Message Rebel** — Rebel now has configurable control over who can trigger it from Slack. New installs default to "just you" — strangers are silently ignored. Existing Slack users keep the old permissive behavior until they review it once, so nobody gets a surprise lockout. Rate limiting and self-loop suppression keep accidental triggers quiet. The settings panel shows recent attempts so you can allow or block deliberately. Sensible defaults, with an escape hatch.

---

### Improvements

<!-- detail: Cloud instances now defer expensive warmup work, load embeddings more carefully, avoid passing large heap settings into every MCP child process, and report detailed pressure/warmup state back to desktop. When Rebel sees likely resource pressure, it can suggest a one-click tier switch instead of just dropping work. -->
- **Cloud Pressure Warnings** — Rebel is better at noticing when its cloud machine is too cramped and can offer a direct tier switch instead of quietly struggling. The machine now coughs politely before fainting.

<!-- detail: Rebel Core now exposes Glob and LS as built-in tools, and the bundled prompt steers routine file discovery away from repeated Bash calls. A dedicated eval moved the file-discovery tool-selection pass rate from 75% to 91.7%. -->
- **Less Bash for File Browsing** — Rebel now has built-in file-discovery tools, so it should stop reaching for command-line searches every time it wants to look around. Fewer tiny shell expeditions. Same destination.

<!-- detail: Settings now includes one Efficiency Mode switch that quiets decorative animations, proactive nudges, and idle CPU embedding work for lower-spec machines. Disabling it restores the previous individual settings snapshot. -->
- **Efficiency Mode** — One switch quiets decorative motion, proactive nudges, and idle indexing work when the machine needs breathing room. Knowledge work stays on. Theatre dims.

<!-- detail: The planning view now groups contiguous parallel tasks into an "At the same time" swimlane with shared motion and screen-reader deduplication. This makes concurrent work visible without making each parallel task look like a separate crisis. -->
- **Parallel Plans Look Parallel** — When Rebel runs several plan steps together, the progress panel now shows them as one grouped moment. At last, concurrency looks less like a queue with commitment issues.

<!-- detail: Settings now groups continuity and messaging controls together, Slack setup includes an inline Connect CTA, and the BYOK Slack wizard includes the previously-missing Event Subscriptions/App Home steps so users can actually receive mentions and DMs after setup. -->
- **Slack Setup Is Less of a Scavenger Hunt** — The Slack setup flow now includes the missing steps people actually need: event subscriptions, App Home, and clearer connection state. Still Slack. Less archaeology.

<!-- detail: rebel://chat/from-dashboard redeems a short-lived dashboard table share token and opens a fresh Rebel conversation seeded with that table snapshot. This is for handoff from value dashboards into chat analysis. -->
- **Dashboard to Chat** — Dashboard tables can now open a pre-seeded Rebel conversation. Click, ask, continue. Tables, with an exit ramp.

<!-- detail: Generated HTML reports now use a strict default viewer with per-file trusted opt-in. That means useful reports can render inside Rebel when you approve the file, without making arbitrary HTML powerful by default. -->
- **HTML Reports, Trusted Per File** — Useful generated HTML can now stay in Rebel after you trust that file, instead of being punted to the browser by default. Suspicion remains the default. Sensible.

<!-- detail: Plaud imports now prefer complete server-side transcripts over local STT, which avoids duplicate transcription work and cost for most recordings. Audio downloads stream to disk, transcript markdown is sanitized more defensively, and live Recall transcripts can reach the cloud runtime through signed ingest. -->
- **Recording Transcripts Waste Less Work** — Plaud recordings use the finished server transcript when it is available instead of transcribing the same audio again. Meeting text arrives with less duplicate effort. Novel concept.

<!-- detail: The plugin authoring path now pushes agents toward the rebel_plugins_create flow, detects plugin source-file edits that bypass the safer path, and ships bundled plugin templates from disk via the Library Plugins lens. -->
- **Plugin Building Guardrails** — Rebel is less likely to invent placeholder plugin files or edit plugin source directly when the safer creation path exists. Creativity, supervised.

<!-- detail: Daily Spark generation now requires concrete personalisation anchors and has an eval gate that catches generic outputs. The goal is a small note that reads as about your week, not a clever poem in a borrowed jacket. -->
- **Daily Spark Gets More Specific** — Daily Spark now has to anchor itself in actual context from your week. Less generic whimsy. More "yes, that was Tuesday."

### Fixes

<!-- detail: Tool safety now memoises identical same-session calls, passes session-intent context into the evaluator, and surfaces recent explicit user intent without treating it as permission. Shell safety also got stricter detection for dangerous sed/tar/gzip/gunzip/unzip write and execution modes while allowing obvious read-only listings to avoid unnecessary prompts. -->
- **Safety Checks Remember the Plot** — Repeated safe tool calls should ask less often, while genuinely dangerous shell patterns are caught more reliably. Fewer false nags. Fewer sharp edges.

<!-- detail: Slack inbound fixes cover first-DM transcript loss, hallucinated tool replies, webhook parse drops, @handle silent-deny, stale replay ghosts, missing origin/context on cloud-routed sessions, and the public-channel preamble appearing in DMs. -->
- **Slack DMs Behave Better** — First messages, replayed events, cloud-routed context, and DM/public-channel wording all got cleaned up. Messaging: still distributed systems, now less visibly so.

<!-- detail: Workspace media URLs now survive Chromium's parser, and unsupported codecs offer a one-click open-in-default-app fallback in document preview and inline conversation embeds. -->
- **Media Preview Escape Hatch** — If Rebel cannot play a file format in-app, it can now open it in your default app instead of staring at it helplessly. Graceful surrender, implemented.

<!-- detail: Mobile cold start now treats transient secure-storage failures as unknown instead of unpaired, opening a long conversation jumps to the latest message, and the activity UI uses a single clearer view model. -->
- **Mobile Starts and Scrolls Better** — Paired mobile installs are less likely to get dumped into setup after an update, and long conversations open at the latest message. Small screen, fewer small betrayals.

<!-- detail: `rebel_usecases_add` no longer parks an in-turn embedding call on the same active turn until Undici times out, and Codex voice transcription now refreshes OAuth on a 403 before asking the user to reconnect. -->
- **Use Cases and Voice Stop Dead-Ending** — Adding use cases no longer waits on itself until the request times out, and voice transcription gets a token refresh before blaming your connection. Polite troubleshooting, at last.

<!-- detail: Memory cards now self-heal missing space-directory prefixes, source-capture files stay out of the Memory lens, memory pagination no longer drops boundary entries, and large synced workspaces avoid repeated realpath/log storms. -->
- **Library Memory Repairs** — Memory cards open more reliably, source captures stop masquerading as memories, and large synced workspaces are less noisy under the hood. The Library remembers what kind of memory it is.

<!-- detail: Main-process fatal logging now catches pino thread-stream failures and falls back to console.error, stopping a secondary uncaught-exception cascade that was generating high-volume Sentry noise while masking the original errors. -->
- **Crash Logs Stop Crashing** — A failure while logging a fatal error no longer creates another fatal error. Very meta. Now fixed.

### Under the Hood

<!-- detail: Behind-the-scenes model calls now settle through typed result boundaries, centralised cooldown recording, cloud preOAuthCallHook parity tests, and a typed local-proxy request classifier that prevents the (internal ticket) Claude-to-Codex egress leak class. -->
- **Behind-the-Scenes Routing Tightened** — Internal model routing now has stronger typed boundaries and tests around managed-key context, cooldowns, and provider selection. Plumbing, less drippy.

<!-- detail: Recovery errors now use deterministic captureKnownCondition fingerprints, transient-error turns render as interrupted rather than complete, and sustained lag or scan storms auto-capture throttled diagnostic artifacts. -->
- **Diagnostics Got Sharper** — Recovery paths, interrupted-turn presentation, and performance captures now leave clearer evidence when something goes sideways. Debugging, with fewer blindfolds.

<!-- detail: Several developer gates landed: unused dependencies ratcheted to zero, silent-swallow/no-empty linting tightened, native-binding ESM import guards added, file-index flake drains fixed, and CloudCapacity tests updated after the tier-dialog copy changed to "Switch speed." -->
- **Release Gates Tightened** — More dead code, flaky tests, silent catches, and dependency drift are now caught before release. The paperwork remains. It bites earlier.

## v0.4.42 — May 22, 2026

### Highlights

<!-- detail: Rebel now supports an inbound author policy for Slack with three modes: owner only, allowlist, and legacy permissive. New installs default to owner-only (strangers are silently ignored). Existing Slack users keep legacy permissive behavior until they review once, so nobody gets surprise lockouts. Blocked attempts are visible in Settings → Continuity & Messaging → Messaging under Recent message attempts, where users can allow or block by Slack ID. -->
- **Who Can Message Rebel** — Rebel can now decide who is allowed to trigger it from Slack. New installs default to “just you.” Existing Slack users keep the old permissive behavior until they review it once. Stranger attempts are quietly ignored and listed in Recent message attempts so you can allow or block them deliberately. Sensible, if not glamorous.

<!-- detail: When the safety evaluator detects a high-confidence, specific durable approval in chat, Rebel can now persist it into Safety Rules instead of treating it as a one-turn approval. Broad approvals and suspicious prompts stay one-shot for now, and Rebel shows a toast when a rule is saved. -->
- **Safety Rules From Chat** — Tell Rebel a specific action is always okay, and it can now save that approval as a Safety Rule instead of asking again next time. Consent, with memory.

### Improvements

<!-- detail: On eligible Anthropic-routed turns with no tool or sub-agent in flight, Rebel now runs its existing timeout diagnostics at the 5-minute watchdog level and updates the status text with what it found. The 10-minute abort stays unchanged; users just get useful context earlier. -->
- **Stuck Turns Explain Themselves Earlier** — If an AI response goes silent, Rebel now checks what kind of silence it is after five minutes and tells you sooner. Waiting, but with subtitles.

<!-- detail: Safety evaluation now includes Space and Automation context, including the relevant space label, sharing mode, and README preview. Clearly safe automation reads can be allowed deterministically, while external writes and sensitive surfaces still stay guarded. -->
- **Safety Checks Understand Spaces Better** — Automations that are only reading from the right private space are less likely to get stopped for pointless approvals. Context: still undefeated.

<!-- detail: The tool sandbox now chooses the trusted workspace ancestor instead of a temporary directory when resolving MCP sandbox roots. This fixes workflows where a trusted workspace lives behind a cloud-storage symlink while preserving the same trusted-root boundary used by Rebel's built-in file tools. -->
- **Trusted Folders Stay Trusted** — Tools behave better when your workspace sits behind synced-storage symlinks, instead of pretending a familiar folder is suspicious because the filesystem got creative. Symlinks: tolerated.

### Fixes

<!-- detail: Packaged Apple Silicon builds were missing part of the Recall desktop SDK runtime closure, so the helper process could be killed before meeting detection started. Rebel now copies and signs the required dependencies, and the Teams-only Full Disk Access prompt is deferred until Teams URL extraction actually needs it. -->
- **Meeting Capture Restored** — Meeting auto-detection works again on affected desktop builds, and the extra Teams permission prompt waits until it is actually needed. Less ceremony, more meetings remembered.

<!-- detail: Library loading now parallelises slow file-tree walks, backs off repeated watcher flushes during stormy sync events, avoids overlapping renderer reloads, and stops queueing doomed cloud uploads once the cloud host is clearly unreachable. -->
- **Library Stops Spinning Forever** — Large synced workspaces should open the Library tab instead of trapping it in loading purgatory. Purgatory has been paginated.

<!-- detail: The workspace health probe now retries transient ETIMEDOUT filesystem operations during startup pressure before surfacing recovery dialogs. Genuine missing folders still report after retries; busy local folders get a chance to answer. -->
- **Workspace Warnings Calm Down** — Healthy folders under heavy startup load should no longer be mistaken for unreachable folders quite so eagerly. The folder was there. Rebel now waits.

<!-- detail: Background Enhancement health checks now mirror the worker's own startup gates: disabled in settings, paused by the user, or awaiting large-workspace opt-in are pass states, not degraded states. Unexpected stops still warn. -->
- **Background Enhancement Stops Crying Wolf** — If background enhancement is deliberately off, System Health no longer calls it an error. Revolutionary restraint.

<!-- detail: Rebel's safety parser now treats quoted pipes and operators in commands like rg/grep/ripgrep as data, not shell structure, and the safety prompt describes .rebel/tool-outputs/ files as local session cache. -->
- **Local Cache Searches Stop Asking Permission** — Searching Rebel's own cached tool-output files no longer triggers a safety prompt just because the search pattern contains dramatic punctuation. Punctuation is not a crime.

<!-- detail: Auto-generated model profiles can no longer accumulate sticky JSON-incompatible flags. Existing affected settings migrate to the matching connection-managed profile where possible, duplicate rows are coalesced, and bypasses now show a toast instead of silently falling back. -->
- **Model Fallbacks Stop Being Sneaky** — A temporary structured-output hiccup should no longer quietly pin behind-the-scenes work to the wrong model forever. If Rebel has to bypass your choice, it says so. Manners.

<!-- detail: Packaged builds now include the rotating-log transport dependency and cap the fallback log file at 50 MB before opening a fresh file. Stale fallback logs are cleaned up after rotation is confirmed healthy. -->
- **Logs Stop Growing Forever** — A missing packaged logging dependency could leave one log file ballooning for months. It now rotates properly, like a civilized text file.

<!-- detail: Cloud token reads now remove rows that contain desktop-encrypted bytes the cloud runtime can never decrypt. Each affected cloud machine may emit one final warning, then the broken row is gone. -->
- **Cloud Token Warnings Self-Heal** — Some old encrypted token leftovers on cloud machines now clean themselves up instead of warning forever. One last grumble, then silence.

<!-- detail: Daily Spark's screen-reader weekday now uses the same English locale as the surrounding hardcoded phrase, avoiding mixed-language accessible labels such as "Daily Spark, mardi." on non-English machines. -->
- **Daily Spark Reads Consistently** — Screen readers no longer get mixed-language weekday labels in Daily Spark's hidden accessibility text. Tiny copy, tidy copy.

### Under the Hood

<!-- detail: Sentry-safe logs now allow a narrow MCP diagnostic envelope: bare tool name, error flag, top-level argument key names, and which argument keys were empty. Values, package IDs, account slugs, and server instance IDs remain filtered. -->
- **Better Tool-Failure Clues** — Rebel can now report just enough MCP tool context to debug failures without leaking the sensitive bits. Diagnostics, house-trained.

<!-- detail: Bug-fixing agents now have a helper script for fetching non-image Sentry attachments such as filtered logs and diagnostic summaries. This works around current Factory CLI handling for EmbeddedResource payloads. -->
- **Sentry Attachments Are Easier to Read** — The debugging pipeline can fetch the useful files attached to error reports instead of staring at placeholders. The shrug has acquired receipts.

<!-- detail: The Electron-debug MCP now persists managed dev-server state across MCP restarts and can adopt an already-running managed server instead of failing with "already running." This is mainly for our own UI testing loop, but fewer broken test sessions means fewer broken releases. -->
- **UI Test Plumbing Got Less Brittle** — Rebel's dev-server test harness can survive MCP restarts more gracefully. Not glamorous. Useful.

<!-- detail: Safety-prompt evals now register the same kind of non-Electron token store used by other eval surfaces, Sentry Autopilot has an eval-mode no-git guard, and release/catalog CI now handles active-provider parity exemptions and TruffleHog requirements more consistently. -->
- **Release Machinery Tightened** — Evals, secret scanning, provider-parity gates, and open-connector catalog sync all got less prone to false failures. The paperwork still exists. It behaves better.

---

## v0.4.41 — May 12-22, 2026

### Highlights

<!-- detail: Daily Spark is a slim, locally-generated note on the Home page. Rebel writes a weekly batch of seven short literary asides (limericks, haiku, telegrams, sommelier notes, dry one-liners) shaped by the actual contour of your week — calendar density, project trajectory, meeting patterns. One reveals each day. Heavy weeks shift to softer formats automatically; severe-distress weeks stay silent rather than risk a glib note. The text never leaves your desktop. Toggle under Settings → Agents → Personalisation. Architecture: docs/plans/260512_daily_spark.md. -->
- **Daily Spark** — A small personal note on Home each morning, shaped by the contour of your actual week. It stays on your device, gets gentler when weeks get heavier, and goes quiet when quiet is the responsible choice. You're welcome.

<!-- detail: Finish Line is a cross-surface stop condition for desktop, mobile, CLI, MCP, Automations, and cloud. The most specific criterion wins: per-turn CLI/MCP override, then conversation, then Automation default. Architecture: docs/plans/260515_finish_line.md. -->
- **Finish Line** — Set a success criterion for a conversation, Automation, or CLI run, and Rebel stops when it's met. The finish tape is now user-configurable. You're welcome.

<!-- detail: Microsoft 365 / Office connectors now use rebel-oss npx catalog entries instead of bundled manager fallback paths, with per-account instance migration preserved across desktop and cloud. Source lives in the public MCP connector catalog at github.com/mindstone/mcp-servers. -->
- **Microsoft 365 Connectors, Now Open Source** — Word, Outlook, Calendar, Files, Teams, and SharePoint now run through Rebel's open MCP packages instead of bundled app code. Same setup, more visible plumbing, easier fixes. The office has windows now.

<!-- detail: Google Workspace moved to the open Rebel connector package: Gmail, Calendar, Drive, Docs, Sheets, and related tools now install from the rebel-oss catalog. Source: github.com/mindstone/mcp-servers. -->
- **Google Workspace, More Open** — Gmail, Calendar, Drive, Docs, Sheets, and friends now run from Rebel's open connector package. Same setup, faster fixes, smaller app. Packaging: thrilling when it works.

<!-- detail: Replit SSH now runs as @mindstone/mcp-server-replit-ssh@0.1.0 with the same five tools and setup flow. The OSS package adds structured recovery, hardened SSH config/key handling, and public source at github.com/mindstone/mcp-servers. -->
- **Replit Connector, Open-Source Edition** — Replit SSH now runs as `@mindstone/mcp-server-replit-ssh@0.1.0`. Same five tools, same setup flow, sharper security posture. You're welcome.

<!-- detail: The Mixpanel help docs now describe the read-only Mixpanel MCP connector for events, cohorts, retention, funnels, insights, and profiles. The UX research helper prefers direct connector queries when Mixpanel is connected and falls back to advisory mode when it is not. -->
- **Mixpanel Connector Guidance** — Rebel now knows how to use the Mixpanel connector directly for product analytics work when you have it connected. Funnels, retention, cohorts: the usual tasteful spreadsheet-adjacent chaos.

<!-- detail: The new PDF fill-form skill uses a Node/pdf-lib path instead of the old Python+poppler approach. Fresh Rebel installs can fill supported PDF forms without a separate Python or poppler setup step. -->
- **PDF Form Filling, Less Setup** — Rebel can now fill supported PDF forms without needing a separate Python-plus-poppler toolchain first. Paperwork remains paperwork, but at least the plumbing is smaller.

<!-- detail: Chief-of-Staff hygiene adds deterministic, reversible cleanup for pinned context and schedules it as weekly maintenance. The bundled skill rules preserve private boundaries while keeping README context lean. -->
- **Chief-of-Staff Hygiene** — Rebel can now safely trim stale pinned context during weekly maintenance, without bulldozing private boundaries. Context gets lighter; memory remains house-trained.

### Improvements

<!-- detail: Library lens unification cleanup removes the old tab-era adapters and keeps one canonical Show×View model across folders/list/cards/atlas. The same files now appear through lens chips (`Show: Spaces/Skills/Memory/Everything`, `View as: Folders/List/Cards/Atlas`) with shared card shells and updated keyboard/docs language. -->
- **Library Lens, Fewer Costumes** — The Library learned that Skills, Memory, and Spaces were always the same files in different costumes. Show what you want; view it how you like. Same bookshelf. Fewer costumes.

<!-- detail: HubSpot connector bumped to @mindstone/mcp-server-hubspot@0.2.0 with conversations.read scope mirrored into the host catalog. New tools cover the HubSpot Conversations Inbox ((internal ticket)) and add line_items → deals reads ((internal ticket)). Existing 0.1.2 connections keep working; new connections get the conversation surface. -->
- **HubSpot Inbox and Deal Lines** — The HubSpot connector now reads from the Conversations Inbox and connects line items back to their deals. CRM busywork, slightly less manual.

<!-- detail: Actions now separate Coach material from actual tasks: wins, learnings, reflections, and third-party-owned follow-ups route back to Coach unless the user explicitly asks for a task. Dismissal feedback is scoped and bounded so future suggestions improve without brittle keyword bans. -->
- **Actions Learn From Dismissals** — Deleting an Action can now teach Rebel what not to suggest next time, without turning your preferences into a keyword blacklist. Feedback, with manners.

<!-- detail: Conversation switching work reduced transcript render churn, tightened settle overscan, added a lightweight switch skeleton, and preserved bottom-scroll behavior. File references in assistant markdown now show readable filenames, source pills, and privacy icons. -->
- **Faster Conversation Switching** — Opening another conversation does less heavy lifting before showing you the transcript, while still landing at the right spot. File links are clearer too. Movement, less furniture involved.

<!-- detail: Connector reconfiguration now gates stale semantic-search tool indexes during reconnects, so freshly reconfigured MCPs do not route through old tool definitions. -->
- **Connector Reconfiguration, Fresher** — Reconnecting a connector no longer leaves Rebel reaching for stale tool definitions. New setup, new tools. Revolutionary accounting.

<!-- detail: The behind-the-scenes default moved to DeepSeek V4 Flash, with specific provider routing exclusions for compliance boundaries. This affects background tasks such as summaries, safety-adjacent helpers, and other quiet work. -->
- **Background Work, Cheaper and Stricter** — Rebel's behind-the-scenes helper model is now cheaper by default, with tighter provider routing. The quiet work got quieter.

### Fixes

- **OpenRouter Legacy Profiles, Unstuck** — Some of you with older OpenRouter setups had models stuck in limbo. They're sorted now. You're welcome.

<!-- detail: Time-saved estimates are backfilled with original timestamps where structured ROI-hour estimates were missed. Progress surfaces now distinguish unavailable weekly estimates from true zero-hour weeks. -->
- **Time Saved, Recovered** — Missing ROI-hour estimates are repaired with their original timestamps, and progress screens no longer pretend missing data means zero. Time is real again.

<!-- detail: OpenAI/Codex/Responses streams now have a 5-minute first-chunk timeout. If the first chunk never arrives, Rebel treats it as a transient server error and retries instead of hanging indefinitely. -->
- **Stalled AI Streams Retry** — If an OpenAI or ChatGPT Pro stream never starts, Rebel now retries instead of waiting forever. Silence is not a strategy.

<!-- detail: The safety evaluator now sees up to 4,000 characters of the user's request instead of 500, and public-broadcast checks use connector-specific surface descriptors. Long multi-step requests keep their later authorizations visible to the evaluator. -->
- **Fewer False Safety Prompts** — Long requests no longer get chopped so aggressively before safety checks, which means later authorizations are less likely to vanish mid-sentence. Context: still useful.

<!-- detail: When the safety evaluator can't reach its provider, the resulting approval card now reads "Rebel can't complete the safety check (provider error). This often clears on its own — if it keeps happening, restart Rebel or raise a bug and we'll look into it." instead of the older "Safety evaluation unavailable — please try again or approve one-time" wording, which implied blanket approval was the right move when the underlying cause was a transient infra hiccup. -->
- **Honest Safety Check Errors** — When the safety check itself can't run because of a provider hiccup, Rebel now says so, in plain English, and tells you what to actually do. No more vague "approve one-time" suggestions for what is really a temporary plumbing problem.

<!-- detail: Python runtime detection now avoids invoking system stubs that can trigger OS-level developer-tool installation dialogs on machines without a Python toolchain installed. -->
- **Python Checks Stop Being Dramatic** — Expanding a Python-runtime connector card no longer summons a developer-tools install prompt just to check what's available. A simple question, finally answered simply.

<!-- detail: Slack's OSS connector path now has host-side OAuth orchestration for the npx subprocess auth_required handshake, plus a multi-workspace migration fix that preserves separate workspace candidates. -->
- **Slack Connector Migration, Safer** — Slack OAuth and multi-workspace migration paths are sturdier in the open connector flow. Your workspaces remain plural. Grammar matters.

<!-- detail: Settings tab renamed from "Cloud continuity" to "Continuity & Messaging" per Chief Designer pick. New Messaging section inside the renamed tab houses the Slack listener. Inline "Connect Slack first" CTA shown in Messaging section when Slack MCP is not yet connected. Thread continuity: cloud webhook and desktop polling both route via lookup() to existing slack-thread-bound conversations, preventing duplicate sessions for the same Slack thread. Thread history pre-fetched on webhook path for non-new conversations via conversations.replies (bounded to 20 replies, 5s timeout, once-per-process dedup). Feature-flagged experimental.slackInboundThreadHistory and experimental.slackDesktopThreadContinuity both default true. Coming soon labels for Telegram, WhatsApp, Microsoft Teams added to the Messaging section. Architecture: docs/plans/260523_messaging_tab_and_slack_listening_polish.md. -->
- **Continuity & Messaging, Less Scattered** — The old "Cloud continuity" tab is now called "Continuity & Messaging" and has a dedicated Messaging section where the Slack listener lives. If Slack isn't connected yet, Rebel prompts you to connect it first. Thread continuity works on both cloud webhook and desktop polling — mention Rebel in a thread, and follow-up replies land in the same conversation. If the thread was already going, Rebel pre-fetches the history so it knows what was said before you showed up. Telegram, WhatsApp, and Microsoft Teams show up as Coming soon. Less scattered, more where you expect it.

<!-- detail: Cloud router connection updates are now idempotent for repeated same-credential saves, and the Office sidecar quietly renews development certificates instead of crashing through an elevated prompt path. -->
- **Cloud and Office Reconnects, Calmer** — Re-saving the same cloud credentials no longer kicks off expensive reconnect cascades, and Office local setup recovers more quietly. Less ceremony. Always welcome.

### Under the Hood

<!-- detail: Sentry Autopilot Stage 5.6 added an outcome-shape eval harness, typed outcome-contract prompt guardrails, an 87.04% baseline across 18 fixtures, and Node 20-compatible fixture discovery for CI. -->
- **Sentry Autopilot Tightened** — The bug-analysis pipeline now has stricter outcome contracts and a dedicated eval harness to keep shape drift visible. The robot paperwork has guardrails.

<!-- detail: Super-MCP startup failures now propagate attemptErrors and the last structured error through the eval/headless runtime boundary. Fatal messages include the real cause and a diagnostic checklist instead of guessing at orphan processes. -->
- **Better Tool-Router Failure Clues** — When the tool router fails to start, Rebel now keeps the actual startup cause instead of handing developers a vague shrug. The shrug has been instrumented.

<!-- detail: OSS connector maintenance now has a documented update runbook and catalog-version audit flow, covering mcp-servers PRs, npm publish handoff, and Rebel catalog bumps. -->
- **Open Connector Maintenance, Less Folklore** — The open MCP connector update path now has a runbook and catalog audit process. Future fixes have fewer secret handshakes.

---

## v0.4.40 — May 11, 2026

### Highlights

<!-- detail: ff9c00864 - Removed Cmd+E preview/edit toggle keybinding to free Ctrl+E for the macOS NSResponder Emacs binding (move-to-end-of-line). The old handler matched Cmd/Ctrl+E in capture phase, so it caught Ctrl+E too. Preview/edit toggle moved to a header button on the document editor. -->
- **Ctrl+E Works in the Markdown Editor Again (macOS)** — The old preview/edit shortcut was quietly catching Ctrl+E in the markdown editor, which collided with macOS's built-in "jump to end of line" shortcut that Emacs muscle memory relies on. The toggle now lives as a button in the document header where it belongs. Ctrl+E is yours again.

### Fixes

<!-- detail: Fixed a CI validation gate that was preventing stable builds from publishing, so stable releases were lagging behind beta. Stable releases now publish normally again. -->
- **You Can Actually Update Again** — A CI gate broke our stable release pipeline 11 days ago, and we didn't notice because beta kept shipping fine. If you're reading this, the pipeline is fixed and you're finally past 0.4.35. Sorry for the silence.

---

## v0.4.39 — May 10, 2026

### Highlights

<!-- detail: Stage 10 (internal agent); planning doc docs/plans/260509_model_team_and_smart_picking.md. Stages 1-10 unify Settings → AI & Models around Model team, chip-toggles, Recovery-as-fallback, Smart model picking naming, and the per-conversation override honour gate. -->
- **Models, Now With a Team Page** — Settings → AI & Models has a new Model team section showing your Council and Smart model picking lineup. Adding a model to either is now a chip-toggle on the row — no more spelunking through the wizard. Recovery folds neatly into Main work as a one-line fallback. We also stopped saying "adaptive routing"; it's now Smart model picking. Same brain. Better words. (And if you've picked a specific working model for a conversation, Smart picking takes the hint and steps aside.)

- **Interactive Drafts, In Place** — Drafts now sit directly in the conversation, not lurking under the paperwork.

<!-- detail: b0a8a1f7a feature span 8b60dfc01..b0a8a1f7a - parallel sub-agent execution behind PARALLEL_AGENT_CAP=4. Plan steps marked with parallel_group fan out concurrently with cap-bounded dispatch, settle-as-they-finish translation, and a single combined progress banner. -->
- **Plans Now Run Some Steps in Parallel** — When the planner spots independent steps, Rebel runs up to 4 sub-agents at once instead of one-after-the-other. You'll see a "Running N parallel tasks" banner while the burst is in flight. Same plans, less waiting.

- **Cloud Capacity, Less Guesswork** — Settings → Cloud now shows cloud speed and storage as separate controls, with a live storage meter, manual add-storage flow, and calm warnings before sync has to become theatrical. Infrastructure paperwork, translated.

- **Sync Scales With What Changed** — Conversation sync now scales with what changed, not how much you've ever said. Long chats, less drama.

<!-- detail: a3428b666 - Adds a read-only Vanta MCP connector with API-key auth and 11 compliance tools covering vulnerabilities, tests, controls, resources, evidence, people, query results, and compliance summaries. -->
- **Vanta Connector** — Rebel can now read compliance data from Vanta: controls, tests, evidence, vulnerabilities, and summaries. Compliance paperwork, slightly less inevitable.

### Improvements

<!-- detail: A0/A3-A6 and C0-C3 unified interactive UI work. Primary MCP app views now preserve prose/fallback/search/accessibility surfaces, show Rebel-owned source/trust chrome, and add permissioned iframe-to-host context/message/tool paths. The Settings panel exposes connected app permissions with remove-access controls. -->
- **Connected App Permissions** — Interactive app views now have a proper permissions panel in Settings, so you can see which connected apps have access and remove it when needed. Trust, visible.

<!-- detail: Stage 11 of session event delta sync adds pre-deploy staging verification and post-deploy stuck-session checks. The rollout now verifies recovery instead of assuming it. -->
- **Sync Rollout Checks Itself** — The new delta-sync path now has staging and post-deploy verification for stuck sessions. Optimism is nice. Verification is better.

### Fixes

<!-- detail: REBEL-T4 fingerprint disambiguation. AgentSessionError fingerprint now includes the structured error kind (when available) so distinct underlying errors stop collapsing into the same Sentry issue, making triage actually useful. -->
- **Sharper Crash Diagnostics** — When something goes wrong with the AI service, our error-reporting now tells different problems apart instead of dumping them into one giant bucket. Faster fixes, fewer reruns of the same investigation.

<!-- detail: aadab905f - Virtual Claude profiles are now unwrapped back into real model choices in the role codec. Picking Opus 4.7 or another Claude model for Deep thinking while a non-Anthropic provider is active no longer renders as "Unknown profile (__virtual-thinking)". -->
- **Claude Choices Stop Going Unknown** — Choosing Claude for Deep thinking while another provider is active no longer turns into "Unknown profile." Claude is Claude again. Radical clarity.

<!-- detail: e7b5b932a - Conversation annotations are persisted per-session across hot reloads, session switches, and app restarts. Send-clear now fires through the message queue's onCommit path, so failed sends preserve the user's comments instead of clearing too early. -->
- **Conversation Comments Stick Around** — Comments you attach to AI replies now survive switching conversations and restarting Rebel until Rebel actually receives them. Draft the thought, wander off, come back. Still there.

<!-- detail: 068ab4f5f - Cloud service boot now accepts Fly's expected rolling/bluegreen deploy overlap where old and new machines may briefly both be started. The previous single-running-machine assertion could crash-loop deploys. -->
- **Cloud Deploys Stop Tripping Over Themselves** — Cloud updates no longer panic when the hosting platform briefly runs old and new machines during a rollout. Turns out deployment can involve deploying. We adjusted.

### Under the Hood

<!-- detail: e26829aa8 - Rebel Core now emits routing metadata at iteration boundaries so model-step badges stay current when tasks are created mid-loop. Watchdog judge parse failures now preserve error details in diagnostics; harmless schema extras are tolerated and extension times snap to the allowed bounded set. -->
- **Stuck-Turn Diagnostics, Less Cryptic** — Rebel now records why its "is this stuck?" judge failed to parse a decision, and it keeps step badges current when plans change mid-loop. The shrug has been instrumented.

---

## v0.4.38 — May 8, 2026

### Fixes

<!-- detail: 8e04de595 - AbortSignal now propagates through startup cleanup to cancel hung cloud-storage I/O. Prevents abandoned promises when Promise.race timeout fires on unresponsive FUSE mounts. -->
- **Startup No Longer Hangs on Slow Storage** — When cloud storage is unresponsive at launch, Rebel now cancels the hung I/O instead of waiting forever. Startup, unblocked.

<!-- detail: cd9aa7a44 - Destructive-changes default safety rule now has an escape clause so explicit allow rules take priority. Fixes (internal ticket) where M365 email delete was blocked despite toggle ON + explicit safety rule. -->
- **Safety Overrides Work Again** — Explicit tool-safety allow rules now correctly override the default destructive-changes block. If you've told Rebel something is OK, it listens. Trust, reciprocated.

<!-- detail: e0afb3e84 - Empty-string model rejected in toStreamResult so it doesn't leak past boundary. Last latent gap in the Codex empty-model propagation chain. -->
- **Empty Model Name, Caught** — A stray empty-string model identifier that could slip through the routing boundary is now rejected at the edge. One fewer ghost in the machine.

<!-- detail: 1abf97242 - Proxy-identity headers gated on transport, not routeScope. Direct provider dispatches no longer leak proxy auth tokens into upstream logs. -->
- **Proxy Headers Stay Local** — Direct-Anthropic and direct-OpenAI calls no longer accidentally include internal proxy auth headers. Your routing details, private.

---

## v0.4.37 — May 7, 2026

### Highlights

<!-- detail: (internal ticket) fix. Council and ad-hoc Anthropic-direct lead turns were being forced through the local routing proxy and rejected by Stage 3's fail-closed `route_required` gate (400 'Missing x-routed-model header'). Decoupled lead-agent proxy dispatch from routeScope and plumbed routedModel symmetrically. Fixed in commit 4b0741f2b. -->
- **The "AI service hiccup" — fixed** — Council mode and ad-hoc routing with Anthropic-direct providers no longer crash with a "Missing x-routed-model header" error. The hiccup was a routing regression — now smoothed out.

### Improvements

- Slack threads now actually work end-to-end. Connect Slack from settings, mention Rebel in a thread, get a real reply. Revolutionary, we know.
- Connectors now have an "Update key" button. Rotate API keys without disconnecting and starting over.
- Rebel now says when a model teaches it a better output or context limit in Settings → Models. Same runtime brain, less mystery.

### Fixes

<!-- detail: 85f1c7f20 - O(n^2) codepoints.shift() loop in applySoftCaps replaced with linear-time codepoint-byte accounting. 100 KiB single-line content was taking ~25s instead of milliseconds, timing out under verify:agent CPU contention. -->
- **Recent-logs tail, dramatically faster** — Long single-line log content was taking 25 seconds to truncate. Now milliseconds. The agent's recent-logs view stays responsive on heavy logs.

<!-- detail: 640799232 - integration tests were reading stale settings.claude.model after the canonical settings namespace migration, leaking proxy-dialect strings into the direct-Anthropic test path. -->
- **Settings consistency** — Internal cleanup so the canonical settings accessors are used everywhere, eliminating a class of "stale model name" surprises after provider switches.

---

## v0.4.36 — May 4-7, 2026

### Highlights

<!-- detail: Stage 6 Slack webhook integration brings instant, push-based Slack mention replies instead of relying on the 60s desktop polling loop. Enables thread-level continuity. Configurable via "Use cloud for Slack" toggle. Connect from Settings → Integrations. -->
- **Slack Threads, End-to-End** — Connect Slack from Settings, mention Rebel in a thread, get a real reply. Revolutionary, we know.

<!-- detail: New "Update key" / "Update details" footer button on expanded connector cards opens the existing setup-field form pre-filled (non-secret fields populated, secret fields cleared). Blank-secret submit preserves existing stored secrets via merge semantics. Auth-failure state surfaces a recovery Notice near the top of the card with the same action. No more disconnect-and-start-over to rotate a key. -->
- **Rotate API Keys In Place** — Connectors now have an "Update key" button. Rotate API keys without disconnecting and starting over. Your configuration, preserved.

<!-- detail: Unified provider information architecture replaces the old Claude-only model namespace. PROVIDER_CATALOGS is the curated single source of truth, deduping by billing route so ChatGPT Pro subscriptions and direct API-key profiles stay distinct. RouteStatusLine shows executor-tagged route events. Settings model dropdowns show all your models from all your providers in one clean list. Learned context-window limits are now unified onto ModelProfile sidecar fields so context-window overflows are remembered per-profile across sessions. -->
- **Unified Model Settings** — All your models from all your providers now appear in one clean list, with subscription-vs-API-key profiles staying distinct. Context-window limits Rebel has learned are now saved per profile, so context overflows are remembered across sessions.

<!-- detail: New users now see a first-run homepage with clear next-step actions derived from their setup data, instead of a blank slate. The onboarding flow explains why connections matter and hands users off with clearer confidence. Loading states use a consistent branded pattern. Composer and conversation surfaces polished for visual quietness. -->
- **Better First Impression** — New users now see a homepage with clear next-step actions after onboarding, instead of a polite blank shrug. The setup flow explains why connections matter. Loading states calmer. Surfaces, quieter.

### Improvements

<!-- detail: Comprehensive post-incident diagnostics events ledger (Stages 1-4). New event variants for auth transitions, cloud cooldowns, streaming invariants, MCP lifecycle, tool call errors, turn aborts, and approval timeouts. Manifest summarizes events.jsonl with per-kind counts. When things go wrong, the diagnostic bundle now tells you what happened without needing raw logs. -->
- **Richer Diagnostics Bundles** — When something goes wrong, the diagnostic bundle now includes a structured timeline of auth transitions, cloud events, tool errors, and approval states. Less detective work, more answers.

<!-- detail: Boolean setupFields with envVars (e.g. Browser Automation's "Show the browser window") are now surfaced as inline toggles on the expanded connector card after connection. Users don't have to disconnect and reconfigure to flip a preference. -->
- **Connector Preferences, Adjustable** — Boolean settings on connected connectors (like Browser Automation's "Show the browser window") are now editable inline. No disconnect-and-reconfigure dance.

<!-- detail: Notification drawer group headers now reflect the up-to-date conversation title from sessionStore instead of a stale 30s approval-cache snapshot, falling back to a truncated first-message preview when the title is still default. -->
- **Inbox Titles, Live** — Notification drawer headers now show up-to-date conversation titles instead of stale snapshots. Titles, current.

<!-- detail: Thinking model's "Same as Working" option was misleading — selecting it doesn't run plan mode with the working model, it disables plan mode entirely. Renamed to "Off (no plan mode)" for clarity. -->
- **Thinking Model Label, Honest** — "Same as Working" is now "Off (no plan mode)" — because that's what it actually does. Clarity, improved.

<!-- detail: Cmd+N, Cmd+Shift+N, Cmd+O, Cmd+Shift+A, Ctrl+Tab, and Ctrl+Shift+Tab silently stopped working when focus was in the editor. Now wrapped in a canonical useGlobalHotkey that works everywhere. -->
- **Keyboard Shortcuts Restored** — Six shortcuts (new conversation, open file, switch tabs, etc.) silently broke in the editor. All back. Keyboards, useful again.

<!-- detail: File metadata now stays current as files move and disappear, and document previews resolve paths before opening. Fewer stale references and dead-end clicks. -->
- **File Previews, More Reliable** — File metadata stays current as files move, and document previews resolve paths properly. Fewer dead-end clicks.

### Fixes

<!-- detail: Five-layer definitive fix for the Codex subscription detection regression class (260429). Idempotent migration rescues users stuck on stale Codex profile state. Boundary registry entry makes future regressions a planning-time hint. Also: force stream:true upstream on Codex passthrough so BTS safety/query/quip evaluations stop fail-closing (Codex Responses API rejects stream:false). -->
- **ChatGPT Pro Routing, Definitively Fixed** — The recurring regression where Codex subscription detection broke has been fixed at the root, with a migration that rescues stuck users and a structural guard against recurrence. Behind-the-scenes calls also stop fail-closing on every request. The saga, ended.

<!-- detail: Stage 6 hardens the Codex Responses SSE translator with failure-detection-first ordering on both buffering and streaming paths. 502 errors now surface real upstream messages instead of generic failures. -->
- **Better Error Messages via ChatGPT Pro** — When ChatGPT Pro returns an error, you now see the real upstream message instead of a generic failure. Errors, informative.

<!-- detail: (internal ticket): Turn-end cleanup was clearing tool approvals before users could act on them. Approvals now persist past turn-end. -->
- **Tool Approvals Stay Visible** — Approve/deny prompts for tool use no longer vanish when the turn ends before you've responded. Approvals, patient.

<!-- detail: Bash commands can no longer access MCP config files. The protected path guard now threads userDataPath through the context chain so sensitive app config is off-limits to shell operations. -->
- **Bash Can't Touch Config Files** — A safety guard now blocks Bash commands from reading or writing MCP configuration files. Your config, protected.

<!-- detail: (internal ticket): 77 users were hit by MessageTimeoutError after 10 min idle while a long MCP tool call was legitimately running. Layer 1 streaming timeout now aligns with the Layer 2 watchdog when a tool is in flight. -->
- **Long Tool Calls Stop Timing Out** — MCP tool calls that legitimately run for minutes (large file operations, complex queries) no longer get killed by a misaligned timeout. Patience, aligned.

<!-- detail: (internal ticket): Per-message logging was reading app-settings.json synchronously, causing EMFILE fatal-unhandled errors under sustained load. Error envelope added on log:event + console-message handlers. -->
- **Settings Read Crash, Fixed** — A crash under heavy logging load that exhausted file handles has been fixed. Stability, improved.

<!-- detail: (internal ticket): chokidar's depth: 12 cap isn't sufficient for self-nested workspaces. A 900-char path-length cap stops the ENAMETOOLONG storm on extreme directory structures. -->
- **Deep Folder Structures, Handled** — Workspaces with deeply nested folder structures no longer trigger cascading file-watcher errors. Depth, bounded.

<!-- detail: Planner JSON schema now varies by provider. Cohere/Together get prompt-only enforcement; OpenAI gets strict-mode shape; Anthropic gets universal-subset. Previously the structured-outputs feature silently fanned out the same schema to all providers. -->
- **Plan Mode Works on More Models** — The planner now sends provider-specific JSON schemas, so plan mode works correctly across Anthropic, OpenAI, and open-weight models instead of silently breaking on some. Compatibility, widened.

<!-- detail: (internal ticket): During sustained safety-eval API rate-limits, users got no approval prompt. Rate-limited safety-eval calls are now coalesced into one approval card per cooldown window. -->
- **Safety Approvals During Rate Limits** — When safety checks are rate-limited, you now get a single approval prompt instead of nothing at all. Safety, present.

<!-- detail: Pre-migration Salesforce users were stranded with stale config after the OSS migration removed backfill maps. Backfill mappings restored. Also: Haiku 4.5 max-output entry added so delegating to Haiku sub-agents doesn't 400. Also: cloud turn-events no longer vanish mid-turn after recovery retry. -->
- **Connector Migration + Cloud Reliability** — Pre-OSS Salesforce users can migrate properly now, Haiku 4.5 sub-agent delegation works, and cloud turns survive recovery retries without losing events. Small fixes, broad impact.

<!-- detail: Meeting bot transcript prompt now includes a privacy-guard bullet that stops the model from summarizing sensitive topics (medical, financial) when it should redirect. Log file discovery regex now strictly matches pino-roll rotation naming. OpenAIImageGeneration registered in bundled catalog. -->
- **Meeting Privacy + Log Discovery + Image Gen** — Meeting transcripts no longer leak sensitive topics in summaries, log file discovery handles rotated files correctly, and the image generation connector registers properly. Polish, applied.

### Under the Hood

<!-- detail: (internal ticket) Stages 1-7: Typed CloudErrorCategory + CloudConnectionReconciler. Single-writer service replaces 8 scattered cloudInstance status writers with a reconciler that owns all state transitions. Root cause fix for (internal ticket) sticky state. ESLint guard prevents direct writes. Sentry transition captures surface stuck states within minutes. -->
- **Cloud Connection State, Single-Writer** — Eight scattered writers that could race and leave cloud connection status stuck have been replaced with a single reconciler that owns all transitions. The sticky-state class that silently left users disconnected is now structurally eliminated and instrumented.

<!-- detail: Stages 4, 5, 7 of provider feature gate hardening. Process tripwire in (internal workflow) + (internal workflow) workflows, boundary-registry entry, and predicate budget script. Canonical settings accessor migrated to per-field accessors in App.tsx with .models destructure guard. -->
- **Provider Guards + Settings Type Safety** — Provider feature gates now have workflow tripwires and a budget script, and the canonical settings accessor uses per-field types instead of the old namespace-wide accessor. Foundations, tightened.

<!-- detail: cloud-service-test TS baseline 62→42 errors; mobile baseline 25→19. Renderer memory diagnostics with payload-aware byte counters for heap attribution. safeStorage U+FFFD encoding fix extended to codexTokenStorage. -->
- **Type Health + Memory Diagnostics** — TypeScript error baselines continue to drop (cloud-service 62→42, mobile 25→19). Renderer memory diagnostics now attribute heap growth to specific content types. The encoding fix for secure storage extended to cover Codex tokens.

---

## v0.4.35 — Apr 27-30, 2026

### Highlights

<!-- detail: Stage 6 Slack webhook integration brings instant, push-based Slack mention replies instead of relying on the 60s desktop polling loop. Enables thread-level continuity. Configurable via "Use cloud for Slack" toggle. -->
- **Instant Slack Responses** — Slack @-mentions now hit Rebel instantly via cloud webhooks, skipping the 60-second polling delay and keeping conversations neatly threaded. Toggle "Use cloud for Slack" in Settings to flip the switch.

<!-- detail: Stage-aware adaptive routing. Behind a feature flag, a planner picks the best model and reasoning effort for each step of a turn from your routing-eligible profiles, instead of running the whole turn on one expensive model. Models are presented to the planner as peers with strengths and weaknesses (curated capability defaults for ~25 known models, customisable per-profile in Settings). The thinking panel shows which model executed each step. Ready for per-step model switching when that lands. -->
- **Adaptive Routing (Beta)** — Rebel can now pick the right model for each step of a turn — fast cheap ones for easy bits, the heavy lifters for the hard bits — instead of running everything on the most expensive option. Behind a feature flag while we tune. The thinking panel shows which model did what.

<!-- detail: Conversations now auto-title in 2-3 words instead of a full-sentence essay, and re-title themselves at turn 5 once the conversation has shape. Centralized across desktop, cloud, and mobile so titles match wherever you look. The prompt was sharpened with Gmail subject-line examples to bias toward glanceable phrasing. -->
- **Conversation Titles, Glanceable** — Conversations now get short 2-3 word titles you can actually scan, instead of full-sentence summaries. They also re-title themselves at turn 5 once the conversation has shape. Sidebars, less wordy.

<!-- detail: Five more connectors have moved from bundled-with-the-app to OSS packages installed via npx (`@mindstone-engineering/mcp-server-*`), joining the rest of the open catalog: Salesforce, Outreach, Retell AI, Browser Automation, and Office (Word/Outlook add-in). Same connectors, same UX — they just install, update, and accept community contributions like the others now. Browser-automation also picked up a `--headless` arg-order fix that was previously breaking every tool call; Office (which had been blocked by (internal ticket)/(internal ticket)) is finally fully managed. Source: github.com/mindstone/mcp-servers. -->
- **Five Connectors, Now Open Source** — Salesforce, Outreach, Retell AI, Browser Automation, and Office (Word/Outlook add-in) have all moved out of the bundled app and into our open MCP catalog. Anyone can read, fork, or contribute to them. The OSS migration continues.

<!-- detail: Office connector is included in the OSS migration above. Post-enable setup instructions also clarified — the Rebel button lives under Home → Add ons in current Office builds, and the Add-in requires the Microsoft 365 desktop apps (web/browser Office is not supported). -->
- **Office Setup Instructions, Sharper** — The post-enable copy for the Office connector now points you at Home → Add ons (where the Rebel button actually lives) and flags that the Microsoft 365 desktop apps are required. Web Office is not supported.

### Improvements

<!-- detail: Mentions in the composer can now render as editable inline chips instead of plain text. Behind a feature flag for now. The legacy file-preview rail is hidden when chips are enabled so mentioned files don't show up twice. -->
- **Rich Context Chips in the Composer** — Files and people you @-mention now appear as inline chips you can edit and remove, instead of plain text. Cleaner composing. (Behind a feature flag while we tune.)

<!-- detail: Custom answers on Rebel's question cards now have voice + image upload controls and a full-width input that aligns with the choice cards. Free-text answers can carry the same context as a choice. -->
- **Question Cards, More Expressive** — When Rebel asks you a question and you want to answer freely, you can now record voice or attach an image — and the input is full-width, like the choice cards. Answer how you want.

<!-- detail: Settings → Models now runs a tool-use compatibility probe on each model profile. Models without function-calling support (e.g. cohere/command-a on OpenRouter) get a red "No Tools" badge so you find out before the agent runs into a 404 mid-turn. -->
- **Spot Tool-Incompatible Models** — Settings now flags models that can't actually call tools with a red "No Tools" badge during testing, so you don't discover it mid-conversation. One less surprise.

<!-- detail: Memory-update turns silently retry up to twice on transient provider blips when no write activity has been observed. Eliminates the user-visible "hiccup" surface for first-message provider flakes on read-only memory work. -->
- **Quieter Memory Updates** — Memory-update turns no longer surface a visible error for transient provider blips when nothing was about to be written. They just retry. Fewer false alarms.

<!-- detail: Plugins generated by the agent that referenced bare hook names like `useEffect` or `useState` without imports used to crash at load ((internal ticket) / (internal ticket)). A compile-time safety net now rewrites unimported hook calls to use the plugin API module. -->
- **AI-Generated Plugins, More Robust** — Plugins generated by the agent no longer crash at load when they reference hooks without importing them. Safety net, installed.

<!-- detail: New shared "Notice" component and decision-card patterns rolled out across Settings. Feedback (info/warning/success) and choice surfaces now share a clearer visual hierarchy and state. -->
- **Settings Polish** — Notices and decision cards across Settings now share a consistent look. Hierarchy, clearer.

<!-- detail: Chief Designer and Design System Reviewer were previously workspace-only skills. They now ship bundled with the app (and as part of the open Rebel skills catalog), so any user can lean on them — and the OSS community can read and improve them. Chief Designer also now actually looks at UI surfaces before judging them, capturing app screenshots as visual evidence before and after visible UI work. -->
- **Chief Designer Now Bundled (and Uses Its Eyes)** — Chief Designer and Design System Reviewer are now bundled skills available to every user (and now part of the open Rebel skills catalog). Chief Designer also actually looks at UI surfaces before judging them now. Revolutionary, we know.

### Fixes

<!-- detail: Set up with Rebel for Salesforce was failing through six progressively-deeper bugs that each round of fixes unmasked: the browser wasn't opening, OAuth wasn't completing, tokens weren't persisting in the right schema, the just-connected account wasn't winning OSS positional indexing, and refresh tokens weren't getting the env vars they needed to auto-refresh. The full chain is now fixed end-to-end — clicking Set up with Rebel actually opens the browser, completes OAuth, persists, and stays connected across refreshes. -->
- **Salesforce: Set up with Rebel Works** — Connecting Salesforce via Set up with Rebel now actually opens the browser, completes OAuth, persists your tokens, and survives token refresh. The fix went six layers deep before it stopped uncovering new bugs. End-to-end, working.

<!-- detail: (internal ticket) / (internal ticket): image attachments were being unconditionally downscaled to 1568px, which destroyed text legibility in screenshots. The pipeline now only downscales when an image exceeds 8000px, with a byte-aware second pass to keep base64 under Anthropic's 5MB per-image ceiling. Screenshots stay readable. -->
- **Screenshots Stay Readable** — Image attachments (especially screenshots) were being downscaled aggressively, smearing the text in them. They're now kept at original resolution unless they exceed sensible limits. Pixels, preserved.

<!-- detail: (internal ticket)/53C: a small number of users were seeing a "stuck install" toast even when the auto-update was actually fine. The bespoke recovery dialog has been replaced with a silent auto-heal that reuses the existing UpdateAvailableToast and emits canary telemetry on genuinely stranded paths. Paired with an install-completion contract: if ShipIt (macOS) or NSIS (Windows) quietly leaves you on the old version, you now get retry / clear-cache / re-download options instead of failing invisibly. -->
- **Auto-Update Self-Heal** — The "stuck install" toast no longer fires on installs that are actually fine. And on the rare occasion an update genuinely silently fails to apply, you now get retry / clear-cache / re-download paths instead of just being mysteriously stranded on the old version.

<!-- detail: (internal ticket) / (internal ticket): Codex users with placeholder Anthropic keys were seeing confusing "Your Anthropic key may be invalid" errors because disconnected Codex silently fell through to Anthropic-direct. Plus: Anthropic-native models (e.g. claude-haiku-4-5) were unconditionally routed through the Codex proxy, which can't serve them. Now: Anthropic-native models go straight to the Anthropic API even when Codex is the active provider; the safety-eval SSE-parsing path that was tripping FAIL_CLOSED is fixed; the live-coach service routes BTS calls through the desktop wrapper so codexConnectivity is hydrated. -->
- **Codex-Routed Conversations, Robust** — ChatGPT-Pro users no longer see baffling "Anthropic key may be invalid" errors when their Codex connection drops, and Anthropic-native helper models now reliably route to the right place even when Codex is your main provider. Provider routing, less confused.

<!-- detail: Behind-the-scenes calls (summaries, titles, bug-report analysis) were not checking apiRateLimitCooldown before making API calls — so when you were already rate-limited, BTS tasks kept hammering the budget. Now they sit out the cooldown like the foreground turn. -->
- **Rate-Limit Cooldown, Respected Everywhere** — When you hit a rate limit, behind-the-scenes tasks (summaries, titles, etc.) now wait out the cooldown alongside the main conversation instead of burning through what little budget remains. Quieter under pressure.

<!-- detail: Some non-Anthropic models (MiniMax M2.7, DeepSeek) embed their thinking inside <think> tags in the response text instead of using the dedicated reasoning_content field. Those tags now get stripped at non-streaming and streaming finalization boundaries so the visible reply is just the answer. -->
- **No More <think> Tags in Replies** — Some non-Anthropic models were leaking their internal thinking (wrapped in <think> tags) directly into your reply. Now stripped before display. The answer, without the soliloquy.

<!-- detail: Mobile meeting recordings were consistently dying about 2-3s after starting, due to two interconnected bugs: a bootstrap race condition and unguarded audio session resets stomping on the recording. Both fixed. -->
- **Mobile Meeting Recordings** — Meeting recordings on mobile were crashing 2-3 seconds after starting. Now they don't. Recording, restored.

<!-- detail: (internal ticket): in plan-mode, the model could synthesize a "Done." summary on a setup turn that hadn't actually run any tools — because the synthesis branch was counting synthetic plan-seed and pre-turn-context events as real execution. Now gated strictly on real executor tools, so plan-mode setup turns no longer falsely claim completion. -->
- **Plan Mode Stops Saying "Done." When It Isn't** — Plan-mode setup turns no longer falsely declare success when no actual work happened. Honesty, restored.

<!-- detail: (internal ticket): automations were showing a generic fallback message instead of the actual output. mergeResultMessage() promotes assistant messages to role:result on turn completion, but the terminal broadcast was filtering only role:assistant — always missing the output. -->
- **Automations Show Their Output** — Automations were dropping their final output and showing a generic fallback message instead. Now you see what they actually did. Results, visible.

<!-- detail: (internal ticket): Windows users with voice-to-text and contribution-store polling running concurrently were hitting aggregate FD exhaustion after about 3.3 hours, breaking voice-to-text and other features. EMFILE resilience added to contributionStore and polling hooks. -->
- **Long Sessions on Windows, Steadier** — Windows users running Rebel for hours with voice-to-text on no longer hit cascading file-handle failures. Voice-to-text, durable.

<!-- detail: simplifyTaskTitle was using stacked regex rules that aggressively stripped verbs, purpose clauses, and conjunctions — turning "Read the full transcript file(s) to understand context" into just "transcript file". Rewritten to preserve meaning so task labels actually describe the task. -->
- **Task Titles That Mean Something** — Task labels in the thinking panel no longer get aggressively stripped down to noun-fragments. "Read the full transcript file(s) to understand context" stays recognisable instead of becoming "transcript file". Meaning, preserved.

<!-- detail: Cloud Fly machine-create image-pull failures used to surface as a generic "temporary provider issue" message regardless of whether the underlying failure was actually transient or permanent. Now: specific error copy for each failure mode, plus a bounded retry that auto-recovers from the transient case. -->
- **Cloud Setup, Smarter Errors** — When your cloud instance fails to come up, the message now tells you what actually went wrong instead of a generic "temporary issue", and the transient cases auto-recover. Less guessing.

<!-- detail: Inline file action menu now opens for Rebel space links (open in app / reveal in finder) instead of the generic text-menu. Conversation file totals also count only completed file operations — failed writes no longer show up as "files Rebel created". Library skill filters preserve metadata-backed skills in search instead of relying on legacy path conventions. -->
- **Library and Conversation Polish** — Rebel-space links open with proper file actions (open / reveal) instead of a text menu, conversation file counts only include actual successful writes, and library search no longer hides skills that don't follow legacy folder naming. Small fit-and-finish across surfaces.

<!-- detail: StagedFilePreviewDialog stays mounted across previews, so isPublishing/isDenying flags from a previous preview could leave Approve/Deny buttons disabled when you opened the next file. Flags now reset on file change. -->
- **Approve/Deny Buttons Stay Live** — When reviewing staged files in sequence, the Approve and Deny buttons no longer get stuck disabled from the previous file. Flags, reset properly.

<!-- detail: (internal ticket): cloud-sync .conflict-cloud files were inflating the semantic index, and Bearer/JWT tokens were leaking into disk logs via ANTHROPIC_CUSTOM_HEADERS. Conflict files now excluded from the index; tokens redacted in logs. -->
- **Cleaner Search Index, Safer Logs** — Cloud-sync conflict files no longer pollute the semantic index, and bearer/JWT tokens no longer leak into disk logs. Tidier and safer.

### Under the Hood

- **Windows: fewer mysterious crashes** — Rebel is more graceful under pressure on Windows now — no more random crashes when the system runs out of file handles. You're welcome.

<!-- detail: Stages 0-5 of the SE-evidence gate plan (default-OFF behind a feature flag). Adds a decision-grammar literal, a Build Context appendix attached to every PR submitted via the contribution flow, identity-verified idempotent retries (so accidental double-clicks don't create duplicates while genuine collisions still surface to the user), a three-axis comparison protocol, and a deterministic eval-result baseline-diff tool. Tightens the contract between the agent's build evidence and the connector contribution that ships. -->
- **Connector Contribution Flow, Tighter** — Behind a feature flag, the contribution-flow that builds and submits new MCP connectors gained a structured Build Context appendix on every PR, identity-verified idempotent retries, and a three-axis eval comparison so we can see regressions before users do. Foundations strengthening before the next visible features land.

<!-- detail: Stage 1 of R1 (typed-phase pipeline refactor of agentTurnExecutor.ts). Ships the typed contracts (4-state TurnPhaseResult, RuntimeContextData split, WatchdogStartDeps 22-callback contract, TurnCleanupKey exhaustive Record), a runPhase wrapper, and a replay harness with monolith-recorded canonical traces (33 of 47 corpus rows shipped). Production code unchanged. Lays the foundation to decompose the 3,480-LOC monolith into 8 typed phase modules with replay parity. -->
- **Agent Turn Pipeline, Being Untangled** — The 3,480-line orchestrator that runs every agent turn is being decomposed into typed phase modules, with a replay harness that pins exact behaviour as we go. No user-visible change yet — just paving the road for safer, faster turn-pipeline work later.

<!-- detail: R4 ProviderRoutePlan migration COMPLETE across the main turn, all three BTS routes, sub-agent/council/ad-hoc routes, and turnErrorRecovery fallback rebuilds. Closed 5-arm RouteRebuildHint discriminated union, ESLint guard against raw new Anthropic(), REBEL_LEGACY_ROUTING kill-switch removed. R6 AutomationSchedule Schedule Algebra refactor also COMPLETE: brand intersection makes invalid states unrepresentable, ~150 literal sites migrated through constructors, fromUntrusted at every untrusted boundary, per-definition migration with quarantine. -->
- **Provider Routing and Automation Schedules, Type-Safe** — Two big internal refactors landed: provider routing now flows through a single typed plan across the entire app, and automation schedules can no longer be in invalid states by construction. Foundations, hardened.

<!-- detail: super-mcp child process now applies gracefulify(fs) at boot, closing a coverage gap in the cross-process EMFILE-cascade fix announced last release. Without this, the desktop's graceful-fs install was invisible to super-mcp's own fs surface (separate Node process). -->
- **EMFILE Resilience, Now in Super-MCP Too** — The graceful file-system retry layer announced last release is now also active in the super-mcp child process. The Windows EMFILE crash class, fully cordoned off.

<!-- detail: Per-beta auto-posted internal changelog: scripts/post-beta-summary.ts now runs after every successful beta deploy and posts a summary to Slack. Includes a structural recursion guard so changelog-only pushes don't trigger a beta build. Doc captures why this artefact is intentionally separate from the user-facing changelog and why fully-unattended-from-day-one was deliberate. -->
- **Internal Beta Changelog Pipeline** — Each beta deploy now auto-posts a per-build summary to the team Slack so we stay in the loop on what users will notice. Internal-only — not what you're reading right now.

---

## v0.4.34 — Apr 23-27, 2026

### Highlights

<!-- detail: New conflict-detection layer in the document editor. When the agent or cloud sync modifies a file you're currently editing, Rebel now surfaces a banner with a state-machine-driven resolution flow (keep yours, take theirs, or merge) instead of silently overwriting one side. Closes a long-tail of "where did my edit go?" reports. -->
- **Document Edits, No Silent Overwrites** — When the agent or cloud sync changes a file while you're editing it, Rebel now shows a banner and lets you choose how to resolve the conflict instead of just letting one side win. Your work, kept.

<!-- detail: Markdown documents now support pasting, dropping, and embedding images directly. Pasted/dropped images get imported as content-addressed assets via the new markdownImageAssets pipeline, so the document keeps a stable reference even if the source file moves. Add, paste, drop, remove — all safe. -->
- **Images in Markdown Documents** — Paste, drop, or embed images directly into markdown docs and Rebel handles the import, storage, and reference cleanly. Less wrestling with file paths.

<!-- detail: The cloud update flow used to hard-timeout at 2 minutes with a generic error. It now streams phase-by-phase progress (deploying, starting, running health checks, verifying) so you can see what's happening — and a slow update doesn't get killed prematurely. -->
- **Cloud Updates, With Progress** — Updating your cloud instance now shows live phase-by-phase progress instead of a 2-minute timeout staring at you. You can see what it's doing.

<!-- detail: The MCP contribution flow now carries structured PR metadata (Summary + Submitter + Why + Validation + Config + Breaking-changes) into GitHub, instead of a default 2-sentence body. Users get a one-click path from the Settings connector card back to the build conversation and a direct View-PR link once submitted. Inline form on the github-check card lets contributors write Summary + Motivation + Notes before submitting. Per user feedback, the pre-submit "One more thing" form was removed from the standard submission path — non-technical users should be able to just ship. -->
- **Contribute a Connector, Properly** — Submitting a community connector now produces a well-formed pull request with a real description, not a two-line stub. One-click links jump you back to the build conversation or straight to the PR on GitHub. Ship first, polish later.

<!-- detail: Apple Shortcuts joins the OSS connector catalog (published at @mindstone-engineering/mcp-server-apple-shortcuts@0.1.0). ProfitSage is now a bundled MCP connector for ProfitSword Data Portal v3 — tenant-parameterised, so any hospitality BI customer enters their own subdomain + service-account credentials. Monologue lands as an official hosted OAuth MCP at api.monologue.to, so you can search and read your voice notes directly from Rebel. Bonus: kebab-case connector display names are now title-cased everywhere (so "apple-shortcuts" renders as "Apple Shortcuts"). -->
- **Three New Connectors** — Apple Shortcuts (community), ProfitSage (hospitality BI), and Monologue (voice notes) all land in the catalog. Options, expanded.

<!-- detail: Adding a custom OAuth MCP via the agent or via a bare URL used to leave users with an unauthenticated server and a misleading "service unavailable" message — because catalog-less MCPs weren't being probed or flagged as oauth:true. Two rounds of fixes: the recovery contract now triggers OAuth for non-catalog MCPs, and URL probe now auto-detects OAuth on the initiation path. Separately: the OAuth callback server now binds on both IPv4 AND IPv6 loopback, closing a silent cross-process hijack where a sibling dev server on the opposite stack received the callback. -->
- **Custom MCPs, Actually Connected** — Adding your own OAuth-based MCP connector now Just Works — whether via the agent, via a bare URL, or via the catalog. OAuth kicks off correctly, and the callback doesn't get hijacked by a sibling process. Integration, no longer a game of chance.

### Improvements

<!-- detail: The PR status toast previously went dead-end when the GitHub refresh-token expired (typically at 8h). Tokens now transparently refresh before expiry; if refresh genuinely fails, the toast surfaces an inline Reconnect GitHub button to re-run the OAuth flow. -->
- **Contribution Auth, Transparent** — Your GitHub contribution session no longer expires silently after 8 hours. Tokens refresh quietly in the background; if re-auth is genuinely needed, a Reconnect button appears right on the toast. One click, back in.

<!-- detail: Help-for-humans documentation refresh aligned with current Settings IA: Safety settings docs now point at the right menu location, legacy Quick Question / On the Case modes replaced with Quality Tier docs, obsolete safety tutorial retired, prompt-injection tutorial refreshed, and BYOK cloud providers narrowed to Fly.io only. -->
- **Help Docs Refresh** — The in-app help that Rebel reads when you ask "how do I..." has been aligned with the current Settings menu, with stale tutorials retired and the Quality Tier docs added. Rebel's self-knowledge, updated.

<!-- detail: Rebel Browser install prompts collapsed from a two-question dance (pick browser, then confirm install) plus a step-0 hard-stop into a single browser-pick question. The install skill also now tells you to click Reload on the extension card if one is already present on the extensions page, because Chromium does not auto-reload unpacked extensions when the on-disk files change. -->
- **Rebel Browser Install, Faster** — Two fewer questions between clicking Install and having a working browser extension. If you're reinstalling into the same folder, Rebel now tells you to hit Reload on the extension card — Chromium doesn't auto-detect file changes on unpacked extensions. Smoother onboarding.

<!-- detail: Browser and Office embedded chats are now scoped by work context (active tab id / document id) and fail closed when the tab can't be verified. Previously a stale embedded conversation could attach to the wrong tab if you switched between tabs mid-stream; legacy panel chats are migrated only when the active tab proves ownership. -->
- **Embedded Chats, Tab-Anchored** — The chat panels in Rebel Browser and Word now stay anchored to the tab or document you started them in, instead of drifting onto whatever's active. Conversations belong where they began.

<!-- detail: Qwen 3.6 35B-A3B added as the top recommended local model. It's a Mixture-of-Experts model with 3B active parameters at any given moment, so it runs fast on 32GB+ machines while rivalling cloud APIs in quality. Available in the local-inference picker. -->
- **New Top Local Model: Qwen 3.6** — Qwen 3.6 35B-A3B (a 3B-active-params MoE) is now the recommended local model for 32GB+ machines. Cloud-tier quality, no API bill.

<!-- detail: Models that can't reliably produce structured JSON output are now detected automatically: a one-shot capability test, a "no JSON" badge in the picker, automatic filtering from JSON-required behind-the-scenes task groups (memory, time-saved, summaries), and runtime fallback to a JSON-capable profile when a non-JSON model is somehow routed there. Pairs with a JSON-safety-net retry for Anthropic models served through OpenRouter (where Haiku 4.5 was returning prose despite output_format being requested). -->
- **JSON Output, Reliably** — Models that can't reliably produce structured JSON are now detected, badged in the picker, and filtered out of the behind-the-scenes tasks that need it. Anthropic models served through OpenRouter also get a retry net when they slip up. Behind-the-scenes tasks, no longer brittle.

<!-- detail: gpt-5.4, gpt-5.4-mini, gpt-5.4-nano, and gpt-5.3-codex (the dedicated coding model) are all back in the model dropdowns. gpt-5.4 sits at half the cost of gpt-5.5 with similar quality on most tasks. The phantom gpt-5.4-codex alias on gpt-5.5 has been removed. -->
- **More Models in the Picker** — gpt-5.4 (half the cost of gpt-5.5) and gpt-5.3-codex (specialised coding model) are back in the model dropdowns. Choices, restored.

<!-- detail: Folder-level "done" controls for grouped agent sessions — folder actions preserve archive intent without forcing the user into another conversation. Plus: Today no longer lets structural cards eat your action slots (it backfills from active inbox work to keep five useful actions visible), and inbox card meta-row alignment got tightened so priority and schedule controls hold position across compact card states. -->
- **Sessions, Inbox, Today — Polish** — Folder-level done controls for grouped sessions; Today keeps five useful actions instead of letting structural cards eat the slots; inbox card layout holds together better. Small fit-and-finish across surfaces.

### Fixes

<!-- detail: Closed a silent routing bug where answering a question in conversation A just after opening conversation B rerouted the answer (and a system-generated continuation turn) into B. AskUserQuestion events now carry an authoritative sessionId so the answer lands in the conversation that asked. -->
- **Answers Go to the Right Conversation** — Answering a question right after you switched conversations no longer sends your answer (and Rebel's follow-up) into the wrong thread. Routing, corrected.

<!-- detail: (internal ticket): user-stopped turns used to silently delete the last assistant narration, leaving the transcript looking empty. They now preserve the narration. Backgrounding the window also now flushes pending state immediately rather than waiting for an idle callback that is OS-throttled while the window is hidden. -->
- **Stopped Turns Stay Visible** — Pressing Stop mid-turn no longer wipes Rebel's partial narration from the transcript. What Rebel already said, stays said. Backgrounding the window also saves state immediately instead of waiting for an OS-throttled idle callback.

<!-- detail: (internal ticket): every AskUserQuestion pause was being classified as "ambiguous" because the user_question hook broadcast directly to windows without going through dispatchAgentEvent, so the turn accumulator never saw the event. Now the accumulator gets the full picture and the pause is classified correctly. -->
- **Clearer Question Handling** — Rebel no longer misreads its own "can you clarify?" pauses as confusion on your end. Classification, fixed.

<!-- detail: Homepage PRApprovedBanner "View connector" CTA used to open Settings → Tools but land on the generic list; now it uses the same pattern as MCPBuildCard's "View in Settings", opening the specific connector section directly. -->
- **View Connector Jumps to the Right Place** — The View connector button on the PR-approved banner now lands on the actual connector section in Settings, not the top of the tools list. One fewer click.

<!-- detail: MCP CTAs were using implicit @SKILL.md execution semantics that some models read as "reference this file" rather than "follow this procedure", which caused the agent to skip the Phase 0 build-vs-buy flow when adding an OSS MCP connector. CTA copy now carries an explicit skill-follow imperative. -->
- **MCP Build Flow, Properly Followed** — When you ask Rebel to add a community MCP connector, it now reliably walks through the full build-vs-buy flow instead of skipping Phase 0. Process, respected.

<!-- detail: Two compounding sidebar bugs fixed. (1) Selecting a conversation no longer reorders the list — the snapshot writeback was downgrading event-stamped updatedAt every time you clicked. (2) Two concurrently-streaming conversations no longer swap positions at ~3Hz when one is focused — that was a cloud-sync round-trip combined with missing updatedAt ratchets. -->
- **Sidebar Calm** — The conversation list no longer reorders every time you click a conversation, and two concurrent streaming conversations no longer swap positions on you mid-stream. The list stays where you left it.

<!-- detail: Cloud-stamped cloudUpdatedAt is now tracked per-session and persisted across app restarts. Previously the in-memory tracker would forget on quit, causing the first outbox push after restart to send a stale baseline that the cloud read as a phantom conflict — surfacing as "Edited elsewhere" badges on conversations only ever touched on this desktop. -->
- **No More Phantom "Edited Elsewhere"** — That badge claiming a conversation was edited from another device when you'd only ever touched it on this one? Gone. Persists across restarts now.

<!-- detail: Compound text-selection regression on chat messages. Two issues: (1) right-click would collapse a fresh selection because the snapshot fallback ran when the live selection was already valid. (2) Mouseup or right-click would destroy the selection because MessageMarkdown was rebuilding its ReactMarkdown components prop on every render, remounting paragraph and anchor subtrees and destroying the live selection's text nodes. The fix stabilises the components prop with useMemo so React-Markdown reuses the same renderer functions across renders ((internal ticket) / (internal ticket)). An earlier fix targeting only right-click was reverted because the deeper component-instability was the real cause. -->
- **Selecting and Right-Clicking Text** — Selecting text in a Rebel reply and then right-clicking — or just letting go of the mouse — no longer wipes your selection. The fix went deeper than the first attempt; this one's the real one.

<!-- detail: (internal ticket): the "agent appears stuck" watchdog only counted input_json_delta as recent activity, so reasoning models (which emit thinking_delta during multi-tens-of-seconds chains of thought) tripped the watchdog and were declared unresponsive. The level-1 capture gate now generalises to all streaming deltas. Third regression in 7 days on this code path. -->
- **Watchdog, Friendly to Reasoning Models** — The "still alive?" watchdog no longer prematurely declares reasoning models stuck just because they're thinking. Multi-tens-of-second reasoning chains now count as activity.

<!-- detail: ~20 core services were hardcoding codexConnected: false in their behind-the-scenes calls, causing CodexDisconnectedBtsError even when ChatGPT Pro was actually connected and working. Now centralised: a single default in the core BTS client picks up the live connection state. Sentry cluster also consolidated with fingerprint + per-session dedupe (16 issues collapsed to 1; 1.2k events / 48h dropped to once-per-session). -->
- **No More False "Codex Disconnected"** — Behind-the-scenes Rebel tasks no longer raise spurious "Codex disconnected" errors when your ChatGPT Pro connection is fine. Centralised default now reads the live state instead of guessing.

<!-- detail: One user with a self-nested workspace produced 100+ Sentry issues ((internal ticket) through (internal ticket)) from listMarkdownFilesRecursively walking forever and hitting ENAMETOOLONG. The plugin file scanner now bounds traversal depth and dedup-checks before recursing. -->
- **Plugins No Longer Crash on Nested Folders** — A self-nested workspace folder no longer makes the plugin file scanner walk forever and crash. Traversal, bounded.

<!-- detail: Spaces use symlinks to draw external folders (e.g. iCloud Drive, Dropbox-mounted folders) into the workspace. The agent's symlink-escape guard was rejecting Read/Write/Edit through Space symlinks because their realpath resolved outside the workspace root — even though Space symlinks are the intended mechanism. The guard now allows operations through configured Space symlinks. The same applies to the rebel-system workspace symlink, so the agent can now read SKILL.md, AGENTS.md, and bundled prompts via the canonical Documents/Rebel/ path. -->
- **Spaces with Symlinked Folders Work** — Reading, writing, or editing files in a Space that's symlinked to an external folder (iCloud Drive, Dropbox, etc.) no longer trips the agent's safety guard. Symlinks, allowed where they should be.

<!-- detail: The behind-the-scenes safety evaluator had no visibility into your message — only the tool name and input — so it would block actions you'd just explicitly asked for (e.g. "install Rebel Browser") under the "uncovered action = block" rule. The evaluator now receives the user message as USER INTENT CONTEXT and reasons accordingly. -->
- **Safety Sees Your Intent** — The behind-the-scenes safety check now sees the message you sent, so it stops blocking actions you explicitly asked Rebel to take. Context, restored.

<!-- detail: Cloud outbox could get stuck on stale auth — (internal ticket) saw 172 events queued across 10 users in 48h. Drain failure metadata is now surfaced so the cloud cooldown trips on auth errors and the user gets a recoverable state instead of silent staleness. -->
- **Cloud Sync, Self-Heals on Auth Expiry** — The cloud sync outbox no longer gets stuck silently when your auth expires; it now flags the failure and trips a cooldown so you can re-auth and resume. Visibility, restored.

<!-- detail: The OpenAI Responses API can return a bare "terminated" status that was falling through to the unknown (non-retryable) classification, killing turns that could have been retried as transient server errors. Now classified correctly. Pairs with a fix where classified follow-on errors can supersede earlier unclassified ones for the same turn — so users see friendly rate-limit copy instead of "Provider returned error" when 429s emit two error events 16ms apart. -->
- **Better Error Recovery** — Some "provider returned error" messages were really transient server hiccups that should have been retried. They now are. Friendlier rate-limit copy also wins out over generic provider errors when they collide. Turns, less likely to die for no reason.

<!-- detail: Document preview focus mode was broken because CSS selectors still referenced the dead .doc-preview class after the DocumentPreviewDrawer → UnifiedDocumentEditor migration. Updated to .library-editor-panel. -->
- **Document Preview Focus Mode Restored** — Focus mode in the document preview pane works again — a CSS class rename had quietly disabled it. Distractions, hideable again.

<!-- detail: rebel_mcp_add_server tool description used to require "explicit user permission", which caused the agent to pause and ask before adding a connector — even though the user had already invoked the build skill. Skill invocation IS consent for the add. Permission gating is now kept on remove/restart/disable only. -->
- **Connector Builds Don't Stop to Ask** — When you ask Rebel to build and add a connector, it no longer pauses mid-flow to ask "shall I add this connector?" Building it IS the consent. Less friction, same safety on remove/disable.

### Under the Hood

<!-- detail: Safety prompt's MANDATORY TRANSPARENCY rule was strengthened to require verbatim identifiers in tool-call summaries. Key-args transparency improved from 20% to 64-80% on Haiku and 27% to 64-73% on Sonnet. -->
- **Safety Transparency Boost** — Tool-call summaries now include the exact identifiers of what Rebel is acting on, so the approval card tells you precisely which file, email, or message is about to move. Safety clarity, tripled.

<!-- detail: 128 KiB per-tool_use streaming byte cap on the Anthropic client. Previously a runaway tool_use block could stream indefinitely ((internal ticket)); now it aborts with a clean tool_input_too_large error and the error-recovery path surfaces mutation-aware guidance warning the user when earlier steps in the turn may have already mutated external state. -->
- **Runaway Tool Calls, Stopped Early** — A runaway tool call can no longer stream forever. It's caught at a 128 KiB threshold with a clear error — and if earlier steps in the turn already did something, Rebel tells you so. Fail-closed, properly.

<!-- detail: super-mcp now exposes a /stats endpoint with per-package lifecycle counters (pid, uptime, start/restart counts, per-child connected state, idle_ms, spawn/reap/eviction counts). Combined with a real pidusage sampler, lastRestartReason threading, and 300ms debounce on OS blur/focus events, the 43 upstream stdio MCP servers are now observable per diagnostic tick. Paired with a new perf-diagnostic playbook (AC1-AC5 acceptance harness) that turns "diagnose CPU" into a 20-minute session recipe. -->
- **MCP Servers, Observable** — The router that fans out to 43 MCP servers is no longer a black box. Connection health, restart reasons, and CPU are all visible per tick. When something goes sideways, triage is measured in minutes now, not hours.

<!-- detail: Stage 1 hardening of the Anthropic per-tool_use streaming byte cap previously announced at 128 KiB. Second-opinion review found the original cap wouldn't actually fire on the (internal ticket) ~117 KiB UTF-8 failure class because it was character-counted, not byte-counted. The cap is now 96 KiB, UTF-8-byte-counted, and stream.abort() is public so the catch path can cancel the in-flight request promptly. -->
- **Runaway Tool Calls, Caught Properly Now** — The stream cap announced last release (128 KiB, character-counted) wouldn't actually catch the bug it was designed to catch. Tightened to 96 KiB, UTF-8 byte-counted. The catch fires when it should.

<!-- detail: Stages 1-5 of a foolproof connector contribution flow redesign. Path-keyed identity replaces session-keyed (closes matrix #5: when an agent built two connectors in one session, only the first got a contribution record). Durable observation pipeline survives restart by writing readiness timestamps + build fingerprints to disk (closes matrix #23: restart-loses-truth eliminated by construction — there's no in-memory truth left to lose). Stuck-registration backstop nudge: post-turn sweep flags records where the agent built+tested but never called rebel_mcp_add_server, and the next agent turn sees a one-line system-reminder pushing it to register. ~560 LOC of legacy in-memory state deleted. 8+ Tier-A eval fixtures pinning matrix #1/#3/#4/#5/#23 strengthened scenarios. -->
- **Contribution Flow, Foolproof** — Building multiple connectors in one session now produces multiple correctly-tracked contribution records (rather than only the first). Restarts no longer lose contribution state. If the agent builds and tests but forgets to register, the next turn nudges it to register. Reliability, by construction.

<!-- detail: super-mcp default tool timeout raised from 5min to 30min for both HTTP and stdio. Aligns upstream tool-call ceilings with Rebel Core's TOOL_CALL_TIMEOUT so long-running tools (deep research, Rebel Browser pair waiting, large data queries, human-in-the-loop flows) aren't killed at 5min by the super-mcp layer before the outer timer fires. Also: super-mcp now propagates inner CallToolResult.isError through the outer envelope, so application-level tool failures are no longer hidden from MCP-spec-compliant clients. -->
- **Long-Running Tools, Tolerated** — The MCP router that routes your tool calls now waits up to 30 minutes by default (was 5), matching the outer ceiling — so deep research, big data pulls, and human-in-the-loop tools don't get killed mid-flight. Tool-failure visibility also improved: inner errors now propagate up through the envelope.

<!-- detail: OpenRouter pricing entries had drifted significantly since 2026-03-25, including a 3x cost-calc miss on openai/gpt-5.5 (still using old GPT-5 pricing). Re-verified all entries against current OR list prices. Catalog now also has minimax/minimax-m2.7 pricing closing a gap where the actively-used BTS default returned null on cost calculation. -->
- **Cost Tracking, Accurate** — OpenRouter pricing was 3x off on gpt-5.5 (still on old GPT-5 numbers). Fully re-verified against current list prices. Cost-per-conversation reports, no longer lying.

---

## v0.4.33 — Apr 21-23, 2026

### Improvements

<!-- detail: OpenAI Image Generation MCP now uses gpt-image-2 (launched 2026-04-21) with count-based batching (1–8 images). The model is noticeably sharper at text — including non-Latin scripts — and generally more faithful to the prompt. Rebel's default remains a conservative single image at `high` quality. Each image in a batch is billed separately; at 1024² high quality, an 8-image batch is roughly $1.68 ($0.211/image). These costs are billed directly to your OpenAI account, not Rebel. -->
- **OpenAI Images, Upgraded** — The OpenAI Image connector now runs on gpt-image-2, which is markedly better at rendering readable text (even in non-Latin scripts) and producing realistic images. You can now request up to 8 images in one call (`count: 1–8`), with each image billed separately; at 1024×1024 on `high`, a batch of 8 can run about $1.68. Default stays conservative: 1 image at `high` unless you ask for more. Options, multiplied.
<!-- detail: Stage 3d of the gpt-image-2 enablement — new edit_image tool hitting /v1/images/edits with up to 4 reference images plus optional PNG mask. Reference images billed at high-fidelity input rate; typical cost $0.25-$0.40 per square edit at high quality. -->
- **Image Editing** — the new `edit_image` tool takes 1-4 reference images (and an optional mask) and redraws them based on your description. Reference images are billed at input rate — a typical edit runs $0.25-$0.40 at high quality. Useful for fixing text, swapping objects, or generating variations. Less painful than redescribing a prompt from scratch.
<!-- detail: Rebel Browser's install flow is now agent-driven. Users open Settings → Connections → Rebel Browser, click Install, pick a Chromium browser, and Rebel handles the rest in chat: prepare files, open the extensions page, mint a fresh pairing code, or approve the connection inline. Supports Chrome, Edge, Brave, Arc, Vivaldi, and Opera. -->
- **Rebel Browser (Early access)** — See what you're looking at. Summarise, save, or act on it. Works in Chrome, Edge, Brave, Arc, Vivaldi, and Opera — yes, all of them. Install from Settings → Connections → Rebel Browser; Rebel walks you through the rest in chat. You pick the browser. Rebel opens the right bits. Civilisation continues.
<!-- detail: Consolidated the Rebel Browser install into a single agent-driven flow backed by a skill file. Removed the REBEL_BROWSER_INSTALL_UI rollback flag, the legacy Settings install UI, the app-bridge:get-install-mode IPC channel, and the 200-line inline prompt — the install protocol now lives in rebel-system/skills/integrations/rebel-browser-install/SKILL.md. -->
- **Rebel Browser install, simplified** — One install flow, always in chat. Two fewer settings menus. No more toggles pretending to be features.
<!-- detail: Direct-provider MCPs (Notion, Linear, GitHub, Fireflies, Stripe, Sentry, and 35 more catalog entries) used to show "Created by Mindstone" in the connection card, which misrepresented the authorship. They now show "Provided by <Name>" to make the actual vendor clear. Mindstone-authored connectors keep their attribution. -->
- **Connector Attribution** — Connectors from Notion, Linear, GitHub, and 38 other vendors no longer claim Mindstone authorship. The expanded connection card now says "Provided by Notion" (or whoever actually built it). Credit where it's due.
<!-- detail: Cloud provider picker had two orphaned tiles where DigitalOcean and Hetzner used to sit (temporarily hidden while fixes land). The empty slots now show a "More soon" signpost so users see progress is afoot rather than a broken grid. -->
- **Cloud Provider Picker** — A small signpost in the cloud provider grid hints at what's coming, instead of leaving empty tiles looking abandoned. The universe, visibly in motion.

### Fixes

<!-- detail: When a safety evaluation failed (LLM error, timeout, etc.), the approval card used to show the raw error message instead of the tool name, leaving users approving unknown actions. Now the card always shows the tool name even when the safety check is unavailable. (internal ticket). -->
- **Safety Approvals Clarity** — When Rebel can't run a safety check on a tool call, the approval card now tells you which tool you're approving instead of just showing the error. Visibility, restored.
<!-- detail: Seven or more concurrent agent turns could flood the behind-the-scenes safety LLM with simultaneous calls, triggering cascading 60s timeouts that blocked unrelated sessions. Added a concurrency semaphore to serialise safety eval calls under load. (internal ticket) / (internal ticket). -->
- **Safety Under Load** — When seven-plus conversations were running at once, safety checks could cascade into timeouts and block everything. Now they queue politely instead of jamming the pipes. The kind of fix you don't notice unless you were hitting it.
<!-- detail: (internal ticket): under long/bloated histories the model could merge content from a retrieved past conversation into the current thread's reply. The softer preamble now explicitly labels each excerpt as a separate past thread while still permitting legitimate cross-conversation reference. -->
- **No Cross-Thread Leaks** — In long conversations, Rebel occasionally mixed in content from other past conversations it had pulled up for context. Each referenced thread is now explicitly labelled as separate, so your current reply stays about your current topic. Boundaries, kept.
<!-- detail: Notifications for shared skills could route to the wrong person because stale responsible-human identity wasn't being cleared when skills changed hands. Fixed. -->
- **Shared Skill Notifications** — Shared skills no longer send notifications to the wrong person when responsibility changes hands. The right message gets to the right human.
<!-- detail: Zero-scope GitHub OAuth tokens caused every scope-gated GitHub tool (search_repositories, issues, PRs, files) to fail with a misleading "Authentication required" error. Now requests repo + read:org scopes and routes through /readonly. -->
- **GitHub Connector** — GitHub tools were silently failing because the connector wasn't asking for the right permissions during OAuth. Search, issues, pull requests, files — all working now. Reconnect if you see "Authentication required".
<!-- detail: Firefox users with ui:// resource URIs (from MCP apps/canvas) saw them handed off to the OS default browser (Firefox), which then tried — and failed — to open them. Now blocks non-http(s) URLs from escaping via setWindowOpenHandler. (internal ticket) / (internal ticket). -->
- **Firefox Link Escape Fix** — Firefox users: Rebel no longer accidentally hands internal app links to your OS default browser when you click a tool output. The links stay inside Rebel where they belong.
<!-- detail: Homepage loading skeleton refreshed to mirror the conversation-first shell with clearer hierarchy and a calmer loading-tip treatment. Transition from startup skeleton to live chat surface also made less jarring (conversation is re-pinned after virtualizer scroll corrections). -->
- **Smoother Startup** — The loading skeleton you see when Rebel is booting now matches the real conversation layout, so the handoff to the live chat feels like a natural settle instead of a jump-cut.

---

## v0.4.32 — Apr 19-21, 2026

### Improvements

<!-- detail: Stage 10-preview of the App Bridge plan. The "Install Rebel Browser" button in Settings → Connectors now seeds a conversation that walks you through the Developer-Mode install (detect browser → extract bundle → reveal folder → open chrome://extensions). The Settings panel also lists installed Chromium browsers (Chrome, Edge, Brave, Arc, Vivaldi, Opera) with per-browser Prepare install buttons. New extension IDs prompt a one-time Approve card (TOFU) before connecting, with a 120s timeout. Planning doc: docs/plans/260419_rebel_browser_install_delight.md. -->
- **Rebel Browser (Early Access)** — Now with a proper install. Click Install Rebel Browser, pick a browser, and Rebel walks you through the Developer-Mode dance — extract, reveal, open the extensions page, flip the switch. First-connect approval is a one-tap card, not a 6-digit code. Early access, because Chrome Web Store review is its own special kind of adventure. See what you're looking at.
<!-- detail: Massive cloud sync reliability overhaul across 4 phases. Phase 1: per-turn idempotency keys + turn_persisted ack eliminate silent dropped/duplicated turns; session tombstones + bidirectional delete propagation kill ghost sessions; server-monotonic cloudUpdatedAt + per-session event seq; per-session async mutex + atomic writes; EventBridge onReconnect + full catch-up fetch; mobile background-drain ack awareness. Phase 2: silent-divergence and race fixes. Phase 3: diagnostics enrichment. Phase 4: long-tail hardening + tombstone-aware catch-up. -->
- **Cloud Sync, Actually Reliable** — Network drops mid-conversation no longer silently lose your messages. Deleted conversations stay deleted. Reconnecting catches up cleanly instead of missing events. Four phases of reliability work, touching every layer from client to server. The kind of infrastructure you shouldn't have to think about. You're welcome.
<!-- detail: Brave Search added as an independent-index MCP connector. When the built-in WebSearch (DuckDuckGo scraper) hits rate limits or Cloudflare CAPTCHAs, users now have a proper fallback via their own Brave Search API key. Also added Smartsheet as a direct HTTP connector with bearer-token auth and US/EU/AU region selection. -->
- **New Connectors** — Brave Search joins the catalog as an independent search engine for when the built-in one gets rate-limited. Smartsheet lands with bearer-token auth and US/EU/AU region support. Options, expanded.
<!-- detail: Users can now add any OpenRouter model via the model quick-add flow, not just the curated catalog. Custom model ID input with a test button that correctly resolves OpenRouter OAuth tokens. -->
- **Any OpenRouter Model** — The model picker now accepts any OpenRouter model ID, not just our curated list. Type it, test it, use it. Choice, unrestricted.
<!-- detail: Focus prep conversations now work for future weeks by changing weekOffset check from === 0 to >= 0 and generalizing prompt text. -->
- **Future Week Prep** — Focus prep conversations now work for upcoming weeks, not just this one. Planning ahead, enabled.
<!-- detail: Connecting a provider now auto-selects it; disconnecting falls back to the next connected provider instead of hardcoding Anthropic. -->
- **Smarter Provider Switching** — Connecting a provider auto-selects it. Disconnecting falls back to whichever provider you still have connected, instead of always defaulting to Anthropic. Defaults, intelligent.
<!-- detail: Mobile Actions card now shows text preview and tag pills for easier triage. Card background tints replaced with a 3px left accent bar (red for urgent, accent for important) for cleaner visual hierarchy. -->
- **Mobile Actions** — Action cards now show text preview and tag pills so you can triage without opening each one. Visual hierarchy via accent bars instead of background tints. Glanceable, finally.

### Fixes

<!-- detail: rateLimitState was never propagated into tool turns, so the honesty-check couldn't distinguish real captcha/block states from first requests. Every WebSearch call was returning the 429 fallback message. Also capped concurrency at 3 to prevent DuckDuckGo IP-level anti-bot tripwire from 10-parallel bursts. -->
- **Web Search** — Rebel was crying wolf on every search, telling you it was "temporarily unavailable" when it wasn't. The rate-limit check was broken — now it only warns when there's actually a problem. Concurrent searches capped at 3 to avoid tripping anti-bot defenses. Honesty, restored.
<!-- detail: 8+ connectors had missing envVar wiring on setupFields, causing API keys entered in Settings to be silently dropped. Fathom, PandaDoc, Mixmax, Humaans, Kling, Runway, QuickBooks, ServiceNow, TalentLMS. IMAP email connectors (iCloud, Yahoo, Custom Email) dropped both email and password credentials. (internal ticket) sweep. -->
- **Connector Credentials** — Eight connectors were silently dropping your API keys after setup. Fathom, PandaDoc, Mixmax, Humaans, Kling, Runway, QuickBooks, and more — all looked "connected" but couldn't actually authenticate. Email connectors lost both email and password. Fixed across the board. Credentials, actually wired.
<!-- detail: Commit 3706d00e hid answer continuations from the LLM during history recovery, causing Rebel to re-ask questions 3-4 times per session when loading from disk. -->
- **Question Amnesia** — Rebel was forgetting your answers when loading old conversations from disk, then asking the same questions again. Three to four times per session. Now your answers survive history recovery. Memory, actually persistent.
<!-- detail: The warm-cache fast path for session switching was landing the scroll position a few lines above the bottom of the conversation. Removed the optimization and route every switch through the primitive. -->
- **Scroll Position** — Re-opening a chat no longer lands you a few lines above the latest message. Small things, done right.
<!-- detail: OpenRouter requests with top-level cache_control were failing when the Anthropic provider was unavailable. The error classifier was false-matching, showing the wrong user-facing message. Now retries without cache_control. Also added fail-closed guard for partial OpenRouter config. -->
- **OpenRouter Reliability** — Fixed a case where OpenRouter requests would fail with the wrong error message when a specific provider wasn't available. Also plugged a gap where partial OpenRouter config could silently fall through to Anthropic authentication. Routes, tightened.
<!-- detail: Nano Banana MCP 0.2.0 imposed a hard 30s request timeout that caused Gemini Pro image generations to abort mid-call. Bumped to 0.3.0. -->
- **Image Generation** — Gemini Pro image generation was aborting mid-creation because of a 30-second timeout that nobody asked for. Fixed. Patience, applied.
<!-- detail: Fly billing + SSO walls on cloud setup now route to specific help instead of generic fallback. -->
- **Cloud Setup Errors** — Setup failures now tell you exactly what went wrong (billing issue, SSO wall) instead of a generic "something went wrong." Guidance, specific.

### Under the Hood

- Continuity: 4-phase infrastructure overhaul — idempotency keys, session tombstones, monotonic timestamps, async mutex, reconnect catch-up, divergence detection, diagnostics enrichment
- Safety: Deterministic code gate for source capture writes; eval prompt strengthened with file-operation, public-audience, and MCP write semantics guidance
- Connectors: ThoughtSpot catalog refreshed to match current vendor API surface
- Super-MCP: Fixed phantom Brave Search references causing agents to report broken installs; workspace path now propagated to all spawned subprocesses
- CI: Android build separated from Play Store submission; TestFlight retry with backoff; Windows browser extension build fix
- Storybook: UI component stories and reporting surface for design-system review
- Mobile: Build number visible in Settings for TestFlight tester verification
- rebel-system: Self-managed cloud (BYOK) Fly.io setup guide; build-custom-mcp-server skill hardened with live-API probes and pre-submit quality checks

---

## v0.4.31 — Apr 18, 2026

### Improvements

<!-- detail: The Rebel Browser Extension — a native Chromium extension (Chrome, Arc, Brave) that pairs with the local App Bridge via a 6-digit code — is now visible to everyone in Settings → Connectors. Pair once, then ask Rebel to read the page, fill a form, or click an element in your active tab. The extension enforces sensitive-field and destructive-click policy at its own boundary, so password/OTP/payment fills and Delete/Pay/Cancel clicks still require explicit per-action approval even if the agent asks otherwise. Stage 9 of the App Bridge plan: the extension ships with Rebel, the bridge runs only while Rebel is running, and the connection never leaves your machine. -->
- **Rebel Browser Extension** — Now visible to everyone, not just the dev build. Pair it to your browser with a 6-digit code and ask Rebel to read, fill, or click in the tab you're looking at. Passwords and Delete-buttons still need your blessing. Revolutionary, we know.
<!-- detail: On iOS/Android, the OS occasionally wakes the app briefly while it's backgrounded. We now use that window to flush queued meeting recording chunks. Restricted to meeting-chunk items only — text messages and voice transcripts still need foreground because they don't yet have server-side idempotency tokens, and we refuse to risk duplicate sends. Bounded to a ~20s budget per wake, 15s per item, with honest handover back to the OS when time runs out. -->
- **Mobile Meeting Catch-Up** — Every so often while backgrounded, Rebel nudges queued meeting recordings to finish uploading — so closing the app mid-meeting doesn't leave chunks marooned on your phone. Idempotent bits only, for now. Patience, automated.
<!-- detail: We previously had a spot where, if a send hit an unexpected error before the first assistant token arrived, the user's typed draft could vanish without a trace. Three send paths (keyboard send, send-and-done, voice transcript) now all snapshot the draft and restore it on pre-ack failure, with attachments intact. Additionally, the connectivity banner now lives inside a silent error boundary — a banner crash can no longer take down the transcript. -->
- **Drafts That Don't Vanish** — If your message hits an error before Rebel starts replying, your text and attachments come back — on every send path. Draft preservation, consistent. Your words, kept.
<!-- detail: Added "Last 24h" filter chip to Settings > Usage alongside the existing 7 / 30 / all views. Uses a rolling 24-hour window (not calendar-day) so the view is always directly comparable. Peak-day and avg-per-active-day stat cards are hidden on 24h (they don't add signal at that resolution); projection and trend comparison (vs the prior 24h) remain visible. -->
- **Usage: Last 24h View** — Settings > Usage now includes a **Last 24h** filter, so recent spend stops hiding inside a 7-day blur. Rolling window, always comparable. Recency, restored.

### Fixes

<!-- detail: The two annotation surfaces (conversation annotations on AI replies, document annotations on markdown files) now share a single formatter in packages/shared/src/annotationUtils.ts with prompt-injection hardening (trusted prologue + nonce-fenced untrusted content + fail-loud collision). The document-annotation clear fires from a per-message onCommit callback on QueuedMessage that runs after processMessage resolves — so comments only clear when the send actually commits, not on click. App.tsx accumulates callbacks per session and drops them on session delete, draft discard, or composer-empty transition. -->
- **Markdown Comments Clear When They Should** — Comments on markdown files now disappear the moment Rebel actually sees them, not the moment you click Send. Change your mind mid-composer? Your comments stay put. Actually hit dispatch? They clear, all at once, right when Rebel reads them. No more ghost comments reanchoring themselves when Rebel edits the file. Commit points, honoured.
<!-- detail: The Add Account button was missing for manual-setup connectors (those using custom setup forms rather than OAuth). The expanded connector card also now scrolls to the setup form when users click Add Account, and the scrollbar flashes briefly to hint that more content is available below. -->
- **Connector Settings** — The "Add account" button is back for connectors that use manual setup forms. Expanding a connector now scrolls you straight to the setup form, with a scrollbar flash so you know there's more below. Buttons, restored.
<!-- detail: The tryGetCalendarTimezone function was rethrowing 403 errors from Microsoft Graph's /me/mailboxSettings endpoint, which crashed the entire listEvents call via Promise.all even when calendarView returned 200 successfully. Now catches 403 gracefully and falls back to the system timezone. -->
- **Microsoft Calendar** — Calendar event listing no longer crashes when Microsoft blocks access to mailbox settings. The timezone lookup now falls back gracefully instead of taking everything down with it. Resilience, improved.

---

## v0.4.30 — Apr 17, 2026

### Fixes

<!-- detail: The bundled fluidaudiocli binary has its model search path hard-coded, but we were downloading the Parakeet V3 model to a different location. This caused the CLI to silently attempt its own 469 MB HuggingFace download on every invocation, timing out every time. Model is now installed at the expected path, and CLI timeout has been bumped. -->
- **Local Voice Transcription** — Local voice transcription was timing out for everyone because the speech model was installed in the wrong place. The bundled CLI kept trying to re-download 469 MB on every use. Now installed where it actually looks. Paths, aligned.
<!-- detail: Behind-the-scenes calls (safety evaluation, principles loading, quips, conversation titles) were failing with 401 for ChatGPT Pro subscribers because they bypassed the local OAuth proxy. These calls now route through the proxy for proper token injection, fixing the approval loop where BTS operations silently failed. -->
- **ChatGPT Pro Background Tasks** — Safety checks, conversation titles, and personality were silently failing for ChatGPT Pro subscribers because behind-the-scenes calls skipped the auth proxy. Now properly routed. Authentication, actually applied.

---

## v0.4.29 — Apr 17, 2026

### Fixes

- **OpenRouter Authentication** — OpenRouter-only users no longer see a false "Rebel needs an Anthropic API key" error. The proxy handles credentials — Rebel just wasn't trusting it. Trust, restored.

---

## v0.4.28 — Apr 15-16, 2026

### Improvements

<!-- detail: Rebel now classifies how each conversation turn ended — completed normally, stopped by you, hit an error, or waiting for your input. Each gets a distinct banner with clear language ("Stopped by you", "Waiting for you") instead of the same amber warning for everything. The Continue button is wired up for turns you can resume. This eliminates the false-alarm warnings that made it look like something went wrong when Rebel was just waiting or you chose to stop. -->
- **Clearer Conversation Status** — Rebel now tells you exactly what happened when it stops: "Stopped by you", "Waiting for you", or a real error. No more alarming warnings for perfectly normal stops. Status, honest.
<!-- detail: Provider selection in both Settings and Onboarding has been redesigned from a stacked radio layout to a horizontal card grid. Each provider (ChatGPT Pro, OpenRouter, Anthropic) gets a branded card with logo, description, and contextual actions. Connecting a provider auto-selects it. API key removal now sticks through auth refresh cycles, and billing errors show specific messages with direct links to your provider's billing page. -->
- **Provider Cards** — Provider selection is now a polished card grid with brand logos and clear actions. Connecting selects. Disconnecting sticks. Billing errors link straight to your provider. Providers, visual.
<!-- detail: You can now start a voice conversation directly from the homepage. The mic button lives in the shared hero input beside send and attachments. -->
- **Homepage Voice** — Start voice conversations directly from the homepage. The mic button sits right where you'd expect it. Talk, immediately.
<!-- detail: Build and submit MCP connectors to the Rebel catalog from within the app. Typed, voice, and annotation requests route into the seeded skill flow. Connector repos are auto-detected at arbitrary paths. Submission shows a loading indicator during the fork/push/PR cycle, and the review card steers contributors through the process with status tracking. -->
- **Connector Contributions** — Build and submit MCP connectors to the Rebel catalog from within the app. Rebel routes your request, detects your repo, handles the GitHub submission, and tracks your contribution. Community, enabled.
<!-- detail: MCP server sidecars now launch on first tool call instead of at startup, with real icons and HTTPS dev certs. Less overhead when you don't need them. -->
- **Lazy MCP Lifecycle** — Tool server sidecars now launch on first use instead of at startup. Less overhead when you don't need them. Resources, conserved.

### Fixes

- **Webflow Reconnected** — Webflow's MCP was pointing at Webflow's unstable beta endpoint, which had started returning "Method not found" to anything you asked it. Now pointing at the stable endpoint, and existing connections get auto-updated on launch — no need to remove and re-add. Beta, no more.
- **Questions on Your Side** — Fixed a duplicated 'you' bubble that was showing raw behind-the-scenes context after you answered a question. Your answer now lives where it belongs — on the right. Revolutionary, we know.
- **Answer, Seen** — Fixed the case where your answer to a question could silently drift out of view while Rebel kept typing. The transcript now nudges itself so you can actually see where your answer landed. You're welcome.
- **Notification Persistence** — Notifications for deleted or renamed skills no longer haunt you after every window focus. Ghosts, exorcised.
- **Meeting Transcript Import** — Staged transcripts no longer permanently block re-import after restart. Recordings, recoverable.
- **Focus Recommendations** — The "generate recommendations" prompt card no longer hides behind stale results in ask mode. Prompts, visible.
- **Homepage First Open** — Recent conversation chips no longer show an empty pane on first open. Patience, rewarded.
- **Provider Switching** — Switching away from ChatGPT Pro now correctly resets to Anthropic defaults. Stale Codex model names auto-repaired on launch. Settings, clean.
- **OpenRouter Thinking Model** — Plan mode routing now works for the thinking model via OpenRouter. Routes, found.
- **Background Tasks** — Background AI tasks no longer break when reasoning models return raw thinking blocks. Normalization, applied.
- **Question Loops** — Rebel no longer gets stuck in a question loop when your task board has incomplete items. Loops, broken.
- **Notification Drawer** — Removed duplicate rounded borders from the embedded drawer. Chrome, streamlined.

### Under the Hood

- Testing: 15 + 71 automated test failures fixed across desktop and mobile; bug reports correctly surface errors during development
- Evals: Safety evaluation suite at 100% (155/155); memory-update A/B prompt experiments (stages 1-3)
- MCP: Tool catalog lookups now use live data instead of potentially stale cached copies
- Mobile: Background recording sessions survive 1-2 hours with AirPods via centralized audio session management
- Safety: Approval re-evaluation handles more tool name formats
- Architecture: Removed brittle regex chat intent router — semantic skill search proven at 100% hit rate
- Cloud: Fixed listener-registration race condition in agent turn websocket handler

---

## v0.4.27 — Apr 13-15, 2026

### Highlights

<!-- detail: Library files can now be shared publicly using the same mechanics as conversation sharing — secure link, optional password, configurable expiry. Markdown files render inline for recipients in the browser; other file types get a clean download page. Shares are live (always the latest cloud-synced version, not a snapshot). Cloud continuity must be active. Moving or renaming a shared file breaks the link — the share dialog warns about this. Password-protected binary downloads use stateless HMAC-signed URLs. 40 new backend tests. -->
- **Share Library Files** — Your files can now go public. Share any library file with a link — add a password if you're feeling protective, set an expiry if you're feeling cautious. Markdown renders inline; everything else downloads. Works just like conversation sharing, because consistency is underrated.
<!-- detail: ChatGPT Pro is now a first-class provider alongside OpenRouter and Anthropic. A new "connect-equals-select" onboarding pattern means connecting a provider automatically selects it and dims the others — no more confusing radio+connect two-step dance. The Codex proxy handles OAuth token injection, streaming, and billing attribution so ChatGPT subscription usage is correctly tracked. Settings mirrors the same tri-state layout. -->
- **ChatGPT Pro Support** — Rebel now treats ChatGPT Pro as a first-class provider. Connect once, and it's selected — no radio buttons, no confusion. Your subscription usage is tracked correctly too. Providers, simplified.

### Improvements

<!-- detail: The thinking panel has been redesigned from stacked progress cards into a single collapsed status bar that expands into a 3-section layout (stages, tasks, tool steps). The unified activity derivation layer consolidates friendly-label logic so all progress surfaces use consistent, human-readable descriptions of what Rebel is doing. -->
- **Smarter Thinking Panel** — The thinking/progress panel is now a compact status bar that expands on demand. Less visual noise, same detail when you want it. Progress, condensed.
<!-- detail: Daily recommendations can now be controlled via a three-way setting: "ask" (shows a prompt card for on-demand generation), "automatic" (runs daily as before), or "off". The prompt card appears in the Focus carousel when no recommendations exist, inviting you to generate on-demand or enable daily runs from Settings > Agents. -->
- **Recommendation Control** — Choose when Rebel generates daily recommendations: on demand, automatically, or never. Your pace, your choice.
<!-- detail: Skipped meetings now stay visible in the Focus tooltip with a strikethrough style and an undo icon, instead of vanishing completely. Skip/unskip actions update the UI immediately without waiting for the next 15-minute calendar sync. Meeting prep paths are also preserved across syncs now — previously, the periodic sync was wiping locally-set prep values. -->
- **Focus Meeting Visibility** — Skipped meetings stay visible with strikethrough instead of vanishing. Undo with one click. Skip and unskip update instantly. Visibility, preserved.
<!-- detail: DeepSeek, MiniMax, and Z.ai/GLM models now route only through US/EU providers (Together, DeepInfra, Fireworks, etc.) via OpenRouter's provider.only constraints. Default OpenRouter models updated to GPT-5.5 (working), Claude Opus 4.6 (thinking), and MiniMax M2.7 (BTS). -->
- **Model Routing Safety** — Chinese-origin AI models now route exclusively through US/EU infrastructure. Default OpenRouter models updated to the latest generation. Routing, intentional.
<!-- detail: Rebel's question cards now support a collapsible "Show details" context field for background information. Dismissed questions no longer reappear when you return to a conversation. Questions stay visible during submission instead of flipping to read-only prematurely. -->
- **Better Question Cards** — Dismissed questions stay dismissed. Detail context is expandable. Cards don't flicker during submission. Questions, polished.

### Fixes

<!-- detail: The prompt cache warmup was broken since the SDK removal (Apr 5) — missing cache_control blocks, omitted tools, flattened system prompt, and wrong API endpoint meant the warmup ran but produced zero actual cache hits. Now fixed, reducing first-response latency again. -->
- **Prompt Cache Fixed** — Cache warmup was silently broken — now actually produces cache hits again. First responses, faster (again).
<!-- detail: Staged file writes now tell the agent "Content staged for review" instead of the previous false "File saved successfully" message. Multiple writes to the same file in the same session accumulate edits instead of failing. Bash cp/cat writes are now inspectable, and the secret gate is skipped for private memory spaces to eliminate false approval prompts. -->
- **Honest Write Staging** — When Rebel stages file changes for your review, it no longer pretends they're already saved. Multiple edits to the same file stack correctly. Truth, restored.
- **OpenRouter OAuth** — Fixed port conflict during authentication. Token no longer gets overwritten during onboarding. Connections, reliable.
<!-- detail: Late-arriving events from previously terminated turns could reactivate the loading spinner on a conversation that had already finished. The single-slot terminal turn guard was replaced with a bounded set that correctly tracks multiple concurrent terminals. The AskUserQuestion continuation also got a belt-and-suspenders fix to prevent stall gaps. -->
- **Conversation Stability** — Late events from old turns no longer reactivate the loading spinner. Concurrent turn tracking is now bounded and correct. State, consistent.
- **Billing Classification** — Anthropic "credit balance too low" errors now correctly show as billing issues instead of generic request errors. Errors, honest.

### Under the Hood

- Performance: Library file loading reduced from 150+ IPC calls to 2 parallel calls; embedding worker idles down saving 1GB+; main process idle CPU dropped from ~26% to ~5%
- Reliability: fireAndForget utility fixes silent promise rejection swallowing across ~22 call sites
- Memory: Tool detail archives capped at 50 entries per session to prevent unbounded growth
- Architecture: jsdom replaced with lightweight linkedom (9.6MB → 200KB); conversation reset authority moved to main process
- Mobile: Two infinite re-render crashes fixed in meeting recording; recording lifecycle lifted to root layout
- Evals: Memory update A/B test framework with 18 fixtures; next-gen scoring with constraints and efficiency tracking
- Profiling: 6 new dev-mode capabilities — bundle analyzer, IPC latency, startup waterfall, renderer CPU profiling, content tracing, perf summary
- MCP: Replit SSH connector (Stage 1) with connection verification and hardened error handling
- Cloud: Silence-boundary STT eliminates mid-sentence cuts; timezone-aware date boundaries via luxon
- Build: Turndown browser build fixes packaged app crash; clean:out step prevents stale output errors

---

## v0.4.26 — Apr 8-10, 2026

### Highlights

<!-- detail: ChatGPT subscription turns were being counted at per-token API rates, creating phantom costs of ~$8.8K. Rebel now correctly identifies subscription usage and shows it as "covered by subscription" in your usage dashboard. A one-time migration retroactively fixes historical entries. The usage page got a full redesign too — a coverage ratio bar shows what percentage of your AI usage is covered by subscriptions vs. paid per-token, with side-by-side breakdown columns. -->
- **Subscription Cost Clarity** — Rebel now correctly distinguishes subscription-covered AI usage from per-token costs. No more phantom charges. A redesigned usage dashboard shows your actual coverage at a glance. Spending, accurate.
<!-- detail: Focus automations now enrich your meeting prep documents with structured goal alignment — classifying each meeting as productive, blocker, noise, or travel relative to your goals. The Time & Goals visualization shows proportional bars mapping your meeting time to each goal at both week and month levels, directly in the goals sidebar. Calendar noise and timezone-only meetings no longer inflate your totals. -->
- **Focus: Goal-Aligned Calendar** — Focus now maps your meetings to goals, showing how your time aligns with priorities. Each meeting is classified — productive, blocker, noise, or travel. Time, intentional.
<!-- detail: Rebel now detects when your timezone differs from your calendar's timezone and exposes this information to the AI. Google Calendar, Microsoft Calendar, and Granola MCPs all received comprehensive timezone hardening — correct formatting, fail-safe write operations, and multi-timezone transparency with source tracking. -->
- **Timezone Intelligence** — Calendar tools now understand and reason about timezone differences between you, your calendar, and your device. Multi-timezone scheduling, reliable.

### Improvements

<!-- detail: The calendar in Focus has been redesigned from a full-width calendar to a compact timeline ribbon, pushing your briefing and goals above the fold. The briefing skills now lead with actionable value rather than raw data dumps, and search for previous briefings to hold you accountable on follow-ups from last week. -->
- **Focus Briefing Evolution** — Redesigned calendar ribbon puts your briefing above the fold. Weekly prep now searches for previous briefings to track follow-ups. Accountability, built in.
- **Prevent Sleep** — New toggle in Settings > Advanced keeps your computer awake during agent turns. No more interrupted tasks. Power, managed.
- **Clearer Model Tiers** — Model quality levels renamed from "Main/Deep reasoning" to "Working/Thinking" for consistency. Labels, aligned.
<!-- detail: When you answered Rebel's structured question cards, there was a 60-90 second gap with no loading indicator. Now a generic turn_started event fires for all server-initiated turns, so you always see the spinner immediately. -->
- **Faster Question Follow-up** — After answering Rebel's questions, you now see a loading indicator immediately instead of waiting in silence. Feedback, instant.
<!-- detail: Log analysis of 37 interactive sessions showed that 70% of automatically-injected past conversations had relevance scores below 0.70, adding ~6,100 characters per turn of marginal context. The threshold was raised from 0.55 to 0.70 to keep only clearly relevant context. -->
- **Smarter Context Loading** — Rebel is more selective about which past conversations it loads as context, reducing noise from low-relevance matches. Context, curated.
- **Actions Rename** — Rebel now uses "Actions" more consistently across the app. Naming, aligned.
<!-- detail: Approval cards now show a "Why?" toggle that explains in Rebel's voice why a particular action needs your permission — even when your safety settings are permissive. This helps you understand the risk without needing to lower your safety settings. -->
- **Why This Needs Approval** — Approval cards now include a "Why?" toggle explaining why Rebel needs your permission. Transparency, surfaced.
<!-- detail: Moonshine is a lightweight, on-device speech-to-text model that runs entirely on your computer. No audio leaves your device, and it works without an internet connection. Available on both desktop and mobile. -->
- **Local Voice Transcription** — Voice transcription can now run entirely on your device using Moonshine — no cloud, no internet required. Privacy, absolute.
<!-- detail: When an authentication token expired mid-turn, it could kill the tool connection and trap Rebel in a retry loop for over an hour with zero useful output. Now Rebel detects the failure, reconnects tools, and resumes — with a circuit breaker that stops retrying if recovery fails. Restart progress is shown so you know what's happening. -->
- **Cloud Reliability** — Rebel now recovers automatically when tool connections drop mid-conversation. No more silent hour-long retry loops. Recovery, automatic.
- **Parallel Tool Progress** — When Rebel uses multiple tools at once, each one now shows its own progress indicator instead of a single generic spinner. Progress, detailed.
- **Approvals Auto-Close** — The approvals drawer closes automatically once you've handled everything. Cleanup, automatic.

### Fixes

- **Scroll Stability** — Messages no longer visually disappear when processing queued responses. Scroll tracking now accounts for message origin. Display, stable.
- **Space Settings Preserved** — Sharing and description settings no longer get wiped when a space's README omits those fields. Settings, durable.
<!-- detail: A safety-net regression could leave conversations appearing "busy" forever when late-arriving events from terminated turns re-activated the loading state. Now uses an allow-list of event types that can trigger busy state, plus a guard that ignores events from already-terminated turns. -->
- **Stuck Conversations** — Conversations no longer get permanently stuck in "busy" state due to late-arriving background events. Flow, unblocked.
- **Retry Budget** — Rebel now stops retrying after 5 minutes during API outages instead of waiting silently for 12+ minutes. Patience, bounded.
- **Approval Messages** — Failed approval actions now show specific error messages instead of generic "something went wrong." Errors, explained.
- **Meeting Controls** — Coach picker and recording controls now disappear when the meeting ends. Controls, contextual.
- **Multi-Provider Routing** — Background planning tasks no longer fail when routed to non-Claude AI providers. Compatibility, broadened.
- **Onboarding Clarity** — API key setup card redesigned with clearer layout and always-visible help text. Setup, simplified.

### Under the Hood

- Comprehensive timezone hardening across all calendar integrations — fail-safe handling and multi-timezone awareness
- Mobile voice improvements for more reliable speech-to-text setup
- Memory diagnostics and GPU performance improvements
- Analytics tracking for Atlas and MindMap features
- Sensitive meeting notes (1:1s, performance reviews) now auto-route to your private space
- Security standards codified across connector development docs
- Smarter tool refresh — Rebel skips redundant re-indexing when your tools haven't changed
- Focus layout redesign: control rail navigation, re-brief button, goal freshness indicators, temporal browsing
- Meeting bot infrastructure cleanup: 3 high-priority bug fixes, centralized parsing, dead code removal

---

## v0.4.25 — Mar 31 – Apr 7, 2026

### Highlights

<!-- detail: A new event series to help you go deeper with Rebel. Weekly sessions covering research synthesis, meeting prep workflows, writing with AI, and more. The in-app banner links directly to the community page with full details and schedule. -->
- **Event Series: What Comes Next** — We're running a new event series to help you work at a different level with Rebel. [Join the conversation](https://rebels.mindstone.com/t/you-ve-started-your-rebel-journey-this-series-is-about-what-comes-next/117). Growth, scheduled.
<!-- detail: Instead of choosing between model names like "Claude 3.5 Sonnet" or "GPT-5.5", you now pick a quality level: Quick, Balanced, Thorough, or Maximum. Rebel maps your choice to the best available model. Power users can still override with specific models in the advanced panel. -->
- **Quality Tier Selector** — Choose Quick, Balanced, Thorough, or Maximum instead of raw model names. Rebel picks the best model for your chosen quality level. Simplicity, leveled up.
<!-- detail: After your computer sleeps or restarts, Rebel used to resume conversations with amnesia — the SDK session was gone but Rebel didn't know. Now it detects high context utilization combined with process death, generates an intelligent summary of your conversation, and injects it so the AI picks up where you left off. Falls back to basic history if summarization fails. -->
- **Sleep/Restart Recovery** — Rebel now detects when your conversation context was lost after sleep or restart and automatically reconstructs it. No more starting over. Continuity, restored.
<!-- detail: Voice transcription errors used to show cryptic technical messages. Now they're classified into 5 categories (temporary glitch, billing issue, auth problem, network error, provider outage) with plain-language explanations. If transcription fails, your recording is saved as a standard WAV file you can play back, retry, or adjust settings from a single popover. -->
- **Voice Error Messages** — When voice transcription fails, Rebel now explains why in plain language and saves your recording. Retry, change settings, or reveal the file — all from one popover. Recordings, never lost.
<!-- detail: Rebel's internal AI engine has been consolidated from two runtime paths (Claude Agent SDK + Rebel Core) down to one. Rebel Core is now the sole runtime — this removes a layer of complexity and means every improvement to Rebel Core benefits everyone immediately. No user action needed. -->
- **Streamlined Engine** — Rebel's AI engine is now a single, unified runtime. One less moving part, more consistent behavior. Architecture, simplified.
<!-- detail: Settings has been reorganized from a flat tab layout into destination-based navigation with an anchor strip that scrolls as you browse. Sections are now standalone components — easier to find what you need, especially in the connections panel which got a full visual refresh. -->
- **Settings Navigation** — Settings now uses destination-based navigation with an anchor strip and refreshed connections panel. Finding what you need, faster.
<!-- detail: For research-heavy tasks that need to scan many documents, Rebel now deploys a lightweight "forager" sub-agent using a fast, cheap model with a tiny prompt (~250 tokens). It returns structured evidence cards with exact quotes and relevance scores, letting the main agent skip irrelevant content. This enables 7-30x cost savings on high-volume reading while maintaining quality through quote-grounded extraction. -->
- **Research Forager** — For heavy research tasks, Rebel deploys a lightweight sub-agent to scan content cheaply and extract relevant quotes. 7–30x lower cost on high-volume reading. Research, efficient.
<!-- detail: Rebel Core's routing, settings, and context management layers are now fully provider-neutral. Sub-agent quality tiers use semantic names (thinking/working/fast) instead of Anthropic model names, and the auth gate admits users with any supported API key — not just Anthropic. If you've configured OpenAI, Google, or other providers, you can now use Rebel Core as your primary runtime. Backward compatible with existing Anthropic-only setups. -->
- **Multi-Provider Support** — Rebel now works natively with OpenAI, Google, and other AI providers — not just Anthropic. Bring your own API key and go. Providers, your choice.
<!-- detail: Five-stage network hardening makes mobile solid on unreliable connections. Text messages queue offline and drain automatically when you reconnect. Your 10 most recent conversations are cached for offline reading. Queued messages show inline indicators with completion toasts. Failed mutations surface clearly so nothing gets silently lost. Orphan recovery on queue init handles edge cases from app crashes. -->
- **Mobile Offline Mode** — Send messages offline and they queue automatically. Your recent conversations are cached for reading without a connection. Reconnect, and everything catches up. Mobile, resilient.

### Improvements

- **Faster Tool Usage** — Rebel now runs multiple tool calls simultaneously instead of one at a time. Tasks that use several tools at once complete noticeably faster. Speed, multiplied.
- **Plugin Creation Fixed** — Creating and managing plugins works again. An internal reference update was missed during a recent migration. Plugins, functional.
- **Smarter Pre-Questions** — Rebel now asks clarifying questions before starting complex tasks instead of blindly executing with assumptions. Context, gathered first.
<!-- detail: Tool suggestions used to be diluted by raw URLs in the search query (e.g., "fetch https://example.com/api/v2/users?page=3"). URLs are now stripped and replaced with service hints before vector search, improving tool matching relevance by 29% on URL-heavy queries with zero regression on clean queries. -->
- **Smarter Tool Search** — Tool suggestions are more accurate when your request includes URLs. Relevance improved by 29%. Tools, found.
- **Prefetch Intelligence** — When Rebel pre-loads documents for your request, it treats them as primary source material instead of background info. Context, promoted.
- **Context Control** — Fine-grained options to exclude specific tools or clear tool inputs from context management. Precision, configurable.
- **Connector Auth Resilience** — OAuth redirect tracking and SSE fallback make connector authentication more robust. Connections, sturdier.
- **Simpler Onboarding** — Streamlined onboarding coach with a cleaner, lighter layout. First steps, simpler.
<!-- detail: When Rebel is 95%+ confident it can answer your question from context it already has, it skips the planning and tool-calling phases entirely and responds directly. Simple factual questions, quick clarifications, and follow-ups get answered faster because Rebel doesn't go through unnecessary setup steps. -->
- **Faster Simple Answers** — Rebel now answers straightforward questions directly instead of going through its full planning phase. Quick questions, quick answers. Latency, cut.
- **Browser Tools Redesign** — Two clearly-differentiated browser tools: Browser Automation for headless tasks and Shared Browser Tab for collaborative browsing. Browsing, organized.
<!-- detail: Conversation compaction — the process that manages your context window when it gets full — can now be toggled on or off in Settings > Advanced. Previously this required setting an environment variable. -->
- **Compaction Toggle** — Context compaction can now be enabled from Settings > Advanced instead of requiring an environment variable. Settings, accessible.
- **Cost Breakdown** — Sub-agent tasks now show per-model cost attribution in Settings > Usage. See exactly which models cost what. Spending, transparent.
- **Mobile First Impression** — Redesigned pairing screen with branded animations and glass-morphism. First launch, dramatic.
<!-- detail: When Rebel needs to ask you multiple related questions, it now queues them as individual cards shown one-by-one instead of asking everything at once. Each card has clickable options. Your answers are collected and sent together in one go, so the conversation flows naturally without round-trip delays. -->
- **Smarter Question Flow** — When Rebel has several questions, they now appear as sequential cards you can answer one-by-one. Faster for you, zero wasted round-trips. Questions, streamlined.
<!-- detail: Rebel's tool discovery flow now uses semantic search as the primary entry point. When the model needs a tool, it searches by intent first, then reads the full schema before calling. Validation errors now include specific fix suggestions (range, pattern, and length constraints) instead of generic "invalid argument" messages. -->
- **Better Tool Discovery** — Rebel finds the right tools faster and gets clearer error messages when something goes wrong. Tool calls, smoother.
- **Dialog Scrolling** — Long dialog content no longer gets clipped at the bottom of your screen. Dialogs scroll properly now. Overflow, handled.

### Fixes

- **Question Card Disappearing** — Inline question cards no longer vanish when you switch away from a conversation while Rebel is working in the background. Questions, persistent.
- **Model Fallback** — When a model isn't available, Rebel automatically retries through an alternative route instead of failing. Resilience, automatic.
- **Library File Access** — Help docs and skills load reliably even when workspace file links are broken. Access, seamless.
- **Onboarding EULA Button** — The "Let's check" button now stays disabled until you accept the EULA. No more silent failures from clicking too early. Patience, enforced.
- **Cursor Export** — Cursor conversation export to Google Drive works again. Exports, exported.
- **Android Keyboard** — Keyboard padding no longer doubles up or gets stuck on Android. Typing, fixed.
- **Token Corruption** — Remaining token stores now clear corrupt data instead of failing silently. Auth, clean.
- **Conversation Hang Prevention** — A 60-second timeout prevents conversations from hanging indefinitely during setup. Ghost session entries are pruned automatically. Startup, bounded.
- **Double Reply** — Rebel no longer accidentally sends two responses when recovering from an empty result. Responses, singular.
- **Empty Result Recovery** — When tools succeed but produce no visible text, Rebel shows a friendly message instead of a generic error. Errors, human.
- **Sleep Detection Speed** — System sleep is detected instantly instead of waiting 30 minutes, so context recovery kicks in faster. Wake-up, swift.
- **Search Index Verification** — Full-text search index creation is now verified after setup. Search, reliable.
- **Community Share Timeout** — Long conversation transcripts (5+ hours) no longer time out when sharing to community. Sharing, patient.
- **Cloud Continuity QR** — Mobile QR code shown by default; web QR hidden behind toggle. Pairing, obvious.
- **Context Overflow Handling** — Rebel now recognizes context-too-long errors from all providers (OpenAI, Google, Anthropic) instead of just one specific pattern. Recovery, universal.
- **Inbox Date Handling** — Inbox items created by Rebel with date fields now work correctly. The AI was sending dates in the wrong format — now auto-corrected. Dates, parsed.
- **Usage Warning Banner** — The Claude usage warning banner was accidentally dropped during a code merge. Restored. Warnings, visible.
- **Background Task Rendering** — Sub-agent activity pills now display correctly even when the start event is missing from the stream. Tasks, visible.
- **Broader Model Reliability** — Background tasks like summaries and recommendations now work more reliably across all AI providers. Background work, steadier.
- **Safer API Key Handling** — Rebel is stricter about cleaning API keys before using them. Quietly safer.
<!-- detail: Stale session identifiers from the old SDK runtime were blocking Rebel Core's history injection mechanism. When continuing an older conversation, the system thought it already had server-side context (it didn't), so it skipped injecting your conversation history — resulting in complete amnesia. 72% of existing sessions had stale IDs. Now cleared automatically on continuation. -->
- **Conversation Amnesia** — Continuing older conversations no longer loses all context. A stale internal reference was blocking history from being loaded — affecting the majority of existing sessions. Memory, restored.
- **Meeting Bot Accuracy** — Rebel no longer shows "Couldn't join" for meetings where the bot is actively recording. Cross-checks before trusting failure status. Status, accurate.
- **Feedback Dialog** — The space bar works again when typing in the feedback textarea. A keyboard handler was accidentally intercepting it. Typing, unblocked.
- **Subagent Routing** — Background tasks routed through custom providers no longer lose their connection settings. Routing, complete.
- **Cross-Session Focus** — Focus context now injects correctly on voice, automation, and queued turns — not just the currently viewed conversation. Context, targeted.
- **Banner Icon** — The event series banner icon no longer wraps to a second line. Layout, tidy.
- **Task Visibility** — Tasks in the progress card now show tooltips with extra detail and expand on click. Blocked tasks explain what they're waiting for. Progress, transparent.

### Under the Hood

- **Session Cleanup** — Temporary data no longer persists to saved conversation files. Storage, tidier.
- **Conversation Stability** — Improvements to how background conversations handle memory management, preventing rare edge cases where context could get mixed up. Reliability, fortified.
- Auto-materialization: large tool outputs (>100K chars) saved to workspace files with preview, reducing context window pressure.
- Sub-agent cost tracking with per-subagent timeout and model override.
- Server-side compaction infrastructure (off by default) preserving artifacts, constraints, and decisions.
- Inbox cache simplification: 4 stages of dead code removal.
- Execa dependency removed; replaced with built-in child_process.
- E2E tests: cross-session compaction contamination, inbox data pipeline, hover reliability.
- Eval infrastructure: dimension collapse (5→3), calibration fixtures, claim audit mutation testing, shared pricing calculator.
- Security: symlink escape hardening for bulk export.
- Summary-driven conversation index backfill replaces bulk session loading (~2000 sessions no longer loaded into memory).
- Engine consolidation complete: final sweep of dual-engine references across the entire codebase.
- Quality evaluation infrastructure ported to a single language for faster iteration.
- Test suite overhauled: faster test runs, better coverage, smarter test organization.
- CI pipeline hardened: 5 detection gaps closed, validation workflow consolidated.
- Internal data contracts tightened to catch schema drift at build time.
- Zero code quality warnings across the entire codebase.
- Core business logic centralized for faster feature delivery across desktop, cloud, and mobile.
- Context management now works with all AI providers, not just one.
- Platform framework updated to latest version.
- 35 behind-the-scenes prompts externalized to editable markdown files for faster iteration.
- Focus strategic planning surface foundations added behind experimental flags.
- CI pipeline hardened after prompt externalization postmortem: global test bootstrap, orphan cleanup, submodule checkout.
- Agent routing contracts made explicit — implicit regex parsing replaced with typed fields.
- Plugin security validator expanded to block additional DOM manipulation methods.
- Watchdog diagnostics improved for debugging silent model stalls.
- Eval infrastructure consolidated: 34 fixtures merged to 25, scoring simplified, MCP coverage checks added.
- TestFlight builds auto-assigned to external beta testers with generated release notes.
- AI workflow tooling: cost analysis lens, adversarial plan challenges for medium-complexity tasks, code health verification.

---

## v0.4.24 — Mar 31, 2026

### Fixes

- **Windows Console Flash** — Terminal windows no longer flash on screen when Rebel starts or launches tools. Invisible, as intended.
- **Long Reasoning Reliability** — Rebel no longer mistakes quiet GPT-5.5 reasoning time for a stalled request and cuts it off early. Patience, learned.
- **Onboarding Terms Check** — The preflight check now waits for terms acceptance before proceeding. No more stuck screens. Progress, unblocked.
- **Plugin Creation** — Creating plugins no longer fails on first attempt after a fresh launch. Cold starts, warmed.
- **Safety Explanations** — When Rebel can't assess a tool action against your safety rules, it now says so clearly instead of raw errors or blank explanations. Transparency, improved.

---

## v0.4.23 — Mar 25-31, 2026

### Highlights

<!-- detail: Skills now track every change with version history, contributor attribution, and safety checkpoints. See who changed what, compare versions side-by-side, fork any version as a new skill, and review shared-skill updates before they apply. All managed automatically in the background. -->
- **Skill Versioning** — Every skill edit is tracked with version history, contributor names, and safety checkpoints. Compare, fork, and review changes before they apply. Collaboration, versioned.
<!-- detail: The onboarding wizard has been redesigned with a frosted glass overlay showing the homepage behind it, a dedicated voice setup step, expanded connector cards with search and curated categories, and smoother transitions. The coach conversation floats over your blurred homepage with a 600ms reveal animation on completion. -->
- **Onboarding Redesign** — Frosted glass overlay, dedicated voice setup, expanded connector cards with search, and smooth reveal animations. First impressions, polished.
<!-- detail: Rebel Core now supports multiple AI providers natively — not just Anthropic. Provider-aware routing, OpenAI client support, neutral message types, and prompt caching for direct Anthropic calls. Still opt-in, with the Anthropic SDK as default. -->
- **Multi-Model Foundation** — Rebel Core now routes to multiple AI providers natively with prompt caching. OpenAI, Gemini, and more — provider-aware routing under the hood. Models, multiplied.
<!-- detail: When Rebel needs clarification, it now presents structured multiple-choice questions inline in the conversation instead of plain text. Pick an option or type your own answer. No more back-and-forth confusion about what's being asked. -->
- **Ask User Questions** — Rebel now asks structured multiple-choice questions inline when it needs clarification. Pick an option or type your own answer. Conversations, streamlined.
<!-- detail: Meeting coaching now triggers at conversationally relevant moments using quality gate scoring instead of binary skip/contribute decisions. Saved transcripts include extracted decisions and open questions sections. LLM-powered transcript cleanup on async upgrade produces cleaner, more useful meeting records. -->
- **Meeting Coaching** — Real-time coaching triggers at the right moments during meetings. Saved transcripts now include extracted decisions and open questions. Meetings, actionable.

### Improvements

<!-- detail: Connect your email accounts via IMAP/SMTP directly in Rebel. Includes presets for iCloud and Yahoo so you can authenticate with a few clicks. Supports reading, searching, and sending email through conversations. -->
- **Email Connector** — Connect iCloud, Yahoo, or any IMAP email account directly. Read, search, and send email from conversations. Inbox, integrated.
- **Company Model Profiles** — Workspace admins can push AI model configurations with role-specific defaults to team members. One-time API key delivery included. Admin control, streamlined.
- **Meeting Understanding** — The meeting bot now builds structured understanding of conversations, feeding richer context into Q&A and post-meeting analysis. Comprehension, deeper.
- **One-off Automations** — Schedule tasks that run once at a specific time, not just recurring. Fire immediately if the scheduled time has already passed. Scheduling, flexible.
- **BulkExport** — New built-in tool for exporting data from your connected tools in bulk. Data, portable.
- **HubSpot Knowledge Base** — Manage HubSpot KB articles directly from conversations — create, read, update, and delete. Support content, connected.
- **Plugin Ecosystem** — Source search, AI helpers, calendar hooks, clipboard access, and a new Sources browser plugin. The plugin API keeps growing. Building, expanded.
- **Multi-Provider Pricing** — Cost tracking now covers OpenAI, Gemini, Cerebras, DeepSeek, and xAI alongside Anthropic. Spending, visible.
- **Model Tiers** — Consolidated tier configuration with per-tier fallback models. Resilience, configured.
- **Multiline Context** — Today and Inbox card context fields now auto-expand for longer notes. Space, adaptive.
- **Calendar Safety** — Rebel asks for explicit consent before creating or modifying calendar events. Calendars, protected.
- **Inbox Deduplication** — Smarter duplicate detection catches near-identical items using keyword matching. Clutter, reduced.
- **Diagnostics Tabs** — New Composition and Narrative tabs with AI-powered analysis for conversation diagnostics. Insight, layered.
- **Provider API Keys** — Opt-in to expose your API keys as environment variables in agent shell sessions. Power users, enabled.
- **Model Selector** — Redesigned conversation model selector with toggle button, tooltips, and polished glassmorphic styling. Controls, refined.
- **Plugin Management** — Archive, fork, copy, and move plugins between spaces. Sources Browser gains context menus and markdown rendering. Organizing, easy.
- **Smarter Related Sources** — Plugin source suggestions now use semantic search instead of participant matching, surfacing genuinely relevant content. Relevance, improved.
- **Sub-agent Tools** — Sub-agents now inherit access to your connected tools, so delegated tasks can use the same integrations. Delegation, empowered.
- **Exec Strategy Coach** — New meeting skill for leadership sessions — Socratic questioning, blind-spot surfacing, and commitment-driving. Decisions, sharpened.
- **Proactive Judgment** — Rebel now suggests better approaches when it sees one, instead of blindly executing. Still respects clear instructions. Intelligence, applied.
<!-- detail: Full-text search now indexes all your messages and the first assistant response per conversation (up to ~12K characters), not just the title and first message. File search returns multiple relevant excerpts per file instead of just one. Similarity thresholds were empirically tuned using data analysis of 600+ real searches. -->
- **Deeper Search** — Conversation search now covers all your messages, not just the first one. File results include multiple relevant excerpts. Discovery, thorough.
<!-- detail: The local speech recognition model (Parakeet) now downloads automatically in the background the first time you launch Rebel on macOS or Windows. An inline progress indicator shows download status in the voice setup step. You can type normally while it downloads — voice activates as soon as the model is ready. -->
- **Voice Auto-Setup** — The local speech recognition model downloads automatically on first desktop launch. Type while it downloads; voice activates when ready. Setup, hands-free.
- **Mobile Missions & Tasks** — Mission cards, task checklists with progress, and sub-agent activity now render on mobile with desktop parity. Mobile, capable.
<!-- detail: When both desktop and cloud edit the same workspace file, Rebel now preserves the cloud copy locally and offers three resolution options: LLM-powered merge that combines both versions intelligently, keep-local to discard cloud changes, or keep-cloud to discard local changes. -->
- **File Conflict Resolution** — When desktop and cloud both edit the same file, Rebel preserves both versions and offers LLM merge, keep-local, or keep-cloud. Sync, sane.
- **Smarter Bug Reports** — Bug report dialog pre-fills reproduction steps and expected behavior from your conversation. Reporting, effortless.
<!-- detail: Meeting notes now work even when your desktop is offline. The cloud service buffers events and replays them when connectivity returns, so you never lose meeting insights due to a flaky connection. -->
- **Offline Meeting Notes** — Meeting notes now work when your desktop is offline. Cloud buffers and replays on reconnect. Coverage, uninterrupted.
- **Actions Empty States** — First-time Actions panel shows helpful CTAs to connect your calendar and email instead of a blank screen. Getting started, guided.
- **Cloud Settings** — Region picker and bug report added to cloud tab. Geography, choosable.
- **API Key Setup** — Simplified copy and full-width input for non-technical users. Setup, friendlier.

### Fixes

- **Search Reliability** — SQL escaping and vector type handling fixes for more consistent workspace search results. Results, trustworthy.
- **Plugin Security Dialog** — Redesigned with plain-language status and trust guidance instead of jargon-heavy scan output. Security, readable.
- **Plugin Deduplication** — Bundled plugins no longer appear twice in the Available from Spaces section. Lists, clean.
- **Sources Search** — Plugin search now works correctly in multi-space workspaces. Paths, resolved.
- **Pending Todos** — Mission-context tasks no longer clutter the "Up next" list. Focus, restored.
- **Hero Cards** — Leading emoji stripped from hero and coach card content. Display, tidy.
- **Navigation Errors** — Error handling and responsive flow panel tabs improved. Navigation, smoother.
- **Onboarding Seeding** — Discovery session ID persisted to prevent duplicate inbox items on re-entry. Duplicates, gone.
- **Meeting Auto-Join** — Meetings starting within 15 minutes were silently skipped. Now uses instant join to close the timing gap. Attendance, reliable.
- **Claude Max Mobile** — Token refresh now wired into behind-the-scenes API calls, preventing 401 errors for mobile users on Claude Max. Sessions, unbroken.
- **MCP App URIs** — Dots now allowed in View URIs, fixing broken preview links for URLs with periods. Links, functional.
- **Context Input Keys** — Space key no longer toggles card expand when you're typing in a context field. Typing, uninterrupted.
- **Find Similar** — The "Find Similar" action was silently doing nothing when clicked. Now works. Discovery, restored.
<!-- detail: OAuth refresh token rotation (RFC 9700) means each refresh token can only be used once. When desktop and cloud share a refresh token, they can race — the second request gets invalid_grant, which previously cleared all tokens. Now both surfaces sync refresh metadata through settings and handle rotation gracefully with retry logic. -->
- **Claude Max Token Race** — Desktop and cloud could invalidate each other's OAuth refresh tokens under concurrent use. Both now coordinate token rotation. Sessions, stable.
- **Session Resume** — Conversations resumed after app restart were silently losing context. The resume ID wasn't being forwarded. Context, preserved.
- **Cloud MCP Servers** — Phone-call, contact-info, deep-research, and other npx-based tools were silently broken on mobile/cloud after migration. Now synced correctly. Tools, restored.
- **Task Display** — Tasks now appear immediately when created, not only after a list refresh. Visibility, instant.
- **Calendar Sync** — The settings toggle and automation state were disconnected — toggling off didn't actually stop syncing. Controls, connected.
- **Settings Crash** — Fixed a startup crash in meeting bot detection. Stability, boring (the good kind).
- **Voice Onboarding** — Fixed tooltip persistence after coach completion, dropdown styling, and voice provider override during setup. Polish, applied.
<!-- detail: The local speech-to-text model download was vulnerable to several failure modes: race conditions between concurrent downloads, inflated progress reporting, no resume on interrupted downloads, ~3000 IPC messages per second flooding the UI, and cryptic Node.js errors. Four phases of hardening: streaming hash verification, stale file cleanup, 250ms IPC throttle with friendly error messages, HTTP Range resume, and ENOSPC/permission early-exit. -->
<!-- detail: Token cost tracking was undercounting by up to 93% because it used SDK per-message usage (which only reflects the last API call in a turn) instead of aggregate model usage. Cache token pass-through and OpenAI cached_tokens extraction were also missing. -->
- **Cost Tracking Fix** — Token costs were undercounted by up to 93%. Now uses aggregate usage data with proper cache token accounting. Spending, truthful.
- **Voice Download Reliability** — Local speech model downloads are now dramatically more reliable. Resume interrupted downloads, friendly error messages, and graceful handling of disk-full scenarios. Downloads, hardened.
- **"Always Allow" Persistence** — Tool permissions set to "always allow" now actually persist. A compound ID format was preventing matches. Permissions, permanent.
- **Ghost Messages** — Messages no longer appear in the wrong conversation when switching sessions quickly. Conversations, clean.
<!-- detail: Context compaction was using the current session ID instead of the turn's own session ID, causing background turns to compact the wrong conversation. This 117-day-old bug could silently corrupt conversation context when multiple sessions were active. -->
- **Background Turn Fix** — A 117-day-old bug was silently corrupting context when background turns ran alongside active conversations. Context, protected.
- **Memory Visibility** — File visibility now uses deterministic path logic instead of LLM inference, preventing incorrect public/private classifications. Privacy, reliable.
- **Canvas Default** — Writing tasks now correctly default to text output instead of Canvas when Canvas isn't needed. Output, appropriate.
- **Extended Context Recovery** — The 1M context window re-enables correctly after resolving API key issues. Limits, restored.
- **Auth Error Banners** — Error banners for auth and billing issues now include an "Open Settings" shortcut. Errors, actionable.
- **Spark OAuth** — OAuth users were incorrectly blocked from Spark features. Authentication, inclusive.
- **Inbox Priority** — Priority now ranks ahead of draft readiness; meeting prep items expire after 4 hours instead of 72. Focus, sharpened.
- **Resume All** — Duplicate submissions prevented when resuming multiple conversations. Resumption, orderly.
- **Onboarding Coach** — Calendar event creation removed from onboarding to prevent unwanted calendar entries. Onboarding, respectful.
- **Meeting Sharing** — Meetings default to private when space configuration doesn't specify. Privacy, cautious.

### Under the Hood

- Portable path migration: cross-platform path utility replaces inline string replacements across the codebase.
- Super-MCP: StreamableHTTP transport fixes, per-session architecture for concurrent clients, truncation continuation.
- Performance: idle RAM reduction via lazy session loading, settings write-on-read fix, token cost reduction, renderer leak diagnostics.
- 43 dead files deleted; logger syntax and type safety improvements.
- System prompt reduced by 35% for faster first responses.
- Anti-hallucination guidance strengthened with Anthropic best practices.
- Eval coverage: narration and onboarding coach eval harnesses added.
- Android builds now submit to Google Play alongside iOS TestFlight.
- Agent turn executor: 943 lines extracted into 4 focused modules (17% reduction), 4 bugs fixed, 20 new tests.
- IPC bridge replaced with pure-type runtime builder — eliminates code generation step.
- 10 circular dependency cycles broken (17→8).
- TypeScript errors reduced 96% (Node 1889→75); all implicit-any errors eliminated.
- Super-MCP: API redesign with tool detail levels, get_tool_details meta-tool, BM25 multi-field weighting (+5.4% search relevance).
- Reproducible eval infrastructure with email twin dataset for hermetic testing.
- Performance regression test infrastructure with Playwright integration.
- CI: dev-push checks workflow, E2E and perf tests re-enabled on macOS.
- framer-motion upgraded to motion 12.38.0; lucide-react pinned at 0.563.0 (v1.x removed brand icons).
- ~2,100 lines of duplicated business logic centralized across desktop, cloud, and mobile.
- Agent turn: unified SDK query replaces 8 copy-pasted iteration loops; error recovery catch block 1,600→38 lines.
- MCP twin server for fully reproducible eval tool calls with shared Acme Corp corpus.
- 164 new tests; 15 pre-existing failures fixed; Fuse.js behavioral contract tests.
- Vitest migrated to workspace projects API with 4 named projects.
- Sentry redaction gap closed for provider API keys.
- Session log retention bounded by age, count, and size (was 6,150 files / 1.6 GB growing unbounded).
- electron-log consolidated to Pino-only logging for auto-updater.
- Super-MCP: TS 5.x compatibility fix for Docker builds.
- Source Capture moved to Sonnet for cost optimization.
- Default max output increased to 100k chars; effort level now configurable per session.
- Plugin runtime hardened with compile-time key warnings, crash store, and sourceURL diagnostics.
- Prompt cache breakpoints added for sub-agent invocations.
- Local STT download: 11 unit tests covering IPC throttle, friendly errors, and progress behavior.
- Safety: BareToolId branded type, canonical tool identity contracts, cross-boundary contract principles.
- Sessions: narration leak filter, question/approval cleanup on reset, conversation index search_text column.
- Compaction: 14 regression tests; 3 postmortems (ghost message, OpenAI cache tokens, compaction contamination).
- Headless turn runner extracted from main index.ts.
- Evals: shared fixture corpus, cross-channel fixtures, Opus SDK rerun.
- Memory visibility: 8 regression tests; visibility field removed from LLM JSON schema (token savings).
- Meeting analysis prompt extracted to core (160-line dedup across desktop and cloud).
- super-mcp: input normalization for upstream Claude model string serialization bug.
- Analytics: desktop notification prompt lifecycle tracking; renderer observability integration.
- rebel-system: SHOWRUNNER knowledge work orchestration workflow.

---

## v0.4.22 — Mar 23-25, 2026

### Highlights

<!-- detail: Plugins can now live in your Space and sync to your team. Browse, enable, and disable shared plugins from Settings. Includes conflict resolution, security review before activation, hot-reload, and semantic indexing of plugin documentation. Build once, share everywhere. -->
- **Plugin Sharing** — Plugins now live in Spaces. Share them with your team, browse and enable from Settings, and resolve sync conflicts automatically. Collaboration, plugged in.
<!-- detail: Rebel now uses LanceDB native hybrid search instead of in-memory BM25 for workspace search. This means faster results, better relevance ranking combining keyword and semantic matching, and support for larger workspaces without memory pressure. -->
- **Smarter Search** — Workspace search upgraded to hybrid search combining keywords and meaning. Faster, more relevant, and scales to larger workspaces. Discovery, levelled up.
<!-- detail: The approval flow is now a single "Allow" button with inline scope options instead of multiple buttons. The nudge toast is redesigned as an indigo frosted glass pill. Approval reasons and scope options use plain language instead of technical jargon. -->
- **Streamlined Approvals** — One "Allow" button with inline scope options replaces the old multi-button flow. Cleaner toast design, plain language explanations. Permission, simplified.

### Improvements

- **Model Switcher** — New popover shows all three model roles (working, thinking, background) at a glance. Control, visible.
- **Inbox Scheduling** — Schedule items between time groups with dropdown, selection bar, or keyboard shortcut (S). Batch-schedule and undo included. Planning, flexible.
- **Today Card Actions** — Inline done, archive, and delete actions on homepage cards. Auto-done toggle for items you've already handled. Triage, faster.
- **Plugin Ecosystem** — View source, fork, export/import plugins as files, per-plugin storage, and workspace search from within plugins. Building, empowered.
- **Admin Tool Control** — Workspace admins can disable specific connector tools. Disabled tools are hard-blocked without triggering approval prompts. Governance, built in.
- **JSON Rendering** — JSON code blocks now display as clean, human-readable documents instead of raw code. Data, readable.
- **Diagnostics Panel** — Full-width conversation diagnostics for troubleshooting. Visibility, expanded.
- **Cost Tracking** — Usage tab now shows ledger-sourced data with billing gap fixes for accurate spend tracking. Accounting, precise.
- **Tool Discovery** — Connector catalog now shows tool manifests before you connect. Preview what you're getting. Shopping, informed.
- **Team Knowledge** — Answers now show which shared files were consulted during a turn. Attribution, transparent.
- **Local Voice Default** — Local speech-to-text (Parakeet) is now the default on desktop. Privacy, prioritized.

### Fixes

- **Voice Errors** — Transcription errors now show what actually went wrong, and failed recordings can be retried. Recovery, possible.
- **Session Timer** — Stale interrupted turns no longer leave a stuck timer display. Clutter, cleared.
- **Video Flicker** — Conversations with many video links no longer cause player flicker. Playback, stable.
- **Turn Visibility** — Turns with tool activity but no text are no longer invisible. Progress, visible.
- **Invisible Progress** — Stale active turn IDs no longer hide turn progress. Status, accurate.
- **HubSpot OAuth** — Auto-complete token exchange now wired correctly. Connections, completed.
- **Zapier Timeout** — OAuth timeout resolved by switching to user-provided URL. Integrations, patient.
- **Windows Onboarding** — UX deadlock when Controlled Folder Access blocks workspace creation now resolved. Setup, unblocked.
- **Cloud Stability** — Managed cloud provisioning, switching, and deprovisioning hardened. Infrastructure, resilient.
- **Approval Cards** — Show clear action descriptions instead of content summaries. Truncated descriptions expand on click. Clarity, restored.
- **Auto-Scroll** — Deferred when session surface is hidden to prevent jumping. Scroll, respectful.
- **Meeting Handoff** — Desktop SDK can now override stale cloud bot on meeting switch. Transitions, smooth.

### Under the Hood

- Agent loop decoupled from Anthropic SDK via ModelClient interface; token limits now settings-driven.
- Completion verification with task-board stop hook and done_criteria seeding.
- Legacy safety evaluation functions removed; transcript guard migrated to Safety Prompt.
- Eval system: single `npm run eval` wizard, parallel execution, engine comparison matrix.
- 11 unused dependencies and 8 dead files removed; 48 TypeScript errors fixed.
- Performance: batch skill backfill, session coaching scheduler fix, renderer memory leak fix.

---

## v0.4.21 — Mar 20-23, 2026

### Highlights

<!-- detail: Record voice notes without starting a conversation. Tap the Quick Capture button, speak, and the transcript is stored in your context automatically. Works on desktop and mobile. -->
- **Quick Capture** — Record voice notes on the fly — no conversation needed. Audio transcripts feed into your context automatically. Voice, untethered.
<!-- detail: Mindstone Cloud provides managed cloud infrastructure for Rebel. One-click provisioning with seamless switching between your own API keys (BYOK) and managed service. Includes always-on instances and in-progress turn protection. -->
- **Mindstone Cloud** — Managed cloud provisioning for turnkey Rebel deployment. Switch seamlessly between your own API keys and managed service. Infrastructure, handled.
<!-- detail: A full Interactive Brokers integration with 31 MCP tools covering portfolio management, order placement, market data, account info, and more. Configure your IB Gateway credentials in Settings and query positions, place trades, or pull market data from conversations. -->
- **Interactive Brokers** — New connector with 31 tools for portfolio management, trading, and market data. Finance, connected.

### Improvements

- **iOS Voice Widget** — Start voice recording from your iPhone home screen. One tap, talking.
- **Claude Max Polish** — Token refresh, validation, and encrypted storage. Onboarding flow improved for first-time users. Auth, hardened.
- **Smarter Hero Choice** — Homepage suggestions now use a thinking model with dynamic context budget. Recommendations, sharper.
- **Carousel Polish** — Coach/hero carousel refined with accent colors, navigation dots, and smoother animations. Homepage, prettier.
- **Provider Switching** — Seamlessly switch between BYOK and managed cloud providers. Flexibility, built in.
- **Gmail Drafts** — HTML vs plain-text guidance now included in draft tool descriptions. Formatting, intentional.
- **Omni Analytics** — New connector for Omni analytics platform.
- **Daily Briefing** — Renamed labels to resolve naming ambiguity. Clarity, achieved.

### Fixes

- **Voice Popover** — Fixed invisible pending audio popover caused by Tooltip ref conflict. Visibility, restored.
- **Settings Deep-Links** — rebel://settings/connectors navigation works again. Links, functional.
- **Spawn Errors** — EBADF, ENOENT, and EACCES errors now show friendly, actionable messages instead of cryptic codes. Errors, human.
- **HubSpot Routing** — Lead/deal negative disambiguation prevents the agent from misrouting requests. Accuracy, improved.
- **Cloud Sync** — Session sync responses unwrapped correctly; stale inbox entries reconciled; desktop history syncs to cloud. Sync, trustworthy.
- **Meeting Bot** — Active bot matching works when Teams URL unavailable; companion context wired into coaching turns. Meetings, reliable.
- **Session Integrity** — Background flush no longer strips assistant messages. Messages, preserved.
- **MCP Matching** — Connector catalog matches entries with common naming suffixes and prefixes. Discovery, flexible.
- **Workspace Attachments** — Local storage checked before Gmail API when downloading workspace attachments. Downloads, faster.
- **Cloud Stability** — Fly.io can no longer kill in-progress agent turns; existing instances normalized to always-on. Uptime, protected.

### Under the Hood

- Rebel Core planning mode with in-memory task store and task/todo builtin tools.
- Eval system rearchitected: workspace eval with 10-dimension rubric, multi-provider agent support, engine comparison.
- CI improvements: split smoke tests into baseline+regression phases, decoupled Slack notifications from release builds.
- super-mcp: removed tool description truncation for better discoverability.

---

## v0.4.20 — Mar 18-20, 2026

### Highlights

<!-- detail: Connect your Claude Max subscription directly — no API key needed. Rebel walks you through a two-phase OAuth flow during onboarding or from Settings. If you hit rate limits without a fallback API key, a clear banner explains your options. Works on macOS, Windows, and Linux. -->
- **Claude Max Support** — Use your Claude Max subscription directly with Rebel. OAuth setup in onboarding and Settings, with helpful rate-limit guidance when you need it. Subscription, connected.
<!-- detail: The meeting bot now contributes to your meetings in real time. It listens, processes context, and offers relevant input with adaptive frequency — contributing more during pauses and yielding when you're speaking. Live captions show what it's hearing and thinking. -->
- **Meeting Participation** — The meeting bot can now actively participate: live captions, adaptive contribution frequency, and automatic yielding when you're speaking. Your AI colleague, present.
<!-- detail: Rebel sends native OS notifications when a turn finishes while you're in another app. Enable in Settings → Notifications, or accept the opt-in prompt. Each notification links back to the conversation that completed. -->
- **Desktop Notifications** — Get notified when Rebel finishes working while you're in another app. Opt in from Settings. Multitasking, informed.

### Improvements

- **Coach Carousel** — Hero card now lives inside the coach carousel on the homepage. Guidance, consolidated.
- **Local Speech-to-Text** — No longer experimental. Available in onboarding for new users. Dictation, official.
- **Full-Width Conversations** — Toggle from the actions menu to expand conversations edge-to-edge. Space, reclaimed.
- **Paste Meeting Links** — Paste any meeting URL to schedule a notetaker instantly. No calendar sync required. Notetaking, link-driven.
- **Smart MCP** — Rebel suppresses built-in tools when a connected integration provides better versions. Less clutter, better results.
- **AppSignal Connector** — New integration for AppSignal monitoring.
- **Migration Guide** — New help doc for moving Rebel to a new computer.

### Fixes

- **Conversation Persistence** — Fixed false conversation reset after app restart. Your context, preserved.
- **Zero-Param Tools** — Agent no longer invents parameters for tools that take none. Precision, restored.
- **Toggle Switches** — Light mode toggles now show colored tracks when active. Visibility, corrected.
- **Auto-Scroll** — Fixed for completed sessions. Scrolling, dependable.
- **Approval Visibility** — Indicators more prominent; truncated descriptions expand on click; drawer auto-closes when resolved. Clarity, improved.
- **Onboarding Polish** — Calendar event permission asked first; voice button guarded without API key; coach session resumes reliably. First run, smoother.
- **Cloud Resilience** — Self-healing with circuit breaker; restart progress shown; stale sessions reconciled. Uptime, guarded.
- **Inbox Navigation** — No more blank screen when navigating to an already-open conversation. Navigation, reliable.
- **Context Compaction** — Non-Claude overflow errors handled correctly during context compaction. Models, better supported.
- **Consistent Sort** — Conversations sort the same across desktop, mobile, and web. Order, unified.

### Under the Hood

- Native agent runtime with sub-agent spawning and multi-model proxy (flag-gated).
- Auth method tracking in cost ledger and analytics.
- Public channel safety eval harness with 43 fixtures.
- CI spend reduction with opt-in beta deploys.

---

## v0.4.19 — Mar 17-18, 2026

### Improvements

- **Web Feature Parity** — Today cards, tool activity, approvals, inbox grouping, and connectivity banners now work on web and mobile. Same Rebel, every surface.
- **Smarter Hero Choice** — Homepage suggestions now prioritize by impact, not just deadlines. Expired meeting prep auto-dismisses so you see what matters. Priorities, recalibrated.
- **Richer Approval Notifications** — Staged file approvals now show file names and details in the notification drawer. Context, included.
- **Spaces & Teams** — Space creation gated behind Teams license; cloud-linked spaces show clear read-only guidance. Boundaries, enforced.
- **Settings Polish** — Design tokens and layout consistency across all settings tabs. Accordion providers and tooltips in AI & Models. Cohesion, achieved.
- **Windows Speech-to-Text** — Local STT on Windows now loads native modules correctly with async decoding. Dictation, unblocked.

### Fixes

- **Overloaded Errors** — 529 "overloaded" responses now show a friendly message instead of raw SDK text. Errors, humane.
- **Stop on Cloud/Mobile** — Force-kill escalation added to cloud service with mobile re-stop retry. Stopping, everywhere.
- **Inbox Sync** — Full-field reconciliation across desktop, cloud, and mobile. Archived state, index divergence, and count mismatches resolved. Sync, trustworthy.
- **Proxy Resilience** — Upstream timeout raised to 30s with circuit breaker and streaming chunk timeouts. Connections, hardened.
- **Auto-Scroll** — Scroll stays paused while the annotation popover is open. Reading, uninterrupted.
- **Safety Eval** — Bash memory writes evaluated via Safety Prompt instead of blanket cautious override. Structured output preferred over text parsing. Precision, improved.
- **Sidebar Spinners** — Stale loading indicators on stuck conversations now clear automatically. Spinners, finite.
- **Settings Navigation** — Race condition in toast-to-settings navigation fixed; email setter added for connector accounts. Navigation, reliable.

### Under the Hood

- Dynamic commit-driven regression testing for UI smoke tests in CI.
- Context window handling cleanup; deprecated 1M context beta header removed.
- Runtime contract tests for SDK replacement safety net.
- Toast notification instrumentation via Sentry.

---

## v0.4.18 — Mar 13-17, 2026

### Highlights

<!-- detail: The entire approval UI was rebuilt from the ground up. A notification drawer replaces floating cards and the old sidebar, grouping pending approvals by conversation so you can review everything in one place. Approval cards now show safety rule options — set "always allow" or "always deny" right from the card instead of hunting through settings. A persistent toast badge tells you when approvals are waiting, and compact receipt bubbles replace the verbose post-approval messages that used to clutter your transcript. 3,055 lines of old approval code were removed. -->
- **Approvals, Redesigned** — The approval experience has been completely rebuilt. A notification drawer groups pending approvals by conversation, cards let you set safety rules on the spot, a persistent badge keeps you informed, and compact receipts replace the verbose clutter after you approve. 3,055 lines of old UI code, gone.
<!-- detail: Share any conversation with a secure URL. Set a password, control expiry, and share read-only views with colleagues. Rate-limited to prevent abuse. Recipients see a clean web page with the full conversation — no app required. -->
- **Share Conversations** — Generate a secure link to share any conversation with anyone. Password protection, expiry, and rate limiting built in. Collaboration, unlocked.
<!-- detail: Connect your ChatGPT/OpenAI account via OAuth — no API key needed. Works across model profiles, Council Mode, and behind-the-scenes tasks. Uses the same OAuth flow as the Codex CLI. -->
- **ChatGPT Login** — Connect your OpenAI account via OAuth instead of pasting API keys. One click, all models.
<!-- detail: Bring your own voice. Configure custom STT (speech-to-text) and TTS (text-to-speech) providers using any OpenAI-compatible endpoint. Point Rebel at your preferred transcription or voice synthesis service with a URL and API key. -->
- **Custom Voice** — Bring your own speech-to-text and text-to-speech providers. Any OpenAI-compatible endpoint, your voice setup.

### Improvements

- **Hero Choice** — The homepage now suggests what to work on next based on your calendar, inbox, and recent context. Guidance, proactive.
- **Per-Automation Models** — Choose different AI models for each automation. See cost breakdowns per automation in the Usage tab. Control, granular.
<!-- detail: Rebel can adjust its own accent color, font scale, information density, and content width via MCP tools. Ask it to "make everything more compact" or "use a blue accent" and it will update your UI preferences directly. -->
- **UI Personalization** — Ask Rebel to adjust accent color, font size, density, or content width. Customization, conversational.
- **Calendar Nudges** — Proactive prompts before meetings with deep-links to relevant use cases. Preparation, automatic.
- **Search Depth** — Deep search now scans up to 200 results sorted by relevance, with tooltips explaining result sections. Discovery, deeper.
- **Morning Triage** — Automated daily scan surfaces actionable emails and meetings as inbox items at 07:30. Your day, organized.
- **Inbox Intelligence** — Linear, GitHub, and Asana references; meeting-time surfacing; email resolution checks on open. Context, richer.
- **In-Conversation Voice** — Toggle voice recording mid-conversation without starting a new session. Dictation, seamless.
- **Model Profile Testing** — Test button verifies your model profile connections work before you rely on them. Confidence, upfront.
- **Conversation Attachments** — The agent can now reference all attached files in follow-up tool calls. Files, accessible.
- **HEIC/HEIF Photos** — Attach photos from your phone — HEIC/HEIF images auto-convert to JPEG. Formats, handled.
- **Privacy & Data Settings** — New Safety tab section for privacy and data management preferences. Controls, visible.
- **Feedback Link** — Type rebel://feedback in chat to open the bug report dialog. Reporting, instant.
- **MCP Error Messages** — Clear, actionable errors when desktop-app connectors aren't running. Diagnosis, faster.

### Fixes

- **Approval Rules** — Safety and memory rules now properly save your preferences. Automations run without repeated permission prompts, and memory saves what you want on the first ask. Rules, honoured.
- **Approval Routing** — Background approvals now route back to the conversation that requested them, not whatever session you happen to be looking at. Continuations, accurate.
- **Stop Button** — Stop now works immediately. AbortController wired to the SDK with force-kill escalation; auto-continue respects your stop. Stopping, reliable.
- **Watchdog** — Subagent turns no longer trigger false stall warnings. Phase inference uses tool lifecycle state instead of impossible message types. Patience, calibrated.
- **OpenAI Reasoning** — Reasoning models with tools now route correctly via the /v1/responses endpoint. Models, compatible.
- **Slack DMs** — Recipient verification prevents sending messages to the wrong person. Safety, social.
- **Meeting Bots** — Pre-scheduled bots activate reliably; duplicate bots from overnight scheduling prevented. Meetings, one bot each.
- **Calendar Sync** — LLM sync guard restored, shared/community events excluded, Microsoft Graph 401 retried automatically. Calendar, accurate.
- **Text Selection** — Fixed infinite render loop in text selection menu and file tree stack overflow. Stability, restored.
- **Auth Fixes** — Custom provider profiles recognized; stale GitHub and Codex OAuth tokens refreshed. Logins, resilient.
- **Cloud Sync** — Concurrent turn data preserved; shaky network resilience improved; desktop no longer overwrites cloud turns. Continuity, protected.
- **Inbox Timing** — Premature archiving prevented with grace periods; items surface in Today when meetings are happening. Timing, respected.
- **Automations** — Local fallback when cloud is unavailable; headless sessions get proper terminal events. Automations, reliable.

### Under the Hood

- Approval system rebuilt: notification drawer, ApprovalPointerBar, safety rule cards, receipt bubbles — 3,055 LOC of old PendingReviewBar removed.
- Cloud self-update scheduler replaces manual Fly deployments.
- Mindstone Managed cloud provider with DigitalOcean OAuth provisioning.
- Mobile overhaul: voice mode, Today cards, inbox redesign, tool images, push notifications, delta sync.
- Conversation search eval harness with 28 quality fixtures.
- STT cost tracking and per-model analytics on PostHog events.
- OAuth flow telemetry instrumented.
- Cloud BYOK verification, repair, and diagnostics.
- BTS reasoning-aware token budgets for profile models.
- rebel-system: morning triage automation, source capture, git-hide-frontmatter skill, feedback links.
- super-mcp: actionable localhost connector errors, auth force-refresh fix.

---

## v0.4.17 — Mar 9-13, 2026

### Highlights

<!-- detail: The floating approval cards have been replaced with a dedicated sidebar drawer. All pending tool approvals are listed in a scannable panel that stays out of your way until you need it. Click the notification badge to open, review, and approve or dismiss in bulk. -->
- **Approval Sidebar** — Tool approvals now live in a dedicated sidebar drawer instead of floating cards. Cleaner, scannable, always accessible. Approvals, organized.
<!-- detail: PandaDoc integration brings document upload, template creation, e-signature workflows, and PDF download directly into your conversations. Create contracts, send for signing, and track status without leaving Rebel. -->
- **PandaDoc** — Create, send, and sign documents directly from Rebel. Upload templates, manage e-signatures, download completed docs. Paperwork, delegated.
<!-- detail: Workspace semantic search now enriches embeddings with file metadata (type, location, modification date) for more contextually relevant results. Finding the right file in large workspaces is noticeably better. -->
- **Smarter Search** — Workspace search uses metadata-enriched embeddings for more relevant results. Finding things, sharper.

### Improvements

- **HubSpot Leads** — Full leads CRUD with OAuth scopes. Create, read, update, and delete leads directly. CRM, complete.
- **Zendesk Macros** — List, get, and apply macros for faster ticket management. Support workflows, accelerated.
- **Zendesk Multi-Account** — Connect multiple Zendesk accounts from one organization. Scale, supported.
- **Google Workspace Expansion** — Docs batchUpdate, Drive comments, and Gmail quick actions. Productivity, multiplied.
- **Meeting Transcripts** — Content-aware distribution routes transcripts to the right spaces automatically. Meetings, organized.
- **Skill Improvement** — Improve skills from the Library with Spark integration and quality recalibration. Skills, refined.
- **Per-Task Model Overrides** — Choose different behind-the-scenes models for different task types. Flexibility, granular.
- **OAuth Cancel** — Cancel button added to connector setup flow. Changed your mind? No problem.

### Fixes

- **Rate limit messages** — Clear provider attribution instead of vague error text. Errors, explained.
- **Auto-continue** — Truncated responses continue properly after rate limit fallback; no longer triggers on side-effect confirmations. Conversations, unbroken.
- **Gmail attachments** — Fixed detection and display in email search results. Mail, complete.
- **Staged file cards** — Click-to-preview restored; failed calls removed from UI. Approvals, clean.
- **Library images** — Annotations now work on markdown with images. Highlights, everywhere.
- **Voice migration** — Deprecated transcription model auto-migrated to current version. Transcription, current.
- **Cloud sync** — Denied files no longer re-download infinitely; executed inbox items stay executed. Sync, stable.
- **Meeting bot** — Avatar relay failures handled; pre-scheduled bots activate reliably. Meetings, resilient.

### Under the Hood

- Approval surface rebuilt from floating cards to sidebar drawer.
- 30+ services migrated to platform-agnostic core for cloud/mobile reuse.
- Centralized error classification with AgentErrorKind catalog.
- Safety eval infrastructure: pipeline gate, 83-fixture baseline, shared eval module with CI.
- Cost tracking: model identity, cache metrics, MCP server analytics.
- Cloud: multi-provider infrastructure, BYOK support, parallel sync with failure cooldown.
- Mobile: inline approvals, tool steps during turns, crash prevention.
- CI: daily UI smoke tests, Slack notifications, changelog GCS upload.

---

## v0.4.16 — Mar 9-11, 2026

### Highlights

<!-- detail: This release laid the Actions workflow foundation: archive→done lifecycle semantics, richer task metadata (status, confidence, and timing), and a redesigned Actions surface with temporal grouping. Most visible polish landed in v0.4.17, but this release established the model and interaction patterns. -->
- **Actions Workflow Foundation** — Rebel’s task flow moved from "archive" semantics to clearer "done" lifecycle states, with a redesigned Actions experience. Triage, clarified.
<!-- detail: Spark gained a system self-improvement loop so Rebel can iteratively improve skill behavior over time. This laid groundwork for the broader skill-quality upgrades that expanded in later releases. -->
- **Spark Self-Improvement** — Rebel can now run a feedback loop to improve skill behavior over time. Improvement, compounding.

### Improvements

- **Claude Max Setup Guide** — Added in-app setup instructions for Claude Max tokens and environment config. Setup, less cryptic.
- **Auto-Done Guardrails** — Actions now verify completion before auto-marking items done. Follow-through, tighter.

### Fixes

- **Approval Visibility** — Restored missing preview buttons and approval strip behaviors during the Actions migration. Control, returned.
- **Cloud Continuity** — Hardened outbox retries and shared cooldown handling during transient API failures. Continuity, steadier.

### Under the Hood

- Inbox data model expanded with status, confidence, and temporal fields.
- Core/cloud migration continued with more platform-agnostic shared services.
- Groundwork landed for the approval system redesign shipped in v0.4.17.

---

## v0.4.15 — Mar 5-9, 2026

### Highlights

<!-- detail: RebelCanvas is a new built-in MCP server that lets Rebel create interactive visualizations — charts, dashboards, mini-apps — rendered as live HTML directly in your conversation. Includes fullscreen expand, Open in Browser, and automatic error reporting back to the agent for self-correction. Think of it as Rebel's sketchpad for anything visual. -->
- **RebelCanvas** — Rebel can now create interactive visualizations, charts, and mini-apps directly in your conversation. Live HTML, rendered inline with fullscreen expand and Open in Browser. The visual sketchpad, arrived.
<!-- detail: Rebel now scores your skills by quality (completeness, structure, actionability) and surfaces indicators in the Library. Low-quality skills get proactive improvement nudges, and the skill doctor can auto-fix issues. Library UI simplified with sort controls, usage tracking, and relevance reasons. -->
- **Skill Quality Engine** — Skills now get quality scores with improvement nudges. The Library shows usage counts, relevance reasons, and smart sorting. Your skills, levelled up.
<!-- detail: Share any workspace file or folder with a rebel://space/ link that works across machines. The link resolves to the correct local path on any computer where the space is synced. Great for sharing references in conversations, emails, or docs without worrying about absolute paths. -->
- **Universal Space Links** — Share workspace files with rebel://space/ links that work on any machine. Cross-device file sharing, solved.
<!-- detail: GPT-5.5 and GPT-5.5 Pro are now available as model options in Council Mode, model profiles, and alternative model settings. These are OpenAI's latest reasoning models. -->
- **GPT-5.5 Models** — GPT-5.5 and GPT-5.5 Pro now available across all model settings. The latest reasoning, accessible.

### Improvements

<!-- detail: Rebel can now remember people, companies, and other entities it encounters during conversations. Entity metadata is stored locally and used to resolve ambiguity — like knowing which "Alex" you mean when you have three in your contacts. Includes MCP tools for entity lookup and meeting participant resolution. -->
- **Entity Memory** — Rebel remembers people and companies across conversations, resolving "which Alex?" automatically. Context, persistent.
<!-- detail: When you ask a follow-up question in a conversation, Rebel can now search your workspace files for relevant context — not just on the first message. A system prompt nudge encourages the agent to use rebel_search_files on continuation turns. -->
- **Smarter Follow-ups** — Semantic search now works on follow-up messages, not just the first one. Context retrieval, continuous.
- **Council Review Button** — Review council opinions after any turn, across all platforms. Second opinions, on demand.
<!-- detail: Inbox items can now have topic tags, and a new search bar with tag filters lets you find items faster. Search and tags combine in a unified toolbar. -->
- **Inbox Tags & Search** — Topic tags and a unified search bar make your inbox filterable and findable. Organization, improved.
<!-- detail: The Library now offers sort controls (Most used, Most polished, Needs attention), usage counts per skill, relevance reasons, and a streamlined list view. Quality badges use icons instead of emojis. -->
- **Library Overhaul** — Sort by usage, quality, or attention needed. See why each skill matters and how often you use it. Discovery, guided.
- **Salesforce Universal CRUD** — Generic create/read/update/delete tools work on any standard or custom Salesforce object. CRM flexibility, unlimited.
- **HubSpot Power Tools** — Properties CRUD, workflow CRUD, and owner guidance on deal creation. HubSpot depth, expanded.
- **Xero Invoices** — Fetch invoice online URLs and download invoices as PDF. Accounting, deeper.
- **Gmail Reply Drafts** — Create threaded reply drafts that preserve conversation context. Email threading, proper.
- **Slack Token Rotation** — Tokens auto-refresh across MCP and mention adapters. Connections, evergreen.
- **PDF Preview** — View PDFs directly in the document editor via Chromium's built-in viewer. No app-switching required.
- **Health Check Links** — Toast notifications for failing connectors now link directly to the problem connector. Diagnosis, faster.
<!-- detail: The watchdog now uses a 15-minute safety net with progressive messages ("Still working...", "Taking longer than usual...") and a retry button. It informs you about long-running turns instead of deciding to abort them. -->
- **Friendlier Watchdog** — Long-running turns get progressive status messages and a retry button instead of silent aborts. Patience, communicated.
- **Contextual Inbox CTAs** — Action buttons adapt their labels based on item type across all platforms. Actions, clearer.
- **Meeting Recording Reliability** — 10 fixes for bot scheduling, health monitoring, auto-retry, and duplicate join prevention. Meetings, dependable.
- **MCP Schema Awareness** — Layered schema validation reduces tool call hallucinations. Accuracy, structural.

### Fixes

- **SkillCard crash** — Fixed a TypeError crash when opening skill cards with missing data. Stability, restored.
- **Composer overlap** — Text no longer overlaps with the attachment button. Layout, fixed.
- **Voice transcription** — gpt-4o-transcribe no longer tries to answer your questions instead of transcribing them. Job description, clarified.
- **Tool safety** — Smart bash heuristics auto-approve safe command pipelines (find, rg, sort). Fewer interruptions.
- **Message overlap** — Virtualizer stabilized to prevent messages from overlapping in long conversations. Reading, clean.
- **@mention annotations** — Mentions now resolve correctly when sending via the annotation path. References, connected.
- **Meeting bot duplicates** — Prevented duplicate bot joins from empty status change cascades. One bot per meeting.
- **Onboarding resilience** — Settings migration no longer blocks latecomers from completing setup. Onboarding, survivable.
- **Cloud sync** — Symlink following in workspace sync, sensitive path blocking, and session resurrection prevention. Sync, hardened.
- **PayPal connector** — Fixed URL and transport type. Payments, connected.
- **OAuth countdown** — Auto-open countdown cancels when you click the button manually. UI, responsive.
- **Image extraction** — Handles Anthropic API format in tool result images correctly. Images, displayed.
- **Build artifacts** — Stale .vite/build artifacts cleaned before dev/build/package. Builds, fresh.
- **API key fallback** — Server errors now retry during API key fallback with sentinel sanitization. Resilience, layered.
- **Community forum** — Help docs now link to the actual community forum URL. Links, correct.
- **HubSpot lists** — Fixed TypeError in list_hubspot_lists. CRM queries, working.

### Under the Hood

- RebelCanvas MCP server with HTML preview, fullscreen modal, and error auto-reporting.
- Entity layer with metadata store, MCP tools, and meeting participant resolution.
- @rebel/shared package for cross-platform type sharing.
- Centralized shared infrastructure to @core for cloud/mobile reuse.
- Bridge terminology renamed to cloud across codebase.
- super-mcp: additionalProperties enforcement, schema default flip, repair tickets, dead code removal.
- rebel-system: quality-score-aware doctor skills, build-workflow skill, entity frontmatter conventions.
- CI/CD: auto-deploy cloud on push, mobile CI/CD workflows with TestFlight auto-deploy.
- Skill quality scoring Phases 1-4: scoring engine, UI indicators, doctor upgrades, proactive nudges.
- Inbox: canonical cross-session messaging, search+tag filter unification.
- Performance: measurement cache sync moved to onChange, cleared on session switch.

---

## v0.4.14 — Mar 4, 2026

### Highlights

<!-- detail: Model setup is now a guided 2-step flow: pick your provider (OpenAI or Google), then choose from a curated model catalog with descriptions. Thinking-level controls appear automatically for reasoning models. No more hunting through preset buttons or manual URL configuration. Three clicks to a fully configured alternative model. -->
- **Streamlined Model Picker** — Set up alternative models in 3 clicks: provider, model, thinking level. The old wall of preset buttons is gone. Configuration, simplified.
<!-- detail: Enter your OpenAI or Google API key once in the new Provider Keys section, and it auto-fills across voice, image generation, MCP connectors, model profiles, and onboarding. Includes migration from legacy settings. Keys are stored locally with log redaction. -->
- **Unified Provider Keys** — Enter your OpenAI or Google key once, use it everywhere — voice, image generation, connectors, model profiles. One key, many doors.
<!-- detail: When using non-Claude models (GPT, Gemini, etc.) that produce reasoning output, Rebel now translates their reasoning_content into visible thinking blocks — the same expandable UI you see with Claude. Includes reasoning-aware timeouts scaled by effort level so thinking models don't get cut off prematurely. -->
- **Thinking from Every Model** — Non-Claude models now show their reasoning as expandable thinking blocks, just like Claude. Transparency, universal.

### Improvements

<!-- detail: Browserbase provides cloud-hosted browser instances that AI can control for web scraping, testing, and automation. Connect it as an MCP server to give Rebel browser automation capabilities without running a local browser. -->
- **Browserbase connector** — Cloud browser automation joins the connector catalog. Web tasks, handled.
<!-- detail: All five Salesforce create tools (lead, account, contact, opportunity, task) now accept a fields parameter for custom and additional fields — matching the existing update tools. Unblocks organizations with required custom fields on create operations. -->
- **Salesforce custom fields** — All create operations now accept custom fields, matching update tools. CRM workflows, unblocked.
<!-- detail: For organization-provisioned users, the Spaces onboarding step now pre-fills company name, hides redundant inputs when org config provides them, and shows read-only space chips. Less clicking, faster setup. -->
- **Smoother org onboarding** — Spaces step pre-fills company name and auto-detects org-provisioned settings. Setup, streamlined.
<!-- detail: The floating cloud sync banner that could obscure content is replaced with a subtle icon in the header row. Shows subdued when synced, amber pulse when syncing, red badge on failure. Hover for details. -->
- **Cloud sync indicator** — The floating banner is now a subtle header icon. Synced, syncing, or failed — at a glance.

### Fixes

<!-- detail: The Gmail attachment workflow was passing only 42% of tests (5/12). Five bugs fixed: download fallback for missed message indexes, draft schema corrections, type guard expansion for path-based attachments, metadata in thread text output, and error propagation in attachment service. Now at full coverage. -->
- **Google Workspace attachments** — Fixed 5 bugs in attachment downloads, draft schemas, and type guards. Email attachments, reliable again.
<!-- detail: The 1M context beta header is rejected by Anthropic when used with OAuth/Claude Max tokens. Now disabled in settings for OAuth users with a clear tooltip, and the executor falls back to 200K. Session-level memory also prevents repeated 1M retry penalties (~600ms per turn) after the first failure in a conversation. -->
- **Claude Max context** — 1M context correctly disabled for Claude Max users (not supported by Anthropic), with smart per-session fallback. Limits, respected.
- **Bug reporting** — The bug report and feedback forms actually submit now. Ironic, we know.
- **Settings stability** — Two crashes from undefined model state eliminated. Preferences, crash-free.
<!-- detail: The "Update now" button previously called checkForUpdates() independently, which reported "No update found" even when one was already downloaded. Now checks pending downloads first and offers "Install & Relaunch" when ready. Copy rewritten to Rebel brand voice. -->
- **Update banner** — Rewritten with a working update button and friendlier copy. Updates, actionable.

### Under the Hood

- Session-level memory skips 1M context retries after first failure (~600ms saved per turn).
- Phase-aware watchdog with reasoning-aware upstream timeouts (30s-240s by effort level).
- Feedback: Discourse topic creation, error surfacing, and category routing wired up.
- Xero MCP bumped to 0.0.14-fix.4.
- Beeper connector: fixed URL, added auth token setup.
- super-mcp: cross-platform log directory fix.

---

## v0.4.13 — Feb 26 - Mar 3, 2026

### Highlights

<!-- detail: Rebel now separates AI models into "Thinking" (planning, reasoning) and "Working" (execution, writing) roles. You can assign different models to each role — including non-Claude models like GPT, Gemini, and others — via tier-based proxy routing. Pick the right tool for each part of the job. -->
- **Thinking & Working Models** — Choose different AI models for planning vs. execution. Mix and match Claude with other models for different tasks. The right brain for the right job.
<!-- detail: Rebel bundles ElevenLabs as a connector with full access to music generation, text-to-speech, sound effects, voice search, and speech-to-text. No API key needed — just ask Rebel to generate audio. -->
- **ElevenLabs Connector** — Generate music, sound effects, and speech directly from Rebel. Audio creativity, built in.
<!-- detail: Cmd/Ctrl+F now opens a find bar within conversations, letting you search for text across the entire conversation transcript. Matches are highlighted and navigable with next/previous controls. -->
- **Find in Page** — Search within conversations with Cmd/Ctrl+F. Your conversations, searchable.
<!-- detail: Voice input is now available on all web and mobile companion surfaces — not just the main desktop app. Dictate messages, commands, and notes from any device. -->
- **Voice Everywhere** — Voice input now works on all web and mobile companion surfaces. Speak anywhere.

### Improvements

<!-- detail: Inbox items now open in a dedicated detail modal with full context carried over, replacing the old expand/collapse pattern. Email references render inline with proper formatting. -->
- **Inbox detail view** — Expanded inbox items open in a dedicated detail modal with full context. Information, accessible.
<!-- detail: Today cards on the homepage now accept context input, and the hero input supports file attachments. Start conversations with more context from the start. -->
- **Homepage context** — Today cards and hero input now accept context and file attachments. Conversations, richer from the start.
<!-- detail: Export your Cursor AI conversations to Google Drive for archival or sharing. Works with the Google Workspace connector. -->
- **Cursor export** — Export Cursor conversations to Google Drive. Your AI conversations, portable.
<!-- detail: Email replies and forwards now include the original quoted thread content, matching standard email conventions. The system prompt and Gmail skill were updated to guide proper quoting. -->
- **Email quoting** — Replies and forwards now include the original thread content. Context, preserved.
<!-- detail: New users start with the meeting notetaker hidden to avoid surprise meeting joins. An easy toggle in Settings lets you opt in when you're ready. -->
- **Meeting notetaker** — New users start with the notetaker hidden, with an easy opt-in toggle. Meetings, on your terms.
- **Beeper Desktop** — New connector for Beeper Desktop messaging. WhatsApp connector removed for security. Messaging, upgraded.
<!-- detail: Approval cards and staged files now display the destination space or service name, so you can see exactly where files are being saved before approving. -->
- **Approval context** — Approval cards and staged files show the destination space or service name. Decisions, informed.
<!-- detail: A new pending audio popover shows upload status with per-file retry and dismiss. Plaud transcription is more robust with size-based chunking and per-chunk retries. -->
- **Audio improvements** — Pending audio shows a status popover with retry and dismiss; transcription is more robust with chunked processing. Audio, reliable.
- **Coaching freshness** — Insights now expire after 2 days and appear in a carousel in the inbox. Advice, current.

### Fixes

<!-- detail: When quickly approving staged memory files, conflicts with existing files were silently swallowed — clicking "Save" did nothing with no feedback. Now conflicts open the preview dialog with the diff pre-populated so you can resolve them, and other errors show clear toast notifications. -->
- **Staged file approvals** — Quick-approve on staged files now surfaces conflicts and errors instead of silently failing. Conflicts open the diff view, errors show a toast. Feedback, delivered.
<!-- detail: Corporate networks with SSL inspection proxies can introduce latency that caused the API reachability check to time out prematurely. The timeout was increased from 3s to 6s, and the TLS fallback via Electron's net.fetch was extended to all platforms (not just Windows). -->
- **Enterprise network reliability** — Increased API timeout and extended TLS fallback to all platforms for slow corporate networks. Connectivity, hardened.
<!-- detail: Cloud sync fixes: unpinned sessions are properly demoted, state map pushes are throttled to prevent overload, and inbox archives reconcile correctly on reconnect. -->
- **Cloud sync** — Fixed sync state propagation, throttled state pushes, and reconciled inbox archives on reconnect. Sync, stable.
<!-- detail: Two OAuth connector fixes: adding connectors via chat no longer stalls on the OAuth flow, and disconnected accounts no longer silently re-register on startup. -->
- **OAuth connectors** — Fixed chat-based connector addition stalling and disconnected accounts re-registering. Connections, reliable.
- **App updates** — More reliable app restart after updates using PID-based polling instead of fixed timeouts. Updates, smoother.
- **Media turns** — Conversation history preserved during media turn fallback and retry. History, intact.
- **System prompt** — Active local model name now shown correctly instead of defaulting to Claude. Identity, accurate.
- **Audio playback** — Fixed audio playback in conversations and auto-linking of workspace file paths. Playback, fixed.
- **Gamma exports** — Extended export URL polling and auto-download before link expiry. Exports, timely.

### Under the Hood

- Inbox: email reference type, staged-tool approvals, store migrations v18-v20.
- Settings: model profile infrastructure (workingProfileId, profile manager, buildCompletionsUrl extraction).
- Cache: memory-update turns aligned with normal cache hierarchy via MCP deny hook.
- Build: removed ghost imports and stale references.
- rebel-system: email quoting guidance in system prompt; inbox freshness with targeted email search.
- super-mcp: cross-platform log directory fix.

---

## v0.4.12 — Feb 26, 2026

### Fixes

<!-- detail: Node.js uses a hardcoded Mozilla CA bundle that doesn't include enterprise certificates installed in the Windows certificate store. Corporate networks that inspect HTTPS traffic install their own CA — and Node.js didn't trust it, causing every API call to fail with "unable to get local issuer certificate." The fix uses native Node.js 22.15+ APIs to read the OS certificate store and merge it with the default bundle at startup, before any HTTPS calls are made. An Electron net.fetch fallback provides belt-and-suspenders protection using Chromium's network stack. -->
- **Enterprise network connectivity** — Fixed "no internet" on Windows login behind corporate SSL inspection proxies. Rebel now loads your organization's certificates from the OS trust store automatically. Corporate networks, connected.

---

## v0.4.11 — Feb 25-26, 2026

### Highlights

<!-- detail: Multiple scroll stability fixes ensure Rebel doesn't yank you to the bottom of a conversation while you're reading. Upward wheel scrolls are now detected, handlers re-register when streaming starts, and a gravity well race condition was eliminated. -->
- **Scroll stability overhaul** — Reading during streaming no longer fights you for scroll position. Conversations, yours to read.
<!-- detail: Inbox items now go through quality filtering at write time, with relevance scoring and category classification. Low-signal items are filtered before they reach you, and existing low-quality items are cleaned up retroactively. -->
- **Smarter inbox** — Write-time quality filtering, relevance scoring, and category classification keep your inbox signal-rich. Noise, filtered at the source.

### Improvements

<!-- detail: Salesforce connector gains update_lead, tasks CRUD (create, read, update, delete), user lookup, and custom field support on all update operations. -->
- **Salesforce expansion** — Update leads, manage tasks, look up users, and use custom fields across all Salesforce operations. CRM, deeper.
- **Runway models** — Gen4.5 and Gemini 3 Pro now available in the Runway connector. Creative options, expanded.
- **Council mode** — Toggle restored in the session settings menu. Multi-model, accessible.
- **Automation insights** — Coaching now surfaces automation-specific insights with source labels. Background work, visible.
- **Community connectors** — Unpinned to always use latest versions. Integrations, current.

### Fixes

- **Meeting transcript noise** — Content relevance filtering reduces low-quality inbox items from meeting analysis. Signal, improved.
- **Document editor** — Auto-save no longer reverts changes made by external editors. Edits, preserved.
- **Automation broadcasts** — Throttled to prevent renderer memory exhaustion on busy runs. Stability, maintained.
- **Zendesk export** — Fixed Windows NTFS race condition in export error path. Exports, reliable.
- **Homepage layout** — Sidebar closes on Home for full-width view; text contrast improved in coach and today sections. Readability, better.
- **Skill customisation** — Rebel now points you to the customise-and-extend-skill guide when system file writes are blocked. Guidance, helpful.

### Under the Hood

- Inbox infrastructure: category field, source kinds, cost tracking, quality patterns, and analytics events.
- Automation scheduler: token usage tracking, cost analytics, store migrations v16-v18.
- Cloud (alpha): gate continuity toggle on isPinned, Fly provisioning tests, auto-provisioning UX polish.
- Sentry: renderer error sub-fingerprinting for REBEL-NF bucket.
- CI: Content-Type and Cache-Control headers on GCS DMG uploads.

---

## v0.4.10 — Feb 24-25, 2026

### Highlights

<!-- detail: The Rebel mobile app (Alpha) now has full feature parity with the web companion — conversations, inbox, workspaces, and Help & Support all work seamlessly across devices. Pinned conversations sync between desktop and mobile. Mobile and cloud continuity features are in alpha — expect rough edges. -->
- **Mobile companion (Alpha)** — Full feature parity with the web companion. Your conversations, everywhere.
<!-- detail: When Rebel finishes a conversation in the background, a red badge appears on your dock icon so you never miss a completed task. Works for all background conversation completions. -->
- **Dock notifications** — Red dot on the dock icon when conversations finish in the background. Nothing missed.
<!-- detail: Outreach (sales engagement sequences and prospects), Datadog (monitoring dashboards and alerts), and Workday HCM (read-only workers and organization data). -->
- **Three new connectors** — Outreach, Datadog, and Workday HCM join the connector catalog. Your ecosystem, growing.
<!-- detail: Eleven new skills covering problem-solving frameworks, legal research, meeting intelligence, content creation, and more. These teach Rebel new approaches for non-technical work that knowledge workers actually do. -->
- **11 new skills** — Problem-solving, legal research, meeting intelligence, content creation, and more. Rebel's abilities, expanding.

### Improvements

<!-- detail: When using alternative AI models, Rebel now fails over to Claude faster (reduced proxy timeout) and shows a compatibility note so you know what to expect. If the alternative model is unreachable, Claude steps in as a fallback. -->
- **Alt-model reliability** — Faster timeout with Claude fallback and compatibility notes when using alternative models. Models, resilient.
<!-- detail: When Rebel creates records in HubSpot, it automatically tags them with attribution and the deal owner. No manual tagging needed. -->
- **HubSpot attribution** — Created records automatically tagged with Rebel attribution and deal owner. CRM, organized.
<!-- detail: File export for bulk ticket analysis, 429 rate-limit retry, search truncation for large result sets, and comment pagination. Zendesk workflows handle enterprise-scale data more reliably. -->
- **Zendesk power tools** — File export for bulk ticket analysis, rate-limit retry, and comment pagination. Support workflows, hardened.
<!-- detail: Granola meeting notes now connect through Granola's official MCP server instead of a bundled integration. This means faster updates and better compatibility as Granola evolves their API. -->
- **Granola upgrade** — Migrated from bundled connector to Granola's official MCP server. Integration, native.
- **Connector nudge** — Homepage suggests connectors you haven't set up yet. Discovery, proactive.
- **Help & Support** — Web and mobile (alpha) companions now feature Help & Support instead of Settings. Guidance, accessible.
- **Feedback diagnostics** — Diagnostic logs now included by default when sending feedback. Reporting, easier.
- **Smarter coaching** — Coaching insights expire after 3 days and prioritize better. Advice, fresh.

### Fixes

- **Slack connector** — Fixed schema signals that caused the AI to hallucinate tool calls. Responses, grounded.
- **Attio OAuth** — Fixed timeout and registration issues during connector setup. Connections, reliable.
- **Staged preview** — File-type-aware markdown rendering in preview and thinking display. Previews, accurate.
- **Calendar RSVP** — LLM sync no longer overwrites your filtered meeting cache. Calendar, faithful.
- **Archive focus** — After archiving a conversation, focus shifts to the next one in the list. Navigation, smooth.
- **Keyboard shortcut** — Archive shortcut works reliably again. Shortcuts, fixed.
- **Auto-titles** — Conversation titles now use all messages for better accuracy. Names, meaningful.
- **Sidebar cleanup** — Stale empty sessions hidden from the Active list; sidebar starts closed on homepage. Organization, tidy.
- **Library resilience** — File reads now retry on missing files with proper error handling. Robustness, improved.

### Under the Hood

- Cloud: sync health visibility, conflict notifications, turn-level merge, and session turn guard.
- Mobile (alpha) brought to full feature parity with web companion.
- Analytics: app version tagging on all events, source attribution, absence tracking.
- PostHog release annotations from changelog in CI.
- Activity classification counts only confirmed file writes.

---

## v0.4.9 — Feb 20-24, 2026

### Highlights

<!-- detail: Type @model-name or just describe what you want ("use GPT for this") and Rebel routes your message to that model on the fly. A new Models filter in the mention picker shows all available models. Works alongside Council Mode for one-off model routing without changing your default settings. -->
- **@-model dispatch** — Mention any AI model by name in your message and Rebel routes it there. No settings changes needed. Models, on demand.
<!-- detail: The sidebar now shows all conversations in a flat list with quick filter chips at the top. Filter by All, Unread, Automations, or Starred with one tap. Starred conversations are separated from the active filter for easy access. Replaces the old accordion section layout for faster navigation. -->
- **Sidebar redesign** — Filter chips replace accordion sections. Tap All, Unread, Automations, or Starred to slice your conversation list. Navigation, streamlined.
<!-- detail: The document editor has been rebuilt from scratch. A new unified editor replaces the old preview drawer and library editor with a single, consistent editing experience. Includes annotated markdown support, document actions, and seamless transitions between Library and conversation views. Files open in edit mode by default. -->
- **Unified Document Editor** — Rebuilt from scratch with annotated markdown, document actions, and seamless Library integration. Editing, unified.
<!-- detail: Twelve new connectors: Discourse (community forums with write access), BambooHR (HR data), Mailchimp (email campaigns), QuickBooks Online (accounting), Napkin AI (visual generation from text), Attio CRM (relationship management), Google Maps (location data), MoEngage (customer engagement), Basecamp (project management), Braze (marketing automation), Shopify (e-commerce), and Playwright (browser testing). -->
- **Twelve new connectors** — Discourse, BambooHR, Mailchimp, QuickBooks, Napkin AI, Attio, Google Maps, MoEngage, Basecamp, Braze, Shopify, and Playwright. Your ecosystem, expanding fast.

### Improvements

<!-- detail: Session controls (model, thinking effort, context settings) move into a compact settings menu in the composer. A file indicator button shows attached files at a glance. Less visual clutter while keeping everything accessible. -->
- **Composer redesign** — Session controls move into a clean settings menu with a file indicator button. Less clutter, same power.
<!-- detail: Automation actions that hit a safety block now stage for your approval instead of failing. Once approved, the automation restarts automatically from where it left off. No more manually restarting blocked automations. -->
- **Automation staging** — Blocked automation actions now stage for approval and auto-restart when approved. Background work, unblocked.
- **Draggable approvals** — Approval notifications can be dragged anywhere on screen. Position persists between sessions. Layout, yours.
- **Smarter coaching** — Homepage coaching insights now prioritize by how often you act on them. Advice, relevant.
- **Calendar auto-sync** — Meeting cache refreshes automatically after your machine wakes from sleep. Schedule, current.
- **Inbox animations** — Optimistic execution feedback with undo and smooth departure animations. Actions, satisfying.
- **Diagnostic export** — Per-conversation export now includes a full diagnostic report. Troubleshooting, comprehensive.
- **Recommended connectors** — Your organization's recommended connectors now appear in the Connectors tab. Discovery, guided.
- **Health notifications** — Proactive toast notifications when services are degraded. Awareness, immediate.
- **Request a connector** — New button in Connectors settings to request integrations you need. Feedback, easy.
- **Xero attachments** — Invoice online URL and PDF tools added. Accounting, deeper.
- **Auto-retry on errors** — Rebel automatically retries when the API returns a server error, with backoff. Resilience, built in.
- **Preparing context spinner** — Shows a spinner while summarizing @-mentioned content. Progress, visible.
- **Automation tool grants** — Tool approvals in automations now scope to the automation session. Fewer repeat prompts.
- **Web search approvals** — Web search and URL fetch no longer trigger approval prompts. Browsing, uninterrupted.

### Fixes

- **Microsoft OAuth scopes** — Reconnecting no longer loses your granted permissions. Scopes, preserved.
- **PDF export** — Markdown-to-HTML conversion uses a proper parser instead of fragile pattern matching. Exports, reliable.
- **Scroll stability** — Resolved scroll fighting, jank, and bottom-reach failures in conversations. Reading, smooth.
- **Library annotations** — Overhauled persistence with content-aware anchoring to prevent data loss. Highlights, kept.
- **API key protection** — Settings refresh no longer overwrites draft API keys during onboarding. Keys, safe.
- **ServiceNow** — Hibernating instances now handled gracefully. Enterprise, supported.
- **OAuth flow** — Auth tool response recognition improved for multiple edge cases. Connections, reliable.
- **HTML entities** — Documents no longer show raw `&nbsp;` codes in the Library. Display, clean.
- **Context fallback** — Max 200K now preferred over API 1M in the context fallback chain. Defaults, smarter.
- **Meeting bot trigger** — Voice trigger no longer fails when user first name is missing. Activation, robust.
- **Connector subdomains** — Input normalization prevents common URL formatting mistakes during setup. Setup, forgiving.
- **Scheduler timezone** — Anchor dates now parse in local timezone correctly. Schedules, accurate.
- **Sub-agent timeline** — Truncated task JSON no longer drops sub-agent pills. Timeline, complete.
- **Auto-update watchdog** — macOS update installs now have a relaunch watchdog for ShipIt failures. Updates, resilient.
- **Stale drafts** — Deleted drafts now clear from cache properly. Cleanup, thorough.
- **Salesforce setup** — Updated for External Client App with fix for disabled setup button. Configuration, current.
- **Feedback renamed** — "Send feedback" is now "Feedback & bugs" in the help menu. Intent, clearer.

### Under the Hood

- Cloud continuity (alpha) architecture with web companion, session persistence, and bidirectional inbox sync.
- Mobile (alpha) test suite: 88 tests across 10 suites.
- Windows E2E re-enabled for safest UI-only suites.
- MCP mock-API tests expanded for Gamma, Napkin, Kling, ServiceNow, and Granola.
- Super-MCP: 30s connect timeout, cross-realm Response normalization.
- Connector catalog uploaded to GCS on release.
- Core startup logic centralized into shared module for cloud reuse.
- Sentry noise reduction across 6 benign event types.
- Access rules: tool permissions separated from content preferences.
- System prompt tuned for top 4 failure patterns from conversation analysis.
- Tool safety evaluator now respects user intent context.

---

## v0.4.7 — Feb 17-20, 2026

### Highlights

<!-- detail: The Figma Desktop MCP replaces the previous community integration. It connects through Figma's official local server for reliable, low-latency access to your design files, components, and variables — directly from your conversation. -->
- **Figma connector** — Official Figma Desktop MCP integration, replacing the community connector. Access your design files, components, and variables directly. Design, connected.
<!-- detail: Microsoft 365 token refresh now retries on 401 errors with structured AADSTS logging, and Salesforce setup now includes sandbox support with clear error messages. Asana's OAuth was failing 45.5% of the time due to missing static client credentials — now fixed. Zendesk search was returning wrong results because of a missing auto_paginate parameter. -->
- **MCP connector reliability** — Major fixes across Microsoft 365 (token refresh), Salesforce (silent setup failures, sandbox support), Asana (45% connection failure fixed), and Zendesk (search returning wrong results). Connectors, battle-tested.

### Improvements

<!-- detail: The Homepage is a new landing surface with Today (actionable items from your calendar, inbox, and tools), Chat (recent conversations), and Coach (contextual suggestions). It refreshes live when visible and auto-returns after inactivity. -->
- **Homepage** — A new landing surface with Today, Chat, and Coach sections. See what needs attention, pick up where you left off, or get coached on what to try next. Your day, organized.
- **Gong and Humaans connectors** — Two new connectors for Gong call intelligence and Humaans HR data. Your tools, expanding.
- **Zendesk power search** — Export search and batch fetch tools bypass the 1000-result limit for large ticket volumes. Scale, unlocked.
- **Gmail attachments** — Attach files by path when drafting or sending emails. Attachments, straightforward.
- **HubSpot associations** — New tools for v4 association labels and workflow interrogation. CRM depth, increased.
- **Conversation tools** — Get conversation summaries or export full transcripts with dedicated tools. Context, accessible.
- **Calendar filtering** — Only accepted meetings appear in your daily schedule. Noise, reduced.
- **Coach onboarding** — Replaced checklist with coach-based onboarding and contextual tooltips. Getting started, guided.
- **Markdown tables** — GFM tables now display properly in the Library editor. Tables, rendered.
- **Toast notifications** — Redesigned with a modern glass-morphism style. Notifications, polished.
- **OAuth timeout** — Extended to 5.5 minutes with deep-link hot-reload so connector setup doesn't time out mid-flow. Patience, rewarded.
<!-- detail: GitLab, TalentLMS, Zoom, ServiceNow, Pipedrive, Databricks, Deel, and Xero — eight new connectors covering code repos, learning management, video meetings, ITSM, CRM pipelines, data platforms, payroll, and accounting. -->
- **Eight new connectors** — GitLab, TalentLMS, Zoom, ServiceNow, Pipedrive, Databricks, Deel, and Xero join the connector catalog. Your integrations, multiplied.
- **Coach dismissals** — Dismiss coaching suggestions you've already seen. They won't come back unless you want them to. Noise, controlled.
- **Sidebar polish** — Collapsed sidebar tabs are cleaner with better positioning and spacing. Layout, refined.
- **Attachment recovery** — Extracted text and images from attachments now survive session recovery. Context, preserved.

### Fixes

- **Zendesk search** — Fixed search returning wrong results due to pagination defaults. Results, accurate.
- **Asana connections** — Fixed 45% OAuth failure rate by adding static client credentials. Connections, reliable.
- **MS365 token refresh** — Microsoft connectors no longer fail silently when tokens expire. Sessions, persistent.
- **Salesforce setup** — No longer fails silently; now shows clear error messages and supports sandbox instances. Setup, transparent.
- **Auto-update install** — Fixed macOS update install failing due to a conflicting quit handler. Updates, smooth.
- **Chat layout jump** — New messages no longer cause the conversation to jump unexpectedly. Scrolling, stable.
- **Search recency** — Recency filter now applies correctly to active search results. Filters, faithful.
- **Error messages** — API errors now show human-readable messages instead of raw codes. Errors, explained.
- **Light mode chevrons** — Fixed dropdown chevron tiling in the inbox quadrant filter. Pixels, aligned.
<!-- detail: Tailwind CSS was scanning the entire DOM tree on every render, causing 5-second renderer blocks. Now scoped to only scan when the surface is visible, and polling hooks are gated by visibility to reduce idle CPU usage. -->
- **Performance** — Fixed a rendering bottleneck that could freeze the app for several seconds. Typing lag and sluggish scrolling, resolved.
- **Microsoft Teams** — Fixed an API error when listing chats. Conversations, listed.
- **ChartMogul connector** — Worked around a launch bug in the latest version. Compatibility, maintained.
- **Xero connector** — Fixed token caching so OAuth sessions stay alive. Accounting, uninterrupted.
- **Sidebar rendering** — Fixed archived conversation list offset and spacing. Alignment, corrected.
- **Stop button** — Cancelling a turn now reliably stops the right one when multiple turns are in flight. Control, precise.
- **Multi-window IPC** — Notifications now reach the correct window instead of broadcasting everywhere. Messages, targeted.

### Under the Hood

- Generic HTTP mock infrastructure with tests for 6 MCPs, integrated into CI.
- Catalog smoke tests verify all connector entries on every release.
- MCP best practices strengthened: always list_tools before first call, consistent parameter naming.
- Agent protection: hard-block all writes to rebel-system directory.
- Pre-push hook runs validate:fast before every push.
- Polling hooks gated by surface visibility to reduce idle CPU usage.
- Singleton proxy replaced with persistent ProxyManager for better lifecycle management.
- Slack notifications for production releases.
- Compaction failures reported to Sentry for better observability.

---

## v0.4.6 — Feb 16-17, 2026

### Highlights

<!-- detail: When the Claude model produces malformed tool data that corrupts a conversation, Rebel now detects it on resume, clears the corruption, and rebuilds your conversation from disk automatically. Previously this would permanently break the conversation with no recovery. -->
- **Conversation recovery** — Rebel can now recover conversations that were previously stuck due to corrupted tool data. Broken threads, healed.
<!-- detail: Read-only tools (search, get, list operations) are now pre-evaluated and auto-approved without requiring LLM safety checks, and writes to temporary directories are also auto-approved. This eliminates redundant approval prompts that were slowing down permissive users. -->
- **Fewer approval interruptions** — Read-only tools and temp file writes no longer trigger approval prompts for permissive users. Flow, unbroken.

### Improvements

- **Update banner** — When you're 2+ versions behind, an inline banner appears with a one-click update button. Dismissible for 3 days. Staying current, simplified.
- **Google Drive downloads** — Drive file operations are faster and no longer fail on certain systems. Downloads now return content directly instead of writing to disk. Speed, gained.
- **File path links** — Links to files with spaces in the path (like "UX Audits/report.md") now work correctly. Clicks, connected.

### Fixes

- **Missing file links** — Clicking a link to a deleted or moved file now shows a helpful toast instead of breaking the Library view. Graceful, always.
- **Google Drive errors** — Fixed Drive downloads failing on non-Docker systems. Compatibility, restored.

---

## v0.4.5 — Feb 13-16, 2026

### Highlights

<!-- detail: When someone @-mentions Rebel in Slack, it now picks up the message and responds in a new conversation — automatically. Only your own mentions are monitored, with public channel privacy protection built in. Legacy workspaces need a quick reauth to enable it. -->
- **Slack @-mention triggers** — Mention Rebel in Slack and it responds automatically. Your messages come to Rebel, Rebel comes back with answers. Conversations, initiated.
<!-- detail: Council Mode lets you bring additional AI models into a conversation for second opinions. Configure reasoning effort levels (including xhigh), choose developer or general roles, and use model presets. Errors surface in real-time, and Quick Add reuses your existing API keys. -->
- **Council Mode** — Bring multiple AI models into one conversation for second opinions. Configure reasoning effort, roles, and presets. Perspectives, multiplied.
<!-- detail: A 6-stage safety hardening ensures sessions can't lose data across app version updates. Includes stale history detection, structured output serialization for OAuth users, and graceful SDK stream closure handling. -->
- **Session safety hardening** — Six layers of protection prevent conversations from losing data during updates. Your work, preserved.

### Improvements

<!-- detail: When a tool asks for permission, you can now approve it once for the rest of the conversation instead of approving each use individually. Reduces interruptions while keeping you in control. -->
- **Allow tool for session** — Approve a tool once and it works for the rest of your conversation. Fewer interruptions, same control.
- **Smarter automations** — Automations now wait when you're in a conversation, show proper status for partial blocks, and have better access rule management. Background work, polished.
- **Gmail upgrades** — Draft replies thread correctly, attachments work in drafts, and validation is tighter. Email, reliable.
- **HubSpot file uploads** — Five new tools for uploading files and managing attachments in HubSpot. Capabilities, expanded.
- **WhatsApp and Mixmax** — Two new connectors for WhatsApp messaging and Mixmax email sequences. Integrations, growing.
- **Disabled connectors section** — Disabled connectors now collapse into their own section in settings. Clutter, reduced.
- **Approval UI consolidation** — All approval surfaces now use shared components for a more consistent look and feel. Consistency, enforced.
- **Stalled turn watchdog** — Turns that go silent for 3 minutes are automatically aborted. Hangs, eliminated.
- **Screenshot hotkey** — If screen recording permission is missing, you now get a helpful toast with a link to System Settings. Guidance, actionable.

### Fixes

- **Zendesk reconnected** — Reverted to API token auth so external users can connect again. Access, restored.
- **Settings persistence** — Server config no longer overwrites your voice and model preferences. Choices, respected.
- **Startup white screen** — Fixed a renderer loading failure that could leave you staring at nothing. Launches, reliable.
- **OAuth safety checks** — Tool risk evaluation now works correctly for OAuth users. Protection, universal.
- **Connector catalog** — Eight connector entries updated with correct URLs and instructions. Links, fixed.
- **Shared space banner** — The add-existing space banner is friendlier and less alarming. Tone, calibrated.
- **200K context fallback** — Now uses your selected model instead of a hardcoded value. Preferences, honoured.

### Under the Hood

- Performance optimizations: lazy stores, event compaction, and idle process cleanup reduce memory usage.
- MCP build system standardized across 19 configs with content-hash caching.
- Node bundle caching skips re-downloads when version and architecture match.

---

## v0.4.4 — Feb 11-12, 2026

### Highlights

<!-- detail: Runway ML integration brings 15 tools for AI video and image generation directly into Rebel. Generate videos from text prompts, transform images, and create visual content without leaving your conversation. -->
- **Runway ML integration** — Generate AI videos and images right from your conversation with 15 creative tools. Media creation, built in.
<!-- detail: Local video files can now play inline within your conversation, no external player needed. When Rebel generates or downloads video content, you can watch it right where you are. -->
- **Inline video playback** — Watch locally generated or downloaded videos directly in your conversation. No app-switching required.

### Improvements

- **HubSpot for restricted users** — OAuth now uses optional scopes for write access, so restricted HubSpot users can still connect. Access, flexible.
- **Retry storm prevention** — Failed tool approvals are now terminal instead of retrying endlessly. Stability, enforced.
- **Runway full media suite** — Expanded from initial launch to 15 tools covering video generation, image transformation, and more. Creative range, broadened.
- **Tool parameter hints** — Agent now sees file save path guidance when using tools. Smarter decisions, fewer mistakes.
- **Automation empty state** — "Your Automations" column shows helpful guidance instead of a blank space. Onboarding, smoother.
- **Dock icons** — Resized to match platform icon guidelines with proper padding and shadow. Pixels, polished.
- **Privacy statement** — Updated to be more accurate during onboarding. Honesty, default.

### Fixes

- **Coach mode stuck** — Fixed UI getting stuck in coach mode after onboarding completion. Freedom, restored.
- **Company context** — Disambiguated company context during setup to avoid confusion. Clarity, sharpened.
- **Tool name hallucination** — Renamed meetings tool to prevent the model from guessing the wrong name. Naming, corrected.
- **Duplicate approval prompts** — First supervised automation run no longer triggers a second approval. Once is enough.
- **Tool alias resolution** — Renamed tools now work correctly in safety evaluation and staged calls. Aliases, honoured.
- **Voice settings** — TTS voice selection now matches the active provider. Voices, aligned.
- **Staging failures** — Agent now gets informed when file staging fails, so it can try something else. Awareness, improved.
- **MCP credential mapping** — Fixed credential handling for connectors with multiple API keys. Connections, reliable.
- **Onboarding race conditions** — Coach prompt drop, space creation errors, and workspace defaults all fixed. Setup, hardened.
- **Hallucinated tool args** — Strips unexpected arguments from tool calls to prevent silent retry loops. Noise, eliminated.

---

## v0.4.2 — Feb 10-11, 2026

### Highlights

<!-- detail: Typing in the composer could feel sluggish during long conversations due to unnecessary resize recalculations and re-renders. Smart resize guards, memoized popovers, and removal of redundant persistence bring responsiveness back to where it should be. -->
- **Faster typing** — Composer input is snappier now, especially in long conversations. Lag, eliminated.
<!-- detail: Tool approval notifications can now be approved or dismissed in bulk. Instead of clicking through each one individually, select multiple and act on them at once. Staged tool calls also got reliability improvements under the hood. -->
- **Batch tool approvals** — Approve or dismiss multiple tool requests at once instead of one at a time. Decisions, streamlined.

### Improvements

- **SharePoint expansion** — 36 tools now available with bug fixes and full Softeria parity. Enterprise access, broadened.
- **HubSpot OAuth** — Scope tier now passes correctly through the OAuth flow. Connections, reliable.
- **OAuth tool safety** — Tool safety and background services now enabled for OAuth users. Protection, universal.
- **Queue behaviour** — Default FIFO ordering and partial text preservation on interrupted turns. Conversations, unbroken.

### Fixes

- **Onboarding deadlock** — Fixed Continue button becoming unresponsive during workspace setup auth refresh. Progress, unblocked.
- **Google Workspace OAuth** — App no longer jumps ahead before workspace auth completes. Patience, built in.
- **Onboarding workspace default** — Draft mutations no longer cancel workspace auto-selection. Setup, smoother.
- **External links** — URLs in document preview now open in your system browser, not the preview drawer. Links, liberated.
- **Plaud auth** — Fixed missing auth check that could break Plaud integration. Recording, reconnected.
- **Automation messaging** — Restored message-sending capability dropped during a recent refactor. Automations, communicating again.
- **Auth config** — Hardened auth configuration loading for more reliable startup. Reliability, reinforced.

---

## v0.4.1 — Feb 9-10, 2026

### Highlights

<!-- detail: Rebel now defaults to Opus 4.6 with a 1M token context window for new users. This means longer conversations, better recall across sessions, and more capable responses out of the box. Existing users keep their current settings. -->
- **Smarter defaults** — New users now start with Opus 4.6 and a 1 million token context window. More capability, from the start.
<!-- detail: Connect your Microsoft SharePoint directly to Rebel. Access files, search across sites, and pull documents into conversations. Uses incremental consent so you only grant the permissions you're comfortable with. -->
- **Microsoft SharePoint** — Connect SharePoint to Rebel for file access, search, and document retrieval. Your enterprise files, accessible.
<!-- detail: Google Drive integration now uses read-only permissions and supports shared drives. You can list, search, and download files from any shared drive you have access to — not just your personal My Drive. -->
- **Google Drive shared drives** — Access files from shared drives, not just your personal drive. Collaboration, expanded.

### Improvements

<!-- detail: Documents now save automatically as you edit. The old Save/Cancel buttons are replaced with a simple Done button. No more lost changes from forgetting to save. -->
- **Auto-save in documents** — Edits save automatically. Just click Done when you're finished. Save anxiety, eliminated.
- **Better onboarding** — New "Meet Rebel" intro step, privacy notice before EULA, and trust signals replace jargon. First impressions, refined.
- **Friendlier approvals** — Tool names now display in plain English across all approval prompts. Clarity, consistent.
- **Settings organisation** — Sidebar items grouped by purpose with visual dividers. Finding things, easier.
- **Inbox voice input** — Double-tap-to-send and post-use lockout fixed. Voice input works reliably now. Speaking, unblocked.
- **Privacy policy update** — Clearer language about telemetry, local speech-to-text, and data handling. Transparency, updated.
- **Automation access rules** — Unattended automations now have configurable access controls. Guardrails, in place.

### Fixes

- **Session recovery** — Interrupted sessions now save corrections to disk properly. Progress, preserved.
- **Inbox context input** — Text no longer disappears mid-typing from background updates. Words, kept.
- **Memory notifications** — File staging changes now broadcast correctly. Awareness, restored.
- **Notification auto-open** — Approval panel opens automatically when notifications arrive. Attention, directed.
- **Library editor** — Tab switching and editor view crashes fixed. Browsing, smooth.
- **YouTube embeds** — Chat embeds work correctly in the production app. Media, reliable.
- **Pill text overflow** — Long text in conversation pills no longer overflows. Layout, tidy.

---

## v0.4.0 — Feb 6-9, 2026

### Highlights

<!-- detail: Council Mode lets Rebel consult multiple AI models simultaneously—Claude, GPT, Gemini, and others—then synthesize their answers. Configure model profiles in Settings with provider presets for OpenAI, Google Gemini, Together AI, and Cerebras. Each council member runs in parallel as a subagent, with no cap on the number of models. Great for cross-checking research, getting diverse perspectives, or validating important decisions. -->
- **Council Mode** — Rebel can now consult multiple AI models in parallel and synthesize their responses. Get cross-checked answers from Claude, GPT, Gemini, and more—all in one conversation. Perspectives, multiplied.
<!-- detail: Navigate long documents with a clickable outline sidebar. Headings are extracted automatically from your document content and displayed in both the editor and preview panels, with smooth-scroll navigation to any section. Code block headings are correctly skipped. -->
- **Document Outline** — Long documents now have a navigable outline sidebar in both editor and preview. Jump to any section instantly. Structure, visible.
### Improvements

<!-- detail: The approval flow now uses conversational "Allow X?" phrasing instead of internal developer jargon. The StickyApprovalStack has been rebuilt with data-driven navigation for clearer, more intuitive approval workflows. -->
- **Friendlier Approvals** — Approval prompts now use plain "Allow X?" language instead of technical jargon, with a redesigned navigation flow. Clarity, earned.
<!-- detail: Internal component restructuring and renderer memory improvements. Parallel session overhead reduced with watcher consolidation and IPC deduplication. -->
- **Performance tune-up** — Reduced memory usage and smoother parallel sessions. The plumbing, tightened.
- **Sub-agent detail view** — Expand any sub-agent to see its prompt and result. Transparency, deep.
- **Notification polish** — Bell icon upgraded with pulse badge, dismiss button, and proper empty state. Notifications, refined.
- **Library icons** — Skill and category icons updated for visual consistency. Polish, applied.
- **API key walkthrough** — Claude setup section in Settings now links to a step-by-step API key guide. Setup, guided.
- **Agent Tool Control** — Rebel can disable problematic tools on-the-fly during a session. Self-healing, enabled.
- **Time Saved estimates** — Impact weighting makes productivity estimates smarter, with a delightful UI for high-impact work. Value, visible.
- **Meeting title enrichment** — Meeting titles now pull from your calendar for better context. Meetings, named.
- **Approval queueing** — Continuation messages queue when the agent is busy instead of being lost. Reliability, compounded.
- **Composer drafts** — Drafts persist across session switches. Your words, safe.
- **Export timestamps** — Markdown exports now include date-time in the filename. Organization, automatic.
- **Inbox navigation** — Background task approvals route you to the Inbox. Approvals, findable.
- **Turn usage detail** — Tooltip now shows thinking effort, auth method, and fallback info per turn. Transparency, granular.
- **Clean reinstall guide** — New help doc walks you through a fresh start if things go sideways. Recovery, documented.

### Fixes

- **Preview TDZ crash** — Fixed a startup crash in the document outline preview panel. Stability, restored.
- **Markdown rendering** — Bullet lists, numbered lists, tables, and blockquotes render correctly again. Formatting, fixed.
- **Staged tool errors** — Failed tool executions now show an error instead of silently failing. Honesty, enforced.
- **Editor smooth scroll** — Clicking outline headings scrolls smoothly to the right spot. Navigation, fluid.
- **Help menu dots** — Replaced pulsing glow with static status dots for a calmer look. Calm, maintained.
- **Settings chevron** — Advanced toggle arrow now points the right way. Arrows, corrected.
- **Memory conflicts** — Duplicate memory writes detected and prevented upfront. Data, clean.
- **Auto-speak on switch** — TTS no longer fires unexpectedly when switching conversations. Silence, restored.
- **History session race** — Fixed stale state and cache-miss race when opening old conversations. History, reliable.

### Under the Hood

- Council Mode: multi-model proxy with OpenAI, Gemini, Together AI, and Cerebras provider presets
- Internal component refactoring for maintainability
- File watcher consolidation reduces descriptor usage across sessions
- Windows startup and turn latency improved with 4 targeted fixes
- Context window: always request 1M tokens when the setting is enabled, removing lazy escalation
- MCP stale path reconciliation on startup for more reliable tool connections
- Safe dependency upgrades and electron-updater build externalization

---

## v0.3.16 — Feb 5-6, 2026

### Highlights

<!-- detail: Granola MCP now surfaces AI-generated meeting summaries from documentPanels and supports attendee search, so you can find meetings by who attended or search across AI notes—not just transcripts. -->
- **Granola Meeting Search** — Find meetings by attendee name and search across AI summaries, not just raw transcripts. Your meetings, searchable.
<!-- detail: When the system runs low on file descriptors (ENFILE), the search index now gracefully pauses instead of spiraling into a CPU storm. A toast notification tells you what happened, and operations resume automatically when resources free up. -->
- **Search Index Resilience** — Rebel handles file descriptor exhaustion gracefully instead of spinning up CPU storms. Stability, earned.
<!-- detail: Microsoft OAuth tokens now persist across cold starts, so you won't need to re-authenticate after restarting Rebel. If the browser-based auth flow fails, you'll see a clear error message instead of a silent failure. -->
- **Microsoft Auth Persistence** — OAuth tokens survive app restarts. No more re-authenticating every time you relaunch. Persistence, achieved.

### Improvements

- **PPTX & RTF attachments** — Attach PowerPoint and RTF files directly to conversations. More formats, more context.
- **Claude Max setup guide** — Expandable setup instructions for Claude Max tokens in Settings, with individual-account clarification. Setup, guided.
- **Opus 4.6 everywhere** — Model dropdowns now include Opus 4.6 across all settings. Options, current.
- **Thinking effort wired** — The thinking effort setting now actually controls Claude's reasoning depth. The knob, connected.
- **Turn usage clarity** — Turn Usage tooltip shows which model(s) actually handled each turn. Transparency, improved.
- **Library terminology** — "Sync" renamed to "Reindex" with clearer enhancement tooltips. Words, precise.
- **Voice key flexibility** — Save your OpenAI key even with no credits—Rebel warns instead of blocking. Access, unblocked.
- **Chief of Staff banner** — Shows immediately when you open the Library. Guidance, instant.
- **Composer icons** — Send-now buttons use a cleaner horizontal send icon. Polish, applied.

### Fixes

- **Tool staging hardened** — Execution lock, allowlist trust, and status fixes make the approval flow more reliable. Safety, reinforced.
- **Library background refreshes** — No more disruptive UI takeovers during background index updates. Browsing, uninterrupted.
- **File watcher debounce** — Converted from throttle to true debounce with max-wait for smoother change detection. Responsiveness, tuned.
- **Windows paths** — Path separators handled correctly in splitting and matching. Cross-platform, closer.
- **Permission modes cleaned** — Removed broken permission modes from settings dropdown. Clutter, removed.
- **Connector duplicates** — Removed duplicate "Set up with Rebel" button for bundled connectors. UI, tidied.
- **Archive tooltip** — Fixed grammar to say "when input is empty." English, respected.
- **Teams connector docs** — Corrected Microsoft Teams presence claim. Accuracy, restored.

### Under the Hood

- Auto-update observability improved with pino adapter, persistent state, and Sentry instrumentation
- REBEL-NA/NF error captures deduplicated with errorSource tagging
- rebel-system docs updated: file attachments guide, Opus 4.6 model docs, Microsoft 365 corrections, Granola connector page

---

## v0.3.15 — Feb 6, 2026

### Highlights

<!-- detail: Granola meeting notes are now deeply searchable. Find meetings by attendee name, search across AI-generated summaries, and use multi-word queries that match all terms. No more scrolling through endless meeting lists. -->
- **Granola Search Supercharged** — Search meetings by attendee, AI summary content, or multiple keywords at once. Your meetings, findable.
<!-- detail: Claude Opus 4.6 is now available in model dropdowns. Higher capability, same workflow. -->
- **Opus 4.6 Support** — The latest Claude model is now available in Settings. Smarter conversations, unlocked.

### Improvements

- **Model usage transparency** — Turn Usage tooltip now shows which model actually handled each turn. Clarity, provided.
- **Microsoft Mail folder names** — Folder display names now resolve correctly instead of showing IDs. Readability, restored.
- **Settings clarity** — Removed broken permission modes, added helpful tooltips. Confusion, eliminated.
- **Thinking effort wired** — The thinking effort setting now actually takes effect. Settings, working.
- **Library terminology** — "Sync" renamed to "Reindex" for clearer intent. Words, meaningful.
- **Claude Max setup guide** — Expandable instructions for individual account token setup. Guidance, provided.
- **Connector cleanup** — Removed duplicate setup buttons for bundled connectors. Clutter, removed.

### Fixes

- **Microsoft Teams docs** — Corrected presence monitoring claims in connector catalog. Accuracy, restored.
- **Composer icons** — Send-now buttons use consistent horizontal icon. Design, unified.

### Under the Hood

- Sentry error deduplication with source tagging
- Granola MCP expanded with documentPanels AI summaries
- Help documentation updates for file attachments and AI models

---

## v0.3.14 — Jan 31 - Feb 5, 2026

### Highlights

<!-- detail: When your conversation approaches the 200K token limit, Rebel automatically switches to Anthropic's 1M context window. A small indicator appears so you know when this happens. Previously, you'd hit a wall—now conversations can grow 5x larger before needing to be compacted. -->
- **Lazy 1M Context** — Rebel now escalates to 1M tokens only when needed, with clear UI indicator. Big conversations, handled gracefully.
<!-- detail: Rebel uses your idle time (when you focus the composer but haven't sent a message yet) to pre-warm Anthropic's prompt cache with your system prompt and MCP tools. When you send your first message, the server already has your context ready—reducing first-response latency by 30-50% and lowering API costs since cached tokens are ~90% cheaper. -->
- **Faster First Responses** — Rebel warms up while you're thinking, so your first message gets answered faster. The wait, shortened.
<!-- detail: When you minimize Rebel or switch to another app, GPU-intensive background workers (like the semantic search embedding generator) automatically pause. They resume when you return. This can significantly reduce CPU and power usage when Rebel is running but not in active use. -->
- **Visibility-Based CPU Throttling** — GPU workers idle when app is minimized or hidden. Your battery, thanked.
<!-- detail: Mark specific files as "always approve" so Rebel can write to them without asking each time. Perfect for frequently-updated files like your daily notes or task lists. The setting persists across sessions and can be managed in Settings. -->
- **Remember File Approvals** — Tell Rebel to always allow saves to specific files. One approval, done forever.
<!-- detail: The sidebar now shows Conversations, Automations, or both with a simple filter. Automations have their own visual identity with approval badges showing pending items. -->
- **Unified Sidebar History** — Conversations and automations now share one sidebar with clear visual distinction. Everything, in one place.

### Improvements

- **Search index reliability** — Semantic search stays stable with serialized mutations and smarter error handling. Fewer rebuilds, fewer surprises.
- **Inline schedule editing** — Edit automation schedules directly via popover. Scheduling, streamlined.
- **Streak tier visuals** — See your progress tier and personal best in the new unified Progress indicator. Motivation, visualized.
- **Start Journey banner** — Clear entry point to begin or continue your Rebel journey. Discovery, guided.
- **Chief of Staff staging** — Memory writes to Chief of Staff now use the pending folder. Privacy, preserved.
- **Transparency upgrade** — Pending memory changes now live in your actual `Chief-of-Staff/memory/pending/` folder, not some hidden internal void. Easier to see, easier to sync. You're welcome.
- **Space name in approvals** — Memory approval dialogs now show which Space you're writing to. Context, clarified.
- **Account filter tabs** — Connectors panel restored with account filtering. Organization, restored.
- **Calendar date steering** — LLMs now verify dates are correct when using Calendar tools. Dates, reliable.
- **ElevenLabs keyterms** — Custom vocabulary for voice recognition. Your jargon, understood.
- **Conversation ratings** — Thumbs up/down feedback on conversations helps improve the experience. Feedback, welcome.
- **Library favourites** — Star your most-used files for quick access in a new Favourites section. Access, instant.
- **Batch approvals** — Approve multiple pending items at once from the inbox. Efficiency, multiplied.
- **Notification bell** — New header bell shows pending approvals at a glance. Awareness, at a glance.
- **Mind map input** — Brainstorm visually with the new mind map attachment. Thinking, visualized.
- **Image attachments inline** — Images now render directly in conversation. Context, visible.
- **Export conversation logs** — Debug issues with new Export Logs action. Troubleshooting, simplified.
- **Onboarding polish** — Cleaner wizard with EULA in welcome, skip API keys if already set. Setup, smoother.

### Fixes

- **Embedding OOM prevention** — Batch size reduced and tensors disposed after inference. Memory, managed.
- **Draft loss on switch** — Rapid session switching no longer loses drafts. Your words, preserved.
- **Auto-archive per-session** — Toggle now persists correctly per conversation. Preferences, remembered.
- **Watchdog SDK stalls** — Better status messages when Claude is thinking hard. Waiting, informed.
- **Edit while busy** — Shows 'Save & re-run' instead of confusing 'Queue'. Actions, clear.
- **macOS ShipIt fix** — Auto-update race condition resolved. Updates, reliable.
- **Auto-scroll stability** — No more jumping during agent thinking. Reading, uninterrupted.
- **Streaming duplicates** — Fixed duplicate text appearing during responses. Output, clean.
- **SDK race condition** — Spawn delay prevents concurrent turn conflicts. Reliability, improved.
- **Intel Mac support** — LanceDB downgraded for darwin-x64 compatibility. Older Macs, supported.

### Under the Hood

- Claude Agent SDK upgraded to 0.2.22
- Daily cost summary analytics for usage visibility
- CPU metrics in periodic diagnostic logging
- File watcher event counting for performance analysis
- React 19 Fragment ref warnings fixed
- Performance tracing infrastructure added
- Session switching optimized
- Billing errors silenced from Sentry (tracked separately)

---

## v0.3.13 — Jan 30-31, 2026

### Highlights

- **Enterprise Onboarding Simplified** — Removed initFromConfig step for cleaner team setup. Setup, streamlined.
- **Version Banner Polish** — Improved channel detection and dark mode styling. Updates, visible.

### Improvements

- **Coach responsiveness** — Onboarding coach sessions now use automation mode for snappier responses. Guidance, faster.
- **Connector account identity** — Manual setup connectors now track email/workspace. Context, remembered.
- **Long-press archive** — Restored with bug fixes. One-tap archiving, back.

### Under the Hood

- Auto-update ShipIt compatibility fixes
- API key redaction consolidated
- MCP connector accountIdentity support

---

## v0.3.12 — Jan 28-29, 2026

### Highlights

<!-- detail: Previously, when Rebel wanted to save something to your memory spaces, it would pause and wait for your approval. Now, staged writes happen in the background—Rebel continues working while files queue up for your review. You'll see pending files in a bottom bar, and can approve or reject them whenever you're ready. This means longer, more productive conversations without interruption. -->
- **Memory Safety Default** — Staged writes are now the default behavior. Rebel keeps working while you review memory updates. Flow, uninterrupted.
<!-- detail: Tool safety approvals (when Rebel wants to use a potentially risky tool) and memory write approvals now share the same bottom bar UI. Instead of separate dialogs appearing at different times, all pending decisions are consolidated in one place. You can review and approve them in batch, or dismiss individual items. -->
- **Unified Approval Bar** — All approvals (memory, tool safety) now appear in one clean bottom bar. Decisions, consolidated.
<!-- detail: The onboarding flow for teams has been compressed from 5-7 minutes to under 3 minutes. We removed redundant steps, parallelized background syncs, and streamlined the permission requests. New team members can start being productive faster. -->
- **Faster Group Onboarding** — Group onboarding streamlined to 2-3 minutes max. Time to value, shortened.

### Improvements

- **Staged files inline** — See staged memory files directly in your conversation for easier review. Context, visible.
- **Clearer file badges** — New vs edit indicators make it obvious what's being created versus modified. Intent, transparent.
- **Use case resilience** — Use cases now save even when embedding generation fails. Progress, preserved.
- **Publish dialog clarity** — "Cancel" renamed to "Close" (file is preserved), and Publish disabled when you've typed revision instructions. Accidents, prevented.
- **Dark mode contrast** — Improved text contrast and panel backgrounds for better readability. Eyes, rested.
- **Sidebar clicks fixed** — Search hover area no longer blocks interaction. Navigation, unblocked.
- **Stop button reliability** — Eliminating 'Failed to stop run' errors with idempotent handling. Control, reliable.
- **Stale busy state fixed** — Sessions no longer show as busy when they're not. Status, accurate.
- **Folder link navigation** — Library folder links now navigate correctly. Links, working.

### Under the Hood

- MCP Apps Phase 1-3 infrastructure complete
- Embedding cooldown optimization for faster crash recovery
- Voice hotkey stability improvements for Windows
- React 19 compatibility via .npmrc legacy-peer-deps
- Background session data loss prevention
- E2E test stability improvements
- rebel-system skill organization updates

---

## v0.3.11 — Jan 27-28, 2026

### Highlights

- **Windows Performance Fix** — Session replay disabled to eliminate UI lag on Windows. Responsiveness, restored.
- **Glass Panel UI** — Redesigned app shell with floating glass panels for cleaner visual hierarchy. The aesthetic, elevated.
- **Meeting Bot Smarter** — Improved Q&A prompts, faster local stop detection, and persistent live transcripts. Your meetings, sharper.
- **Staged Memory Writes** — Non-blocking approval flow means Rebel can keep working while you decide on memory updates. Efficiency, unblocked.
- **Semantic Indexing Returns** — Re-enabled on Windows after stability fixes. Deep search is back.

### Improvements

- **Cloud storage warnings** — Add Space wizard now warns about OneDrive, Google Drive, and iCloud sync issues with actionable guidance. Clarity, added.
- **Update progress** — Download progress now visible during app updates. Waiting, informed.
- **Inline document editing** — Edit files directly in the Library preview drawer. Convenience, in-place.
- **Automation conversations** — "View conversation" now works for automation runs. History, accessible.
- **Onboarding polish** — Welcome card redesign, reveal tour with mascot, and cloud storage app download step. First impressions, improved.
- **Settings/help reorder** — Menu items reorganized by actual usage frequency. Navigation, optimized.
- **Library timestamp** — Up-to-date tooltip now shows when index was last refreshed. Status, dated.
- **Scratchpad moved** — Now lives in the Inbox tab instead of top bar. Organization, consolidated.

### Fixes

- **Session flash** — Fixed conversation pane flash when opening history sessions. Transitions, smooth.
- **Offline banner** — Improved contrast for both light and dark modes. Visibility, consistent.
- **Embedding OOM** — Batch size limits prevent crashes on large workspaces. Memory, managed.
- **Twitchy UI** — Disabled router phase detection that was causing visual jitter. Stability, settled.
- **Redundant toasts** — Removed unnecessary success notifications. Noise, reduced.
- **Sentry renderer** — Wrapped import in try-catch to prevent crashes. Resilience, improved.

### Under the Hood

- E2E test infrastructure overhaul: parallel execution, mock infrastructure, 9 independent domain files
- ~100x faster startup with index-only session loader
- Stop-turn race condition eliminated
- AbortController re-registration on retry paths
- Platform-specific background throttling (Windows only)
- RAF loop pausing when document hidden
- Voice hotkey registration wrapped for Windows startup

---

## v0.3.10 — Jan 25-26, 2026

### Highlights

- **Gamification Complete** — Phase 4 lands with fluency tiers, evidence-based progression, and 27 new badges across expanded progression categories. Your growth, quantified.
- **Lazy Session Loading** — Sessions now load on-demand instead of all at once on startup. Memory usage down, startup speed up. Performance, optimized.
- **Deep Search Mode** — Expanded semantic indexing budget for more comprehensive search results. Find what you're looking for, even if it's buried deep. Discovery, enhanced.
- **Smarter Meeting Mentions** — @-mentioning meetings now injects AI-generated summaries instead of raw transcripts. Cleaner context, better answers.
- **Windows Stability** — Semantic indexing disabled by default on Windows, plus multiple Squirrel update corruption fixes. The platform, stabilized.

### Improvements

- **Cmd+Enter auto-archive** — Toggle auto-archive mode while Rebel is busy without interrupting. Control, contextual.
- **Smarter archive flow** — After archiving, Rebel intelligently selects your next conversation. Navigation, smoother.
- **Demo seeding** — Option to populate demo mode with sample content for richer testing. Demos, realistic.
- **Memory approvals collapsed** — Continuation messages for memory writes now collapsed by default. Conversations, cleaner.
- **LinkedIn export skill** — Parse and organize your LinkedIn data export. Your network, structured.
- **Chief-of-Staff privacy** — Writes to Chief-of-Staff space auto-approved as private. Your assistant, trusted.
- **Journey progress** — Next tier gap analysis shows exactly what's needed to level up. Progress, transparent.
- **Onboarding voice mode** — First coaching message can now be voice-only. Immersion, immediate.

### Fixes

- **Onboarding restart** — All Phase 0 state resets properly when restarting onboarding. Fresh starts, truly fresh.
- **Goal format detection** — Array-format personal goals now correctly detected for auto-healing. Edge cases, caught.
- **Archive tooltip** — Clarified shortcut behavior description. Accuracy, improved.
- **Session summaries** — Sidebar now syncs properly on metadata mutations. State, consistent.
- **HMR stability** — No more webFrameMain disposed errors during hot reload. Development, smoother.

### Under the Hood

- Batch embedding generation for faster file indexing
- WebGPU reliability improvements on Windows
- LanceDB batch deletes for stale entry cleanup
- Health check polling interval increased to 3 minutes
- Breadcrumb serialization optimization
- MCP health check added to CI pipeline
- RebelInternal tools split with migration support
- Memory timestamp enforcement in rebel-system
- Shutdown rejection filtering in Sentry
- DISABLE_ANALYTICS env var for test isolation

---

## v0.3.9 — Jan 23-25, 2026

### Highlights

- **Stability & Reliability** — Broad sweep of agent and MCP bugfixes. Connectors reconnect gracefully after updates, embedding workers dispose cleanly, and JSON parsing handles edge cases. The plumbing, reinforced.
<!-- detail: Calendar events now sync directly through Google Calendar API and Microsoft Graph API instead of through MCP connectors. This eliminates the startup delay from MCP tool discovery and provides faster, more reliable access to your schedule. Meetings appear in The Spark within seconds of being created. -->
- **Direct Calendar Sync** — Google and Microsoft calendars now sync directly via API, faster and more reliable than MCP. Scheduling, accelerated.
- **The Spark Revamped** — New goal header, improved sections, and community card. Your dashboard, upgraded.
<!-- detail: Enable auto-archive mode with Cmd/Ctrl+Enter and Rebel will automatically archive conversations when they naturally conclude. Before archiving, a lightweight AI check (using Claude Haiku) evaluates whether the conversation contains any unfinished business or follow-up items. If it does, Rebel won't archive automatically—ensuring nothing important gets buried. -->
- **Auto-Archive Mode** — Toggle "fire and forget" mode to auto-archive conversations when complete. Haiku evaluates safety before archiving. Cleanup, automated.
<!-- detail: When using models with extended thinking capabilities, Rebel now shows the thinking process in a separate collapsible section. You can watch Claude reason through complex problems step by step, then see the final response separately. This makes it easier to understand how conclusions were reached and to verify the reasoning. -->
- **Extended Thinking** — Thinking content now displays separately during extended thinking mode. Transparency, improved.
<!-- detail: Tasks you create (like "remind me to follow up" or "add this to my todo list") now persist across conversations using Claude's SDK Task tools. Previously, tasks existed only within a single conversation. Now Rebel maintains a persistent task list that carries forward, so you can ask about your pending tasks in any conversation. -->
- **SDK Task Tools** — Rebel now uses SDK Task tools for persistent task management across conversations. Memory, persistent.
<!-- detail: A new Achievement Hub in The Spark shows all your earned badges, your progress through the 14-day onboarding journey, and a summary of time saved through Rebel usage. Badges are earned through consistent usage patterns, trying new features, and building productive habits. -->
- **Achievement Hub** — Unified view of your badges, 14-day journey progress, and time saved. Progress, celebrated.
<!-- detail: New users now go through a voice-guided onboarding experience. Rebel introduces itself, explains key features, and walks you through setup with personality and encouragement. Along the way, you earn badges and see your progress on a 14-day journey. After setup completes, a brief tour highlights the main UI elements. -->
- **Onboarding Coach** — New Phase 0 guided setup with Rebel voice, gamification, and a reveal tour of key features. The welcome wagon, upgraded.
<!-- detail: Demo Mode now starts with a proper setup dialog where you can choose to use your own API key or a demo key. It creates a realistic ACME Corp workspace with sample files and conversations, and completely isolates demo data from your real data. When you exit Demo Mode, everything resets cleanly. -->
- **Demo Mode Overhaul** — Start Demo Mode dialog with API key option, auto-created ACME Corp workspace, and proper data isolation. Demos, polished.

### Improvements

- **Automation file links** — Click to open generated files directly in Library. Navigation, streamlined.
- **Native context menu** — Right-click cut/copy/paste works everywhere. Expected behavior, delivered.
- **Conversation context menu** — Right-click in conversation whitespace for copy/cut/paste options. Convenience, contextual.
- **Sidebar context menu** — Right-click conversations in sidebar for archive/delete/pin options. Organization, one-click.
- **Inbox voice input** — Add instructions to inbox cards using voice-to-text. Hands-free, enabled.
- **Inbox execution actions** — Split button for "Go & Archive" or "Go & Pin" task execution. Workflow, streamlined.
- **Inbox double-tap mic** — Double-tap mic to send and archive inbox tasks instantly. Speed, doubled.
- **Per-account connector disable** — Disable individual Google Workspace accounts without disconnecting others. Control, granular.
- **Unified memory approvals** — Consistent approval UX across Inbox and Memory Tab. Experience, harmonized.
- **Sonner toasts** — Replaced custom toast system with Sonner for cleaner notifications. Polish, applied.
- **Focus onboarding** — Improved onboarding UX for The Spark focus feature. Guidance, smoother.
- **Inbox tooltips** — Hover collapsed items to preview content; click title to expand. Details, accessible.
- **Indexing progress** — Library info icon now shows indexing animation with progress tooltip. Status, visible.
- **14-day journey redesign** — More delightful card with Rebel voice and proper spacing. Motivation, visual.
- **Guided reveal tour** — After coach completes, a tour highlights key features with suppressed notifications. Discovery, guided.
- **Chained Google OAuth** — Sign in with Google now chains directly to Google Workspace OAuth. One less click.
- **Smart goal healing** — Haiku auto-restructures malformed goals into proper YAML frontmatter. Your intentions, preserved.
- **Zendesk OAuth** — Zendesk connector now uses OAuth instead of API tokens. Security, upgraded.

### Fixes

- **Corrupted settings** — Helpful error dialog when settings file is corrupted instead of silent failure. Problems, explained.
- **Calendar automation** — Daily sync at 7am instead of broken hourly. Reliability, improved.
- **MCP paths after update** — Bundled connectors now repair themselves after app updates. Upgrades, smoother.
- **YouTube tutorials** — Fixed iframe embed not loading in tutorials. Learning, unblocked.
- **Disable toggle restored** — MCP disable/enable toggle accidentally removed has been restored. Tools, manageable.
- **Message queuing** — ENTER and double-tap voice now queue messages when Rebel is busy. No more lost input.
- **Large audio files** — Voice recordings now chunked to prevent transcription failures. Long recordings, handled.
- **Auto-archive edge cases** — Fixed archive behavior when editing messages or using explicit archives. Consistency, restored.
- **Onboarding journey gaps** — Fixed journey start, badge tracking, and mini-lesson progression. The path, unbroken.

### Documentation

- OneDrive/SharePoint setup guide for shared spaces
- Bitdefender GravityZone AV exclusion instructions
- Workspace and app data exclusion guidance for antivirus performance
- Running big jobs guide for complex tasks
- Enterprise onboarding guidance for IT teams
- Pausing indexing section in file search docs

### Under the Hood

- Zod 4.x and claude-agent-sdk 0.2.17 upgrade
- Embedding worker serialization and ack-based disposal
- Safe JSON parsing for model responses
- Connector state protection during connection attempts
- TypeScript type checking improvements
- OAuth→API key fallback for 1M context access
- ONNX thread limiting on Windows for reduced CPU usage
- LanceDB failure reporting on Windows
- Squirrel update failure diagnostics
- Fixed Zod dual-instance issue in super-mcp
- Memory registry leak prevention
- Tool display name sanitization for security
- Windows corrupt app folder cleanup
- Demo mode storage isolation via app.setPath()
- Automation catch-up skip for new users

---

## v0.3.8 — Jan 19-22, 2026

### Highlights

<!-- detail: Your inbox tasks now display in a 2x2 Eisenhower Matrix grid based on urgency and importance. Click any quadrant to focus on just those tasks. This helps you tackle "urgent and important" items first, schedule "important but not urgent" work, delegate "urgent but not important" tasks, and eliminate the rest. Drag tasks between quadrants to re-prioritize. -->
- **Eisenhower Matrix** — Inbox now has a 2x2 grid for urgent/important prioritization with focus mode for single-quadrant drill-down. Your tasks, strategized.
<!-- detail: If Rebel crashes repeatedly on startup (3+ times), it now automatically enters Safe Mode. In Safe Mode, potentially problematic features are disabled, and Rebel opens a troubleshooting conversation to help diagnose what went wrong. You can also trigger Safe Mode manually by holding Shift during startup. Logs from the crashes are automatically included in the conversation. -->
- **Emergency Recovery** — New P0 recovery for startup hangs plus Safe Mode auto-opens a troubleshooting conversation. Problems, self-diagnosing.
- **New Connectors** — Six new MCPs: Zapier, ClickUp, Dropbox, Airtable, DocuSign, and Calendly. Plus Granola for local meeting notes and PostHog for analytics. Your ecosystem, connected.
<!-- detail: HubSpot integration expanded from basic CRM access to 65 tools covering the full platform: contact lists and segments, product catalog and line items, marketing forms, analytics dashboards, email campaigns, and more. If you use HubSpot for sales or marketing, Rebel can now help with nearly any task. -->
- **HubSpot Powerhouse** — 65 tools now available: lists, segments, products, line items, forms, analytics, marketing emails, and more. CRM, comprehensive.
<!-- detail: Create AI-powered presentations directly from conversation. Describe what you want, and Rebel uses Gamma's API to generate professional slide decks with appropriate themes, layouts, and AI-generated images. You can iterate on the design, add or remove slides, and export the final presentation. -->
- **Gamma API v1.0** — Full Gamma support for AI-powered presentations. Create decks, themes, and images directly from Rebel. Presentations, automated.
<!-- detail: The meeting bot now waits for natural sentence boundaries before responding, using semantic understanding to detect when someone has finished their thought. Previously, brief pauses could trigger premature responses. Now you can pause to think without Rebel jumping in mid-sentence. -->
- **Smarter Meeting Bot** — Semantic query accumulation prevents mid-sentence cutoffs. No more "wait, I wasn't fin—" moments. Conversations, complete.
<!-- detail: You can now temporarily disable a connector without disconnecting it entirely. This preserves your authentication and settings while preventing Rebel from using those tools. Useful when a connector is misbehaving, or when you want to focus on specific tools for a task. Re-enable anytime from Settings. -->
- **Connector Control** — Disable/enable MCP connectors without disconnecting them. Your tools, your way.

### Improvements

- **Voice preview** — Listen to TTS voices before selecting them in Settings. Try before you commit.
- **Pending approvals strip** — Background automation requests now show in a visible strip. No more hidden waiting.
- **Inbox task drafts** — Pre-made deliverables can now be attached to inbox tasks. Preparation, rewarded.
- **Inbox execution state** — Visual feedback when tasks are being executed. Progress, visible.
- **Inbox tools for agents** — Comprehensive MCP tools let Rebel manage your inbox directly. Delegation, enabled.
- **Teams URL extraction** — Meeting bot now requests Full Disk Access for Microsoft Teams. Permissions, explained.
- **Maturity badges** — Features like Scratchpad and The Spark now show their development stage. Expectations, set.
- **Terminology updated** — "Chat" is now "conversation" throughout the app. Language, consistent.
- **Notetaker default** — New users start with notetaker set to "never" join. Consent first.
- **Scratchpad shortcut** — Keyboard shortcut hint now shown in tooltip and dialog. Power users, acknowledged.
- **Cancel while editing** — Visible cancel link when editing messages. Changed your mind? Easy exit.
- **Cleaner header** — "New conversation" shortened to "New", better icon spacing. Polish, applied.
- **Sidebar refresh** — Search bar integrated with action buttons, subtle scrollbar on hover. Density, improved.
- **Meetings collapsed** — "No meetings detected" now a compact icon with popover. Less noise, same info.

### Fixes

- **Scroll reliability** — Long conversations no longer fight your scroll position. Reading, uninterrupted.
- **Message preservation** — Multi-assistant turns no longer risk losing content. Your context, intact.
- **Draft persistence** — Drafts now flush to store before session reset. No more lost messages.
- **Limitless disconnect** — Disconnect button for Limitless Pendant now works properly. Cleanup, enabled.
- **Plaud reliability** — Fewer duplicate inbox items, better sync fallback chain. Recordings, cleaner.
- **Meeting bot triggers** — No more false voice triggers from non-owners or bot echo. Conversations, focused.
- **Feedback widget** — Send feedback with automatic diagnostics attachment. Your voice, heard.

### Under the Hood

- Windows AV resilience: signed Squirrel binaries, preflight warmup, watchdog
- Windows stability: crash-on-quit fix, unquoted path handling, version metadata
- Memory safety hardening: legacy fallback removed, multi-target Bash fixed
- Pre-turn worker offloading via utilityProcess
- Daily Sentry triage automation pipeline
- Meeting bot restart resilience for relay reconnection

### Documentation

- Windows security and antivirus guide
- Limitless transcripts import skill
- Date-calculations skill for reliable date arithmetic
- Safe Mode diagnosis support
- Chief of Staff briefing approach for transcript analysis

---

## v0.3.7 — Jan 14-19, 2026

### Highlights

<!-- action: rebel://settings/memory | author: Greg -->
<!-- detail: We replaced the confusing 4-level trust system with two simple options. "Always save" means Rebel writes to your memory without asking. "Ask, if content is sensitive" means Rebel uses AI to detect potentially sensitive content (personal info, credentials, private data) and prompts you before saving those. For shared spaces (used by your team), Rebel always prompts for sensitive content regardless of your setting—this is a safety floor that can't be bypassed. -->
- **Simplified Memory Safety** — Two clear options: "Always save" or "Ask, if content is sensitive." No more confusing trust levels. Shared spaces always prompt for sensitive content. Clarity, achieved.
<!-- action: rebel://settings/tools | author: Josh -->
<!-- detail: During meetings with the Rebel Notetaker, you can now interrupt Rebel mid-response by saying "Rebel" (or your custom trigger word). Rebel will stop talking and listen. When Rebel has something to say, its avatar pulses with a "ready to speak" animation—say "go ahead" to let it continue. This makes conversations feel more natural and collaborative instead of one-sided. -->
- **Meeting Bot Interruption** — Say "Rebel" to interrupt and "go ahead" to continue. Visual ready-to-speak state with avatar animation shows when Rebel has something to say. Conversations, collaborative.
<!-- action: rebel://conversation | author: Greg -->
<!-- detail: If your network drops mid-conversation (Wi-Fi hiccup, laptop sleep, etc.), Rebel now detects the interruption and offers to resume where it left off when you reconnect. This works even if you switch to a different conversation in the meantime. A modal appears explaining what happened and giving you the choice to continue or start fresh. -->
- **Network Resilience** — Auto-resume interrupted turns across multiple sessions with modal UI. Your work, protected.
<!-- action: rebel://conversation | author: Greg -->
<!-- detail: When you trigger Rebel with the global voice hotkey, it now automatically captures a screenshot of your current screen and includes it in the conversation. This means you can ask "what's wrong with this?" or "help me with what I'm looking at" without manually taking and attaching screenshots. The screenshot is captured at hotkey press, before you start speaking. -->
- **Voice + Screenshot** — Global voice hotkey now captures your screen automatically. Context, visual.
<!-- action: rebel://settings/tools | author: Josh -->
<!-- detail: The Browser Automation connector launches a Chrome instance that Rebel can control—clicking, typing, navigating, and reading page content. Unlike typical browser automation, your login sessions persist between uses. This means Rebel can access authenticated pages (your email, internal tools, dashboards) without you re-logging in each time. The browser runs visibly so you can watch what's happening. -->
- **Browser Automation** — New Chrome connector with persistent login sessions. Your browser, automated.
<!-- action: rebel://settings | author: Mel -->
- **Settings Redesign** — Navigation moves from horizontal tabs to a sidebar layout. Every section gets a proper header. Settings, organized.
<!-- action: rebel://conversation | author: Mel -->
- **Composer Overhaul** — Unified input container with collapsible message queue and simplified mode toggle. Cleaner, faster.
<!-- action: rebel://settings/tools | author: Greg -->
<!-- detail: Connect your GitHub account with one click using OAuth—no need to generate Personal Access Tokens or run Docker containers. Rebel can then search your repositories, read files, create issues, and review pull requests. Your GitHub credentials are stored securely and can be revoked anytime from Settings. -->
- **GitHub Direct** — New OAuth-based GitHub connector. No Docker, no PAT tokens. Just click and connect.

### Improvements

- **Voice recorder reliability** — Limitless and Plaud recordings now retry automatically with toast notifications. Recordings, resilient.
- **Stop recording button** — Physical recorder indicator now includes a Stop button in the header. Control, visible.
- **Mac Stickies skill** — Check your todos from sticky notes via voice. Desktop notes, accessible.
- **Auto-archive switch** — After archiving a conversation, Rebel switches to the next active session. Flow, uninterrupted.
- **Router evaluation UX** — Delightful Rebel avatar animation during pre-turn routing. Thinking, visualized.
- **Meeting bot avatar** — Interactive avatar with TTS announcements, trigger legend, and smooth animations. The bot, personified.
- **Voice/chat toggle** — Meeting bot can respond via voice or chat based on your preference. Response mode, yours.
- **Enter to stop** — Press Enter to stop recording when microphone is active. Recording, intuitive.
- **Delete running conversations** — Proper stop-first flow when deleting active conversations. Cleanup, graceful.
- **Trash button** — Empty button now lives inside expanded Trash section. Layout, cleaner.
- **Pre-turn router** — Dual semantic search enhances your queries before Rebel starts. Context, richer.
- **Space renaming** — Rename spaces and workspaces directly in the app. No more Finder trips.
- **Quick Open recent files** — Recent files section in Quick Open dialog. Your last edits, one keystroke away.
- **Personal goals & company values** — New goal-setting and values coaching on The Spark. Rebel guides you through vision-to-quarterly goal cascades (personal) and behavioral values discovery (company/team). Your ambitions and principles, structured.
- **Edit while busy** — Start editing your messages even while Rebel is still thinking. Impatience, rewarded.
- **Library edit mode** — Files open in edit mode by default. One less click.
- **Tool approval styling** — Informational styling reduces false alarm anxiety. Approval, calmer.
- **History filters** — Consolidated dropdown for cleaner sidebar. Less clutter, more conversations.
- **Library `Show: Memory`** — Redesigned to match the shared lens pattern. Consistency, achieved.

### Fixes

- **Timezone consistency** — System prompt now handles timezones more reliably. Dates, accurate.
- **Session binding** — Upstream session binding persists for non-focused sessions. Sessions, stable.
- **Scroll respect** — User scroll intent respected during streaming responses. Reading, uninterrupted.
- **Stop tooltip** — Correct "Esc Esc" shortcut shown in Stop button tooltip. Shortcuts, accurate.
- **Local speech-to-text** — ESpeakNG framework bundled properly for fresh installs. Your voice, heard.
- **Spark focus** — Settings now preserved when saving focus. Preferences, remembered.

### Under the Hood

- Session mode context in system prompts
- Physical recording state transition fixes
- Voice recorders documentation added
- Security path validation hardening
- MCP internal catalog consolidation
- E2E test reliability improvements
- Google Workspace Forms API support (feature-flagged)
- Super-MCP name_pattern filter for tool listing
- Slidev presentation generator skill
- Super-MCP tool discovery parallelized
- OAuth port binding fixes
- Windows E2E test stability improvements
- MCP tool naming standardization

---

## v0.3.6 — Jan 13-14, 2026

### Highlights

<!-- action: rebel://settings/tools | author: Josh -->
- **Plaud Voice Recorder** — Connect your Plaud physical recorder for automatic cloud sync. Files chunk intelligently, transcribe locally or via cloud, and store in your memory. Recording, everywhere.
<!-- action: rebel://settings/tools | author: Greg -->
- **HubSpot Read-Only Mode** — Free HubSpot accounts now work with automatic scope detection. Access your data even without paid features. The free tier, respected.
<!-- action: rebel://settings/tools | author: Greg -->
- **Salesforce Integration** — Connect your Salesforce account with OAuth. Your CRM, one conversation away.

### Improvements

- **HTML file preview** — Preview HTML files directly in the document drawer with sandboxed iframe rendering. Security notice included. Web pages, previewable.
- **Slack file downloads** — Download file attachments from Slack messages. Your files, accessible.
- **Tool approval paths** — Full file paths shown with tooltips in safety approval dialogs. Context, clear.
- **Limitless Pendant button** — Physical button detection now works on Limitless pendant. Press to record.
- **Create MCP Server skill** — New skill helps you build custom API integrations with security validation. Your APIs, connected.
- **Time Saved insights** — Click any day to filter conversations; modal shows top conversations and day-by-day breakdown. Understanding, included.
- **Settings polish** — Safety tab improvements, sidebar auto-collapse, content width constraints. Cleaner, calmer.
- **Image paste fixed** — Clipboard image paste now works correctly in composer. Screenshots, shareable.
- **Message queue filtering** — Queue tray shows only current session messages. Focus, maintained.

### Fixes

- **Conversation rendering** — Fixed thinking indicator overlap and ordering bugs. Smooth scrolling restored.
- **Connector naming** — Better UX and clearer names in connector settings. Labels, sensible.

### Under the Hood

- Super-MCP Windows compatibility improvements
- Auto-update architecture detection for wrong-arch installs
- E2E test reliability improvements with onboarding skip
- Meeting bot URL normalization for multi-user dedup

---

## v0.3.5 — Jan 5-13, 2026

### Highlights

<!-- action: rebel://settings/tools | author: Josh -->
- **Figma Local Connector** — Connect Figma with a Personal Access Token. Design files, components, and assets—all accessible from your conversations. Your designs, your control.
<!-- action: rebel://settings/tools | author: Josh -->
- **Multi-Workspace Slack** — Connect multiple Slack workspaces. Work, side project, community—all accessible, all separate. The disambiguation you didn't know you needed.
<!-- action: rebel://library | author: Greg -->
- **Quick Open** — Press Cmd/Ctrl+O to instantly open any file in your Library. Filter by Everything, Spaces, Skills, or Memory. Context-aware icons show you what you're looking at. Discovery, accelerated.
<!-- action: rebel://library | author: Greg -->
- **HTML Tutorials** — Tutorials now display beautifully in the Document Preview Drawer with syntax highlighting. No more raw HTML. Learning, polished.
<!-- action: rebel://search | author: Greg -->
- **Smarter Conversation Search** — Recency filters (last day, week, month), prefix boosting, and semantic re-embedding make finding past conversations actually useful. Your history, findable.
<!-- action: rebel://settings/tools | author: Josh -->
- **Multi-Account MCP Support** — Connect multiple accounts for the same service. Work Gmail AND personal Gmail. Salesforce sandbox AND production. Rebel tracks which email belongs where. Account disambiguation, solved.
<!-- action: rebel://settings/spaces | author: Greg -->
- **Space Email Associations** — Spaces now remember which accounts they work with. Set `domain.com` or specific emails per space, and Rebel automatically knows which Slack workspace, which Google account, which everything. Context without confusion.
<!-- action: rebel://conversation | author: Greg -->
- **Edit Any Message** — Edit any of your messages in a conversation, not just the last one. Rebel truncates from that point and resumes. Mistakes, correctable.
<!-- action: rebel://library | author: Mel -->
- **Library Overhaul** — The old tabs evolved into the lens model (`Show` + `View as`) with cleaner organization and navigation. Everything has a place.
<!-- action: rebel://library/atlas | author: Josh -->
- **Atlas AI Insights** — Click any file in Atlas for "The gist" summary or "Zoom out" to see how it relates to nearby files. Context, instant.
<!-- action: rebel://library/atlas | author: Josh -->
- **Atlas** — Interactive semantic graph visualization of your workspace. See how your files and spaces connect through meaning, not just folders. Click a space in the legend to focus. Your knowledge, mapped.
<!-- action: rebel://settings/tools | author: Josh -->
- **Limitless Pendant** — Connect your Limitless physical recording device for in-person meeting capture. Real-world conversations, digitally remembered.
<!-- action: rebel://composer | author: Greg -->
- **Typing Feels Fast Again** — Major performance fixes to the composer. Debounced draft sync and deferred sidebar updates mean your keystrokes keep up with your thoughts. Latency, eliminated.
<!-- action: rebel://conversation | author: Josh -->
- **Streaming Text Animation** — Watch responses appear smoothly as they're generated. No more jarring text blocks. The future types itself.
<!-- action: rebel://settings/tools | author: Greg -->
- **Agent Self-Management Tools** — 7 new RebelWorkspace tools let Rebel manage your spaces and skills programmatically. List spaces, search items, add skills—all from conversation. Your assistant, empowered.
<!-- action: rebel://conversation | author: Greg -->
- **Auto-Resume on Reconnect** — Network drops mid-conversation? Rebel picks up where it left off when you reconnect. Resilience, built in.
<!-- action: rebel://settings/voice | author: Greg -->
- **Local Speech-to-Text** — Transcribe your voice entirely on-device with the Parakeet V3 model. No audio leaves your computer. Privacy-first voice input for the privacy-conscious. Your words stay yours.
<!-- action: rebel://settings/tools | author: Greg -->
- **Zendesk Connector** — Support tickets, views, and comments accessible directly from Rebel. Customer context at your fingertips. Help desk, meet help desk.
<!-- action: rebel://settings/tools | author: Greg -->
- **Salesforce PKCE OAuth** — Enterprise-ready authentication with Cloudflare redirect. Secure, standards-compliant, and just works. The compliance team approves.
<!-- action: rebel://composer | author: Greg -->
- **Send & Archive** — Finish a conversation and archive it in one click. Inbox zero, one button closer.

### Improvements

- **Copy as Markdown** — Right-click any conversation and export it as clean Markdown. Your words, your format.
- **OAuth identity clarity** — Success messages now show which account and workspace you connected. No more "did that work?" moments.
- **MCP source badges** — Connectors now display source and maturity badges. Know what you're connecting to before you connect.
- **Atlassian resilience** — SSE transport fallback for Jira and Confluence when standard OAuth mode has issues. Reliability, quietly improved.
- **Conversation search filters** — Filter by time range: 1 day, 7 days, 30 days, or all time. Recent conversations surface faster.
- **@-mention ranking** — Skill folders now rank above individual .md files. What you want, where you expect it.
- **Document preview enhanced** — Copy path button, ESC to close, skills auto-open when selected. The little conveniences.
- **What's New sidebar widget** — See what's new without hunting for it. Personalized, with smart badge clearing.
- **Meeting preview indicators** — See which meetings have pre-scheduled bots. Planning, visualized.
- **Error feedback improved** — Toast notifications for agent turn failures now include actionable guidance. Errors that help.
- **Markdown callout blocks** — Enhanced rendering with callout blocks and soft breaks. Prettier documents.
- **Commands prompt for input** — No more `{{input}}` placeholder confusion. Commands ask for what they need.
- **Account filter tabs** — Filter your Connections panel by associated email. See just the work tools or just the personal ones. Organization that scales.
- **Voice recording persists** — Switch conversations mid-recording without losing your audio. Your voice, preserved across context switches.
- **Typing performance fixed** — That lag when typing fast? Gone. Subscription optimization for smoother keystrokes.
- **Meeting bot coordination** — Unified status aggregation for multi-bot setups. All your bots, one dashboard.
- **Diagnostics privacy levels** — Choose your export format with privacy in mind. Full diagnostic bundle or logs-only. Your choice.
- **Library selection submenu** — Select text, get Copy/Reply/Comment options before the dialog. Smoother annotation workflow.
- **Init-from-config dialog** — Now scrollable with collapsible sections. Enterprise configs that don't overwhelm.
- **Meetings display improved** — Shows meetings without URLs, filters declined events. Cleaner calendar view.
- **Deep-link to folders** — `rebel://` URLs now support folderPath for direct Library folder navigation. Bookmarks that work.
- **HTML file preview** — Preview HTML files directly in the document drawer with sandboxed iframe rendering. Security notice included. Web pages, previewable.
- **Slack file downloads** — Download file attachments from Slack messages. Your files, accessible.
- **Tool approval paths** — Full file paths shown with tooltips in safety approval dialogs. Context, clear.
- **Limitless Pendant button** — Physical button detection now works on Limitless pendant. Press to record.
- **Create MCP Server skill** — New skill helps you build custom API integrations with security validation. Your APIs, connected.
- **Time Saved insights** — Click any day to filter conversations; modal shows top conversations and day-by-day breakdown. Understanding, included.
- **Settings polish** — Safety tab improvements, sidebar auto-collapse, content width constraints. Cleaner, calmer.
- **Image paste fixed** — Clipboard image paste now works correctly in composer. Screenshots, shareable.
- **Message queue filtering** — Queue tray shows only current session messages. Focus, maintained.
- **Xero & Productboard connectors** — Two new integrations for accounting and product management. Your tools, connected.
- **Google shared calendars** — Team calendars now accessible alongside your personal calendar. Scheduling, unified.
- **Slack post-as-user** — Send messages as yourself (not as a bot) so you can edit them later. Communication, yours.
- **Document previews** — Preview images, videos, and audio directly in the preview drawer. No app-switching required.
- **Custom vocabulary tools** — Manage transcription vocabulary through MCP tools for better speech recognition. Names, spelled correctly.
- **Skill discovery boost** — Skills now rank higher in semantic search. Find what you need faster.
- **Copy Link from conversations** — Right-click any link to copy it. Convenience, added.
- **Queue message shortcut** — Alt/Option+Enter to queue a message during agent turns. Keyboard efficiency.
- **Collapsible output skill** — New skill for structured, collapsible agent responses. Organization, built in.
- **Smarter search** — Index auto-fixes case mismatches; semantic search now only skipped for explicit rebel:// URLs. Discovery, refined.
- **Embedding resilience** — GPU failures now fall back to CPU automatically. Your system, accommodated.
- **Faster agent turns** — Caching and health check optimizations reduce the delay before responses start. Time is money.
- **Tutorial videos on YouTube** — Video tutorials now hosted on YouTube for better reliability and faster loading. Learning, streamlined.
- **Onboarding flexibility** — Voice API key and microphone are now optional during setup. Start how you want to start.
- **Tool discovery improved** — MCP tools refresh properly after connecting new services. Your tools, when you need them.
- **Cleaner conversation view** — Visual polish for a more refined reading experience. Aesthetics matter.
- **Account hints in tools** — Suggested tools show which account they're for. Multi-account clarity.
- **Paste to navigate** — Paste a conversation ID or rebel:// URL in search to jump directly there. Navigation, simplified.
- **Notification clicks work** — Click a notification and go straight to that conversation. Expected behavior, delivered.
- **Keynote text extraction** — New skill extracts text from Apple Keynote presentations. Presentations, parsed.
- **ESC to stop** — Press Escape to halt a running agent turn. No mouse required. Keyboard warriors, rejoice.
- **Import from ChatGPT & Claude** — New migration skills help you bring your conversation history from other AI assistants. Your memories, migrated.
- **Personalized meeting notetaker** — Meeting bot now introduces itself with your name. "Josh & co." feels warmer than "Rebel Notetaker." Professional courtesy.
- **Settings load faster** — Two-phase MCP health checks mean Settings opens in moments, not seconds. Time is precious.
- **Tool tooltips enhanced** — Hover over tool labels to see full paths and commands. Know exactly what's running.
- **Usage insights expanded** — Conversation turn counts now appear in usage insights. Track what matters.
- **Nav tab spacing** — More breathing room between tabs on wider screens. The little details.

### Fixes

- **Meeting bot banner dismissal** — Rejected or errored meeting bot banners can now be dismissed. Out of sight when you need focus.
- **Slack deduplication** — Connecting multiple workspaces no longer creates phantom duplicate entries. One workspace, one entry.
- **Markdown image paths** — Relative images in documents now resolve correctly against the document's directory. Screenshots render where they should.
- **OAuth token cleanup** — Disconnecting an MCP now properly revokes tokens and clears the frequent tools cache. Clean breaks, no lingering permissions.
- **Automations performance** — Removed redundant data causing beach ball issues. Automations stay snappy.
- **@conversations performance** — Lazy loading prevents UI freeze in large workspaces. Mentions that don't hang.
- **Meeting bot auto-send** — Bot sends automatically when joinMode is 'auto' and meeting detected. Set and forget.
- **Memory safety** — Fixed unbounded event accumulation that could cause OOM. Stability, restored.
- **Broken spaces notification** — Rebel now detects broken spaces and offers to help fix them. Self-healing vibes.
- **Duplicate meeting bots** — No more double-scheduling in imminent meeting preview. One bot per meeting.
- **Local recording visibility** — Support check and warning text now visible. Clarity on what's available.
- **Voice session integrity** — Recording uses current session ID at callback time. No more orphaned recordings.
- **Meeting prep routing** — Now routes to correct Space using your Settings configuration. Prep lands where it belongs.
- **Open in Library** — Navigates to folder instead of attempting file read. The obvious behavior, finally.
- **Meeting source organization** — 4-digit years (YYYY/) for long-term folder sanity. Future-proofed.
- **Domain wildcard syntax** — Simplified from `*@domain.com` to just `domain.com`. Cleaner configs.
- **Guest mode sync** — State now syncs correctly on mount. Auth edge case, resolved.
- **Linux builds** — Tooltip import case fixed. Cross-platform, actually.
- **Conversation rendering** — Fixed thinking indicator overlap and ordering bugs. Smooth scrolling restored.
- **Connector naming** — Better UX and clearer names in connector settings. Labels, sensible.
- **Memory approval loop fixed** — No more infinite approval dialogs when writing to memory spaces. Sanity, restored.
- **Annotations focus** — Comment box auto-focuses when adding annotations. One less click.
- **Multi-highlight visibility** — Multiple highlights in annotations now display correctly. Visibility, ensured.
- **@-mention spacing** — Trailing space added after mentions for smoother typing. The little things.
- **Clipboard paste validation** — Paste behavior now matches drag-drop. Consistency matters.
- **Sidebar filter dropdown** — Recency filter no longer shows checkmarks instead of arrows. UI, fixed.
- **Local STT audio handling** — WebM recordings now properly convert to WAV for Parakeet transcription. Voice input, reliable.
- **Klavis migration polish** — No more duplicate notices on files with frontmatter; non-Klavis MCPs preserved when archiving. Migrations, smoother.
- **Session persistence critical fix** — Prevented a race condition that could delete all conversations on startup. Your history, protected.
- **Mic button clarity** — Disabled when local STT model isn't downloaded yet. No more silent failures.
- **Skill feedback persistence** — "Don't show again" for skill ratings actually persists now. Your preferences, remembered.
- **MCP reliability improvements** — Tools now load for built-in connectors even during health check issues. Reliability, quietly improved.
- **Connector metadata preserved** — Editing connector config no longer loses your settings. What you set, stays set.
- **Memory approval labels** — Descriptive labels instead of "Unknown Space" in approval dialogs. Clarity restored.
- **Account label cleanup** — No more duplicate "workspace" suffixes. Clean labels.
- **Safety approvals preserved** — Approval dialogs no longer disappear before you respond. Your decisions, respected.
- **Safety approvals restored** — Navigate away and back? Your pending approval is still there. Patience, rewarded.
- **Deleted conversations stay deleted** — Fixed a bug where archived conversations could reappear after restart. Gone means gone.
- **Deleting stops the turn** — Archive a conversation mid-turn and the agent stops gracefully. Clean exits.
- **Meeting transcript spaces** — No more duplicate spaces in dropdown menus. Clean selections.
- **Klavis migration smoother** — Banner hidden during onboarding, "Don't show again" option added. Transitions, handled gracefully.
- **Browser MCP restricted** — Now requires explicit user or skill instruction. Safety by default.
- **Connector re-auth prompts** — Connectors showing empty tools now prompt you to re-authenticate. Clear next steps.

### Under the Hood

- Unified "Set up with Rebel" OAuth flow across all connector types
- IPv6 support for OAuth callbacks
- Deep link protocol fix (mindstone:// not rebel://)
- HubSpot auth alignment with MCP expectations
- Microsoft connector handling improvements
- AI safety tutorial for non-technical users
- Diagnose-conversation skill for guided troubleshooting
- Bundled highlight.js for offline tutorial rendering
- Space AGENTS.md → README.md migration simplified
- Klavis MCP references deprecated across skills
- Windows CI reliability improvements
- CLI for testing skills without Electron app (rebel-cli)
- Analytics events linked to authenticated users
- E2E test infrastructure for voice session routing
- Fake microphone support for automated testing
- Separated screenshot capture from E2E tests
- Super-MCP Windows compatibility improvements
- Auto-update architecture detection for wrong-arch installs
- E2E test reliability improvements with onboarding skip
- Meeting bot URL normalization for multi-user dedup
- Atlas WebGL context cleanup prevents GPU memory exhaustion
- Pre-computed symlink maps for O(1) path conversion
- Auto-continue evaluation prompts refined
- CI improvements: macOS codesign retry, E2E progressive waits
- Centralized model constants and pricing
- Source capture skill auto-updates related topics
- MCP cache refresh centralized after reconfigure
- Diagnose-conversation skill embedded in diagnostic prompts
- packageId → serverId refactor for internal consistency
- Voice API errors sanitized in logs
- Zod schemas for MCP tool definitions
- ChatGPT and Claude.ai migration skills with space selection
- Improved OAuth callback reliability (IPv6, timeouts)
- Bundled Discourse MCP for offline reliability
- Windows build performance significantly improved
- MCP health_check tool for diagnostics

---

## v0.3.4 — Jan 3-4, 2026

### Highlights

<!-- action: rebel://library -->
- **Workspace is now Library** — The sidebar panel got a name change. "Workspace" became "Library" because that's what it is—your personal knowledge library. All the same power, better metaphor.
<!-- action: rebel://automations -->
- **Conversational Automations** — Forget the form wizard. Tell Rebel what to automate in plain language. "Run my morning briefing at 8 AM on weekdays." Done. Human-readable schedules, inline controls, time-aware greetings. The efficiency compounds.
<!-- action: rebel://settings/spaces -->
- **Memory Tab Redesign** — Your memories now display with style. Collapsible time groups (Today, Yesterday, This Week...), source-type icons for meetings and Slack, amber borders for shared memories. "378 things filed away across 5 spaces." The archives got organized.
<!-- action: rebel://settings/tools -->
- **Per-Tool Disable** — Don't want a specific tool? Toggle it off without disabling the whole connector. Security-blocked tools stay blocked. Granular control, finally.

### Improvements

- **Context window visibility** — See how much of Rebel's context window you're using (0-100%). Find it in the insights drawer. Know when you're pushing limits.
- **Smarter space descriptions** — Auto-generated space descriptions now sample ~100 files and use Sonnet for richer, more nuanced summaries. 3-5 sentences that actually capture what's in there.
- **Memory approval clarity** — When Rebel auto-approves a memory write, the card now explains WHY (private space, permissive setting, low sensitivity). Transparency beats mystery toasts.
- **Memory safety simplified** — Approval behavior now derives from sharing level. Private spaces trust differently than shared ones. One less setting to configure.
- **Automations catch up longer** — Missed automations now have 7 days (not 24 hours) to catch up when you return. Vacations respected.
- **File activity popover fixed** — No more scroll cutoff. Wider cards, relative paths, properly centered. The little things.
- **What's New redesigned** — Card-based layout with version history browser. See what changed, when it changed.
- **Token count in editor** — Approximate token count now visible in the file editor footer. Know how much context a file consumes.
- **Meeting bot local fallback** — Local recording kicks in when cloud transcription is unavailable. Meetings, captured either way.

### Fixes

- **Message queue routing** — Messages no longer route to the wrong conversation when you switch quickly. Your words go where you intend.
- **@-mention filter race condition** — Clicking filter tabs no longer races with debounce. Clicks work immediately.
- **Session migration safety** — Ghost index entries pruned, file deletion sequenced correctly. Conversations stay found.
- **Enhancement pause persists** — Pausing workspace enhancement now survives restarts for ALL workspace sizes. Your preference, remembered.
- **Recovery dialog accuracy** — IPC truth-check prevents false recovery prompts. Fewer "something went wrong" when nothing did.
- **Character encoding edge case** — Unpaired surrogates sanitized before SDK calls. Unicode gremlins, banished.
- **Long messages stay smooth** — Rendering long markdown no longer freezes the UI. Conversations stay responsive.
- **Scroll jitter fixed** — Race condition in conversation scrolling resolved. Smooth reading, guaranteed.
- **Draft persistence** — Switching sessions no longer loses your draft. Thoughts, preserved.
- **Settings responsiveness** — Reduced IPC overhead makes settings dialog snappier. The polish you feel.

### Under the Hood

- Full workspace→library rename across UI, IPC channels, analytics, and URL protocols
- `library://` protocol with `workspace://` backwards compatibility
- Diagnostics bundle builder extracted for cleaner architecture
- Errors-only log export option for focused troubleshooting

---

## v0.3.3 — Jan 1-3, 2026

### Highlights

- **Multi-Conversation Drafts** — Start typing in one conversation, switch to another, come back—your draft is still there. Ctrl+Tab cycles through conversations with drafts. Old empty drafts clean themselves up. Thoughts, preserved.
<!-- action: rebel://automations -->
- **Event-Triggered Automations** — Meeting transcripts can now trigger workflows automatically when they arrive. Set up once, run forever. The efficiency compounds.
- **Enterprise Onboarding** — Admins can now pre-configure Rebel before users launch: recommended connectors, welcome URLs, default settings. Smoother enterprise rollouts.
<!-- action: rebel://settings/tools -->
- **Slack Channel Access** — Rebel can now see public Slack channels you haven't joined. More context, less "you need to join that channel first."
<!-- action: rebel://usecases -->
- **Meeting Prep, Evolved** — The Spark now shows your day's meetings with prep status at a glance. Title bar buttons let you prep or review without leaving your conversation. Prep and transcripts link bidirectionally through frontmatter. Analysis includes your prep notes to compare intentions vs outcomes. Auto-scheduling means the meeting bot handles itself. The meeting workflow has opinions now. Good ones.
<!-- action: rebel://settings/tools -->
- **Self-Service Tool Connections** — Salesforce, Slack, Fathom, Kling, and NanoBanana now configure themselves. No more hunting through Settings. Ask Rebel to connect, get a clickable link, done. The future is self-documenting.
<!-- action: rebel://usecases -->
- **Use Case Library** — Your workflows now accumulate into a self-curating library. Smart deduplication, quality thresholds, engagement tracking. Browse by category: New, Frequently Used, More Workflows. The Spark's suggestion engine learned to grow.
<!-- action: rebel://library -->
- **Skill Relevance Scoring** — Library now surfaces skills most useful to you. Scoring based on tool matches, shared spaces, skill maturity. "Suggested for You" shows the top 6. Discovery, optimized.

### Improvements

- **Slack workflow complete** — Mark channels as read, open DMs, check unread messages. Full Slack triage without leaving Rebel. Inbox zero, assisted.
- **Message queue UI** — Composing during an agent turn? Choose "Send Now" or "Queue" (Cmd+Shift+Enter). Control the flow of conversation. Patience, optional.
- **@-mention filtering** — Type @c: for conversations, @s: for skills, or use tabs to filter mentions. Find what you need faster in the composer.
- **Session storage hardened** — Lazy loading, safer migrations, ghost entries pruned. Your conversations persist more reliably.
- **Coaching tips refined** — Cleaner display, better timing. The tips you need, when you need them.
- **Recovery dialog smarter** — False positive recovery prompts eliminated. Fewer unnecessary dialogs.
- **Source file organization** — Meeting transcripts and other captured content now use cleaner folder paths (yy/MM-MMM/dd/) with timestamps in filenames. Easier to browse chronologically.
- **Source metadata index** — Faster search and filtering of meeting transcripts and other captured content. Find what you need, faster.
- **Conversation startup fixed** — That 20-second delay? Gone. Tool connections load smarter now, and unchanged tools don't need re-indexing. From minutes to moments.
- **Memory indicator expanded** — Now shows ALL file writes, not just memory spaces. "2 files created" tells the full story. Transparency, amplified.
- **Search stays smooth** — Large workspace searches no longer freeze the app. Index rebuilds in the background, so your keystrokes won't wait.
- **Connector chips got icons** — Tool connectors now show icons and category colors. Visual hierarchy that means something.
- **Annotations with line numbers** — When you annotate long documents, Rebel now knows exactly which part you're discussing.
- **Scratchpad selection resilience** — Selecting text outside the modal no longer closes it. The little things.
- **Coaching tips preserved** — System continuations (memory approval, compaction) no longer clear your coaching insights. The tips you haven't acted on, retained.
- **Space display names** — Add `display_name` to your space README frontmatter. 'work/Acme/Exec' becomes 'Acme - Exec'. Human-readable, finally.
- **Enhancement persistence** — Large workspace enhancement requests survive app restarts. Your patience, remembered.
- **Calendar sync diagnostics** — When calendars can't connect, The Spark tells you which ones. Errors that explain themselves.
- **Tool search performance** — Indexing new tools went from 30 seconds to 3 seconds. Speed matters.
- **Text selection menu** — Select text anywhere and get Copy, Reply, and Comment options. Your highlights become actions.
- **Conversation animations** — Messages fade in smoothly. Tool completions animate. Scroll jumps eliminated. The polish you feel but don't notice.

### Fixes

- **Memory leaks plugged** — Three leaks found and fixed: turn controller cleanup on early-return, event listener cleanup on context overflow, stale closure in compaction setTimeout.
- **Windows installer behavior** — Squirrel events now actually stop execution during install/update. No more mystery side effects.
- **resetConversation state** — No longer computed from stale snapshot. Message counts are accurate again.
- **Stop button reliability** — Failed stops no longer permanently suppress events in chat mode. And the button hides when stopping isn't an option anyway.
- **Title bar meeting refresh** — Ended meetings clear properly on 1-minute intervals. Stale indicators, banished.
- **Scroll virtualizer warnings** — Bounds checks prevent "Failed to scroll to index" spam. Console peace, restored.
- **Text selection in popovers** — Selection captured on selectionchange, not mouseup. Your highlights stay where you put them.
- **Session saves more reliably** — Incremental file-per-session storage means less risk of losing conversation progress. Your work, preserved.

### Under the Hood

- Security scan scripts added
- Unified tool catalog for all built-in connectors
- Meeting tools renamed for clarity
- Transcription quality tracking improved
- Meeting data refreshes automatically every 5 minutes

---

## v0.3.2 — Dec 30-31, 2025

### Highlights

- **Meeting Bot** — Automatic meeting capture via Recall.ai. Rebel detects your meetings, grabs transcripts, generates AI summaries, and stores everything organized by year and month. Also imports from Fireflies and Fathom. Your meetings, remembered.
- **Skills Browser Redesign** — Grid view with source filters. Browse workspace, personal, and community skills at a glance. Finding the right skill just got easier.
- **Inbox Redesign** — Compact cards with a priority system, always-visible context input, and grouped by date. The inbox has opinions now. Good ones.
- **Library Redesign** — Unified search across your entire workspace. Files, folders, content—find anything faster.
- **Faster, Safer Startup** — App loads services in parallel now. If something fails, you get a helpful banner instead of a mystery crash. Safe Mode activates automatically after repeated crashes and tells you why.

### Improvements

- **Safe Mode awareness** — When Safe Mode activates, Rebel tells you *why* (crash, startup failure, etc.) and the agent knows too, so it can help troubleshoot.
- **Usage insights** — New tab in Settings shows your usage patterns and trends. Data for the data-curious.
- **Tool resilience** — A single broken connector no longer takes down all your tools. Graceful degradation, achieved.
- **Voice recording resilience** — Mic disconnects mid-recording? Rebel stops cleanly. Transcripts bind at recording start, so switching conversations won't lose your words.
- **Connector config copy button** — Copy your connector config with one click. Sharing is caring.
- **Google permissions** — Request only the access you need. Granular consent, finally.
- **Time saved chart** — Timezone bug fixed. Your weekly stats display correctly now.
- **Annotation popover** — Shows only after selection completes. No more nervous flickering.
- **File counts** — Large workspaces show accurate numbers via optimized counting.
- **Connector tooltips** — Sign-in prompts now explain what each connector does. Mystery reduced.

### Fixes

- **Mic disconnect handling** — Headphones unplugged? Recording stops gracefully instead of hanging forever.
- **Transcript session binding** — Voice recordings now attach to the conversation you started them in, not wherever you ended up.

---

## v0.3.1 — Dec 28, 2025

### Highlights

- **Add Space Wizard** — Creating memory spaces is now a guided experience. Pick a folder (defaults to your workspace), validate edge cases, and safely link external folders. Space removal is smarter too: "Remove" deletes the symlink, "Move Out" relocates the folder. Cloud storage paths (iCloud, Dropbox) work properly now. Your digital filing system, formalized.
- **Tasks in Scratchpad** — See your Todoist tasks right in Rebel via the official MCP. Sort by date and priority, hover for full titles. No Todoist? Local fallback keeps you productive. Your task list, where you already are.

### Improvements

- **Multi-account connectors** — Google Workspace, HubSpot, and Salesforce now properly isolate credentials per instance. Run your work and personal accounts without credential bleed. The boundaries hold.
- **Inbox archiving** — Archive items instead of just reading them. Cleaner inbox, clearer mental state.
- **File actions menu** — All file operations now live in one menu in the editor. Reveal opened files in sidebar automatically. Less hunting, more working.
- **Conversation search links** — Search results now include clickable `rebel://` links. Jump to conversations, don't scroll to them.
- **Auto-continue on rhetorical questions** — Rebel no longer stops and waits when it asks "shall I proceed?" It just... proceeds. You're welcome.
- **Sidebar opens on Conversations tab** — Click "Conversations" and the history sidebar opens automatically. The obvious behavior, finally.

### Fixes

- **Cloud storage paths** — iCloud, Dropbox, and other cloud folders inside ~/Library are now valid space locations. Apple's weird folder structure, respected.
- **Remove/Move Out clarity** — Tooltips now explain what each option does before you click. No more "wait, which one deletes things?"

---

## v0.3.0 — Dec 27, 2025

### Highlights

- **Smart tool search** — Rebel now finds the right tools before you ask. Type "send a Slack message" and the relevant tools are already loaded. What used to take 16+ seconds of browsing now takes zero. The efficiency compounds.
- **Document annotations** — Highlight text in markdown files, add notes, send feedback to Rebel. Click "Send to Rebel" and choose: continue the file's conversation, your current conversation, or start fresh. Annotations persist in the document and survive file moves. Your notes become action.
- **Skills, reimagined** — A complete redesign of how skills work. Personalize existing skills, create new ones, see which skills might help with your current task. Skills now have health indicators (New, Growing, Mature), example files you can browse, and a "Skills for you" section in The Spark. The whole system learned to recommend itself.
- **Thank You Board** — See who contributed to your skills in The Spark. Names, specific contributions, recent activity. Recognition that means something.

### Improvements

- **"On it..." indicator** — No more wondering if Rebel heard you. A subtle indicator appears immediately while the agent spins up. Patience has a progress bar now.
- **Conversation animations** — Messages fade in with a subtle blur-to-clear transition. The sidebar slides. Surfaces cross-fade. Motion with purpose, not decoration.
- **@skills, @files, @conversations** — Type @ and see all three options immediately. Each gets a colored badge and custom placeholder when active. Discoverability, achieved.
- **Cost dashboard redesign** — Your spending now grouped into meaningful categories: Conversations, File Intelligence, Safety Checks, Memory & Notes, Housekeeping. Hero metric with witty commentary. Know where the tokens go.
- **Generated images auto-save** — RebelImage (formerly OpenAI Image Generation) now saves images to your workspace automatically. No more "where did that image go?"
- **Skill feedback prompts** — After using a skill, Rebel occasionally asks: helpful or not? Throttled to once per skill per week. Your feedback shapes the system.
- **Folder navigation** — Navigate directly to folders in the workspace. Create a file, land on it. The little things.
- **Skill examples** — Skills with example files now show them in the skill card. Click to view. Learning by example, enabled.
- **Find Similar improvements** — Now distinguishes "still indexing" from "no results found" from "not available in demo mode." Errors that explain themselves.
- **Inline workspace images** — Images from your workspace now display inline in conversations with proper dimensions. No more broken image links.
- **Retry interrupted turns** — When a turn gets interrupted, a retry button appears. Pick up where you left off.
- **Slack channel errors** — Clear error message when Rebel isn't in a channel, with instructions to fix it. Debugging, demystified.

### Fixes

- **Session persistence** — Fixed data loss from background events not being included in session snapshots. Your conversations are properly saved now.
- **Spaces filtering** — Subfolders no longer appear as separate spaces in Settings. Only directories with valid space configuration show up.
- **Tool parameter schemas** — Agent was guessing parameters because we only sent tool names. Now includes full schemas. No more creative interpretation of required fields.
- **Workspace scroll** — Tree navigation uses proper scroll container instead of scrolling the whole page. Spatial consistency restored.
- **Memory write tracking** — Main conversation turns now track memory writes, not just background tasks. The memory indicator tells the whole story.

### Under the Hood

- Smart tool search: combines keyword and meaning-based matching for better results
- Annotations remember which conversation created them
- Skill usage tracking and attribution
- Tool index refreshes automatically after startup
- New skill wizards for extending, improving, and repairing skills

---

## v0.2.39 — Dec 26-27, 2025

### Highlights

- **Smart conversation search** — Find past conversations by meaning, not just keywords. Search "quarterly budget" and find discussions about "Q3 finances." Your memory, amplified.
- **Deep-link navigation** — Settings links in agent responses now scroll directly to the relevant section. Click "API key settings" and land exactly there. No more hunting.
- **Offline awareness** — Rebel now tells you when you're disconnected. A small banner beats silent failures.
- **Voice resilience** — Transcription retries automatically if the first attempt fails. Your words won't vanish into the ether.

### Improvements

- **Message counts in history** — See at a glance how long each conversation was. That 47-message thread? You'll know before you click.
- **iCloud for memory spaces** — Store your memory spaces in iCloud. One more place to keep things safe.
- **Full cost visibility** — See costs for voice transcription, file indexing, and search—not just conversation costs. The complete picture.
- **Workspace tooltips** — Enhancement progress now explains itself. Less mysterious processing bars.

### Fixes

- **Settings save properly** — Fixed data loss with auto-save and skill settings. Your configuration changes actually persist now.
- **Crash on startup** — Fixed an issue causing app crashes on launch. Stability: rediscovered.
- **Spaces reliability** — Better frontmatter validation and settings configuration. Fewer edge cases.

---

## v0.2.38 — Dec 25-26, 2025

### Highlights

- **Kling AI video generation** — Create videos from text prompts. Describe what you want, get a video. The future arrived quietly.
- **Rich media in conversations** — YouTube, Vimeo, and video URLs now play inline. Paste a bare URL, watch it render. No more "click here to watch."
- **Rebel in your code editor** — Use Rebel from Cursor, Claude Desktop, or VS Code. Your development tools can now delegate to Rebel. Meta? Maybe. Useful? Definitely.
- **Database connectors expanded** — PostgreSQL, BigQuery, and Looker join the family. Query your data warehouse, explore your dashboards, all from conversation.
- **Gemini image generation** — Google's image generation now available in Rebel. Because one image generator is never enough.
- **Sidebar organization overhaul** — Collapsible Active/Archived sections, a new Favorites section for starred conversations, and Trash for soft-deleted work. Your conversation history, finally organized.
- **Trash for conversations** — Delete without regret. Conversations move to Trash instead of vanishing. Restore what you need, empty when you're sure. They won't haunt your search results.

### Improvements

- **Command-line help improved** — Comprehensive help with examples and descriptions. For automation enthusiasts.
- **History sidebar auto-expands** — Start a conversation, see your history. No more hunting for the expand button.
- **Python requirements shown** — Settings > Connectors now shows which tools need Python and whether you have it. Transparency about dependencies.
- **Fathom setup simplified** — UI-based API key entry. No more config file editing for meeting transcripts.
- **Google Slides batch updates** — Edit multiple slides at once with batch_update. Thumbnails too. Presentation workflows, streamlined.
- **Coaching cards have Ignore** — Don't want the tip? Click Ignore. Clearer than hoping it goes away.
- **Memory indicator for file ops** — Moving or deleting files now shows in the memory indicator, not just content edits.
- **Star your favorites** — New Favorites section at the top of the sidebar. Star conversations to keep them accessible. Your most important work, always within reach.
- **Sticky section headers** — Scroll through years of history without losing your place. Section headers stay visible as landmarks.

### Fixes

- **Automation reliability** — Fixed startup hang, early exit, and path resolution bugs. Automations run reliably now.
- **Connector config reloads** — Connectors properly reload when already running. No more stale settings after changes.
- **Automations scheduling** — More reliable with proper date/time handling. Anchor dates parse correctly, catch-up for missed runs works as expected.
- **Smoother conversation rendering** — Markdown embeds no longer blink during updates. The polish you didn't know you needed.
- **Edit shortcut hint restored** — Composer placeholder shows the edit shortcut again. Discoverability matters.

### Under the Hood

- "Chat" renamed to "conversation" throughout the UI
- MongoDB connector documentation added
- Better connector descriptions for smarter tool selection
- Cleaner code architecture
- 65 new automated tests for scheduling reliability

---

## v0.2.37 — Dec 24-25, 2025

### Highlights

- **Salesforce connector** — Query records, search accounts and contacts, work with your CRM data directly. Your pipeline, Rebel's playground.
- **Fathom connector** — Access meeting transcripts and AI summaries from your Fathom recordings. No more "what did we decide in that call?"
- **Google Workspace expansion** — Sheets and Slides join the family alongside Gmail, Calendar, Drive, and Docs. Read spreadsheets, browse presentations, search contacts via People API.
- **Persistent cost tracking** — Usage data now survives app restarts and conversation deletion. Your lifetime costs, accurately tracked.

### Improvements

- **Slack got smarter** — Pagination support, user name resolution (shows "Jane Doe" instead of "U123ABC"), and proper rate limit handling. Conversations make sense now.
- **Check for updates** — New option in Help menu. Impatient? Same.
- **Turn timing details** — Usage tooltip now shows duration and timestamps on hover. See exactly how long each response took.
- **Sign-in pages branded** — Success and error pages now look like Rebel, not generic browser messages.
- **Connector search improved** — "Available" section auto-expands when your search finds matches there.
- **Settings renamed** — "Insights" is now "Usage". Clearer is better.

### Fixes

- **Notion sign-in fixed** — Connection issues resolved. Notion integration works reliably now.
- **Sentry connection** — Updated for latest compatibility. Error tracking connects properly.
- **Windows diagnostics** — Handles usernames with spaces and non-C drives. Windows users, we see you.
- **Memory safety fallback** — When memory safety level is undefined, follows tool safety level. Sensible defaults.
- **Stale approvals cleaned** — Old memory approvals that never got resolved are now automatically cleared.

### Under the Hood

- Diagnostics capture more details for troubleshooting
- Branded sign-in pages for tool connections
- Security documentation expanded
- Documentation added for Linear, Asana, Miro, Metabase, Framer, Slack connectors

---

## v0.2.36 — Dec 22-24, 2025

### Highlights

- **Private Mode** — Lock icon toggle for sensitive work. Forces balanced safety and memory approval prompts, even if you usually trust Rebel completely. Because some conversations shouldn't be remembered without asking first.
- **Memory trust, your way** — Control how Rebel writes to memory. Per-space trust levels: always ask, balanced, or full trust. Your boundaries, respected.
- **Safety settings get a home** — New Safety tab in Settings consolidates tool safety and memory controls. Everything permission-related, one place.
- **Spaces activity dashboard** — See what's happening across your spaces with AI-synthesized summaries. "Your Home space saw 3 new memories this week, mostly about Q1 planning."
- **Tool approvals redesigned** — Moved from inline cards to a sleek footer bar. Approve once, for the session, or forever. Less intrusive, same control.

### Improvements

- **Waiting to Remember** — Pending memory approvals now show in Library `Show: Memory`. Save all, skip all, or review individually. Your memories, your approval.
- **Frequent tools learned** — Rebel tracks which tools you use most and pre-loads them. Faster tool access, fewer delays. The efficiency compounds.
- **Community highlights** — The Spark now surfaces trending topics from the Rebels forum. See what other users are discussing without leaving the app.
- **Connector hot reload** — Change connector settings without restarting. Update credentials, tweak configs, keep working.
- **Large workspace enhancement button** — Workspaces with 1000+ files skip auto-enhancement on startup. Manual "Enhance" button lets you decide when to invest the API cost.
- **Home/Spaces toggle** — Icon toggle replaces tabs. Cleaner, shows last-updated timestamp for Spaces view.
- **Cancelled is cancelled** — Stopped automation runs now marked as "cancelled" instead of falsely claiming success. Catch-up logic works correctly.
- **Search performance** — Search indexing is faster with better timeout handling. No more blocking on edge cases.
- **Subagents get your shortcuts** — Frequent tools injected into spawned subagents. They inherit your efficiency gains.
- **Pending approvals persist** — Tool and memory approvals survive app restarts. No more "wait, what was I approving?"

### Fixes

- **Diagnostics are safer** — Download Diagnostics now properly redacts API keys and secrets before bundling. Share with support without worry.
- **Monthly schedules stay put** — Automation schedules set for the 31st (or 30th, or 29th) no longer drift to earlier days in short months.
- **Allow once means once** — Tool approvals for "Allow once" now actually expire after one use instead of persisting.

### Under the Hood

- Memory write approval flow improved
- Tool usage tracking for personalized suggestions
- Space activity summaries generated automatically
- Better error messages for workspace operations
- More automated tests for diagnostics

---

## v0.2.35 — Dec 19-20, 2025

### Highlights

- **Microsoft 365 integration** — Outlook, Calendar, OneDrive, and Teams now built in. Read and send emails, check your schedule, find files, message colleagues. Sign in once, works everywhere.
- **Smarter file search** — Search now combines keyword matching with meaning-based search. Queries like "quarterly budget projections" find related documents even if they use different words.
- **@files** — One simple trigger for workspace search. Replaces the confusing old options.
- **Claude Max support** — Use your Claude subscription directly. Run `claude setup-token` in your terminal, paste the token in Settings. API keys still work too.
- **Automations catch up** — Missed a scheduled task while away? Rebel notices and runs it when you return. No more "I set up a daily briefing but it never ran."

### Improvements

- Long conversations stay responsive. Scroll and type without lag, even in marathon sessions.
- Library `Show: Skills` redesigned with icons, collapsible categories, and tooltips showing full paths. Click the folder icon to reveal in Finder.
- Enhanced indexing toggle in workspace panel. Improves search accuracy by adding context to each file chunk.
- Workspace Lifetime Usage in Settings > Insights. See your total costs over time, even for deleted conversations.
- Tool connectors grouped by type: Native (built-in), Verified, Community, Gateway, Custom. Know what you're connecting to.
- Edit connector configs directly in Settings. Validation, syntax highlighting, format button.
- @-mentions find files better. Multi-word searches work (`chr-mov` finds "Christmas Movie").
- More file results in @-mentions (up from 8 to 200).
- Time-saved estimates more conservative. Less "we saved you a week!" when it was probably 20 minutes.
- HubSpot stays connected. Sign-in refreshes automatically before it expires.
- Background tasks use one model setting instead of scattered options.

---

## v0.2.34 — Dec 15-19, 2025

### Highlights

- **Quick Question vs On the Case** — New interaction mode toggle. Quick question gets you a fast answer without tools. On the case unleashes the full agent. Pick your pace.
- **Smart search** — Find files by meaning, not just keywords. Now triggered with `@files` or `@workspace` for explicit control. No hidden background processing.
- **Privacy indicators everywhere** — Lock and globe icons show what's private vs shared. "Chief of Staff" is now "Private Memory." The robot learned discretion.
- **The Spark learning hub** — Use Cases tab redesigned as a discovery experience. Inspiration, organized.
- **Google sign-in** — Sign in with Google or email code as backup. Desktop login done right.

### Improvements

- Download Diagnostics in Help menu. One-click bundles when things go sideways.
- Onboarding checklist with non-sequential completion. Skip ahead, come back, your call.
- Memory cards explain visibility upfront: "Only you" or "Visible to others."
- Files pill simplified to modified files only. Sources already shows references.
- Headings in chat bubbles stepped down a size. Less shouty.
- Memory timestamps track what Rebel learned and when.
- Subagent tool calls now visible during execution. Transparency all the way down.
- Permission requests scoped per session. Approve once per conversation.
- Windows installer polish: splash screen and single-instance lock.

### Under the Hood

- Download size reduced by ~180MB. Your SSD says thanks.
- Better error messages for connector issues.
- Improved error handling for configuration problems.
- Privacy detection for workspace paths.
- Automated code review in development pipeline.

---

## v0.2.33 — Dec 15, 2025

### Highlights

- **Beautiful markdown editing** — The workspace editor now features a proper WYSIWYG experience. Headers, lists, code blocks, and formatting render inline as you type. Writing documentation just got dramatically nicer.
- **Memory panel** — New "Memory" tab in the workspace shows what Rebel knows about you. Structured view of facts, preferences, and context. Transparency is a feature.
- **Mindstone accounts** — Optional sign-in with Mindstone accounts. Your identity, synced settings (coming soon), and eventually team features. Still works fine without signing in.

### Improvements

- Skills browser redesigned with cleaner cards and better visual hierarchy. Finding and using skills is now pleasant.
- Workspace panel adapts gracefully to narrow widths. Search, scope tabs, and actions reflow intelligently instead of becoming a jumbled mess.
- File management polish: workspace file watching, better tree interactions, and smoother editor transitions.
- Memory updates from conversations now open directly in the workspace editor. See exactly what Rebel learned.

### Under the Hood

- Secure sign-in system with proper credential storage.
- Scope tabs (Skills/All/Memory) now have icons with tooltips. Works at any size.
- Responsive toolbar layout adapts to any window size.

---

## v0.2.32 — Dec 14-15, 2025

### Highlights

- **Local & alternative models locked in** — Remote and local AI services now play nicely together, with long conversations staying responsive even when you run your own models.
- **Settings reflow** — Sticky tab navigation, tidier spacing, and trimmed repetition make the settings panel calmer to scan and less scrolly.
- **Conversational connector setup** — Configure tool connectors directly through conversation, including duplicate detection to keep configs clean.
- **Onboarding polish** — Leaner onboarding prompts and refreshed CTAs set expectations better, with meeting-prep briefings surfaced earlier.

### Improvements

- Thinking indicators stay hidden when the agent isn't actually busy; background tasks now execute reliably.
- Scroll and drag in long conversations behave again, time-saved stats got an All Time view, and we raised the history cap for deeper archives.
- Local model support improved with better background task handling.

### Under the Hood

- Added onboarding skills and meeting-prep briefings.
- Release pipeline improvements for safer deployments.

---

## v0.2.31 — Dec 15, 2025

### Highlights

- **Settings redesign** — Cleaner, simpler, stickier. Navigation tabs now stay put while you scroll. Less repetition, more clarity.
- **Tools work in background tasks again** — Background tasks can now access your connected tools (Gmail, Slack, Calendar, etc.) when using synchronous mode. We found a workaround for a platform limitation.

### Improvements

- Settings tab bar is now sticky. Scroll all you want, navigation stays visible.
- Redundant settings sections consolidated. Fewer tabs, same functionality.
- Conversational connector setup via conversation. Ask Rebel to set up your tool connections.
- Background task progress now displays correctly during execution.
- Onboarding prompts and CTAs cleaned up for better first impressions.

### Under the Hood

- Background task tool limitations documented for better reliability.
- Automated code review added to release process.

---

## v0.2.30 — Dec 13-14, 2025

### Highlights

- **Local & alternative model support** — Run Rebel with your own AI models. Works with Ollama, LM Studio, OpenRouter, or that GPU you finally justified buying. Your hardware, your rules.
- **Time Saved tracking** — See how much time Rebel saved you this week. Weekly stats, all-time totals, and contextual translations like "A full workday, returned." The ROI speaks for itself.
- **"Up next" preview** — See what Rebel has queued while working. No more wondering what's next.
- **Sessions are now Conversations** — Because "sessions" sounds like therapy. (We're not ruling that out for v1.)

### Improvements

- Time Saved indicator in the header shows weekly hours with trend arrows
- Click the indicator to see detailed stats with tabs: "This Week" vs "All Time"
- All Time view shows cumulative hours since you started, because compound interest applies to time too
- Per-turn time comparison shows how long you would have spent vs how long Rebel took
- Toggle Time Saved estimation in Display settings if you prefer blissful ignorance
- Use Cases panel now has a regenerate button. Change your mind, change your suggestions.
- Use case generation is now bulletproof — results persist even if you navigate away
- Fixed spinner state persistence on loaded sessions. Spinners now spin when they should.
- Sub-agent timers now handle background tasks correctly. Time is real again (again).
- Long conversations now handle scroll more gracefully. Drag and double-click work as expected.
- Context management optimized for lengthy sessions. Rebel remembers more, forgets less.

### Under the Hood

- Rebel now cites sources during task execution. Transparency is a virtue.
- Prefers native connectors over third-party when both exist. The one you installed on purpose wins.
- Time saved estimation added. The math behind the magic.

---

## v0.2.29 — Dec 12-13, 2025

### Highlights

- **System skills now configurable** — Pick which skills Rebel has access to. Finally, some boundaries.
- **Workspace got a glow-up** — Skills and files now live in separate tabs. Less scrolling, more finding.
- **Keyboard shortcuts** — Cmd/Ctrl+N for new chat. Your fingers will thank you.
- **Message navigator** — Jump between your messages in long conversations. Because scrolling is so 2024.
- **Custom transcription vocabulary** — Teach Rebel your jargon. Better speech recognition for your domain.
- **Files touched indicator** — See which files Rebel is working with at a glance.

### Improvements

- Trust tools forever setting — for those who like to live dangerously (efficiently)
- Modals now have close buttons. You're welcome.
- Tool connector interface revamped — it's cleaner and actually makes sense now
- Use Cases panel replaces the landing page in sidebar
- Offline recovery got faster. Still not as fast as staying online, but close.
- Chats auto-save now. No more "wait, where did my session go?"
- Tips appear before quips while working. Helpful first, witty second.
- Clear input button in composer. One click to start fresh.
- Theme selector now has System option. Let your OS decide.
- Draft discard confirmation — no more accidental "where did my message go?"
- Session persistence hardened. Your conversations are safe with us.
- Spinner during initial thinking. Patience indicator included.
- Wider conversations on big screens. Revolutionary, we know.

### Under the Hood

- Skills reorganized into cleaner folder structure.
- Transcription vocabulary suggestions added. Rebel can help you teach Rebel.
- Keyboard shortcuts documentation published.
- Multiple tasks using tools simultaneously no longer causes conflicts. Teamwork actually works now.

---

## v0.2.28 — Dec 11, 2025

### Highlights

- **Linux auto-update notifications** — Linux users, we see you. Updates will find you now.
- **Smarter planning** — Planning delegated to a subagent. Divide and conquer, as they say.

### Improvements

- Timer display fixed in multi-run sessions. Time is real again.
- Tool sign-in improvements — fewer popups, more productivity
- Bug fix for clicking in long conversations. Scroll and click, as nature intended.

### Under the Hood

- System instructions overhauled for more consistent behavior.
- Works better with external code editors now.
- Security layer for tool access controls. Enterprise-grade paranoia, optional.

---

## v0.2.27 — Dec 11, 2025

### Highlights

- **Voice modes remixed** — Speak and Listen are now independent. Mix and match like a DJ.
- **File attachments** — Paste or drag text files right into the composer. PDFs too.
- **Folder completion** — Skills autocomplete now prioritizes folders. The little things matter.

### Improvements

- ESC key on landing page jumps to conversation. Escape never felt so productive.
- Auto-focus on input when you start a new chat. We read your mind.
- Sub-agent timeouts prevent infinite waits. Patience has limits.
- Security check reasoning is now visible. Trust, but verify.
- Help menu has "Ask Rebel" option. Meta, but useful.
- Reduced idle CPU usage. Your fans will thank us.
- Persona quips expanded. We got witty.

### Under the Hood

- Safety guard now includes medium risk levels. More nuanced security, fewer false alarms.
- Use case finder runs faster. Quicker suggestions when you first start.
- Hot reload for connector settings. Change settings without restarting. The future is now.

---

## v0.2.26 — Dec 10, 2025

### Highlights

- **Linux support (beta)** — Ubuntu users, welcome to the party. DEB packages now available.
- **Full-screen mode** — Distraction-free by default. Focus is the new black.
- **Display settings** — Theme and focus mode toggles now have a proper home.

### Improvements

- Version number visible in header. Know thyself.
- Onboarding polish — clearer labels, smarter validation, skip buttons for return visitors
- Settings revamp with cost breakdown. Know what you're spending.
- Light mode restored. Some people like the sun.
- Google Drive offline sync UX improved. Fewer mysterious warnings.

### Under the Hood

- Tool connector catalog expanded. More integrations at your fingertips.
- Memory organization improved. Cleaner separation of concerns.
- Sign-in window fixes. No more surprise popups during tool discovery. Stealth mode achieved.

---

## v0.2.25 — Dec 9, 2025

### Highlights

- **New system prompt architecture** — Complete overhaul under the hood. Same Rebel, better brain.
- **Cross-platform E2E testing** — Windows joins the test party. Quality everywhere.

### Improvements

- Built-in tool connections more reliable.
- Intro video works on production again. First impressions matter.

### Under the Hood

- Wins and learnings feature added. Track what's working and what isn't.
- Space removal improved for safer cleanup. Deleting spaces without the anxiety.
- Nested configuration directories now work automatically.

---

## v0.2.24 — Dec 1, 2025

### Highlights

- **Image uploads** — Paste screenshots, drag photos. Rebel can see now.
- **Document support** — DOC, DOCX, XLS, XLSX. The office suite joins the chat.
- **PDF uploads** — Because some things still live in PDFs.

### Improvements

- Task queue view cleaned up. Less clutter, more clarity.
- Inline file editing in workspace. Edit without leaving.
- Skills stand out better in the workspace. Visual hierarchy is real.
- Memory tooltips improved. Hover and learn.

### Under the Hood

- Rebrand complete. "Mindstone OS" is now "Mindstone Rebel" everywhere.
- Space template simplified. More flexible, less prescriptive.

---

## v0.2.23 — Nov 30, 2025

### Highlights

- **Dynamic system instructions** — Context-aware prompts that adapt to your situation.
- **Spaces architecture** — Connect shared folders as Spaces. Your files, your boundaries.
- **Always-on tool connections** — Tools stay connected. No more cold starts.

### Improvements

- Style system modernized.
- Settings architecture cleaned up.
- Network conflict detection improved.
- Multiple tasks using tools simultaneously. Teamwork makes the dream work.

### Under the Hood

- Personal memory space renamed for clarity.
- Default Spaces documentation added. Know where your stuff goes.
- Privacy policy updated with more transparency controls.

---

*Click the version number anytime to see what's new.*
