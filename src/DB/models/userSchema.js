const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: Number,
  firstName: String,
  userName: String,
  twitterCreds: {
    oauth_token: String,
    oauth_verifier: String,
  },
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
