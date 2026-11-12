---
description: "How company-provided AI keys reach each person's Rebel: where admins set them in the Transformation Engine, what each key status means (Not set, Set, Claimed by the app, Waiting for them to sign in), what to do when a key looks stuck (usually: update Rebel), replacing and removing keys, Fireworks and OpenRouter keys made in bulk, Fireworks key rotation, former members, and what the Rebel backend does and doesn't keep."
last_updated: 2026-11-12
---

# Company-provided keys

If your company pays for Rebel's AI, an admin can give each person their own key, so nobody has to find or paste one. This page explains how that works for the person using Rebel and for the admin setting it up, and what to do when a key doesn't seem to arrive.

**The short version:** an admin sets a key for a person on the **Transformation Engine** (Mindstone's company admin site). The next time that person's Rebel checks in, it collects the key and saves it on their computer, and the Rebel backend deletes its own copy. If a key seems stuck, the fix is almost always: **update Rebel to the latest version, then open Settings**.

If you bring your own key, none of this applies to you; see [AI Models](rebel://library/rebel-system%2Fhelp-for-humans%2FAI-models.md) and the provider pages.

## How a key gets from the admin to your computer

Think of it like a parcel locker:

1. **The admin puts the key in the locker.** On the Transformation Engine, the admin sets a key for one person and one AI provider. Give each person their own key from the provider; the bulk tools for OpenRouter and Fireworks AI (below) make a separate one for each person.
2. **Your Rebel collects it.** Rebel checks in with the Rebel backend when you sign in or start the app, every few minutes while it's running, and when you open Settings or come back to the Rebel window. If a key is waiting, Rebel takes it.
3. **Rebel saves it on your computer**, tied to you and your organisation.
4. **The locker is emptied.** The backend deletes its copy and keeps only a note that the key was collected (the admin page calls this **Claimed by the app**). From then on, the key is kept by your Rebel: on your computer and, if you use [Cloud Continuity](rebel://library/rebel-system%2Fhelp-for-humans%2Fcloud-continuity-and-mobile.md) (Rebel's optional copy of itself in the cloud, so your work can carry on from your phone), on that cloud copy too.

For **OpenRouter** and **Fireworks AI** keys there's one more safety step, called *confirming*: Rebel tells the backend "got it" and waits for the backend to agree before it uses the key. Until then Rebel shows the connection as *checking*, and it doesn't quietly fall back to a key of your own in the meantime: company-paid work stays company-paid. Fireworks keys need version 0.4.63 of Rebel or later.

Keys for **Anthropic**, **OpenAI** and **voice** (OpenAI or ElevenLabs) count as collected as soon as Rebel receives them. Company Anthropic and ElevenLabs keys replace any key of your own for that provider. A company OpenAI key is used only if you haven't saved an OpenAI key of your own; if you have, Rebel keeps using yours, so remove yours in Settings if your company should pay instead.

## What members see

When your company provides the AI, Rebel says so instead of asking you to set things up:

- In **Settings → Agent & Voice**, company-provided models carry a **Managed** badge, with no Edit or Delete. Hovering explains: "Managed by your company. Contact your admin to change."
- The billing badge says **Organisation** ("Provided by your organisation"), and model rows may say "Paid by {your company}" or "Company access".
- Fireworks models your company set up are named like "{model} (set by {your company})".
- If your company requires a model for a kind of work, you'll see "Set by {your company} for {kind of work}", and you can't turn that model off.
- While Rebel collects a key you may see **"Checking organisation connection..."**. This normally clears within a minute or two.

## Where admins manage keys

On the Transformation Engine, open your company's **Settings**:

- The **Rebel** tab holds settings for everyone (Models, Connectors, Spaces, General) and Plans. It's shown to admins once Mindstone has set up Rebel for your company.
- Keys are per person, so they live on **Members**. Each person's row has a Rebel column; open their details from it to see **their Rebel set-up, as Rebel reports it**: their plan, their keys, their models and their Rebel app version. (The Rebel tab's "Keys and plans per person" link takes you there.)
- On Members, the **API keys** filter finds people missing a key (for example "Missing OpenRouter key" or "Missing any key").

A person's keys are listed by provider: Anthropic, OpenAI, OpenRouter, Voice (OpenAI or ElevenLabs, whichever your company uses), any custom endpoints, and Fireworks AI. Each row has **Set** (no key yet) or **Replace** (a key is there).

If the page says "To change these settings, use Rebel for now", your company hasn't moved its Rebel admin to the Transformation Engine yet; Mindstone will tell you when it has.

## What each key status means

| Status | What it means | What to do |
|---|---|---|
| **Not set** | No key is assigned for this provider. | Set one if they should have it. |
| **Set** | The key is waiting in the locker: stored, and not yet collected by their Rebel. | Usually nothing; it's collected the next time they open Rebel. If it stays **Set** while they're using Rebel, see [When a key looks stuck](#when-a-key-looks-stuck). |
| **Claimed by the app** | Their Rebel collected the key, and the stored copy was deleted. | Nothing, unless they've since moved to a new computer or reinstalled Rebel: the status records the earlier collection, so a fresh install has no key. Use **Replace** to send a new one. |
| **Waiting for them to sign in** | You added a key for someone you invited who hasn't signed in to Rebel yet. | Nothing; it's delivered the first time they sign in. Removing their invite removes the key. |

Their details also show the last **App version** their Rebel reported, and when. "Not reported" means no version is known yet; an old date means they may have updated since. The version matters, because one older version can't finish collecting a key (below).

## When a key looks stuck

A key that stays **Set** for more than about 10 minutes while the person is using Rebel, or a member who keeps seeing "Checking organisation connection...", nearly always means their Rebel is too old to finish the hand-over.

**If you're the member:**

1. **Update Rebel to the latest version.** Rebel normally updates itself; you can also download it from the Mindstone website.
2. **Open Settings**, or just switch back to the Rebel window. That makes Rebel check in straight away.
3. If Settings → Agent & Voice says "Organisation connection needs attention", sign out and back in. If that doesn't fix it, tell your admin.

**If you're the admin:**

1. Look at the person's **App version**. If it's 0.4.103, ask them to update (0.4.105 or later is best); nothing you change on your side helps until they do. Any older version is worth updating too.
2. If they're on a current version and the key is still **Set** after they've opened Rebel, use **Replace** to give them a fresh key, then ask them to open Settings. The fresh key comes from your company's account with the provider: make a new one there and paste it in (for OpenRouter and Fireworks AI you can also make it with **Bulk set API keys**, below).
3. If that doesn't clear it, contact your Mindstone contact (or **hello@mindstone.com**) with the person's name and the provider. Never send the key itself.

### Which Rebel versions handle this

- **0.4.103** had a bug: it saved OpenRouter and Fireworks keys but couldn't confirm them, so they never left **Set** and Rebel didn't use them. Update.
- **0.4.104** fixed the confirmation.
- **0.4.105** also recovers when an admin replaces a key the app was still confirming: Rebel drops the outdated copy so the new one can arrive.
- A Rebel backend fix since then stops a repeated "got it" from being mistaken for an outdated key, so 0.4.105 no longer drops a key that was fine. It needed no app update.

## Replacing and removing keys

- **Replace** puts a new key in the locker: one you made in your company's account with the provider. Their Rebel collects it at its next check-in and uses it instead of the old one.
- **Removing** a key that's still **Set** stops it being delivered: open the key from its row and choose **Delete key** (for Fireworks AI, **Remove from Rebel**). Once a key is **Claimed by the app** there's nothing here to remove; it's on their computer.

Neither one **switches the old key off at the provider**, and neither reaches into the person's computer to delete a key their Rebel already collected. When a key must stop working (someone left, or a key may have been exposed), **revoke it with the provider** too: sign in to your company's account on the provider's website (OpenRouter, Fireworks AI, Anthropic, OpenAI or ElevenLabs), find the key in its list of API keys, and delete or disable it. Whoever manages your company's account with that provider can do this. That's the step that actually cuts the key off.

## Making keys for many people at once

Select people on Members and use **Bulk set API keys**. Each provider asks for one company-level key that can make keys for others. It's different from the per-person keys it makes, and whoever manages your company's account with that provider creates it on the provider's website:

- **OpenRouter:** paste your company's OpenRouter management key. Your browser sends it straight to OpenRouter to create a key for each person; it's never sent to or stored by Mindstone, and it's cleared when the run finishes. Rebel receives only the per-person keys. People who already have an OpenRouter key are skipped unless you choose to replace them.
- **Fireworks AI:** paste your company's Fireworks Admin key. It's sent from your browser straight to Fireworks, never to Rebel, and cleared when you leave the page. Fireworks creates a separate service account and key for each person in your company's own Fireworks account. Each of these keys can view, create, change and delete things in your company's Fireworks account, including things other people made, and the page asks you to confirm you accept that.

Some of these options appear only once Mindstone has turned them on for your company; if you don't see one, ask your Mindstone contact.

### Fireworks key rotation and "Review rotation"

Rotating means swapping someone's Fireworks key for a new one, so the old one stops working. Do it when a key may have been exposed, or on whatever schedule your company uses for changing keys. Select the people and use **Rotate Fireworks keys**. Each person gets a new key. While you keep the rotation open in your browser, the page watches for each person's Rebel to collect the new key (usually within 5 minutes while their Rebel is open), then deletes their old key. If you close it before then, the old keys aren't deleted yet: come back to **Review rotation**, enter your Fireworks Admin key again and choose **Continue** to finish. A person whose rotation is in progress has **Review rotation** in their details, which shows where it's got to:

- **Waiting for their app**: the new key is ready; their Rebel hasn't collected it yet. If it stays here, they probably need to update Rebel or open it.
- **Done**: they're on the new key and the old one is gone.
- **Needs attention**, **Delivery paused** or **Waiting for Fireworks**: something needs a look; the page says what.

From there you can also delete the old key early (they lose Fireworks in Rebel until their app collects the new one) or delete both keys (they lose Fireworks in Rebel until you make a new one). A rotation that hasn't made the new key yet can be **cancelled**: nothing changes, and the old key keeps working. Finish or cancel a rotation before replacing or removing that person's Fireworks key.

## When someone leaves

When a person leaves your company, Rebel stops delivering keys to them. Keys you'd set for them appear under **Keys left by former members**, below the Members list, where you can **Remove** them. Fireworks AI keys are handled separately there: for a key the Transformation Engine made, use **Revoke upstream keys** in the Fireworks access section (or, if a rotation is in progress, **Review rotation** and delete both keys); for a Fireworks key someone pasted in, revoke it on the Fireworks website.

Except for **Revoke upstream keys**, removing a key here doesn't switch it off at the provider. **Revoke it with the provider** to be sure it stops working, because a copy may still be on their computer.

When someone switches to a different organisation in Rebel, Rebel deletes the previous organisation's OpenRouter and Fireworks keys from that computer. Signing out doesn't delete them.

## What the Rebel backend holds, and what it doesn't

The Rebel backend is the Mindstone service each person's Rebel checks in with for company settings.

**It holds:**

- A key **only until it's collected**, stored encrypted.
- After that, **a note that it was collected**: which provider, when, and who set it. Not the key.
- Your company's Rebel settings: models and allowed models, company model profiles, disabled tools, recommended connectors, voice provider and shared spaces.
- Each member's **Rebel app version**, so admins can see who needs to update.

**It doesn't hold:**

- Keys after they've been collected; those are kept by the person's Rebel (their computer, and their cloud copy of Rebel if they use Cloud Continuity).
- Your **OpenRouter management key** or **Fireworks Admin key**.
- Your conversations, through company keys. Company keys change who pays for the AI, not who can read your work. (Features you choose separately, such as shared spaces or Cloud Continuity, have their own rules; see [What data can leave Rebel](rebel://library/rebel-system%2Fhelp-for-humans%2Fwhat-data-can-leave-rebel.md).)

## Common questions

**Do I need to do anything when my company sets me up?**
No. Open Rebel and it collects your key on its own. If "Checking organisation connection..." lasts more than a few minutes, update Rebel and open Settings.

**Can my admin see my conversations?**
No. See [What data can leave Rebel](rebel://library/rebel-system%2Fhelp-for-humans%2Fwhat-data-can-leave-rebel.md).

**Why are the kinds of work named differently in different places?**
They're the same three, in the same order: the Transformation Engine's Thinking, Working and Background are Planning, Everyday work and Behind the scenes in Rebel's Settings, and Planner, Main work and Behind the Scenes in some of Rebel's messages.

**I see "Rebel couldn't verify which account owns this organization setting."**
Sign out of Rebel and back in. If it continues, tell your admin.

## Related

- [Teams and Admin Controls](rebel://library/rebel-system%2Fhelp-for-humans%2Fteams-and-admin-controls.md): everything a company can manage centrally
- [AI Models](rebel://library/rebel-system%2Fhelp-for-humans%2FAI-models.md): choosing and managing models
- [Fireworks AI](rebel://library/rebel-system%2Fhelp-for-humans%2Fproviders%2Ffireworks-ai.md) and [OpenRouter](rebel://library/rebel-system%2Fhelp-for-humans%2Fproviders%2Fopenrouter.md)
- [Troubleshooting](rebel://library/rebel-system%2Fhelp-for-humans%2Ftroubleshooting.md)
