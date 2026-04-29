# 📚 Documentação do Backend - API de Tarefas

## 📋 Sumário Executivo

Este projeto é uma **API REST** (conjunto de endpoints que fornece dados através de requisições HTTP) para gerenciamento de tarefas. Funciona como o "coração" da aplicação, responsável por receber solicitações do frontend (interface visual) e interagir com o banco de dados.

---

## 🏗️ Arquitetura Geral

O backend é estruturado em 3 camadas principais:

```
┌─────────────────────────────────────┐
│    Frontend (HTML, CSS, JS)         │  ← Interface visual do usuário
└──────────────┬──────────────────────┘
               │ Requisições HTTP
               ↓
┌─────────────────────────────────────┐
│    API Backend (Express)            │  ← Processa as requisições
│  ├── Autenticação (Login/Cadastro)  │
│  └── Gerenciamento de Tarefas       │
└──────────────┬──────────────────────┘
               │ Consultas SQL
               ↓
┌─────────────────────────────────────┐
│    Banco de Dados (MySQL)           │  ← Armazena os dados
└─────────────────────────────────────┘
```

---

## 🔧 Tecnologias Utilizadas

### **Express.js** (Framework Web)
- É como um "maestro" que orquestra as requisições HTTP
- Recebe as requisições do frontend e direciona para o lugar certo
- Gerencia as rotas (caminhos) da API

### **MySQL** (Banco de Dados)
- Armazena permanentemente os dados dos usuários e tarefas
- Organiza tudo em tabelas (como planilhas Excel)
- Exemplo: tabela `users` armazena usuários, tabela `tarefas` armazena tarefas

### **bcryptjs** (Criptografia de Senhas)
- Transforma a senha em um código ilegível antes de guardar no banco
- Mesmo que alguém acesse o banco, não consegue descobrir a senha

### **jsonwebtoken (JWT)** (Token de Autenticação)
- Depois que o usuário faz login, recebe um "crachá digital" chamado Token
- Este token prova que o usuário já se autenticou
- A cada requisição, o usuário envia o token para provar quem é

---

## 📁 Estrutura de Arquivos

```
src/
├── server.js              → Arquivo principal que inicia o servidor
├── database.js            → Conexão com o MySQL
└── routes/
    ├── auth.js            → Rotas de Autenticação (Login/Cadastro)
    └── tarefas.js         → Rotas de Gerenciamento de Tarefas
```

---

## 🚀 Componentes Principais

### **1. server.js** - O Servidor Principal

Este arquivo:
- ✅ Inicia o Express (framework web)
- ✅ Carrega as rotas de autenticação e tarefas
- ✅ Configura o middleware `express.json()` (permite receber dados em formato JSON)
- ✅ Define a porta 3000 (endereço onde o servidor fica "ouvindo")
- ✅ Serve os arquivos estáticos (HTML, CSS, imagens)

**Fluxo**: Requisição chega → Express direciona para a rota correta → Resposta é enviada

---

### **2. database.js** - Conexão com o Banco

Este arquivo:
- ✅ Estabelece conexão com o MySQL
- ✅ Credenciais: `host: localhost`, `user: root`, `database: prj_api_tarefas`
- ✅ É exportado e usado em todos os arquivos de rotas para fazer consultas

**Nota**: As credenciais estão "hardcoded" (escritas diretamente no código). Para segurança, devem ficar em um arquivo `.env` (variáveis de ambiente).

---

### **3. routes/auth.js** - Autenticação de Usuários

Gerencia o login e cadastro. Possui 2 rotas principais:

#### **POST /auth/register** (Cadastro)
```
O que faz: Cria um novo usuário no banco de dados

Entrada esperada (JSON):
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}

Processo:
1. Valida se todos os campos foram preenchidos
2. Verifica se o email já existe no banco
3. Criptografa a senha com bcrypt
4. Insere o novo usuário no banco de dados

Resposta de sucesso (201):
{ "mensagem": "Usuário cadastrado com sucesso!" }

Respostas de erro (400/500):
{ "mensagem": "Este e-mail já está em uso." }
```

