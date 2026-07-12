// Business logic for the social module lives here; routes stay thin.
// Stub until the module is wired to real tables.
export function getModuleStatus() {
  return { module: "social", status: "stub" } as const;
}
