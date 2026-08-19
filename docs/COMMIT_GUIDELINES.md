# Commit Guidelines — E-Blotter

Conventional Commits for this repo. Read this before staging, committing, or
pushing. History before this file predates the convention; do not rewrite it,
just follow the rules from here forward.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

- Subject line: **imperative mood, lowercase, no trailing period, ≤ 72 chars.**
  "add municipal export", not "Added municipal export." or "adds".
- Blank line between subject, body, and footer.
- Body wraps at 72 chars. Explain **why**, not what the diff already shows.
- Scope is optional but expected whenever the change is confined to one area.

## Types

| type | use for |
|------|---------|
| `feat` | a new user-visible capability (new page, new report, new filter) |
| `fix` | a bug fix — wrong data, broken redirect, crash, bad validation |
| `refactor` | restructuring with no behavior change (extract service, rename) |
| `perf` | a change made specifically to speed something up |
| `style` | formatting, Tailwind class shuffling, whitespace — no logic change |
| `docs` | `CLAUDE.md`, `README.md`, this file, code comments only |
| `test` | adding or fixing tests under `tests/` |
| `build` | `composer.json`, `package.json`, `vite.config.js`, `tailwind.config.js` |
| `chore` | housekeeping that fits nothing else (gitignore, editorconfig) |
| `security` | hardening: authorization, validation, upload rules, mass-assignment |

`security` is not stock Conventional Commits, but this app has a public,
unauthenticated report surface — those changes are worth finding in the log.

## Scopes

Use the area of the app the change lives in:

| scope | covers |
|-------|--------|
| `blotter` | `BlotterController`, blotter repo/service, `Pages/Blotter` |
| `complainant` / `respondent` | the two related-party surfaces |
| `incident` | citizen incident reports, `IncidentController`, `api/incident-reports` |
| `dashboard` | `ConsoleController`, `Pages/Console.tsx`, charts and rollups |
| `auth` | Breeze controllers, `routes/auth.php`, registration, session |
| `roles` | `Is*` middleware, role redirects, sidebar `roleMenus` |
| `filament` | anything under `app/Filament` and the `/admin` panel |
| `map` | `MapController`, Leaflet / Google Maps pages |
| `report` | `ReportController`, exports, XLSX |
| `officials` | `OfficialController`, settings pages |
| `profile` | `ProfileController`, `Pages/Profile` |
| `public` | `/report/*`, `/contact-us`, `/faq`, `Welcome.tsx` |
| `ui` | shared layout, sidebar, header, theme tokens |
| `db` | migrations, seeders, factories |
| `deps` | dependency bumps |

If a change genuinely spans several scopes, drop the scope rather than
inventing a compound one: `refactor: move dashboard queries into repositories`.

## Body

Include a body whenever the change is not self-evident from the subject.
Required for `fix` and `security`:

```
fix(dashboard): compare PSGC codes as integers

barangay_code is stored as an integer, so a leading-zero code coming from
the request as a string never matched and the municipal rollup returned
zero rows for those barangays.
```

Reference the role or jurisdiction affected when a change is role-specific —
role behavior is the spine of this app and "which role broke" is the first
question anyone asks.

## Footer

- `BREAKING CHANGE: <what breaks and what to do>` — required for anything that
  changes the meaning of a coded column (`remarks`, `incident_type`), the role
  numbering, or an API response shape.
- Issue refs: `Refs #12`, `Closes #12`.

## One commit, one change

Split unrelated work. A migration plus a UI tweak plus a dependency bump is
three commits. If a single logical change spans PHP and TSX (a new field end to
end), that is still one commit.

## Pre-commit checklist

Run these before every commit — the build does not catch any of them:

1. `npx tsc --noEmit` — `npm run build` uses esbuild and does **not** type check.
2. `php artisan test` — but first confirm `phpunit.xml` still has the SQLite
   `DB_CONNECTION` / `DB_DATABASE` overrides **uncommented**. Running the suite
   with them commented out wipes the local MySQL dev database.
3. `git status` / `git diff --staged` — read what you are actually committing.

## Never commit

- `.env`, or any real credential. `.env.example` only, with placeholder values.
- `storage/app/antique-accounts.csv` or any generated credential dump.
- `phpunit.xml` with the SQLite overrides commented out.
- `.phpunit.result.cache`, `.DS_Store`, `node_modules/`, `vendor/`.
- Uploaded blotter images or any file containing real complainant/respondent
  names, addresses, or case details.
- Debug leftovers: `dd()`, `dump()`, `Log::info` tracing, `console.log`.

## Pushing

- Work lands on `master` (there is no develop branch).
- Never `push --force` to `master`.
- Push only after the pre-commit checklist passes on the final state of the
  branch, not just on the last commit.

## Examples

```
feat(blotter): add hearing schedule column to the entries table
fix(roles): stop IsRegion from bouncing regional users to /
security(public): validate incident report uploads by mime and size
refactor(dashboard): move monthly counts into BlotterRepository
perf(report): batch the barangay lookup in the XLSX export
db: add index on blotters.barangay_code
docs: document the coded remarks values
build(deps): bump vite to 5.4
```

Bad, and why:

- `later changes` — no type, no information.
- `Latest update` — same.
- `fix: fixed the bug` — says nothing; name the bug.
- `feat(blotter): Added new feature for the dashboard and fixed login.` — wrong
  mood, wrong scope, two changes in one commit, trailing period.
