import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    date: { type: String, required: true },   // store as string or Date
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    seating: { type: String, enum: ["indoor", "outdoor"], default: "indoor" },
    special: { type: String },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);
