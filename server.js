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

/**
 * GET /tarefas
 * Lista todas as tarefas
 * Ex: GET http://localhost:3000/tarefas
 *
 * Extra: filtro por concluída
 * Ex: GET /tarefas?concluida=true
 */
app.get("/tarefas", (req, res) => {
  // Lê query string ?concluida=true/false
  const { concluida } = req.query;

  // Se não veio filtro, devolve tudo
  if (concluida === undefined) {
    return res.json(tarefas);
  }

  // Converte string para boolean
  const valor = concluida === "true";

  // Filtra tarefas conforme concluída ou não
  const filtradas = tarefas.filter((t) => t.concluida === valor);

  return res.json(filtradas);
});


/**
 * POST /tarefas
 * Cria uma nova tarefa
 * Ex: POST http://localhost:3000/tarefas
 * Body JSON: { "titulo": "Fazer exercício" }
 */
app.post("/tarefas", (req, res) => {
  // Pega o titulo do body (JSON enviado)
  const { titulo } = req.body;

  // Validação simples do título
  if (!titulo || typeof titulo !== "string" || titulo.trim().length < 3) {
    return res.status(400).json({
      erro: "Campo 'titulo' é obrigatório e deve ter pelo menos 3 caracteres.",
    });
  }

  // Monta o objeto da nova tarefa
  const novaTarefa = {
    id: proximoId++, // usa o proximoId e já incrementa
    titulo: titulo.trim(),
    concluida: false, // toda tarefa nasce como não concluída
  };

  // Salva no array
  tarefas.push(novaTarefa);

  // Retorna 201 (criado) + a nova tarefa
  return res.status(201).json(novaTarefa);
});


// Define a porta (padrão 3000)
const PORT = process.env.PORT || 3001;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});