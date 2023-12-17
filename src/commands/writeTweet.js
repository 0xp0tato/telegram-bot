const { TwitterApi } = require("twitter-api-v2");

const appKey = process.env.TWITTER_API_KEY;
const appSecret = process.env.TWITTER_API_KEY_SECRET;

async function writeTweet(oauth_token, oauth_verifier, text) {
  const client = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: oauth_token,
    accessSecret: oauth_verifier,
  });

  const rwClient = client.readWrite;

  if (!text) return "No Text Provided";

  try {
    // Use .tweet() method and pass the
    // text you want to post
    await rwClient.v2.tweet(text);

    console.log("Tweeted Successfully");

    return "Tweeted Successfully";
  } catch (error) {
    console.log(error);
  }
}

module.exports = { writeTweet };
