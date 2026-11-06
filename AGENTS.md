# Agent Notes

## Rules

- The game server (`server.ts`) copies `FAMOUS_OFFICERS` / `FAMOUS_RELATIONSHIPS` into module state when the process starts, so edits to `src/data.ts` do not reach `/api/officers` until the running `tsx server.ts` process is restarted. Why: without a restart the preview keeps showing the old roster and new officers look like they were never added.
- Officer portraits are plain string paths under `public/portraits/` (e.g. `'/portraits/macron.jpg'`), not ES6 image imports. Why: `server.ts` bundles `src/data.ts` with esbuild, and imported `.jpg` files break that bundle without an extra loader.
