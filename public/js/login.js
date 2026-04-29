const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    const dados = await res.json();

    if (res.ok) {
        // IMPORTANTE: Salva o Token e o objeto Usuário (com ID)
        localStorage.setItem("token", dados.token);
        localStorage.setItem("usuario", JSON.stringify(dados.usuario));
        
        window.location.href = "index.html";
    } else {
        alert(dados.mensagem);
    }
});