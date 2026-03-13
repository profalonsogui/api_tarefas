const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();

app.use(express.json());

// servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "..", "public")));

// rota GET para listar tarefas
app.get("/tarefas", (req, res) => {
    db.query("SELECT * FROM tarefas", (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

// rota POST para cadastrar tarefa
app.post("/tarefas", (req, res) => {
    const { titulo, descricao } = req.body;

    const sql = "INSERT INTO tarefas (titulo, descricao, status) VALUES (?, ?, ?)";

    db.query(sql, [titulo, descricao, "pendente"], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.status(201).json({
            mensagem: "Tarefa criada com sucesso!",
            id: result.insertId
        });
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});