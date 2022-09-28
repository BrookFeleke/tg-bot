// https://github.com/yagop/node-telegram-bot-api/issues/319#issuecomment-324963294
// Fixes an error with Promise cancellation
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOT_TOKEN;
const axios = require("axios");
process.env.NTBA_FIX_319 = "test";
const bot = new TelegramBot(token);
const channelID = process.env.CHANEL_ID;
const myID = process.env.MY_ID;
// Require our Telegram helper package

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const type = ["top", "hot", "new"];
const time = ["day", "week", "year"];

const   getting= async() => {
  const randomTime = time[getRandom(0, time.length)];
  const randomType = type[getRandom(0, type.length)];
  console.log(randomTime, "--------------------");
  try {
      const  response = await axios.get(`https://www.reddit.com/r/dadjokes/top.json?t=${randomTime}`)
console.log(response);
    for (let i = 0; i < 3; i++) {
      let randomPost = getRandom(
        0,
        response["data"]["data"]["children"].length
      );
      const joke =
       await response["data"]["data"]["children"][randomPost]["data"]["title"];
      const punchLine =
        await response["data"]["data"]["children"][randomPost]["data"]["selftext"];
      await bot.sendMessage(channelID, `${joke}  \n\n ${punchLine}`,{ parse_mode: "Markdown" });
      await bot.sendMessage(myID, `${joke}  \n\n ${punchLine}`,{ parse_mode: "Markdown" });
    }
  } catch (error) {
    console.error("Error sending message");
    console.log(error.toString());
  }
}

// Export as an asynchronous function
// We'll wait until we've responded to the user
module.exports = async (request, response) => {
    console.log(process.env.PORT);
  try {
    // Create our new bot handler with the token
    // that the Botfather gave us
    // Use an environment variable so we don't expose it in our code
    // const bot = new TelegramBot(process.env.BOT_TOKEN);
    // Retrieve the POST request body that gets sent from Telegram
    const { body } = request;
    console.log(body);

    // Ensure that this is a message being sent
    if (body.message) {
      // Retrieve the ID for this chat
      // and the text that the user sent
      const {
        chat: { id },
        text,
      } = body.message;

      if (
        text.toString().toLowerCase().includes("post") &&
        id === parseInt(myID)
      ) {
        await getting();
      } else {
        // Create a message to send back
        // We can use Markdown inside this
        const message = `✅ Thanks for your message: *"${text}"*\nHave a great day! 👋🏻`;

        // Send our new message back in Markdown and
        // wait for the request to finish
        await bot.sendMessage(id, message, { parse_mode: "Markdown" });
      }
    }
  } catch (error) {
    // If there was an error sending our message then we
    // can log it into the Vercel console
    console.error("Error sending message");
    console.log(error.toString());
  }

  // Acknowledge the message with Telegram
  // by sending a 200 HTTP status code
  // The message here doesn't matter.
  response.send("OK");
};
