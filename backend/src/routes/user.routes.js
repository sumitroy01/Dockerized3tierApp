import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import { 
  signUp, 
  logIn, 
  logOut, 
  resendOTP,
  requestPasswordReset,
  resetPassword,
  checkAuth, 
  verifyOTP
} from "../controllers/user.controllers.js"; 

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);

router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.get("/check", protectRoute, checkAuth);
export default router;
