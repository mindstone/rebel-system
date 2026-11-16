---
description: "Connect Xero to manage invoices (multi-currency, attachments, history & notes), contacts, payments, bank transactions, quotes, and financial reports"
---

# Xero

Access your Xero accounting platform: list and create invoices (including multi-currency invoices, attachments, and invoice history/notes), manage contacts, payments, and bank transactions, create quotes, and generate financial reports (P&L, balance sheet).


## What You Can Do

- **Invoices**: List, create, and update invoices, including **multi-currency invoices**, **invoice attachments** (list and download), and **invoice history and notes**
- **Contacts**: Browse and manage customer and supplier contacts
- **Payments**: View and record payments
- **Bank transactions**: List and create bank transactions
- **Quotes**: Create and manage quotes
- **Reports**: Generate Profit & Loss and Balance Sheet reports


## Setup

Xero connects through a free app of your own that you make once in Xero's developer site. It takes about 3 minutes.

1. Open **Settings → Connectors**, find **Xero** and click **Set up**
2. Click **Open Xero Developer Portal** (a different site from your regular Xero, though your usual Xero login works)
3. Click **New app** → name it "Rebel" → choose **Web app** → enter your company's website
4. Copy the **Callback URL** from the Xero card in Rebel and paste it as the app's **Redirect URI** → **Create app**
5. Open **Configuration**: copy the **Client ID**, then generate a **Client Secret** and copy it
6. Paste both into Rebel and click **Connect**
7. Xero opens in your browser: pick your company and click **Allow access**

There are no permissions to tick: Rebel asks for the ones it needs when you sign in.

> **Note**: A Xero app like this is free for up to 5 companies. If Rebel later says the Xero sign-in has expired (after about two months unused), click **Connect** on the Xero card again.
>
> Already connected with a Xero Custom Connection? It keeps working, with nothing to change. Xero stops making new Custom Connections from 1 December 2026.


## Tips

- **Invoice overview**: "Show unpaid invoices" or "What's outstanding for Acme Corp?"
- **Create invoices**: "Create an invoice for Acme Corp for $5,000 due in 30 days"
- **Multi-currency**: "Create a EUR invoice for our Berlin client" — invoices can be raised in foreign currencies
- **Attachments & notes**: "Download the receipt attached to invoice INV-001" or "Show the history and notes on that invoice"
- **Financial reports**: "Show the P&L for last quarter" or "Generate a balance sheet"
- **Contact lookup**: "Find all contacts with overdue invoices"


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors
