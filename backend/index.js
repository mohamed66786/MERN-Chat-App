const express = require("express");
const cors = require("cors");
const connectTODatabase = require("./config/db");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const app = express();
const socket=require("socket.io")
require("dotenv").config();

// middlwares
app.use(cors());
app.use(express.json());

// connect to database
connectTODatabase();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server=app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on ${process.env.PORT || 5000}`);
});


// using socket.io
const io = socket(server,{
  cors: {
    origin: 'https://localhost:3000',
    credentials:true,
  },
}) 