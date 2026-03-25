# MFE and Nx structure

## Monorepo layout (actual paths)

```
mednexus/
├── apps/
│   ├── shell/          # Host — port 3000
│   ├── auth/           # Remote — port 3001
│   ├── dashboard/      # Remote — port 3002
│   ├── analytics/      # Remote — port 3003
│   └── patients/       # Remote — port 3004
├── libs/
│   ├── shared/         # types, firebase, ui, data-access, utils
│   ├── auth/           # feature + data-access
│   ├── dashboard/      # feature
│   ├── analytics/      # feature
│   └── patients/       # feature + data-access
├── tailwind.config.js  # Shared preset (colors, shadows, fonts) — consumed by apps
└── implementation_plan.md
```

> The plan file sometimes says `packages/`; **this repo uses `libs/`** — always follow the filesystem.

## Ports

| App       | Port |
|-----------|------|
| shell     | 3000 |
| auth      | 3001 |
| dashboard | 3002 |
| analytics | 3003 |
| patients  | 3004 |

Dev: `pnpm dev` — builds remotes, then runs `watch:remotes`, `preview:remotes` (ports 3001–3004), and `nx serve shell` (3000). **Remotes must be built + preview** so `remoteEntry.js` exists under `/assets/`; `@originjs/vite-plugin-federation` does not fully support `vite serve` alone on remotes (see plugin README “Vite dev mode”).

## Shell responsibilities

- **React Router** for top-level routes.
- **`React.lazy` + `import()`** for federated modules (e.g. `import('auth/AuthPage')`).
- **Auth guard** (`RequireAuth`) redirecting unauthenticated users to `/login`.
- **Passing props** into remotes when needed (e.g. `onLoginSuccess` with `navigate`).

## Remote responsibilities

Each remote **exposes** a small entry file (typically `src/app/app.tsx`) under a stable name. Examples (verify in each `vite.config.mts`):

| Remote    | Exposed path        | Consumed in shell as        |
|-----------|---------------------|-----------------------------|
| auth      | `./AuthPage`        | `auth/AuthPage`             |
| dashboard | `./DashboardPage`   | `dashboard/DashboardPage`   |
| analytics | `./AnalyticsPage`   | `analytics/AnalyticsPage`   |
| patients  | `./PatientsPage`    | `patients/PatientsPage`     |

Remote `app.tsx` files should **only mount** domain UI from **`libs/<domain>/feature`** (and wire props), not duplicate large feature implementations.

## Nx libraries

- **`feature`** — React screens, forms, domain UI.
- **`data-access`** — Zustand stores, data hooks, mock APIs aligned with that domain.
- **`shared/*`** — cross-cutting utilities; **no domain-specific business rules** in `shared/types` beyond generic models.

## TypeScript path aliases

Defined in **`tsconfig.base.json`** under `paths` (e.g. `@mednexus/auth/feature`, `@mednexus/shared/types`). **Always import via these aliases**, not deep relative paths across library boundaries.

## React Router inside remotes (important)

In **development**, federated remotes can still bundle their own copy of **`react-router-dom`**. Hooks like **`useNavigate()`** then run against the wrong React context and throw: *“useNavigate() may be used only in the context of a Router”*.

**Pattern:** obtain **`navigate` in the shell** (inside `BrowserRouter`) and pass it into the remote as a prop (e.g. `hostNavigate`), same as `onLoginSuccess` for auth. The remote’s exposed root component should render feature UI with that function **without** calling router hooks when the prop is supplied.

Standalone remote dev (`nx serve dashboard`) keeps **`BrowserRouter`** in `main.tsx` and can use **`useNavigate`** only inside a child component that always runs under that router.

## Adding a new federated surface

1. Add/adjust **`exposes`** in the remote’s Vite federation config.
2. Add **`remotes`** entry + **`React.lazy`** route in **shell** `app.tsx`.
3. Extend **Tailwind `content`** in **shell** (and any standalone app) to include **every `libs/...` path** that contains classes used by that UI (see `03-tailwind-and-css.md`).
