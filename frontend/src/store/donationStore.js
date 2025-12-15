import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"; 
const donationStore = create((set) => ({
  loading: false,
  error: null,
  success: false,

  createOrder: async (profileId, amount) => {
    try {
      set({ loading: true, error: null, success: false });
      const res = await axiosInstance.post("/api/donations/create-order", {
        profileId,
        amount: Number(amount),
      });
      set({ loading: false });
      return res.data;
    } catch (err) {
      console.error("createOrder error:", err);
      set({ loading: false, error: err?.response?.data?.error || "Error creating order" });
      return null;
    }
  },

  verifyPayment: async (payload) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post("/api/donations/verify", payload);
      set({ loading: false, success: true });
      return res.data;
    } catch (err) {
      console.error("verifyPayment error:", err);
      set({ loading: false, error: err?.response?.data?.error || "Verification failed" });
      return null;
    }
  },
}));

export default donationStore;
