---
name: marketing-integration
description: Trigger when adding or changing tracking, attribution, conversion events, pixels, marketing providers, or order-to-marketing data flows.
---

## Workflow
1. Define the provider, exact events, consent requirements, and whether delivery belongs on the client, server, or both.
2. Extend a typed integration boundary instead of sprinkling provider calls through feature code.
3. Validate payload shape and gate emission on config, consent, and environment readiness.
4. Keep secrets, tokens, and signed delivery on the server when supported.
5. Ensure disabled providers do not inject scripts, emit events, or create misleading dashboards.
6. Document env vars, enablement rules, and supported event names.

## Constraints
- Do not paste arbitrary third-party scripts into layouts, pages, or CMS fields.
- Do not create anonymous `window` calls or untyped event payloads.
- Do not fire events before consent, required identifiers, or provider readiness checks.
- Do not leak secrets or private business data into browser tracking payloads.

## Expected Outputs
- A typed integration path for the approved provider.
- Guarded event emission with explicit configuration and consent handling.
- Updated docs covering setup, env vars, and supported events.
