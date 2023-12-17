const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: Number,
  firstName: String,
  username: String,
  twitterCreds: {
    oauth_token: String,
    oauth_token_secret: String,
  },
  password: String,
  commands: [
    {
      timeStamp: Date,
      command: String,
      response: String,
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
