const express = require("express");
const cors = require("cors");
const connectTODatabase = require("./config/db");
const authRoutes = require("./routes/auth");
const app = express();
require("dotenv").config();

// middlwares
app.use(cors());
app.use(express.json());

// connect to database
connectTODatabase();

// routes
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on ${process.env.PORT || 5000}`);
});
