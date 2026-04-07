const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Chave secreta para assinar o Token (No TCC, diga que isso deve ficar em um arquivo .env)
const JWT_SECRET = "b37e8aa7d61455024cc4ac9775552e40059a631a566f4a0064bac7b53305fcc0";

// 1. ROTA DE CADASTRO (POST /auth/register)
router.post("/register", async (req, res) => {
    const { nome, email, senha } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos!" });
    }

    try {
        // Verificar se o e-mail já existe
        db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.length > 0) {
                return res.status(400).json({ mensagem: "Este e-mail já está em uso." });
            }

            // Criptografar a senha
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            // Inserir no banco
            const sql = "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)";
            db.query(sql, [nome, email, senhaHash], (err, result) => {
                if (err) return res.status(500).json(err);
                res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
            });
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
});

// 2. ROTA DE LOGIN (POST /auth/login)
router.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios!" });
    }

    // Buscar o usuário pelo e-mail
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json(err);
        
        if (result.length === 0) {
            return res.status(401).json({ mensagem: "Usuário ou senha incorretos." });
        }

        const usuario = result[0];

        // Comparar a senha digitada com a senha criptografada no banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Usuário ou senha incorretos." });
        }

        // Gerar o Token JWT (O "crachá" de acesso)
        // Guardamos o ID do usuário dentro do token para saber quem ele é depois
        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            JWT_SECRET,
            { expiresIn: "1d" } // Token vale por 1 dia
        );

        res.json({
            mensagem: "Login realizado!",
            token: token,
            usuario: { id: usuario.id, nome: usuario.nome }
        });
    });
});

module.exports = router;