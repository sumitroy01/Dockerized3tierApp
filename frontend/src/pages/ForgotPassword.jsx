import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import userStore from "../store/userstore";

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // "email" | "reset"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { requestPasswordReset, resetPassword, isResettingPassword } = userStore();

  // ================== REQUEST RESET ==================
  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const success = await requestPasswordReset(email);
    if (success) {
      setStep("reset");
    }
  };

  // ================== RESET PASSWORD ==================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword) {
      toast.error("Please enter OTP and new password");
      return;
    }

    const success = await resetPassword({ email, otp, newPassword });
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-purple-400">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {step === "email" ? (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Forgot Password
            </h2>
            <form className="space-y-4" onSubmit={handleRequestReset}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="submit"
                disabled={isResettingPassword}
                className={`w-full py-2 rounded-lg transition ${
                  isResettingPassword
                    ? "bg-purple-300 cursor-not-allowed text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isResettingPassword ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>

           
            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Reset Password
            </h2>
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="submit"
                disabled={isResettingPassword}
                className={`w-full py-2 rounded-lg transition ${
                  isResettingPassword
                    ? "bg-green-300 cursor-not-allowed text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isResettingPassword ? "Resetting..." : "Reset Password"}
              </button>
            </form>

           
            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
