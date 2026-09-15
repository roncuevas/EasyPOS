# Repository Guidelines

## Project Structure

Easy POS is a Frappe app with a React frontend. Backend API methods and Frappe doctypes live in `easy_pos/api/` and `easy_pos/easy_pos/doctype/`; schema/data patches are in `easy_pos/patches/`. The Vite/React application is under `posapp/src/`, organized into `pages/`, feature `components/`, thin Frappe API wrappers in `api/`, Zustand stores in `store/`, and shared styling in `theme/`. Built frontend output is copied into `easy_pos/public/posapp/`. Backend tests are colocated as `test_*.py`; planning and design notes are in `docs/`.

## Build, Test, and Development

Run frontend commands from `posapp/`:

```bash
yarn install          # install frontend dependencies
yarn dev              # start the Vite development server
yarn build            # build assets and copy the Frappe HTML entrypoint
yarn lint             # lint all JavaScript/JSX
```

For backend tests, use an installed Frappe bench and site:

```bash
bench --site <site> run-tests --app easy_pos
```

The CI workflow runs the complete suite on Frappe/ERPNext v15. Run a focused investigation with `bench --site <site> execute <module>.<function>` rather than committing temporary scripts.

## Coding Style and Naming

Python targets 3.10+, uses Ruff with a 110-character line limit, double quotes, and tabs for formatting. Use `snake_case` for Python modules/functions and Frappe whitelisted methods. React uses JavaScript/JSX, ESLint 9, Prettier, and `PascalCase` components with `camelCase` functions and variables. Keep frontend Frappe calls in `posapp/src/api/`, reuse shared components in `components/common/`, and use theme CSS tokens instead of hardcoded colors or spacing.

## Testing and Validation

Name backend tests `test_*.py` and test classes with Frappe’s `FrappeTestCase`. Run `yarn lint` after frontend edits and the relevant bench test command after backend changes. Before submitting, run `pre-commit run --all-files`; CI also checks Frappe Semgrep rules and dependency vulnerabilities with `pip-audit`.

## Detailed Easy POS Rules

These rules are ported from `CLAUDE.md` and apply to all Easy POS work:

- Use React 19, Vite 7, React Router 7, Zustand 5, Bootstrap 5, and Bootstrap Icons. Do not introduce Redux, Context, Tailwind, or MUI for the POS frontend.
- Keep Frappe calls in `posapp/src/api/`; components must use thin API wrappers and existing Zustand stores (`authStore`, `cartStore`, and `posSessionStore`).
- Reuse primitives from `posapp/src/components/common/` for fields, forms, modals, tables, errors, loading, and save actions. Use the shared `Modal` and `ConfirmModal` instead of hand-rolled modal markup.
- Use `theme/tokens.css` and `components.css`. Prefer `var(--color-*)`, `var(--font-*)`, `var(--radius-*)`, and layout tokens over literal colors, spacing, typography, or radii. Validate new selected states in both light and dark mode.
- Preserve ERPNext as the source of truth. Payment modes come from the POS Profile `payments` child table, shift totals are scoped by `custom_ep_opening_entry`, and closing behavior is configured per payment mode.
- Use Frappe ORM or Query Builder instead of raw SQL. New document writes must follow existing `frappe.client.insert` API patterns.
- Keep held sales as Draft Sales Invoices. Returns must preserve `is_pos`, `pos_profile`, and `custom_ep_opening_entry`; use shared confirmation patterns for destructive actions.
- Treat `SyncPage` as a UI placeholder only. Do not build features against fake sync data; API responses must remain uncached because authentication is cookie-based and terminals may be shared.
- Keep PWA behavior limited to static asset caching. Never precache API responses, and preserve the custom service-worker endpoint/scope arrangement.
- Barcode hardware and camera scans must feed the same `searchText` flow. Customer display uses the existing BroadcastChannel design and must not be treated as cross-device transport.
- For UI fixes reported with a screenshot, measure rendered boxes with `getBoundingClientRect()` through browser tooling before finalizing the correction; do not rely only on visual inspection.
- After frontend edits run `yarn lint`; after build-sensitive edits run `yarn build`. Run relevant bench tests and `pre-commit run --all-files` before submission when available.
- Keep changes atomic, use Conventional Commit subjects, inspect Git state before committing, and report exact branch/ahead-behind/push status. Do not commit secrets or generated dependencies.

## Commits and Pull Requests

Split independent concerns into multiple atomic commits when appropriate; do not combine unrelated changes just to reduce the commit count. Use short Conventional Commit-style subjects such as `feat:`, `fix:`, `docs:`, or `chore:` (imperative and specific). Branch from `develop`, keep each commit focused, and target pull requests at `develop`. Describe the behavior and validation performed, link the relevant issue, and include screenshots or a short recording for UI changes. Do not commit credentials, generated dependencies, or throwaway bench scripts.
