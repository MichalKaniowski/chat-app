const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const testRoutes = require("./routes/testRoutes");

const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");

require("dotenv").config();
mongoose.connect(process.env.MONGO_URL);

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "500kb" }));

app.use("/users", userRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);
app.use("/test", testRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("user-connected", (token) => {
    // maybe verify the token
    socket.emit("user-connected-received", token.id);
  });

  socket.on("send-message", ({ message, room }) => {
    socket.to(room).emit("receive-message", message);
  });

  socket.on("create-conversation", (conversation) => {
    socket.to(conversation._id).emit("receive-conversation", conversation);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected");
  });
});

mongoose.connection.once("open", () => console.log("Connected to database"));
mongoose.connection.on("error", (error) =>
  console.log("Error has occured while being connected to database: ", error)
);

server.listen(3000, () => console.log("Server is running on port 3000."));
