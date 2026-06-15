import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { blocksController } from "./blocks.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/blocks/:userId",          blocksController.list);
router.post("/blocks/:userId",         blocksController.create);
router.delete("/blocks/:userId/:blockId", blocksController.remove);

export default router;
