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

Xero connects through a one-time "Custom Connection" app that you create in Xero's Developer Portal; Rebel then uses its Client ID and Secret. It takes about 5 minutes, once.

1. Open **Settings → Connectors**, find **Xero** and click **Set up**
2. Click **Open Xero Developer Portal** (a different site from your regular Xero, though your usual Xero login works)
3. Click **New App** → name it "Rebel" → choose **Custom connection** → enter your company's website → **Create app**
4. Tick these 19 scopes. If you miss one, Rebel tells you when you first use Xero, so you can go back and tick it. Xero then switches the connection off until it is authorised again, so repeat step 6 afterwards.
   - **Accounting**: `accounting.attachments.read`, `accounting.banktransactions`, `accounting.contacts`, `accounting.invoices`, `accounting.manualjournals`, `accounting.payments`, `accounting.settings`
   - **Reports**: `accounting.reports.aged.read`, `accounting.reports.balancesheet.read`, `accounting.reports.banksummary.read`, `accounting.reports.budgetsummary.read`, `accounting.reports.executivesummary.read`, `accounting.reports.profitandloss.read`, `accounting.reports.taxreports.read`, `accounting.reports.tenninetynine.read`, `accounting.reports.trialbalance.read`
   - **Payroll**: `payroll.employees`, `payroll.settings`, `payroll.timesheets`
5. Enter the email of a Xero user who can authorise the connection (often you), then save
6. That person gets an email from Xero: click **Connect** and pick the organisation
7. Back on the app's page, copy the **Client ID** and generate the **Client Secret**
8. Paste both into Rebel

> **Note**: Custom Connection apps require a small monthly subscription from Xero, per connection (see Xero's [Custom Connection pricing](https://developer.xero.com/custom-development)). Demo Company is free for testing. Available in AU, NZ, UK, and US.
>
> From 1 December 2026, Xero no longer lets anyone create a new Custom Connection. One made before then keeps working.


## Tips

- **Invoice overview**: "Show unpaid invoices" or "What's outstanding for Acme Corp?"
- **Create invoices**: "Create an invoice for Acme Corp for $5,000 due in 30 days"
- **Multi-currency**: "Create a EUR invoice for our Berlin client" — invoices can be raised in foreign currencies
- **Attachments & notes**: "Download the receipt attached to invoice INV-001" or "Show the history and notes on that invoice"
- **Financial reports**: "Show the P&L for last quarter" or "Generate a balance sheet"
- **Contact lookup**: "Find all contacts with overdue invoices"


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors
