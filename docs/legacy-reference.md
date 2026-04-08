# Legacy Reference

## What The Old App Covered Conceptually
- Public marketing pages
- Programs and product catalog flows
- Cart and checkout-like flows
- Admin pages for orders, products, staff, settings, and tracking
- Theme and content customization ideas

## What Can Be Migrated Conceptually
- Product and program domain concepts
- Customer, staff, and order management needs
- Theme presets, label overrides, and content customization requirements
- Marketing and tracking surfaces that the business wants long term

## What Must Not Be Copied
- Firebase as the backend foundation
- Client-side admin authorization as the real security boundary
- Role assignment or privilege bootstrap from frontend logic
- Exposed provider configuration in frontend code as an architectural pattern
- Fake checkout, fake success states, or other misleading business flows
- Prototype data seeding and publish tooling as production backend design

## Concrete Legacy Risks Seen In This Repo
- `alma-tennis-academy/src/firebase.js` exposes Firebase client configuration in the frontend codebase.
- `alma-tennis-academy/src/context/AuthContext.js` mixes auth, role bootstrapping, and admin seeding in client runtime logic.
- `alma-tennis-academy/src/components/ProtectedRoute.js` relies on client-side gating for admin or staff pages.
- The legacy app structure is centered on CRA pages, contexts, and prototype admin screens rather than real server boundaries.

## How To Use This Reference
- Read it to understand business intent and migration inventory.
- Do not use it as a blueprint for file layout, auth, data access, or platform architecture.
