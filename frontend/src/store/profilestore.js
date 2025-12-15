

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const profileStore = create((set, get) => ({
  // Flags
  isCreatingProfile: false,
  isUpdatingProfile: false,
  isLoadingProfile: false,

  // Data
  hasProfile: false,
  profile: null,
  profileId: null,
  allProfiles: [],

  achievedProfiles: [],
  isLoadingAchieved: false,

  // CREATE PROFILE
  fillForm: async (formData) => {
    set({ isCreatingProfile: true });
    try {
      const res = await axiosInstance.post("/api/profile/fillform", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const profile = res.data.userProfile;
      set({ profile, hasProfile: true, profileId: profile?._id || null });
      toast.success("Profile created successfully");
    } catch (err) {
      console.error("Create profile error:", err);
      toast.error(err?.response?.data?.message || "Failed to create profile");
    } finally {
      set({ isCreatingProfile: false });
    }
  },

  // UPDATE PROFILE
  updateProfileById: async ({ id, data }) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put(`/api/profile/fillform/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const profile = res.data.userProfile;
      set({
        profile,
        hasProfile: true,
        profileId: profile?._id || id,
      });

      return { success: true, userProfile: profile };
    } catch (err) {
      console.error("Update profile error:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
      return { success: false };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // GET PROFILE BY ID
  getProfileById: async (id) => {
    set({ isLoadingProfile: true });
    try {
      const res = await axiosInstance.get(`/api/profile/fillform/${id}`);
      set({ profile: res.data.userProfile });
    } catch (err) {
      console.error("Get profile error:", err);
      toast.error(err?.response?.data?.message || "Failed to load profile");
    } finally {
      set({ isLoadingProfile: false });
    }
  },

  // CHECK IF USER HAS PROFILE
  checkProfile: async () => {
    try {
      const res = await axiosInstance.get("/api/profile/hasprofile");
      set({ hasProfile: res.data.hasProfile, profileId: res.data.profileId || null });
      return res.data.hasProfile;
    } catch (err) {
      console.error("Check profile error:", err);
      set({ hasProfile: false, profileId: null });
      return false;
    }
  },

  // GET MY PROFILE
  getMyProfile: async () => {
    set({ isLoadingProfile: true });
    try {
      const res = await axiosInstance.get("/api/profile/me");
      set({
        profile: res.data.userProfile,
        hasProfile: true,
        profileId: res.data.userProfile?._id || null,
      });
    } catch (err) {
      console.error("Get my profile error:", err);
      toast.error(err?.response?.data?.message || "Failed to load profile");
    } finally {
      set({ isLoadingProfile: false });
    }
  },

  // GET ALL PROFILES
  getAllProfiles: async () => {
    try {
      const res = await axiosInstance.get("/api/profile/allprofiles");
      set({ allProfiles: res.data.userProfiles || [] });
    } catch (err) {
      console.error("Get all profiles error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch profiles");
    }
  },

  getAchievedProfiles: async () => {
    set({ isLoadingAchieved: true });
    try {
      const res = await axiosInstance.get("/api/profile/achieved");
      set({ achievedProfiles: Array.isArray(res.data) ? res.data : [], isLoadingAchieved: false });
    } catch (err) {
      console.error("Get achieved profiles error:", err);
      toast.error(err?.response?.data?.error || "Failed to fetch achieved profiles");
      set({ isLoadingAchieved: false });
    }
  },
}));

export default profileStore;
