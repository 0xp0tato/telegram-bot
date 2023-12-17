const User = require("./models/userSchema.js");

async function getTwitterCreds(userName) {
  try {
    const user = await User.findOne({ userName });

    if (
      !user ||
      !user.twitterCreds.oauth_token ||
      !user.twitterCreds.oauth_verifier
    ) {
      console.log("Username invalid");
      return;
    }

    const oauth_token = user.twitterCreds.oauth_token;
    const oauth_verifier = user.twitterCreds.oauth_verifier;

    return { oauth_token, oauth_verifier };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getTwitterCreds };
