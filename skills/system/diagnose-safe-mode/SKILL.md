---
name: diagnose-safe-mode
description: "Diagnose startup issues when Rebel enters Safe Mode. Run diagnostics, interpret results, and guide users through troubleshooting."
---

# Diagnose Safe Mode Issues

**Purpose**: Help users understand why Rebel entered Safe Mode and guide them through troubleshooting.

**When to use**: When the user is in Safe Mode and asks for help troubleshooting, or when you detect `env.isSafeMode` is true in your context.

**Action**: READ-ONLY diagnostics + approval-required fixes. Never modify files without explicit user permission.

---

## Understanding Safe Mode

Safe Mode is a recovery state that disables MCP tools to allow basic troubleshooting. Rebel enters Safe Mode when:

| Trigger | What Happened |
|---------|---------------|
| Startup timeout | Settings or Super-MCP took >30s to load |
| Emergency recovery | User clicked "Restart in Safe Mode" from the emergency dialog |
| Manual flag | User launched with `--safe-mode` CLI flag |
| Port conflict | Another app is using a port Rebel needs |
| Config corruption | JSON parse error in settings or MCP config |
| Permission error | Can't read/write required files |

---

## Step 1: Gather Context

First, check what information you have:

```
Context available:
- env.isSafeMode: boolean (true if in Safe Mode)
- env.safeModeReason: string (human-readable explanation)
- env.safeModeErrorCategory: string (timeout | port_conflict | config_parse | permission | process_crash | network | unknown)
- env.safeModeSentryEventId: string (if error was reported to Sentry)
```

If context is missing, ask the user what they saw before Safe Mode activated.

---

## Step 2: Run Diagnostics

Call the Safe Mode diagnostics IPC to check electron-store health:

```typescript
// In DevTools console or via IPC
const result = await window.systemHealthApi.safeModeCheckDiagnostics();
```

**Diagnostic result structure:**
```typescript
{
  status: 'healthy' | 'issues_found' | 'check_failed',
  timestamp: string,
  userDataPath: string,
  checks: {
    settingsStore: { exists, readable, validJson, sizeBytes, error? },
    sessionIndex: { exists, readable, validJson, sizeBytes, error? },
    inboxStore: { exists, readable, validJson, sizeBytes, error? },
    mcpRouterConfig: { exists, readable, validJson, sizeBytes, error? },
    logsAccessible: boolean,
  },
  issues: [{ severity, code, message, suggestedFix? }],
  suggestedActions: string[],
  recentLogErrors: string[], // Recent errors from logs (PII redacted)
}
```

---

## Step 3: Interpret Results by Category

### TIMEOUT Issues

**Symptoms**: Splash screen hung, "Startup took too long"

**Check for**:
- Large settings file (>1MB is suspicious)
- MCP config with many servers
- Recent log errors mentioning "ETIMEDOUT" or "timeout"

**Common fixes**:
1. Restart computer (clears file locks from previous crashes)
2. Reset MCP config if it has many servers
3. Check if antivirus is scanning app files

### PORT_CONFLICT Issues

**Symptoms**: "EADDRINUSE" errors in logs

**Check for**:
- `recentLogErrors` containing "EADDRINUSE"
- Other apps using ports 3131-3199

**Common fixes**:
1. Close other development tools (VS Code, other Electron apps)
2. Restart computer to release orphaned ports
3. Check for zombie Node processes: `ps aux | grep node`

### CONFIG_PARSE Issues

**Symptoms**: "Invalid JSON" errors

**Check for**:
- `checks.settingsStore.validJson === false`
- `checks.mcpRouterConfig.validJson === false`

**Common fixes**:
1. For settings: Reset via Settings > Diagnostics > Reset Settings
2. For MCP config: Reset via Settings > Connections > Reset to defaults
3. **Always get user approval before resetting anything**

### PERMISSION Issues

**Symptoms**: "EACCES" or "EPERM" errors

