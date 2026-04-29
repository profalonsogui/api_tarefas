const form = document.getElementById("formTarefa");
const listaTarefas = document.getElementById("listaTarefas");

async function carregarTarefas() {
    const resposta = await fetch("/tarefas");
    const tarefas = await resposta.json();

    listaTarefas.innerHTML = "";

    tarefas.forEach((tarefa) => {
        const div = document.createElement("div");
        div.classList.add("tarefa");

        div.innerHTML = `
            <h3>${tarefa.titulo}</h3>
            <p>${tarefa.descricao}</p>
            <small>Status: ${tarefa.status}</small>
        `;

        listaTarefas.appendChild(div);
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value;
    const descricao = document.getElementById("descricao").value;

    await fetch("/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo, descricao })
    });

    form.reset();
    carregarTarefas();
});

carregarTarefas();