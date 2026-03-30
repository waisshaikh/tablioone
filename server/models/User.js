// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, unique: true, required: true },
    name: String,
    email: String,
    address: String,
    profileImage: String,

    // 👇 new field for cart
    cart: [
      {
        id: String,
        name: String,
        price: Number,
        image: String,
        qty: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
