# Exercise 3 working notes

## How to run both versions

From the project folder in PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
```

- Original vanilla/TypeScript app: `http://localhost:5173/`
- React migration: `http://localhost:5173/react.html`

For the production check:

```powershell
npm.cmd run build
npm.cmd run preview
```

Open the preview URLs shown in the terminal and test **both** `/` and `/react.html`.

## What changed, in order

1. **Demos 1–4, analysis:** [analysis.md](analysis.md) records the historical timeline, SSR/CSR comparison, original virtual-DOM example and current SPA state/routing. No application code is needed for these demos. The Wikipedia SSR observation should still be checked live in the presenter’s own browser.
2. **Demo 5, tiny JSX component:** `react/StaticExample.tsx` returns one fixed paragraph with no state or props. The React shell renders it under the brand name.
3. **Demo 6, entry point and coexistence:** installed `react`, `react-dom`, TypeScript type packages and `@vitejs/plugin-react`; added `vite.config.ts`, `react.html`, `react/main.tsx`, `react/App.tsx`. The new root is `#react-root`. The existing `index.html` and `js/main.ts` remain untouched. Vite builds both HTML entry points. Commit `5154900`.
4. **Demos 7–8, architecture:** [architecture.md](architecture.md) diagrams the full app, names data/props and records the SPA/React decision and trade-offs.
5. **Demo 9, shell:** `App` now renders header, branding, five hash-route buttons, active state, fallback Dashboard, stubs for four views and footer. Browser Back works because hashes become history entries. Commit `4a45df9`.
6. **Demo 10, Dashboard:** `DashboardPage` and smaller components render the case summary, five stat cards, review progress and recent evidence/timeline from the existing JSON loaders. Data lives in `App` state so it survives switching between React views. Bookmark count reads the same `localStorage` key as the vanilla app and updates on cross-tab changes. Commit `b4e7109`.

The local, pre-existing one-line edit in `js/storage.ts` was deliberately not included in these commits. The untracked `EXERCISE_2.md` was also not added.

## Checks already run

- `npm.cmd run build`: passes, output contains both `dist/index.html` and `dist/react.html`.
- `npm.cmd run lint`: passes for `js`, `react` and `vite.config.ts`.
- `npm.cmd run format:check`: passes.
- Preview `/`: original Dashboard still shows 18 evidence, 6 people, 6 locations and 6% review progress.
- Preview `/react.html`: React Dashboard shows the same numbers and recent lists; no browser console errors.
- React navigation to all stub views, Browser Back and an unknown hash: Dashboard fallback works.
- Test bookmark toggled in the original app, React count changed 0 → 1 → 0; the test bookmark was removed again.

## Important presentation boundary

Only the Dashboard and shell are migrated to React in Exercise 3. The other four React views are **stubs**; the complete working versions remain at `/`. This matches the assignment’s explicit migration scope. Do not claim the whole app is React yet.
