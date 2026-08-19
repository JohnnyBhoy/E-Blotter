# E-Blotter

Online blotter (incident record) reporting system for Philippine barangays and
the PNP chain of command. Barangay officials encode blotter entries; those
entries roll up through the municipal/station, provincial, and regional levels,
with a super admin over everything. The public side lets citizens file crime,
fire, accident, and general incident reports without an account.

## Stack

- Laravel 11.9 / PHP 8.2, MySQL (XAMPP locally)
- Inertia.js v1 + React 18.2 + TypeScript, Vite 5
- Tailwind CSS 3.2 (TailAdmin-derived component set under `Components/components/`)
- Laravel Breeze for auth scaffolding
- ApexCharts, Leaflet / Google Maps, SweetAlert2, XLSX, Zustand

```bash
composer install && npm install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed
php artisan serve     # :8000
npm run dev           # vite
```

## Role hierarchy

`users.role` is a tinyInteger, default `2`. This is the spine of the app —
almost every query and redirect branches on it.

| role | level | middleware | dashboard route | jurisdiction |
|------|-------|-----------|-----------------|--------------|
| 1 | Super admin | `IsAdmin` | `/admin-dashboard` (`admin.dashboard`) | every region |
| 2 | Barangay | `IsBarangay` | `/dashboard` (`dashboard`) | its own entries |
| 3 | Municipal / PNP station | `IsStation` | `/municipal-dashboard` (`municipal.dashboard`) | barangays of its `city_code` |
| 4 | Provincial | `IsProvince` | `/province-dashboard` (`province.dashboard`) | cities of its `province_code` |
| 5 | Regional | `IsRegion` | `/region-dashboard` (`region.dashboard`) | provinces of its `region_code` |

All five routes point at the same action — `ConsoleController@dashboard` — and render
the same Inertia page, `Pages/Console.tsx`. There is no per-role dashboard
controller or page any more; `MunicipalController` and `RegionController` are gone,
and `AdminController`/`ProvinceController` keep only their city/barangay lookups.

Three places must stay in sync when roles change:

1. `routes/web.php` — the `/` route redirects a logged-in user to their dashboard.
2. `AuthenticatedSessionController::store()` — post-login redirect.
3. `resources/js/Components/components/Sidebar/index.tsx` — `roleMenus` builds
   the nav per role. A menu entry pointing at another role's route is a dead
   link, because the `Is*` middleware bounces the user back to `/`.

Only role 2 (barangay) creates blotter entries. Roles 3–5 and 1 are read/rollup
views over barangay data. Write permissions live on the jurisdiction, and
`BlotterController` enforces them before it validates anything:

| | encode | correct | remove |
|---|---|---|---|
| barangay | yes | yes | no — escalated to the municipal admin |
| station / province / super admin | no | yes | yes |
| region | no | no | no — read-only |

### Jurisdiction scoping

There is no team/tenant column on `blotters` — an entry belongs to the barangay
account that encoded it. Scope is derived by joining `user_addresses`, which holds
the PSGC codes for each user:

```
user_addresses: user_id, barangay_code, city_code, province_code, region_code
```

**`App\Support\Jurisdiction` is the one place that resolves it.** `forUser($user)`
returns the viewer's level plus the barangay account IDs it covers (null = every
barangay, for the super admin); `apply($query, 'b.user_id')` narrows a query to it
and `applyArea()` narrows to one unit below. It restricts to role 2 accounts on
purpose: a station, province and region all share `city_code` with the barangays
under them, so an unfiltered pluck would count the offices as reporting units.

`users.parent_id` records the same tree as a literal relation — barangay to its
station, station to its province, province to the super admin — walkable via
`User::parent()` / `children()`. It is descriptive only: **scoping still reads the
PSGC codes**, so never swap `Jurisdiction` for a `parent_id` walk, and keep both in
step when provisioning an account. Not mass assignable, like `is_admin`.

