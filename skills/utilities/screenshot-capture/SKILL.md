---
name: screenshot-capture
description: "Captures screenshots using the right available route: Rebel app capture, Electron MCP, or OS fallback for generic desktop screenshots."
last_updated: 2026-04-30
tools_required:
  - rebel_navigate_app
  - rebel_get_app_screenshot
  - electron_list_apps
  - electron_list_targets
  - take_screenshot
  - run_terminal_cmd
agent_type: main_agent
---

# Screenshot Capture

Capture visual evidence without inventing a new screenshot path.


## [CONTEXT]

Rebel has multiple screenshot routes. Pick the route that matches the user's goal:

- **Rebel UI design review inside the app:** use `rebel_navigate_app` when the user names a built-in surface, then `rebel_get_app_screenshot`. For long or visibly scrollable Rebel surfaces, pass `{ "capture_mode": "scroll" }` so the tool returns a set of viewport screenshots.
- **Coding-context Electron app review:** use the `rebel-electron` MCP path. Find the real CDP-enabled dev app with `electron_list_apps` / `electron_list_targets`, then use `take_screenshot`.
- **Generic desktop reference outside Rebel UI judgment:** use the OS fallback commands below.

Do not use OS desktop, region, or full-screen screenshots as substitute evidence for Rebel UI design review. They can save a valid PNG of the wrong surface. If the correct Rebel app capture tool is unavailable, say visual capture is blocked rather than pretending the fallback is equivalent.


## [GOAL]

Save a timestamped screenshot through the most specific available capture path, and report the saved path and any limitations honestly.


## [PROCESS]

1. Classify the capture context:
   - Rebel's own UI / Chief Designer / visual verification -> app capture.
   - Electron dev app in a coding tool -> MCP capture.
   - Other desktop reference -> OS fallback.
2. Use the best available route:
   - In-app Rebel: call `rebel_navigate_app` first if needed, then `rebel_get_app_screenshot`. Use `{ "capture_mode": "scroll" }` for long or visibly scrollable surfaces. Prefer light and dark captures when theme cycling is available.
   - Coding MCP: if reviewing the user's current dev app, require a real CDP-enabled app (`REMOTE_DEBUGGING_PORT=9222 npm run dev` or equivalent), find it with `electron_list_apps` / `electron_list_targets`, then `take_screenshot`. Do not use `spawn_dev_server` as evidence for the user's live changes unless they asked for generic smoke testing.
   - Generic desktop fallback: use the OS command below.
3. Confirm the file path and whether the image was direct visual evidence or a generic desktop fallback.


## [IMPORTANT]

- For Rebel UI visual judgment, follow `rebel-system/skills/ux/_shared/visual-verification-loop.md`.
- `rebel_get_app_screenshot` returns both saved paths and image content for in-app model reasoning. In scroll mode it may return multiple captures. Do not replace it with shell capture.
- `take_screenshot` is the MCP/CDP route for Electron coding contexts and saves under `docs/project/ux_testing/reports/screenshots/`.
- The OS fallback is only for generic "capture my screen" requests, not as proof of the current Rebel UI state.
- Always use timestamps or tool-generated unique names to avoid overwriting existing screenshots.
- Confirm the file was created or report the typed tool error / capture blocker.


## [OS FALLBACK EXAMPLES]

Use these only for generic desktop screenshots when app/MCP capture is not the right route.

### macOS Command

```bash
cd /path/to/workspace && screencapture -x screenshot_$(date +%y%m%d_%H%M%S).png && ls -lh screenshot_*.png | tail -1
```

### Windows Command (PowerShell)

```powershell
cd C:\path\to\workspace; Add-Type -AssemblyName System.Windows.Forms; $timestamp = Get-Date -Format "yyMMdd_HHmmss"; $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds; $bitmap = New-Object System.Drawing.Bitmap $screen.Width, $screen.Height; $graphics = [System.Drawing.Graphics]::FromImage($bitmap); $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size); $filename = "screenshot_$timestamp.png"; $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png); $graphics.Dispose(); $bitmap.Dispose(); Get-Item $filename | Select-Object Name, Length
```

**Note**: The Windows command is long but atomic - it captures the screen and saves in one execution.


## [OUTPUT]

Confirm to the user:
- The filename of the screenshot (with timestamp)
- The file size
- The full path where it was saved
- The capture route used: `rebel_get_app_screenshot`, `take_screenshot`, or OS fallback

