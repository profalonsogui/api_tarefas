const mysql = require("mysql2");

// cria conexão com banco
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "prj_api_tarefas"
});

// conecta
connection.connect((err) => {
    if (err) {
        console.error("Erro ao conectar:", err);
        return;
    }
    console.log("Conectado ao MySQL!");
});

module.exports = connection;