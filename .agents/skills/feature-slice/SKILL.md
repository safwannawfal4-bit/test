---
name: feature-slice
description: Trigger when a task needs one Alma v2 feature built or changed end-to-end across App Router UI, server actions or route handlers, validation, auth, and persistence.
---

## Workflow
1. Define the slice boundary: user journey, entry points, server touchpoints, writes, and roles involved.
2. Restate the plan, touched areas, assumptions, and validation before coding.
3. Design the server path first: server action, route handler, or service, with Better Auth and validation requirements upfront.
4. If data shape changes are needed, use `prisma-migration` before coding against new fields or models.
5. Implement typed validation at the input boundary.
6. Implement server logic and persistence, then wire the UI to typed server interfaces.
7. Add complete loading, empty, success, and error states.
8. Run `architecture-check` before calling the slice complete.

## Constraints
- Do not scatter one feature across unrelated folders without a reason.
- Do not build UI first and defer validation or auth decisions.
- Do not put privileged writes, role checks, or Prisma access in client code.
- Do not expand scope into unrelated cleanup beyond the touched slice.
- Do not treat legacy Firebase flows as reusable architecture.

## Expected Outputs
- A clear feature boundary with identified touched areas.
- Implemented UI and server path for the requested slice.
- Validation and auth applied at the correct boundaries.
- Slice-specific docs and tests updated with the change.
