---
name: ui-ux-pro-max
description: UI/UX design intelligence with searchable database
---
# ui-ux-pro-max

Use this skill when the user wants UI direction, a design system, visual review, layout ideas, or more deliberate styling guidance.
The bundled search tooling lives in `.codex/skills/ui-ux-pro-max/`.

## Repo-Safe Workflow

1. Confirm Python is available:

```bash
python3 --version
```

2. Run commands from the repo root using the real path to the skill script:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -f markdown
```

3. Start with `--design-system` to get a full recommendation before implementing UI.

4. If you want persisted notes during exploration, write them to a writable temp location instead of cluttering the repo root:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -f markdown -o /tmp -p "Project Name"
```

5. Use domain or stack searches only when the first pass needs more detail:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack html-tailwind
```

## Repo Integration Notes

This repo's frontend is not a generic Tailwind sandbox.
When using this skill for implementation, account for the current stack:

- Angular `16.1.x`
- SCSS component styling
- Tailwind with `tw-` prefix
- Angular Material, Bootstrap, and Flowbite all coexist

Prefer these repo-native references when implementing results:

- `frontend/src/app/modules/home/sharing/all-briefs/` for Tailwind-heavy list, filter, and KPI layouts
- `frontend/src/app/modules/home/emp/sales/new-sales-brief/` for large form and field-group patterns

## Useful Searches

Generate a full design system:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service elegant" --design-system -f markdown -p "Serenity Spa"
```

Persist a master design system plus a page override:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "fintech analytics dashboard" --design-system --persist -f markdown -o /tmp -p "Portal UI" --page "dashboard"
```

Follow-up domain searches:

```bash
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "glassmorphism dark" --domain style
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "elegant luxury serif" --domain typography
python3 .codex/skills/ui-ux-pro-max/scripts/search.py "real-time dashboard" --domain chart
```

## Guardrails

- Do not use the old nonexistent path `skills/ui-ux-pro-max/...`; use `.codex/skills/ui-ux-pro-max/...`.
- Do not default persisted output into the repo root; prefer a writable temp location such as `-o /tmp` unless you intentionally want committed docs.
- Do not suggest unprefixed Tailwind utilities for this repo.
- Do not force a brand-new visual language when editing an established feature; integrate the design system with the existing screen patterns.

## Response Contract

When using this skill for a repo task, return:

- recommended design system or UI direction
- why it fits the product and screen type
- repo-specific implementation constraints
- anti-patterns to avoid
- any follow-up search commands worth running