**When adding any new listing or count query, take a `Jurisdiction` and call
`apply()`.** Forgetting the scope leaks another jurisdiction's blotter records. The
console query methods on `BlotterRepository` (`getCountsByRemark`,
`getCountsByIncidentType`, `getCountInRange`, `getRecentForDashboard`,
`getPurokBreakdown`, `getAreaBreakdown`, `getPeopleCounts`,
`getYearlyBlotterByMonth`, `getDailyBlotterByMonth`) all take one as their first
argument for exactly this reason. `BlotterRepository::scopeByRole()` and
`BlotterController::isWithinJurisdiction()` are the older equivalents on the
standalone listing/single-entry paths.

An account below national level with no `user_addresses` row has no jurisdiction:
it must see **nothing**, never everything. `Jurisdiction` returns an empty barangay
list for it, and there is a test for that.

`UserAddress` has both `id` (its own PK) and `user_id`. Query by `user_id` —
mixing the two silently returns the wrong jurisdiction.

### The console

One page, five levels: `Pages/Console.tsx` under `Layouts/ConsoleLayout` with
`Components/Console/*`. Same layout, controls and table for everyone; what
changes comes from the `console` prop, which is `Jurisdiction::toArray()`:

- `level` / `levelLabel` — how wide the scope is
- `childLabel` / `childLabelPlural` — what the area breakdown groups by, one
  level down: Purok → Barangay → City/Municipality → Province → Region
- `canEncode` / `canEdit` / `canDelete` — the table only offers what the server
  will accept

So `dashboard.byArea` is puroks for a barangay and PSGC-coded units above it, the
table gains a "Barangay" column in place of "Purok" above barangay level, and
`filters.purok` (a name) becomes `filters.area` (a code). The `Barangays
Reporting` stat card counts units that filed inside the range.

PSGC names are **not** in the database — they live in `utils/data/{regions,
provinces,cities,barangays}.ts`. The server sends codes; `utils/functions/getAreaName`
resolves the label. Codes are stored as integers, so compare them as integers.

The console never navigates away from itself: the header items open panels or
narrow the table, and `/blotter/record`, `/blotter/update`, `/blotter/monthly` and
`/blotter/daily` sit in the shared signed-in route group because every level's
console uses them. Access there is decided per entry, not per route.

### Seeders

- `SuperAdminSeeder` — the role 1 account, which the app cannot create for itself
  (registration hardcodes barangay). Reads `SUPER_ADMIN_EMAIL`/`_NAME`/`_PASSWORD`,
  defaults to `superadmin@eblotter.gov.ph` / `ChangeMe@123`. Idempotent, and it
  only resets an existing password when `SUPER_ADMIN_PASSWORD` is set.
  `DatabaseSeeder` calls this and nothing else.
- `DemoAccountsSeeder` (opt-in: `php artisan db:seed --class=DemoAccountsSeeder`)
  — one login per level, password `Password@123`, plus five barangays spread over
  two regions so each level's rollup differs: barangay 25 entries, station 35,
  province 43, region 52, super admin 59.
- `AntiqueProvinceSeeder` (opt-in: `php artisan db:seed --class=AntiqueProvinceSeeder`)
  — the pilot's real account tree: 1 provincial office, 18 municipal stations and
  590 barangay logins for Antique, hung off the super admin. Names and PSGC codes
  come from `database/data/antique-psgc.json`, generated from the same dataset the
  UI dropdowns read, so every seeded code resolves to a real entry. Emails are
  `<barangay>.<municipality>@antique.eblotter.gov.ph` and `<municipality>@...`;
  password defaults to `Antique@2026` for all of them. Tune with
  `ANTIQUE_SEED_EMAIL_DOMAIN`, `ANTIQUE_SEED_PASSWORD`,
  `ANTIQUE_SEED_RANDOM_PASSWORDS`, `ANTIQUE_SEED_RESET_PASSWORDS`. Every
  credential it sets is written to `storage/app/antique-accounts.csv` (gitignored,
  mode 0600) — that file is the handout list. Idempotent on email; a first run
  takes ~8 min because of bcrypt at 12 rounds, re-runs are seconds.

