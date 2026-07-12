import {
  db,
  pool,
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
} from "@workspace/db";

async function seed() {
  console.log("Seeding ESG modules data...");

  // Retrieve departments and employees to link foreign keys properly
  const depts = await db.select().from(departmentsTable);
  const itDept = depts.find(d => d.code === "IT");
  const hrDept = depts.find(d => d.code === "HR");
  const logDept = depts.find(d => d.code === "LOG");

  if (!itDept || !hrDept || !logDept) {
    console.error("Please run pnpm run seed:gamification first to seed departments and employees.");
    process.exit(1);
  }

  const employees = await db.select().from(employeesTable);
  const rahul = employees.find(e => e.email === "rahul@ecosphere.io");
  const priya = employees.find(e => e.email === "priya@ecosphere.io");
  const vikram = employees.find(e => e.email === "vikram@ecosphere.io");

  if (!rahul || !priya || !vikram) {
    console.error("Please run pnpm run seed:gamification first to seed employees.");
    process.exit(1);
  }

  // Clear existing ESG data
  await db.delete(esgScoreHistoryTable);
  await db.delete(esgConfigurationsTable);
  await db.delete(environmentalGoalsTable);
  await db.delete(carbonTransactionsTable);
  await db.delete(policyAcknowledgementsTable);
  await db.delete(esgPoliciesTable);
  await db.delete(complianceIssuesTable);
  await db.delete(auditsTable);

  console.log("Seeding ESG Configurations...");
  await db.insert(esgConfigurationsTable).values([
    { envWeight: 40, socWeight: 30, govWeight: 30 }
  ]);

  console.log("Seeding Environmental Goals...");
  await db.insert(environmentalGoalsTable).values([
    {
      title: "Reduce Scope 2 Emissions by 15%",
      metricType: "Emissions (tCO2e)",
      targetValue: 4200,
      currentValue: 3800,
      progress: 90.47,
      unit: "tCO2e",
      deadline: "2026-12-31",
      departmentId: null
    },
    {
      title: "Transition Logistics to EVs",
      metricType: "Vehicles (EV)",
      targetValue: 50,
      currentValue: 15,
      progress: 30,
      unit: "Vehicles",
      deadline: "2027-06-30",
      departmentId: logDept.id
    },
    {
      title: "Zero Waste to Landfill",
      metricType: "Waste (%)",
      targetValue: 100,
      currentValue: 60,
      progress: 60,
      unit: "% Diverted",
      deadline: "2026-09-30",
      departmentId: null
    }
  ]);

  console.log("Seeding Carbon Transactions...");
  await db.insert(carbonTransactionsTable).values([
    {
      fuelTypeId: "ef-3",
      fuelType: "Electricity",
      departmentId: itDept.id,
      quantity: 2561,
      calculatedTco2e: 2.1,
      limit: 4500,
      deadline: "2026-12-31",
      status: "On Track",
      sourceType: "Auto-calculated",
      progress: 46.66
    },
    {
      fuelTypeId: "ef-1",
      fuelType: "Diesel",
      departmentId: logDept.id,
      quantity: 1791,
      calculatedTco2e: 4.8,
      limit: 5000,
      deadline: "2026-08-15",
      status: "On Track",
      sourceType: "Manual",
      progress: 96
    },
    {
      fuelTypeId: "ef-3",
      fuelType: "Electricity",
      departmentId: hrDept.id,
      quantity: 10366,
      calculatedTco2e: 8.5,
      limit: 12000,
      deadline: "2026-12-31",
      status: "On Track",
      sourceType: "Manual",
      progress: 70.83
    }
  ]);

  console.log("Seeding ESG Policies...");
  const policies = await db.insert(esgPoliciesTable).values([
    {
      title: "Code of Business Conduct and Ethics",
      version: "v2.1",
      content: "Details of ethics and integrity standards.",
      status: "Active",
      effectiveDate: "2026-01-01"
    },
    {
      title: "Environmental Sustainability & Carbon Reduction Policy",
      version: "v1.4",
      content: "Details of emission limits and recycling guidelines.",
      status: "Active",
      effectiveDate: "2026-01-01"
    },
    {
      title: "Supplier Human Rights and Anti-Modern Slavery Policy",
      version: "v1.0",
      content: "Details of human rights and labor compliance.",
      status: "Review",
      effectiveDate: "2026-09-01"
    }
  ]).returning();
  const [codeEthics, sustainability] = policies;

  console.log("Seeding Policy Acknowledgements...");
  await db.insert(policyAcknowledgementsTable).values([
    { policyId: codeEthics!.id, employeeId: rahul.id, status: "Acknowledged" },
    { policyId: codeEthics!.id, employeeId: priya.id, status: "Acknowledged" },
    { policyId: sustainability!.id, employeeId: rahul.id, status: "Acknowledged" },
    { policyId: sustainability!.id, employeeId: priya.id, status: "Pending" }
  ]);

  console.log("Seeding Audits...");
  const audits = await db.insert(auditsTable).values([
    {
      title: "Q2 Sustainability Compliance Audit",
      date: "2026-06-15",
      auditor: "SustainCorp Assurance Ltd",
      score: "88%",
      status: "Completed",
      reportFile: "sustain_audit_q2.pdf"
    },
    {
      title: "Q3 Occupational Health & Safety Audit",
      date: "2026-09-18",
      auditor: "Apex Health & Safety Group",
      score: "Pending",
      status: "Pending",
      reportFile: null
    },
    {
      title: "Internal Supply Chain Ethics Audit",
      date: "2026-11-05",
      auditor: "EcoSphere Internal Governance",
      score: "In Progress",
      status: "In Progress",
      reportFile: null
    }
  ]).returning();
  const [q2Audit] = audits;

  console.log("Seeding Compliance Issues...");
  await db.insert(complianceIssuesTable).values([
    {
      title: "Incomplete vendor safety checklists",
      severity: "Medium",
      departmentId: logDept.id,
      dueDate: "2026-08-30",
      ownerId: vikram.id,
      description: "Checklists missing from supplier logs",
      status: "Open",
      isOverdue: false,
      relatedAuditId: q2Audit!.id
    },
    {
      title: "Improper electronic waste disposal",
      severity: "High",
      departmentId: itDept.id,
      dueDate: "2026-07-05",
      ownerId: rahul.id,
      description: "E-waste mixed with standard bins",
      status: "Open",
      isOverdue: true,
      relatedAuditId: null
    },
    {
      title: "Incomplete OHS employee training logs",
      severity: "Low",
      departmentId: hrDept.id,
      dueDate: "2026-06-30",
      ownerId: priya.id,
      description: "OHS certificates missing for 4 remote hires",
      status: "Resolved",
      isOverdue: false,
      relatedAuditId: null
    }
  ]);

  console.log("Seeding ESG Score History Snapshots (last 12 months)...");
  const monthAbbrevs = ["Aug 25", "Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26", "Jul 26"];
  const companySnapshots = [
    { date: "Aug 25", env: 70, soc: 68, gov: 72, overall: 70.0 },
    { date: "Sep 25", env: 71, soc: 69, gov: 73, overall: 71.0 },
    { date: "Oct 25", env: 71, soc: 70, gov: 73, overall: 71.3 },
    { date: "Nov 25", env: 72, soc: 70, gov: 74, overall: 72.0 },
    { date: "Dec 25", env: 73, soc: 71, gov: 75, overall: 73.0 },
    { date: "Jan 26", env: 75, soc: 72, gov: 76, overall: 74.4 },
    { date: "Feb 26", env: 76, soc: 74, gov: 77, overall: 75.7 },
    { date: "Mar 26", env: 78, soc: 75, gov: 78, overall: 77.1 },
    { date: "Apr 26", env: 79, soc: 76, gov: 78, overall: 77.8 },
    { date: "May 26", env: 80, soc: 78, gov: 79, overall: 79.1 },
    { date: "Jun 26", env: 81, soc: 79, gov: 80, overall: 80.1 },
    { date: "Jul 26", env: 82, soc: 80, gov: 80, overall: 80.8 }
  ];

  await db.insert(esgScoreHistoryTable).values(
    companySnapshots.map(snap => ({
      date: snap.date,
      environmentalScore: snap.env,
      socialScore: snap.soc,
      governanceScore: snap.gov,
      overallScore: snap.overall,
      scope: "Company-wide",
      departmentId: null
    }))
  );

  // Seed history snapshots for departments too
  for (const dept of depts) {
    const startScore = dept.code === "IT" ? 75 : dept.code === "HR" ? 85 : 70;
    await db.insert(esgScoreHistoryTable).values(
      monthAbbrevs.map((month, idx) => ({
        date: month,
        environmentalScore: startScore + idx * 0.5,
        socialScore: startScore + 2 + idx * 0.4,
        governanceScore: startScore - 1 + idx * 0.3,
        overallScore: Math.round((startScore + idx * 0.5) * 0.4 + (startScore + 2 + idx * 0.4) * 0.3 + (startScore - 1 + idx * 0.3) * 0.3),
        scope: "Department",
        departmentId: dept.id
      }))
    );
  }

  console.log("ESG modules seeded successfully.");
}

seed()
  .then(() => {
    pool.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    pool.end();
    process.exit(1);
  });
