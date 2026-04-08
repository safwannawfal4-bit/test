# Name
system-check

## Description
Trigger after major changes, before finishing a task, or whenever uncertainty suggests hidden architecture, security, UX, or scope problems. Use this skill to detect issues early and stop bad changes from being normalized.

## Workflow
1. Review the changed surface against the project mission: does it strengthen a reusable white-label business platform or introduce one-off product debt?
2. Check architecture fit: Next.js App Router, Prisma, server-side auth, and clear server-client boundaries.
3. Inspect for tight coupling, leaky abstractions, duplicated logic, or niche tenant behavior embedded in shared code.
4. Inspect for security issues: privileged client logic, exposed secrets, missing validation, weak auth boundaries, unsafe third-party integration paths.
5. Inspect for misleading UX: fake payments, fake submissions, fake success states, or flows that imply backend guarantees that do not exist.
6. Inspect for overengineering, unnecessary abstractions, stale branches, and dead code.
7. Decide whether to continue, fix immediately, or stop and flag an issue before more work happens.
8. If a repeated issue appears, route it into `retrospective` for memory and system updates.

## Constraints
- Do not treat this as a generic style review.
- Do not ignore mission drift because the code technically works.
- Do not allow risky architecture or misleading UX to pass silently.
- Do not add new abstractions during this check unless they directly fix the identified problem.

## Expected Outputs
- A short list of detected risks, mismatches, or confirmations.
- Clear guidance on whether the change is safe to continue, needs fixes, or should be stopped.
- Escalation into memory or system improvement when a repeated issue is found.
