import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOTP } from "../utils/sendOTP.js";

const router = express.Router();

// Step 1: Request OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 5 * 60 * 1000; // 5 min expiry

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email });

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await sendOTP(email, otp);

  res.json({ message: "OTP sent successfully" });
});

// Step 2: Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpires = null;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ message: "Login successful", token, user });
});

export default router;
