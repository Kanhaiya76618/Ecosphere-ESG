# EcoSphere — ESG Management Platform

Odoo-style hackathon project: an ERP that tracks a company's Environmental impact (carbon emissions), Social responsibility (CSR, engagement), and Governance (policies, audits, compliance), computes ESG scores per department + company-wide, and drives participation through Gamification (XP, badges, rewards, leaderboards). Full spec: `attached_assets/Pasted-This-problem-statement-looks-huge-but-it-is-actually-ju_1783841295879.txt`.

## Repo map

```
artifacts/
  ecosphere/        React 19 + Vite frontend (the app). Pages in src/pages:
                    Dashboard, Environmental, Social, Governance, Gamification,
                    Reports, Settings. shadcn/ui components in src/components/ui.
  api-server/       Express 5 backend. Routes in src/routes, bundled with esbuild.
  mockup-sandbox/   Static design mockups (ESG dashboard variants). Not the app.
lib/
  db/               Drizzle ORM + Postgres. Schema: src/schema/index.ts (re-exports
                    per-table files). `pnpm --filter @workspace/db run push` to migrate.
  api-spec/         OpenAPI spec + Orval codegen (largely unused so far).
  api-zod/          Zod schemas generated/shared for the API.
  api-client-react/ Generated react-query hooks (largely unused so far).
scripts/            One-off TS scripts run with tsx (seed scripts live here).
attached_assets/    Problem statement + reference image.
```

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

## Current state: mock vs real

- **Gamification page: REAL.** Backed by Postgres via `/api/gamification/*` (challenges + lifecycle, participations, approvals, XP ledger, badges w/ auto-award, rewards + redemption, leaderboards). No mock imports.
- **Dashboard, Environmental, Social, Governance, Reports, Settings: MOCK.** They render hardcoded arrays from `artifacts/ecosphere/src/data/mock.ts`.
- Backend: `/api/healthz` + `/api/gamification/*`. Nothing else.
- DB: gamification tables only (see below). No environmental/governance tables yet.

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
