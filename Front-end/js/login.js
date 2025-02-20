async function loginUsuario() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (!username || !password) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Por favor, complete todos los campos."
        });
        return;
    }

    try {
        const response = await fetch(urlLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        console.log(response); // Verifica la respuesta

        if (response.ok) {
            const result = await response.json();
            console.log(result); // Verifica el resultado
            if (result.token) {
                localStorage.setItem('userToken', result.token);
                await obtenerNombreUsuario();
                window.location.href = "/Front-end/html/inicio.html";
            } else {
                alert("No se recibió un token válido.");
            }
        } else if (response.status === 401) {
            const result = await response.json();
            alert(result.mensaje);
        } else {
            alert("Error al intentar iniciar sesión. Por favor, inténtelo de nuevo.");
        }
    } catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
        alert("Hubo un error al intentar iniciar sesión. Inténtelo de nuevo.");
    }
}

document.getElementById('loginBtn').addEventListener('click', function () {
    loginUsuario();
});