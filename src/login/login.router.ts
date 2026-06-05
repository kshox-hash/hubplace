import { Router } from "express";
import passport from "passport";
import { loginController, googleLoginController, googleStartController,
  googleCallbackController,} from "./login.controller";

const router = Router();

router.post("/login", loginController);
router.post("/google", googleLoginController);

router.get("/google/start", googleStartController);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  googleCallbackController
);

router.get("/google/failure", (_, res) => {
  return res.status(401).send("Error iniciando sesión con Google");
})

router.get("/logout", (_req, res) => {
  return res.redirect(
    "https://accounts.google.com/logout"
  );
});

export default router;