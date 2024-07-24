// подключение express
const express = require("express");
// создаем объект приложения
const app = express();
app.use(express.json());
// подключение mysql
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
// функция для вывода по id
function selectbyID(id, response) {
    const selectQuery = 'SELECT * FROM items WHERE id = ?';
    connection.query(selectQuery, [id], (error, results) => {
        if (error) {
          response.send(error);
          return;
        }
    
        if (results.length === 0) {
          response.send([{}]);
        } else {
          response.send(results);
        }
    });
}

// определяем обработчик для маршрута "/"
app.get("/", function(_, response){
    // отправляем ответ
    response.send("<h1>Привет, Октагон!</h1>");
});
// возвращаем json для маршрута "/static"
app.get("/static", function(_, response){
    response.json({
        header: "Hello", 
        body: "Octagon NodeJS Test"
    });
});

// считываем параметры и возвращаем json для маршрута "/dynamic"
app.use("/dynamic", function(request, response){
    const {a, b, c} = request.query;
    const arr = [a, b, c];

    for (const v of arr) {
        if (isNaN(v) || v == undefined) return response.json({header: "Error"})
    }

    const result = (Number(a)*Number(b)*Number(c))/3;
    response.json({header: "Calculated", body: result});
});

// вывод всех записей из БД
app.get("/getAllItems", function(request, response){
    connection.query('SELECT * FROM items', function(err, results) {
		if (err) {
			response.send(err);
		}
		else if (results.length === 0) {
			response.send([{}]); 
		}
		else {
			response.send(results); 
		}
	});
});

// добавление новой записи в БД и ее вывод
app.post("/addItem", function(request, response){
    const name = request.query.name;
    const desc = request.query.desc;

    if (!name || !desc) {
        response.send(null);
        return;
    }

    const sql = "INSERT INTO items (name, descc) VALUES (?, ?)";
    connection.query(sql, [name, desc], function(err, results){
        if (err) response.send(err)
        else selectbyID(results.insertId, response);
    });
});

// удаление записи из БД
app.post("/deleteItem", function(request, response){
    const id = request.query.id;

    if (!id || isNaN(id)) response.send(null)
    else {
        const sql = 'DELETE FROM items WHERE id = ?';
	    connection.query(sql, [id], (error, _) => {
            if (error) response.send(error)
            else response.send([{}]);
	    });
    }
});

// обновление записи в БД и ее вывод
app.post("/updateItem", function(request, response){
    const {id, name, desc} = request.query;

    if (!id || !name || !desc) {
        response.send(null);
        return;
    }

    if (isNaN(id)) response.send(null)
    else {
        const sql = 'UPDATE items SET name = ?, descc = ? WHERE id = ?';
        connection.query(sql, [name, desc, id], (error, results) => {
            if (error) response.send(error)
            else if (results.affectedRows == 0) response.send([{}])
                else selectbyID(id, response);
        });
    }
});


// начинаем прослушивать подключения на 3000 порту
app.listen(3000);