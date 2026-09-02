# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev             # start dev server (localhost:3000)
npm run build            # production build
npm run lint              # eslint .

npm test                       # vitest, watch mode
npm run test:run               # vitest, single run (CI)
npm run test:ui                # vitest UI
npm test -- src/utils/__test__/portfolio.test.js   # run a single test file
npm test -- -t "test name"                          # run tests matching a name

npm run test:e2e               # playwright, against http://localhost:3000
npm run test:e2e:ui            # playwright UI mode
npm run test:e2e:prod          # playwright against the deployed prod URL
```

Playwright's `webServer` config auto-starts `npm run dev` if nothing is already listening on port 3000, so `test:e2e` works standalone.

## Architecture

This is the admin + public-facing frontend for a Django backend (base URL from `VITE_API_BASE_URL`, default `http://localhost:8000`). There is no backend code in this repo.

### Two parallel API layers

- **`src/services/api.js`** — the axios instance, auth interceptors, and the *public-site* data layer: plain `fetch*` functions plus `use*` React hooks (`usePortfolioItems`, `useCategories`, etc.) built on a shared internal `useFetch` polling helper. Used by public pages (`Index`, `Portfolio*` components).
- **`src/lib/api.js`** — the *admin* data layer. Re-wraps the same axios instance from `services/api.js` with a uniform `.then(handleResponse).catch(handleError)` pattern and a typed `ApiError`. Used by everything under `src/pages/admin/*`.

Both files ultimately share one axios instance (exported from `services/api.js`), so auth headers, the 401/403 interceptor, and the base URL are only configured once, in `services/api.js`. When adding a new backend endpoint, add it to whichever layer matches the caller (admin vs. public) rather than creating a third pattern.

### Auth

- `src/context/AuthContext.jsx` (provider) + `src/context/useAuth.js` (hook) + `src/context/createAuthContext.js` (context object split out to keep fast-refresh happy) implement token auth against `/api/auth/{login,logout,user}/`.
- Token is stored in `localStorage` under the key `family_member_token` and read independently by both the axios interceptor in `services/api.js` and `AuthContext`.
- On a 401/403 response, the axios interceptor clears the token and hard-redirects to `/login` (`window.location.href`), independent of React Router.
- `src/components/admin/ProtectedRoute.jsx` gates the `/admin/*` route subtree in `App.jsx`.

### Routing

Single `App.jsx` route tree (React Router v7, `BrowserRouter`): public routes (`/`, `/login`) plus a nested `/admin` layout route (`AdminLayout`) wrapped in `ProtectedRoute`, containing dashboard/portfolio/categories/services/business-info admin pages.

### UI components

`src/components/ui/*` are shadcn-generated Radix primitives (button, dialog, select, tabs, etc.) — treat these as generated/vendor code and extend via composition rather than editing internals where possible. Feature components (e.g. `src/components/Portfolio/*`, `src/components/admin/*`) sit above them and use `class-variance-authority` + `tailwind-merge`/`clsx` (via `src/lib/utils.js`'s `cn`) for variant styling. Path alias `@` → `src/`.

### Testing

- **Component/integration tests** live in an `__test__/` subfolder next to the code they cover (e.g. `src/components/Portfolio/__test__/BeforeAfterSlider.test.jsx`, `src/services/__test__/api.test.js`), picked up by the `include` glob in `vite.config.js`.
- MSW mocks all network calls in these tests: handlers in `src/test/handlers.js`, server setup in `src/test/server.js`/`src/test/setup.js` (`onUnhandledRequest: "error"` — any unmocked request fails the test). Add new handlers here when a component under test calls a new endpoint.
- `src/test/test-utils.jsx` re-exports Testing Library plus a `renderWithRouter` helper for components that need `react-router-dom` context.
- **E2E tests** live under `e2e/*.spec.js` (Playwright), separate from the Vitest include glob.
