import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Profile from "../models/profile.models.js";

export const createOrder = async (req, res) => {
  try {
    const { profileId, amount } = req.body || {};

    const amt = Number(amount);
    if (!profileId) return res.status(400).json({ error: "profileId is required" });
    if (!Number.isFinite(amt) || amt <= 0) return res.status(400).json({ error: "amount must be a positive number (in INR)" });

    const options = {
      amount: Math.round(amt * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { profileId },
    };

    const order = await razorpay.orders.create(options);

    return res.json({ orderId: order.id, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("[createOrder] Error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      profileId,
      amount,
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn("Missing Razorpay verification fields (test mode). Redirecting home.");
      return res.redirect("/"); 
    }

    
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
     
      const amt = Number(amount) || 0;
      if (profileId && amt > 0) {
        const updated = await Profile.findByIdAndUpdate(
          profileId,
          { $inc: { donatedAmount: amt } },
          { new: true }
        );

        if (updated && !updated.goalMet && updated.donatedAmount >= updated.donationGoal) {
          updated.goalMet = true;
          updated.goalMetAt = new Date();
          await updated.save();
        }
      }
    } else {
      console.warn("Invalid signature (test mode). Still redirecting home.");
    }

    return res.redirect("/");
  } catch (err) {
    console.error("[verifyPayment] Error:", err);
   
    return res.redirect("/");
  }
};
