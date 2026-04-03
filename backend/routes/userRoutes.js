// routes/userRoutes.js
import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import User from "../models/User.js";

const router = express.Router();

// ===== Multer: keep file in memory =====
const upload = multer({ storage: multer.memoryStorage() });

// ===== Cloudinary config =====
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: upload buffer to Cloudinary with a Promise
function uploadBufferToCloudinary(buffer, folder = "profiles") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: "image" }, // 👈 safer
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// ===== POST /api/users  (create/update user profile) =====
router.post("/", upload.single("avatar"), async (req, res) => {
  try {
    const { phone, name, email, address } = req.body;
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is required" });
    }

    // Upload to Cloudinary if avatar present
    let profileImage;
    if (req.file?.buffer) {
      profileImage = await uploadBufferToCloudinary(req.file.buffer, "profiles");
    }

    // Build update object
    const update = {
      ...(name && { name }),
      ...(email && { email }),
      ...(address && { address }),
      ...(profileImage && { profileImage }),
    };

    // Find by phone and update (or insert new)
    const user = await User.findOneAndUpdate({ phone }, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    return res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Error saving user:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
});

// ===== GET /api/users/:phone  (fetch user by phone) =====
router.get("/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
