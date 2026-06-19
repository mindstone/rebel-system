# Plugin API Reference (`@rebel/plugin-api`)

> **Canonical source:** `src/renderer/features/plugins/declarations/rebel-plugin-api.d.ts`
> This file is derived from the `.d.ts` declarations. When in doubt, read the source.

> **Breaking change (v0.2, 2026-06): `pinnedAt` → `doneAt`.** The conversation
> lifecycle field was renamed and its polarity inverted. Old `pinnedAt != null`
> (Active) is now `doneAt == null` (Active); old `pinnedAt == null` (Done) is now
> `doneAt != null` (Done). The `conversation:updated` event reports `'doneAt'`
> instead of `'pinnedAt'`. If your plugin stopped reading the lifecycle state,
> switch to `conversation.doneAt` and flip your `!= null` / `== null` checks.

## useConversations(params?)

Returns a live list of conversation summaries. Re-renders when conversations change.

```typescript
function useConversations(params?: {
  query?: string;           // Filter by title substring (case-insensitive)
  limit?: number;           // Max results (default 50, max 100)
  offset?: number;          // For pagination
  sortBy?: 'updatedAt' | 'createdAt' | 'title';  // Default: updatedAt desc
}): {
  data: ConversationSummary[];
  totalCount: number;
  isLoading: boolean;
}
```

**ConversationSummary fields:** `id`, `title`, `updatedAt`, `createdAt`, `isBusy`, `messageCount`, `preview`, `doneAt`, `starredAt` (`doneAt` non-null = Done — renamed from `pinnedAt` with inverted polarity; see the breaking-change note at the top)

## useRebel()

Returns the Rebel API object for navigation, conversation management, toasts, skills, inbox, automations, and lifecycle.

```typescript
function useRebel(): RebelApi

interface RebelApi {
  conversations: {
    open(sessionId: string): void;
    list(): ConversationSummary[];
    toggleDone(sessionId: string): void; // renamed from pin() v0.2 — toggles Active/Done
    star(sessionId: string): void;
    rename(sessionId: string, title: string): void;
    create(options?: { draftText?: string; navigate?: boolean }): string;
    sendMessage(sessionId: string, message: string): Promise<PluginWriteResult>;
    startConversation(message: string): Promise<PluginWriteResult<{ sessionId: string }>>;
    getTranscript(sessionId: string, options?: { limit?: number }): Promise<PluginWriteResult<{ messages: TranscriptMessage[] }>>;
  };
  navigate: NavigationHelpers;
  skills: {
    write(relativePath: string, content: string, opts?: { baseContentHash?: string }):
      Promise<{ ok: boolean; currentHash?: string; conflict?: boolean; error?: string }>;
  };
  inbox: {
    addItem(item: InboxAddItem): Promise<PluginWriteResult<{ itemId: string }>>;
    getItems(params?: { limit?: number }): Promise<InboxPluginItem[]>;
  };
  automations: {
    create(params: CreateAutomationParams): Promise<{ automationId: string; ok: boolean; error?: string }>;
    list(params?: { pluginId?: string }): Promise<AutomationEntry[]>;
  };
  ui: {
    showToast(message: string, options?: ShowToastOptions): void;
  };
  lifecycle: PluginLifecycle;
}
```

## Error Envelope Pattern

All write/mutation methods return a `PluginWriteResult<T>` discriminated union:

```typescript
type PluginWriteResult<T extends Record<string, unknown> = Record<string, never>> =
  | ({ ok: true } & T)
  | { ok: false; error: string };
```

Check `result.ok` before accessing payload fields:

```typescript
const result = await rebel.conversations.startConversation('Hello');
if (result.ok) {
  console.log('Created session:', result.sessionId);
} else {
  console.error('Failed:', result.error);
}
```

This pattern applies to: `sendMessage()`, `startConversation()`, `inbox.addItem()`, `automations.create()`, `skills.write()`, `getTranscript()`.

**NavigationHelpers:** Callable as `navigate('rebel://...')` or via typed methods:
- `navigate.toSettings(tab?)` — Open Settings (tab: `system`, `spaces`, `meetings`, `tools`, `agents`, `voice`, `safety`, `diagnostics`, `developer`, `usage`, `cloud`, `account`)
- `navigate.toAutomations()` — Open Automations
- `navigate.toTasks()` — Open Tasks
- `navigate.toLibrary(filePath?)` — Open Library
- `navigate.toPlugin(pluginId)` — Open a plugin tab

**ShowToastOptions:** `variant` ('default'|'success'|'error'|'info'|'warning'), `duration` (ms, default 5000). Rate-limited: 3 toasts per 10 seconds per plugin.

**PluginLifecycle:** `registerInterval(cb, ms)`, `registerTimeout(cb, ms)`, `registerSubscription(unsub)` — auto-cleaned on unmount.

## conversations.getTranscript(sessionId, options?)

