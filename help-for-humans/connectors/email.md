---
description: "Connect iCloud Mail, Yahoo Mail, or any IMAP/SMTP email account to search, read, send, and manage emails"
---

# Email (iCloud, Yahoo & Custom IMAP)

Read, search, send, and manage emails from your iCloud, Yahoo, or any IMAP/SMTP email account — all from Rebel.


## What You Can Do

- **Search** emails by sender, subject, or unread status across any mailbox
- **Read** full email content including headers, body text, and attachment info
- **Send** emails and replies as yourself, with CC and BCC support
- **Draft** emails and save them to your Drafts folder for later
- **Organize** messages by moving them between folders
- **Track** unread counts and see what needs your attention
- **Flag** or mark messages as read/unread


## What Makes This Different

- **Works with your existing account**: Uses your iCloud, Yahoo, or custom email — no new accounts or services needed
- **Act as yourself**: Emails you send come from your actual email address, just as if you sent them from your regular email app
- **Standard protocols**: Uses IMAP for reading and SMTP for sending — the same technology your regular email app uses
- **Dedicated passwords**: For iCloud and Yahoo, you create an app-specific password just for Rebel, which you can revoke at any time. Your main account password is never used


## Supported Providers

| Provider | Email Domains | Setup Link |
|----------|---------------|------------|
| **iCloud Mail** | @icloud.com, @me.com, @mac.com | [Apple Account](https://account.apple.com/) |
| **Yahoo Mail** | @yahoo.com, @ymail.com, @rocketmail.com | [Yahoo Security](https://login.yahoo.com/myaccount/security/app-password) |
| **Custom Email (IMAP/SMTP)** | Any email provider with IMAP/SMTP access | Check your provider's settings |


## Setup

### iCloud Mail

1. Open **Settings → Connectors**
2. Find **iCloud Mail** and click **Set up with Rebel**
3. Click **Open Apple Account** to go to [account.apple.com](https://account.apple.com/)
4. Sign in, then in the **Sign-In and Security** section, select **App-Specific Passwords**
5. Select **Generate an app-specific password** and name it "Rebel"
6. Copy the generated password and paste it into Rebel
7. Enter your @icloud.com, @me.com, or @mac.com email address

> **Important**: Enter your iCloud email address — not your Apple ID if it uses a different address (e.g. a Gmail address). Two-factor authentication must be enabled on your Apple Account. Full guide: [support.apple.com/en-gb/102654](https://support.apple.com/en-gb/102654)

### Yahoo Mail

1. Open **Settings → Connectors**
2. Find **Yahoo Mail** and click **Set up with Rebel**
3. Click **Open Yahoo** to go to your account security settings
4. Go to **Account Security → Generate app password**
5. Select "Other App", name it "Rebel"
6. Copy the generated password and paste it into Rebel
7. Enter your Yahoo email address

> **Note**: Yahoo allows up to 5 simultaneous email connections. If you use other email apps, you may occasionally see connection errors.

### Custom Email (IMAP/SMTP)

For email providers not listed above — Fastmail, ProtonMail, corporate email, university accounts, self-hosted mail servers, etc.

1. Open **Settings → Connectors**
2. Find **Custom Email (IMAP/SMTP)** and click **Set up with Rebel**
3. Enter your IMAP server hostname and port (e.g. `imap.fastmail.com`, port `993`)
4. Enter your SMTP server hostname and port (e.g. `smtp.fastmail.com`, port `587`)
5. Enter your email address and password (or app-specific password if your provider supports them)

> **Where to find your server settings**: Search "[your provider] IMAP SMTP settings" — most providers publish these in their help documentation. Common defaults: IMAP port 993 (TLS), SMTP port 587 (STARTTLS) or 465 (TLS).


## Multiple Accounts

Connect additional email accounts by clicking **Set up with Rebel** again for each account you want to add. Each account appears as a separate connection. You can mix providers — for example, iCloud for personal and a custom IMAP account for work.


## Tips

- **Check what's new**: Ask Rebel "check my email" or "what's unread in my inbox" for a quick status update
- **Search efficiently**: Filter by sender, subject line, or unread status to find specific messages
- **Draft first**: For important emails, ask Rebel to save a draft so you can review it in your email app before sending
- **Organize**: Move messages between folders to keep your inbox tidy


## Troubleshooting

| Problem | Solution |
|---------|----------|
| Authentication failed | Double-check your app-specific password — your regular account password won't work for iCloud/Yahoo |
| Can't generate app password | Make sure two-factor authentication (2FA) is enabled on your account |
| Connection errors (Yahoo) | Yahoo limits simultaneous connections to 5. Close other email apps and try again |
| Connection errors (Custom) | Verify your IMAP/SMTP server addresses and ports. Most providers use port 993 for IMAP and 587 or 465 for SMTP |
| Emails not appearing | Check you're searching the right mailbox (e.g., INBOX vs a custom folder) |
| Can't send emails | Verify your password has send permissions. For custom IMAP, check your SMTP settings are correct |


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
- [settings-and-configuration](library://rebel-system/help-for-humans/settings-and-configuration.md) — managing your connections
