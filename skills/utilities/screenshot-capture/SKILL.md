---
name: screenshot-capture
description: "Capture the requested app or desktop surface using available Rebel, Electron, or operating-system tools."
---

# Screenshot Capture

Choose a capture route that shows the requested surface, and inspect the returned image before using it as visual evidence.

- Inside Rebel, `rebel_get_app_screenshot` returns saved paths and image content. Use `rebel_navigate_app` if another built-in surface is requested. Named settings pages use `destination: "settings"` and `settings_tab`; long surfaces can use `capture_mode: "scroll"`.
- For an Electron dev app, connect available Electron tools to the appropriate CDP target and use their screenshot tool. In the Rebel development repository, `scripts/capture-rebel-dev-screenshot.ts --help` documents the command-based route.
- For a generic desktop capture, use the available operating-system capture tool. Check that the captured window or region is the one requested.

A screenshot proves only what its actual surface, version, and state show. An isolated test app or Storybook story can verify that instance; it cannot establish what the user's currently running app displays. Preserve navigation/theme state changed for capture where practical.

Keep returned image content available to the model: Rebel's text-only Read tool cannot inspect a PNG by reading its path. Use unique output names and report saved paths and material limitations. If capture is unavailable, report the tool error without pretending that visual inspection occurred.
