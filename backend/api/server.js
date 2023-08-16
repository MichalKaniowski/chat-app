const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGO_URL);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);

mongoose.connection.once("open", () => console.log("Connected to database"));
mongoose.connection.on("error", (error) =>
  console.log("Error has occured while being connected to database: ", error)
);

app.listen(3000, () => console.log("Server is running on port 3000."));
