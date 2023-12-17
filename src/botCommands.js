const { getTwitterCreds } = require("./DB/getTwitterCreds.js");
const User = require("./DB/models/userSchema.js");
const { getWeather } = require("./commands/getWeather.js");
const { writeTweet } = require("./commands/writeTweet.js");

async function handleCommand(requestObject) {
  let { userId, firstName, userName, fullCommand } = requestObject;

  fullCommand = fullCommand.split(" ");

  const command = fullCommand[0];
  const restText = fullCommand.slice(1, fullCommand.length).join(" ");

  const timeStamp = Date.now();

  let response;
  if (command === "/help") {
    response =
      "Available commands:\n 1. /weather <city_name> -> Will give weather description of that city \n 2. /tweet <message> -> Will tweet from your twitter account on your behalf (Will require developer access)";
  } else if (command === "/weather") {
    response = await getWeather(restText);
  } else if (command === "/tweet") {
    response = await writeTweet(restText);
  } else {
    response = "Invalid Command";
  }

  try {
    const userExists = await User.findOne({ userId });

    if (userExists) {
      userExists.commands.push({
        timeStamp: timeStamp,
        command: command,
        response: response,
      });
      await userExists.save();
    } else {
      const user = new User();

      user.userId = userId;
      user.firstName = firstName;
      user.userName = userName;
      user.commands.push({
        timeStamp: timeStamp,
        command: command,
        response: response,
      });
      await user.save();
    }
  } catch (error) {
    console.log(error);
  }

  return response;
}

module.exports = { handleCommand };
