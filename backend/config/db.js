const mongoose = require("mongoose");

const connectTODatabase = async () => {
  await mongoose
    .connect(
      process.env.MONGO_URL ||
        "mongodb+srv://mohamed:mohamed@cluster0.maiv9qs.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = connectTODatabase;
