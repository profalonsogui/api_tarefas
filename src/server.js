const express = require("express");
const db = require("./database");

const app = express();

app.use(express.json());

// buscar tarefas
app.get("/tarefas", (req, res) => {

    db.query("SELECT * FROM tarefas", (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });

});

// criar tarefa
app.post("/tarefas", (req, res) => {

    const { titulo, descricao } = req.body;

    const sql = "INSERT INTO tarefas (titulo, descricao, status) VALUES (?, ?, ?)";

    db.query(sql, [titulo, descricao, "pendente"], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            mensagem: "Tarefa criada!",
            id: result.insertId
        });
    });

});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});