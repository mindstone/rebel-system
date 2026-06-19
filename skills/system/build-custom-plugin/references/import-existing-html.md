---
description: How to convert an existing HTML page (with inline JS) into a Rebel plugin using iframe srcDoc
---

# Importing an Existing HTML Page as a Plugin

Use this pattern when the user asks to "make this into a plugin" / "turn this dashboard into a plugin" / "wrap this in a tab" from an existing HTML page that contains inline JS (`onclick` handlers, `<script>` blocks, embedded data, etc.).

This is the supported pattern for legacy HTML. Native TSX with `@rebel/plugin-api` hooks is preferred when starting from scratch — but if the user already has working HTML, the iframe route preserves their work without translation cost.

## The Pattern

```tsx
import React from 'react';

// Use String.raw to avoid escape issues with backslashes in the HTML.
// Do NOT use regular "..." or '...' — they require escaping every backslash
// and every quote, which causes silent corruption in long HTML bodies.
const pageHtml = String.raw`
<!DOCTYPE html>
<html>
  <!-- paste the FULL original HTML here, unmodified -->
</html>
`;

export default function MyPlugin() {
  return (
    <iframe
      srcDoc={pageHtml}
      sandbox="allow-scripts"
      style={{ width: '100%', height: '100%', border: 'none' }}
      title="My Plugin"
    />
  );
}
```

## Mandatory Pre-Submit Checklist

Before calling `rebel_plugins_create`, verify ALL of the following. The server will reject the source if any check fails — fix locally first to avoid wasted round-trips.

1. **Handler completeness** — find every `onclick="fn()"`, `onchange="fn()"`, `onsubmit="fn()"`, `oninput="fn()"`, `onmouseover="fn()"`, `onmouseout="fn()"`, `onfocus="fn()"`, `onblur="fn()"`, `onkeydown="fn()"`, `onkeyup="fn()"` in the HTML. Confirm each `fn` is defined somewhere inside a `<script>` block in `pageHtml`. Missing handlers are the #1 cause of "plugin loads but nothing is clickable" bugs.

2. **Size sanity** — `pageHtml` must be at least as large as the original HTML file. If it is meaningfully smaller (>30% shrink), you have silently dropped content. Re-paste the original and check what's missing.

3. **`String.raw\`...\`` usage** — never use regular `"..."` or `'...'` for the HTML literal. They require escaping every backslash and quote, which is unmanageable for long HTML bodies and causes silent corruption.

4. **`sandbox="allow-scripts"`** — the iframe must have this attribute. Without it, all JS is blocked and `onclick` handlers are silent no-ops. The plugin will look right and click nothing.

5. **Default export + manifest fields** — the wrapper is still a React component with a default export. Pass `id`, `name`, and `source` (the TSX string) to `rebel_plugins_create`.

## When to Use This vs. a Native Plugin

| Situation | Approach |
|-----------|----------|
| User has existing HTML page with inline JS/CSS they want preserved | `iframe srcDoc` (this pattern) |
| User wants a brand-new dashboard, can use Rebel hooks | Native TSX with `useConversations`, `useSources`, etc. |
| Plugin needs to call Rebel APIs (`useRebel`, `usePluginStorage`, etc.) | Native TSX — iframes cannot access plugin hooks |
| Mix of legacy display + new Rebel-aware controls | Native TSX wrapper with `<iframe srcDoc>` for the legacy display portion only |

## Making the Plugin Easy to Update

Number the logical sections with comments so future edits are easy to locate, and so a returning agent can find the right slice without re-reading 2000 lines:

```tsx
const pageHtml = String.raw`
<!DOCTYPE html>
<html>
<!-- 01-styles -->
<style> ... </style>

<!-- 02-structure -->
<body>
  <div class="container"> ... </div>
</body>

<!-- 03-data -->
<script>
  const DATA = { ... };
</script>

<!-- 04-handlers -->
<script>
  function showTab(id) { ... }
  function sortTbl(col) { ... }
</script>
</html>
`;
```

## Common Pitfalls

- **Stripping the script body** to "save tokens" — never do this. The server-side validator will reject placeholder script bodies like `<script>/* logic preserved */</script>`. If the HTML is large, that's the cost; submit the full thing.
- **Forgetting `sandbox="allow-scripts"`** — common when copy-pasting from React docs. Without it, the iframe loads and renders, but every click is a no-op.
- **Using `dangerouslySetInnerHTML` instead of `srcDoc`** — `dangerouslySetInnerHTML` is blocked by the AST validator. Use the `srcDoc` prop on `<iframe>`.
- **Trying to import `@rebel/plugin-api` inside the HTML** — the HTML runs inside the sandboxed iframe and has no access to Rebel APIs. If you need them, restructure to native TSX outside the iframe.

## Updating an Existing iframe Plugin

When the user later asks to modify a plugin that uses this pattern:

1. Call `rebel_plugins_list` to find the exact plugin id (especially important for forks — `{id}-custom`).
2. Call `rebel_plugins_get_source` to read the current TSX (including the full `pageHtml` string).
3. Edit the TSX in your response — modify the relevant numbered section of `pageHtml` and leave the rest untouched.
4. Call `rebel_plugins_create` with the **same exact id** and the full updated source.

**Do NOT use filesystem `Edit` / `Write` on the plugin's `index.tsx` file**, even when the plugin has been copied to a Space (`work/<space>/plugins/<id>/index.tsx`). Direct filesystem writes are blocked by the safety hook and trigger redundant approval prompts; `rebel_plugins_create` is the one supported update path.