Read transcript messages from a conversation. Permission: `conversations:transcript`. Rate-limited: 10 calls/minute per plugin.

```typescript
function getTranscript(sessionId: string, options?: {
  limit?: number;  // Default 100
}): Promise<PluginWriteResult<{ messages: TranscriptMessage[] }>>

type TranscriptMessage = {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  toolsUsed?: string[];
}
```

- Privacy-safe: returns messages only (no hidden content), with tool names only in `toolsUsed`
- Private and deleted sessions return an empty messages array
- Hidden messages are filtered out

## usePluginStorage\<T\>(key, defaultValue)

Per-plugin persistent KV storage. Returns `[value, setValue]` tuple. 10MB quota per plugin.

```typescript
function usePluginStorage<T>(key: string, defaultValue: T): [T, (value: T) => void]
```

### storageScope Manifest Field

Controls where plugin data is stored. Independent of where plugin code lives.

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "storageScope": "shared"
}
```

| Value | Location | Behaviour |
|-------|----------|-----------|
| `'local'` (default) | `{userData}/plugin-data/{pluginId}/data.json` | Per-user — each user has their own data |
| `'shared'` | `{spacePath}/plugins/{pluginId}/data.json` | Shared with all Space members |

**For shared-data plugins, prefer flat top-level keys** (e.g., `userPrefs.theme` instead of a nested `userPrefs` object). This minimises data loss if two users edit at the same time, since concurrent edits are last-write-wins at the file level.

## usePluginStorageWithVersion\<T\>(key, defaultValue, options)

Convenience wrapper around `usePluginStorage` that adds schema versioning and automatic data migration. Returns the same `[value, setValue]` tuple. Data is stored in a version envelope `{ _v: number, d: T }`.

```typescript
function usePluginStorageWithVersion<T>(
  key: string,
  defaultValue: T,
  options: {
    schemaVersion: number;
    migrate: (oldVersion: number, oldData: unknown) => T;
  }
): [T, (value: T) => void]
```

- On load: if stored version < `schemaVersion`, calls `migrate(oldVersion, oldData)` and writes back upgraded data
- On load: unversioned data (no envelope) is treated as version 0
- On write: always wraps in envelope with current `_v`
- If `migrate` throws: old data is preserved, warning logged, migration retried on next mount

**Example:**

```tsx
const [data, setData] = usePluginStorageWithVersion<MyData>(
  'settings',
  { theme: 'light', fontSize: 14 },
  {
    schemaVersion: 2,
    migrate: (oldVersion, oldData) => {
      const d = oldData as Record<string, unknown>;
      if (oldVersion < 1) return { theme: 'light', fontSize: 14 };
      if (oldVersion < 2) return { ...d, fontSize: d.fontSize ?? 14 } as MyData;
      return d as MyData;
    },
  },
);
```

See [MIGRATIONS.md](MIGRATIONS.md) for full migration guidance.

## useTopics(params?)

List workspace topics from memory/topics/. Permission: `memory:read`.

```typescript
function useTopics(params?: {
  query?: string;
  spacePath?: string;
  limit?: number;        // Default 50
}): { topics: TopicEntry[]; isLoading: boolean; error: string | null }
```

**TopicEntry fields:** `relativePath`, `title`, `spacePath`, `updatedAt`

## useTopicContent(relativePath)

Read a single topic's markdown content. Permission: `memory:read`.

```typescript
function useTopicContent(relativePath: string): {
  content: string | null;
  isLoading: boolean;
  error: string | null;
}
```

## useMemorySearch(query, options?)

Semantic search across workspace files. Debounced 300ms. Permission: `memory:read`.

```typescript
function useMemorySearch(query: string, options?: {
  limit?: number;        // Default 10, max 50
  pathPrefix?: string;   // e.g., 'memory/sources'
}): {
  results: SearchResult[];  // { filePath, title, snippet, score }
  isLoading: boolean;
  error: string | null;
  status: 'ok' | 'index_not_ready' | 'embedding_not_ready' | 'error';
}
```

## useSources(params?)

Search/browse memory sources (meetings, recordings, etc.). Debounced 300ms. Permission: `memory:read`.

```typescript
function useSources(params?: {
  query?: string;
  sourceTypes?: string[];     // 'meeting', 'email', 'slack', etc.
  participants?: string[];
  dateRange?: { after?: string; before?: string };  // YYYY-MM-DD
  limit?: number;             // Default 20, max 50
}): {
  sources: SourceEntry[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
}
```

**SourceEntry fields:** `relativePath`, `title`, `sourceType`, `sourceSystem`, `occurredAt`, `participants`, `summary`, `keyTakeaways`, `durationMinutes?`, `description`, `sourceUrl?`, `relevanceScore?`

## useSourceDocument(relativePath)

Load a full source document by path. Restricted to `memory/sources/` paths. Permission: `memory:read`.

```typescript
function useSourceDocument(relativePath: string): {
  document: SourceDocument | null;
  isLoading: boolean;
  error: string | null;
}
```

**SourceDocument fields:** all SourceEntry fields plus `storedAt`, `truncated`, `content` (raw markdown, frontmatter stripped)

## useEntities(params?)

Search people/company entities. Permission: `entities:read`.

```typescript
function useEntities(params?: {
  entityType?: 'person' | 'company';
  query?: string;
  company?: string;
  limit?: number;        // Default 20, max 50
}): { entities: EntityEntry[]; isLoading: boolean; error: string | null }
```

**EntityEntry fields:** `canonicalName`, `entityType`, `emails`, `company`, `role`, `domain`, `aliases`

## useSkillFile(relativePath)

Read a skill file with parsed YAML frontmatter. Permission: `skills:read`.

```typescript
function useSkillFile(relativePath: string): {
  content: string | null;
  frontmatter: Record<string, unknown> | null;
  isLoading: boolean;
  error: string | null;
}
```

## useAi()

Constrained LLM access. Rate-limited: 10 calls/minute per plugin.

```typescript
function useAi(): {
  ai: {
    summarize(text: string, options?: { maxLength?: number }): Promise<string>;
    extractObject<T>(text: string, schema: JSONSchema): Promise<T>;
    generate(prompt: string, options?: { maxTokens?: number }): Promise<string>;
  };
  isProcessing: boolean;
  error: string | null;
}
```

**Limits:** summarize/extractObject input max 5000 chars. generate input max 2000 chars, output max 1000 tokens.

## useMeetings(params?)

Cached calendar meetings. Plugin-safe shape (sensitive fields redacted). Permission: `memory:read`.

```typescript
function useMeetings(params?: { todayOnly?: boolean }): {
  meetings: PluginMeeting[];  // { id, title, startTime, endTime, participants, meetingUrl? }
  isStale: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}
```

## useClipboard()

Write-only clipboard access.

```typescript
function useClipboard(): {
  copyText: (text: string) => Promise<boolean>;
}
```

## useExternalFetch(url, options?)

Mediated HTTP requests to manifest-declared domains. Permission: `external-fetch` + `externalDomains` in manifest.

```typescript
function useExternalFetch(url: string, options?: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  enabled?: boolean;
}): {
  data: unknown;
  isLoading: boolean;
  error: string | null;
  fetch: (url: string, opts?) => Promise<FetchResult>;
}
```

Also available as imperative `rebel.fetch(url, opts)` via `useRebel()`.

**Security:** 8-layer validation (domain allowlist, SSRF protection, DNS rebinding mitigation, private IP blocking, response size cap, content-type filtering).

**Manifest requirement:**
```json
{
  "permissions": ["external-fetch"],
  "externalDomains": ["api.example.com", "*.github.com"]
}
```

## useRebelEvent(eventType, callback)

Subscribe to lifecycle events. Auto-unsubscribes on unmount.

```typescript
function useRebelEvent(
  eventType: RebelEventType,
  callback: (payload: unknown) => void
): void

