import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { servicesController } from "./services.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/services/:userId",                    servicesController.list);
router.post("/services/:userId",                   servicesController.create);
router.put("/services/:userId/:serviceId",         servicesController.update);
router.delete("/services/:userId/:serviceId",      servicesController.remove);

export default router;
