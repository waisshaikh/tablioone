import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/Admin.js"; // 👈 path must exist

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await Admin.findOne({ email: "admin@maaslli.com" });
    if (existingAdmin) {
      console.log("✅ Admin already exists:", existingAdmin.email);
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new Admin({
      name: "Super Admin",
      email: "admin@maaslli.com",
      password: hashedPassword,
    });

    await admin.save();
    console.log("🎉 Admin user created successfully:", admin.email);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