**Check for**:
- `checks.*.readable === false`
- `recentLogErrors` containing "EACCES" or "EPERM"

**Common fixes**:
1. Check userData folder permissions
2. On macOS: System Preferences > Security & Privacy > Files and Folders
3. On Windows: Run as administrator once to fix permissions

### NETWORK Issues

**Symptoms**: "ECONNREFUSED" errors for localhost

**Check for**:
- `recentLogErrors` containing "ECONNREFUSED"
- Firewall blocking local connections

**Common fixes**:
1. Temporarily disable firewall to test
2. Check antivirus localhost exceptions
3. Verify localhost resolves correctly: `ping localhost`

---

## Step 4: Present Findings

Format your response clearly:

```markdown
## Safe Mode Diagnostic Report

**Reason for Safe Mode**: [from env.safeModeReason]
**Error Category**: [from env.safeModeErrorCategory]

### What I Found

[Summary of diagnostic results - be specific]

### Issues Detected

1. **[Issue Name]** (severity: error/warning)
   - What: [description]
   - Suggested fix: [action]

### Recommended Actions

1. [First action - most likely to help]
2. [Second action - if first doesn't work]
3. [Fallback - export diagnostics for support]

### Need More Help?

If these steps don't resolve the issue:
1. Export a diagnostic bundle: Settings > Diagnostics > Export
2. Contact support with the bundle
```

---

## Step 5: Propose Fixes (Approval Required)

**CRITICAL**: Never execute fixes without explicit user approval.

When suggesting a fix:

1. **Explain what it does** - Be specific about what will change
2. **Explain the impact** - What data might be lost (e.g., "your MCP connections will need to be reconfigured")
3. **Ask for confirmation** - Wait for explicit "yes" or approval
4. **Provide undo instructions** - If possible, explain how to reverse

Example:
```
I recommend resetting your MCP configuration, which appears to have invalid JSON.

**What this does**: Deletes `mcp/super-mcp-router.json` and recreates it with defaults
**Impact**: You'll need to reconnect any MCP servers (Google Workspace, Slack, etc.)
**To undo**: The old config is backed up to `mcp/super-mcp-router.backup.json`

Would you like me to proceed with this reset?
```

---

## Common Error Codes

| Code | Meaning | Typical Fix |
|------|---------|-------------|
| SETTINGS_MISSING | No settings file | Will be created on restart |
| SETTINGS_PERMISSION | Can't read settings | Check file permissions |
| SETTINGS_CORRUPT | Invalid settings JSON | Reset to defaults |
| MCP_CONFIG_CORRUPT | Invalid MCP JSON | Reset MCP config |
| REPEATED_TIMEOUTS | Multiple timeouts in logs | Check network/firewall |
| PERMISSION_ERRORS_IN_LOGS | Permission issues detected | Check folder permissions |
| PORT_CONFLICT_IN_LOGS | Port already in use | Close other apps, restart |
| DIAGNOSTIC_FAILED | Diagnostics couldn't run | Export bundle for support |
| HANDLER_ERROR | IPC handler error | Restart app, export bundle |

---

## Escalation Path

If you can't resolve the issue:

1. **Export diagnostic bundle**: Settings > Diagnostics > Export Bundle
2. **Note the Sentry event ID** (if available in `env.safeModeSentryEventId`)
3. **Summarize what was tried** and what happened
4. **Recommend contacting support** with the bundle

---

## What NOT to Do

- ❌ Modify files without asking
- ❌ Delete files without explicit approval
- ❌ Suggest deleting user data (sessions, memories)
- ❌ Assume the cause without checking diagnostics
- ❌ Dismiss the issue as "just restart"
- ❌ Make changes that could cause further data loss

---

## Related

- [safe-mode.md](../../help-for-humans/safe-mode.md) - User-facing Safe Mode documentation
- [rebel-doctor](../rebel-doctor/) - General workspace health checks
