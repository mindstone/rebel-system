---
description: "Set up cloud continuity on your own cloud account (BYOK) with Fly.io — billing, token, regions, provisioning, token rotation, troubleshooting, self-healing, and the honest tradeoffs against Mindstone Cloud."
last_updated: "2026-05-11"
---

# Self-Managed Cloud Setup (BYOK): Fly.io

This guide walks you through setting up Rebel's cloud continuity on **your own cloud account** instead of Mindstone's managed one. Rebel calls this "self-managed" or **BYOK** (bring your own cloud).

This article focuses on **Fly.io**, which is the simplest of the three providers Rebel supports.

> **Heads up:** Cloud continuity and the mobile app are currently in **beta**. Self-managed cloud works, but there are a couple of tradeoffs worth reading before you commit (see [Should You Choose This?](#should-you-choose-this) below).
>
> **DigitalOcean and Hetzner are temporarily hidden** from the in-app provider picker while we investigate setup issues that some users reported. Existing DigitalOcean and Hetzner instances keep working as normal — only the option to set up *new* ones is paused. Fly.io is unaffected and remains the recommended BYOK route for now.

## See also

- [Cloud Continuity and Mobile](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md) — the main cloud continuity guide (what it does, how to pair phones, privacy, troubleshooting)
- [Using Rebel on Multiple Devices](rebel://library/rebel-system%2Fhelp-for-humans%2Fusing-rebel-on-multiple-devices.md) — what syncs across desktops, web, and mobile
- [Settings and Configuration](rebel://library/rebel-system%2Fhelp-for-humans%2Fsettings-and-configuration.md) — full settings reference
- [The Open-Source Build](rebel://library/rebel-system%2Fhelp-for-humans%2Fopen-source-build.md) — the open build runs cloud continuity on your own cloud only (this BYOK route)


---

## Should You Choose This?

There are two reasonable paths for cloud continuity. Neither is wrong — they suit different people.

| | **Mindstone Cloud** (managed) | **Self-managed (Fly.io / DigitalOcean / Hetzner)** |
|---|---|---|
| Who handles the infrastructure | Mindstone | You (via your provider) |
| Who gets billed | Mindstone, included in your plan | You, directly by the provider |
| Auto-updates to the cloud software | Handled quietly in the background | **Manual** — run `flyctl deploy` or switch modes; see below |
| Setup time | Under a minute | About 5 minutes |
| Best if... | You want Rebel to just sort it | You want the cloud instance in your own account, or your organisation requires it |

**Pick Mindstone Cloud** if you want the less character-building option. **Pick BYOK Fly.io** if you want your cloud instance running inside your own provider account, with billing and control staying with you.

### Good to Know Before You Choose BYOK

One mildly unglamorous detail: BYOK instances **do not receive the managed auto-update stream** that Mindstone Cloud instances now get. You decide when your machine updates — which is either a feature (stability, control) or a chore (occasional `flyctl deploy`), depending on how you look at it.

If you want cloud updates handled quietly in the background, Mindstone Cloud is the less fiddly option. If you're comfortable running `flyctl deploy` occasionally — or just don't care about being on the latest build every week — BYOK Fly.io is a fine choice.


---

## Before You Start

You'll need:

- **The Rebel desktop app**, connected to the internet.
- **A Fly.io account.** Free to sign up. We'll walk you through this.
- **A payment method on your Fly account.** Fly requires a card on file before it will create storage volumes above ~20 GB. Rebel's default volume is larger than that, so you'll need to add billing before provisioning finishes.
- **About 5 minutes.**

### What It Costs (Roughly)

Fly bills you directly. As of April 2026, typical costs are:

- **Storage:** about **$0.15/GB/month**. A default Rebel instance uses ~15 GB of storage, so roughly **$2-3/month** in storage.
- **Server:** from about **$1.94/month** for the smallest shared-CPU machine. Rebel sizes the machine adaptively based on your workspace.
- **Total:** expect around **$4-8/month** for typical use.

> Prices can drift. The Cloud Sync panel in Rebel shows you an up-to-date estimate for your chosen volume size before it provisions anything.

### What Rebel Creates on Your Fly Account

So you're not wondering what's happening under the hood, here's what Rebel sets up on your behalf:

- **One Fly app** named `rebel-cloud-<something>` in your Fly organisation.
- **One encrypted storage volume** to hold your cloud-side Rebel data.
- **One cloud machine** (single-tenant — just yours, never shared) that runs the Rebel cloud service.
- **A public HTTPS URL** so your phone, tablet, and browser can connect securely.

Rebel does not touch anything else in your Fly account. If you stop using BYOK, you delete the Fly app and everything above disappears with it (see [Stopping and Cleaning Up](#stopping-and-cleaning-up) below).


---

## Step 1: Choose Cloud Sync Mode

In Rebel:

1. Open **Settings → Workspace → Cloud Sync**
2. Choose **Add cloud continuity**
3. Click **Use your own cloud provider instead**
4. Select **Fly.io**
5. Pick a **region** if prompted — pick the Fly region physically closest to you for the lowest latency. If you don't know which to pick, the default is fine and you can rebuild later.

Rebel will now ask you for a Fly.io access token. Leave this tab open — we're about to generate one.


---

## Step 2: Create a Fly.io Account (If You Don't Have One)

1. Go to [fly.io](https://fly.io) and sign up. Use the email you actually check.
2. Confirm your email.
3. On the Fly dashboard, go to **Billing** and add a payment method. You won't be charged yet — this just unlocks volume creation so Rebel's provisioning can succeed.

> **Why billing first?** Fly blocks storage volumes above 20 GB until a card is on file. Rebel's default volume is larger than that, so skipping this step will make provisioning fail partway through. Easier to sort now.


---

## Step 3: Generate a Personal Access Token

1. Go to [fly.io/user/personal_access_tokens](https://fly.io/user/personal_access_tokens)
2. Click **Create access token**
3. Give it a name — `Rebel` is fine
4. Copy the token that appears

**Treat this token like a password.** Anyone with it can create, change, and delete resources on your Fly account. Don't paste it into chat, email, or a public document.

### Special Case: Fly Organisations Using SSO

If your Fly organisation requires single sign-on (SSO), personal access tokens **won't work** — Fly blocks them for SSO orgs on purpose. Instead, open a terminal and run:

```bash
fly tokens create org --org <your-org-slug>
```

Replace `<your-org-slug>` with your organisation's Fly slug (it's in your Fly dashboard URL). Copy the output — it's a long string starting with `FlyV1` — and use that as your token. You can install `flyctl` from [fly.io/docs/flyctl/install](https://fly.io/docs/flyctl/install) if you don't have it.

If you're in multiple Fly organisations, create the token from the org you want **billed**. Rebel will use the same org for provisioning.


---

## Step 4: Paste the Token into Rebel

1. Back in **Settings → Workspace → Cloud Sync**, paste your token into the **Fly.io access token** field
2. Click **Connect** (or the equivalent button Rebel shows you)

Rebel now:

- Verifies your token
- Finds (or asks about) the organisation to use
- Creates the app, volume, and machine
- Waits for the machine to come up
- Runs a public-access check

This typically takes **2-4 minutes**. The panel shows honest progress — it won't pretend things are done when they aren't.

### Cloud update progress

When you update your self-managed cloud, Rebel now shows you clearly-labelled progress phases instead of a single indeterminate spinner. You'll see the update walk through **Deploying new version → Restarting → Starting up → Almost there (health checks) → Verifying**, so you always know where it's up to and whether it's making progress. This replaces the older hard timeout behaviour that could leave you wondering whether the update had got stuck.


---

## Step 5: Wait for the Green Connected Status

When provisioning finishes, you should see:

- A green **Connected** indicator
- Your Fly app name and region
- A Server URL you can use to pair mobile, tablet, or browser

From here, pairing your phone and browser works exactly the same as with Mindstone Cloud — see [Set Up Your Phone or Tablet](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md#set-up-your-phone-or-tablet) in the main cloud continuity guide.


---

## Troubleshooting

### "Authentication failed" or "Invalid token"

Your token may be wrong, expired, or revoked. Re-generate it at [fly.io/user/personal_access_tokens](https://fly.io/user/personal_access_tokens) and paste the new value. If your org requires SSO, personal access tokens will fail here — use `fly tokens create org` instead (see [Special Case: SSO](#special-case-fly-organisations-using-sso)).

### "Billing required" or volume creation fails

Fly needs a payment method on file before it will provision a machine with a sizeable volume. Open [fly.io/dashboard/personal/billing](https://fly.io/dashboard/personal/billing) (or your org's billing page), add a card, then click **Retry** in Rebel.

### Provisioning finishes but the connection check stays red

Sometimes the Fly machine starts but public networking takes a minute longer. Wait 60-90 seconds and click **Retry check**. If it's still red:

- Confirm the machine is **Started** in your [Fly dashboard](https://fly.io/dashboard)
- Look for warnings in the Cloud Sync panel — Rebel surfaces specific fix actions when it can
- If problems persist, Rebel can ask Fly to **repair the machine automatically** — look for the repair action in the Cloud Sync warning banner before doing anything manually

### Setup failed halfway through

Rebel tries to roll back partial resources automatically, but if it couldn't, check your [Fly dashboard](https://fly.io/dashboard) for a leftover app called `rebel-cloud-<something>` and delete it from there. Then retry setup in Rebel.

### Rebel says my organisation isn't right

If you're in multiple Fly organisations, Rebel picks a non-personal one by default. If it picks the wrong one, you may need to create the token specifically for the correct org (see the `fly tokens create org` command above).

### Connection drops and reconnects repeatedly

Rebel auto-reconnects after drops, and backs off in escalating windows (roughly 30 seconds → 2 minutes → 5 → 15) when the cloud is struggling rather than hammering it. If it keeps happening, check:

- Your local internet is stable
- The Fly machine hasn't run out of disk or memory (visible in the Fly dashboard)
- **Settings → Cloud Sync → Troubleshooting** for detailed connection info

For other connection issues — company VPN, network policies, QR-code problems — see the [general troubleshooting section](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md#troubleshooting) in the main cloud continuity guide.

### My pairing token may be compromised — how do I invalidate all devices?

Use **Overwrite token** in the Cloud Sync repair actions. This generates a new pairing token, and every previously-paired phone, tablet, or browser will need to re-scan the QR code with the new one. Use this if you suspect someone else has your token, or if you just want a clean slate. (Pairing tokens don't currently auto-rotate — automatic rotation is on the improvement list.)


---

## Keeping Your Cloud Instance Up to Date

This is the BYOK tradeoff worth repeating clearly.

BYOK instances **do not automatically pull new cloud builds** the way Mindstone Cloud instances do. Over time, your cloud machine may fall behind what the desktop app expects. Most of the time this is fine — the cloud service is backwards-compatible — but occasionally a new feature will need a newer cloud build.

### Option 1: Manually redeploy via `flyctl`

Install `flyctl` ([fly.io/docs/flyctl/install](https://fly.io/docs/flyctl/install)) and run:

```bash
flyctl deploy --app <your-rebel-cloud-app-name>
```

This pulls the latest published cloud build and redeploys it.

### Option 2: Switch to Managed temporarily

Disconnect BYOK in **Settings → Workspace → Cloud Sync**, enable **Mindstone Cloud**, let it settle, then switch back. (Your desktop data is unaffected either way.)

### Option 3: Just leave it

The cloud service is designed to degrade gracefully. If you're happy with the features you have today and don't need the latest beta bits, leaving your BYOK instance on its current build is fine.


---

## Stopping and Cleaning Up

**Important:** Turning off cloud continuity in Rebel stops syncing, but **does not delete your Fly resources**. Fly will keep billing you for the machine and volume until you delete them.

To fully stop using BYOK:

1. In Rebel: **Settings → Workspace → Cloud Sync → Desktop only**. This stops syncing.
2. In the [Fly dashboard](https://fly.io/dashboard): find the `rebel-cloud-<something>` app and **Destroy** it. This removes the machine, the volume, and all associated resources.
3. Double-check the **Volumes** section of your Fly dashboard is empty — Fly charges for volumes as long as they exist, even if the machine is stopped.

Your desktop Rebel is untouched. All local conversations, spaces, and settings stay on your computer as before.

> **Retention note:** On BYOK, the cloud copy of your synced data sits on your Fly volume until *you* delete it. Mindstone has no retention policy over it — that's between you and your provider. Your desktop keeps its local copy regardless.


---

## If Your Cloud Machine Breaks

If your Fly machine dies, is deleted, or can't be reached, the impact depends on what was in flight:

- **Conversations on your desktop are safe.** The desktop is still the source of truth for everything that was synced to or from it.
- **Anything that only happened in the cloud since the last desktop sync** — a conversation started from mobile, a turn in progress — may need to be recovered or redone.
- You can re-provision from scratch using the same Fly token; Rebel will create a fresh app and volume.

If your desktop has been offline for a long time while mobile was in heavy use, let the desktop finish syncing before deleting anything on the Fly side.


---

## Other Providers: DigitalOcean and Hetzner

Rebel also supports DigitalOcean and Hetzner on the same BYOK route, but **both are temporarily hidden from the in-app picker** while we investigate setup issues some users ran into. Existing DO and Hetzner instances keep syncing as normal — only the option to set up *new* ones is paused. We'll re-enable them once the underlying issues are fixed.

For reference, when they're back:

- **DigitalOcean** — token page: [cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens). Predictable monthly billing; droplets from ~$6/mo.
- **Hetzner Cloud** — token page: [console.hetzner.cloud](https://console.hetzner.cloud) → your project → Security → API Tokens. EU-based, billed in euros; servers from ~€4.51/mo.

All the Fly-specific advice above (auto-update caveat, cleanup, recovery) applies equally to the other two.


---

## Frequently Asked Questions

### Can I use a Fly machine I already set up?

Not today. Rebel always provisions a fresh app and volume so it knows exactly what's there. Adopting an existing machine is on the backlog.

### Is my data encrypted?

Yes. The storage volume Rebel creates on Fly is encrypted at rest, and all traffic between your desktop/phone/browser and the cloud instance is over HTTPS and secure WebSockets.

### Does Mindstone see my data if I'm on BYOK?

No. Your cloud instance lives in your Fly account, under your billing, on your volume. Mindstone has no access to the machine or the data on it. This is the main reason some people pick BYOK.

### Can I move from BYOK to Mindstone Cloud later (or vice versa)?

Yes. You can switch modes from **Settings → Workspace → Cloud Sync**. Conversations and most workspace files transfer, though individual files above **~7 MB** (and anything excluded by workspace-size limits — roughly **~50 MB** per file) may need to re-sync from your desktop after the switch rather than travelling via the cloud. Give your desktop a minute to finish the resync once the new mode is healthy.

### What happens to paired mobile devices if I rebuild my cloud?

They'll need to be re-paired — the server URL and token change. Scan the new QR code from **Cloud Sync → Continue on mobile** on each device. The same is true if you use **Overwrite token** to rotate the pairing token for any reason.

### Where can I see what Rebel is doing on my Fly account?

In your [Fly dashboard](https://fly.io/dashboard). You'll see one app named `rebel-cloud-<something>` with one machine and one volume. That's the complete footprint.


---

## Quick Reference

- **In-app path:** Settings → Workspace → Cloud Sync → Add cloud continuity → Use your own cloud provider → Fly.io
- **Token page:** [fly.io/user/personal_access_tokens](https://fly.io/user/personal_access_tokens)
- **SSO command:** `fly tokens create org --org <your-org-slug>`
- **Fly dashboard:** [fly.io/dashboard](https://fly.io/dashboard)
- **Billing page:** [fly.io/dashboard/personal/billing](https://fly.io/dashboard/personal/billing)
- **Typical cost:** $4-8/month for normal use
- **Updating the cloud build:** `flyctl deploy --app <your-app>` (or switch to Managed and back)
