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

## Commits and Pull Requests

Split independent concerns into multiple atomic commits when appropriate; do not combine unrelated changes just to reduce the commit count. Use short Conventional Commit-style subjects such as `feat:`, `fix:`, `docs:`, or `chore:` (imperative and specific). Branch from `develop`, keep each commit focused, and target pull requests at `develop`. Describe the behavior and validation performed, link the relevant issue, and include screenshots or a short recording for UI changes. Do not commit credentials, generated dependencies, or throwaway bench scripts.
