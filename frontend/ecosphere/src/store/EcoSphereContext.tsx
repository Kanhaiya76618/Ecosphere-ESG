import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { api } from '@/lib/api';
import type {
  EcoSphereState,
  Department,
  EmissionFactor,
  CarbonTransaction,
  EnvironmentalGoal,
  EnvironmentalMetric,
  AppNotification,
  UserRole,
  AppSettings,
  Category,
  CSRActivity,
  EmployeeParticipation,
  ChallengeParticipation,
  Employee,
  DiversityMetric,
  ESGPolicy,
  PolicyAcknowledgement,
  Audit,
  ComplianceIssue,
} from '@/types';
import {
  calculateTransactionStatus,
  calculateTCO2e,
  calculateProgress,
} from '@/services/emissionService';
import {
  approveSubmission,
  approveChallengeSubmission,
} from '@/services/socialService';
import {
  calculateAcceptanceRate,
  validateComplianceIssue,
  checkOverdueIssues,
} from '@/services/governanceService';

// ── Seed data ─────────────────────────────────────────────────────────────────

const now = new Date().toISOString().slice(0, 10);

const SEED_DEPARTMENTS: Department[] = [
  { id: 'dept-it',  name: 'IT',            code: 'IT',  head: 'Rajesh Kumar', parentDeptId: null, employeeCount: 45,  status: 'Active', score: 80, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'dept-hr',  name: 'HR',            code: 'HR',  head: 'Anita Desai',  parentDeptId: null, employeeCount: 32,  status: 'Active', score: 90, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'dept-fin', name: 'Finance',       code: 'FIN', head: 'Vikram Mehta', parentDeptId: null, employeeCount: 28,  status: 'Active', score: 85, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'dept-log', name: 'Logistics',     code: 'LOG', head: 'Sunil Singh',  parentDeptId: null, employeeCount: 71,  status: 'Active', score: 75, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'dept-mfg', name: 'Manufacturing', code: 'MFG', head: 'Arjun Reddy',  parentDeptId: null, employeeCount: 120, status: 'Active', score: 70, createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_EMISSION_FACTORS: EmissionFactor[] = [
  { id: 'ef-1', fuelType: 'Diesel',      scope: 1, co2eFactor: 2.68, unit: 'L',   effectiveDate: '2024-01-01', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ef-2', fuelType: 'Petrol',      scope: 1, co2eFactor: 2.31, unit: 'L',   effectiveDate: '2024-01-01', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ef-3', fuelType: 'Electricity', scope: 2, co2eFactor: 0.82, unit: 'kWh', effectiveDate: '2024-01-01', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ef-4', fuelType: 'Natural Gas', scope: 1, co2eFactor: 2.04, unit: 'm³',  effectiveDate: '2024-01-01', createdAt: now, updatedAt: now, deletedAt: null },
];

function makeTx(
  id: string,
  fuelTypeId: string,
  fuelType: string,
  departmentId: string,
  department: string,
  quantity: number,
  limit: number,
  deadline: string,
  sourceType: 'Manual' | 'Auto-calculated',
): CarbonTransaction {
  const ef = SEED_EMISSION_FACTORS.find((f) => f.id === fuelTypeId)!;
  const calculatedTCO2e = calculateTCO2e(quantity, ef);
  const currentKg = calculatedTCO2e * 1000;
  const progress = calculateProgress(currentKg, limit);
  const status = calculateTransactionStatus(currentKg, limit, deadline);
  return {
    id, fuelTypeId, fuelType, departmentId, department,
    quantity, calculatedTCO2e, limit, deadline, status, sourceType, progress,
    createdAt: now, updatedAt: now, deletedAt: null,
  };
}

const SEED_TRANSACTIONS: CarbonTransaction[] = [
  makeTx('tx-1', 'ef-3', 'Electricity', 'dept-mfg', 'Manufacturing', 10366, 12000, '2026-12-31', 'Manual'),
  makeTx('tx-2', 'ef-1', 'Diesel',      'dept-log', 'Logistics',      1791, 5000,  '2026-08-15', 'Manual'),
  makeTx('tx-3', 'ef-2', 'Petrol',      'dept-fin', 'Finance',        1342, 3000,  '2025-06-30', 'Manual'),
  makeTx('tx-4', 'ef-3', 'Electricity', 'dept-it',  'IT',             2561, 4500,  '2026-12-31', 'Auto-calculated'),
  makeTx('tx-5', 'ef-4', 'Natural Gas', 'dept-mfg', 'Manufacturing',  1569, 8000,  '2026-12-31', 'Auto-calculated'),
];

const SEED_GOALS: EnvironmentalGoal[] = [
  { id: 'sg-1', title: 'Reduce Scope 2 Emissions by 15%', metricType: 'Emissions (tCO2e)', targetValue: 4200, currentValue: 3800, unit: 'tCO2e', progress: 90.47, deadline: '2026-12-31', departmentId: null, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'sg-2', title: 'Transition Logistics to EVs',      metricType: 'Vehicles (EV)',     targetValue: 50,   currentValue: 15,   unit: 'Vehicles', progress: 30, deadline: '2027-06-30', departmentId: 'dept-log', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'sg-3', title: 'Zero Waste to Landfill',           metricType: 'Waste (%)',         targetValue: 100,  currentValue: 60,   unit: '% Diverted', progress: 60, deadline: '2026-09-30', departmentId: null, createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_METRICS: EnvironmentalMetric[] = [
  { id: 'm-1', category: 'Water', value: 4500, unit: 'kL', departmentId: 'dept-mfg', department: 'Manufacturing', date: '2026-07-01', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'm-2', category: 'Water', value: 3800, unit: 'kL', departmentId: 'dept-log', department: 'Logistics', date: '2026-07-05', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'm-3', category: 'Water', value: 4200, unit: 'kL', departmentId: 'dept-it',  department: 'IT', date: '2026-07-10', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'm-4', category: 'Waste', value: 72,   unit: '%',  departmentId: 'dept-mfg', department: 'Manufacturing', date: '2026-07-02', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'm-5', category: 'Waste', value: 64,   unit: '%',  departmentId: 'dept-log', department: 'Logistics', date: '2026-07-06', createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_CATEGORIES: Category[] = [
  { id: 'cat-csr-1', name: 'Sustainability', type: 'CSR Activity' },
  { id: 'cat-csr-2', name: 'Community Care', type: 'CSR Activity' },
  { id: 'cat-csr-3', name: 'Education', type: 'CSR Activity' },
];

const SEED_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Rahul Sharma', department: 'IT', xp: 2500, badges: ['bdg-1'], createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'emp-2', name: 'Aman Gupta', department: 'Finance', xp: 2100, badges: ['bdg-2'], createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'emp-3', name: 'Priya Patel', department: 'HR', xp: 1800, badges: ['bdg-1', 'bdg-2'], createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'emp-4', name: 'Vikram Singh', department: 'Logistics', xp: 1650, badges: [], createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'emp-5', name: 'Neha Reddy', department: 'Manufacturing', xp: 1420, badges: ['bdg-2'], createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'emp-6', name: 'Sanya Mirza', department: 'IT', xp: 1200, badges: [], createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_CSR_ACTIVITIES: CSRActivity[] = [
  { id: 'csr-1', title: 'Tree Plantation Drive', categoryId: 'cat-csr-1', category: 'Sustainability', description: 'Help plant trees in the factory zone to restore green corridors.', date: '2026-07-20', status: 'Upcoming', pointsAvailable: 200, location: 'Factory Zone B', participants: ['emp-1', 'emp-3', 'emp-6'], createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'csr-2', title: 'Blood Donation Camp', categoryId: 'cat-csr-2', category: 'Community Care', description: 'Annual blood donation camp in partnership with the local Red Cross chapter.', date: '2026-05-15', status: 'Completed', pointsAvailable: 150, location: 'HQ Cafeteria', participants: ['emp-2', 'emp-3'], createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'csr-3', title: 'Beach Cleanup Campaign', categoryId: 'cat-csr-1', category: 'Sustainability', description: 'Participate in removing plastics and trash from our coastlines.', date: '2026-06-25', status: 'Active', pointsAvailable: 250, location: 'Juhu Marina', participants: ['emp-1', 'emp-4', 'emp-5'], createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'csr-4', title: 'Corporate ESG Workshop', categoryId: 'cat-csr-3', category: 'Education', description: 'Learn about sustainability reporting and offsets metrics.', date: '2026-08-05', status: 'Upcoming', pointsAvailable: 100, location: 'Conference Hall A', participants: [], createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_PARTICIPATIONS: EmployeeParticipation[] = [
  { id: 'ea-1', employeeId: 'emp-6', employeeName: 'Sanya Mirza', activityId: 'csr-3', activityTitle: 'Beach Cleanup Campaign', proofFile: 'transit-pass.jpg', approvalStatus: 'Pending', pointsEarned: 250, completionDate: null, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ea-2', employeeId: 'emp-1', employeeName: 'Rahul Sharma', activityId: 'csr-2', activityTitle: 'Blood Donation Camp', proofFile: null, approvalStatus: 'Pending', pointsEarned: 150, completionDate: null, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ea-3', employeeId: 'emp-3', employeeName: 'Priya Patel', activityId: 'csr-2', activityTitle: 'Blood Donation Camp', proofFile: 'planting.jpg', approvalStatus: 'Approved', pointsEarned: 150, completionDate: '2026-05-15', createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_CHALLENGE_PARTICIPATIONS: ChallengeParticipation[] = [
  { id: 'ch-ea-1', employeeId: 'emp-6', employeeName: 'Sanya Mirza', challengeId: 'ch-1', challengeTitle: 'Car-Free Week Challenge', proofFile: 'transit-pass.jpg', approvalStatus: 'Pending', pointsEarned: 150, completionDate: null, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ch-ea-2', employeeId: 'emp-1', employeeName: 'Rahul Sharma', challengeId: 'ch-2', challengeTitle: 'Zero Waste Lunch', proofFile: null, approvalStatus: 'Pending', pointsEarned: 50, completionDate: null, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ch-ea-3', employeeId: 'emp-4', employeeName: 'Vikram Singh', challengeId: 'ch-3', challengeTitle: 'Beach Cleanup Challenge', proofFile: 'cleanup.jpg', approvalStatus: 'Rejected', pointsEarned: 200, completionDate: null, createdAt: now, updatedAt: now, deletedAt: null },
];

// ── Governance Seeds ─────────────────────────────────────────────────────────

const SEED_POLICIES: ESGPolicy[] = [
  { id: 'pol-1', name: 'Anti-Bribery and Corruption', version: 'v2.1', updatedDate: '2026-01-15', description: 'Zero tolerance rules on standard external gifts.', status: 'Active', acceptanceRate: 83, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'pol-2', name: 'Data Privacy & Protection',  version: 'v3.0', updatedDate: '2026-03-10', description: 'Guidelines on managing employee logs and PII records.', status: 'Active', acceptanceRate: 83, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'pol-3', name: 'Diversity & Inclusion',     version: 'v1.4', updatedDate: '2025-11-05', description: 'Standard hiring equality and workplace accessibility policies.', status: 'Active', acceptanceRate: 100, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'pol-4', name: 'Vendor Code of Conduct',    version: 'v1.0', updatedDate: '2026-05-20', description: 'Sustainability criteria for supply chain providers.', status: 'Review', acceptanceRate: 33, createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_ACKNOWLEDGEMENTS: PolicyAcknowledgement[] = [
  // pol-3: 100% (6/6)
  { id: 'ack-1', employeeId: 'emp-1', employeeName: 'Rahul Sharma', policyId: 'pol-3', acknowledgedDate: '2025-11-10', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-2', employeeId: 'emp-2', employeeName: 'Aman Gupta',   policyId: 'pol-3', acknowledgedDate: '2025-11-12', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-3', employeeId: 'emp-3', employeeName: 'Priya Patel',  policyId: 'pol-3', acknowledgedDate: '2025-11-15', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-4', employeeId: 'emp-4', employeeName: 'Vikram Singh', policyId: 'pol-3', acknowledgedDate: '2025-11-18', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-5', employeeId: 'emp-5', employeeName: 'Neha Reddy',   policyId: 'pol-3', acknowledgedDate: '2025-11-20', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-6', employeeId: 'emp-6', employeeName: 'Sanya Mirza',  policyId: 'pol-3', acknowledgedDate: '2025-11-22', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },

  // pol-1: 83% (5/6)
  { id: 'ack-7', employeeId: 'emp-1', employeeName: 'Rahul Sharma', policyId: 'pol-1', acknowledgedDate: '2026-01-16', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-8', employeeId: 'emp-2', employeeName: 'Aman Gupta',   policyId: 'pol-1', acknowledgedDate: '2026-01-17', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-9', employeeId: 'emp-3', employeeName: 'Priya Patel',  policyId: 'pol-1', acknowledgedDate: '2026-01-18', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-10', employeeId: 'emp-4', employeeName: 'Vikram Singh', policyId: 'pol-1', acknowledgedDate: '2026-01-19', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-11', employeeId: 'emp-5', employeeName: 'Neha Reddy',   policyId: 'pol-1', acknowledgedDate: '2026-01-20', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },

  // pol-2: 83% (5/6)
  { id: 'ack-12', employeeId: 'emp-1', employeeName: 'Rahul Sharma', policyId: 'pol-2', acknowledgedDate: '2026-03-11', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-13', employeeId: 'emp-2', employeeName: 'Aman Gupta',   policyId: 'pol-2', acknowledgedDate: '2026-03-12', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-14', employeeId: 'emp-3', employeeName: 'Priya Patel',  policyId: 'pol-2', acknowledgedDate: '2026-03-13', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-15', employeeId: 'emp-4', employeeName: 'Vikram Singh', policyId: 'pol-2', acknowledgedDate: '2026-03-14', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-16', employeeId: 'emp-5', employeeName: 'Neha Reddy',   policyId: 'pol-2', acknowledgedDate: '2026-03-15', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },

  // pol-4: 33% (2/6) - below 50% threshold
  { id: 'ack-17', employeeId: 'emp-1', employeeName: 'Rahul Sharma', policyId: 'pol-4', acknowledgedDate: '2026-05-21', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ack-18', employeeId: 'emp-2', employeeName: 'Aman Gupta',   policyId: 'pol-4', acknowledgedDate: '2026-05-22', status: 'Acknowledged', createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_AUDITS: Audit[] = [
  { id: 'aud-1', title: 'Annual ESG Compliance Audit', date: '2026-06-01', auditor: 'Deloitte', score: 'A-', status: 'Completed', reportFile: 'esg-report-2026.pdf', createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'aud-2', title: 'Fire Safety Equipment Audit', date: '2026-07-15', auditor: 'Internal', score: '—', status: 'In Progress', reportFile: null, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'aud-3', title: 'Vendor Data Security Audit', date: '2026-08-10', auditor: 'KPMG', score: '—', status: 'Pending', reportFile: null, createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_COMPLIANCE_ISSUES: ComplianceIssue[] = [
  { id: 'ci-1', title: 'Fire Extinguisher Missing in Zone B', severity: 'High', departmentId: 'dept-hr', departmentName: 'HR', dueDate: '2026-07-20', status: 'Open', ownerId: 'emp-3', ownerName: 'Priya Patel', description: 'Annual fire marshal walk-through reported missing extinguisher in the cafeteria corridor.', relatedAuditId: 'aud-2', isOverdue: false, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ci-2', title: 'Lab waste disposal non-compliant', severity: 'Medium', departmentId: 'dept-mfg', departmentName: 'Manufacturing', dueDate: '2026-06-15', status: 'Resolved', ownerId: 'emp-5', ownerName: 'Neha Reddy', description: 'Secondary containment units added for chemicals storage.', relatedAuditId: null, isOverdue: false, createdAt: now, updatedAt: now, deletedAt: null },
  { id: 'ci-3', title: 'Incomplete vendor screening logs', severity: 'Low', departmentId: 'dept-fin', departmentName: 'Finance', dueDate: '2026-08-01', status: 'In Progress', ownerId: 'emp-2', ownerName: 'Aman Gupta', description: 'Vendor certificates validation requires manual screening checks.', relatedAuditId: 'aud-3', isOverdue: false, createdAt: now, updatedAt: now, deletedAt: null },
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  { id: 'n-seed-1', title: 'Finance Carbon Overdue', message: 'Petrol consumption has exceeded target budget limit. Status: Overdue.', timestamp: now, read: false, type: 'alert' },
  { id: 'n-seed-2', title: 'Logistics Carbon At Risk', message: 'Diesel consumption is at 96% of limit with 15 days remaining before the budget closes.', timestamp: now, read: false, type: 'warning' },
  { id: 'n-seed-3', title: 'Pending Approval Submission', message: 'Sanya Mirza submitted Beach Cleanup Campaign proof for review.', timestamp: now, read: false, type: 'info' },
  { id: 'n-seed-4', title: 'Pending Challenge Submission', message: 'Rahul Sharma submitted Zero Waste Lunch proof for review.', timestamp: now, read: false, type: 'info' },
];

const INITIAL_STATE: EcoSphereState = {
  departments: SEED_DEPARTMENTS,
  emissionFactors: SEED_EMISSION_FACTORS,
  carbonTransactions: SEED_TRANSACTIONS,
  environmentalGoals: SEED_GOALS,
  environmentalMetrics: SEED_METRICS,
  categories: SEED_CATEGORIES,
  csrActivities: SEED_CSR_ACTIVITIES,
  employeeParticipations: SEED_PARTICIPATIONS,
  challengeParticipations: SEED_CHALLENGE_PARTICIPATIONS,
  diversityMetrics: [],
  employees: SEED_EMPLOYEES,
  esgPolicies: SEED_POLICIES,
  policyAcknowledgements: SEED_ACKNOWLEDGEMENTS,
  audits: SEED_AUDITS,
  complianceIssues: SEED_COMPLIANCE_ISSUES,
  settings: {
    autoEmissionCalculation: false,
    envWeight: 40,
    socWeight: 30,
    govWeight: 30,
    weeklyDigest: true,
    goalAtRiskAlerts: true,
    newComplianceIssues: true,
    gamificationApprovals: false,
    evidenceRequirement: true, // Evidence requirement toggled ON by default
    hrisIntegrationConnected: false,
    hrisProvider: null,
  },
  notifications: SEED_NOTIFICATIONS,
  currentUserRole: 'Sustainability Officer',
  currentUser: null,
};

// ── Alert Helpers ─────────────────────────────────────────────────────────────

function triggerNotificationCheck(
  notifications: AppNotification[],
  tx: CarbonTransaction,
  enableAlerts: boolean
): AppNotification[] {
  if (!enableAlerts) return notifications;
  
  if (tx.status === 'At Risk' || tx.status === 'Overdue') {
    const title = `${tx.department} Carbon ${tx.status}`;
    const message = `${tx.fuelType} usage is at ${tx.progress}% of budget. Target limit: ${tx.limit} kg. Deadline: ${tx.deadline}.`;
    
    const duplicate = notifications.find(n => n.title === title && !n.read);
    if (!duplicate) {
      return [
        {
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
          title,
          message,
          timestamp: new Date().toISOString().slice(0, 10),
          read: false,
          type: tx.status === 'Overdue' ? 'alert' : 'warning'
        },
        ...notifications
      ];
    }
  }
  return notifications;
}

function triggerGoalNotificationCheck(
  notifications: AppNotification[],
  goal: EnvironmentalGoal,
  enableAlerts: boolean
): AppNotification[] {
  if (!enableAlerts) return notifications;
  
  const now = new Date();
  const dl = new Date(goal.deadline);
  const diffDays = Math.round((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays >= 0 && diffDays <= 30 && goal.progress < 100) {
    const title = `Approaching Goal Deadline: ${goal.title}`;
    const message = `The goal deadline is in ${diffDays} days (${goal.deadline}). Current progress: ${goal.progress}%.`;
    
    const duplicate = notifications.find(n => n.title === title && !n.read);
    if (!duplicate) {
      return [
        {
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
          title,
          message,
          timestamp: new Date().toISOString().slice(0, 10),
          read: false,
          type: 'info'
        },
        ...notifications
      ];
    }
  }
  return notifications;
}

// ── Actions ───────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_DEPARTMENT';       payload: Omit<Department, 'createdAt' | 'updatedAt' | 'deletedAt'> }
  | { type: 'UPDATE_DEPARTMENT';    payload: Pick<Department, 'id'> & Partial<Department> }
  | { type: 'DELETE_DEPARTMENT';    payload: { id: string } }
  | { type: 'ADD_EMISSION_FACTOR';  payload: Omit<EmissionFactor, 'createdAt' | 'updatedAt' | 'deletedAt'> }
  | { type: 'UPDATE_EMISSION_FACTOR'; payload: Pick<EmissionFactor, 'id'> & Partial<EmissionFactor> }
  | { type: 'DELETE_EMISSION_FACTOR'; payload: { id: string } }
  | { type: 'ADD_TRANSACTION';      payload: Omit<CarbonTransaction, 'id' | 'status' | 'progress' | 'calculatedTCO2e' | 'createdAt' | 'updatedAt' | 'deletedAt'> & { emissionFactor: EmissionFactor } }
  | { type: 'UPDATE_TRANSACTION';   payload: Pick<CarbonTransaction, 'id'> & Partial<Omit<CarbonTransaction, 'id'>> & { emissionFactor?: EmissionFactor } }
  | { type: 'DELETE_TRANSACTION';   payload: { id: string } }
  | { type: 'ADD_GOAL';             payload: Omit<EnvironmentalGoal, 'progress' | 'createdAt' | 'updatedAt' | 'deletedAt'> }
  | { type: 'UPDATE_GOAL';          payload: Pick<EnvironmentalGoal, 'id'> & Partial<EnvironmentalGoal> }
  | { type: 'DELETE_GOAL';          payload: { id: string } }
  | { type: 'TOGGLE_AUTO_EMISSION'; payload?: boolean }
  | { type: 'UPDATE_SETTINGS';      payload: Partial<AppSettings> }
  | { type: 'SET_USER_ROLE';        payload: UserRole }
  | { type: 'SET_CURRENT_USER';     payload: any }
  | { type: 'READ_NOTIFICATION';    payload: { id: string } }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' }
  // Social CSR & Gamification Approvals
  | { type: 'ADD_CSR_ACTIVITY';     payload: Omit<CSRActivity, 'createdAt' | 'updatedAt' | 'deletedAt'> }
  | { type: 'UPDATE_CSR_ACTIVITY';  payload: Pick<CSRActivity, 'id'> & Partial<CSRActivity> }
  | { type: 'APPROVE_SUBMISSION';   payload: { participationId: string } }
  | { type: 'REJECT_SUBMISSION';    payload: { participationId: string } }
  | { type: 'APPROVE_CHALLENGE_SUBMISSION'; payload: { participationId: string } }
  | { type: 'REJECT_CHALLENGE_SUBMISSION';  payload: { participationId: string } }
  | { type: 'CONNECT_HRIS';         payload: { provider: string; metrics: DiversityMetric[] } }
  // Governance
  | { type: 'ADD_COMPLIANCE_ISSUE'; payload: Omit<ComplianceIssue, 'id' | 'status' | 'isOverdue' | 'createdAt' | 'updatedAt' | 'deletedAt'> }
  | { type: 'UPDATE_COMPLIANCE_ISSUE'; payload: Pick<ComplianceIssue, 'id'> & Partial<ComplianceIssue> }
  | { type: 'RESOLVE_COMPLIANCE_ISSUE'; payload: { issueId: string } }
  | { type: 'ACKNOWLEDGE_POLICY';   payload: { policyId: string; employeeId: string } }
  | { type: 'RUN_OVERDUE_CHECK' }
  | { type: 'UPDATE_POLICY';        payload: Pick<ESGPolicy, 'id'> & Partial<ESGPolicy> & { triggerReminder?: boolean } }
  | { type: 'ADD_AUDIT';            payload: Omit<Audit, 'id' | 'status' | 'reportFile' | 'createdAt' | 'updatedAt' | 'deletedAt'> }
  | { type: 'COMPLETE_AUDIT';       payload: { auditId: string; score: string; reportFile: string; findings: string; departmentId: string; departmentName: string } }
  | { type: 'INITIALIZE_STATE';     payload: Partial<EcoSphereState> };

// ── Reducer ───────────────────────────────────────────────────────────────────

function uid(): string {
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function enrichTransaction(
  base: Omit<CarbonTransaction, 'status' | 'progress' | 'calculatedTCO2e'>,
  ef: EmissionFactor,
): CarbonTransaction {
  const calculatedTCO2e = calculateTCO2e(base.quantity, ef);
  const currentKg = calculatedTCO2e * 1000;
  const progress = calculateProgress(currentKg, base.limit);
  const status = calculateTransactionStatus(currentKg, base.limit, base.deadline);
  return { ...base, calculatedTCO2e, progress, status };
}

function reducer(state: EcoSphereState, action: Action): EcoSphereState {
  const ts = new Date().toISOString().slice(0, 10);

  switch (action.type) {
    case 'INITIALIZE_STATE':
      return {
        ...state,
        ...action.payload,
      };

    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
        currentUserRole: action.payload ? action.payload.role : 'Sustainability Officer',
      };

    case 'ADD_DEPARTMENT':
      return {
        ...state,
        departments: [
          ...state.departments,
          { ...action.payload, createdAt: ts, updatedAt: ts, deletedAt: null },
        ],
      };
    case 'UPDATE_DEPARTMENT':
      return {
        ...state,
        departments: state.departments.map((d) =>
          d.id === action.payload.id ? { ...d, ...action.payload, updatedAt: ts } : d,
        ),
      };
    case 'DELETE_DEPARTMENT':
      return {
        ...state,
        departments: state.departments.map((d) =>
          d.id === action.payload.id ? { ...d, deletedAt: ts } : d,
        ),
      };

    case 'ADD_EMISSION_FACTOR':
      return {
        ...state,
        emissionFactors: [
          ...state.emissionFactors,
          { ...action.payload, createdAt: ts, updatedAt: ts, deletedAt: null },
        ],
      };
    case 'UPDATE_EMISSION_FACTOR':
      return {
        ...state,
        emissionFactors: state.emissionFactors.map((ef) =>
          ef.id === action.payload.id ? { ...ef, ...action.payload, updatedAt: ts } : ef,
        ),
      };
    case 'DELETE_EMISSION_FACTOR':
      return {
        ...state,
        emissionFactors: state.emissionFactors.map((ef) =>
          ef.id === action.payload.id ? { ...ef, deletedAt: ts } : ef,
        ),
      };

    case 'ADD_TRANSACTION': {
      const { emissionFactor, ...rest } = action.payload;
      const base = { ...rest, id: uid(), createdAt: ts, updatedAt: ts, deletedAt: null };
      const enriched = enrichTransaction(base, emissionFactor);
      const newNotifs = triggerNotificationCheck(state.notifications, enriched, state.settings.goalAtRiskAlerts);
      return {
        ...state,
        carbonTransactions: [...state.carbonTransactions, enriched],
        notifications: newNotifs,
      };
    }
    case 'UPDATE_TRANSACTION': {
      let updatedTx: CarbonTransaction | null = null;
      const updatedTxs = state.carbonTransactions.map((tx) => {
        if (tx.id !== action.payload.id) return tx;
        const { emissionFactor, ...rest } = action.payload;
        const merged = { ...tx, ...rest, updatedAt: ts };
        const ef = emissionFactor || state.emissionFactors.find((f) => f.id === merged.fuelTypeId);
        const enriched = ef ? enrichTransaction(merged, ef) : merged;
        updatedTx = enriched;
        return enriched;
      });

      const newNotifs = updatedTx
        ? triggerNotificationCheck(state.notifications, updatedTx, state.settings.goalAtRiskAlerts)
        : state.notifications;

      return {
        ...state,
        carbonTransactions: updatedTxs,
        notifications: newNotifs,
      };
    }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        carbonTransactions: state.carbonTransactions.map((tx) =>
          tx.id === action.payload.id ? { ...tx, deletedAt: ts } : tx,
        ),
      };

    case 'ADD_GOAL': {
      const { targetValue, currentValue } = action.payload;
      const progress = calculateProgress(currentValue, targetValue);
      const goal = { ...action.payload, progress, createdAt: ts, updatedAt: ts, deletedAt: null };
      const newNotifs = triggerGoalNotificationCheck(state.notifications, goal, state.settings.goalAtRiskAlerts);
      return {
        ...state,
        environmentalGoals: [...state.environmentalGoals, goal],
        notifications: newNotifs,
      };
    }
    case 'UPDATE_GOAL': {
      let updatedGoal: EnvironmentalGoal | null = null;
      const updatedGoals = state.environmentalGoals.map((g) => {
        if (g.id !== action.payload.id) return g;
        const merged = { ...g, ...action.payload, updatedAt: ts };
        merged.progress = calculateProgress(merged.currentValue, merged.targetValue);
        updatedGoal = merged;
        return merged;
      });

      const newNotifs = updatedGoal
        ? triggerGoalNotificationCheck(state.notifications, updatedGoal, state.settings.goalAtRiskAlerts)
        : state.notifications;

      return {
        ...state,
        environmentalGoals: updatedGoals,
        notifications: newNotifs,
      };
    }
    case 'DELETE_GOAL':
      return {
        ...state,
        environmentalGoals: state.environmentalGoals.map((g) =>
          g.id === action.payload.id ? { ...g, deletedAt: ts } : g,
        ),
      };

    case 'TOGGLE_AUTO_EMISSION':
      return {
        ...state,
        settings: {
          ...state.settings,
          autoEmissionCalculation:
            action.payload !== undefined
              ? action.payload
              : !state.settings.autoEmissionCalculation,
        },
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case 'SET_USER_ROLE':
      return {
        ...state,
        currentUserRole: action.payload,
      };

    case 'READ_NOTIFICATION':
      return {
        ...state,
        notifications: (state.notifications || []).map(n =>
          n.id === action.payload.id ? { ...n, read: true } : n
        ),
      };

    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    // ── Social & CSR Cases ─────────────────────────────────────────────────
    case 'ADD_CSR_ACTIVITY': {
      let notifications = state.notifications || [];
      notifications = [
        {
          id: `notif-csr-new-${Date.now()}`,
          title: `New CSR Initiative Launched`,
          message: `${action.payload.title} is now open for confirmed employee signups. Points: ${action.payload.pointsAvailable} XP.`,
          timestamp: ts,
          read: false,
          type: 'info',
        },
        ...notifications,
      ];
      return {
        ...state,
        csrActivities: [
          ...state.csrActivities,
          { ...action.payload, createdAt: ts, updatedAt: ts, deletedAt: null },
        ],
        notifications,
      };
    }

    case 'UPDATE_CSR_ACTIVITY':
      return {
        ...state,
        csrActivities: state.csrActivities.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload, updatedAt: ts } : c
        ),
      };

    case 'APPROVE_SUBMISSION': {
      const part = state.employeeParticipations.find((p) => p.id === action.payload.participationId);
      const emp = state.employees.find((e) => e.id === part?.employeeId);
      if (!part || !emp) return state;

      try {
        const allApproved = state.employeeParticipations.filter(
          (p) => p.employeeId === emp.id && p.approvalStatus === 'Approved'
        );
        const approvedResults = approveSubmission(emp, part, state.settings, allApproved);

        const updatedParticipations = state.employeeParticipations.map((p) =>
          p.id === part.id ? approvedResults.updatedParticipation : p
        );
        const updatedEmployees = state.employees.map((e) =>
          e.id === emp.id ? approvedResults.updatedEmployee : e
        );

        let notifications = state.notifications || [];
        notifications = [
          {
            id: `notif-appr-${Date.now()}`,
            title: `Submission Approved: ${part.activityTitle}`,
            message: `Your submission has been approved! You earned ${part.pointsEarned} XP.`,
            timestamp: ts,
            read: false,
            type: 'info',
          },
          ...notifications,
        ];

        if (approvedResults.newlyUnlockedBadges.length > 0) {
          approvedResults.newlyUnlockedBadges.forEach((badgeId) => {
            const badgeName = badgeId === 'bdg-3' ? 'CSR Champion' : 'New Badge';
            notifications = [
              {
                id: `notif-badge-${Date.now()}`,
                title: `${emp.name} Unlocked ${badgeName}!`,
                message: `Congratulations! ${emp.name} has completed 5 approved CSR activities and earned the ${badgeName} badge.`,
                timestamp: ts,
                read: false,
                type: 'info',
              },
              ...notifications,
            ];
          });
        }

        return {
          ...state,
          employeeParticipations: updatedParticipations,
          employees: updatedEmployees,
          notifications,
        };
      } catch (err: any) {
        console.error(err.message);
        return state;
      }
    }

    case 'REJECT_SUBMISSION': {
      const part = state.employeeParticipations.find((p) => p.id === action.payload.participationId);
      if (!part) return state;

      const updatedParticipations = state.employeeParticipations.map((p) =>
        p.id === part.id
          ? {
              ...p,
              approvalStatus: 'Rejected' as const,
              updatedAt: ts,
            }
          : p
      );

      let notifications = state.notifications || [];
      notifications = [
        {
          id: `notif-rej-${Date.now()}`,
          title: `Submission Rejected: ${part.activityTitle}`,
          message: `Your submission was rejected. Please review guidelines or policy rules.`,
          timestamp: ts,
          read: false,
          type: 'alert',
        },
        ...notifications,
      ];

      return {
        ...state,
        employeeParticipations: updatedParticipations,
        notifications,
      };
    }

    case 'APPROVE_CHALLENGE_SUBMISSION': {
      const part = state.challengeParticipations.find((p) => p.id === action.payload.participationId);
      const emp = state.employees.find((e) => e.id === part?.employeeId);
      if (!part || !emp) return state;

      try {
        const approvedResults = approveChallengeSubmission(emp, part, state.settings);

        const updatedParticipations = state.challengeParticipations.map((p) =>
          p.id === part.id ? approvedResults.updatedParticipation : p
        );
        const updatedEmployees = state.employees.map((e) =>
          e.id === emp.id ? approvedResults.updatedEmployee : e
        );

        let notifications = state.notifications || [];
        notifications = [
          {
            id: `notif-ch-appr-${Date.now()}`,
            title: `Challenge Approved: ${part.challengeTitle}`,
            message: `Your submission for ${part.challengeTitle} has been approved. You earned ${part.pointsEarned} XP!`,
            timestamp: ts,
            read: false,
            type: 'info',
          },
          ...notifications,
        ];

        return {
          ...state,
          challengeParticipations: updatedParticipations,
          employees: updatedEmployees,
          notifications,
        };
      } catch (err: any) {
        console.error(err.message);
        return state;
      }
    }

    case 'REJECT_CHALLENGE_SUBMISSION': {
      const part = state.challengeParticipations.find((p) => p.id === action.payload.participationId);
      if (!part) return state;

      const updatedParticipations = state.challengeParticipations.map((p) =>
        p.id === part.id
          ? {
              ...p,
              approvalStatus: 'Rejected' as const,
              updatedAt: ts,
            }
          : p
      );

      let notifications = state.notifications || [];
      notifications = [
        {
          id: `notif-ch-rej-${Date.now()}`,
          title: `Challenge Rejected: ${part.challengeTitle}`,
          message: `Your submission for ${part.challengeTitle} was rejected. Please check guidelines.`,
          timestamp: ts,
          read: false,
          type: 'alert',
        },
        ...notifications,
      ];

      return {
        ...state,
        challengeParticipations: updatedParticipations,
        notifications,
      };
    }

    case 'CONNECT_HRIS':
      return {
        ...state,
        settings: {
          ...state.settings,
          hrisIntegrationConnected: true,
          hrisProvider: action.payload.provider,
        },
        diversityMetrics: action.payload.metrics,
      };

    // ── Governance Actions (Phase 1 & 2) ──────────────────────────────────────
    case 'ADD_COMPLIANCE_ISSUE': {
      validateComplianceIssue(action.payload);
      
      const newIssue: ComplianceIssue = {
        ...action.payload,
        id: `ci-${Date.now()}`,
        status: 'Open',
        isOverdue: false,
        createdAt: ts,
        updatedAt: ts,
        deletedAt: null,
      };

      let notifications = state.notifications || [];
      notifications = [
        {
          id: `notif-ci-new-${Date.now()}`,
          title: `New Compliance Issue Reported`,
          message: `"${newIssue.title}" has been opened for ${newIssue.departmentName}. Severity: ${newIssue.severity}.`,
          timestamp: ts,
          read: false,
          type: 'alert',
        },
        ...notifications,
      ];

      return {
        ...state,
        complianceIssues: [...state.complianceIssues, newIssue],
        notifications,
      };
    }

    case 'UPDATE_COMPLIANCE_ISSUE': {
      const merged = state.complianceIssues.map((ci) => {
        if (ci.id !== action.payload.id) return ci;
        return { ...ci, ...action.payload, updatedAt: ts };
      });
      
      const overdueResults = checkOverdueIssues(merged, state.notifications || []);
      let notifications = overdueResults.updatedNotifications;
      const original = state.complianceIssues.find(c => c.id === action.payload.id);
      if (original) {
        if (action.payload.status && action.payload.status !== original.status) {
          notifications = [
            {
              id: `notif-ci-status-${Date.now()}`,
              title: `Compliance Status Updated`,
              message: `Issue "${original.title}" changed status from ${original.status} to ${action.payload.status}.`,
              timestamp: ts,
              read: false,
              type: 'info'
            },
            ...notifications
          ];
        }
        if (action.payload.ownerId && action.payload.ownerId !== original.ownerId) {
          notifications = [
            {
              id: `notif-ci-owner-${Date.now()}`,
              title: `Compliance Issue Reassigned`,
              message: `Issue "${original.title}" was reassigned to ${action.payload.ownerName}.`,
              timestamp: ts,
              read: false,
              type: 'info'
            },
            ...notifications
          ];
        }
      }

      return {
        ...state,
        complianceIssues: overdueResults.updatedIssues,
        notifications
      };
    }

    case 'RESOLVE_COMPLIANCE_ISSUE': {
      const updatedIssues = state.complianceIssues.map((issue) =>
        issue.id === action.payload.issueId
          ? {
              ...issue,
              status: 'Resolved' as const,
              updatedAt: ts,
            }
          : issue
      );

      return {
        ...state,
        complianceIssues: updatedIssues,
      };
    }

    case 'ACKNOWLEDGE_POLICY': {
      const { policyId, employeeId } = action.payload;
      const emp = state.employees.find((e) => e.id === employeeId);
      if (!emp) return state;

      const newAck: PolicyAcknowledgement = {
        id: `ack-${Date.now()}`,
        employeeId,
        employeeName: emp.name,
        policyId,
        acknowledgedDate: ts,
        status: 'Acknowledged',
        createdAt: ts,
        updatedAt: ts,
        deletedAt: null,
      };

      const updatedAcks = [...state.policyAcknowledgements, newAck];
      
      // Recompute acceptance rates for this policy
      const updatedPolicies = state.esgPolicies.map((p) => {
        if (p.id !== policyId) return p;
        const rate = calculateAcceptanceRate(policyId, updatedAcks, state.employees.length);
        
        // Auto flip to Review if rate drops below 50%
        const nextStatus = rate < 50 ? ('Review' as const) : ('Active' as const);
        
        return {
          ...p,
          acceptanceRate: rate,
          status: nextStatus,
          updatedAt: ts,
        };
      });

      // Check if policy status flipped to Review to generate notification warning
      let notifications = state.notifications || [];
      const flipped = updatedPolicies.find(p => p.id === policyId && p.status === 'Review');
      if (flipped) {
        notifications = [
          {
            id: `notif-pol-review-${Date.now()}`,
            title: `Policy Under Review: ${flipped.name}`,
            message: `Acceptance rate has dropped to ${flipped.acceptanceRate}%, requiring standard review.`,
            timestamp: ts,
            read: false,
            type: 'warning',
          },
          ...notifications,
        ];
      }

      return {
        ...state,
        policyAcknowledgements: updatedAcks,
        esgPolicies: updatedPolicies,
        notifications,
      };
    }

    case 'UPDATE_POLICY': {
      const { id, triggerReminder, ...rest } = action.payload;
      const original = state.esgPolicies.find((p) => p.id === id);
      if (!original) return state;

      let nextAcks = state.policyAcknowledgements;
      let nextRate = original.acceptanceRate;

      // If version is updated, reset acknowledgement tracking
      const versionChanged = rest.version && rest.version !== original.version;
      if (versionChanged) {
        nextAcks = state.policyAcknowledgements.filter((ack) => ack.policyId !== id);
        nextRate = 0; // resets rate
      }

      const updatedPolicies = state.esgPolicies.map((p) =>
        p.id === id ? { ...p, ...rest, acceptanceRate: nextRate, updatedAt: ts } : p
      );

      let notifications = state.notifications || [];
      if (triggerReminder || versionChanged) {
        // Trigger policy acknowledgement reminders
        state.employees.forEach((emp) => {
          notifications = [
            {
              id: `notif-pol-rem-${emp.id}-${Date.now()}`,
              title: `Action Required: Acknowledge ${rest.name || original.name}`,
              message: `A new version (${rest.version || original.version}) of "${rest.name || original.name}" has been published. Please sign acknowledgement.`,
              timestamp: ts,
              read: false,
              type: 'warning',
            },
            ...notifications,
          ];
        });
      }

      return {
        ...state,
        esgPolicies: updatedPolicies,
        policyAcknowledgements: nextAcks,
        notifications,
      };
    }

    case 'ADD_AUDIT': {
      const newAudit: Audit = {
        ...action.payload,
        id: `aud-${Date.now()}`,
        status: 'Pending',
        reportFile: null,
        createdAt: ts,
        updatedAt: ts,
        deletedAt: null,
      };
      return {
        ...state,
        audits: [...state.audits, newAudit],
      };
    }

    case 'COMPLETE_AUDIT': {
      const { auditId, score, reportFile, findings, departmentId, departmentName } = action.payload;
      const targetAudit = state.audits.find(a => a.id === auditId);
      if (!targetAudit) return state;

      const updatedAudits = state.audits.map(a => 
        a.id === auditId ? { ...a, status: 'Completed' as const, score, reportFile, updatedAt: ts } : a
      );

      // Auto-generate linked ComplianceIssue from findings (Prompt 16)
      const targetDueDate = new Date();
      targetDueDate.setDate(targetDueDate.getDate() + 30); // 30 days due date
      const targetDueDateStr = targetDueDate.toISOString().slice(0, 10);

      const autoIssue: ComplianceIssue = {
        id: `ci-audit-${Date.now()}`,
        title: `Audit Exception: ${targetAudit.title}`,
        severity: 'High',
        departmentId,
        departmentName,
        dueDate: targetDueDateStr,
        status: 'Open',
        ownerId: 'emp-3', // Priya Patel
        ownerName: 'Priya Patel',
        description: `Auto-generated compliance exception based on completed audit findings: ${findings}`,
        relatedAuditId: auditId,
        isOverdue: false,
        createdAt: ts,
        updatedAt: ts,
        deletedAt: null,
      };

      let notifications = state.notifications || [];
      notifications = [
        {
          id: `notif-audit-comp-${Date.now()}`,
          title: `Audit Completed: ${targetAudit.title}`,
          message: `Audit scored ${score}. High-severity compliance exception raised automatically for HR department.`,
          timestamp: ts,
          read: false,
          type: 'alert',
        },
        ...notifications,
      ];

      return {
        ...state,
        audits: updatedAudits,
        complianceIssues: [...state.complianceIssues, autoIssue],
        notifications,
      };
    }

    case 'RUN_OVERDUE_CHECK': {
      const overdueResults = checkOverdueIssues(state.complianceIssues, state.notifications || []);
      return {
        ...state,
        complianceIssues: overdueResults.updatedIssues,
        notifications: overdueResults.updatedNotifications,
      };
    }

    default:
      return state;
  }
}

// ── Context Shape ─────────────────────────────────────────────────────────────

interface EcoSphereContextValue {
  state: EcoSphereState;
  dispatch: React.Dispatch<Action>;
  activeTransactions: CarbonTransaction[];
  activeFactors: EmissionFactor[];
  activeDepartments: Department[];
  activeGoals: EnvironmentalGoal[];
  activeMetrics: EnvironmentalMetric[];
  activeNotifications: AppNotification[];
  overallEsgScore: number;
  // Social/CSR
  activeCSRActivities: CSRActivity[];
  activeParticipations: EmployeeParticipation[];
  activeChallengeParticipations: ChallengeParticipation[];
  activeEmployees: Employee[];
  activeCategories: Category[];
  activeDiversityMetrics: DiversityMetric[];
  // Governance
  activePolicies: ESGPolicy[];
  activeAcknowledgements: PolicyAcknowledgement[];
  activeAudits: Audit[];
  activeComplianceIssues: ComplianceIssue[];
}

const EcoSphereContext = createContext<EcoSphereContextValue | null>(null);

// ── Department & Weight Math helpers ───────────────────────────────────────────

const STATIC_GOV_SCORES: Record<string, number> = {
  'dept-it': 80,
  'dept-hr': 90,
  'dept-fin': 85,
  'dept-log': 75,
  'dept-mfg': 70,
};

// ── Provider ──────────────────────────────────────────────────────────────────

export function EcoSphereProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const customDispatch = (action: Action) => {
    dispatch(action);

    // Asynchronously persist modification actions to the backend database
    (async () => {
      try {
        const translateToDbDeptId = (id: string) => {
          if (id === 'dept-it') return 4;
          if (id === 'dept-hr') return 5;
          if (id === 'dept-log') return 6;
          return parseInt(id) || 4;
        };

        if (action.type === 'ADD_TRANSACTION') {
          const payload = action.payload;
          await fetch('/api/environmental/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fuelTypeId: payload.fuelTypeId,
              fuelType: payload.fuelType,
              departmentId: translateToDbDeptId(payload.departmentId),
              quantity: payload.quantity,
              calculatedTco2e: (payload.quantity * payload.emissionFactor.co2eFactor) / 1000,
              limit: payload.limit,
              deadline: payload.deadline,
              status: 'On Track',
              sourceType: 'Manual',
              progress: Math.round(((payload.quantity * payload.emissionFactor.co2eFactor / 1000) / (payload.limit || 1)) * 10000) / 100,
            }),
          });
        } else if (action.type === 'ADD_COMPLIANCE_ISSUE') {
          const payload = action.payload;
          await fetch('/api/governance/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: payload.title,
              severity: payload.severity,
              departmentId: translateToDbDeptId(payload.departmentId),
              dueDate: payload.dueDate,
              ownerId: 1, // Default owner ID
              description: payload.description,
              status: 'Open',
              isOverdue: false,
              relatedAuditId: payload.relatedAuditId ? parseInt(payload.relatedAuditId.replace('aud-', '')) : null,
            }),
          });
        } else if (action.type === 'ADD_AUDIT') {
          const payload = action.payload;
          await fetch('/api/governance/audits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: payload.title,
              date: payload.date,
              auditor: payload.auditor,
              score: payload.score || '-',
              status: 'Pending',
              reportFile: null,
            }),
          });
        }
      } catch (err) {
        console.error("Failed to persist action in background database:", err);
      }
    })();
  };

  // Trigger overdue checks periodically (Prompt 3 stub cron job) and sync live database state
  useEffect(() => {
    dispatch({ type: 'RUN_OVERDUE_CHECK' });
    const timer = setInterval(() => {
      dispatch({ type: 'RUN_OVERDUE_CHECK' });
    }, 60000); // scan issues every minute

    async function loadData() {
      try {
        const [depts, txs, goals, policies, acks, audits, issues, emps] = await Promise.all([
          api.departments(),
          fetch('/api/environmental/transactions').then(r => r.json()),
          fetch('/api/environmental/goals').then(r => r.json()),
          fetch('/api/governance/policies').then(r => r.json()),
          fetch('/api/governance/policy-acknowledgements').then(r => r.json()),
          fetch('/api/governance/audits').then(r => r.json()),
          fetch('/api/governance/issues').then(r => r.json()),
          api.employees(),
        ]);

        const translateDeptId = (id: number | string) => {
          const idStr = id.toString();
          if (idStr === '1' || idStr === '4' || idStr === 'dept-it') return 'dept-it';
          if (idStr === '2' || idStr === '5' || idStr === 'dept-hr') return 'dept-hr';
          if (idStr === '3' || idStr === '6' || idStr === 'dept-log') return 'dept-log';
          return idStr;
        };

        dispatch({
          type: 'INITIALIZE_STATE',
          payload: {
            departments: depts.map(d => ({
              ...d,
              id: translateDeptId(d.id),
              employeeCount: d.employees,
              score: d.score,
              head: d.head || 'Unassigned',
            })) as any,
            carbonTransactions: txs.map((t: any) => ({
              ...t,
              id: `tx-${t.id}`,
              departmentId: translateDeptId(t.departmentId),
              calculatedTCO2e: Number(t.calculatedTco2e ?? t.calculatedTCO2e ?? 0),
            })),
            environmentalGoals: goals.map((g: any) => ({
              ...g,
              id: `sg-${g.id}`,
              departmentId: g.departmentId ? translateDeptId(g.departmentId) : null,
            })),
            esgPolicies: policies.map((p: any) => ({
              ...p,
              id: `pol-${p.id}`,
            })),
            policyAcknowledgements: acks.map((a: any) => ({
              ...a,
              id: `ack-${a.id}`,
              policyId: `pol-${a.policyId}`,
              employeeId: `emp-${a.employeeId}`,
            })),
            audits: audits.map((a: any) => ({
              ...a,
              id: `aud-${a.id}`,
            })),
            complianceIssues: issues.map((c: any) => ({
              ...c,
              id: `iss-${c.id}`,
              departmentId: translateDeptId(c.departmentId),
              ownerId: `emp-${c.ownerId}`,
              relatedAuditId: c.relatedAuditId ? `aud-${c.relatedAuditId}` : null,
            })),
            employees: emps.map((e: any) => ({
              ...e,
              id: `emp-${e.id}`,
              departmentId: translateDeptId(e.departmentId),
            })),
          }
        });
      } catch (err) {
        console.warn("Failed to load live database state, falling back to client-side mocks:", err);
      }
    }
    loadData();

    return () => clearInterval(timer);
  }, []);

  const activeTxs = state.carbonTransactions.filter((t) => !t.deletedAt);
  const activeFactors = state.emissionFactors.filter((f) => !f.deletedAt);
  const activeGoals = state.environmentalGoals.filter((g) => !g.deletedAt);
  const activeMetrics = (state.environmentalMetrics || []).filter((m) => !m.deletedAt);
  const activeNotifs = (state.notifications || []).filter((n) => !n.read);

  // Social active records
  const activeCSRActivities = (state.csrActivities || []).filter((c) => !c.deletedAt);
  const activeParticipations = (state.employeeParticipations || []).filter((p) => !p.deletedAt);
  const activeChallengeParticipations = (state.challengeParticipations || []).filter((p) => !p.deletedAt);
  const activeEmployees = (state.employees || []).filter((e) => !e.deletedAt);
  const activeCategories = state.categories || [];
  const activeDiversityMetrics = (state.diversityMetrics || []).filter((d) => !d.deletedAt);

  // Governance active records
  const activePolicies = (state.esgPolicies || []).filter((p) => !p.deletedAt);
  const activeAcknowledgements = (state.policyAcknowledgements || []).filter((a) => !a.deletedAt);
  const activeAudits = (state.audits || []).filter((a) => !a.deletedAt);
  const activeComplianceIssues = (state.complianceIssues || []).filter((c) => !c.deletedAt);

  // Dynamic ESG Rollup Calculations per department (Phases 6 & 7 / Prompt 15)
  const dynamicDepartments: Department[] = state.departments
    .filter((d) => !d.deletedAt)
    .map((dept) => {
      // 1. Environmental Score
      const deptTxs = activeTxs.filter((t) => t.departmentId === dept.id);
      let txScore = 100;
      if (deptTxs.length > 0) {
        const avgProgress = deptTxs.reduce((sum, t) => sum + t.progress, 0) / deptTxs.length;
        txScore = Math.max(0, Math.min(100, 100 - (avgProgress - 80) * 4));
      }

      const deptGoals = activeGoals.filter((g) => g.departmentId === dept.id);
      let goalScore = 100;
      if (deptGoals.length > 0) {
        goalScore = deptGoals.reduce((sum, g) => sum + g.progress, 0) / deptGoals.length;
      }
      const envScore = Math.round(0.5 * txScore + 0.5 * goalScore);

      // 2. Social Score (Prompt 15)
      const deptApprovedCSR = activeParticipations.filter(
        (p) => p.approvalStatus === 'Approved' && 
          (activeEmployees.find(e => e.id === p.employeeId)?.department === dept.name ||
           (dept.name === 'IT' && p.employeeId === 'emp-6')) // seed mapping
      );
      const deptCSRPoints = deptApprovedCSR.reduce((sum, p) => sum + p.pointsEarned, 0);

      const hasDiversityData = activeDiversityMetrics.filter(m => m.departmentId === dept.id).length > 0;
      const diversityBonus = hasDiversityData ? 10 : 0;

      const dynamicSocScore = Math.min(100, 70 + Math.round(deptCSRPoints / 10) + diversityBonus);

      // 3. Governance Score (computes based on active resolved compliance rate + policy acknowledgement rate + audit readiness)
      // 3a. Policy acceptance rate
      const avgPolicyAcceptance = activePolicies.length > 0
        ? Math.round(activePolicies.reduce((sum, p) => sum + p.acceptanceRate, 0) / activePolicies.length)
        : 92;

      // 3b. Ratio of resolved vs open ComplianceIssues weighted by severity
      const deptIssues = activeComplianceIssues.filter(c => c.departmentId === dept.id);
      let issueScore = 100;
      if (deptIssues.length > 0) {
        const severityMap = { High: 3, Medium: 2, Low: 1 };
        const totalWeight = deptIssues.reduce((sum, issue) => sum + severityMap[issue.severity], 0);
        const resolvedWeight = deptIssues.filter(issue => issue.status === 'Resolved')
                                         .reduce((sum, issue) => sum + severityMap[issue.severity], 0);
        issueScore = Math.round((resolvedWeight / totalWeight) * 100);
      }

      // 3c. Audit readiness
      const completedAudits = activeAudits.filter(a => a.status === 'Completed').length;
      const progressAudits = activeAudits.filter(a => a.status === 'In Progress').length;
      const totalAudits = activeAudits.length;
      const auditReadiness = totalAudits > 0 
        ? Math.round(((completedAudits * 100) + (progressAudits * 50)) / totalAudits)
        : 85;

      const dynamicGovScore = Math.round((avgPolicyAcceptance + issueScore + auditReadiness) / 3);

      // Overall ESG rollup
      const { envWeight = 40, socWeight = 30, govWeight = 30 } = state.settings || {};
      const overallScore = Math.round(
        (envScore * envWeight + dynamicSocScore * socWeight + dynamicGovScore * govWeight) / 100
      );

      return {
        ...dept,
        score: envScore,
        socialScore: dynamicSocScore,
        governanceScore: dynamicGovScore,
        esgOverall: overallScore
      } as Department & { esgOverall: number; socialScore: number; governanceScore: number };
    });

  const totalEsgScore = dynamicDepartments.length > 0
    ? Math.round(dynamicDepartments.reduce((sum, d: any) => sum + d.esgOverall, 0) / dynamicDepartments.length)
    : 81;

  const value: EcoSphereContextValue = {
    state,
    dispatch: customDispatch,
    activeTransactions: activeTxs,
    activeFactors,
    activeDepartments: dynamicDepartments,
    activeGoals,
    activeMetrics,
    activeNotifications: activeNotifs,
    overallEsgScore: totalEsgScore,
    // Social / CSR
    activeCSRActivities,
    activeParticipations,
    activeChallengeParticipations,
    activeEmployees,
    activeCategories,
    activeDiversityMetrics,
    // Governance
    activePolicies,
    activeAcknowledgements,
    activeAudits,
    activeComplianceIssues,
  };

  return (
    <EcoSphereContext.Provider value={value}>
      {children}
    </EcoSphereContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useEcoSphere(): EcoSphereContextValue {
  const ctx = useContext(EcoSphereContext);
  if (!ctx) throw new Error('useEcoSphere must be used within <EcoSphereProvider>');
  return ctx;
}
