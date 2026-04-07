
import 'dotenv/config';  

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import morgan from "morgan";
import { Server as SocketIOServer } from "socket.io";
import cookieParser from "cookie-parser";

// Routes (safe now, env is loaded)
import factRoutes from "./routes/factRoutes.js";
import dishRoutes from "./routes/dishRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
const server = http.createServer(app);

// ====== Middlewares ======
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// ====== Socket.io Setup ======
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_URL},
});

// make io accessible in routes
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// ====== Routes ======
app.use("/api/facts", factRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);

// ====== Health Check ======
app.get("/", (_req, res) => {
  res.send(" Backend API is running...");
});

// ====== Socket Events ======
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// ====== Error Handling ======
app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ success: false, message: "Server Error" });
});

// ====== Start Server & DB ======
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" MongoDB Connected");
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("DB Connection Failed:", err));
