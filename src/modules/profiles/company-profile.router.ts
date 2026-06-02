import { Router } from "express";
import { companyProfileController } from "./company_profile.controller";

const router = Router();

router.get(
  "/public/business/:slug",
  companyProfileController.getByPublicSlug
);

router.get(
  "/company-profile/:userId",
  companyProfileController.getByUserId
);

router.post(
  "/company-profile",
  companyProfileController.upsert
);

export default router;