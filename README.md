# 🍃 EcoSphere: ESG Management & Employee Engagement Platform

EcoSphere is an enterprise-grade **ESG (Environmental, Social & Governance) Management Platform** coupled with a gamification system designed to drive organizational sustainability, track real-time compliance, and engage employees in ESG initiatives.

---

## 🚀 Key Features

### 1. 📊 ESG Score History & Rollups
* **Pillar Computation:** Dynamically computes Environmental (transactions vs goals progress), Social (CSR campaign XP), and Governance (policy acceptance + compliance status + audits readiness) scores using configured weights (default 40/30/30).
* **Rollup Scoping:** Rollups are dynamically scoped. Admins see company-wide metrics, while department heads/employees see views filtered to their specific department.
* **Monthly Snapshots:** Automatically saves trailing snapshots to compile 12-month performance trend charts.

### 2. 🔐 Role-Based Authentication & Session Scoping
* **Secure Flow:** JWT-based cookie authorization checks, protecting all views and module routing.
* **Sidebar Profile Card:** Renders dynamic initials, color, name, role, and current gamification levels/XP for the logged-in user.
* **Daily Login Bonus:** Awards `+5 XP` once per calendar day (logged in ledger) upon login to drive engagement.
* **Leaderboard Highlight:** Automatically highlights the current user's row on the leaderboard with a "You" badge.

### 3. 🌿 Module Overview
* **Environmental:** Tracks manual carbon transactions (calculating fuel/electricity conversions dynamically) against set budget limits and tracks green progress goals.
* **Social & Gamification:** HRIS diversity indicators, employee leaderboard, CSR campaign approvals, and XP/level status trackers.
* **Governance:** Compliance risk issues logger (resolved/overdue status validations), policy acknowledgement ratios, and audit schedules.
* **Reports:** Generates frameworks (GRI, SASB, TCFD) filtered by date, department, or ESG pillar.

---

## 🛠️ Technology Stack
* **Frontend:** React, Vite, TailwindCSS, Framer Motion, Lucide icons, Recharts.
* **Backend:** Node.js, Express, TypeScript, cookie-parser.
* **Database:** PostgreSQL (port `5433`), Drizzle ORM, Drizzle Kit.

---

## 👥 Seed Demo Login Credentials

For judging and demo purposes, use the following credentials to experience different role-based views and scoping:

| Name | Email | Password | Role | Scoping |
| :--- | :--- | :--- | :--- | :--- |
| **Sarah Chen** | `sarah.chen@ecosphere.io` | `Admin@123` | `Admin` | Full Org Dashboard |
| **Jane Doe** | `jane.doe@ecosphere.io` | `Sustain@123` | `Sustainability Officer` | Compliance / Policy Scopes |
| **Rahul Sharma** | `rahul.sharma@ecosphere.io` | `Manager@123` | `Department Head` | IT Department Scoped |
| **Priya Patel** | `priya.patel@ecosphere.io` | `Employee@123` | `Employee` | HR Department Scoped |
| **Vikram Singh** | `vikram.singh@ecosphere.io` | `Employee@456` | `Employee` | Logistics Scoped |

---

## 🔧 Setup & Development Commands

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Seed Database (Required)
Populates initial carbon transactions, compliance issues, policies, audits, configurations, employee profiles, and a 12-month company score history:
```bash
# Seed gamification data
DATABASE_URL=postgres://postgres:postgres@localhost:5433/ecosphere pnpm --filter @workspace/scripts run tsx scripts/src/seed-gamification.ts

# Seed ESG metrics & score snapshots
DATABASE_URL=postgres://postgres:postgres@localhost:5433/ecosphere pnpm --filter @workspace/scripts run tsx scripts/src/seed-esg.ts

# Seed auth users & hashed credentials
DATABASE_URL=postgres://postgres:postgres@localhost:5433/ecosphere pnpm --filter @workspace/scripts run tsx scripts/src/seed-auth-users.ts
```

### 3. Run Development Servers
To run the full stack locally:
```bash
# Launch frontend (Vite binds to port 5173 to prevent MacOS port 5000 conflicts)
pnpm dev:frontend

# Launch Express api-server
pnpm dev:backend
```

### 4. Build & Production Verification
To compile and typecheck the entire workspace:
```bash
pnpm run build
```
