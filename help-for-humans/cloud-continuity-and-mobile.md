---
description: "How to set up cloud continuity so Rebel works on your phone, tablet, or browser — step-by-step setup, pairing, privacy, limitations, and troubleshooting"
last_updated: "2026-06-26"
---

# Cloud Continuity: Use Rebel on Your Phone, Tablet, or Browser

Rebel is desktop-first — your conversations, files, and settings live on your computer. Cloud continuity adds a bridge so you can pick up where you left off on your phone, tablet, or any browser.

Your desktop Rebel still stays in charge. Cloud continuity simply gives you a reliable way to continue in the mobile app or a browser when you're not sitting at your computer.

> **Note:** Cloud continuity and the mobile app are currently in **beta**. They work well, but you may still hit the occasional rough edge.

## See also

- [Self-Managed Cloud Setup (BYOK)](rebel://library/rebel-system%2Fhelp-for-humans%2Fself-managed-cloud-setup.md) — Step-by-step Fly.io setup if you want the cloud instance on your own account
- [Using Rebel on Multiple Devices](library://rebel-system/help-for-humans/using-rebel-on-multiple-devices.md) — What syncs across desktops, web, and mobile
- [Settings and Configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — Full settings reference
- [Troubleshooting](library://rebel-system/help-for-humans/troubleshooting.md) — General troubleshooting guide


---

## What Cloud Continuity Does

When you enable cloud continuity, Rebel keeps a secure cloud copy of the Rebel data needed to keep your devices in sync. This means:

- **Phone and tablet**: Open the Rebel mobile app and continue working away from your desk
- **Browser**: Open your cloud address in a browser and carry on there too
- **Desktop stays in charge**: Your desktop app is still the main control point, but cloud continuity keeps a synced copy available elsewhere

Your local desktop copy stays intact. Cloud continuity adds a cloud copy so your conversations, Actions, files, and related Rebel state can continue across devices. Some credentials also sync so your cloud instance can work on your behalf. See **Privacy and Data** below for the details that matter.


---

## Before You Begin

You need:

- The **Rebel desktop app**
- An **internet connection**
- A decision between the two options shown in Cloud Sync:
  - **Desktop only**
  - **Add cloud continuity**

If you choose **Add cloud continuity**, you can then use either:

| Option shown in Settings | Choose this if... |
|------|-------------------|
| **Mindstone Cloud** | You want Rebel to handle the infrastructure — including keeping the cloud service updated — for you |
| **Use your own cloud provider** | You want the cloud instance on your own provider/account |


---

## Setting It Up

### Step 1: Choose your mode

Go to **Settings → Workspace → Cloud Sync**.

You'll see two options:

- **Desktop only** — Keep everything local on this computer
- **Add cloud continuity** — Enable the cloud bridge

Select **Add cloud continuity**.

### Step 2: Choose how you want it hosted

#### Option A: Mindstone Cloud

This is the simplest route.

1. Stay on **Add cloud continuity**
2. In the **Mindstone Cloud** section, choose a region if needed
3. Click **Enable Mindstone Cloud**
4. Wait for setup to finish
5. You should see a healthy connected status

Mindstone Cloud is the “please just sort it” button. Reasonable choice.

#### Option B: Use your own cloud provider

Choose this if you want the cloud instance on your own Fly.io account. You'll handle billing and updates; Mindstone never touches the machine.

> **Currently supported:** Fly.io. Support for additional providers may come later.

1. Stay on **Add cloud continuity**
2. Click **Use your own cloud provider instead**
3. Follow the Fly.io prompts Rebel gives you
4. Wait for the connection check to complete

For the full Fly.io walkthrough — creating an account, adding billing, generating a token, the SSO-org edge case, keeping your cloud instance up to date, and cleaning up when you're done — see [Self-Managed Cloud Setup (BYOK)](rebel://library/rebel-system%2Fhelp-for-humans%2Fself-managed-cloud-setup.md).

Rebel checks the connection as it goes and tells you what to fix if anything is off.

### Step 3: Verify the Connection

Once connected, you should see:

- A green **Connected** indicator
- The active cloud provider
- Connection details and troubleshooting info if needed


---

## Using Rebel in a Browser

Once cloud continuity is connected on desktop:

1. Go to **Settings → Workspace → Cloud Sync**
2. Scroll to **Continue on mobile**
3. Copy the **Server URL** shown below the QR code
4. Open that address in any web browser
5. If the page asks for a token, paste the same token shown on that screen

You should see your synced conversations and Actions. Full library and file management still lives on the desktop app.

If the page loads but shows nothing, refresh once and give desktop a moment to finish syncing.


---

## Getting the Mobile App

The Rebel mobile app is currently in **closed beta**. There's no public App Store or Google Play listing yet.

To get it on your phone:

1. Contact Mindstone at **hello@mindstone.com** and ask to join the mobile beta
2. You'll be invited to **TestFlight** (iPhone / iPad) or **Google Play Internal testing** (Android)
3. Follow the email invitation to install the app

Once it's installed, the in-app setup screen walks you through pairing (covered in the next section).

There's no public App Store or Google Play listing yet, so beta access currently happens by invite. This process is expected to simplify once the app exits beta.

### Platform Requirements

- **iPhone and iPad**: iOS 15 or newer (the home-screen voice widget requires iOS 17)
- **Android**: supported in the closed beta via Google Play Internal testing

---

## Set Up Your Phone or Tablet

Once cloud continuity is active on your desktop, you can pair the Rebel mobile app.

### Using the QR Code (Easiest)

1. On your desktop, go to **Settings → Workspace → Cloud Sync**
2. Scroll down to **Continue on mobile**
3. Open the **Rebel app** on your phone or tablet
4. Tap **Scan QR code** in the app's setup screen
5. Point your camera at the QR code on screen
6. Your device connects automatically

### Manual Setup

If scanning doesn't work (or you prefer typing):

1. On your desktop, go to **Settings → Workspace → Cloud Sync** → **Continue on mobile**
2. Copy the **Server URL** and **Token** shown below the QR code
3. On your phone or tablet, open the Rebel app and choose **Manual setup**
4. Paste the URL and token
5. Tap **Connect**

Tablet setup is the same process. Just with a larger screen and, one hopes, better posture.


---

## What Works on Mobile and Browser

| Feature | Mobile / Browser | Desktop |
|---------|:------:|:-------:|
| View synced conversations | Yes | Yes |
| Continue conversations | Yes | Yes |
| Start a new conversation | Yes | Yes |
| Type and send messages | Yes | Yes |
| Actions | Yes | Yes |
| Connected tools (Google, Slack, etc.) | Cloud-synced tools | Yes |
| Voice input | Yes | Yes |
| Full settings management | No | Yes |
| Library / file management | No | Yes |

**Connected tools on mobile:** Your desktop connections are synced to your cloud instance, so Rebel on mobile can use the same connected services without making you set them up again.

**iOS voice widget:** Add the Rebel widget to your iPhone home screen to start voice recordings with a single tap, without opening the app first.


---

## Which Conversations Show Up On Mobile?

Not every conversation on your desktop automatically appears on your phone — and this is intentional. Cloud continuity is a **bridge for the conversations you want on the go**, not a full mirror of every note you've ever typed.

There are two states a conversation can be in:

- **Local only** — lives on your desktop. Doesn't appear on mobile or in the browser.
- **Cloud-active** — synced to your cloud instance. Visible on mobile, tablet, and browser.

A desktop conversation becomes cloud-active when you:

- **Pin it** in the conversations list (click the pin icon), or
- **Continue it from mobile or browser** (the moment you send a message from another device, Rebel promotes the conversation so it stays available)

Cloud-active conversations that go untouched for about two weeks are automatically demoted back to local-only to keep things tidy. Pinned conversations are exempt — they stay cloud-active until you unpin them.

> **Why this matters:** If a conversation seems missing on your phone, it's almost always because it's still local-only. Open it on desktop and pin it, then pull to refresh on mobile a moment later.

### Recording Meetings From Your Phone

Basic meeting recording works on mobile — start a recording from the app, and Rebel captures the audio in chunks and uploads it for transcription. Expect a recording to produce around 250-300 MB of data per two-hour meeting, so prefer Wi-Fi when you can.

Live in-meeting features (coaching, Q&A, interactive avatar responses) are **in progress** and not yet available on mobile. For those, use the desktop notetaker.

### Voice Input On Mobile

Voice input on mobile is **buffered, not live-streamed** — the app records your clip, transcribes it, then fills in your message for review before sending. It's a couple of seconds slower than desktop voice, but it works offline: recordings are held locally and transcribed when you reconnect.

If you've downloaded the optional on-device speech model (about 430 MB, offered in-app), transcription can run locally on your phone without sending audio to the cloud.

### Mindstone plans on mobile

On a **Mindstone-managed plan**, turns you send or record from your phone — including voice messages — are served through Rebel's cloud. If something genuinely fails, Rebel says so and lets you try again. You won't sit in silence waiting for a response, and you won't see a spurious "conversation deleted" message for a turn that simply didn't complete.


---

## File Conflict Resolution

When both your desktop and cloud edit the same workspace file (for example, if you and a mobile session update the same document), Rebel detects the conflict and offers three options:

- **Ask Rebel to merge** — Rebel attempts an AI-assisted merge and lets you review the result before it's saved
- **Keep mine** — Discard the cloud changes and keep your desktop version
- **Keep cloud version** — Discard the local changes and keep the cloud version

The cloud copy is always preserved locally before any resolution, so nothing is lost. If you're unsure, the smart merge is usually a reasonable starting point — it handles most cases well, and you get to see the result before committing.


---

## Frequently Asked Questions

### Do I need to keep my desktop open for mobile and browser to work?

No. Once cloud continuity is set up, the cloud server runs independently. Your phone and browser connect to that server, not directly to your desktop. However, new pins and Actions changes only sync when your desktop is running and connected.

### Can I use the same setup on both my phone and tablet?

Yes. Pair each device separately using the QR code or manual setup. They all connect to the same cloud server.

### Why is a conversation missing on mobile or in the browser?

Cloud continuity does not behave like “mirror every desktop thing instantly forever.” If something is missing:

- Make sure cloud continuity is enabled on desktop
- Give desktop a moment to sync
- Refresh the mobile app or browser view

If it still does not appear, open that conversation on desktop first and try again.

### What do "Server URL" and "Token" actually mean?

The **Server URL** is the web address of your cloud connection — like a website address for your personal Rebel server. The **Token** is a private code that proves this connection belongs to you, like a password. Don't share it.

### Do I need to re-pair my devices after repairing or overwriting the token?

Yes. If you use **Overwrite token** in the repair flow, any previously paired devices will need to scan the new QR code or re-enter the updated token.

### Why didn't my phone buzz when Rebel needed approval?

Push notifications to your phone are intentionally skipped when another device is already connected and active — that way you don't get pinged in three places at once.

In practice: if you have your laptop open with Rebel running, or a browser tab with your cloud URL open somewhere, the phone stays quiet. Close the other device (or put your laptop to sleep) and the next approval will reach your phone.

Push notifications today cover approvals, "Ask Rebel a question" moments, and turn completion/errors — not every workspace event.

### I pinned a conversation on desktop but it's still not on my phone

Pinning triggers a sync cycle, but it can take up to a minute for the change to propagate. Pull to refresh on mobile, or give it 60 seconds and try again.

### Does the mobile app store my conversations on the phone itself?

Your ten most recent conversations are cached on the phone so you can read them offline. Everything else is fetched from the cloud when you open it. If you sign out or uninstall the app, the cache is cleared.

### Is there a passcode or Face ID lock inside the Rebel app?

Not today. The app relies on your phone's own lock screen (passcode, Face ID, fingerprint). If someone has your unlocked phone, they can open Rebel. A dedicated in-app lock is on the list of things to add.


---

## Troubleshooting

### "Connection failed" or "Server unreachable"

- **Check your internet connection** on both desktop and the device you're trying to use
- **Verify the server URL** is correct (no typos, includes `https://`)
- If you're using **your own cloud provider**, make sure that cloud instance is still running and reachable from the internet

### Public access problem (use-your-own-provider setups)

If Rebel says your cloud instance is not publicly reachable:

1. Go to **Settings → Workspace → Cloud Sync**
2. Read the warning shown there carefully
3. Follow the repair action Rebel offers
4. Wait for the status to return to healthy before trying mobile or browser again

Without public access, your phone and browser have nothing to connect to. Rude but technically consistent.

### Authentication failed

If the connection says "Authentication failed":

1. Go to **Settings → Workspace → Cloud Sync**
2. Look for the repair option in the warning banner
3. Repair the cloud token
4. If Rebel warns about replacing the existing token, continue only if you're happy to re-pair any other devices afterward

### Connection drops or reconnects frequently

This is usually temporary. Rebel automatically reconnects when the connection drops. If it keeps happening:

- Check that your internet connection is stable
- Click **Troubleshooting** in Cloud settings to see detailed connection information
- If you're using **your own cloud provider**, check that the instance has not been stopped or run out of resources

### If your company manages network access

Some organisations only allow connections from approved networks or over VPN.

If the desktop connects but your phone or browser does not:

- Connect to your company VPN if your IT team requires it
- Try again from a different network (e.g. your phone's mobile data instead of office Wi-Fi)
- Send your IT team the server URL and the exact error message you see

You should not need to set up SSH or tunnelling yourself unless your IT team has specifically asked you to.

### Mobile app won't scan the QR code

- Make sure the Rebel mobile app has camera permission
- Try increasing your screen brightness
- Use the **Manual setup** option instead (copy the URL and token from desktop)

### Everything looks connected but nothing syncs

- Give it a minute — the first sync can take a moment
- Refresh the mobile app or browser view
- Open the missing conversation on desktop and let it sync again
- Try pulling down to refresh on mobile


---

## Good To Know (Current Limitations)

A few honest caveats while cloud continuity and mobile are still in beta:

- **Not a full desktop mirror.** Only the conversations you pin (or continue from another device) show up on mobile and browser. Everything else stays local. This is deliberate — see [Which Conversations Show Up On Mobile?](#which-conversations-show-up-on-mobile) above.
- **Not live sharing.** If you're typing on desktop right now, your phone won't see the reply stream in real time. Desktop turns sync when they finish. Mobile-initiated turns run on the cloud and stream live to your phone. One device at a time is the relaxed norm.
- **Your cloud instance is a single machine.** It's not replicated across a fleet. If the underlying cloud instance is lost, the cloud copy of your synced data goes with it — but your desktop still has everything. For retention and backup specifics, contact Mindstone (`hello@mindstone.com`) for Mindstone Cloud instances, or your cloud provider for self-managed ones.
- **Sync isn't instantaneous.** Changes typically propagate in under a minute, but there's a short delay. Pull to refresh on mobile if something seems missing.
- **Mobile is thinner than desktop.** Full settings, library/file browsing, space management, memory management, plugin editing, connector setup, and the meeting notetaker's admin controls all still live on the desktop.
- **Historical conversation detail is trimmed on mobile.** For older conversations pulled from the cloud, very long tool outputs and large images may be truncated to keep mobile snappy. Currently active conversations show full fidelity.
- **No in-app lock screen.** The app relies on your phone's own unlock (passcode, Face ID, fingerprint).


---

## How It Works (The Short Version)

Your desktop Rebel is still the main local app. When cloud continuity is on, Rebel runs a small always-on service in the cloud that holds a synced copy of the data your phone, tablet, and browser need.

The connection uses a secure, encrypted channel (HTTPS and secure WebSocket). Your cloud instance can also receive the credentials it needs to run AI tasks and connected tools on your behalf.

### Cloud capacity (storage vs speed)

Rebel shows you how your cloud capacity is split between **storage** (your saved data — conversations, files, notes) and **speed** (active compute keeping things responsive). A storage meter in the Cloud Sync panel shows how much of your capacity is used by stored data versus what's running right now. This makes it easy to see at a glance whether you're approaching the limits of what your cloud instance can hold.

Desktop pushes updates to the cloud through a reliable queue — so if your internet blinks, nothing is lost, it just catches up when the connection returns. Mobile and browser talk to the same cloud service directly.

If you disconnect cloud continuity, everything on your desktop stays exactly as it was. The cloud copy is simply no longer updated.

For a deeper explainer with diagrams, ask Rebel for the "Cloud Continuity and Mobile" tutorial.


---

## Privacy and Data

When cloud continuity is active, Rebel keeps cloud copies so mobile and browser access can work reliably.

- **What moves to the cloud** — Selected Rebel data: conversations you've pinned or continued elsewhere, settings, workspace files (including memory notes), search index, Actions, automations, and the tokens your connected tools need.
- **What stays only on your desktop** — Conversations you haven't pinned or continued elsewhere, your local voice models, system-level permissions, the app's own UI.
- **Your cloud instance is single-user.** It's your own instance, not a shared pool. One tenant per cloud machine.
- **Credentials in desktop-only mode** — Connector tokens and provider keys stay on your computer.
- **Credentials in cloud mode** — The credentials your cloud instance needs are relayed to it so it can run conversations, voice, and connected tools on your behalf. They're sent over an encrypted channel and stored on the cloud instance's encrypted volume.
- **Training** — Mindstone does not use your data to train models, and Rebel's default AI providers say API data is not used for model training.
- **Push notifications** — Mobile notifications can include limited preview text such as titles or status labels, but not full conversation content. If another device is actively connected (e.g. your laptop is open), mobile notifications are suppressed to avoid duplicate pings.
- **Device permissions on mobile** — The app asks for microphone (voice), camera (for QR scanning and optional photo attachments), and photos/files (for attachments). You can revoke any of these at any time in your phone's settings.
- **On-device data** — The mobile app stores your connection credentials in the phone's secure keystore (iOS Keychain / Android Keystore), and caches your ten most recent conversations in app-private storage for offline reading.
- **If you disconnect** — Rebel returns to desktop-only local processing. Your desktop data remains untouched.
- **Retention** — The last synced cloud copy remains on your cloud instance until that instance is deleted. For Mindstone-managed instances, contact `hello@mindstone.com` for retention details. For self-managed instances, your own cloud provider's policies apply.

For full details, see the [Privacy Policy](library://rebel-system/help-for-humans/Rebel-privacy-policy.md).


---

## Offline Use

The mobile app works even when you lose your internet connection:

- **Text messages queue automatically** — type and send as normal. Messages are held locally and delivered as soon as you reconnect.
- **Voice clips queue too** — record now, transcribe and send when you're back online.
- **Your ten most recent conversations are cached** — available for offline reading, with the oldest rotating out as newer ones come in.
- **Queued messages show indicators** — you'll see a visual marker on messages that haven't been sent yet, so you always know what's pending.
- **Failed sends are surfaced clearly** — if something can't be delivered, you'll see a clear notification. Nothing gets silently lost.

Once you're back online, everything catches up automatically.

What offline mode **can't** do: start an agent turn (Rebel needs the cloud to think) or browse conversations outside your cached ten. You'll see a graceful "back online and I'll catch up" state when the connection returns.

---

## Disconnecting

If you want to turn off cloud continuity:

1. Go to **Settings → Workspace → Cloud Sync**
2. Switch back to **Desktop only**
3. Confirm the change

Your desktop data is unaffected. The cloud instance keeps the last synced copy until that instance is deleted, but it will stop receiving new updates.
