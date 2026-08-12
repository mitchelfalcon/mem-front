# MEM Healthcare

Frontend (Vite + React + TypeScript + Tailwind) for the **MEM Healthcare** console — an immersive Salesforce-style dashboard with Presentation, Home, Mapas and Estadísticas pages.

## Requirements

- Node.js **22.x**

## Local development

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:3000.

## Scripts

- `npm run dev` — start the Vite dev server (port 3000).
- `npm run build` — production build into `dist/`.
- `npm start` — serve the built `dist/` with the Express server (`server.js`) on `$PORT` (defaults to 3000).
- `npm run lint` — type-check with `tsc --noEmit`.

## Deploy to Heroku (Node.js buildpack)

The app builds to a static SPA and is served by a tiny Express server.

- `Procfile` → `web: node server.js`
- `engines.node` → `22.x`
- Heroku runs `npm ci` → `npm run heroku-postbuild` (`vite build`) → `npm start`.

```bash
heroku create <app-name>          # or use an existing app / your active dynos
git push heroku HEAD:main         # deploy the current branch to Heroku's main
# or connect the GitHub repo in the Heroku dashboard and deploy this branch
```

If npm peer-dependency resolution is strict on your Heroku app, set:

```bash
heroku config:set NPM_CONFIG_LEGACY_PEER_DEPS=true
```

### Environment variables

Copy `.env.example` and provide values as needed. Do **not** commit real secrets — set them with `heroku config:set` (e.g. Salesforce / Data Cloud credentials for a Heroku Connected App). Redacted example keys live in `.env.example`.

## Notes

- `src/assets/mem-console-bg.png` (behind-video background) and `src/assets/avatar.png` (mascot) are generated stand-ins; replace them with the exact design assets when available.
- Background videos are embedded from Vimeo; playback requires outbound network access.
