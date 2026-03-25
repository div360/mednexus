# Boundaries — must not do

These rules prevent broken federation builds, missing styles, and architectural drift. **Treat them as hard constraints.**

## Architecture and MFE

1. **Do not** put heavy feature logic only inside `apps/<remote>/src` — belong in **`libs/<domain>/feature`** (or `data-access`) and import from thin app shells.
2. **Do not** add a new remote or change **`exposes` / `remotes`** without updating **shell** routes and verifying **dev server URLs** in Vite federation config.
3. **Do not** use **synchronous** imports for federated entry points in the shell — keep **`React.lazy`** + dynamic `import('remote/ExposeName')`** pattern unless the codebase explicitly migrates away.
4. **Do not** introduce a **second router root** inside remotes that fights the shell’s React Router without an agreed integration pattern (path sync, basename, etc.).

## Tailwind and styling

5. **Do not** forget to add **`libs/...` paths** to **`apps/shell/tailwind.config.js` `content`** (and standalone apps) when styling components used in federated UIs — **missing globs = purged classes = broken UI**.
6. **Do not** rely on **global `body` alone** for dark/light theming of federated pages; the **feature root** should set `min-h-screen` and background/text classes.
7. **Do not** scatter **one-off hex colors** across the codebase when an existing **preset token** exists — extend the root `tailwind.config.js` if a new semantic color is needed.

## Libraries and imports

8. **Do not** import app code **from** `libs` (no `libs` → `apps` dependencies).
9. **Do not** bypass **`@mednexus/*`** aliases with long relative paths across projects.
10. **Do not** duplicate **domain types** — **`@mednexus/shared/types`** is the shared contract unless the team explicitly splits domains.

## Product and scope

11. **Do not** reframe the product as a consumer social app or non-B2B healthcare context without explicit user direction.
12. **Do not** remove **auth protection** from shell routes that are documented as protected in **`implementation_plan.md`**.
13. **Do not** add **production PHI** or real patient data — demo/mock only.

## Process (for agents)

14. **Do not** “fix” unrelated files, rename packages, or upgrade major dependencies **without** the user asking.
15. **Do not** add large **markdown documentation trees** or **comment walls** unless requested; **`docs/ai-agent-context`** is the exception for agent guidance.
16. **Do not** assume **`implementation_plan.md` paths** (`packages/`) match the repo — **use `libs/`.**

## When unsure

- Re-read **`implementation_plan.md`** and **`docs/ai-agent-context/02-mfe-and-nx-structure.md`**.
- Grep for existing **`federation(`** and **`tailwind.config.js`** patterns before inventing new wiring.
