// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const protectRoute = async (req, res, next) => {
  try {
    // Check both cookie and Authorization header
    let token = req.cookies?.jwt;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Find the user from decoded token payload
    const user = await User.findById(decoded.userID).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
