# What we are building

This section mirrors and tightens **`implementation_plan.md`** so agents stay aligned with intent.

## Product

**MedNexus** — a **B2B healthcare SaaS UI** demo: clinicians, analysts, and admins meet in one “nexus” hub. It is **not** a full clinical record system; it demonstrates **micro-frontends**, shared state, Firebase auth, and realistic healthcare-style workflows (dashboard, analytics, patients).

## Brand and UX direction

- **Name:** MedNexus (“nexus” = central connection).
- **Palette (conceptual):** deep indigo, teal accents, charcoal / dark surfaces — **dark-first** with clear hierarchy (see plan for hex references).
- **Typography:** Inter (and DM Sans for body where specified in the plan).
- **Theme:** Dark-first; polished cards and subtle depth (e.g. glass-style / glow accents where implemented).

## Technical goals

1. **Nx monorepo** — orchestration, affected builds, clear project graph.
2. **Vite + Module Federation** (`@originjs/vite-plugin-federation`) — **shell host** loads **remote MFEs** at runtime.
3. **Thin apps, fat libs** — `apps/*` are shells (entry, federation config, minimal routing glue). **Features and shared code live under `libs/`.**
4. **Shared contracts** — types and validation in **`@mednexus/shared/types`**; Firebase in **`@mednexus/shared/firebase`**; optional global UI state in **`@mednexus/shared/data-access`**.
5. **Stack:** React 18, TypeScript, Tailwind, Zustand, React Router v6, React Hook Form + Zod, Recharts where applicable, Firebase Auth.

## Routes (shell-owned)

| Route | Fed remote | Purpose |
|-------|------------|---------|
| `/login`, `/signup` | `auth` | Auth UI (Firebase) |
| `/dashboard/*` | `dashboard` | KPIs / home |
| `/analytics/*` | `analytics` | Charts |
| `/patients/*` | `patients` | Patient list/grid |

Protected routes use **`useAuthStore`** from `@mednexus/auth/data-access` in the shell.

## Verification mindset

Agents should prefer changes that keep **`nx build`** / **`nx serve`** working for **shell + any touched remote**. See `implementation_plan.md` for manual QA (login, navigation, charts, patients, notifications, responsive checks).

## Out of scope (unless explicitly requested)

- Replacing Nx with Turborepo or another monorepo tool.
- Rewriting the entire styling system without alignment to existing tokens.
- Adding new MFEs without updating shell remotes, ports, and Tailwind content globs as needed.
