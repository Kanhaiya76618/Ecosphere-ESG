// ─────────────────────────────────────────────────────────────────────────────
// EcoSphere — CSR & Social Service
// Point allocation, evidence check, and badge auto-award rule check logic.
// ─────────────────────────────────────────────────────────────────────────────

import type { Employee, EmployeeParticipation, ChallengeParticipation, AppSettings } from '@/types';

/**
 * Validates and approves an employee CSR submission.
 *
 * Rules:
 *  • If "Evidence Requirement" is enabled in settings, the participation record
 *    MUST have a proof file attached, otherwise validation fails at the service level.
 *  • Credits the employee's Points/XP balance with the Points Earned.
 *  • Triggers the Badge Auto-Award check.
 *
 * @param employee      The target Employee record to update
 * @param participation The target EmployeeParticipation submission to approve
 * @param settings      The current application Settings
 * @param allApproved   All approved participations for this employee (including this one)
 * @returns             An object containing updated records and any newly unlocked badge IDs
 */
export function approveSubmission(
  employee: Employee,
  participation: EmployeeParticipation,
  settings: AppSettings,
  allApproved: EmployeeParticipation[]
): {
  updatedEmployee: Employee;
  updatedParticipation: EmployeeParticipation;
  newlyUnlockedBadges: string[];
} {
  // Enforce Evidence Requirement toggle
  if (settings.evidenceRequirement && !participation.proofFile) {
    throw new Error('Approval Blocked: Proof file attachment is required by active ESG policy.');
  }

  // Update status
  const updatedParticipation: EmployeeParticipation = {
    ...participation,
    approvalStatus: 'Approved',
    completionDate: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  // Credit Points / XP
  const updatedEmployee: Employee = {
    ...employee,
    xp: employee.xp + participation.pointsEarned,
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  // Compile full list of approved items to check rules
  const updatedAllApproved = [
    ...allApproved.filter((p) => p.id !== participation.id),
    updatedParticipation,
  ];

  // Auto-award checks
  const newlyUnlockedBadges: string[] = [];
  const csrChampionRule = checkCSRChampionBadge(updatedEmployee, updatedAllApproved);
  if (csrChampionRule.unlocked) {
    newlyUnlockedBadges.push('bdg-3');
    updatedEmployee.badges = [...updatedEmployee.badges, 'bdg-3'];
  }

  return {
    updatedEmployee,
    updatedParticipation,
    newlyUnlockedBadges,
  };
}

/**
 * Validates and approves an employee Challenge (gamification) submission.
 */
export function approveChallengeSubmission(
  employee: Employee,
  participation: ChallengeParticipation,
  settings: AppSettings
): {
  updatedEmployee: Employee;
  updatedParticipation: ChallengeParticipation;
  newlyUnlockedBadges: string[];
} {
  // Enforce Evidence Requirement toggle
  if (settings.evidenceRequirement && !participation.proofFile) {
    throw new Error('Approval Blocked: Proof file attachment is required by active ESG policy.');
  }

  const updatedParticipation: ChallengeParticipation = {
    ...participation,
    approvalStatus: 'Approved',
    completionDate: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  const updatedEmployee: Employee = {
    ...employee,
    xp: employee.xp + participation.pointsEarned,
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  // Gamification challenges can trigger other badges like Eco Warrior if they do 10 challenges.
  // We don't have detailed challenge limits here, but we will return an empty list or trigger checks if needed.
  const newlyUnlockedBadges: string[] = [];

  return {
    updatedEmployee,
    updatedParticipation,
    newlyUnlockedBadges,
  };
}

/**
 * Checks if the Employee unlocks the "CSR Champion" badge.
 * Rule: Unlocked when the employee has participated in 5 or more Approved CSR activities.
 */
export function checkCSRChampionBadge(
  employee: Employee,
  approvedParticipations: EmployeeParticipation[]
): { unlocked: boolean } {
  // If already unlocked, skip
  if (employee.badges.includes('bdg-3')) {
    return { unlocked: false };
  }

  // Count approved submissions
  const count = approvedParticipations.filter(
    (p) => p.employeeId === employee.id && p.approvalStatus === 'Approved'
  ).length;

  return { unlocked: count >= 5 };
}

/**
 * Scheduled sync job stub that simulates pulling diversity, demographic,
 * and headcount statistics from a connected HRIS provider (Workday/BambooHR).
 *
 * @param provider The HRIS provider details (e.g. Workday, BambooHR)
 * @returns Array of imported/synced DiversityMetric records
 */
export function syncHRISMetrics(provider: string): DiversityMetric[] {
  const ts = new Date().toISOString().slice(0, 10);
  
  // Simulated demographics dataset mapped by department IDs
  return [
    // IT Department
    { id: 'dm-1', departmentId: 'dept-it', metricType: 'Gender', categoryValue: 'Female', count: 18, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-2', departmentId: 'dept-it', metricType: 'Gender', categoryValue: 'Male', count: 25, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-3', departmentId: 'dept-it', metricType: 'Gender', categoryValue: 'Non-binary', count: 2, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    
    { id: 'dm-4', departmentId: 'dept-it', metricType: 'Age Group', categoryValue: '20-30', count: 20, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-5', departmentId: 'dept-it', metricType: 'Age Group', categoryValue: '31-45', count: 18, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-6', departmentId: 'dept-it', metricType: 'Age Group', categoryValue: '46+', count: 7, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },

    { id: 'dm-7', departmentId: 'dept-it', metricType: 'Ethnicity', categoryValue: 'Asian', count: 15, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-8', departmentId: 'dept-it', metricType: 'Ethnicity', categoryValue: 'White', count: 22, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-9', departmentId: 'dept-it', metricType: 'Ethnicity', categoryValue: 'Hispanic', count: 8, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },

    // HR Department
    { id: 'dm-10', departmentId: 'dept-hr', metricType: 'Gender', categoryValue: 'Female', count: 22, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-11', departmentId: 'dept-hr', metricType: 'Gender', categoryValue: 'Male', count: 8, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-12', departmentId: 'dept-hr', metricType: 'Gender', categoryValue: 'Non-binary', count: 2, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },

    // Manufacturing Department
    { id: 'dm-13', departmentId: 'dept-mfg', metricType: 'Gender', categoryValue: 'Female', count: 40, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-14', departmentId: 'dept-mfg', metricType: 'Gender', categoryValue: 'Male', count: 75, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
    { id: 'dm-15', departmentId: 'dept-mfg', metricType: 'Gender', categoryValue: 'Non-binary', count: 5, snapshotDate: ts, createdAt: ts, updatedAt: ts, deletedAt: null },
  ];
}

import type { DiversityMetric } from '@/types';
