# Architecture

## Purpose
This repo is preparing Alma v2 as a reusable white-label business platform. The v2 architecture, not the legacy prototype code, is the source of truth.

## Current Repository Shape
- `alma-tennis-academy/`: legacy CRA/Firebase prototype for reference only.
- `.agents/skills/`: repo-local Codex workflows.
- `.codex/config.toml`: project-scoped Codex configuration.
- `docs/`: durable project knowledge.
- `PLANS.md`: active multi-step execution plans.

## V2 Target Stack
- Next.js App Router
- Railway Postgres
- Prisma
- Better Auth
- Typed server actions and route handlers

## Core Boundaries
- Server owns auth, authorization, writes, secrets, provider credentials, and business rules.
- Client components handle interaction and presentation only.
- Shared domain logic should stay framework-light and reusable.
- Tenant customization must flow through a preset system, not hardcoded branches in shared features.

## Platform Shape
- Multi-tenant or tenant-aware business platform with reusable business primitives.
- Preset-driven branding, labels, themes, and configuration.
- Business backend for catalog, orders, customers, staff, and operations.
- Marketing and tracking support through typed providers and explicit enablement.

## Working Patterns
- Keep `AGENTS.md` short and route deeper guidance into docs and skills.
- Use `PLANS.md` for multi-hour or cross-cutting work.
- Build vertical feature slices that connect UI, validation, auth, and data access cleanly.
- Capture durable decisions in `docs/decisions.md`, unresolved uncertainty in `docs/open-questions.md`, and current focus in `docs/status.md`.

## Do Not Inherit From Legacy
- Do not carry over Firebase as runtime infrastructure.
- Do not rely on client-side role checks for admin or staff access.
- Do not expose backend behavior through fake UI states or prototype-only flows.
- Do not treat legacy file layout, contexts, or page structure as the v2 blueprint.
