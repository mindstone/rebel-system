# Plugin Data Migrations

When a plugin evolves, its stored data schema may change. Without versioning, old data can cause crashes or silent corruption when the updated plugin code tries to read it.

## Why Schema Versioning Matters

- A plugin stores `{ count: 5 }` in version 1
- Version 2 renames the field to `{ total: 5, history: [] }`
- Without migration, version 2 code reads `undefined` for `total` and crashes or silently loses data

## Using `usePluginStorageWithVersion`

The convenience hook `usePluginStorageWithVersion` wraps `usePluginStorage` with automatic version tracking and migration.

```tsx
import { usePluginStorageWithVersion } from '@rebel/plugin-api';

// Current schema (version 2)
interface PluginData {
  total: number;
  history: number[];
}

const defaultData: PluginData = { total: 0, history: [] };

function MyPlugin() {
  const [data, setData] = usePluginStorageWithVersion<PluginData>(
    'stats',
    defaultData,
    {
      schemaVersion: 2,
      migrate: (oldVersion, oldData) => {
        if (oldVersion < 1) {
          // No previous data or pre-versioning data
          return defaultData;
        }
        if (oldVersion < 2) {
          // Migrate from v1: { count: number } → v2: { total, history }
          const v1 = oldData as { count?: number };
          return {
            total: v1.count ?? 0,
            history: [],
          };
        }
        // Unknown future version — return default
        return defaultData;
      },
    },
  );

  return <div>Total: {data.total}</div>;
}
```

### How It Works

1. Data is stored in a version envelope: `{ _v: number, d: T }`
2. On load, if the stored `_v` is less than `schemaVersion`, the `migrate` callback runs
3. The migrated data is written back with the current version
4. On write, data is always wrapped in the envelope with the current `_v`
5. If data has no `_v` (pre-versioning), it's treated as version 0

### Writing a Migration Function

The `migrate` function receives `(oldVersion, oldData)` and must return the new shape `T`:

```typescript
migrate: (oldVersion: number, oldData: unknown) => {
  // Handle each version transition
  let data = oldData as Record<string, unknown>;

  if (oldVersion < 1) {
    // From unversioned → v1
    data = { items: [], createdAt: Date.now() };
  }
  if (oldVersion < 2) {
    // From v1 → v2: add 'tags' field
    data = { ...data, tags: [] };
  }
  if (oldVersion < 3) {
    // From v2 → v3: rename 'items' to 'entries'
    const { items, ...rest } = data;
    data = { ...rest, entries: items ?? [] };
  }

  return data as MyDataV3;
}
```

**Best practices:**
- Use cascading `if (oldVersion < N)` checks so migrations compose (v1→v2→v3 works in one pass)
- Handle missing or null fields gracefully — the old data may be incomplete
- Keep migrations simple — avoid async operations or complex logic
- Test migrations with sample data from each version

### Error Handling

If the `migrate` callback throws an error:
- The old data is preserved (not overwritten)
- A warning is logged to the console
- The plugin receives the old data as-is
- On the next mount, migration is retried (since the version was never bumped)

## Manual Approach (Without the Hook)

If you prefer to handle versioning yourself, you can use `usePluginStorage` directly with a version key:

```tsx
import { usePluginStorage } from '@rebel/plugin-api';

function MyPlugin() {
  const [version, setVersion] = usePluginStorage('_schemaVersion', 0);
  const [data, setData] = usePluginStorage('myData', { count: 0 });

  useEffect(() => {
    if (version < 1) {
      // Migrate from v0 to v1
      setData({ ...data, label: 'default' });
      setVersion(1);
    }
  }, [version]);

  // ... use data
}
```

This approach gives you full control but requires managing the version tracking and migration timing yourself.

## Guidance for Agents

When making code changes that alter a plugin's data schema:

1. **Check if the plugin stores data** — look for `usePluginStorage` or `usePluginStorageWithVersion` calls
2. **Ask the user** whether existing data needs migrating before proceeding
3. **Bump the schema version** and add the appropriate migration step
4. If the plugin uses `usePluginStorage` and now needs versioning, switch to `usePluginStorageWithVersion` and set the initial `schemaVersion` to 1, treating the old unversioned data as version 0
