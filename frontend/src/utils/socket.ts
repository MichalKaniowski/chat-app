import { io } from "socket.io-client";
// import getSession from "./getSession";

const URL = "http://localhost:3000";
// const URL = import.meta.env.VITE_API_BASE_URL

export const socket = io(URL, {
  transports: ["websocket", "polling"],
});

// const { decodedToken } = getSession();

// socket.on("connect", () => {
//   socket.emit("user-connected", decodedToken);
// });
