import { io } from "socket.io-client";

// point to your backend
export const socket = io("https://tablioone.onrender.com", {
  transports: ["websocket"],
});
