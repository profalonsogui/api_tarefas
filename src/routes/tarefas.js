const express = require("express");
const router = express.Router();
const db = require("../database");

// 1. LISTAR TAREFAS (GET /tarefas) - ATUALIZADO COM FILTRO
router.get("/", (req, res) => {
    // Pegamos o user_id da Query String (?user_id=X)
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ mensagem: "ID do usuário não fornecido para listar tarefas." });
    }

    // Agora filtramos para que o usuário veja APENAS as dele
    const sql = "SELECT * FROM tarefas WHERE user_id = ?";
    
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao buscar tarefas", detalhes: err });
        }
        res.json(result);
    });
});

// 2. CADASTRAR TAREFA (POST /tarefas) - COMPLETO
router.post("/", (req, res) => {
    const { titulo, descricao, user_id } = req.body;

    // Validação simples
    if (!titulo || !user_id) {
        return res.status(400).json({ mensagem: "Título e ID do usuário são obrigatórios." });
    }

    const sql = "INSERT INTO tarefas (titulo, descricao, status, user_id) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [titulo, descricao, "pendente", user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao salvar tarefa", detalhes: err });
        }

        res.status(201).json({
            mensagem: "Tarefa criada com sucesso!",
            id: result.insertId
        });
    });
});

// 3. ATUALIZAR STATUS (PUT /tarefas/:id) - COMPLETO
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE tarefas SET status = ? WHERE id = ?";
    
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json(err);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada." });
        }

        res.json({ mensagem: "Tarefa atualizada!" });
    });
});

// 4. EXCLUIR TAREFA (DELETE /tarefas/:id) - COMPLETO
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM tarefas WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada." });
        }

        res.json({ mensagem: "Tarefa excluída com sucesso!" });
    });
});

module.exports = router;