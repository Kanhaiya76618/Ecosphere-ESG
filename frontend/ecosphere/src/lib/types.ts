// Shared TypeScript types matching the ESG data model in the spec
// (attached_assets/Pasted-This-problem-statement-...txt).
//
// Master data = admin-managed reference records; Transactional data = daily
// activity. The Gamification module already has API-accurate types in
// lib/api.ts (Challenge, Participation, BadgeInfo, Reward, Leaderboard) —
// re-exported here so there is one import site for shared types.

export type {
  Challenge,
  ChallengeStatus,
  Participation,
  Employee,
  EmployeeSummary,
  BadgeInfo,
  Reward,
  Leaderboard,
} from './api';

// ---------- Master data (mock-backed modules; refine when each goes real) ----------

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  parentDept: string;
  employees: number;
  status: string;
  score: number;
}

export interface EmissionFactor {
  id: string;
  name: string;
  value: number; // kg CO2 per unit
  unit: string;
}

export interface Policy {
  id: string;
  title: string;
  version: string;
  updated: string;
  acceptance: number; // % of employees who accepted
  status: string;
}

// ---------- Transactional data ----------

export interface CarbonTransaction {
  id: string;
  fuelType: string;
  department: string;
  target: number;
  current: number;
  progress: number;
  deadline: string;
  status: string;
}

export interface SustainabilityGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  progress: number;
}

export interface CsrActivity {
  id: string;
  title: string;
  participants: number;
  points: number;
  status: string;
  date: string;
}

export interface Audit {
  id: string;
  title: string;
  date: string;
  auditor: string;
  status: string;
  score: string;
}

export interface ComplianceIssue {
  id: string;
  title: string;
  severity: string;
  department: string;
  dueDate: string;
  status: string;
}
