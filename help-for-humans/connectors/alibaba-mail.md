---
description: "Connect Alibaba Mail — business accounts and free @aliyun.com accounts — to search, read, send, and manage email, and see your business calendar"
---

# Alibaba Mail

Read, search, send, and manage your Alibaba Mail from Rebel — and on business accounts, see your calendar too. The servers are already filled in — you bring your email address and a password.


## What You Can Do

- **Find** messages across any mailbox by sender, subject, date, or what's unread
- **See your calendar** (business accounts): what's on today, this week, or any date range, recurring meetings included. Read-only for now — Rebel can't add or change events yet
- **Read** full email content including headers, body text, and attachment info
- **Send** emails and replies as yourself, with CC and BCC support
- **Draft** emails and save them to your Drafts folder for later
- **Organize** messages by moving them between folders
- **Track** unread counts and see what needs your attention
- **Flag** or mark messages as read/unread

This is the same set of tools as Rebel's other email connections, and sending asks for your approval the same way.


## Which Tile to Pick

There are two Alibaba Mail tiles in [Settings → Connectors](rebel://settings/tools). Pick the one that matches your account:

| Tile | Use it for | Servers |
|------|-----------|---------|
| **Alibaba Mail (business)** | Alibaba Mail business accounts at qiye.aliyun.com, including accounts on your own company domain (e.g. name@yourcompany.com) | Filled in from the region you pick (imap.qiye.aliyun.com, smtp.qiye.aliyun.com for China mainland) |
| **Alibaba Mail (personal)** | Free @aliyun.com accounts | imap.aliyun.com, smtp.aliyun.com |

Alibaba Mail for business runs in several parts of the world, so the business tile asks which region your account lives in — China mainland, Singapore, Hong Kong, Germany, or the US — and fills in that region's servers for you. China mainland if you're not sure.


## Setup

### Alibaba Mail (business)

Your administrator has to allow IMAP before this will work. If you're not the administrator, send them step 1 and skip to step 2.

1. **Administrator**: in the Alibaba Mail admin console, go to **Organization and Users → Employee Accounts → Feature Permissions** and set **IMAP Service** to **Allow**. If email apps still can't connect afterwards, check **Security Management → Account Security → Access Policies**. ([Alibaba's guide](https://help.aliyun.com/en/document_detail/447503.html))
2. Sign in to your Alibaba Mail webmail and go to **Settings → View More Settings → Account and Security → Account Security**
3. Turn on **Third-Party Client Security Password** and generate one. Copy it. ([Alibaba's guide](https://www.alibabacloud.com/help/en/alibaba-mail/latest/the-third-party-client-password))
4. In Rebel, open [Settings → Connectors](rebel://settings/tools), find **Alibaba Mail (business)**, and click **Set up with Rebel**
5. Pick your region, enter your email address, and paste the security password

> **Once the security password is on, it's the only password email apps can use.** Your webmail password will stop working in Rebel and in every other email app. You can still use your webmail password to sign in to webmail itself.

### Alibaba Mail (personal)

1. Sign in to your @aliyun.com mailbox and check that IMAP/SMTP access is turned on in your mailbox settings
2. If your mailbox offers a client security password, generate one and copy it. Otherwise use your mailbox password
3. In Rebel, open [Settings → Connectors](rebel://settings/tools), find **Alibaba Mail (personal)**, and click **Set up with Rebel**
4. Enter your @aliyun.com address and the password


## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect — business account | Your administrator probably hasn't allowed IMAP yet. Ask them to check **Organization and Users → Employee Accounts → Feature Permissions → IMAP Service**, then **Security Management → Account Security → Access Policies** |
| Can't connect — "authentication failed" | If you've turned on the third-party client security password, your webmail password no longer works here. Use the generated security password instead |
| Can't connect — wrong region | Check that the region on the business tile matches where your account lives. Change it in [Settings → Connectors](rebel://settings/tools) |
| Searching by sender or subject misses older emails | Alibaba's servers can't search by sender or subject themselves, so Rebel looks through recent mail for you — the last 90 days unless you say otherwise. Ask for an earlier date ("since January") to look further back |
| Calendar says the login failed | The calendar uses the same address and password as your email. If email works but the calendar doesn't, check the region on the business tile matches where your account lives |
| Reading works but sending fails | Sending goes out over SMTP on port 465 with SSL, which is what these tiles use. Alibaba says ports 80 and 587 are not open on its SMTP servers, so if you're on the Custom Email tile, check you've set 465 and SSL |
| Emails not appearing | Check you're looking in the right mailbox — ask Rebel about a specific folder rather than just the inbox |
| Need to change the password | Set it in [Settings → Connectors](rebel://settings/tools). If you also have a Custom Email connection, Rebel won't change either password from a conversation, to avoid updating the wrong one |

Server details come from Alibaba's own documentation: [business accounts](https://help.aliyun.com/en/document_detail/36576.html), [free @aliyun.com accounts](https://help.aliyun.com/zh/document_detail/465307.html), and the [addresses and ports for every region](https://www.alibabacloud.com/help/en/alibaba-mail/latest/alibaba-mail-imap-pop-smtp-address-and-port-information).


## Calendar and Contacts

**Calendar — business accounts.** The business tile connects your Alibaba Mail calendar as well, using the same password and the region you picked. Ask things like "what's on my calendar this week?" — recurring meetings show up on every day they happen. It's read-only for now: Rebel can tell you what's on, but can't create, move, or accept events yet.

**Calendar — personal accounts.** Not available. Alibaba doesn't document calendar access for free @aliyun.com accounts, so the personal tile is email only.

**Contacts.** Not available. Alibaba Mail doesn't offer the standard way email apps read contacts (it uses its own Outlook plugin instead), so your contacts stay in Alibaba's own apps.


## What Rebel Can Access

- **Your existing account**: nothing new to sign up for — this is your Alibaba Mail, reached the same way your phone's email app reaches it
- **A separate password**: the third-party client security password is just for email apps, and you can regenerate or turn it off in Alibaba Mail whenever you like without touching your main password
- **Act as yourself**: emails Rebel sends come from your own address, exactly as if you'd sent them from webmail
- **Standard protocols**: IMAP for reading, SMTP for sending, and CalDAV for the calendar — the same technology your phone's email and calendar apps use


## Multiple Accounts

**One account per Alibaba tile.** Setting up the same tile again with a different address replaces the one already there — it doesn't add a second connection.

To connect a second Alibaba Mail address, use the **Custom Email (IMAP/SMTP)** tile and type in the servers by hand. That connection is email only — the calendar comes with the business tile. They have to match the region that address lives in — every pair below uses port 993 for IMAP and port 465 for SMTP, both with SSL.

| | IMAP | SMTP |
|---|------|------|
| **Business** — China mainland | imap.qiye.aliyun.com | smtp.qiye.aliyun.com |
| **Business** — Singapore | imap.sg.aliyun.com | smtp.sg.aliyun.com |
| **Business** — Hong Kong | imap.hk.aliyun.com | smtp.hk.aliyun.com |
| **Business** — Germany | imap.de.alibabacloud.com | smtp.de.alibabacloud.com |
| **Business** — United States | imap.us.alibabacloud.com | smtp.us.alibabacloud.com |
| **Personal** (@aliyun.com) | imap.aliyun.com | smtp.aliyun.com |

You can mix tiles freely — an Alibaba business address on its tile, your personal @aliyun.com address on the other, and a third address on Custom Email. Once you have a Custom Email connection alongside an Alibaba tile, though, password changes have to happen in [Settings → Connectors](rebel://settings/tools) rather than from a conversation, because Rebel can't tell which of them you mean.


## See Also

- [Email (iCloud, Yahoo & Custom IMAP)](library://rebel-system/help-for-humans/connectors/email.md) — the same connector, for other providers
- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [settings-and-configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — managing your connections
