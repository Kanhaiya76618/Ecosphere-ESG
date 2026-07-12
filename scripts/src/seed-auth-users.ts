import {
  db,
  pool,
  departmentsTable,
  employeesTable,
} from "@workspace/db";
// @ts-ignore
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding demo users for authentication...");

  // 1. Ensure departments exist
  let depts = await db.select().from(departmentsTable);
  if (depts.length === 0) {
    depts = await db.insert(departmentsTable).values([
      { name: "IT", code: "IT" },
      { name: "HR", code: "HR" },
      { name: "Logistics", code: "LOG" }
    ]).returning();
  }

  const itDept = depts.find(d => d.code === "IT") || depts[0];
  const hrDept = depts.find(d => d.code === "HR") || depts[0];
  const logDept = depts.find(d => d.code === "LOG") || depts[0];

  const demoUsers = [
    {
      name: "Sarah Chen",
      email: "sarah.chen@ecosphere.io",
      password: "Admin@123",
      role: "Admin",
      departmentId: itDept.id,
      avatarInitials: "SC",
      avatarColor: "#1e3a8a", // Dark Blue
      xp: 450,
      level: 4,
    },
    {
      name: "Jane Doe",
      email: "jane.doe@ecosphere.io",
      password: "Sustain@123",
      role: "Sustainability Officer",
      departmentId: hrDept.id,
      avatarInitials: "JD",
      avatarColor: "#15803d", // Dark Green
      xp: 320,
      level: 3,
    },
    {
      name: "Rahul Sharma",
      email: "rahul.sharma@ecosphere.io",
      password: "Manager@123",
      role: "Department Head",
      departmentId: itDept.id,
      avatarInitials: "RS",
      avatarColor: "#b45309", // Amber
      xp: 280,
      level: 2,
    },
    {
      name: "Priya Patel",
      email: "priya.patel@ecosphere.io",
      password: "Employee@123",
      role: "Employee",
      departmentId: hrDept.id,
      avatarInitials: "PP",
      avatarColor: "#be185d", // Crimson / Rose
      xp: 150,
      level: 1,
    },
    {
      name: "Vikram Singh",
      email: "vikram.singh@ecosphere.io",
      password: "Employee@456",
      role: "Employee",
      departmentId: logDept.id,
      avatarInitials: "VS",
      avatarColor: "#6b7280", // Gray
      xp: 120,
      level: 1,
    }
  ];

  for (const user of demoUsers) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(user.password, salt);

    // Delete if already exists to avoid duplicate emails
    await db.delete(employeesTable).where(eq(employeesTable.email, user.email));

    console.log(`Seeding user: ${user.name} (${user.role})...`);
    await db.insert(employeesTable).values({
      name: user.name,
      email: user.email,
      passwordHash: passwordHash,
      role: user.role,
      departmentId: user.departmentId,
      avatarInitials: user.avatarInitials,
      avatarColor: user.avatarColor,
      xp: user.xp,
      level: user.level,
      status: "Active",
    });
  }

  console.log("Demo users seeded successfully.");
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
