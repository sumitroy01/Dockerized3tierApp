
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import userStore from "./store/userstore.js";
import profileStore from "./store/profilestore.js";
import ProfileDetails from "./pages/ProfileDetails";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // ✅ added
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Benefitted from "./pages/Benefitted.jsx";
// ✅ react-hot-toast
import { Toaster } from "react-hot-toast";

function AppWrapper() {
  const { authUser, checkAuth } = userStore();
  const { checkProfile, hasProfile } = profileStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authUser) {
      checkProfile();
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser && hasProfile && window.location.pathname === "/profile") {
      navigate("/");
    }
  }, [authUser, hasProfile, navigate]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/profile/:id"
          element={
           
              <ProfileDetails />
           
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/benefitted" element={<Benefitted />} />
        <Route
          path="/updateprofile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />

      {/* ✅ hot-toast container */}
      <Toaster
        position="top-left"
        toastOptions={{
          duration: 1000,
          style: { background: "#333", color: "#fff" },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
