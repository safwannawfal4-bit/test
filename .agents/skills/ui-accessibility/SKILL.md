---
name: ui-accessibility
description: Trigger when creating or revising interactive UI, especially forms, modals, tables, filters, navigation, dashboards, carts, checkout flows, and mobile layouts.
---

## Workflow
1. Identify the main user tasks, viewports, and interaction modes involved.
2. Ensure semantic structure is correct before styling polish: headings, labels, buttons, landmarks, table semantics, and focus order.
3. Add complete UI states for loading, empty, success, validation, disabled, and error cases.
4. Check keyboard access, visible focus, and screen-reader naming for interactive controls.
5. Verify responsive behavior for common breakpoints, long-content cases, and real business copy.
6. Ensure the UI does not promise backend behavior that the system does not actually support.
7. Trim visual noise and keep interactions legible, consistent, and fast to understand.

## Constraints
- Do not rely on color alone to communicate meaning or status.
- Do not ship forms without labels, validation feedback, or disabled/loading protection.
- Do not hide inaccessible custom controls behind styled `div` elements when native elements fit.
- Do not optimize for desktop only when the flow is expected on mobile.

## Expected Outputs
- A semantically correct and responsive UI flow.
- Complete interaction states and accessible control labeling.
- Reduced UX debt in the touched surfaces without unrelated redesign work.
