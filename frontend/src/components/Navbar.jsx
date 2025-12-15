import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import userStore from "../store/userstore";
import profileStore from "../store/profilestore";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logOut, authUser, checkAuth } = userStore();
  const { hasProfile, checkProfile } = profileStore();

  useEffect(() => {
    checkAuth?.();
    checkProfile?.();
  }, []);

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <nav className="bg-green-700 shadow-lg px-6 py-3 flex justify-between items-center">
      <motion.div
        className="flex items-center gap-2"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Heart className="text-white w-6 h-6" />
        <span className="text-white font-bold text-xl tracking-wide">Donate</span>
      </motion.div>

      <ul className="flex gap-6 text-white font-medium">
        <li>
          <Link
            to="/"
            className={`hover:bg-white hover:text-green-700 px-3 py-1 rounded-lg transition duration-300 ${
              location.pathname === "/" ? "bg-white text-green-700" : ""
            }`}
          >
            Home
          </Link>
        </li>

        
       


        {authUser && (
  <li>
    <Link
      to={hasProfile ? "/updateprofile" : "/profile"}
      className={`hover:bg-white hover:text-green-700 px-3 py-1 rounded-lg transition duration-300 ${
        location.pathname === "/profile" ? "bg-white text-green-700" : ""
      }`}
    >
      {hasProfile ? "Update Profile" : "Create Profile"}
    </Link>
  </li>
)}












        {authUser ? (
          <li>
            <button
              onClick={handleLogout}
              className="hover:bg-white hover:text-green-700 px-3 py-1 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className={`hover:bg-white hover:text-green-700 px-3 py-1 rounded-lg transition duration-300 ${
                  location.pathname === "/login" ? "bg-white text-green-700" : ""
                }`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className={`hover:bg-white hover:text-green-700 px-3 py-1 rounded-lg transition duration-300 ${
                  location.pathname === "/signup" ? "bg-white text-green-700" : ""
                }`}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
