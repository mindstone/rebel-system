# Rebel Integration Guide

How to configure your custom MCP server in Rebel.


## Adding Your MCP to Rebel

### Method 1: Via Settings UI (Recommended)

1. **Open Rebel Settings**
   - Click the gear icon, or press `Cmd+,` (Mac) / `Ctrl+,` (Windows)

2. **Navigate to Connectors**
   - Click "Connectors" in the sidebar

3. **Add Custom MCP Server**
   - Scroll to bottom of connector list
   - Click "Add Custom MCP Server"

4. **Configure Server**
   - **Name**: Descriptive name (e.g., "Internal CRM")
   - **Command**: `node`
   - **Arguments**: Path to your built server (e.g., `/Users/you/mcp-servers/crm-mcp/dist/index.js`)
   - **Environment Variables**: Add any required env vars (API keys, etc.)

5. **Save and Restart**
   - Click "Save"
   - Rebel will restart the MCP system
   - Your tools should appear in ~30-60 seconds


### Method 2: Via MCP Config File (Advanced)

For users comfortable with JSON configuration:

1. **Locate config file**
   - Mac: `~/Library/Application Support/mindstone-rebel/mcp-config.json`
   - Windows: `%APPDATA%/mindstone-rebel/mcp-config.json`

2. **Add server entry**
   ```json
   {
     "mcpServers": {
       "your-mcp-name": {
         "command": "node",
         "args": ["/path/to/your-mcp/dist/index.js"],
         "env": {
           "API_KEY": "your-api-key-here"
         }
       }
     }
   }
   ```

3. **Restart Rebel**
   - Quit and reopen Rebel
   - Or: Help menu → Restart MCP System


## Verifying Your MCP Works

### Check Tools Are Available

1. Start a new conversation
2. Ask Rebel: "What tools do you have for [your MCP name]?"
3. Rebel should list your custom tools

### Test a Tool

1. Ask Rebel to use one of your tools
2. Example: "Search for customers named 'Smith' using the CRM"
3. Verify the response looks correct

### Check Logs if Issues

If tools don't appear or fail:

1. **Open Rebel logs**
   - Help menu → Open Logs Folder
   - Look for most recent `.log` file

2. **Search for MCP errors**
   - Look for `[MCP]` or `[Super-MCP]` log lines
   - Common errors:
     - "Failed to start server" - command/path issue
     - "Connection refused" - server crashed on startup
     - "Tool not found" - server started but tool registration failed


## Environment Variables

### Sensitive Data (API Keys)
Never hardcode credentials. Use environment variables:

**In Settings UI**:
- Add each variable in the Environment Variables section
- Stored in Rebel's secure configuration

**In config file**:
- Add to the `env` object for your server
- Note: config file is not encrypted

### Multiple Environments
If you have staging/production APIs:

```json
{
  "mcpServers": {
    "crm-staging": {
      "command": "node",
      "args": ["/path/to/crm-mcp/dist/index.js"],
      "env": {
        "API_URL": "https://staging-api.company.com",
        "API_KEY": "staging-key"
      }
    },
    "crm-production": {
      "command": "node",
      "args": ["/path/to/crm-mcp/dist/index.js"],
      "env": {
        "API_URL": "https://api.company.com",
        "API_KEY": "production-key"
      }
    }
  }
}
```


## Updating Your MCP

After making changes to your MCP code:

1. **Rebuild**
   ```bash
   cd /path/to/your-mcp
   npm run build
   ```

2. **Restart MCP in Rebel**
   - Help menu → Restart MCP System
   - Or restart Rebel completely

3. **Test changes**
   - Verify new/modified tools work as expected


## Troubleshooting

### "Server failed to start"
- Check the command path is correct
- Verify `dist/index.js` exists (run `npm run build`)
- Check Node.js is installed and accessible

### "Environment variable not set"
- Verify env vars are configured in Rebel settings
- Check spelling matches what code expects
- Try restarting Rebel after adding env vars

### "Tool execution failed"
- Check Rebel logs for error details
- Test MCP locally with Inspector first
- Verify API credentials are valid

### "Connection timeout"
- For internal APIs: Check VPN is connected
- Verify API is accessible from your machine
- Check for firewall restrictions

### Tools not appearing after restart
- Wait 30-60 seconds for MCP system to fully restart
- Check logs for startup errors
- Verify server command/args are correct


## Removing Your MCP

If you need to remove a custom MCP:

1. Go to Settings → Connectors
2. Find your custom MCP server
3. Click the remove/delete button
4. Restart Rebel

The MCP server files on your disk are not deleted - only the Rebel configuration is removed.
