const TelegramBot = require("node-telegram-bot-api");


const token = "6918720162:AAHv1BVxPlL4DRXBqwMp0sXm4XjKDf6LXKY";

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
  
    bot.sendMessage(chatId, "Привет, октагон!");
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "/site - Получить ссылку на сайт Октагона\n/creator - Узнать ФИО автора");
});

bot.onText(/\/site/, (msg) => {
    bot.sendMessage(msg.chat.id, "https://students.forus.ru");
});

bot.onText(/\/creator/, (msg) => {
    bot.sendMessage(msg.chat.id, "Автор функционала бота - Грац Валентин");
});

bot.on('polling_error', (error) => {
    console.error('polling_error', error);
  });

