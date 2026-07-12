// Commented table skeletons for the not-yet-implemented ESG modules, grouped
// by module (structure pass only — promote to real Drizzle tables when each
// module goes live). Gamification tables are already real: see gamification.ts
// (departments, employees, challenges, challenge_participations, badges,
// employee_badges, rewards, reward_redemptions, xp_ledger).
//
// ============================== MASTER DATA ==============================
//
// -- settings module --
// categories: id, name, kind ("emission" | "csr" | "challenge"), description
//   (departments already implemented in gamification.ts)
//
// -- environmental module --
// emission_factors: id, name (Diesel/Petrol/Electricity/...), factor numeric
//   (kg CO2 per unit), unit, effective_from
// product_esg_profiles: id, product_name, carbon_per_unit, recyclable bool,
//   notes
// environmental_goals: id, title, department_id FK, baseline numeric,
//   target numeric, unit, deadline, status
//
// -- governance module --
// esg_policies: id, title, version, body/url, effective_date, status
//   (draft/active/review/retired)
//
// ============================ TRANSACTIONAL DATA ==========================
//
// -- environmental module --
// carbon_transactions: id, department_id FK, emission_factor_id FK,
//   quantity numeric, co2_kg numeric (quantity × factor, computed on insert),
//   transacted_at, created_at
//
// -- social module --
// csr_activities: id, title, description, category_id FK, points int,
//   scheduled_on, status (upcoming/active/completed)
// employee_participations: id, csr_activity_id FK, employee_id FK,
//   proof text (photo url), approval_status (pending/approved/rejected),
//   points_awarded int, created_at
//
// -- governance module --
// policy_acknowledgements: id, policy_id FK, employee_id FK, accepted_at
// audits: id, title, auditor, scheduled_on, status
//   (pending/in_progress/completed), score
// compliance_issues: id, audit_id FK nullable, title, severity
//   (low/medium/high), department_id FK, owner_employee_id FK, due_date,
//   status (open/in_progress/resolved)
//
// -- reports / scoring --
// department_scores: id, department_id FK, period (e.g. "2026-07"),
//   environmental_score, social_score, governance_score,
//   esg_score (= 0.4*E + 0.3*S + 0.3*G), computed_at

export {};
