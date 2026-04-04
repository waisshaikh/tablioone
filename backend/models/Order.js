
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    useremail: { type: String, required: true },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalPrice: { type: Number, required: true },
    customer: {
      name: String,
      email: String,
      email: String,
      address: String,
      orderType: { type: String, default: "delivery" },
    },
    table: { type: String, default: null },   //  Dine-in table number
    channel: {                                //  Online or Table QR
      type: String,
      enum: ["online", "table"],
      default: "online",
    },

    bill: {
      gst: { type: Number, default: 0 },
      subtotal: { type: Number, default: 0 },
      finalTotal: { type: Number, default: 0 },
      paymentMode: { type: String, default: "online" }, // online / cash
    },
    paymentId: String,
    razorpayOrderId: String,
    status: { type: String, default: "pending" }, // pending | confirmed | delivered | cancelled
  },


  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
