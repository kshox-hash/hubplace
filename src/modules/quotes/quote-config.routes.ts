import express from "express";
import {
  getPdfConfigController,
  savePdfConfigController,
} from "./quote-config.controller";

const router = express.Router();

router.get("/pdf-config/:userId", getPdfConfigController);
router.post("/pdf-config", savePdfConfigController);

export default router;