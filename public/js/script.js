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
    // Passamos o ID do usuário na URL como filtro
    const res = await fetch(`/tarefas?user_id=${usuario.id}`);
    const tarefas = await res.json();

    listaTarefas.innerHTML = "";
    tarefas.forEach(t => {
        const div = document.createElement("div");
        div.classList.add("tarefa");
        div.innerHTML = `<h3>${t.titulo}</h3><p>${t.descricao}</p><small>${t.status}</small>`;
        listaTarefas.appendChild(div);
    });
}

// 3. CADASTRAR TAREFA (Vinculada ao meu ID)
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    await fetch("/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            titulo, 
            descricao, 
            user_id: usuario.id // Envia o ID do dono
        })
    });

    form.reset();
    carregarTarefas();
});

// 4. LOGOUT
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

carregarTarefas();