#### **POST /auth/login** (Login)
```
O que faz: Autentica um usuário e retorna um Token JWT

Entrada esperada (JSON):
{
  "email": "joao@email.com",
  "senha": "123456"
}

Processo:
1. Busca o usuário pelo email no banco
2. Compara a senha digitada com a senha criptografada do banco
3. Se correto, gera um Token JWT com validade de 1 dia
4. Retorna o token e dados do usuário

Resposta de sucesso (200):
{
  "mensagem": "Login realizado!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": { "id": 1, "nome": "João Silva" }
}

Respostas de erro (401/500):
{ "mensagem": "Usuário ou senha incorretos." }
```

**Segurança**: O token contém o ID e nome do usuário criptografados, permitindo identificá-lo em requisições futuras.

---

### **4. routes/tarefas.js** - Gerenciamento de Tarefas

Implementa as operações CRUD (Create, Read, Update, Delete - Criar, Ler, Atualizar, Deletar):

#### **GET /tarefas** (Listar Tarefas)
```
O que faz: Retorna todas as tarefas de um usuário específico

Entrada esperada (Query String):
/tarefas?user_id=1

Processo:
1. Recebe o ID do usuário
2. Filtra apenas as tarefas daquele usuário no banco
3. Retorna a lista em JSON

Resposta (200):
[
  { "id": 1, "titulo": "Estudar Node.js", "descricao": "...", "status": "pendente", "user_id": 1 },
  { "id": 2, "titulo": "Fazer projeto", "descricao": "...", "status": "em_progresso", "user_id": 1 }
]
```

#### **POST /tarefas** (Criar Tarefa)
```
O que faz: Cria uma nova tarefa para um usuário

Entrada esperada (JSON):
{
  "titulo": "Estudar Express",
  "descricao": "Aprender rotas e middleware",
  "user_id": 1
}

Processo:
1. Valida se titulo e user_id foram fornecidos
2. Insere a tarefa no banco com status inicial "pendente"
3. Retorna o ID da tarefa criada

Resposta (201):
{ "mensagem": "Tarefa criada com sucesso!", "id": 5 }
```

#### **PUT /tarefas/:id** (Atualizar Status)
```
O que faz: Altera o status de uma tarefa (pendente → em_progresso → concluída)

Entrada esperada (JSON no body):
{ "status": "em_progresso" }

URL: /tarefas/1

Processo:
1. Busca a tarefa pelo ID
2. Atualiza o status no banco
3. Informa sucesso ou erro

Resposta (200):
{ "mensagem": "Tarefa atualizada!" }
```

#### **DELETE /tarefas/:id** (Excluir Tarefa)
```
O que faz: Remove uma tarefa do banco de dados

URL: /tarefas/1

Processo:
1. Busca a tarefa pelo ID
2. Deleta do banco
3. Informa sucesso ou erro

Resposta (200):
{ "mensagem": "Tarefa excluída com sucesso!" }
```

---

## 📊 Fluxo de Requisição Completo

### **Exemplo: Um usuário faz login**

