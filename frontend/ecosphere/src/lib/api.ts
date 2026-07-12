// Minimal fetch helper for the EcoSphere API (proxied to the Express server
// by the vite dev server — see vite.config.ts).

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'content-type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // non-JSON error body; keep the generic message
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

export type ChallengeStatus =
  | 'draft'
  | 'active'
  | 'under_review'
  | 'completed'
  | 'archived';

export interface Participation {
  id: number;
  challengeId: number;
  employeeId: number;
  employeeName: string;
  progress: number;
  proof: string | null;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  xpAwarded: number;
}

export interface Challenge {
  id: number;
  title: string;
  category: string;
  description: string;
  xp: number;
  difficulty: string;
  evidenceRequired: string;
  deadline: string | null;
  status: ChallengeStatus;
  participations: Participation[];
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  departmentId: number;
}

export interface EmployeeSummary {
  employeeId: number;
  balance: number;
  badgeIds: number[];
}

export interface BadgeInfo {
  id: number;
  name: string;
  description: string;
  unlockRule:
    | { type: 'xp_total'; threshold: number }
    | { type: 'challenges_completed'; count: number };
  icon: string;
  earnedBy: { badgeId: number; employeeId: number; employeeName: string }[];
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  pointsRequired: number;
  stock: number;
  status: 'active' | 'inactive';
}

export interface Leaderboard {
  employees: {
    id: number;
    name: string;
    department: string;
    xp: number;
    rank: number;
  }[];
  departments: { id: number; name: string; xp: number; members: number; rank: number }[];
}

export interface Department {
  id: number;
  name: string;
  code: string;
  head: string;
  employees: number;
  status: string;
  score: number;
}

export interface Report {
  id: number;
  title: string;
  framework: string;
  dateRange: string;
  pillar: string;
  departmentId: number | null;
  type: string;
  size: string;
  createdAt: string;
}

export const api = {
  employees: () => request<Employee[]>('/gamification/employees'),
  employeeSummary: (id: number) =>
    request<EmployeeSummary>(`/gamification/employees/${id}/summary`),
  challenges: () => request<Challenge[]>('/gamification/challenges'),
  createChallenge: (body: {
    title: string;
    category: string;
    description: string;
    xp: number;
    difficulty: string;
    evidenceRequired: string;
    deadline?: string | null;
  }) =>
    request<Challenge>('/gamification/challenges', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  transitionChallenge: (id: number, status: ChallengeStatus) =>
    request<Challenge>(`/gamification/challenges/${id}/transition`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),
  joinChallenge: (id: number, employeeId: number) =>
    request<Participation>(`/gamification/challenges/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ employeeId }),
    }),
  updateParticipation: (
    id: number,
    body: { progress?: number; proof?: string },
  ) =>
    request<Participation>(`/gamification/participations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  reviewParticipation: (id: number, decision: 'approved' | 'rejected') =>
    request<{
      participation: Participation;
      xpAwarded: number;
      newBadges: { id: number; name: string }[];
    }>(`/gamification/participations/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ decision }),
    }),
  badges: () => request<BadgeInfo[]>('/gamification/badges'),
  rewards: () => request<Reward[]>('/gamification/rewards'),
  redeemReward: (id: number, employeeId: number) =>
    request<{ redemption: unknown; newBalance: number }>(
      `/gamification/rewards/${id}/redeem`,
      { method: 'POST', body: JSON.stringify({ employeeId }) },
    ),
  leaderboard: () => request<Leaderboard>('/gamification/leaderboard'),
  
  // Settings Endpoints
  departments: () => request<Department[]>('/settings/departments'),
  createDepartment: (body: { name: string; code: string }) =>
    request<Department>('/settings/departments', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
    
  // Reports Endpoints
  reports: () => request<Report[]>('/reports'),
  generateReport: (body: {
    framework: string;
    dateRange: string;
    pillar: string;
    departmentId?: number | null;
    type: string;
  }) =>
    request<Report>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
