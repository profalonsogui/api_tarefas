const form = document.getElementById("formTarefa");
const listaTarefas = document.getElementById("listaTarefas");

// 1. SEGURANÇA: Se não tem usuário logado, expulsa para o login
const userStorage = localStorage.getItem("usuario");
if (!userStorage) {
    window.location.href = "login.html";
}
const usuario = JSON.parse(userStorage);

// Exibe a mensagem de Boas-vindas
document.getElementById("mensagemBoasVindas").innerHTML = `Seja bem-vindo(a), <strong>${usuario.nome}</strong>!`;

// 2. LISTAR TAREFAS (Somente as minhas)
async function carregarTarefas() {
    try {
        // Passamos o ID do usuário na URL como filtro
        const res = await fetch(`/tarefas?user_id=${encodeURIComponent(usuario.id)}`);

        if (!res.ok) {
            let detalhes = "";
            try {
                const body = await res.json();
                detalhes = body?.mensagem || body?.erro || JSON.stringify(body);
            } catch {
                detalhes = await res.text();
            }

            listaTarefas.innerHTML = "";
            throw new Error(detalhes || `Erro ao carregar tarefas (HTTP ${res.status}).`);
        }

        const tarefas = await res.json();

        listaTarefas.innerHTML = "";
        tarefas.forEach((t) => {
            const div = document.createElement("div");
            div.classList.add("tarefa");
            
            // Lógica visual para tarefas concluídas
            const isConcluida = t.status === "concluida";
            const classeOpacidade = isConcluida ? "tarefa-concluida" : "";
            const classeRisco = isConcluida ? "texto-riscado" : "";

            div.innerHTML = `
                <div class="${classeOpacidade}">
                    <h3 class="${classeRisco}">${t.titulo}</h3>
                    <p class="${classeRisco}">${t.descricao ?? ""}</p>
                    <small>Status: <strong>${t.status ?? ""}</strong></small>
                </div>
                <div class="acoes-tarefa">
                    <button class="btn-concluir" onclick="mudarStatus(${t.id}, '${t.status}')">
                        ${isConcluida ? 'Desmarcar' : '✔ Concluir'}
                    </button>
                    <button class="btn-editar" onclick="editarTarefa(${t.id}, '${t.titulo}', '${t.descricao}')">
                        ✏️ Editar
                    </button>
                    <button class="btn-deletar" onclick="deletarTarefa(${t.id})">
                        🗑️ Deletar
                    </button>
                </div>
            `;
            listaTarefas.appendChild(div);
        });
    } catch (err) {
        console.error("Falha ao carregar tarefas:", err);
        listaTarefas.innerHTML = `<div class="tarefa"><strong>Erro</strong><p>Não foi possível carregar as tarefas.</p></div>`;
    }
}

// 3. CADASTRAR TAREFA (Vinculada ao meu ID)
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
                user_id: usuario.id, // Envia o ID do dono
            }),
        });

        if (!res.ok) {
            let detalhes = "";
            try {
                const body = await res.json();
                detalhes = body?.mensagem || body?.erro || JSON.stringify(body);
            } catch {
                detalhes = await res.text();
            }
            throw new Error(detalhes || `Erro ao criar tarefa (HTTP ${res.status}).`);
        }

        form.reset();
        await carregarTarefas();
    } catch (err) {
        console.error("Falha ao criar tarefa:", err);
        alert("Não foi possível criar a tarefa. Verifique os dados e tente novamente.");
    }
});

// 4. FUNÇÕES DE AÇÃO NAS TAREFAS

// Mudar Status (Check)
async function mudarStatus(id, statusAtual) {
    const novoStatus = statusAtual === "pendente" ? "concluida" : "pendente";
    
    try {
        const res = await fetch(`/tarefas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus })
        });
        
        if (res.ok) await carregarTarefas();
    } catch (err) {
        console.error("Erro ao mudar status:", err);
    }
}

// Editar Tarefa
async function editarTarefa(id, tituloAtual, descricaoAtual) {
    const novoTitulo = prompt("Edite o título:", tituloAtual);
    if (novoTitulo === null || novoTitulo.trim() === "") return;

    const novaDescricao = prompt("Edite a descrição:", descricaoAtual);
    if (novaDescricao === null) return;

    try {
        const res = await fetch(`/tarefas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo: novoTitulo, descricao: novaDescricao })
        });

        if (res.ok) await carregarTarefas();
    } catch (err) {
        console.error("Erro ao editar:", err);
    }
}

// Deletar Tarefa
async function deletarTarefa(id) {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
        const res = await fetch(`/tarefas/${id}`, {
            method: "DELETE"
        });

        if (res.ok) await carregarTarefas();
    } catch (err) {
        console.error("Erro ao deletar:", err);
    }
}

// 5. LOGOUT
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// Inicia o carregamento
carregarTarefas();