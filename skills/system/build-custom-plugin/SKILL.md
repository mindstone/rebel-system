---
name: build-custom-plugin
description: "Guides building custom sidebar tab plugins using rebel_plugins_create/rebel_plugins_list/rebel_plugins_get_source tools. Read this skill before generating any plugin code."
last_updated: 2026-03-27
agent_type: main_agent
---

# Build Custom Plugin

Build custom sidebar tab plugins for the user. Plugins are single-file TSX components that render as tabs in the sidebar.

## When to Read This Skill

Read this skill whenever the user asks you to:
- Create a new plugin or custom tab
- Modify an existing plugin
- Build a dashboard, tracker, timer, or any custom UI

## Reference Docs (load as needed)

- [plugin-api.md](references/plugin-api.md) — Full `@rebel/plugin-api` hook reference (kept in sync with `.d.ts` declarations)
- [plugin-ui.md](references/plugin-ui.md) — Full `@rebel/plugin-ui` component reference
- [constraints.md](references/constraints.md) — Import rules, forbidden patterns, styling rules
- [patterns.md](references/patterns.md) — Common plugin patterns and examples
- [import-existing-html.md](references/import-existing-html.md) — Converting an existing HTML page (with inline JS) into a plugin using iframe `srcDoc`
- [MIGRATIONS.md](references/MIGRATIONS.md) — Schema versioning and data migration guidance for plugins
- [SECURITY.md](references/SECURITY.md) — Security review severity levels, blocked patterns, and how to fix them

**Bundled plugins are canonical worked examples — read them before building from scratch.**
The three plugins shipped under `rebel-system/plugins/<id>/index.tsx` are full, production-quality
implementations the agent can use as starting templates:

- `rebel-system/plugins/pomodoro-timer/index.tsx` — minimal stateful UI with `usePluginStorage` + lifecycle interval. ~220 lines. Good template for a timer / tracker / single-purpose widget.
- `rebel-system/plugins/research-hub/index.tsx` — composes `useConversations` + `useAi` + dialogs. ~270 lines. Good template for an LLM-assisted workflow plugin.
- `rebel-system/plugins/sources-browser/index.tsx` — hero plugin (`role: 'hero'`) wiring `useSources` + `useSourceDocument` + `useMemorySearch` + tabs + multi-pane layout. ~1200 lines. Good template for a Spotlight / dashboard / multi-surface plugin.

Two ways to read them:
1. Filesystem (preferred when iterating offline): `Read rebel-system/plugins/<id>/index.tsx`
2. Via the MCP tool, once they're installed in a Space: `rebel_plugins_get_source({ id: '<id>' })`

When a user asks for "a focus timer," "a research helper," or "a sources browser" type plugin, prefer
forking the bundled one (`rebel_plugins_fork`) over generating from scratch — the user's edits live
on their own `{id}-custom` copy and you get a known-good starting point.

**Also read the canonical `.d.ts` files** for exact type signatures when precision matters:
- `src/renderer/features/plugins/declarations/rebel-plugin-api.d.ts`
- `src/renderer/features/plugins/declarations/rebel-plugin-ui.d.ts`

## Available Tools

- **rebel_plugins_create** — Create or update a plugin. Takes: `id` (kebab-case), `name`, `description`, optional `documentation` (markdown string), and `source` (TSX string)
- **rebel_plugins_list** — List all registered plugins with their IDs and names
- **rebel_plugins_get_source** — Retrieve the TSX source code of an existing plugin by ID

## Modifying an Existing Plugin

> **IMPORTANT — even for Space plugins:** If the plugin has been copied or moved
> to a Space (e.g. `work/<space-name>/plugins/<id>/`), you MUST still use
> `rebel_plugins_create` to update it. Do NOT use `Edit` or `Write` on
> `index.tsx` directly — direct filesystem writes are blocked by the safety
> hook, bypass compile validation, and trigger one approval prompt per write.
> The `rebel_plugins_create` workflow is the only supported update path.

When the user asks to modify, fix, or update an existing plugin:

1. **Always call `rebel_plugins_list` first** to discover the exact plugin ID
2. **Call `rebel_plugins_get_source`** with the exact ID to get the current source code
3. **Modify the source** as needed
4. **Call `rebel_plugins_create`** with the **same exact ID** and the updated source

**Important:** Do NOT guess plugin IDs. Users may have forked catalog plugins, which use the naming convention `{original-id}-custom` (e.g., `pomodoro-timer-custom`). Always use the ID returned by `rebel_plugins_list`.

**Data schema changes:** When making code changes that alter a plugin's data schema, check if the plugin stores data via `usePluginStorage`. If so, ask the user whether existing data needs migrating before proceeding. If migration is needed, switch to `usePluginStorageWithVersion` (or bump its `schemaVersion`) and add the appropriate migration step. See [MIGRATIONS.md](references/MIGRATIONS.md).

## Quick API Summary

Plugins import from exactly two modules: `@rebel/plugin-api` and `@rebel/plugin-ui`.
They can also import from `react` (React, useState, useEffect, useRef, useMemo, useCallback, useReducer).

### Hooks (`@rebel/plugin-api`)

