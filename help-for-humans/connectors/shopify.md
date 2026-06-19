---
description: "Connect Shopify to manage products, customers, orders, inventory, and more from your store"
---

# Shopify

Manage your Shopify store directly: browse and update products, look up customers, track orders, adjust inventory, and handle draft orders — all without leaving your conversation.


## What You Can Do

- **Products**: Search, view, create, and update products with variants and media
- **Collections**: Manage smart and custom product collections
- **Customers**: Look up, create, and update customer records
- **Orders**: Browse orders, check fulfillment status, and view order details
- **Draft orders**: Create, edit, complete, or delete draft orders
- **Inventory**: Check stock levels and adjust inventory across locations
- **Metafields**: Read and write custom metadata on any store resource


## Setup

1. Open **Settings → Connectors**
2. Find **Shopify** and click **Set up**
3. Click **Open Shopify** to go to your Shopify admin
4. Go to **Settings → Apps and sales channels → Develop apps**
5. Click **Create an app** and name it (e.g., "Rebel AI")
6. Click **Configure Admin API scopes** and enable the scopes you need (e.g., `read_products`, `write_products`, `read_orders`, `write_orders`, `read_customers`, `write_customers`, `read_inventory`, `write_inventory`)
7. Click **Install app** and copy the **Admin API access token** (shown only once!)
8. Paste your store domain and access token back in Rebel

> **Requires**: A Shopify store with custom app development enabled. Node.js must be installed on your machine.


## Tips

- **Browse products**: "Show me the 10 most recent products in my store" — Rebel lists them with prices and inventory
- **Check orders**: "What are my unfulfilled orders from this week?" — quick order status overview
- **Customer lookup**: "Find the customer record for sarah@example.com" — pull up full customer details
- **Draft orders**: "Create a draft order for 2x Premium Widget for John Smith" — Rebel creates it ready for review
- **Inventory**: "What's the stock level for SKU REBEL-001?" — check inventory across locations


## See Also

- [MCP-tools-and-other-knowledge-sources](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) -- overview of all connectors
