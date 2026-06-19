<!-- PRE_SUBMIT_PLACEHOLDER: replace this entire README before contributing.
     pre-submit-check.sh greps for this marker and fails while it is present,
     which forces the agent to populate the placeholders below. -->

# <CONNECTOR_NAME> MCP Server

<CONNECTOR_DESCRIPTION>

MCP (Model Context Protocol) server for <CONNECTOR_NAME>. Compatible with any
MCP host that speaks stdio transport.

## Requirements

- Node.js 18+
- npm
- A <CONNECTOR_NAME> API key (see the "Credentials" section below)

## Install & build

```bash
npm install
npm run build
```

## Run locally

```bash
# Populate .env first (see .env.example)
cp .env.example .env
# Edit .env with your credentials

npm start
```

The server communicates over stdio, so it does not print anything useful when
run directly — point your MCP host at `dist/index.js`.

## Test

```bash
npm test
```

Runs the smoke test which spawns the built server, performs an MCP
handshake, and lists the registered tools. Any tests in the `test/`
directory ending in `.test.mjs` or `.test.ts` are picked up.

## Credentials

<AUTH_INSTRUCTIONS — describe where the user obtains their API key and how
to pass it to the server. Include the env var name(s) the server reads.>

## Tools

<TOOL_LIST — list each registered tool with a one-liner description, the
input schema summary, and the expected output shape. Example:

- `example_search(query, limit?)` — searches <CONNECTOR_NAME> for items
  matching `query`, returns up to `limit` results (default 10).
- `example_get_by_id(id)` — retrieves full details for a single item.

Each tool's description in `src/index.ts` is the canonical source; keep
this section in sync with it.>

## License

FSL-1.1-MIT. See [LICENSE](LICENSE) for the full terms.

The default LICENSE matches the upstream `mindstone/mcp-servers` repository so
this connector can be contributed back without changes. If you are not
contributing to that repository, replace the LICENSE with whichever licence
applies to your distribution.
