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
const { registerUser, loginUser } = require("./DB/auth");
const { generateToken, verifyToken } = require("./jwt");

const app = express();
app.use(cors());
app.use(express.json());
// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

require("dotenv").config();

const TelegramBotToken = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(TelegramBotToken, { polling: true });
connectToDB();

// SetupPassport();

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const result = await registerUser(username, password);

  if (result.success) {
    res.status(201).json({ message: result.message });
  } else {
    res.status(400).json({ message: result.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await loginUser(username, password);

  console.log("-------", result);

  if (result.success) {
    const jwtToken = generateToken(username);
    res.status(200).json({
      message: result.message,
      username: result.user.username,
      isAdmin: result.user.isAdmin,
      jwtToken: jwtToken,
    });
  } else {
    res.status(401).json({ message: result.message });
  }
});

app.get("/get-data", verifyToken, async function (req, res) {
  const data = await getData();

  res.send(data);
});

app.get("/api/auth/twitter", verifyToken, (req, res, next) => {
  username = req.query.username;

  passport.authenticate("twitter")(req, res, next);
});

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  async function (req, res) {
    // Successful authentication, redirect home.
    console.log(req.query);
    res.redirect("http://localhost:5173?success=true");
  }
);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);

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