## Layout

```
app/
  Http/Controllers/     ConsoleController (the console, every role) + Blotter,
                        Report, Incident, Map, Official, User, Admin, Province
  Http/Middleware/Is*.php   role gates
  Models/               Blotter, Complainant, Respondent, Incident,
                        IncidentReport, ContactUs, User, UserAddress
  Repositories/         all query building lives here
  Services/             thin pass-through from controller to repository
  Support/Jurisdiction.php  who may see which blotters
resources/js/
  Pages/Console.tsx     the one console every signed-in level works out of
  Pages/                other Inertia pages (Barangay/, Blotter/, Report/, ...)
  Components/Console/   console header, table, charts and panels
  Components/components/  TailAdmin UI kit (Sidebar, Header, Charts, Tables)
  Layouts/ConsoleLayout.tsx         header-only shell for the console
  Layouts/AuthenticatedLayout.tsx   sidebar + header shell for the other pages
  utils/data/           static PSGC + reference lookups (barangays, cities, ...)
  utils/functions/      getUserRole, getAreaName, getIncidentType, ...
```

Controller → Service → Repository is the convention. Services add no logic;
put query changes in the repository.

## Domain data

A blotter entry is one `blotters` row plus one-to-many `complainants` and
`respondents`, joined on `blotter_id`. `entry_number` is a per-barangay
counter (`BlotterController::index` computes the next one) — it is **not**
unique across barangays, so never join on it.

Coded columns (see `resources/js/utils/data/` and `utils/functions/getRemark.ts`):

- `blotters.remarks` — case disposition: 1 for hearing, 2 amicably settled,
  3 pending, 4 referred to PNP, 5+ others
- `blotters.incident_type` — see `utils/data/incidentTypes.ts`
- `incidents` / `incident_reports` — public-facing citizen reports, separate
  from barangay blotters

PSGC codes (`barangay_code`, `city_code`, `province_code`, `region_code`) are
stored as integers, so leading zeros are lost. Compare them as integers.

## Public / unauthenticated surface

`/report/{crime,fire,incident,accident}`, `/online-incident-report`,
`/contact-us`, `/faq` and the `api/incident-reports` resource are reachable
without a session. Everything written there is attacker-controlled: validate
explicitly and never mass-assign `$request->all()` or a raw `data` blob.

`role` must never be accepted from request input — registration hardcodes
barangay (role 2). Elevated accounts are provisioned out of band.

## Conventions

- File uploads: validate with the `image`/`mimes` rules, generate the filename
  server-side (never `getClientOriginalExtension()` alone), and don't use bare
  `time()` as a name — it collides across concurrent uploads.
- Repository methods are typed `Int $x` / `String $x`. Passing `null` or `""`
  from `$request->get(...)` throws a `TypeError`; coerce at the controller.
- The test suite runs on SQLite (`phpunit.xml`), production on MySQL. MySQL-only
  SQL fails there: `MONTH()` in a `groupBy` is why
  `BlotterRepository::monthExpression()` exists. `whereYear()`/`whereMonth()` are
  grammar-aware and portable; raw date functions are not.
- Controllers return `Inertia::render(...)`. Returning JSON from a page route
  breaks the Inertia client — redirect back with an error instead.
- `tsconfig.json` uses `jsx: "react-jsx"` (automatic runtime), matching
  `@vitejs/plugin-react`. No `import React` needed for JSX.
- `npm run build` uses esbuild and does **not** type check. Run
  `npx tsc --noEmit` separately before committing.

## Commits

Before staging, committing, or pushing, follow `docs/COMMIT_GUIDELINES.md` —
Conventional Commits, the scope list for this app, the pre-commit checklist
(`npx tsc --noEmit`, the `phpunit.xml` SQLite-override check), and the
never-commit list.
