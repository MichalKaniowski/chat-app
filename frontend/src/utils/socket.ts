import { io } from "socket.io-client";
// import getSession from "./getSession";

// https://chat-app-6lk7.onrender.com
const URL = import.meta.env.VITE_API_BASE_URL as string;

export const socket = io(URL, {
  transports: ["websocket", "polling"],
});

// const { decodedToken } = getSession();

// socket.on("connect", () => {
//   socket.emit("user-connected", decodedToken);
// });
