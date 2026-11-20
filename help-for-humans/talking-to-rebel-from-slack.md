---
description: "How to mention Rebel in Slack threads and get useful replies without opening the app"
---

# Talking to Rebel from Slack

Mention Rebel in a Slack thread and it can reply there, using the same conversation brain you get in the app. Fewer tab switches. Civilisation advances.

## Getting started

1. Open **Settings → Workspace → Messaging**.
2. Connect Slack.
3. In Slack, mention Rebel in a thread.
4. Keep talking in that thread if you want follow-up help.

Rebel replies in the thread where you mentioned it. If your setup uses Rebel Cloud, replies are usually quick. If your desktop app is handling Slack directly, replies can take a little longer and your computer needs to be awake. Either way, Rebel stays in the thread — it remembers which conversation it's in and keeps replies in context.

## What Rebel does in your threads

When you mention Rebel, it reads the message you sent and the relevant thread context so it can answer sensibly. It may use your connected tools, if they are available, to help with the request.

Good uses:

- "Summarise the decision in this thread."
- "Draft a reply I can send to the customer."
- "Turn this into action items."
- "Check my calendar and suggest two times."

Rebel keeps the conversation tied to that Slack thread, so follow-up questions stay in context instead of becoming a small archaeological dig.

If you mention Rebel in a thread that's already been going, it pre-fetches the thread history so it can see what was said before you showed up. No need to paste context in manually.

## Ask a teammate's Rebel

Your Rebel can ask a teammate's Rebel a question in Slack, and bring the answer back to you. This works from Rebel on desktop, web or phone. In chat, try: “Ask Alice's Rebel in Slack what her biggest launch risk is.” Name her Rebel by its Slack app name, as it appears in Slack; ask her if you're not sure. You don't need your own app's name.

Both of you need Slack connected with your own Rebel's Slack app (the one each of you connects under [Getting started](#getting-started), not one shared with someone else), in the same Slack workspace. If your connection can't receive replies from other Rebels, Rebel says so and points you to Slack setup. The question goes to a private Slack conversation between the two apps; no people are in it.

- **Asking:** the question goes out as a message to another person, so it follows your permissions and [Safety Rules](rebel://settings/safety#safetyRules) (the instructions you write in Settings → Privacy & Safety; if you haven't written any, the default rules apply). Once Rebel tells you the question was sent, the answer appears in the conversation where you asked, whenever it arrives. That can take a while, for example if your teammate has to approve it first, and no answer may mean they chose not to send one. It doesn't start more work by itself: ask Rebel to carry on when it's there.
- **Answering:** your teammate's question opens as a conversation in your Rebel, labelled with who asked. Rebel treats it one step more cautiously than a request of your own, so something that would run without asking for you may ask you first, saying who it's for. Anything you've chosen to block stays blocked, but anything you've chosen to "Always allow" for yourself still asks. Before the answer goes back, Rebel shows it to you, with two choices. **Allow once** sends this answer, and Rebel asks again next time. Letting that Rebel's requests in this conversation follow your usual [permissions](security-and-tool-safety.md) means that, in this conversation only, it can have Rebel do whatever Rebel already does for you without asking, and send the answer back, with no more questions. A sent answer can't be taken back, and if you don't allow it, the asker gets no answer.

If Rebel couldn't confirm that a question was sent, it says so rather than guessing. An answer to that question can't come back to the conversation, so ask again if you still need one.

## When you want it to stop

If you do not want Rebel in a thread anymore, stop mentioning it there. Rebel does not need a formal goodbye ceremony.

To disconnect Slack entirely:

1. Open [Settings → Connectors](rebel://settings/tools).
2. Find Slack.
3. Choose **Disconnect**.

After disconnecting, Rebel will stop replying from Slack until you connect it again.

## When something goes wrong

Try these, in order:

- **No reply yet:** wait a minute, especially if your desktop app is handling Slack.
- **Still nothing:** make sure Slack is connected in [Settings → Connectors](rebel://settings/tools).
- **Wrong workspace:** the Slack card in Settings now shows which workspace you actually signed into, so check there first. If it is the wrong one, disconnect Slack, then connect the workspace you meant. Happens to the best of us. Slack workspaces multiply quietly.
- **Channel reply failed:** make sure Rebel is allowed in the channel and has permission to post there.
- **It says Slack needs reconnecting:** reconnect Slack from Settings. This usually means Slack permissions changed or the connection expired.

If Slack still refuses to cooperate, use [Report a Bug](rebel://feedback/bug?description=Slack%20thread%20reply%20did%20not%20work&stepsToReproduce=1.%20Connect%20Slack%0A2.%20Mention%20Rebel%20in%20a%20Slack%20thread%0A3.%20Wait%20for%20a%20reply&expectedBehavior=Rebel%20should%20reply%20in%20the%20Slack%20thread). Include the workspace name, channel, and roughly when you mentioned Rebel. No need to paste private thread contents unless you want to.
