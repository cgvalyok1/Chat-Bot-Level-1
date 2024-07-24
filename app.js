const TelegramBot = require("node-telegram-bot-api");


const token = "6918720162:AAHv1BVxPlL4DRXBqwMp0sXm4XjKDf6LXKY";

const bot = new TelegramBot(token, {polling: true});


bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, "Привет, октагон!");
});

