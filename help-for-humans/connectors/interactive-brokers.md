---
description: "Connect Interactive Brokers to manage your portfolio, place trades, get market data, and read financial news"
last_updated: "2026-03-31"
---

# Interactive Brokers

Trade stocks, options, futures, and forex through Interactive Brokers. Check positions, get real-time quotes, place orders, scan markets, and read financial news — all from Rebel.


## What You Can Do

**Portfolio & Account**
- **View positions** — See all open positions with quantity, average cost, and contract details
- **Account summary** — Key financial metrics: net liquidation, buying power, margin, cash, and more
- **P&L tracking** — Real-time profit and loss at both account and individual position level
- **Account listing** — Discover managed account IDs for multi-account setups

**Market Data**
- **Real-time quotes** — Current prices, bid/ask, and volume for any instrument
- **Historical data** — OHLCV bars and tick-by-tick data for analysis
- **Level II depth** — Order book data showing the bid/ask ladder (requires Level II permissions)
- **Market scanners** — Discover top gainers, most active, high dividend yield, and dozens of other scanner types
- **Contract search** — Find any instrument by ticker or company name

**Trading**
- **Place orders** — Market, limit, stop, stop-limit, trailing stop, and more
- **Bracket orders** — Entry + take-profit + stop-loss as linked orders in one step
- **Order preview** — Check margin impact and estimated commission before placing (what-if mode)
- **Modify and cancel** — Update open orders or cancel individually or all at once
- **Order monitoring** — Track open orders, completed orders, and execution history

**Options**
- **Option chains** — Browse available expirations and strikes for any underlying
- **Option pricing** — Calculate theoretical prices and Greeks (delta, gamma, vega, theta)
- **Implied volatility** — Solve for IV given an option's market price
- **Exercise options** — Exercise or lapse option contracts

**News**
- **Headlines** — Get news headlines for any instrument from providers like Benzinga, Dow Jones, and Refinitiv
- **Full articles** — Read complete news articles
- **Provider discovery** — See which news sources are available with your IB subscription


## Setup

Interactive Brokers requires IB Gateway (or Trader Workstation) running on your computer. Rebel connects to it locally.

### 1. Install and run IB Gateway

Download IB Gateway from [Interactive Brokers](https://www.interactivebrokers.com/en/trading/ibgateway-stable.php) and log in with your IB credentials. IB Gateway must be running whenever you want Rebel to access your brokerage account.

> **Tip:** IB Gateway is a lightweight, headless version of Trader Workstation (TWS). If you already use TWS, that works too.

### 2. Connect in Rebel

1. Open **Settings → Connectors**
2. Find **Interactive Brokers** and click **Set up with Rebel**
3. Configure the connection (all fields are optional — defaults work for most setups):

| Setting | Default | Description |
|---------|---------|-------------|
| **Account Mode** | `paper` | `paper` for simulated trading, `live` for real money |
| **Gateway Port** | `4002` | Paper: 4002, Live: 4001, TWS Paper: 7497, TWS Live: 7496 |
| **Gateway Host** | `127.0.0.1` | Leave as-is unless Gateway runs on another machine |
| **Client ID** | `1` | Must be unique per connected application |

4. Click **Connect**

> **Paper trading first**: Defaults are set for paper trading, so you can explore safely without risking real funds. Switch to live mode when you're ready.

> **IB Gateway must be running**: If Rebel can't connect, check that IB Gateway (or TWS) is running and logged in. Ask Rebel to "check IB connection status" to diagnose issues.


## Tips

- **Start with status**: Ask "check my IB connection" to verify everything is connected before trading
- **Preview before placing**: Ask Rebel to preview an order before placing it — you'll see margin impact and estimated commission
- **Portfolio overview**: Ask "show my IB positions and P&L" for a complete portfolio snapshot
- **Market scanning**: Ask "scan for top gainers on NYSE" or "find most active stocks" to discover trading opportunities
- **Options analysis**: Ask "show the option chain for AAPL" followed by "calculate the Greeks for the March 200 call"
- **News**: Ask "get the latest news for TSLA" to see headlines from your subscribed providers


## Privacy

- **Local connection only** — Rebel connects to IB Gateway running on your computer. No brokerage credentials are shared with Rebel or Mindstone.
- **Your credentials stay with IB** — You log in to IB Gateway directly with Interactive Brokers. Rebel never sees or stores your brokerage username or password.
- **Paper mode by default** — The connector defaults to paper trading so you can explore without risk.
- **Order confirmations** — Destructive actions (cancel all orders, exercise options) require explicit confirmation through Rebel's safety system.


## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect | Make sure IB Gateway (or TWS) is running and logged in |
| "Client ID in use" error | Another application is using the same Client ID. Change the Client ID in Settings → Connectors → Interactive Brokers |
| Market data unavailable | Some data requires IB market data subscriptions. Check your subscriptions in IB Account Management |
| Orders rejected | Verify account has sufficient margin/buying power. Use order preview to check before placing |
| Wrong account mode | Account mode (paper/live) is set during connector setup. To switch, update the mode in Settings → Connectors |


## See Also

- [Connectors & Integrations](library://rebel-system/help-for-humans/mcp-connectors-tools-and-integrations.md) — overview of all connectors
