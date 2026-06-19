---
description: Internal team needs a component and IA decision before implementation
generated_by: chief-designer
---

# Internal Decision: Component Choice

## Prompt

We are adding a settings area where users choose how aggressively Rebel should save memories. Should this be a select, toggle group, or custom cards?

## Good Chief Designer Response

### Problem being solved
The user is choosing a trust posture, not just a setting value. They need to understand the practical difference between options before committing.

### Recommended direction
Use a `RichSelect` if this lives inside an existing settings row. Use decision cards only if this is an onboarding or first-run moment where comparison is the main task.

For normal Settings, I would choose:
- label: `Memory saving`
- value options: `Ask first`, `Balanced`, `Save more automatically`
- descriptions that explain control and reversibility in plain language

### Pattern reuse decision
Reuse the shared select family. `RichSelect` exists for choices where descriptions matter. A toggle is wrong because this is not binary. Custom cards are too heavy unless the whole screen is dedicated to this decision.

### System effects
This keeps Settings scannable and avoids promoting one trust-sensitive preference into a bespoke pattern. It also gives future memory controls a clear family to join.

### What would change my mind
If research shows users frequently compare these options side by side before deciding, use decision cards in onboarding and keep the compact `RichSelect` in Settings.

### Decision confidence
High for Settings. Medium for onboarding without seeing the full flow.
