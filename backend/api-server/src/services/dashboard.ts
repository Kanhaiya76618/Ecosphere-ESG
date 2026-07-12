import {
  db,
  departmentsTable,
  employeesTable,
  esgConfigurationsTable,
  esgScoreHistoryTable,
  environmentalGoalsTable,
  carbonTransactionsTable,
  esgPoliciesTable,
  policyAcknowledgementsTable,
  auditsTable,
  complianceIssuesTable,
  challengeParticipationsTable,
} from "@workspace/db";
import { eq, and, isNull, desc } from "drizzle-orm";

// Interface for ESG Summary
export interface ESGSummary {
  environmental: number;
  environmentalChange: number;
  social: number;
  socialChange: number;
  governance: number;
  governanceChange: number;
  overall: number;
  overallChange: number;
}

// ── Overall ESG Score computation & Rollup (Prompt 2 & 3) ───────────────────────
export async function getOrgESGSummary(departmentId?: number): Promise<ESGSummary> {
  // 1. Fetch ESG Configuration weights
  const configs = await db.select().from(esgConfigurationsTable).limit(1);
  const config = configs[0] || { envWeight: 40, socWeight: 30, govWeight: 30 };
  const { envWeight, socWeight, govWeight } = config;

  // 2. Fetch all departments or filter
  const depts = await db.select().from(departmentsTable);
  const targetDepts = departmentId ? depts.filter(d => d.id === departmentId) : depts;

  if (targetDepts.length === 0) {
    return {
      environmental: 80, environmentalChange: 0,
      social: 80, socialChange: 0,
      governance: 80, governanceChange: 0,
      overall: 80, overallChange: 0,
    };
  }

  let totalEnv = 0;
  let totalSoc = 0;
  let totalGov = 0;

  for (const dept of targetDepts) {
    // ── Calculate Environmental Score for Department ──
    const txs = await db.select().from(carbonTransactionsTable).where(eq(carbonTransactionsTable.departmentId, dept.id));
    let txScore = 80;
    if (txs.length > 0) {
      const avgProgress = txs.reduce((sum, t) => sum + t.progress, 0) / txs.length;
      txScore = Math.max(0, 100 - avgProgress);
    }

    const goals = await db.select().from(environmentalGoalsTable).where(
      departmentId 
        ? eq(environmentalGoalsTable.departmentId, dept.id)
        : isNull(environmentalGoalsTable.departmentId)
    );
    let goalScore = 80;
    if (goals.length > 0) {
      goalScore = goals.reduce((sum, g) => sum + g.progress, 0) / goals.length;
    }
    const envScore = Math.round(0.5 * txScore + 0.5 * goalScore);

    // ── Calculate Social Score for Department ──
    // Get all approved challenge participations for employees of this department
    const employees = await db.select().from(employeesTable).where(eq(employeesTable.departmentId, dept.id));
    const empIds = employees.map(e => e.id);
    let csrPoints = 0;
    if (empIds.length > 0) {
      const participations = await db.select().from(challengeParticipationsTable).where(
        eq(challengeParticipationsTable.approvalStatus, "approved")
      );
      const deptParticipations = participations.filter(p => empIds.includes(p.employeeId));
      csrPoints = deptParticipations.reduce((sum, p) => sum + p.xpAwarded, 0);
    }
    // Simple mock diversity bonus rule (standard +10 if department exists)
    const diversityBonus = 10;
    const socScore = Math.min(100, 70 + Math.round(csrPoints / 10) + diversityBonus);

    // ── Calculate Governance Score for Department ──
    // 3a. Policy acceptance rate
    const policies = await db.select().from(esgPoliciesTable);
    const acks = await db.select().from(policyAcknowledgementsTable);
    const totalEmployees = await db.select().from(employeesTable);
    const employeeCount = totalEmployees.length || 1;

    let avgPolicyAcceptance = 92;
    if (policies.length > 0 && acks.length > 0) {
      const policyRates = policies.map(p => {
        const acknowledgedCount = acks.filter(a => a.policyId === p.id && a.status === "Acknowledged").length;
        return Math.min(100, Math.round((acknowledgedCount / employeeCount) * 100));
      });
      avgPolicyAcceptance = Math.round(policyRates.reduce((sum, r) => sum + r, 0) / policies.length);
    }

    // 3b. Compliance issues
    const issues = await db.select().from(complianceIssuesTable).where(eq(complianceIssuesTable.departmentId, dept.id));
    let issueScore = 100;
    if (issues.length > 0) {
      const severityMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      const totalWeight = issues.reduce((sum, issue) => sum + (severityMap[issue.severity] || 1), 0);
      const resolvedWeight = issues.filter(issue => issue.status === "Resolved")
                                   .reduce((sum, issue) => sum + (severityMap[issue.severity] || 1), 0);
      issueScore = Math.round((resolvedWeight / totalWeight) * 100);
    }

    // 3c. Audit readiness
    const audits = await db.select().from(auditsTable);
    let auditReadiness = 85;
    if (audits.length > 0) {
      const completedAudits = audits.filter(a => a.status === "Completed").length;
      const progressAudits = audits.filter(a => a.status === "In Progress").length;
      auditReadiness = Math.round(((completedAudits * 100) + (progressAudits * 50)) / audits.length);
    }

    const govScore = Math.round((avgPolicyAcceptance + issueScore + auditReadiness) / 3);

    totalEnv += envScore;
    totalSoc += socScore;
    totalGov += govScore;
  }

  const avgEnv = Math.round(totalEnv / targetDepts.length);
  const avgSoc = Math.round(totalSoc / targetDepts.length);
  const avgGov = Math.round(totalGov / targetDepts.length);
  const overallScore = Math.round((avgEnv * envWeight + avgSoc * socWeight + avgGov * govWeight) / 100);

  // 3. Fetch past snapshot for % change calculation
  const scopeText = departmentId ? "Department" : "Company-wide";
  const historyQuery = db.select().from(esgScoreHistoryTable).where(
    and(
      eq(esgScoreHistoryTable.scope, scopeText),
      departmentId ? eq(esgScoreHistoryTable.departmentId, departmentId) : isNull(esgScoreHistoryTable.departmentId)
    )
  ).orderBy(desc(esgScoreHistoryTable.createdAt)).limit(1);
  const history = await historyQuery;
  const prev = history[0];

  const calcChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return 0.0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  };

  return {
    environmental: avgEnv,
    environmentalChange: calcChange(avgEnv, prev?.environmentalScore),
    social: avgSoc,
    socialChange: calcChange(avgSoc, prev?.socialScore),
    governance: avgGov,
    governanceChange: calcChange(avgGov, prev?.governanceScore),
    overall: overallScore,
    overallChange: calcChange(overallScore, prev?.overallScore),
  };
}

