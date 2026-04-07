const express = require("express");
const path = require("path");
const app = express();

// Importar as Rotas
const tarefasRoutes = require("./routes/tarefas");
const authRoutes = require("./routes/auth"); // Nova linha

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Vincular as rotas
app.use("/tarefas", tarefasRoutes);
app.use("/auth", authRoutes); // Tudo que for /auth/... vai para o auth.js

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});