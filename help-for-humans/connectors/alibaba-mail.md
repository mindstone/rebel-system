---
description: "Connect Alibaba Mail — business accounts and free @aliyun.com accounts — to search, read, send, and manage email"
---

# Alibaba Mail

Read, search, send, and manage your Alibaba Mail from Rebel. The servers are already filled in — you bring your email address and a password.


## What You Can Do

- **Search** emails by sender, subject, or unread status across any mailbox
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
| **Alibaba Mail (business)** | Alibaba Mail business accounts at qiye.aliyun.com, including accounts on your own company domain (e.g. name@yourcompany.com) | imap.qiye.aliyun.com, smtp.qiye.aliyun.com |
| **Alibaba Mail (personal)** | Free @aliyun.com accounts | imap.aliyun.com, smtp.aliyun.com |

If your company uses Alibaba Mail on a site outside mainland China — Hong Kong, Singapore, Germany, or the US — see [Troubleshooting](#troubleshooting) below.


## Setup

### Alibaba Mail (business)

Your administrator has to allow IMAP before this will work. If you're not the administrator, send them step 1 and skip to step 2.

1. **Administrator**: in the Alibaba Mail admin console, go to **Organization and Users → Employee Accounts → Feature Permissions** and set **IMAP Service** to **Allow**. If email apps still can't connect afterwards, check **Security Management → Account Security → Access Policies**. ([Alibaba's guide](https://help.aliyun.com/en/document_detail/447503.html))
2. Sign in to your Alibaba Mail webmail and go to **Settings → View More Settings → Account and Security → Account Security**
3. Turn on **Third-Party Client Security Password** and generate one. Copy it. ([Alibaba's guide](https://www.alibabacloud.com/help/en/alibaba-mail/latest/the-third-party-client-password))
4. In Rebel, open [Settings → Connectors](rebel://settings/tools), find **Alibaba Mail (business)**, and click **Set up with Rebel**
5. Enter your email address and paste the security password

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
| Can't connect — regional site | Hong Kong, Singapore, Germany, and US Alibaba Mail sites use different server addresses (for example `imaphk.qiye.aliyun.com` or `imap.sg.aliyun.com`), and these tiles don't have them pre-filled. Use the **Custom Email (IMAP/SMTP)** tile with your site's addresses instead — Alibaba lists them [here](https://www.alibabacloud.com/help/en/alibaba-mail/latest/alibaba-mail-imap-pop-smtp-address-and-port-information) |
| Reading works but sending fails | Sending goes out over SMTP on port 465 with SSL, which is what these tiles use. Alibaba says ports 80 and 587 are not open on its SMTP servers, so if you're on the Custom Email tile, check you've set 465 and SSL |
| Emails not appearing | Check you're looking in the right mailbox — ask Rebel about a specific folder rather than just the inbox |
| Need to change the password | Set it in [Settings → Connectors](rebel://settings/tools). If you also have a Custom Email connection, Rebel won't change either password from a conversation, to avoid updating the wrong one |

Server details come from Alibaba's own documentation: [business accounts](https://help.aliyun.com/en/document_detail/36576.html) and [free @aliyun.com accounts](https://help.aliyun.com/zh/document_detail/465307.html).


## Calendar and Contacts

Email only, for now. Alibaba Mail business accounts do offer calendar syncing, but Rebel doesn't connect to calendars that way yet. Your Alibaba calendar and contacts stay in Alibaba's own apps.


## What Rebel Can Access

- **Your existing account**: nothing new to sign up for — this is your Alibaba Mail, reached the same way your phone's email app reaches it
- **A separate password**: the third-party client security password is just for email apps, and you can regenerate or turn it off in Alibaba Mail whenever you like without touching your main password
- **Act as yourself**: emails Rebel sends come from your own address, exactly as if you'd sent them from webmail
- **Standard protocols**: IMAP for reading and SMTP for sending — the same technology your regular email app uses


## Multiple Accounts

Click **Set up with Rebel** again for each account you want to add. Each one appears as its own connection, and you can mix tiles — an Alibaba business address for work and something else for personal.


## See Also

- [Email (iCloud, Yahoo & Custom IMAP)](library://rebel-system/help-for-humans/connectors/email.md) — the same connector, for other providers
- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [settings-and-configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — managing your connections