// ── Trailing 12 Months Score History (Prompt 6) ──────────────────────────────
export async function getESGScoreHistory(departmentId?: number) {
  const scopeText = departmentId ? "Department" : "Company-wide";
  const history = await db.select().from(esgScoreHistoryTable).where(
    and(
      eq(esgScoreHistoryTable.scope, scopeText),
      departmentId ? eq(esgScoreHistoryTable.departmentId, departmentId) : isNull(esgScoreHistoryTable.departmentId)
    )
  ).orderBy(esgScoreHistoryTable.id); // sorted in ascending order of time

  // Limit to trailing 12 records
  return history.slice(-12);
}

// ── Department Rollups (Prompt 3 & 7) ─────────────────────────────────────────
export async function getDepartmentScores() {
  const depts = await db.select().from(departmentsTable);
  const results = [];
  for (const dept of depts) {
    const summary = await getOrgESGSummary(dept.id);
    results.push({
      id: dept.id,
      name: dept.name,
      code: dept.code,
      score: summary.overall,
      environmental: summary.environmental,
      social: summary.social,
      governance: summary.governance,
    });
  }
  return results;
}

// ── Recent Carbon Transactions (Prompt 8 & 9) ─────────────────────────────────
export async function getRecentTransactions(limitCount = 4) {
  return db.select()
    .from(carbonTransactionsTable)
    .orderBy(desc(carbonTransactionsTable.createdAt))
    .limit(limitCount);
}

// ── Create End-Of-Month Snapshot Job (Prompt 1) ───────────────────────────────
export async function createScoreSnapshot(dateStr: string) {
  console.log(`Generating monthly ESG snapshot for ${dateStr}...`);
  // 1. Generate Company-wide snapshot
  const summary = await getOrgESGSummary();
  await db.insert(esgScoreHistoryTable).values({
    date: dateStr,
    environmentalScore: summary.environmental,
    socialScore: summary.social,
    governanceScore: summary.governance,
    overallScore: summary.overall,
    scope: "Company-wide",
    departmentId: null
  });

  // 2. Generate Department snapshots
  const depts = await db.select().from(departmentsTable);
  for (const dept of depts) {
    const summaryDept = await getOrgESGSummary(dept.id);
    await db.insert(esgScoreHistoryTable).values({
      date: dateStr,
      environmentalScore: summaryDept.environmental,
      socialScore: summaryDept.social,
      governanceScore: summaryDept.governance,
      overallScore: summaryDept.overall,
      scope: "Department",
      departmentId: dept.id
    });
  }
  console.log("End-of-month ESG snapshot completed.");
}
