import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { insertSlugController } from "./slug.controller";

const router = Router();

router.post(
  "/slugs",
  authMiddleware,
  insertSlugController
);

export default router;