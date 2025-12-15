import express from "express";
import { createOrder, verifyPayment } from "../controllers/donationController.js";

const donationRouter = express.Router();

donationRouter.post("/create-order", createOrder);
donationRouter.post("/verify", async (req, res, next) => {
  try {
    await verifyPayment(req, res, next);
  } catch (err) {
    console.error("verify route error:", err);
  } finally {
   
    return res.redirect("/");
  }
});

export default donationRouter;
