// src/server.js

// Importa o framework Express (cria servidor e rotas HTTP)
const express = require("express");

// Cria a aplicação (servidor)
const app = express();

// Middleware do Express para entender JSON no corpo da requisição (req.body)
app.use(express.json());

/**
 * "Banco" em memória (array)
 * - Some quando o servidor reinicia
 * - Ótimo para iniciar com turma fraca
 */
let tarefas = [
  { id: 1, titulo: "Estudar Node.js", concluida: false },
  { id: 2, titulo: "Fazer atividade de GitHub", concluida: true },
];

// Controla o próximo ID para novas tarefas
let proximoId = 3;

/**
 * Rota raiz (teste rápido)
 * GET http://localhost:3000/
 */
app.get("/", (req, res) => {
  // Retorna um JSON simples
  return res.json({ mensagem: "API de Tarefas rodando ✅" });
});


// Define a porta (padrão 3000)
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});