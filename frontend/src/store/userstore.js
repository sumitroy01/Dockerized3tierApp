
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const userStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogginIn: false,
  isCheckingAuth: true,
  isResettingPassword: false,
  pendingUserId: null,

  // ================== CHECK AUTH ==================
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/api/user/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ================== SIGNUP (with OTP flow) ==================
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/api/user/signup", data);

      // store userId for OTP step
      set({ pendingUserId: res.data.userId });

      toast.success("Signup successful, please check your email for OTP");
      return { success: true, userId: res.data.userId };
    } catch (error) {
      console.error("Signup error:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ================== VERIFY OTP ==================
  verifyOTP: async (otp) => {
    const { pendingUserId } = get();
    if (!pendingUserId) {
      toast.error("No pending user found. Please signup again.");
      return { success: false };
    }

    try {
      const res = await axiosInstance.post("/api/user/verify-otp", {
        userId: pendingUserId,
        otp,
      });

      set({ authUser: res.data.user, pendingUserId: null });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Account verified successfully");
      return { success: true };
    } catch (error) {
      console.error("OTP verification error:", error.response?.data);
      toast.error(error.response?.data?.message || "Invalid OTP");
      return { success: false };
    }
  },

  // ================== RESEND OTP ==================
  resendOTP: async () => {
    const { pendingUserId } = get();
    if (!pendingUserId) {
      toast.error("No pending user found. Please signup again.");
      return;
    }

    try {
      await axiosInstance.post("/api/user/resend-otp", { userId: pendingUserId });
      toast.success("New OTP sent to your email");
    } catch (error) {
      console.error("Resend OTP error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  },

  // ================== LOGIN ==================
  logIn: async (data) => {
    set({ isLogginIn: true });
    try {
      const res = await axiosInstance.post("/api/user/login", data);

      set({ authUser: res.data.user });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      console.error("Login error:", error.response?.data);
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLogginIn: false });
    }
  },

  // ================== LOGOUT ==================
  logOut: async () => {
    try {
      await axiosInstance.post("/api/user/logout");
      set({ authUser: null });
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error || "Logout failed");
    }
  },

  // ================== FORGOT PASSWORD ==================
  requestPasswordReset: async (email) => {
    try {
      await axiosInstance.post("/api/user/request-password-reset", { email });
      toast.success("OTP sent to your email");
      return true;
    } catch (error) {
      console.error("Password reset request error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to send OTP");
      return false;
    }
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.post("/api/user/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successful, please login");
      return true;
    } catch (error) {
      console.error("Reset password error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to reset password");
      return false;
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));

export default userStore;
