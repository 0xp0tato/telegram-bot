const User = require("./models/userSchema.js");

async function storeTwitterData(username, oauth_token, oauth_verifier) {
  try {
    const filter = { userName: username };
    const update = {
      $set: {
        "twitterCreds.oauth_token": oauth_token,
        "twitterCreds.oauth_verifier": oauth_verifier,
      },
    };
    const options = { upsert: true, new: true };

    await User.findOneAndUpdate(filter, update, options);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { storeTwitterData };
