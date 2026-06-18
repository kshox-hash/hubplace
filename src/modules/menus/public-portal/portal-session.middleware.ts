import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function portalSessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!process.env.GOOGLE_CLIENT_ID) { next(); return; }

  // auth endpoint itself no requiere token
  if (/^\/[^/]+\/auth$/.test(req.path) && req.method === "POST") { next(); return; }

  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ ok: false, message: "No autenticado." });
    return;
  }

  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET!, { issuer: "portal" });
    (req as any).portalUser = payload;
    next();
  } catch {
    res.status(401).json({ ok: false, message: "Sesión expirada. Iniciá sesión nuevamente." });
  }
}
