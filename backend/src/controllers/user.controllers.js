
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import { sendOTPEmail } from "../utils/sendEmail.js";
import { generateToken } from "../lib/jwttoken.js";
import dotenv from "dotenv";
dotenv.config();

const OTP_TTL_MS = Number(process.env.OTP_TTL_MS) || 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = Number(process.env.RESEND_COOLDOWN_MS) || 30 * 1000;
const MAX_RESET_OTP_TTL_MS = Number(process.env.RESET_OTP_TTL_MS) || 5 * 60 * 1000;

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const hashToken = (t) => crypto.createHash("sha256").update(t).digest("hex");


// ================== SIGNUP ==================
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

   
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ message: "User with this email already exists" });

    const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const otp = generateOTP();
    const otpHash = hashToken(otp);
    const otpExpires = Date.now() + OTP_TTL_MS;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp: otpHash,
      otpExpires,
      lastOtpSentAt: Date.now()
    });

    try {
      await user.save();
    } catch (err) {
      if (err && err.code === 11000) return res.status(409).json({ message: "Email already registered" });
      console.error("User save error:", err);
      return res.status(500).json({ message: "Failed to create user" });
    }

    
    res.status(201).json({
      message: "Registered. OTP sent to email if deliverable. Verify to activate account.",
      userId: user._id,
    });

    sendOTPEmail(email, otp)
      .then(() => console.log("OTP sent to", email))
      .catch(err => {
        console.error("OTP send failed for", email, err && err.message);
      });

  } catch (error) {
    console.error("Error in signup controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================== VERIFY OTP ==================
export const verifyOTP = async (req, res) => {
  try {
    const { userId, email, otp } = req.body;
    if (!otp || (!userId && !email)) return res.status(400).json({ message: "Provide otp and userId or email" });

    let user = null;
    if (userId) {
      try { user = await User.findById(userId); } catch (e) { }
    }
    if (!user && email) user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (!user.otp || !user.otpExpires || Date.now() > new Date(user.otpExpires).getTime()) {
      return res.status(410).json({ message: "OTP expired. Please request a new one." });
    }

    const hashed = hashToken(otp);
    if (hashed !== user.otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.lastOtpSentAt = undefined;
    await user.save();

    const token = generateToken(user._id, res);
    return res.status(200).json({
      message: "User verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (err) {
    console.error("Error in verifyOTP:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================== RESEND OTP ==================
export const resendOTP = async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId && !email) return res.status(400).json({ message: "Provide userId or email" });

    let user = null;
    if (userId) {
      try { user = await User.findById(userId); } catch (e) {}
    }
    if (!user && email) user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (user.lastOtpSentAt && Date.now() - new Date(user.lastOtpSentAt).getTime() < RESEND_COOLDOWN_MS) {
      return res.status(429).json({ message: "Please wait before requesting another OTP" });
    }

    const otp = generateOTP();
    user.otp = hashToken(otp);
    user.otpExpires = Date.now() + OTP_TTL_MS;
    user.lastOtpSentAt = Date.now();
    await user.save();

    res.json({ message: "OTP resent if deliverable" });

    sendOTPEmail(user.email, otp)
      .then(() => console.log("Resent OTP to", user.email))
      .catch(err => console.error("Resend OTP error:", err && err.message));

  } catch (err) {
    console.error("Error in resendOTP:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================== LOGIN ==================
export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(401).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });
    if (!user.isVerified) return res.status(403).json({ message: "Account not verified. Please verify OTP first." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user._id, res);
    return res.status(200).json({
      user: {
        _id: user._id, name: user.name, email: user.email, isVerified: user.isVerified
      }, token
    });
  } catch (err) {
    console.error("Error in login controller:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================== LOGOUT ==================
export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error in logout controller:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================== CHECK AUTH ==================
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -otp -resetOTP");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error("Error in checkAuth:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================== REQUEST PASSWORD RESET ==================
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.resetOTP = hashToken(otp);
    user.resetOTPExpires = Date.now() + MAX_RESET_OTP_TTL_MS;
    await user.save();

    res.json({ message: "Password reset OTP sent if deliverable" });

    sendOTPEmail(user.email, otp)
      .then(() => console.log("Reset OTP sent to", user.email))
      .catch(err => console.error("Reset OTP send error:", err && err.message));

  } catch (err) {
    console.error("Error in requestPasswordReset:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ================== RESET PASSWORD ==================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "Email, OTP, and new password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = hashToken(otp);
    if (!user.resetOTP || user.resetOTP !== hashed || !user.resetOTPExpires || Date.now() > new Date(user.resetOTPExpires).getTime()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
