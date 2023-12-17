const { TwitterApi } = require("twitter-api-v2");

const appKey = process.env.TWITTER_API_KEY;
const appSecret = process.env.TWITTER_API_KEY_SECRET;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

async function writeTweet(text) {
  const client = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
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
