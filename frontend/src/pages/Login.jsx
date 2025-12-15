import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import userStore from "../store/userstore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { logIn, isLogginIn } = userStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter both email and password");
      return;
    }

    const success = await logIn(form);
    if (success) {
      navigate("/"); // redirect to home/dashboard after login
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-400">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            disabled={isLogginIn}
            className={`w-full py-2 rounded-lg transition ${
              isLogginIn
                ? "bg-blue-300 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLogginIn ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ✅ Forgot Password link */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