| Hook | Returns | Purpose |
|------|---------|---------|
| `useConversations(params?)` | `{ data, totalCount, isLoading }` | Live conversation list with filtering/sorting/pagination |
| `useRebel()` | `RebelApi` | Navigation, conversation management, toasts, lifecycle |
| `usePluginStorage<T>(key, default)` | `[value, setValue]` | Per-plugin persistent KV storage (10MB quota) |
| `usePluginStorageWithVersion<T>(key, default, opts)` | `[value, setValue]` | Versioned storage with automatic migration ([MIGRATIONS.md](references/MIGRATIONS.md)) |
| `useMemorySearch(query, options?)` | `{ results, isLoading, error, status }` | Semantic workspace search |
| `useSources(params?)` | `{ sources, totalCount, isLoading, error }` | Browse/search memory sources |
| `useSourceDocument(path)` | `{ document, isLoading, error }` | Read full source document content |
| `useAi()` | `{ ai, isProcessing, error }` | LLM access: summarize, extractObject, generate (rate-limited) |
| `useMeetings(params?)` | `{ meetings, isStale, isLoading, error, refresh }` | Calendar meetings |
| `useClipboard()` | `{ copyText }` | Write-only clipboard |
| `useRebelEvent(type, callback)` | void | Subscribe to lifecycle events (turn, navigation, etc.) |

### RebelApi (from `useRebel()`)

- `conversations.open(sessionId)` — Navigate to a conversation
- `conversations.list()` — Synchronous conversation list
- `conversations.pin(sessionId)` — Toggle pin
- `conversations.star(sessionId)` — Toggle star
- `conversations.rename(sessionId, title)` — Rename conversation
- `conversations.sendMessage(sessionId, message)` — Send message to existing conversation (returns `{ ok, error? }`)
- `conversations.startConversation(message)` — Start new conversation (returns `{ ok, sessionId?, error? }`)
- `conversations.create({ draftText?, navigate? })` — Create a new conversation. Returns session ID. `navigate: false` creates in background.
- `conversations.getTranscript(sessionId, options?)` — Read transcript (requires `conversations:transcript`, 10/min)
- `navigate(target)` — Navigate to a `rebel://` URL
- `navigate.toSettings(tab?)` — Open Settings
- `navigate.toAutomations()` — Open Automations
- `navigate.toTasks()` — Open Tasks
- `navigate.toLibrary(filePath?)` — Open Library
- `navigate.toPlugin(pluginId)` — Open a plugin tab
- `ui.showToast(message, options?)` — Show toast notification (rate-limited 3/10s)
- `lifecycle.registerInterval/Timeout/Subscription` — Auto-cleaned lifecycle hooks

### UI Components (`@rebel/plugin-ui`)

`Button`, `Card`, `Input`, `Stack`, `Badge`, `Textarea`, `LoadingCard`, `ErrorCard`, `Tabs` (TabsList, TabsTrigger, TabsContent), `Select`, `Dialog` (DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter)

See [plugin-ui.md](references/plugin-ui.md) for props and usage.

### Events (`useRebelEvent`)

| Event | Payload | Notes |
|-------|---------|-------|
| `turn:started` | `{ sessionId, turnId }` | Suppressed in private mode |
| `turn:completed` | `{ sessionId, turnId, assistantText }` | Suppressed in private mode |
| `turn:error` | `{ sessionId, turnId, error }` | Suppressed in private mode |
| `conversation:created` | `{ sessionId, title }` | Suppressed in private mode |
| `navigation:changed` | `{ target, previousTarget }` | |
| `memory:source-added` | `{ turnId, summary? }` | |
| `custom:${string}` | varies | Custom events — use `custom:` prefix for cross-plugin events |

## Key Constraints

1. **Single file only** — entire plugin must be one TSX file
2. **Allowed imports only** — `react`, `@rebel/plugin-api`, `@rebel/plugin-ui`. No other imports.
3. **No external requests** — avoid `fetch()`, `XMLHttpRequest`, `WebSocket`
4. **No DOM manipulation** — no `document.querySelector`, `innerHTML`, etc.
5. **No `window` global** — `window` is blocked entirely by the AST validator (including `window.addEventListener`, `window.location`, `window.innerWidth`, etc.). Use `document.addEventListener()`/`document.removeEventListener()` for event listeners. Note: `document.write()` and `document.cookie` are also blocked.
6. **Theme-aware styling** — use CSS variables: `var(--color-bg)`, `var(--color-text)`, `var(--color-text-secondary)`, `var(--color-border)`, `var(--color-accent)`. Never hardcode colors.
7. **Default export required** — the plugin component must be the default export
8. **Plugin ID format** — kebab-case, e.g., `meeting-prep`, `daily-focus`
9. **Lifecycle management** — use `rebel.lifecycle.registerInterval()` instead of raw `setInterval()`
10. **Unicode in JSX text** — use actual characters or `{'\u2190'}`, not `\uXXXX` escape sequences in JSX text
11. **React keys in lists** — always use unique string/number keys in `.map()` calls (e.g., `key={item.id}`). Never pass an object as a key.
12. **Never use filesystem `Edit` / `Write` on plugin source files** — always use `rebel_plugins_create`. Direct filesystem edits bypass compile validation, trigger space-safety approval loops, and are blocked by the safety hook. This applies even when the plugin has been copied to a Space.

See [constraints.md](references/constraints.md) for the full list with rationale.

## Tips for Good Plugins

- Keep the UI simple — use `Card`, `Stack`, `Badge` for layout
- Use `var(--color-*)` CSS variables for theming
- Derive data from hooks — they're reactive and auto-update
- Use `rebel.lifecycle.registerInterval()` for recurring tasks (auto-cleaned on unmount)
- Handle loading and empty states with `LoadingCard` and fallback text
- Use `ErrorCard` for error states
- Add plugin docs via `documentation` field in `rebel_plugins_create` (shown in Settings > Plugins)
- For shared-data plugins (Space plugins where all members share data), set `storageScope: 'shared'` in the manifest. Default is `'local'` (per-user data). See [constraints.md](references/constraints.md#storage-scope-storagescope-manifest-field) for details.

See [patterns.md](references/patterns.md) for complete examples.
