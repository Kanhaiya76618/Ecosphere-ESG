// Business logic for the environmental module lives here; routes stay thin.
// Stub until the module is wired to real tables.
export function getModuleStatus() {
  return { module: "environmental", status: "stub" } as const;
}