type RebelEventType =
  | 'turn:started'        // { sessionId, turnId }
  | 'turn:completed'      // { sessionId, turnId, assistantText }
  | 'turn:error'          // { sessionId, turnId, error }
  | 'conversation:created' // { sessionId, title }
  | 'navigation:changed'  // { target, previousTarget }
  | 'memory:source-added' // { turnId, summary? }
  | `custom:${string}`;   // custom events (cross-plugin communication)
```

**Privacy:** `turn:*` and `conversation:*` events are suppressed during private-mode sessions.

Plugins can emit and subscribe to custom events using the `custom:` prefix (for example, `custom:my-plugin-data-updated`).

## usePreTurnHook(options)

Register a pre-turn hook that injects context before agent turns.

```typescript
function usePreTurnHook(options: {
  getContext: () => string | null;
  priority?: number;  // ordering hint (higher = later in prompt)
}): void
```

- `getContext()` returns a string to inject (max 2000 chars/plugin, 5000 total) or `null` to skip
- `priority` orders multiple plugin contexts in the system prompt

## usePostTurnHook(callback)

Register a post-turn hook that runs after agent turns complete.

```typescript
function usePostTurnHook(
  callback: (turnResult: { sessionId: string; turnId: string; assistantText?: string }) => void
): void
```

## pluginEventBus

Low-level event bus for plugin-to-plugin or plugin-to-system communication.

Use the `custom:` prefix (for example, `custom:my-plugin-data-updated`) for cross-plugin custom events.

```typescript
const pluginEventBus: {
  subscribe(event: string, callback: (payload: unknown) => void): () => void;  // returns unsubscribe fn
  emit(event: string, payload: unknown): void;
  initialize(): void;
  reset(): void;
  isInitialized(): boolean;
}
```
