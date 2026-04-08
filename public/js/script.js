const form = document.getElementById("formTarefa");
const listaTarefas = document.getElementById("listaTarefas");

// --- 1. SEGURANÇA E IDENTIFICAÇÃO ---

const userStorage = localStorage.getItem("usuario");

// Se não houver nada no storage, redireciona para o login imediatamente
if (!userStorage) {
    window.location.href = "login.html";
}

// Converte a string do localStorage de volta para um objeto JS
const usuario = JSON.parse(userStorage);

// Exibe a mensagem de boas-vindas com o nome do usuário logado
// Certifique-se de que existe um elemento com id="boasVindas" no seu index.html
const elementoBoasVindas = document.getElementById("boasVindas");
if (elementoBoasVindas) {
    elementoBoasVindas.innerText = `Seja bem-vindo(a), ${usuario.nome}!`;
}

// --- 2. LISTAR TAREFAS (Somente as do usuário logado) ---

async function carregarTarefas() {
    try {
        // Enviamos o ID do usuário como query parameter para o backend filtrar
        const res = await fetch(`/tarefas?user_id=${usuario.id}`);
        const tarefas = await res.json();

        listaTarefas.innerHTML = "";

        if (tarefas.length === 0) {
            listaTarefas.innerHTML = "<p>Você ainda não tem tarefas cadastradas.</p>";
            return;
        }

        tarefas.forEach(t => {
            const div = document.createElement("div");
            div.classList.add("tarefa");
            div.innerHTML = `
                <h3>${t.titulo}</h3>
                <p>${t.descricao}</p>
                <small>Status: <strong>${t.status}</strong></small>
            `;
            listaTarefas.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
    }
}

// --- 3. CADASTRAR TAREFA (Vinculada ao ID do usuário) ---

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    try {
        const res = await fetch("/tarefas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                titulo, 
                descricao, 
                user_id: usuario.id // Chave estrangeira para o MySQL
            })
        });

        if (res.ok) {
            form.reset();
            carregarTarefas(); // Atualiza a lista automaticamente
        } else {
            alert("Erro ao salvar a tarefa.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
});

// --- 4. LOGOUT (Sair do Sistema) ---

/**
 * Função global para ser chamada pelo botão "Sair"
 * O atributo onclick="logout()" no HTML acionará este código
 */
function logout() {
    // Limpa token e dados do usuário
    localStorage.clear(); 
    // Manda para a tela de acesso
    window.location.href = "login.html";
}

// Inicia a listagem assim que a página carrega
carregarTarefas();