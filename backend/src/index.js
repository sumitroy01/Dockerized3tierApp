// src/index.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import conDb from "./lib/db.js";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";
import profileRouter from "./routes/profile.routes.js";
import donationRouter from "./routes/donations.js";

const app = express();

// Allowed origins: production FRONTEND_ORIGIN plus common local dev hosts
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,   // e.g. "https://donate-v2-jgkc.onrender.com"
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

// CORS options with dynamic origin check
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (e.g. curl, mobile) or if origin is in allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

// apply CORS globally
app.use(cors(corsOptions));

// handle OPTIONS preflight with a safe regex route (avoids PathError for "*" token)
app.options(/.*/, cors(corsOptions));

// body parser & cookies
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/user/", userRoutes);
app.use("/api/profile/", profileRouter);
app.use("/api/donations", donationRouter);

// fallback OPTIONS responder (extra safety) — returns 204 for preflight
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

const PORT = process.env.PORT || 3000;
console.log("MONGO_URI is:", process.env.MONGO_URI);

const startServer = async () => {
  try {
    await conDb();
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
