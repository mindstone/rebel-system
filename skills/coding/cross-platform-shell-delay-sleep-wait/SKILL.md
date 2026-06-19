---
name: cross-platform-shell-delay-sleep-wait
description: "How to pause/sleep in shell commands on macOS, Linux, and Windows — use this when the agent needs to wait before running the next command."
last_updated: 2026-02-13
---

# Cross-Platform Shell Delay

When the agent needs to wait for a period of time (e.g., waiting for a port to release, a process to exit, or a file to become available), use the correct delay command for the user's platform.

## Platform Commands

| Platform | Command | Notes |
|----------|---------|-------|
| macOS / Linux | `sleep <seconds>` | POSIX standard; supports decimals (`sleep 0.5`) |
| Windows (cmd.exe) | `timeout /t <seconds> /nobreak` | Built-in; `/nobreak` prevents user from skipping |
| Windows (PowerShell) | `Start-Sleep -Seconds <seconds>` | Native cmdlet; also supports `-Milliseconds` |

## In Chained Commands

Use `&&` to chain a delay before the next command:

**macOS / Linux:**
```bash
sleep 2 && npm run dev
```

**Windows (cmd.exe):**
```cmd
timeout /t 2 /nobreak && npm run dev
```

**Windows (PowerShell):**
```powershell
Start-Sleep -Seconds 2; npm run dev
```

## In Node.js (Cross-Platform)

When Node.js is available (always true in this Electron project), this works on all platforms:

```bash
node -e "setTimeout(() => {}, 5000)"
```

Or inline before another command (use `&&` on macOS/Linux/cmd, `;` in PowerShell):

```bash
node -e "setTimeout(() => process.exit(), 2000)" && npm run dev
```

## In Application Code (TypeScript)

The codebase already uses a standard pattern for async delays:

```typescript
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

await sleep(2000);
```

See `src/main/services/demoModeService.ts` for the canonical example of platform-branching with `process.platform`.

## Platform Detection

Branch on `process.platform` when spawning shell commands:

```typescript
const delay = process.platform === 'win32'
  ? 'timeout /t 2 /nobreak &&'
  : 'sleep 2 &&';
```
