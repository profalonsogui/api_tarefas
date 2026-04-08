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

    // Dentro do seu fetch de login, quando a resposta for OK:
    if (res.ok) {
        //const dados = await res.json();
        
        // 1. Salva o Token (para segurança)
        localStorage.setItem("token", dados.token);
        
        // 2. Salva os dados do usuário (para o "Bem-vindo")
        localStorage.setItem("usuario", JSON.stringify(dados.usuario));
        
        window.location.href = "index.html";
    }else {
        alert(dados.mensagem);
    }
});