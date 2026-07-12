import { db, departmentsTable, employeesTable } from "../db";

export async function getDepartments() {
  const [departments, employees] = await Promise.all([
    db.select().from(departmentsTable),
    db.select().from(employeesTable),
  ]);

  return departments.map((dept) => {
    const deptEmployees = employees.filter((emp) => emp.departmentId === dept.id);
    const headEmployee = deptEmployees.find((emp) => emp.role === "manager" || emp.role === "admin");
    return {
      id: dept.id,
      name: dept.name,
      code: dept.code,
      head: headEmployee ? headEmployee.name : "Unassigned",
      employees: deptEmployees.length,
      status: "Active",
      score: 80, // default placeholder score
    };
  });
}

export async function createDepartment(data: { name: string; code: string }) {
  const [created] = await db
    .insert(departmentsTable)
    .values(data)
    .returning();
  return created;
}
