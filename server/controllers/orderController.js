import Order from "../models/Order.js";

// create order (from table QR or online)
export const createOrder = async (req, res) => {
  try {
    const { tableId = null, channel = "table", items = [], note = "" } = req.body;

    if (!items.length) return res.status(400).json({ message: "Items required" });

    // simple amount calc (sum price * qty)
    const amount = items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0);

    const order = await Order.create({
      tableId,
      channel,
      items,
      note,
      amount,
      isRead: false, // new order, unread for admin
    });

    // emit real-time event
    req.io?.emit("newOrder", order);

    res.status(201).json(order);
  } catch (e) {
    console.error("createOrder error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// list orders with optional filters
export const listOrders = async (req, res) => {
  try {
    const { channel, status, unread } = req.query;
    const q = {};
    if (channel) q.channel = channel;            // "table" | "online"
    if (status) q.status = status;
    if (unread === "true") q.isRead = false;

    const orders = await Order.find(q).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    console.error("listOrders error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// mark all unread as read (or by channel)
export const markRead = async (req, res) => {
  try {
    const { channel } = req.body || {};
    const filter = { isRead: false };
    if (channel) filter.channel = channel;

    const result = await Order.updateMany(filter, { $set: { isRead: true } });
    res.json({ updated: result.modifiedCount });
  } catch (e) {
    console.error("markRead error:", e);
    res.status(500).json({ message: "Server error" });
  }
};
