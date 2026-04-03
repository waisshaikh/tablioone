import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    //  PRIMARY IDENTIFIER
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: String,
    address: String,
    profileImage: String,

    //  optional
    firebaseUid: String,

    //  cart
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