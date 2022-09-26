require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
var cron = require("node-cron");
const axios = require("axios");

const token = process.env.BOT_TOKEN;
console.log(token);
const bot = new TelegramBot(token, { polling: true });
const channelID = process.env.CHANEL_ID;
const myID = process.env.MY_ID;

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const type = ["top", "hot", "new"];
const time = ["day", "week", "year"];
async function getting() {

  const randomTime = time[getRandom(0, time.length)];
  const randomType = type[getRandom(0, type.length)];
  console.log(randomTime, "--------------------");
  let response;
  await axios
    .get(`https://www.reddit.com/r/dadjokes/top.json?t=${randomTime}`)
    .then((result) => {
      response = result;
    })
    .catch(console.log("there was an error"));

  for (let i = 0; i < 3; i++) {
    let randomPost = getRandom(0, response["data"]["data"]["children"].length)
    const joke =
      response["data"]["data"]["children"][randomPost]["data"]["title"];
    const punchLine =
      response["data"]["data"]["children"][randomPost]["data"]["selftext"];
    bot.sendMessage(channelID, `${joke}  \n\n ${punchLine}`);
    bot.sendMessage(myID, `${joke}  \n\n ${punchLine}`);
  }
}

bot.on("message", (msg) => {
  console.log(msg);
  if (
    msg.text.toString().toLowerCase().includes("post") &&
    msg.from.id === parseInt(myID)
  ) {
    getting();
  }
});

// Emmits message event according to schedule
cron.schedule("*/10 * * * *", () => {
  console.log("running a task every three minutes");
  bot.emit("message", {
    message_id: 261,
    from: {
      id: parseInt(myID),
    },
    chat: {
      id: parseInt(myID),
    },
    text: "Post",
  });
});
