import { Request, Response } from "express";
import { insertSlugService } from "./slug.service";

export async function insertSlugController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const userId = req.user?.userId;
    const { slug } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    await insertSlugService({
      userId,
      slug,
    });

    return res.status(201).json({
      message: "Slug creado correctamente",
    });
  } catch (error) {
    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "Error creando slug",
    });
  }
}