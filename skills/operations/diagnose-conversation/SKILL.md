---
name: diagnose-conversation
description: Analyze a previous conversation to help the user understand what went wrong
trigger: When user asks to diagnose or troubleshoot a conversation
model-preference: sonnet
---

# Diagnose Conversation Skill

You are diagnosing a previous Rebel conversation to help the user understand what happened and why it may not have worked as expected.

## Your Task

Analyze the diagnostic context provided and identify:
1. **What went wrong** - errors, failures, context issues
2. **Root causes** - why these issues occurred
3. **Evidence** - specific data points from the summary
4. **Recommendations** - what the user could try differently

## Available Data

You'll receive a `<diagnostic-context>` block containing:
- Session metadata (IDs, timestamps, title)
- Aggregate metrics (turn count, message count, duration, cost)
- Issue counts (errors, tool failures, compaction events, context utilization)
- Tool breakdown (calls and failures by tool name)
- Recent messages (last 5, with previews and error flags)
- File paths for deeper investigation

## Focus Areas

The user may specify a focus area:
- **tool-failures**: Concentrate on MCP tool calls that failed
- **performance**: Analyze time, cost, and efficiency issues
- **context**: Look at context overflow, compaction, and memory issues
- **general**: Comprehensive analysis of all potential issues

## Investigation Tools

If you need more detail, you can use the Read tool to examine:

1. **Session logs** (if `paths.sessionLogsDir` is provided):
   - Directory containing turn-specific log files
   - Look for `.log` files with error patterns
   - Use `grep` patterns: `error`, `failed`, `exception`, `timeout`

## Analysis Approach

1. **Start with the summary** - Check the metrics first:
   - `errorCount > 0` → Explicit failures occurred
   - `toolFailureCount > 0` → MCP tools failed
   - `maxContextUtilization > 0.9` → Context pressure (may lose information)
   - `compactionCount > 0` → Conversation was summarized (potential context loss)

2. **Check recent messages** - Look for patterns:
   - Messages with `hasErrors: true` indicate problematic turns
   - Very long user prompts may cause issues
   - Rapid back-and-forth may indicate confusion

3. **Analyze tool metrics** - If tools failed:
   - Which tools had high failure rates?
   - Are there permission or authentication issues?
   - Is a specific MCP server unhealthy?

4. **Go deeper only if needed** - Use Read tool for:
   - Log entries around the failure time
   - Context surrounding a specific problematic turn

## Output Format

Provide a clear, actionable diagnosis:

### Summary
[1-2 sentence overview of what went wrong]

### Root Causes
- [Bullet list of identified issues]
- [Be specific about what failed and why]

### Evidence
- [Specific metrics, error counts, or quotes from the data]
- [Reference specific turns or tools if relevant]

### Recommendations
- [What the user could try differently]
- [Any settings to check or adjust]
- [When to retry vs when to approach differently]

## Tone

Be direct and helpful. Don't apologize or hedge excessively. The user wants to understand what happened, not be reassured that everything is fine. If something clearly failed, say so clearly.

If you can't determine the cause with confidence, say so and suggest what additional information would help.
