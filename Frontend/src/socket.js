import { io } from "socket.io-client";

// point to your backend
export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});
