# Agent Notes

## Rules

- The game server (`server.ts`) copies `FAMOUS_OFFICERS` / `FAMOUS_RELATIONSHIPS` into module state when the process starts, so edits to `src/data.ts` do not reach `/api/officers` until the running `tsx server.ts` process is restarted. Why: without a restart the preview keeps showing the old roster and new officers look like they were never added.
- Officer portraits are plain string paths under `public/portraits/` (e.g. `'/portraits/macron.jpg'`), not ES6 image imports. Why: `server.ts` bundles `src/data.ts` with esbuild, and imported `.jpg` files break that bundle without an extra loader.
- Global trade uses the tactical map's existing session gold and city grain stores, with quotes and validation in a pure trade utility. Why: commerce and military provisioning must read the same resources without adding separate balances.
- New trade controls use the shared Button and semantic global CSS trade tokens. Why: keep control states and theming consistent.
- Country debts are independent faction-keyed session balances owned by TacticalMap; borrowing and repayment share its gold wallet and use a pure validated debt utility. Why: debt must stay country-specific while funding the existing game economy.
