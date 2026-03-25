# Tailwind and CSS

## Shared preset

- **Root file:** `tailwind.config.js` at the monorepo root.
- **App configs:** each app under `apps/<name>/tailwind.config.js` uses  
  `presets: [require('../../tailwind.config.js')]` (path depth matches location).
- **Extensions** (brand colors, `surface`, `teal`, custom `boxShadow`, animations) live in the **root** preset. App configs mainly set **`content`** and can add local `theme.extend` if truly app-specific.

## Critical rule: `content` globs and Module Federation

Tailwind only emits CSS for class names found in files matched by **`content`**.

- The **shell** bundles CSS for the host. Federated components run in the shell but their source lives under **`libs/...`**.
- If a library path is **missing** from the shell’s `content` array, **all utilities used in that library are purged** → UI looks unstyled (white page, default fonts).

**Whenever you add or change UI under a lib that the shell loads:**

1. Open `apps/shell/tailwind.config.js`.
2. Add a glob for that library, e.g.  
   `'../../libs/<domain>/<type>/src/**/*.{ts,tsx,js,jsx}'`.
3. Do the same for **any remote app** that is served standalone and imports that lib (e.g. `apps/auth/tailwind.config.js`).

Current examples to mirror: `libs/shared/ui`, `libs/auth/feature`, etc.

## App-level CSS

- Each app has `src/styles.css` with `@tailwind base/components/utilities`.
- **`body`** styles are per-app; avoid assuming the shell and remotes share one global stylesheet for federation. Prefer **layout wrappers** with explicit `min-h-screen` and background classes on the feature root.

## Styling conventions

- Use **semantic tokens** from the preset (`brand`, `surface`, `teal`, named shadows) rather than ad-hoc hex everywhere.
- Match existing patterns in the same feature (spacing, rounded corners, typography).
- **Do not** introduce a second CSS framework for the same UI without an explicit team decision.

## shadcn / shared UI

Shared primitives live under **`libs/shared/ui`** (per plan). New primitives should stay consistent with existing components and Tailwind usage there.
