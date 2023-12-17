const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const { handleCommand } = require("./botCommands");
const { connectToDB } = require("./DB/DBConnect");
const { getData } = require("./DB/sendData");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { SetupPassport } = require("./passportSetup");
const { storeTwitterData } = require("./DB/storeTwitterData");

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

require("dotenv").config();

const token = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(token, { polling: true });
let username;

SetupPassport();

app.get("/get-data", async function (req, res) {
  const data = await getData();

  res.send(data);
});

app.get("/api/auth/twitter", (req, res, next) => {
  username = req.query.username;

  passport.authenticate("twitter")(req, res, next);
});

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  async function (req, res) {
    // Successful authentication, redirect home.
    console.log(req.query);
    const { oauth_token, oauth_verifier } = req.query;
    res.redirect("http://localhost:5173?success=true");
  }
);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
  connectToDB();

  // Matches "/[whatever]"
  bot.onText(/\/(.+)/, async (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    // console.log(msg);
    // console.log(match);

    const userId = msg.from.id;
    const firstName = msg.from.first_name;
    const userName = msg.from.username;
    const fullCommand = match[0];

    const requestObject = { userId, firstName, userName, fullCommand };

    const response = (await handleCommand(requestObject)) || "recieved";

    // send back the matched "whatever" to the chat
    bot.sendMessage(userId, response);
  });
});

// bot.on("message", (msg) => {
//   console.log(msg);
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, "Received your message");
// });
