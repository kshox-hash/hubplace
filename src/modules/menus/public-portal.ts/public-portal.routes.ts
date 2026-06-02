import { Router } from "express";
import { publicPortalController } from "./public-portal.controller";

const router = Router();

router.get("/open/:publicSlug", publicPortalController.open);

export default router;