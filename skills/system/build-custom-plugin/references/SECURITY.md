# Plugin Security Reference

Security model for Rebel plugins, including what triggers each severity level and how to fix common issues.

## Overview

Plugins run inside the renderer process in Rebel's React tree. Before a plugin can be enabled, a static security review scans its source code for dangerous patterns. Findings are classified into three severity levels — `info`, `warn`, and `block`.

- **`info`** — Standard, expected usage. No action needed.
- **`warn`** — Suspicious but not blocking. The user sees a warning banner but can still enable the plugin.
- **`block`** — Dangerous patterns detected. The Enable button is disabled and the plugin cannot be activated until the code is fixed.

If the security scanner itself throws an error, the plugin is treated as **blocked** (fail-closed).


## What Triggers Each Severity

### Block (cannot enable)

These patterns always trigger `block` severity — no permission can downgrade them:

| Pattern | Why it's blocked |
|---------|-----------------|
| `eval()` | Arbitrary code execution |
| `Function()` / `new Function(...)` | Arbitrary code execution via constructor |
| `setTimeout('string', ...)` | String argument is evaluated as code |
| `setInterval('string', ...)` | String argument is evaluated as code |
| Raw `fetch()` | Bypasses the mediated external fetch path |
| `XMLHttpRequest` | Bypasses the mediated external fetch path |
| `WebSocket` | Bypasses the mediated external fetch path |
| `EventSource` | Bypasses the mediated external fetch path |
| `navigator.sendBeacon()` | Network exfiltration without mediation |

**Exception — mediated fetch:** If a plugin references `useExternalFetch()` or `rebel.fetch()` AND declares the `external-fetch` permission, a `fetch()` match is downgraded to `info`. This recognises that the mediated fetch hook internally uses `fetch` under the hood. Raw `fetch()` without the mediated path always blocks.

### Warn (review recommended)

| Pattern | Why it's flagged |
|---------|-----------------|
| `document.querySelector()` / `document.querySelectorAll()` | Direct DOM access outside React |
| `document.getElementById()` | Direct DOM lookup outside React |
| `document.createElement()` | Direct DOM creation outside React |
| `innerHTML` | XSS risk |
| `document.cookie` | Cookie access |
| `localStorage` | Use `usePluginStorage` instead |
| `sessionStorage` | Use `usePluginStorage` instead |
| `import()` (dynamic) | Can load external code at runtime |

### Info (no concerns)

| Pattern | Classification |
|---------|---------------|
| React hooks (`useState`, `useEffect`, etc.) | Standard React usage |
| Plugin hooks (`usePluginStorage`, `useMemorySearch`, `useConversations`, etc.) | Sanctioned plugin API |
| `useExternalFetch()` with `external-fetch` permission | Mediated network path |


## How to Fix Common Blocking Patterns

### Raw `fetch()` → Use `useExternalFetch` or `rebel.fetch()`

**Blocked:**
```tsx
const response = await fetch('https://api.example.com/data');
```

**Fixed:**
```tsx
import { useExternalFetch, useRebel } from '@rebel/plugin-api';

// Hook-based (reactive, auto-refetches):
const { data, isLoading, error } = useExternalFetch<MyData>('https://api.example.com/data');

// Imperative (one-shot):
const rebel = useRebel();
const result = await rebel.fetch('https://api.example.com/data');
```

Also declare the permission and domains in your manifest:
```json
{
  "permissions": ["external-fetch"],
  "externalDomains": ["api.example.com"]
}
```

### `eval()` / `Function()` → Restructure logic

There is no permission or workaround for `eval()` or `Function()`. Restructure your code to avoid dynamic code execution entirely.

### `localStorage` / `sessionStorage` → Use `usePluginStorage`

**Flagged:**
```tsx
localStorage.setItem('theme', 'dark');
```

**Fixed:**
```tsx
import { usePluginStorage } from '@rebel/plugin-api';

const [theme, setTheme] = usePluginStorage('theme', 'light');
```

### DOM access → Use React patterns

**Flagged:**
```tsx
const el = document.getElementById('my-panel');
el.innerHTML = '<p>Hello</p>';
```

**Fixed:**
```tsx
const [content, setContent] = useState('Hello');
return <p>{content}</p>;
```

Use React refs (`useRef`) when you need a DOM reference, and React state for rendering.


## How Permissions Interact with Security Findings

Most severity levels are fixed — no permission can downgrade `eval()` from `block`, and DOM access is always `warn` regardless of permissions.

The one exception is `fetch()`:
- Raw `fetch()` alone → **block**
- `fetch()` regex match + plugin references `useExternalFetch`/`rebel.fetch()` + `external-fetch` permission declared → **info** (the match is from the mediated path's internal implementation)

This distinction exists because the mediated fetch hook (`useExternalFetch`) internally uses `fetch` to make its requests through the main-process security pipeline. The scanner recognises this pattern and doesn't penalise it.


## Security Model Summary

1. **Static analysis (pre-enable):** Source code is scanned with regex patterns before the plugin can be activated. Block-severity findings prevent enabling entirely.
2. **AST validation (compile-time):** The plugin compiler separately validates the AST, blocking `window` access, `document.write`, `require()`, and non-allowlisted imports.
3. **Permission enforcement (runtime):** Every plugin API call is permission-checked both renderer-side (defense-in-depth) and main-process-side (authoritative).
4. **External fetch mediation (runtime):** Network requests go through domain allowlisting, DNS validation, private IP blocking, rate limiting, and response size caps.
5. **Rate limiting (runtime):** All write APIs and AI calls are rate-limited per plugin.


## Guidance for Agents Building Plugins

When generating plugin code:

1. **Never use `eval()`, `Function()`, or string-argument `setTimeout`/`setInterval`.** These will always block.
2. **Never use raw `fetch()`, `XMLHttpRequest`, or `WebSocket`.** Use `useExternalFetch` or `rebel.fetch()` with the `external-fetch` permission and `externalDomains` declared.
3. **Avoid direct DOM manipulation** (`document.querySelector`, `innerHTML`, etc.). Use React components and state management instead.
4. **Use `usePluginStorage`** instead of `localStorage`/`sessionStorage` for persistent data.
5. **Declare all needed permissions** in the manifest — undeclared permissions are denied at runtime.
6. **Keep external domains minimal** — only list the specific domains the plugin needs.
