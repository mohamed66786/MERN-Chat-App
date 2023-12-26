const express = require("express");
const cors = require("cors");
const connectTODatabase = require("./config/db");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

// middlwares
app.use(cors());
app.use(express.json());

// connect to database
connectTODatabase();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on ${process.env.PORT || 5000}`);
});

// using socket.io ########################################
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
// initilization of map datastructure for online users
// when user is online and send message the data saved in database
// and also the data saved in map datastructure to show online
global.onlineUsers = new Map();

// starting listening on connection
io.on("connection", (socket) => {
  global.chatSocket = socket;
  // listen for adduser event
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // listen for sendmsg event
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  // writing msg
  socket.on("writing-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("other-writing-msg");
    }
  });
  // Not writing msg
  socket.on("not-writing-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("other-not-writing-msg");
    }
  });
});
