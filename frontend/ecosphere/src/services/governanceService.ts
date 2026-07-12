// ─────────────────────────────────────────────────────────────────────────────
// EcoSphere — Governance & Compliance Service
// Policy acceptance, field validations, and overdue issue checker logic.
// ─────────────────────────────────────────────────────────────────────────────

import type { ESGPolicy, PolicyAcknowledgement, ComplianceIssue, AppNotification } from '@/types';

/**
 * Computes a policy's acceptance rate.
 * Formula: (Count of Acknowledged) / (Total active employees count) * 100
 *
 * @param policyId         The ID of the target policy
 * @param acknowledgements Array of all acknowledgement records
 * @param employeeCount    Total count of active employees in organization
 * @returns                Percentage rate (0 to 100)
 */
export function calculateAcceptanceRate(
  policyId: string,
  acknowledgements: PolicyAcknowledgement[],
  employeeCount: number
): number {
  if (employeeCount <= 0) return 0;
  
  const acknowledgedCount = acknowledgements.filter(
    (a) => a.policyId === policyId && a.status === 'Acknowledged'
  ).length;

  return Math.min(100, Math.round((acknowledgedCount / employeeCount) * 100));
}

/**
 * Validates details of a new Compliance Issue record at creation time.
 * Enforces: Assigned Owner and Due Date are mandatory at creation time.
 *
 * @param issue Partial compliance issue detail to validate
 */
export function validateComplianceIssue(issue: {
  title: string;
  ownerId: string;
  dueDate: string;
}): void {
  if (!issue.title.trim()) {
    throw new Error('Validation Blocked: Compliance issue title is required.');
  }
  if (!issue.ownerId) {
    throw new Error('Validation Blocked: Compliance issue must have an assigned Owner at creation.');
  }
  if (!issue.dueDate) {
    throw new Error('Validation Blocked: Compliance issue must have a specified Due Date at creation.');
  }
}

/**
 * Scheduled job simulator checking for overdue compliance issues.
 * Sets isOverdue flag and appends notifications to the system.
 *
 * @param issues        Active compliance issue records list
 * @param notifications Active system notifications list
 * @returns             An object containing updated issues list and updated notifications list
 */
export function checkOverdueIssues(
  issues: ComplianceIssue[],
  notifications: AppNotification[]
): {
  updatedIssues: ComplianceIssue[];
  updatedNotifications: AppNotification[];
} {
  const today = new Date().toISOString().slice(0, 10);
  let hasChanges = false;
  let nextNotifs = [...notifications];

  const nextIssues = issues.map((issue) => {
    if (issue.status !== 'Resolved' && issue.dueDate < today && !issue.isOverdue) {
      hasChanges = true;
      const title = `Overdue Compliance Issue: ${issue.title}`;
      const message = `Issue has passed its due date (${issue.dueDate}) and remains unresolved. Department: ${issue.departmentName}.`;

      // Prevent duplicates
      if (!nextNotifs.find((n) => n.title === title && !n.read)) {
        nextNotifs = [
          {
            id: `notif-overdue-${issue.id}-${Date.now()}`,
            title,
            message,
            timestamp: today,
            read: false,
            type: 'alert',
          },
          ...nextNotifs,
        ];
      }

      return {
        ...issue,
        isOverdue: true,
        updatedAt: today,
      };
    }
    return issue;
  });

  return {
    updatedIssues: nextIssues,
    updatedNotifications: nextNotifs,
  };
}
