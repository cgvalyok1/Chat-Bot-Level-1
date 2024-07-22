// подключение express
const express = require("express");
// создаем объект приложения
const app = express();

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

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);