```
1. Frontend envia requisição:
   POST /auth/login
   Body: { "email": "joao@email.com", "senha": "123456" }

2. Express recebe em server.js
   ↓

3. Direciona para routes/auth.js (porque é /auth)
   ↓

4. auth.js executa:
   - Busca usuário no banco de dados (database.js)
   - Compara senhas (bcryptjs)
   - Gera token (jsonwebtoken)
   ↓

5. Express retorna resposta:
   {
     "mensagem": "Login realizado!",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "usuario": { "id": 1, "nome": "João Silva" }
   }

6. Frontend recebe o token
   ↓

7. Frontend usa o token para listar tarefas:
   GET /tarefas?user_id=1
   Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Estrutura do Banco de Dados

### **Tabela: users**
```sql
├── id          (INT, Chave Primária, Auto-incremento)
├── nome        (VARCHAR, Texto do usuário)
├── email       (VARCHAR, Email único)
└── senha       (VARCHAR, Criptografada com bcrypt)
```

### **Tabela: tarefas**
```sql
├── id          (INT, Chave Primária, Auto-incremento)
├── titulo      (VARCHAR, Título da tarefa)
├── descricao   (TEXT, Descrição detalhada)
├── status      (ENUM: 'pendente', 'em_progresso', 'concluída')
├── user_id     (INT, Referência à tabela users - garante que cada tarefa pertença a um usuário)
└── created_at  (TIMESTAMP, Data de criação - adicionar depois)
```

---

## 🔐 Segurança

### **Boas Práticas Implementadas**
✅ Senhas criptografadas com bcryptjs (impossível recuperar senha original)
✅ Tokens JWT para autenticação stateless (sem armazenar sessão no servidor)
✅ Validação de entrada (verificar se campos obrigatórios foram preenchidos)

### **Melhorias Recomendadas** (Para Produção)
⚠️ **Usar arquivo .env** para credenciais (não deixar expostas no código)
⚠️ **Validação mais rigorosa** com biblioteca como `joi` ou `yup`
⚠️ **HTTPS** em vez de HTTP (criptografa toda comunicação)
⚠️ **Rate Limiting** (limitar requisições por IP para evitar ataques)
⚠️ **CORS** configurado corretamente (controlar quem pode acessar a API)

---

## 🚦 Status HTTP Explicado

| Status | Significado | Exemplo |
|--------|------------|---------|
| **200** | OK - Requisição bem-sucedida | Login realizado |
| **201** | Created - Recurso criado | Tarefa criada |
| **400** | Bad Request - Dados inválidos | Email já em uso |
| **401** | Unauthorized - Não autenticado | Senha incorreta |
| **404** | Not Found - Recurso não existe | Tarefa não encontrada |
| **500** | Server Error - Erro interno | Falha no banco de dados |

---

## 🧪 Como Testar a API

### **Usando ferramentas como Postman ou Insomnia:**

```
1. Cadastrer um usuário:
   POST http://localhost:3000/auth/register
   Body: { "nome": "Test User", "email": "test@test.com", "senha": "123456" }

2. Fazer login:
   POST http://localhost:3000/auth/login
   Body: { "email": "test@test.com", "senha": "123456" }
   → Copiar o token retornado

3. Criar uma tarefa:
   POST http://localhost:3000/tarefas
   Body: { "titulo": "Minha tarefa", "descricao": "Descrição", "user_id": 1 }

4. Listar tarefas:
   GET http://localhost:3000/tarefas?user_id=1

5. Atualizar tarefa:
   PUT http://localhost:3000/tarefas/1
   Body: { "status": "em_progresso" }

6. Deletar tarefa:
   DELETE http://localhost:3000/tarefas/1
```

---

## 📝 Scripts Disponíveis

No `package.json`:

```json
{
  "start": "node src/server.js",     // Inicia o servidor normalmente
  "dev": "nodemon src/server.js"     // Inicia com auto-reload (recomendado para desenvolvimento)
}
```

**Para rodá-los:**
```bash
npm start          # Modo produção
npm run dev        # Modo desenvolvimento (reinicia automaticamente quando arquivo muda)
```

---

## 🎯 Próximas Melhorias Sugeridas

1. **Implementar Validação com Joi** - Validação mais robusta de dados
2. **Adicionar Middlewares de Autenticação** - Proteger rotas que precisam de login
3. **Implementar Logging** - Registro de erros para debugging
4. **Adicionar Paginação** - Para quando houver muitas tarefas
5. **Rate Limiting** - Proteger contra ataques de força bruta
6. **Documentação Automática (Swagger)** - Documentação interativa da API
7. **Testes Automatizados** - Garantir que o código funciona corretamente

---

## 📚 Referências Rápidas

- [Express.js Documentation](https://expressjs.com/)
- [MySQL2 Documentation](https://www.npmjs.com/package/mysql2)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [JWT Guide](https://jwt.io/)

---

**Última atualização:** Abril 2026  
**Versão:** 1.0.0
