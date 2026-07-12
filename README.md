# 🍃 EcoSphere: ESG Management & Employee Engagement Platform

<p align="center">
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" />
</p>

---

## 🌟 The Vision: "Sustainability Driven by People"

Corporate ESG compliance is often treated as a cold ledger of calculations. **EcoSphere** changes that. By marrying a strict, real-time database-driven **ESG Compliance and Carbon Tracking Engine** with an engaging **Employee Gamification Platform**, we transform corporate goals into dynamic employee habits. 

When employees complete social campaigns or adopt green transport, they earn XP, badges, and rewards—boosting both their local department score and the entire organization's ESG index.

---

## 🎨 Key Features at a Glance

### 📈 Dynamic ESG Calculation Engine
```
                  ┌────────────────────────────────────────┐
                  │          Overall ESG Score             │
                  │   (Weighted average of E, S, and G)    │
                  └──────────────────┬─────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  Environmental   │        │      Social      │        │    Governance    │
│  • carbon tx progress     │        │  • CSR XP Earned  │        │  • policy acceptance     │
│  • sustainability goals  │        │  • HRIS diversity │        │  • open risk severity    │
└──────────────────┘        └──────────────────┘        └──────────────────┘
```

### 🔐 Multi-Role Session Scoping
* **Admins & Sustainability Officers** see the big picture—full org analytics, weight adjustment controllers, audit reports, and company-wide carbon trend histories.
* **Department Heads & Employees** see scoped views tailored specifically to their team's metrics (e.g. IT, HR, or Logistics), encouraging friendly competition on the leaderboard.

### 🕹️ Login XP Events & Gamification
* **Daily Check-in Bonus:** Logging in awards `+5 XP` once a day, recorded dynamically in the transaction ledger.
* **Leaderboard Highlight:** Interactive leaderboards immediately showcase your ranking using a vibrant **"You"** card.
* **Live Syncing:** Dispatch actions (adding transactions, resolving compliance logs) automatically write to the PostgreSQL database in the background.

---

## 👥 Seed Demo Login Credentials

Use the following seed credentials to explore the platform under different permission scopes:

| Name | Email | Password | Role | Scoping |
| :--- | :--- | :--- | :--- | :--- |
| **Sarah Chen** | `sarah.chen@ecosphere.io` | `Admin@123` | `Admin` | Full Org Dashboard |
| **Jane Doe** | `jane.doe@ecosphere.io` | `Sustain@123` | `Sustainability Officer` | Compliance & Policy Scopes |
| **Rahul Sharma** | `rahul.sharma@ecosphere.io` | `Manager@123` | `Department Head` | Scoped to IT Department |
| **Priya Patel** | `priya.patel@ecosphere.io` | `Employee@123` | `Employee` | Scoped to HR Department |
| **Vikram Singh** | `vikram.singh@ecosphere.io` | `Employee@456` | `Employee` | Scoped to Logistics |

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
