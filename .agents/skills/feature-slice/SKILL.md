# Name
feature-slice

## Description
Trigger when a task requires a single feature to be built or changed end-to-end across UI, server logic, validation, auth, and persistence. Use this for vertical slices, not for isolated refactors or final QA only.

## Workflow
1. Define the slice boundary: user flow, entry points, server touchpoints, data writes, and roles involved.
2. List the files or modules that will change before implementation starts.
3. Design the server path first: action, route, loader, or service; include auth and validation requirements up front.
4. If persistence changes are needed, hand off schema work to `prisma-migration` before coding against new fields or models.
5. Implement or update typed validation at the input boundary.
6. Implement server logic and data access, then wire the UI to those typed interfaces.
7. Add or update loading, empty, success, and error states in the user flow.
8. Verify docs and tests that are specific to the slice are updated before handoff.

## Constraints
- Do not scatter one feature across unrelated folders without a reason.
- Do not build UI first and defer validation or auth decisions.
- Do not put privileged writes, role checks, or Prisma access in client code.
- Do not expand scope into unrelated cleanup beyond the touched slice.

## Expected Outputs
- A clear feature boundary with identified touched areas.
- Implemented UI and server path for the requested slice.
- Validation and auth applied at the correct boundaries.
- Slice-specific docs and tests updated with the change.
