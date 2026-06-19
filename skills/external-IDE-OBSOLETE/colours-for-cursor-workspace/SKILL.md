---
name: colours-for-cursor-workspace
description: "Customize Cursor/VSCode workspace background colors to visually distinguish different projects using workbench.colorCustomizations settings."
---

# Cursor/VSCode Workspace Background Colours

Customize the background colour of a VSCode/Cursor workspace to visually distinguish different projects.

## See also

- [VSCode Colour Theme documentation](https://code.visualstudio.com/api/references/theme-color)

## How to customize


- **Start from the template**: Copy `system/templates/vscode-settings-template.json` to `.vscode/settings.json` at the root of your Rebel workspace (or merge its contents into an existing `settings.json`).
- **Add colour customizations**: Add a `workbench.colorCustomizations` block to that `settings.json`, for example:

```json
{
  // ... other settings from the template ...
  "workbench.colorCustomizations": {
    "editor.background": "#0a1228",
    "sideBar.background": "#0b1530",
    "activityBar.background": "#090f20",
    "editorGroupHeader.tabsBackground": "#0a1329",
    "panel.background": "#0a1228",
    "terminal.background": "#0a1228",
    "titleBar.activeBackground": "#0a1228",
    "titleBar.activeForeground": "#cccccc",
    "statusBar.background": "#0a1329",
    "input.background": "#0b1530",
    "dropdown.background": "#0b1530",
    "tab.inactiveBackground": "#09101f"
  }
}
```

## Finding brand colors

If the user mentions a company or organization name but doesn't provide brand guidelines or specific colors, try searching relevant folders/MCPs for design/branding guidelines, and then the web.

If in doubt, ASK THE USER (e.g. for brand guidelines, or a logo image that you can try and extract the colours from, etc).


## Common colour areas

**Essential**:
- `editor.background` - Main editor background
- `sideBar.background` - File explorer sidebar
- `activityBar.background` - Left-most activity bar (icons)
- `titleBar.activeBackground` - Top title bar
- `statusBar.background` - Bottom status bar

**Nice to have**:
- `editorGroupHeader.tabsBackground` - Tab bar background
- `panel.background` - Bottom panel (terminal, output, etc.)
- `terminal.background` - Terminal background specifically
- `input.background` - Input fields and search boxes
- `dropdown.background` - Dropdown menus
- `tab.inactiveBackground` - Inactive tabs
- `breadcrumb.background` - File path breadcrumb
- `notifications.background` - Notification popups
- `editorWidget.background` - Find/replace widgets

## Tips

- Use subtle colour variations (10-20% difference) to distinguish workspaces
- Test colours in both light and dark themes if you switch
- Hex colors starting with `#00` through `#20` work well for dark mode subtle tints


## Example colour schemes

**Subtle navy tinge**:
- Editor: `#0a1228`
- Sidebar: `#0b1530`
- Activity bar: `#090f20`

**Very obvious navy**:
- Editor: `#001a4d`
- Sidebar: `#00164a`


