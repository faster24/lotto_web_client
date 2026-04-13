# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run format       # Prettier check
npm run test         # Vitest (watch mode)
npm run test:coverage  # Vitest with coverage report
```

Run a single test file:

```bash
npx vitest run src/tests/app.smoke.test.tsx
```

## Environment Variables

Create a `.env` file to override defaults:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1   # default
VITE_AUTH_LIVE_ENABLED=true                       # use real login/register endpoints
VITE_BET_CREATE_LIVE_ENABLED=true                 # use real 2D bet creation endpoint
VITE_WALLET_LIVE_ENABLED=true                     # use real wallet bank-info endpoints (live by default)
VITE_BET_LIST_LIVE_ENABLED=true                   # use real /bets list endpoint (live by default)
VITE_TWOD_RESULTS_LIVE_ENABLED=true               # use real /two-d-results/last-5-days endpoint (live by default)
VITE_PAYOUT_LIVE_ENABLED=true                     # use real /bets/payout-history endpoint (live by default)
VITE_ACCEPTED_PAYMENTS_LIVE_ENABLED=true          # use real /bets/accepted-payments endpoint (live by default)
```

All endpoints default to live. Set any flag to `false` to fall back to mock mode.

## Architecture

### Tech Stack

- **React 19 + TypeScript**, Vite, React Router 7, Tailwind CSS 4, Vitest

### Entry Flow

`index.html` → `src/main.tsx` → `src/App.tsx` → `src/app/AppRouter.tsx`

The app renders inside a simulated mobile phone frame (`src/layouts/MobileFrameShell.tsx`) with a fixed bottom tab bar. All routes are wrapped in this shell.

### Routing (`src/app/`)

- `routeMap.ts` — single source of truth for all route definitions, organized by section (`auth`, `tabs`, `gambling`, `wallet-profile`, `user`, `bets`, `announcements`, etc.)
- `AppRouter.tsx` — maps sections/routeIds to page components via `resolveRouteElement()`. Unauthenticated users hitting protected routes are redirected to `/auth/login`.
- Three primary tabs: `/tabs/home`, `/tabs/bets`, `/tabs/setting`

### API Layer (`src/api/`)

- `client.ts` — all API calls live here. Each function checks env flags to decide mock vs. live. Mock responses use `mockData.ts` with a simulated delay.
- `types.ts` — all TypeScript interfaces (`User`, `Bet`, `BetCreateInput`, `AuthData`, `TwoDResult`, `ThreeDResult`, `OddSetting`, `Announcement`, `ApiResult<T>`, etc.)
- `mockData.ts` — static mock payloads for development

Adding a new live endpoint: add the env flag check pattern in `client.ts` matching the existing `AUTH_LIVE_ENABLED` / `BET_CREATE_LIVE_ENABLED` pattern.

### Styling (`src/styles/tw.ts`)

Shared Tailwind class strings (e.g. `apiCard`, `tabHeader`, `screenScroll`) are exported from this file and imported into components. This is the project's design token layer — prefer extending this file over inline one-off strings for structural/layout classes.

### Component Organization

- `src/components/primitives/` — low-level UI blocks (cards, shells, headers)
- `src/components/bets/` — bet creation wizard, switcher, list
- `src/components/setting/` — settings cards
- `src/app/tabs/` / `src/app/bets/` / etc. — page-level components (thin wrappers that compose the above)

### API Spec

`openapi.yaml` in the root documents the backend contract. Check it when adding or modifying live API integrations.
