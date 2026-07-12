# EcoSphere — ESG Management Platform

Odoo-style hackathon project: an ERP that tracks a company's Environmental impact (carbon emissions), Social responsibility (CSR, engagement), and Governance (policies, audits, compliance), computes ESG scores per department + company-wide, and drives participation through Gamification (XP, badges, rewards, leaderboards). Full spec: `attached_assets/Pasted-This-problem-statement-looks-huge-but-it-is-actually-ju_1783841295879.txt`.

## Repo map

```
artifacts/
  ecosphere/            React 19 + Vite frontend (the app)
    src/
      app/              Router (App.tsx), layout (AppLayout.tsx), not-found
      components/ui/    Shared generic components (shadcn/ui)
      components/shared/ Domain-shared components (empty for now — put
                        StatusBadge/ScoreCard/FilterBar style components here)
      modules/          One folder per ESG module, mirrors backend routes:
        dashboard/      Dashboard.tsx + data.ts
        environmental/  Environmental.tsx + data.ts (emission factors, carbon, goals)
        social/         Social.tsx + data.ts (CSR, participation)
        governance/     Governance.tsx + data.ts (policies, audits, compliance)
        gamification/   Gamification.tsx + data.ts (REAL API — challenges,
                        badges, rewards, leaderboard)
        reports/        Reports.tsx + data.ts
        settings/       Settings.tsx + data.ts (departments, config)
      lib/
        api.ts          Single fetch wrapper for /api/* (baseURL, error handling)
        types.ts        Shared TS types matching the spec data model
        mock/           Mock data split per module (dashboard.ts, environmental.ts,
                        social.ts, governance.ts, gamification.ts, settings.ts)
        utils.ts        cn() etc.
      hooks/            Shared hooks (use-toast, use-mobile)
  api-server/           Express 5 backend, bundled with esbuild
    src/
      index.ts          Bootstrap (reads PORT, starts app)
      app.ts            Express app: middleware + mounts /api router
      middleware/       request-logger, error-handler, validate helper
      routes/           One router per module: environmental.ts, social.ts,
                        governance.ts, gamification.ts, reports.ts, settings.ts
                        (+ health.ts). Mounted at /api/<name>.
      services/         One file per module; business logic lives here, routes
                        stay thin (gamification.ts has xpBalance/evaluateBadges)
      db/               Re-exports the drizzle client + schema from lib/db
  mockup-sandbox/       Static design mockups (ESG dashboard variants). Not the app.
lib/
  db/                   Drizzle ORM + Postgres. Schema: src/schema/index.ts →
                        gamification.ts (real tables) + esg-skeletons.ts
                        (commented skeletons for the other modules).
                        `pnpm --filter @workspace/db run push` to migrate.
  api-spec/             OpenAPI spec + Orval codegen (largely unused so far).
  api-zod/              Zod schemas generated/shared for the API.
  api-client-react/     Generated react-query hooks (largely unused so far).
scripts/                One-off TS scripts run with tsx (seed scripts live here).
attached_assets/        Problem statement + reference image.
```

**Naming convention:** frontend `modules/<name>` ↔ backend `routes/<name>.ts` ↔
`services/<name>.ts` ↔ (future) DB tables in `lib/db/src/schema/`. Each frontend
module's `data.ts` is the ONE place that switches that module from mock to real
API; pages import only from their own module folder + shared (`components/`,
`lib/`, `hooks/`).

## Stack

pnpm workspaces (use pnpm, never npm), Node 24, TypeScript 5.9, Express 5, PostgreSQL + Drizzle ORM, Zod v4 (`zod/v4`), React 19, Vite, Tailwind v4, shadcn/ui, TanStack Query, wouter (routing), framer-motion, recharts.

## Run commands

```sh
# Postgres (Docker):
docker start ecosphere-pg  # or first time:
docker run -d --name ecosphere-pg -p 5433:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ecosphere postgres:16

export DATABASE_URL=postgres://postgres:postgres@localhost:5433/ecosphere

pnpm --filter @workspace/db run push          # apply schema (drizzle-kit push)
pnpm --filter @workspace/scripts run seed     # seed demo data
PORT=5000 pnpm --filter @workspace/api-server run dev            # backend :5000
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/ecosphere run dev # frontend :5173
pnpm run typecheck                            # full typecheck
```

Frontend dev server proxies `/api` → `http://localhost:5000` (see `vite.config.ts`).

## Current state: mock vs real (per module)

| Module        | Frontend data source                    | Backend                       |
|---------------|-----------------------------------------|-------------------------------|
| gamification  | **REAL** — `/api/gamification/*`        | Full CRUD + lifecycle + ledger|
| dashboard     | mock (`lib/mock` via module `data.ts`)  | none                          |
| environmental | mock                                    | stub `GET /api/environmental` |
| social        | mock                                    | stub `GET /api/social`        |
| governance    | mock                                    | stub `GET /api/governance`    |
| reports       | static JSX                              | stub `GET /api/reports`       |
| settings      | mock                                    | stub `GET /api/settings`      |

- `/api/healthz` for health. Stub routes return `{ module, status: "stub" }`.
- DB: gamification tables are real; all other modules exist only as commented
  skeletons in `lib/db/src/schema/esg-skeletons.ts`.

## Data model (from spec)

**Master data** (rarely changes; admin-managed): Departments, Employees, Emission Factors (Diesel 2.68, Petrol 2.31, Electricity 0.82 kg CO₂/unit), Policies, Badges, Rewards.

**Transactional data** (daily records): Carbon Transactions (qty × emission factor = kg CO₂), CSR Activities + Participation (join → proof → manager approval → points), Challenges + Challenge Participation, Audits, Compliance Issues, Reward Redemptions, XP Ledger, Department Scores.

**Implemented tables** (lib/db/src/schema/gamification.ts): `departments`, `employees`, `challenges` (status enum draft→active→under_review→completed, archived from any state), `challenge_participations` (progress, proof, approval_status, xp_awarded), `badges` (unlock_rule JSON: `{"type":"xp_total","threshold":N}` or `{"type":"challenges_completed","count":N}`), `employee_badges`, `rewards` (points_required, stock), `reward_redemptions`, `xp_ledger` (delta, reason, ref_id — **XP balance is always SUM(delta) from the ledger, never a stored column**).

**ESG score formula** (not yet implemented): dept score = 0.4·Env + 0.3·Social + 0.3·Gov; company score = avg of dept scores.

## Conventions / gotchas

- Schema files: one file per domain under `lib/db/src/schema/`, re-export from `index.ts`. Define Drizzle table + `createInsertSchema` + inferred types together.
- `DATABASE_URL` is required by lib/db at import time; `PORT` required by api-server and vite; `BASE_PATH` required by vite.
- api-server dev script = build + start (esbuild bundle), not watch mode — restart after changes.
- Don't fight the Orval codegen (`lib/api-spec`); the Gamification frontend uses a plain fetch helper (`artifacts/ecosphere/src/lib/api.ts`) + TanStack Query.
- Demo flow (60s): create challenge → activate → join → submit proof → approve → XP in ledger → badge auto-unlocks → redeem reward → leaderboard updates.
