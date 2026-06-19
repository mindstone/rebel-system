---
name: script-security-review
description: "Security review checklist for scripts and dependencies. This skill should be used when creating, reviewing, or packaging scripts (JavaScript/Node.js, Python, Bash) that will be distributed or executed, especially those with external dependencies."
last_updated: 2025-01-14
tools_required: []
agent_type: main_agent
---

# Script Security Review

Security review checklist for scripts and dependencies before distribution or execution.


## When to Use

- Creating scripts for skills or MCPs
- Reviewing code before packaging/distribution
- After `npm install` or `pip install` for dependency audit
- Before committing scripts to shared repositories


## Security Checklist

### 1. Credential Scan

Scan all generated code files for accidentally hardcoded secrets:

**Patterns to detect:**
- API key prefixes: `sk-*`, `ghp_*`, `xoxb-*`, `AKIA*`, `pk_live_*`, `rk_live_*`
- Private key headers: `-----BEGIN.*PRIVATE KEY-----`
- High-entropy strings in variable assignments (potential tokens/secrets)
- URLs containing credentials: `https://user:pass@`

**If matches found**: STOP and remove before proceeding.


### 2. Dependency Audit

#### Node.js (npm)
```bash
npm audit
```
- **Critical/High vulnerabilities**: Must fix before proceeding
- **Moderate**: Warn user, recommend `npm audit fix`
- **Low**: Informational only

#### Python (pip)
```bash
pip-audit
# or
safety check
```


### 3. Code Review Checklist

Launch a security review (or perform manually) checking:

- [ ] No hardcoded credentials (API keys, tokens, passwords)
- [ ] Sensitive config comes from environment variables only
- [ ] All user inputs validated before use
- [ ] No dynamic URL construction with user input (SSRF prevention)
- [ ] No shell command execution with user input (`exec`, `spawn`, `child_process`, `subprocess`)
- [ ] Timeout configured for all HTTP requests
- [ ] No logging of sensitive data (Authorization headers, credentials)
- [ ] Response/output size limits in place
- [ ] HTTPS required for external APIs (warn if HTTP used for non-localhost)
- [ ] File paths sanitized (no path traversal via `../`)


### 4. HTTPS Check

For any external API calls, verify base URL uses HTTPS:
```javascript
if (baseUrl.startsWith('http://') && !baseUrl.includes('localhost')) {
  // WARN: Using HTTP instead of HTTPS is insecure
}
```


### 5. Subagent Security Review

For complex scripts, launch a security review subagent:

```
Review the following script code for security issues.

Check against this checklist:
- [ ] No hardcoded credentials
- [ ] Environment variables for sensitive config
- [ ] Input validation present
- [ ] No SSRF vectors (dynamic URLs with user input)
- [ ] No command injection vectors
- [ ] HTTP timeouts configured
- [ ] Sanitized logging (no secrets in logs)
- [ ] HTTPS for external requests

Report any issues found.
```


## Quick Commands

```bash
# Node.js - audit and fix
npm audit
npm audit fix

# Python - audit (requires pip-audit)
pip install pip-audit
pip-audit

# Grep for common secret patterns
grep -rE "(sk-|ghp_|xoxb-|AKIA|BEGIN.*PRIVATE)" --include="*.js" --include="*.ts" --include="*.py" .
```


## See Also

- [build-custom-mcp-server](../build-custom-mcp-server/SKILL.md) - MCP server creation with security phases
- [Anthropic-skill-packager](../../Anthropic-official-skills/Anthropic-skill-packager/SKILL.md) - skill packaging guidelines
