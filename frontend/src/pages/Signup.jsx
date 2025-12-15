import React, { useState } from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import userstore from "../store/userstore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("signup");
  const [cooldown, setCooldown] = useState(0); 

  const { signUp, verifyOTP, resendOTP, isSigningUp } = userstore();
  const navigate = useNavigate();

  // ================== HANDLE SIGNUP ==================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const result = await signUp(form);
    if (result.success) {
      setStep("otp"); // ✅ switch to OTP step
    } else {
      toast.error(result.message || "Signup failed");
    }
  };

  // ================== HANDLE OTP VERIFY ==================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    const result = await verifyOTP(otp);
    if (result.success) {
      navigate("/"); 
    }
  };

  // ================== HANDLE RESEND OTP ==================
  const handleResend = async () => {
    if (cooldown > 0) return;

    await resendOTP();

   
    setCooldown(30);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-green-800 to-green-500">
      <DotLottiePlayer
        src="https://lottie.host/967f5eba-4045-4c2a-8bc9-a4ec9a2093ba/SMIAZ04t9e.lottie"
        speed="1"
        className="absolute inset-0 w-full h-full z-0 object-cover"
        loop
        autoplay
      />

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
          {step === "signup" ? (
            <>
              <h2 className="text-2xl font-semibold text-center mb-6">Create an Account</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  disabled={isSigningUp}
                  className={`w-full py-2 rounded-lg transition ${
                    isSigningUp
                      ? "bg-blue-300 cursor-not-allowed text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isSigningUp ? "Signing Up..." : "Sign Up with Email"}
                </button>
              </form>

              <div className="my-4 text-center text-gray-500">or</div>
              <div className="flex flex-col gap-3">
                <button
                  className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={() => toast("Google signup not implemented")}
                >
                  <FaGoogle className="text-lg" />
                  Sign Up with Google
                </button>
                <button
                  className="flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
                  onClick={() => toast("GitHub signup not implemented")}
                >
                  <FaGithub className="text-lg" />
                  Sign Up with GitHub
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>
              <form className="space-y-4" onSubmit={handleVerifyOTP}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                >
                  Verify OTP
                </button>
              </form>

              <button
                onClick={handleResend}
                disabled={cooldown > 0}
                className={`mt-4 w-full py-2 rounded-lg transition ${
                  cooldown > 0
                    ? "bg-yellow-300 cursor-not-allowed text-white"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;

