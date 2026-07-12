// Business logic for the governance module lives here; routes stay thin.
// Stub until the module is wired to real tables.
export function getModuleStatus() {
  return { module: "governance", status: "stub" } as const;
}
