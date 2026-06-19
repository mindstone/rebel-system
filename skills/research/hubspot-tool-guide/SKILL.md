---
name: hubspot-tool-guide
description: "Guide for using HubSpot CRM operations through HubSpot MCP, including discovery, execution, and common workflows."
last_updated: 2025-01-07
agent_type: main_agent
dependencies: []
---

[GOAL]
Execute HubSpot CRM operations efficiently using HubSpot MCP tools

[CONTEXT]
HubSpot access is provided through HubSpot MCP. The MCP uses a discovery-based approach where you discover available categories and actions before executing them. Not all HubSpot API features are available - notably associations between objects must be handled separately.

[AVAILABLE HUBSPOT CATEGORIES]
- HUBSPOT_DEAL - Create, read, update, delete deals
- HUBSPOT_CONTACT - Manage contacts
- HUBSPOT_COMPANY - Manage companies
- HUBSPOT_TICKET - Manage tickets
- HUBSPOT_TASK - Manage tasks
- HUBSPOT_NOTE - Create notes with associations
- HUBSPOT_PROPERTY - Search objects by properties

[PROCESS]
1. Locate your HubSpot MCP server:
   - List available MCP tool packages to find the one with HubSpot
   - Verify it includes discovery tools: `discover_server_categories_or_actions`, `get_category_actions`, `get_action_details`, `execute_action`

2. Discover what actions are available in the category you need:
   - Use `get_category_actions` with the category name (e.g., "HUBSPOT_DEAL")
   - Returns list of available actions like: hubspot_get_deals, hubspot_get_deal_by_id, hubspot_create_deal, hubspot_update_deal_by_id, hubspot_delete_deal_by_id

3. Get detailed parameters for the specific action:
   - Use `get_action_details` with category_name and action_name
   - Review the body_schema to understand required and optional parameters
   - Note any special formatting requirements (JSON strings, date formats, etc.)

4. Execute the action with proper parameters:
   - Use `execute_action` with:
     - server_name: "hubspot"
     - category_name: The category (e.g., "HUBSPOT_DEAL")
     - action_name: The specific action
     - body_schema: JSON string with parameters
     - maximum_output_characters: Set to 5000-10000 for most operations
   - Always format body_schema as a proper JSON string

5. For searching HubSpot objects by property:
   - Use `HUBSPOT_PROPERTY` category with `hubspot_search_by_property`
   - Required parameters: object_type, property_name, operator, value, properties (array)
   - Common operators: EQ, CONTAINS_TOKEN, GT, LT, IN, BETWEEN
   - Specify which properties to return in the properties array
   - Set appropriate limit (default 10, can increase as needed)

6. Handle pagination for list operations:
   - Most list operations return limited results
   - Note the pagination parameters in action details
   - Fetch additional pages if needed for comprehensive searches

[COMMON WORKFLOWS]

Deal operations:
- Get deal by ID: Use hubspot_get_deal_by_id with deal_id
- Update deal: Use hubspot_update_deal_by_id with JSON properties (amount, dealstage, closedate, etc.)
- Create deal: Use hubspot_create_deal with dealname, amount, dealstage, pipeline
- Search deals: Use hubspot_get_deals or search by property

Contact/Company lookup:
- Search by name: Use HUBSPOT_PROPERTY with CONTAINS_TOKEN operator
- Search by email: Use property_name: "email" with EQ or CONTAINS_TOKEN
- Get by ID: Use hubspot_get_contact_by_id or hubspot_get_company_by_id

Deal stages common values:
- closedwon - For signed/won deals
- closedlost - For lost deals
- Numeric IDs for pipeline stages (e.g., 3027432657 for "Negotiation Started")
- Use get_action_details or existing deal to find stage IDs

[IMPORTANT]
- Body schema must be valid JSON string format: "{\"property\": \"value\"}"
- Deal associations (linking contacts/companies to deals) may NOT be supported through all MCP HubSpot actions
- Associations can only be set via HubSpot web browser or direct API calls with proper credentials
- When creating deals, capture contact/company IDs separately for manual association later
- Date formats should be ISO 8601: "2025-10-29T00:00:00Z"
- Always use get_action_details before first use of new action to verify parameter format
- Search operators are case-sensitive: use CONTAINS_TOKEN, EQ, GT (uppercase)
- Property names in searches are lowercase: firstname, lastname, email, dealname
- When deal retrieval shows 'associations': None, it means associations aren't loaded in response
- Set realistic maximum_output_characters to avoid truncation of important data
- Use search_documentation as fallback if specific action unclear

You always follow the [PROCESS] and respect what's [IMPORTANT]
