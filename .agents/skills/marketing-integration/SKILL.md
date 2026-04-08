# Name
marketing-integration

## Description
Trigger when adding or changing tracking, attribution, conversion events, pixels, tag providers, or marketing data flows. Use this only for approved providers integrated through typed code paths.

## Workflow
1. Define the provider, the exact events required, and whether the integration belongs on the client, server, or both.
2. Locate the approved integration boundary and extend it with typed provider-specific configuration.
3. Validate event payload shape and required consent or environment checks before firing.
4. Ensure secrets and signing stay on the server when the provider supports server-side delivery.
5. Add clear enablement logic so disabled providers do not inject scripts or emit events.
6. Document setup requirements, env vars, and event names.

## Constraints
- Do not paste arbitrary third-party scripts into layouts, pages, or CMS fields.
- Do not create anonymous `window` calls or untyped event payloads.
- Do not fire events before consent, required identifiers, or provider readiness checks.
- Do not leak secrets or private business data into browser tracking payloads.

## Expected Outputs
- A typed integration path for the approved provider.
- Guarded event emission with explicit configuration and consent handling.
- Updated docs covering setup, env vars, and supported events.
