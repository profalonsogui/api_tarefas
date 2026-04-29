const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o refresh da página

    // Captura os dados dos inputs
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        // Envia para a rota de registro no backend
        const resposta = await fetch("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            // Se deu certo (Status 201)
            alert("✅ " + dados.mensagem);
            window.location.href = "login.html"; // Redireciona para o login
        } else {
            // Se deu erro (Status 400 ou 500)
            alert("❌ " + dados.mensagem);
        }

    } catch (erro) {
        console.error("Erro ao cadastrar:", erro);
        alert("⚠️ Erro ao conectar com o servidor.");
    }
});