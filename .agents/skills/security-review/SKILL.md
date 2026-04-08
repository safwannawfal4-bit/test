# Name
security-review

## Description
Trigger when work touches auth flows, roles, permissions, secrets, server-only modules, external input, webhooks, integrations, or any boundary where trust changes. Use this as a focused review, not as a generic code review.

## Workflow
1. Identify trust boundaries: caller, server entrypoint, data store, third-party provider, and secret usage.
2. Confirm authentication and authorization happen on the server at the write or read boundary that matters.
3. Verify all external input is validated, normalized where needed, and rejected safely on failure.
4. Check that secret values stay in server-only code paths and are never logged or returned to clients.
5. Review error handling for data leakage, privilege escalation, and unsafe fallbacks.
6. Record any unresolved security risk before completion.

## Constraints
- Do not assume UI gating is sufficient authorization.
- Do not accept unchecked request bodies, search params, headers, or webhook payloads.
- Do not move server-only helpers into shared code if that makes them client-importable.
- Do not close the task while known security gaps remain undocumented.

## Expected Outputs
- A reviewed list of trust boundaries for the touched change.
- Confirmed auth, validation, and secret handling at the correct layers.
- A short risk note for any remaining follow-up items.
