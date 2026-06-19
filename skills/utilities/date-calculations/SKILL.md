---
name: date-calculations
description: "Calculate day of week, add/subtract days, or days between dates. Use this instead of mental date arithmetic."
---

# Date Calculations

Use `scripts/date-calc.js` for date arithmetic instead of calculating mentally.

## Examples

```bash
# What day of the week is 2025-01-25?
node rebel-system/skills/utilities/date-calculations/scripts/date-calc.js day-of-week 2025-01-25
# → Saturday

# What date is 5 days from 2025-01-21?
node rebel-system/skills/utilities/date-calculations/scripts/date-calc.js add-days 2025-01-21 5
# → 2025-01-26

# What date was 10 days ago from 2025-01-21?
node rebel-system/skills/utilities/date-calculations/scripts/date-calc.js add-days 2025-01-21 -10
# → 2025-01-11

# How many days between two dates?
node rebel-system/skills/utilities/date-calculations/scripts/date-calc.js days-between 2025-01-01 2025-02-01
# → 31
```

## [IMPORTANT]

- Always use YYYY-MM-DD format for dates
- Script is timezone-safe (uses UTC internally)
- For "N days from today", get today's date from the system prompt `date` field
