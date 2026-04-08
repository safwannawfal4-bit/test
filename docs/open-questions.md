# Open Questions

## Canonical V2 App Location
- Question: Where should the new Next.js app live in this repository?
- Why it matters: The repo currently contains legacy prototype folders, and future implementation should not silently anchor itself to the wrong app root.
- Next step: Decide whether v2 should live at the repo root or under a dedicated app directory before scaffolding begins.

## Tenant Model Scope
- Question: Will the first version support full multi-tenancy, or a single-deployment preset model that later expands to multi-tenant support?
- Why it matters: This changes how presets, tenancy boundaries, and data isolation are modeled in Prisma and auth.
- Next step: Resolve before finalizing the core schema.

## Commerce Scope For Phase One
- Question: Does phase one require real payment processing, or only order capture and quote/request workflows?
- Why it matters: Payment, checkout, order state, and compliance boundaries should not be faked or guessed.
- Next step: Decide before implementing cart and checkout flows.
