const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
  const connectionURL = process.env.MONGODB_URL;

  mongoose
    .connect(connectionURL)
    .then(() => console.log("Database Connected Successfully"))
    .catch((err) => console.log("Error:", err));
};

module.exports = { connectToDB };
