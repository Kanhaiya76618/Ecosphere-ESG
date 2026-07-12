import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, employeesTable, xpLedgerTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const JWT_SECRET = "ecosphere-secret-key-2026";
const router: IRouter = Router();

// Login API (Prompt 2 & 12)
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    // Find employee
    const employees = await db.select().from(employeesTable).where(eq(employeesTable.email, email)).limit(1);
    const user = employees[0];

    if (!user) {
      res.status(401).json({ error: "Incorrect email or password" });
      return;
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: "Incorrect email or password" });
      return;
    }

    // Daily Login XP Bonus check (Prompt 12)
    const todayStr = new Date().toISOString().slice(0, 10);
    let xpBonusAwarded = false;
    let finalXp = user.xp;

    if (user.lastLoginDate !== todayStr) {
      xpBonusAwarded = true;
      finalXp = user.xp + 5;

      // Update employee XP and last login date
      await db.update(employeesTable)
        .set({
          xp: finalXp,
          lastLoginDate: todayStr,
        })
        .where(eq(employeesTable.id, user.id));

      // Log in XP ledger
      await db.insert(xpLedgerTable).values({
        employeeId: user.id,
        delta: 5,
        reason: "Daily Login Bonus",
      });
    } else {
      // Just update login date if needed (or do nothing)
      await db.update(employeesTable)
        .set({ lastLoginDate: todayStr })
        .where(eq(employeesTable.id, user.id));
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, departmentId: user.departmentId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        avatarInitials: user.avatarInitials,
        avatarColor: user.avatarColor,
        xp: finalXp,
        level: user.level,
      },
      xpBonusAwarded,
    });
  } catch (err) {
    next(err);
  }
});

// Logout API
router.post("/logout", (_req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

// Helper Auth Middleware
export async function authenticateToken(req: any, res: any, next: any) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string; departmentId: number };
    const users = await db.select().from(employeesTable).where(eq(employeesTable.id, decoded.id)).limit(1);
    const user = users[0];
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User no longer exists" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
}

// Me API (Prompt 2)
router.get("/me", authenticateToken, async (req: any, res) => {
  const user = req.user;

  // Calculate Rank (Prompt 9)
  const allUsers = await db.select().from(employeesTable);
  const sorted = allUsers.sort((a, b) => b.xp - a.xp);
  const rank = sorted.findIndex(u => u.id === user.id) + 1;

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    departmentId: user.departmentId,
    avatarInitials: user.avatarInitials,
    avatarColor: user.avatarColor,
    xp: user.xp,
    level: user.level,
    rank,
  });
});

export default router;
