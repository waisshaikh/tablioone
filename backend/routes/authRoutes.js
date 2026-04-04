// routes/authRoutes.js
import express from "express";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

let otpStore = {}; // temporary storage (production me DB use karna better hai)

//  Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email number required" });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP in memory with expiry (5 min)
    otpStore[email] = {
      otp: otp.toString(),
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    // Fast2SMS API call
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: `Your OTP for verification is ${otp}`,
        language: "english",
        flash: 0,
        numbers: email,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

//  Verify OTP
router.post("/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "email and OTP required" });
    }

    const record = otpStore[email];
    if (!record) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP valid -> delete record
    delete otpStore[email];

    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
});

export default router;
