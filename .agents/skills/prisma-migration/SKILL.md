---
name: prisma-migration
description: Trigger when a task changes Prisma models, relations, enums, indexes, defaults, or stored business data shape for the Railway Postgres-backed v2 platform.
---

## Workflow
1. Describe the data change in one sentence: what is changing and why.
2. Review affected models, relations, nullability, defaults, indexes, tenant boundaries, and rollout risk before editing the schema.
3. Update the Prisma schema with the minimal safe change.
4. Create a migration with a specific name that explains the intent.
5. Review generated SQL for destructive or high-risk operations and adjust the plan if data safety is unclear.
6. Regenerate Prisma client or other generated artifacts that depend on the schema.
7. Update application code, seed or bootstrap logic, and docs that rely on the new shape.

## Constraints
- Do not make schema edits without a named migration unless the task is explicitly a throwaway prototype.
- Do not accept destructive SQL blindly.
- Do not hide data conversions inside unrelated feature code.
- Do not leave the repo using stale generated Prisma artifacts after a schema change.

## Expected Outputs
- Updated Prisma schema and a clearly named migration.
- Reviewed migration impact with noted safety concerns if any exist.
- Regenerated client artifacts and updated dependent docs or seed logic.
