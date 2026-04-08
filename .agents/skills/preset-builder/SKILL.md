# Name
preset-builder

## Description
Trigger when work affects white-label behavior: theme tokens, brand assets, label overrides, tenant defaults, feature presets, or reusable configuration layers. Use this to keep client-specific needs inside a generalized preset system.

## Workflow
1. Identify what is tenant-configurable versus globally fixed.
2. Convert one-off branding or wording requests into a preset or override shape instead of hardcoding them in feature code.
3. Define typed config keys for labels, themes, assets, and toggles that the platform can safely consume.
4. Keep defaults complete so a tenant can render without ad hoc fallbacks.
5. Update consuming code to read from the preset layer, not from niche constants.
6. Add or update documentation that explains how a new preset or override is supplied.

## Constraints
- Do not encode tenant names, business rules, or brand text directly into shared components.
- Do not create overlapping config systems for the same concern.
- Do not mix runtime preset resolution with secret or privileged server values.
- Do not add styling knobs that break the design system or produce invalid themes.

## Expected Outputs
- A typed preset or override structure for the changed white-label concern.
- Shared code reading from configuration instead of client-specific hardcoding.
- Updated setup or usage docs for future tenant rollout.
