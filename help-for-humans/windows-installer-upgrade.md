---
description: "Why we upgraded Rebel's Windows installer and what it means for you"
---

# Windows Installer Upgrade

We've upgraded Rebel's Windows installer to make updates faster and more reliable. This is a one-time upgrade that requires you to download the new version manually.


## See also

- [troubleshooting.md](library://rebel-system/help-for-humans/troubleshooting.md) — General troubleshooting guide
- [windows-security-and-antivirus.md](library://rebel-system/help-for-humans/windows-security-and-antivirus.md) — Antivirus and security guidance


---

## Why We Made This Change

Our previous installer technology had several issues that caused problems for users:

| Issue | What you experienced |
|-------|---------------------|
| **Slow updates** | Each update downloaded the entire app (~150MB) instead of just what changed |
| **Update failures** | Updates would sometimes fail silently, leaving you on an old version |
| **"Update in progress" errors** | Multiple apps using the same installer technology could conflict |
| **Unreliable installs** | Some users reported broken shortcuts or failed installations |

The new installer technology fixes all of these issues and gives us better tools to diagnose problems when they occur.


---

## What's Different

**For you:**
- Updates download and install faster
- Fewer update failures
- Better error messages if something goes wrong
- No admin rights required (installs in your user folder)

**Behind the scenes:**
- Modern installer format trusted by Windows
- Better compatibility with antivirus software
- Improved support for enterprise environments


---

## How to Upgrade

1. **Download the new installer** from [rebel.mindstone.com](https://rebel.mindstone.com/download)
2. **Run the installer** — it installs alongside your current version
3. **Launch Rebel** — the new version will automatically clean up the old installation

**Your data is safe.** Conversations, settings, memory, and all your work are stored separately and won't be affected.


---

## What Happens to the Old Version?

When you first launch the new version, it automatically removes the old installation in the background. This:

- Frees up about 1GB of disk space
- Removes the duplicate entry from "Apps & Features"

You don't need to manually uninstall the old version.


---

## Antivirus Exclusions

If you previously added antivirus exclusions for Rebel, you'll need to update them. The new installer uses a different installation path:

- **Old path:** your previous Rebel installer folder under `%LOCALAPPDATA%`
- **New path:** `%LOCALAPPDATA%\Programs\mindstone-rebel`

Update your antivirus exclusions to use the new path. See [windows-security-and-antivirus.md](library://rebel-system/help-for-humans/windows-security-and-antivirus.md) for detailed instructions for your antivirus software.


---

## Frequently Asked Questions

### Will I lose my conversations or settings?

No. Your data is stored in a separate location and is not affected by the installer upgrade.

### Do I need to do anything special?

Just download and run the new installer. Everything else happens automatically.

### What if I'm in the middle of important work?

You can continue using your current version as long as you like. The upgrade banner will remind you, but there's no deadline.

### I'm in an enterprise environment — do I need IT approval?

The new installer uses the same code signing certificate (Mindstone Learning Limited) and installs to your user folder, so existing security policies should continue to work. If your IT team has questions, they can contact us at support@mindstone.com.


---

## Still Have Questions?

If you run into any issues during the upgrade:

1. Check [troubleshooting.md](library://rebel-system/help-for-humans/troubleshooting.md) for common solutions
2. Use **Settings → Advanced → Run System Check** to identify problems
3. Contact us at support@mindstone.com with your diagnostic export
