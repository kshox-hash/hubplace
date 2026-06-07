import { Router } from "express";
import { companyProfileController } from "./company_profile.controller";
import { requireAuth } from "../../middlewares/requireAuth";

const router = Router();

router.get(
  "/public/business/:slug",
  companyProfileController.getByPublicSlug
);

router.get(
  "/company-profile/me",
  requireAuth,
  companyProfileController.getMe
);

router.post(
  "/company-profile/me",
  requireAuth,
  companyProfileController.upsertMe
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