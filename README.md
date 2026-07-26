# deskhub-app

The DeskHub web front end (Vue 3 + TypeScript + Vite). It renders the
authenticated employee experience; the first delivered feature is the SSO login
page (`/login`), which starts the corporate single-sign-on flow and shows
localized (EN/NL) login errors.

## Prerequisites

- Node.js `^22.18.0` or `>=24.12.0`
- npm 10+ (bundled with Node)

## Getting Started

```bash
npm ci
npm run dev
```

`npm run dev` starts Vite on `http://localhost:5173`. The app redirects `/` to
`/login`.

## Profiles / Environments

Vite selects an environment via its mode:

| Mode | Command | Purpose |
|------|---------|---------|
| development | `npm run dev` | Local dev server with HMR (default for `dev`). |
| production | `npm run build` | Type-checked, minified, budget-checked build into `dist/`. |

Environment variables are read from `.env` / `.env.local` files (Vite
convention). Only variables prefixed `VITE_` are exposed to client code.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_SSO_LOGIN_PATH` | No | `/auth/sso/login` | Backend path the "Sign in with SSO" button redirects to. The recorded return URL is appended as a `returnUrl` query parameter. |
| `VITE_API_BASE_URL` | No | `/api` | Base URL the booking API client (`src/api/client.ts`) prefixes onto every request (desk search, reserve, list, cancel). Point it at the `deskhub-api` origin when not served behind the same host. |

## Running Tests

```bash
npm test           # unit + component tests (Vitest, includes type-level tests)
npm run type-check # vue-tsc project type-check
npm run lint       # ESLint (zero warnings)
npm run build      # production build; postbuild enforces the JS bundle budget
```

Contract types under `src/types/contracts/` are generated from the materialized
contract snapshot in `.flowforge/contracts/` by `npm run generate:contracts`
(run automatically before `test`, `type-check`, and `build`). Do not hand-edit
them.
