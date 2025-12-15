// models/user.models.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  otp: String,
  otpExpires: Date,
  resetOTP: String,
  resetOTPExpires: Date,

  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile", // ✅ correct ref
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
