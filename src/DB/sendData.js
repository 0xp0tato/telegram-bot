const User = require("./models/userSchema.js");

async function getData() {
  const data = await User.find();

  return data;
}

module.exports = { getData };
