const TelegramBot = require("node-telegram-bot-api");
const http = require('http')
require("dotenv").config();
const token = process.env.BOT_TOKEN;
console.log(token)
const bot = new TelegramBot(token, { polling: true });
const channelID = process.env.CHANEL_ID;
const nati = process.env.GROUP_ID;
console.log(process.env.BOT_TOKEN);
const r = new RegExp(/^[0-9()]*( ?[+\-*/=]{1}[0-9()]+)*?[+\-*/=]?[0-9()]$/gm);
bot.on("message", (msg) => {
  if (msg.text.toString().toLowerCase().includes("post")) {
    {
      bot.sendMessage(
        nati,
        msg.text.replace("post", `${msg.chat.first_name} sent: `)
      );
    }
  }

  bot.sendMessage(msg.chat.id, ` ${msg.chat.id}`);
  if (msg.forward_from_chat) {
    bot.sendMessage(
      msg.chat.id,
      `forwarded fron chat ${msg.forward_from_chat.id}`
    );
  }
  if (r.test(msg.text)) {
    bot.sendMessage(
      msg.chat.id,
      `Yes this is a math equation good job  \n (if you are confused and dont think that it should be a math equation then constants could be math equations iko )`
    );
  } else {
    bot.sendMessage(
      msg.chat.id,
      "This is not a math equation what were u thinking "
    );
  }
  console.log(msg);
  console.log("----------------------------");
});

const PORT = process.env.PORT || 3000

http.createServer((req,res)=>{
  if (req.url === "/") {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>Hello</h1>");
  }
}).listen(PORT)