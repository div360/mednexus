# AI agent context — MedNexus

Use this folder as the **single source of truth** for how to work on this repository. Point any AI assistant here at the start of a session (paste the path or `@docs/ai-agent-context`).

## Reading order

1. [01-what-we-are-building.md](./01-what-we-are-building.md) — product intent, scope, and success criteria (aligned with `implementation_plan.md`).
2. [02-mfe-and-nx-structure.md](./02-mfe-and-nx-structure.md) — host/remotes, ports, federation exposes, where code belongs.
3. [03-tailwind-and-css.md](./03-tailwind-and-css.md) — shared preset, per-app Tailwind configs, **critical MFE + Tailwind content-path rules**.
4. [04-code-conventions.md](./04-code-conventions.md) — TypeScript paths, libraries, patterns we follow.
5. [05-boundaries-must-not-do.md](./05-boundaries-must-not-do.md) — hard limits; violating these breaks builds or architecture.

## How to use elsewhere

- **In Cursor / Copilot / ChatGPT:** Attach this folder or paste “Follow `docs/ai-agent-context` in this repo.”
- **In another clone or fork:** Copy the whole `docs/ai-agent-context` directory; update names/paths if the repo root name changes.

## Canonical plan document

The human-oriented roadmap and checklists live at the repo root: **`implementation_plan.md`**. The files here distill what agents must **respect** when editing code; they do not replace that document for product planning.

For a human-readable overview of product scope, architecture, and how the work maps to a typical frontend take-home, see the root **`README.md`**.
