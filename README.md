# Loan Amortization Calculator (ITP)

A React + TypeScript + Vite app that computes and visualizes a loan amortization schedule, with CSV/PDF exports, sharable links, E2E and unit tests, CI, Lighthouse budgets, and optional analytics/observability.

Features
- Vite + React + TypeScript + Tailwind
- Amortization engine using decimal.js (HALF_UP)
- LoanInputForm with validation, masks/formatters, and debounced compute
- ResultsPanel (monthly payment, totals, payoff date)
- Virtualized AmortizationTable (600+ rows) with sticky header
- ChartsPanel (balance line + principal vs interest composition)
- CSV and PDF exports (jsPDF + autotable)
- Copy Link (query params encode/decode) and URL state sync
- Accessibility: labels, aria-live, keyboard nav, contrast
- Unit tests (Vitest) and E2E (Playwright) in CI
- Lighthouse budgets in CI
- Optional: PWA (vite-plugin-pwa), Plausible analytics, Sentry

Getting started
1) Prereqs: Node 18+ and npm 9+
2) Install deps
   npm install
3) Run in dev
   npm run dev
4) Run unit tests
   npm test
5) Run E2E tests (requires dev server on 5173)
   npm run test:e2e

Build and preview
- Build: npm run build
- Preview: npm run preview (serves dist/ at http://localhost:4173)

Environment variables (.env.local)
- VITE_SENTRY_DSN=
- VITE_PLAUSIBLE_DOMAIN=your-domain.com

Exports
- CSV: creates loan-amortization-YYYYMMDD.csv with RFC4180 quoting and '.' decimal separator
- PDF: multi-page with header/footer and summary

CI
- On PR: typecheck, lint, unit test, build, Playwright E2E, Lighthouse (desktop)
- On main: same plus optional deploy to Netlify/Vercel if secrets are configured

Deploy (optional)
- Netlify: add netlify.toml; set NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID secrets
- Vercel: set VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID secrets

PWA
- Installable, offline shell via Workbox (vite-plugin-pwa)

Analytics/Observability (optional)
- Plausible via VITE_PLAUSIBLE_DOMAIN
- Sentry via VITE_SENTRY_DSN with source maps upload step to be configured in hosting CI

License
MIT
