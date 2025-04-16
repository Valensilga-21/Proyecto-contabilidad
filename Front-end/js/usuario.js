// Función para registrar un usuario
async function registrarUsuario() {
    //LLamar las variables donde se van almacenar lso datos
    var documento_usuario = document.getElementById("documento_usuario").value;
    var nombre_usuario = document.getElementById("nombre_usuario").value;
    var username = document.getElementById("username").value;
    var centro = document.getElementById("centro").value;
    var cargo = document.getElementById("cargo").value;
    var password = document.getElementById("password").value;
    var confirm_contrasena = document.getElementById("confirm_contrasena").value;
    var role = document.getElementById("role").value;
    var estado_usuario = document.getElementById("estado_usuario").value;

    //Validación de campos
    if (!nombre_usuario || !username || !password || !confirm_contrasena || !centro || !cargo || !documento_usuario) {
        Swal.fire({
            title: "¡Error!",
            text: "¡Llene todos los campos correctamente!",
            icon: "error"
        });
        return;
    }

    //Verificación contraseña
    if (password !== confirm_contrasena) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Las contraseñas no coinciden",
        });
        return;
    }

    //Obtiene datos
    var formData = {
        documento_usuario: documento_usuario,
        nombre_usuario: nombre_usuario,
        username: username,
        centro: centro,
        cargo: cargo,
        password: password,
        confirm_contrasena: confirm_contrasena,
        role: role,
        estado_usuario: estado_usuario
    };

    //End point de solicitud de registro
    try {
        const response = await fetch(urlRegistro + "register/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            Swal.fire({
                title: "Éxito",
                text: "Has enviado tu solicitud de registro en nuestro aplicativo.",
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "Su solicitud de registro ya ha sido enviada con anterioridad.",
                icon: "error"
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Hubo un error al intentar enviar tu solicitud de registro. Inténtelo de nuevo.",
            icon: "error"
        });
    }
}

//Login usuario
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
        const response = await fetch(urlLogin + "login/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Respuesta del servidor:", result); // Depuración

            if (result.token && result.id_usuario) {  // Validar si `usuario` existe
                localStorage.setItem('userToken', result.token);
                localStorage.setItem('userRole', result.role);
                localStorage.setItem('userId', result.id_usuario); // Ahora sí guardamos el ID correctamente

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Has iniciado sesión correctamente.",
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // Redirigir según el rol
                    if (result.role.toLowerCase() === "administrador") {
                        window.location.href = "/Front-end/html/inicio.html"; // Vista de admin
                    } else if (result.role.toLowerCase() === "usuario"){
                        window.location.href = "/Front-end/html/Usuario/inicioUsuario.html"; // Vista de usuario
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: "Rol no reconocido.",
                            icon: "error"
                        });
                    }
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se recibió un token o usuario válido.",
                    icon: "error"
                });
            }
        } else {
            Swal.fire({
                title: "Error",
                text: "Usuario o contraseña inválidos.",
                icon: "error"
            });
        }
        }catch (error) {
        Swal.fire({
            title: "Error",
            text: "Hubo un error al intentar iniciar sesión. Inténtelo de nuevo.",
            icon: "error"
        });
    }
}

//Perfil del usuario
document.addEventListener("DOMContentLoaded", function () {
    let token = localStorage.getItem("userToken");
    
    // if (!token) {
    //     Swal.fire("Error", "Sesión expirada. Inicie sesión nuevamente.", "error");
    //     window.location.href = "/Front-end/index.html"; // Redirige a login
    //     return;
    // }

    fetch(urlProfile, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,  // Aquí usamos el token corregido
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudo obtener el perfil del usuario");
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("documento_usuario").value = data.documento_usuario;
        document.getElementById("nombre_usuario").value = data.nombre_usuario;
        document.getElementById("username").value = data.username;
        document.getElementById("centro").value = data.centro;
        document.getElementById("cargo").value = data.cargo;
        document.getElementById("estado_usuario").value = data.estado_usuario;
    })
    .catch(error => {
        console.error("Error:", error);
    });
});