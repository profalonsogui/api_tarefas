const form = document.getElementById("formTarefa");
const listaTarefas = document.getElementById("listaTarefas");

// 1. SEGURANÇA: Se não tem usuário logado, expulsa para o login
const userStorage = localStorage.getItem("usuario");
if (!userStorage) {
    window.location.href = "login.html";
}
const usuario = JSON.parse(userStorage);

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
            div.innerHTML = `<h3>${t.titulo}</h3><p>${t.descricao ?? ""}</p><small>${t.status ?? ""}</small>`;
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

// 4. LOGOUT
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

carregarTarefas();