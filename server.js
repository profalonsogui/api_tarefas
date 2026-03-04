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
 * GET /tarefas/:id
 * Busca uma tarefa específica por ID
 * Ex: GET http://localhost:3000/tarefas/1
 */
app.get("/tarefas/:id", (req, res) => {
  // Pega o id da URL e converte para número
  const id = Number(req.params.id);

  // Procura a tarefa no array
  const tarefa = tarefas.find((t) => t.id === id);

  // Se não encontrar, retorna erro 404
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  // Se encontrar, retorna a tarefa
  return res.json(tarefa);
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

/**
 * PUT /tarefas/:id
 * Atualiza a tarefa inteira (titulo e concluida)
 * Ex: PUT http://localhost:3000/tarefas/1
 * Body JSON: { "titulo": "Novo título", "concluida": true }
 */
app.put("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  // Pega dados do body
  const { titulo, concluida } = req.body;

  // Encontra o índice da tarefa no array
  const indice = tarefas.findIndex((t) => t.id === id);

  // Se não existir, 404
  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  // Valida título
  if (!titulo || typeof titulo !== "string" || titulo.trim().length < 3) {
    return res.status(400).json({
      erro: "Campo 'titulo' é obrigatório e deve ter pelo menos 3 caracteres.",
    });
  }

  // Valida concluida (precisa ser boolean)
  if (typeof concluida !== "boolean") {
    return res.status(400).json({
      erro: "Campo 'concluida' deve ser boolean (true/false).",
    });
  }

  // Atualiza o objeto no array (substitui inteiro)
  tarefas[indice] = {
    id,
    titulo: titulo.trim(),
    concluida,
  };

  // Retorna a tarefa atualizada
  return res.json(tarefas[indice]);
});

/**
 * DELETE /tarefas/:id
 * Remove uma tarefa
 * Ex: DELETE http://localhost:3000/tarefas/1
 */
app.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  // Procura a tarefa
  const indice = tarefas.findIndex((t) => t.id === id);

  // Se não achar, 404
  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  // Remove 1 item do array e guarda o removido
  const removida = tarefas.splice(indice, 1)[0];

  // Retorna mensagem + tarefa removida
  return res.json({ mensagem: "Tarefa removida ✅", tarefa: removida });
});

// Define a porta (padrão 3000)
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});