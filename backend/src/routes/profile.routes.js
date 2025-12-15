import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

import protectRoute from "../middleware/auth.middleware.js";
import Profile from "../models/profile.models.js";
import {
  fillForm,
  updateForm,
  hasprofile,
  getProfileById,
  getAllProfiles,
  getMyProfile,
} from "../controllers/form.controllers.js"; 

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folderName = "misc";
    if (file.fieldname === "profilePic") folderName = "profiles";
    if (file.fieldname === "proofs") folderName = "proofs";
    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf"],
    };
  },
});

const upload = multer({ storage });
const profileRouter = express.Router();

profileRouter.get("/hasprofile", protectRoute, hasprofile);

profileRouter.post(
  "/fillform",
  protectRoute,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "proofs", maxCount: 5 },
  ]),
  fillForm
);

profileRouter.get("/fillform/:id", protectRoute, getProfileById);

profileRouter.put(
  "/fillform/:id",
  protectRoute,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "proofs", maxCount: 5 },
  ]),
  updateForm
);

profileRouter.get("/allprofiles", getAllProfiles);
profileRouter.get("/me", protectRoute, getMyProfile);

profileRouter.get("/achieved", async (req, res) => {
  try {
    const docs = await Profile.find({ goalMet: true }).sort({ goalMetAt: -1 }).lean();
    return res.json(docs);
  } catch (err) {
    console.error("[/achieved] Error:", err);
    return res.status(500).json({ error: "Failed to fetch achieved profiles" });
  }
});

export default profileRouter;
