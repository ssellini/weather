# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Weather Time Machine — a React app for visualizing and comparing historical weather data for any city, using the free Open-Meteo API (no API key needed). Bilingual (French/English), with dark/light mode.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start Vite dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run lint` — run ESLint across the project
- `npm run preview` — preview the production build locally

No test framework is configured.

## Architecture

**Stack:** React 19, Vite, Tailwind CSS v4 (via `@tailwindcss/vite` plugin), Recharts for charts, JSX (not TypeScript).

**Data flow:** City search → Open-Meteo Geocoding API → user selects city → weather data fetched in 3-year chunks from Open-Meteo Archive API → raw data processed into daily/monthly/yearly aggregates → rendered in charts and KPI cards.

### Key layers

- **`src/utils/api.js`** — API calls to Open-Meteo (geocoding + archive). Fetches weather data in parallel 3-year chunks with an in-memory `Map` cache. End date is capped to 5 days ago (archive API limitation).
- **`src/utils/dataProcessing.js`** — Transforms raw API responses into `processedDays`, `monthlyAverages`, `yearlyAverages`, and `overallStats` (including linear regression trend). This is the core data pipeline.
- **`src/hooks/useWeatherData.js`** — Orchestrates the full fetch→process pipeline, exposing loading/progress/error state.
- **`src/hooks/useGeocoding.js`** — Debounced city search (300ms) wrapping the geocoding API.
- **`src/hooks/useLocalStorage.js`** — Generic localStorage-backed state hook, used for persisting user preferences (dark mode, language, selected city, year range, recent cities).

### App modes

`App.jsx` has two modes toggled via `mode` state: **search** (single-city dashboard) and **comparison** (side-by-side two-city view via lazy-loaded `ComparisonView`). Several chart components are lazy-loaded with `React.lazy` + `Suspense`.

### Internationalization

Inline translation objects (`T = { fr: {...}, en: {...} }`) are defined per component — there is no i18n library. The `lang` prop is threaded through the component tree.

### Styling

Tailwind CSS v4 with `@import "tailwindcss"` in `src/index.css`. Custom fonts (Outfit, DM Sans, JetBrains Mono) loaded from Google Fonts. Custom CSS utilities in `index.css`: `.glass-card`, `.glow-border`, `.bg-mesh-dark`, `.animate-fade-in`, `.animate-float`. Dark mode uses the `dark` class on `<html>`.

### Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys to GitHub Pages on push to `main`. Vite `base` is set to `/weather/`.

## ESLint

Uses flat config (`eslint.config.js`). `no-unused-vars` ignores variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`). React Hooks and React Refresh plugins are enabled.
