const TelegramBot = require("node-telegram-bot-api");
var cron = require("node-cron");

const axios = require("axios");
var events = require("events");
  
require("dotenv").config();
const token = process.env.BOT_TOKEN;
console.log(token);
const bot = new TelegramBot(token, { polling: true });
const channelID = process.env.CHANEL_ID;
const nati = process.env.GROUP_ID;
const myID = process.env.MY_ID;
const edilID = process.env.EDIL_ID;

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const type = ["top", "hot", "new"];
const time = ["day", "week", "year"];
async function getting() {
  // console.log(getRandom(0,type.length))
  const randomTime = time[getRandom(0, time.length)];
  const randomType = type[getRandom(0, type.length)];
  console.log(randomTime, "--------------------");
  let response;
  await axios
    .get(`https://www.reddit.com/r/dadjokes/top.json?t=${randomTime}`)
    .then((result) => {
      response = result;
      // console.log("This is the full data---------", result);
      // console.log("This is the data------------- ",result["data"]);
      // console.log("this is the children---------", result["data"]["data"]);
    })
    .catch(console.log("there was an error"));

  for (let i = 0; i < 3; i++) {
    let randomPost = getRandom(0, response["data"]["data"]["children"].length);
    console.log(
      "this is the child---------",
      response["data"]["data"]["children"].length
    );
    console.log(
      "this is the child---------",
      response["data"]["data"]["children"][randomPost]["data"]["title"]
    );
    console.log(
      "this is the child---------",
      response["data"]["data"]["children"][randomPost]["data"]["selftext"]
    );
    const joke =
      response["data"]["data"]["children"][randomPost]["data"]["title"];
    const punchLine =
      response["data"]["data"]["children"][randomPost]["data"]["selftext"];
    bot.sendMessage(channelID, `${joke}  \n\n ${punchLine}`);
    bot.sendMessage(myID, `${joke}  \n\n ${punchLine}`);
  }
}

bot.on("message", (msg) => {
  if (
    msg.text.toString().toLowerCase().includes("post") &&
    msg.from.id === parseInt(myID)
  ) {
    console.log(myID);
    console.log(msg.from.id);
    console.log(msg);
    getting();
  }
  if(
    msg.text.toString().toLowerCase().includes("pill") &&
    msg.from.id === parseInt(edilID)
  ){
    bot.sendMessage(myID, `Dont forget to take ur pills. \n\n XX`);
    bot.sendMessage(edilID, `Dont forget to take ur pills. \n\n XX`);
  }
});

cron.schedule("23 * * * *", () => {
  console.log("running a task every three minutes");
  bot.emit("message", {
    message_id: 261,
    from: {
      id: parseInt(myID),
      is_bot: false,
      first_name: "Brook",
      username: "B_r_o_o_k19",
      language_code: "en",
    },
    chat: {
      id: parseInt(myID),
      first_name: "Brook",
      username: "B_r_o_o_k19",
      type: "private",
    },
    date: 1655547586,
    text: "Post",
  });
});

cron.schedule("00 19 * * *", () => {
  bot.emit("message", { text: "pill", from: { id: parseInt(edilID) } });
});
