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

You start the connection from **Settings → Connectors**, but Xero requires a one-time "Custom Connection" app set up in Xero's own Developer Portal so you can supply a Client ID and Secret. The steps below walk you through it.

1. Open **Settings → Connectors**
2. Find **Xero** and click **Set up**
3. Click **Open Xero Developer Portal** (this is different from your regular Xero login)
4. Click **New App** → enter a name (e.g., "Rebel") → select **Custom connection** → enter your company URL → Create app
5. Select these scopes:
   - Accounting: accounting.attachments.read, accounting.banktransactions, accounting.contacts, accounting.invoices, accounting.manualjournals, accounting.payments, accounting.settings
   - Reports: accounting.reports.aged.read, accounting.reports.balancesheet.read, accounting.reports.banksummary.read, accounting.reports.budgetsummary.read, accounting.reports.executivesummary.read, accounting.reports.profitandloss.read, accounting.reports.taxreports.read, accounting.reports.tenninetynine.read, accounting.reports.trialbalance.read
   - Payroll: payroll.employees, payroll.settings, payroll.timesheets
6. Enter the email of a Xero user who can authorise, then save
7. That user will receive an email -- click **Connect** and select the Xero organisation
8. Return to the app details page, copy the **Client ID** and generate the **Client Secret**
9. Paste both values back in Rebel

> **Note**: Custom Connection apps require a subscription from Xero (~$5/month per connection). Demo Company is free for testing. Available in AU, NZ, UK, and US.


## Tips

- **Invoice overview**: "Show unpaid invoices" or "What's outstanding for Acme Corp?"
- **Create invoices**: "Create an invoice for Acme Corp for $5,000 due in 30 days"
- **Multi-currency**: "Create a EUR invoice for our Berlin client" — invoices can be raised in foreign currencies
- **Attachments & notes**: "Download the receipt attached to invoice INV-001" or "Show the history and notes on that invoice"
- **Financial reports**: "Show the P&L for last quarter" or "Generate a balance sheet"
- **Contact lookup**: "Find all contacts with overdue invoices"


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors
