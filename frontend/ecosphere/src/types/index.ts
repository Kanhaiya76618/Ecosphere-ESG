// ─────────────────────────────────────────────────────────────────────────────
// EcoSphere — Core Type Definitions
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared ────────────────────────────────────────────────────────────────────

/** ISO 8601 date string, e.g. "2026-07-12" */
export type ISODate = string;

/** Soft-delete + audit timestamps present on every record */
export interface BaseRecord {
  createdAt: ISODate;
  updatedAt: ISODate;
  deletedAt: ISODate | null; // null = not deleted (soft-delete flag)
}

// ── Department ─────────────────────────────────────────────────────────────────

export type DepartmentStatus = 'Active' | 'Inactive';

export interface Department extends BaseRecord {
  id: string;
  name: string;
  code: string;          // e.g. "IT", "MFG"
  head: string;          // Person's name
  parentDeptId: string | null; // FK → Department.id; null = top-level
  employeeCount: number;
  status: DepartmentStatus;
  /** Aggregated ESG score, 0–100 */
  score: number;
}

// ── EmissionFactor ─────────────────────────────────────────────────────────────

export type EmissionScope = 1 | 2;

export interface EmissionFactor extends BaseRecord {
  id: string;
  fuelType: string;        // e.g. "Diesel", "Electricity"
  scope: EmissionScope;    // GHG Protocol Scope 1 or 2
  /** CO2 equivalent factor per unit, e.g. 2.68 kg CO2/L */
  co2eFactor: number;
  /** Unit of measurement for the fuel quantity, e.g. "L", "kWh", "m³" */
  unit: string;
  /** Date from which this factor is effective */
  effectiveDate: ISODate;
}

// ── CarbonTransaction ──────────────────────────────────────────────────────────

export type TransactionStatus = 'On Track' | 'At Risk' | 'Overdue';
export type SourceType = 'Manual' | 'Auto-calculated';

export interface CarbonTransaction extends BaseRecord {
  id: string;
  /** FK → EmissionFactor.id */
  fuelTypeId: string;
  /** Resolved fuel type label for display convenience */
  fuelType: string;
  /** FK → Department.id */
  departmentId: string;
  /** Resolved department label for display convenience */
  department: string;
  /** Quantity of fuel/energy consumed in the emission factor's unit */
  quantity: number;
  /** quantity × emissionFactor.co2eFactor / 1000 */
  calculatedTCO2e: number;
  /** Emission limit / target in kg CO2e */
  limit: number;
  /** Carbon budget deadline */
  deadline: ISODate;
  status: TransactionStatus;
  sourceType: SourceType;
  /** Progress percentage: (calculatedTCO2e / limit) × 100  */
  progress: number;
}

// ── EnvironmentalGoal ──────────────────────────────────────────────────────────

export type MetricType =
  | 'Emissions (tCO2e)'
  | 'Energy (kWh)'
  | 'Water (kL)'
  | 'Waste (%)'
  | 'Vehicles (EV)'
  | 'Custom';

export interface EnvironmentalGoal extends BaseRecord {
  id: string;
  title: string;
  metricType: MetricType;
  targetValue: number;
  currentValue: number;
  /** Derived: (currentValue / targetValue) × 100 */
  progress: number;
  unit: string;
  deadline: ISODate;
  /** FK → Department.id; null = company-wide */
  departmentId: string | null;
}

// ── EnvironmentalMetric ────────────────────────────────────────────────────────

export type MetricCategory = 'Water' | 'Waste';

export interface EnvironmentalMetric extends BaseRecord {
  id: string;
  category: MetricCategory;
  value: number; // raw value (e.g. kL of water or % of waste diverted)
  unit: string;  // e.g. "kL", "%"
  departmentId: string;
  department: string;
  date: ISODate;
}

// ── AppNotification ───────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: ISODate;
  read: boolean;
  type: 'info' | 'warning' | 'alert';
}

// ── CSR Activity Category ──────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  type: 'CSR Activity' | 'Environmental' | 'Governance';
}

// ── CSR Activity Campaign ─────────────────────────────────────────────────────

