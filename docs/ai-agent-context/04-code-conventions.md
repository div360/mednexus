# Code conventions

## General

- **TypeScript** everywhere for app and lib source.
- **Focused diffs** — change only what the task requires; avoid drive-by refactors and unrelated formatting.
- **Match surrounding code** — naming, hooks patterns, file layout, and comment density should blend with the existing file.

## React

- Prefer **function components** and hooks.
- **Forms:** React Hook Form + Zod resolvers; schemas/types aligned with **`@mednexus/shared/types`** where applicable.
- **State:** domain stores in **`libs/<domain>/data-access`** (Zustand); shell may use **`@mednexus/auth/data-access`** for auth guard.

## Imports

- Use **`@mednexus/...`** path aliases from `tsconfig.base.json`.
- Avoid importing from another library’s **internal** paths (e.g. `libs/foo/feature/src/lib/secret.tsx`); expose via **`index.ts`** barrels.

## File placement

| Kind of code | Where |
|--------------|--------|
| Route wiring, federation, `main.tsx` | `apps/<app>/` |
| Screen-level UI, forms, tables | `libs/<domain>/feature` |
| Stores, API clients, mocks for domain | `libs/<domain>/data-access` |
| Shared types, Zod schemas | `libs/shared/types` |
| Firebase init/helpers | `libs/shared/firebase` |
| Shared buttons, inputs, primitives | `libs/shared/ui` |

## Nx

- Prefer **`nx run <project>:<target>`** for builds/tests affecting a project.
- New libraries should follow Nx naming and tags if the workspace uses them (check `nx.json` / `eslint.config`).

## Git / hygiene

- Do not commit secrets (Firebase keys, `.env` with real credentials). Use env patterns already in the repo.

## Testing and quality

- If the repo adds tests for a feature, follow the same runner and file naming as sibling specs.
- Run **build** (or **lint**) for touched projects before considering work done.
