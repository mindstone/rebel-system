# Plugin Constraints

> **Canonical sources:**
> - `src/renderer/features/plugins/compiler/importRewriter.ts` — allowed imports
> - `src/renderer/features/plugins/compiler/astValidator.ts` — forbidden patterns

## Allowed Imports

Only these modules can be imported:
- `react` — React, useState, useEffect, useRef, useMemo, useCallback, useReducer
- `react/jsx-runtime` — (auto-handled by compiler)
- `@rebel/plugin-api` — all hooks and APIs
- `@rebel/plugin-ui` — all UI components

Any other import will fail compilation.

## Forbidden Patterns (blocked by AST validator)

- **Forbidden globals** — `window`, `globalThis`, `self`, `localStorage`, `sessionStorage`, `indexedDB` (any bare reference is blocked; property access like `obj.window` is fine)
- `eval()` / `Function()` constructor
- `document.write()`, `document.writeln()`
- `document.cookie`
- `innerHTML`, `outerHTML`, `insertAdjacentHTML`
- Dynamic `require()` (non-string-literal arguments)
- `import()` (dynamic imports)
- Network APIs — `fetch()`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`

**Note:** `document.addEventListener()`/`document.removeEventListener()` are allowed (used for global event listeners in place of `window.addEventListener`).

## Structural Requirements

- **Default export required** — the plugin must export a default React component
- **Single file** — entire plugin in one TSX file
- **Plugin ID** — kebab-case only (e.g., `meeting-prep`)

## Permissions

Plugins declare permissions in the manifest to access specific APIs:

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "permissions": ["memory:read", "conversations:write", "external-fetch"],
  "externalDomains": ["api.example.com"]
}
```

| Permission | Required for | Default (legacy) |
|-----------|-------------|------------------|
| `conversations:read` | `useConversations()` | ✅ |
| `conversations:transcript` | `getTranscript()` | ❌ |
| `conversations:write` | `sendMessage()`, `startConversation()` | ❌ |
| `memory:read` | `useTopics()`, `useSources()`, `useMemorySearch()`, `useMeetings()` | ✅ |
| `skills:read` | `useSkillFile()` | ✅ |
| `skills:write` | `skills.write()` | ❌ |
| `entities:read` | `useEntities()` | ✅ |
| `automations:create` | `automations.create()` | ❌ |
| `inbox:write` | `inbox.addItem()` | ❌ |
| `external-fetch` | `useExternalFetch()`, `rebel.fetch()` | ❌ |

**External domains** must be declared alongside `external-fetch` permission:

```json
{
  "permissions": ["external-fetch"],
  "externalDomains": ["api.example.com", "*.github.com"]
}
```

Wildcard subdomains (`*.example.com`) are supported. Requests to undeclared domains are blocked.

## Styling Rules

- **Use CSS variables** for theming:
  - `var(--color-bg)` — background
  - `var(--color-text)` — primary text
  - `var(--color-text-secondary)` — secondary text
  - `var(--color-border)` — borders
  - `var(--color-accent)` — accent/highlight color
- **Never hardcode colors** — must work in both light and dark modes
- Use inline styles or the CSS variables above. No CSS imports or stylesheets.

## Network & DOM Restrictions

- **External requests via `useExternalFetch()` only** — plugins can make HTTP requests only through the mediated fetch API, which validates against the manifest's `externalDomains`. Direct `fetch()`, `XMLHttpRequest`, `WebSocket`, `EventSource`, and `navigator.sendBeacon()` are blocked by the AST validator.
- **No DOM manipulation** — `document.querySelector`, `document.getElementById`, etc. are discouraged. Use React patterns.

## Lifecycle Rules

- Use `rebel.lifecycle.registerInterval()` not raw `setInterval()`
- Use `rebel.lifecycle.registerTimeout()` not raw `setTimeout()`
- These auto-clean on plugin unmount, preventing memory leaks

## React Keys in Lists

Always use a **unique string or number** as the `key` prop when rendering lists with `.map()`. Never use an object or array element directly as a key.

```tsx
// WRONG — object as key produces [object Object]
items.map(item => <Card key={item}>...</Card>)

// CORRECT — use a unique string identifier
items.map(item => <Card key={item.id}>...</Card>)
items.map(item => <Card key={item.relativePath}>...</Card>)
items.map((item, index) => <Card key={`${item.title}-${index}`}>...</Card>)
```

Common key fields by hook:
| Hook | Key field |
|------|-----------|
| `useConversations()` | `item.id` |
| `useSources()` | `item.relativePath` |
| `useMeetings()` | `meeting.id` |
| `useMemorySearch()` | `` `${result.filePath}-${index}` `` |
| `useTopics()` | `topic.relativePath` |
| `useEntities()` | `entity.canonicalName` |

## Unicode in JSX

`\uXXXX` escape sequences in JSX text content render as literal characters. Use actual Unicode characters or JSX expressions:
```tsx
// Wrong — renders literal \u2190
<span>\u2190 Back</span>

// Correct
<span>{'\u2190'} Back</span>
<span>← Back</span>
```

## Rate Limits

| Feature | Limit |
|---------|-------|
| AI calls (`useAi`) | 10 calls/minute per plugin |
| Toasts (`showToast`) | 3 per 10 seconds per plugin |
| Messages (send/start) | 5 per minute per plugin |
| Transcript reads (`getTranscript`) | 10 calls/minute per plugin |
| Inbox items (`inbox.addItem`) | 10 per minute per plugin |
| Automation creation | 3 per hour per plugin |
| Skill writes | 5 per minute per plugin |
| Plugin storage | 10MB per plugin |
| Memory search results | max 50 per query |

## Storage Scope (`storageScope` Manifest Field)

Plugins can declare where their data is stored via the `storageScope` manifest field:

| Value | Location | Use Case |
|-------|----------|----------|
| `'local'` (default) | `{userData}/plugin-data/{pluginId}/data.json` | Per-user data — each user has their own copy |
| `'shared'` | `{spacePath}/plugins/{pluginId}/data.json` | Shared with all Space members — colocated with plugin code |

**Key points:**
- `storageScope` controls **data location only**, not code location. Code lives wherever the plugin files physically are.
- A shared-code plugin (in a Space) can have `storageScope: 'local'` — each user has their own data. This is the default.
- A shared-code plugin can have `storageScope: 'shared'` — all Space members share the same data file.
- Plugins not in a Space cannot declare `storageScope: 'shared'` (will fall back to local with a warning).
- **Concurrent edits are last-write-wins (LWW).** If two users edit shared data simultaneously, the last save wins.

### Shared Data: Flat Key Recommendation

For shared-data plugins, **prefer flat top-level keys** to minimise data loss from concurrent edits:

```typescript
// RECOMMENDED — flat keys: concurrent edits to different keys don't conflict
const [theme, setTheme] = usePluginStorage('userPrefs.theme', 'light');
const [fontSize, setFontSize] = usePluginStorage('userPrefs.fontSize', 14);
const [taskCount, setTaskCount] = usePluginStorage('stats.taskCount', 0);

// AVOID — nested objects: concurrent edits to any property overwrite the entire object
const [prefs, setPrefs] = usePluginStorage('userPrefs', { theme: 'light', fontSize: 14 });
```

When two users concurrently edit the same `data.json`, the entire file is replaced (LWW). With flat keys, only the key being written gets overwritten. With nested objects, the whole object value is replaced.
| Source results | max 50 per query |
| AI summarize/extract input | max 5000 characters |
| AI generate input | max 2000 characters |
| AI generate output | max 1000 tokens |
