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


// PUT /tarefas/:id - atualizar tarefa
app.put("/tarefas/:id", (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, status } = req.body;

    const sql = `
        UPDATE tarefas 
        SET titulo = ?, descricao = ?, status = ?
        WHERE id = ?
    `;

    db.query(sql, [titulo, descricao, status, id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        // verifica se encontrou a tarefa
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada" });
        }

        return res.json({ mensagem: "Tarefa atualizada com sucesso!" });
    });
});

// PATCH /tarefas/:id/status
app.patch("/tarefas/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE tarefas SET status = ? WHERE id = ?";

    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada" });
        }

        return res.json({ mensagem: "Status atualizado!" });
    });
});



app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});