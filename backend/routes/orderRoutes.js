// routes/orderRoutes.js
import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =============================
// Create Razorpay order
// =============================
router.post("/create", async (req, res) => {
  try {
    const { totalPrice } = req.body;

    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("❌ Order create error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// =============================
// Verify payment & Save order
// =============================
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      totalPrice,
      customer,
      email,
      table,       // ✅ NEW: dine-in table number (or null)
      channel,     // ✅ NEW: "table" or "online"
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Save order
    const order = new Order({
      useremail: email,
      items: cartItems,
      totalPrice,
      customer,
      table: table || null,               // ✅ will be saved if dine-in
      channel: channel || "online",       // ✅ mark order type
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      status: "pending",
    });
    await order.save();

    // Clear cart for this user
    await User.findOneAndUpdate({ email }, { cart: [] });

    // ✅ Emit new order event (real-time)
    req.io.emit("orderUpdated", order);

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Payment verify error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =============================
// Get all orders (Admin)
// =============================
router.get("/", async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =============================
// Get orders for a user
// =============================
router.get("/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({ useremail: req.params.email }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// =============================
// Update order status (Admin)
// =============================
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    // ✅ Emit update to all clients
    req.io.emit("orderUpdated", order);

    res.json({ success: true, order });
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
