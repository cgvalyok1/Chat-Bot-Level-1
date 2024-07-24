const TelegramBot = require("node-telegram-bot-api");


const token = "6918720162:AAHv1BVxPlL4DRXBqwMp0sXm4XjKDf6LXKY";

const bot = new TelegramBot(token, {polling: true});

const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "chatbottests"
})
connection.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
      }
      else{
        console.log("Подключение к серверу MySQL успешно установлено");
      }
})
const help = ["/site - Получить ссылку на сайт Октагона", 
                "/creator - Узнать ФИО автора",
                "/randomItem - возвращает случайный объект из БД",
				"/deleteItem [id] - удаляет предмет из БД по ID",
				"/getItemByID [id] - возвращает предмет из БД по ID"];

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
  
    bot.sendMessage(chatId, "Привет, октагон!");
});

bot.onText(/\/help/, (msg) => {
    let message = "";
    for (m in help) message += help[m] + "\n";
    bot.sendMessage(msg.chat.id, message);
});

bot.onText(/\/site/, (msg) => {
    bot.sendMessage(msg.chat.id, "https://students.forus.ru");
});

bot.onText(/\/creator/, (msg) => {
    bot.sendMessage(msg.chat.id, "Автор функционала бота - Грац Валентин");
});

bot.onText(/\/randomItem/, (msg) => {
    connection.query('SELECT * FROM items', function(err, results) {
		if (err) {
			bot.sendMessage(msg.chat.id, err);
		} else if (results.length === 0) {
			bot.sendMessage(msg.chat.id, "Объектов в БД не найдено");
		} else {
			const randomIndex = Math.floor(Math.random() * results.length);
			const randomItem = results[randomIndex];
			const message = "(" + randomItem.id + ")" + " - " + randomItem.name + ": " + randomItem.descc;
			bot.sendMessage(msg.chat.id, message);
		}
	});
});

bot.onText(/\/deleteItem (.+)/, (msg, match) => {
    const id = match[1];
    if (isNaN(id)) bot.sendMessage(msg.chat.id, "Ожидалось единственное число после команды /deleteItem")
    else connection.query('DELETE FROM items WHERE id = ?', [id], function(err, results) {
        if (err) {
            bot.sendMessage(msg.chat.id, "Не удалось произвести удаление");
        } else if (results.affectedRows === 0) {
            bot.sendMessage(msg.chat.id, "Ошибка");
        } else {
             bot.sendMessage(msg.chat.id, "Удачно");
        }
    });
});

bot.onText(/\/getItemByID (.+)/, (msg, match) => {
    const id = match[1];
    if (isNaN(id)) bot.sendMessage(msg.chat.id, "Ожидалось единственное число после команды /getItemByID")
    else connection.query('SELECT * FROM items WHERE id = ?', [id], function(err, results) {
		if (err) {
			bot.sendMessage(msg.chat.id, err);
		} else if (results.length === 0) {
			bot.sendMessage(msg.chat.id, "Объекта c таким id не найдено");
		} else {
			const message = "(" + results[0].id + ")" + " - " + results[0].name + ": " + results[0].descc;
			bot.sendMessage(msg.chat.id, message);
		}
	});
});

bot.on('polling_error', (error) => {
    console.error('polling_error', error);
  });

