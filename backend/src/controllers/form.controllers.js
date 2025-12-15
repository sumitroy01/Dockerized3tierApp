import Profile from "../models/profile.models.js";
import User from "../models/user.models.js";

// ================== CREATE PROFILE (fill form) ==================
export const fillForm = async (req, res) => {
  try {
    const { name, email, phone, age, disease, donationGoal, bio } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized, please login" });

    console.log("fillForm req.files:", req.files);

    const profilePicUrl = req.files?.profilePic?.[0]?.path;
    const proofsUrls = req.files?.proofs?.map(f => f.path) || [];

    if (!name || !email || !phone || !age || !disease || !profilePicUrl || !donationGoal) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Profile.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists", profile: existing });
    }

    const userProfile = new Profile({
      user: userId,
      name,
      email,
      phone,
      age: Number(age),
      disease,
      profilePic: profilePicUrl,
      donationGoal: Number(donationGoal),
      bio,
      proofs: proofsUrls,
    });

    await userProfile.save();
    await User.findByIdAndUpdate(userId, { profile: userProfile._id });

    return res.status(201).json({
      message: "Profile created successfully",
      userProfile,
    });
  } catch (error) {
    console.error("Error in fillForm controller:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      return res.status(400).json({ message: `${field} already exists` });
    }
    return res.status(500).json({ message: "Something went wrong, please try again" });
  }
};

// ================== UPDATE PROFILE ==================
export const updateForm = async (req, res) => {
  try {
    const profileId = req.params.id;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userProfile = await Profile.findById(profileId);
    if (!userProfile || String(userProfile.user) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden: Not your profile" });
    }

    const profilePicUrl = req.files?.profilePic?.[0]?.path || userProfile.profilePic;

    const existingProofs = Array.isArray(req.body.existingProofs)
      ? req.body.existingProofs
      : req.body.existingProofs
      ? [req.body.existingProofs]
      : [];
    const newProofs = req.files?.proofs?.map(f => f.path) || [];
    const proofsUrls = [...existingProofs, ...newProofs];

    const updateData = {
      name: req.body.name || userProfile.name,
      bio: req.body.bio || userProfile.bio,
      email: req.body.email || userProfile.email,
      phone: req.body.phone || userProfile.phone,
      age: req.body.age ? Number(req.body.age) : userProfile.age,
      disease: req.body.disease || userProfile.disease,
      donationGoal: req.body.donationGoal ? Number(req.body.donationGoal) : userProfile.donationGoal,
      profilePic: profilePicUrl,
      proofs: proofsUrls,
    };

    const updatedProfile = await Profile.findByIdAndUpdate(profileId, updateData, { new: true });
    res.status(200).json({ message: "Profile updated successfully", userProfile: updatedProfile });
  } catch (error) {
    console.error("Error in updateForm:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================== CHECK IF USER HAS PROFILE ==================
export const hasprofile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized. Please log in." });

    const userProfile = await Profile.findOne({ user: userId });
    if (userProfile) {
      return res.status(200).json({ hasProfile: true, profileId: userProfile._id });
    } else {
      return res.status(200).json({ hasProfile: false });
    }
  } catch (error) {
    console.error("Error in hasprofile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================== GET PROFILE BY ID ==================
export const getProfileById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const userProfile = await Profile.findById(profileId);
    if (!userProfile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json({ userProfile });
  } catch (error) {
    console.error("Error in getProfileById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================== GET ALL PROFILES ==================
export const getAllProfiles = async (req, res) => {
  try {
    const userProfiles = await Profile.find().populate("user", "name email");
    res.status(200).json({ userProfiles });
  } catch (error) {
    console.error("Error in getAllProfiles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ================== GET LOGGED-IN USER'S PROFILE ==================
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const userProfile = await Profile.findOne({ user: userId });
    if (!userProfile) return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({ userProfile });
  } catch (error) {
    console.error("Error in getMyProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
