---
name: preset-builder
description: "Trigger when work affects white-label behavior: theme tokens, brand assets, label overrides, tenant defaults, preset packs, or reusable configuration layers."
---

## Workflow
1. Identify what is tenant-configurable versus globally fixed.
2. Convert one-off branding or wording requests into preset data or override shapes instead of hardcoding them in feature code.
3. Define typed config keys for labels, themes, assets, toggles, and preset composition rules.
4. Keep defaults complete so a tenant can render without ad hoc fallbacks.
5. Update consuming code to read from the preset layer, not niche constants or tenant branches.
6. Update docs when the preset contract changes.

## Constraints
- Do not encode tenant names, business rules, or brand text directly into shared components.
- Do not create overlapping config systems for the same concern.
- Do not mix runtime preset resolution with secret or privileged server values.
- Do not add styling knobs that break the design system or produce invalid themes.

## Expected Outputs
- A typed preset or override structure for the changed white-label concern.
- Shared code reading from configuration instead of client-specific hardcoding.
- Updated setup or usage docs for future tenant rollout.
