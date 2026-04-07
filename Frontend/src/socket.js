import { io } from "socket.io-client";

// point to your backend
export const socket = io("https://second-brain-huvx.onrender.com", {
  transports: ["websocket"],
});
