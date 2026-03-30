// routes/paymentRoutes.js
import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

// Create Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
router.post("/create-order", async (req, res) => {
  try {
    const { totalPrice } = req.body; // amount in INR (ex: 500 = ₹500)
    const options = {
      amount: totalPrice * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

export default router;