export interface CSRActivity extends BaseRecord {
  id: string;
  title: string;
  categoryId: string; // FK to Category (Type = 'CSR Activity')
  category: string;   // resolved label (e.g. "Sustainability")
  description: string;
  date: ISODate;
  status: 'Upcoming' | 'Active' | 'Completed';
  pointsAvailable: number;
  location: string;
  participants: string[]; // List of Employee.id (many-to-many confirmed participants)
}

// ── Employee Participation Submission ──────────────────────────────────────────

export interface EmployeeParticipation extends BaseRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  activityId: string;
  activityTitle: string;
  proofFile: string | null;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  pointsEarned: number;
  completionDate: ISODate | null;
}

// ── Employee Model ─────────────────────────────────────────────────────────────

export interface Employee extends BaseRecord {
  id: string;
  name: string;
  department: string;
  xp: number;
  badges: string[]; // array of Badge.id
}

// ── AppSettings ────────────────────────────────────────────────────────────────

export interface AppSettings {
  autoEmissionCalculation: boolean;
  envWeight: number; // default 40
  socWeight: number; // default 30
  govWeight: number; // default 30
  weeklyDigest: boolean;
  goalAtRiskAlerts: boolean;
  newComplianceIssues: boolean;
  gamificationApprovals: boolean;
  evidenceRequirement: boolean; // Section 8: Approved needs proof files
}

// ── User Roles ─────────────────────────────────────────────────────────────────

// ── Challenge Participation Submission (Gamification) ─────────────────────────

export interface ChallengeParticipation extends BaseRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  challengeId: string;
  challengeTitle: string;
  proofFile: string | null;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  pointsEarned: number;
  completionDate: ISODate | null;
}

// ── Diversity Metric Model (Phase 5 / Prompt 13) ──────────────────────────────

export interface DiversityMetric extends BaseRecord {
  id: string;
  departmentId: string | null; // FK to Department
  metricType: 'Gender' | 'Age Group' | 'Ethnicity';
  categoryValue: string; // e.g. "Female", "20-30", "Asian"
  count: number;
  snapshotDate: ISODate;
}

// ── Governance ESGPolicy Model ───────────────────────────────────────────────

export interface ESGPolicy extends BaseRecord {
  id: string;
  name: string;
  version: string;
  updatedDate: ISODate;
  description: string;
  acceptanceRate: number; // computed percentage
  status: 'Active' | 'Review' | 'Archived';
}

// ── PolicyAcknowledgement Model ───────────────────────────────────────────────

export interface PolicyAcknowledgement extends BaseRecord {
  id: string;
  employeeId: string; // FK to Employee
  employeeName: string;
  policyId: string; // FK to ESGPolicy
  acknowledgedDate: ISODate;
  status: 'Acknowledged' | 'Pending';
}

// ── Audit Model ───────────────────────────────────────────────────────────────

export interface Audit extends BaseRecord {
  id: string;
  title: string;
  date: ISODate;
  auditor: string;
  score: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  reportFile: string | null;
}

// ── ComplianceIssue Model ─────────────────────────────────────────────────────

export interface ComplianceIssue extends BaseRecord {
  id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High';
  departmentId: string; // FK to Department
  departmentName: string;
  dueDate: ISODate;
  status: 'Open' | 'In Progress' | 'Resolved';
  ownerId: string; // FK to Employee
  ownerName: string;
  description: string;
  relatedAuditId: string | null; // FK to Audit (optional)
  isOverdue: boolean;
}

export type UserRole = 'Sustainability Officer' | 'Employee' | 'Visitor';

// ── Store shape ────────────────────────────────────────────────────────────────

export interface EcoSphereState {
  departments: Department[];
  emissionFactors: EmissionFactor[];
  carbonTransactions: CarbonTransaction[];
  environmentalGoals: EnvironmentalGoal[];
  environmentalMetrics: EnvironmentalMetric[];
  categories: Category[];
  csrActivities: CSRActivity[];
  employeeParticipations: EmployeeParticipation[];
  challengeParticipations: ChallengeParticipation[];
  diversityMetrics: DiversityMetric[];
  employees: Employee[];
  esgPolicies: ESGPolicy[];
  policyAcknowledgements: PolicyAcknowledgement[];
  audits: Audit[];
  complianceIssues: ComplianceIssue[];
  settings: AppSettings & {
    hrisIntegrationConnected: boolean; // Integration flag
    hrisProvider: string | null;
  };
  notifications: AppNotification[];
  currentUserRole: UserRole;
}
