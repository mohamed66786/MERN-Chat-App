const express = require("express");
const cors = require("cors");
const connectTODatabase = require("./config/db");
const app = express();
require("dotenv").config();

// middlwares
app.use(cors());
app.use(express.json());

// connect to database
connectTODatabase();

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on ${process.env.PORT || 5000}`);
});
