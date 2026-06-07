import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthUser = {
  userId: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: "Token requerido",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Formato Bearer inválido",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AuthUser;

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    return next();
  } catch (error) {
    console.error("JWT ERROR:", error);

    return res.status(401).json({
      ok: false,
      message: "Token inválido o expirado",
    });
  }
}