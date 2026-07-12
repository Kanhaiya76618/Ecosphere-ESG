import type { Response } from "express";

// Structural stand-in for a Zod schema so this helper works with the schemas
// exported from @workspace/db without api-server depending on zod directly.
interface Schema<T> {
  safeParse(data: unknown):
    | { success: true; data: T }
    | { success: false; error: { message: string } };
}

// Parse `data` with `schema`; on failure send a 400 and return undefined so
// the caller can simply `if (!parsed) return;`.
export function validate<T>(
  schema: Schema<T>,
  data: unknown,
  res: Response,
): T | undefined {
  const result = schema.safeParse(data);
  if (!result.success) {
    res.status(400).json({ error: result.error.message });
    return undefined;
  }
  return result.data;
}
