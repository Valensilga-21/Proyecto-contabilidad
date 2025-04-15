//REGISTRO DE USUARIOS
var RegistrarUsuario = true; 

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

    //VALIDACIONES DE LOS CAMPOS
    if (!nombre_usuario || !username || !password || !confirm_contrasena || !centro || !cargo || !documento_usuario) {
        Swal.fire({
            title: "¡Error!",
            text: "¡Llene todos los campos correctamente!",
            icon: "error"
        });
        return;
    }

    //VERIFICACIÓN CONFIRMAR CONTRASEÑA
    if (password !== confirm_contrasena) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Las contraseñas no coinciden",
        });
        return;
    }

    //OBTIENE LOS DATOS
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

    //ENDPOINT QUE SOLICITA EL REGISTRO
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

// Función para el registro de un usuario por parte del administrador
async function registrarUser() {
    var documento_usuarioA = document.getElementById("documento_usuarioA").value;
    var nombre_usuarioA = document.getElementById("nombre_usuarioA").value;
    var usernameA = document.getElementById("usernameA").value;
    var centroA = document.getElementById("centroA").value;
    var cargoA = document.getElementById("cargoA").value;
    var passwordA = document.getElementById("passwordA").value;
    var confirm_contrasenaA = document.getElementById("confirm_contrasenaA").value;
    var roleA = document.getElementById("roleA").value;
    var estado_usuarioA = document.getElementById("estado_usuarioA").value;

    //VALIDACIONES DE LOS CAMPOS
    if (!nombre_usuarioA || !usernameA || !passwordA || !confirm_contrasenaA || !centroA || !cargoA || !documento_usuarioA) {
        Swal.fire({
            title: "¡Error!",
            text: "¡Llene todos los campos correctamente!",
            icon: "error"
        });
        return;
    }

    //VERIFICACIÓN CONFIRMAR CONTRASEÑA
    if (passwordA !== confirm_contrasenaA) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Las contraseñas no coinciden",
        });
        return;
    }

    //OBTIENE LOS DATOS
    var formData = {
        documento_usuario: documento_usuarioA,
        nombre_usuario: nombre_usuarioA,
        username: usernameA,
        centro: centroA,
        cargo: cargoA,
        password: passwordA,
        confirm_contrasena: confirm_contrasenaA,
        role: roleA,
        estado_usuario: estado_usuarioA
    };

    //ENDPOINT QUE SOLICITA EL REGISTRO
    try {
        const response = await fetch(urlRegistroAdmin + "/registerAdmin", {
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
    listarUsuarios();
}

//LOGIN
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

// Función para listar usuarios
function listarUsuarios() {
    var filtro = document.getElementById("texto").value;
    var centro = document.getElementById("centroFilter").value;
    var role = document.getElementById("roleFilter").value;
    var estado = document.getElementById("estadoFilter").value;

    var urlUsuario = "";

    if (filtro !== "") {
        urlUsuario = urlFiltroUsuarios + "busqueda/" + filtro;
    } else if (centro !== "") {
        urlUsuario = urlFiltroUsuarios + "busqueda/centro/" + centro;
    } else if (role !== "") {
        urlUsuario = urlFiltroUsuarios + "busqueda/role/" + role;
    } else if (estado !== "") {
        urlUsuario = urlFiltroUsuarios + "busqueda/estado/" + estado;
    } else {
        urlUsuario = urlFiltroUsuarios;
    }

    $.ajax({
        url: urlUsuario,
        type: "GET",
        success: function (result) {
            var cuerpoTabla = document.getElementById("userTable").getElementsByTagName('tbody')[0];
            cuerpoTabla.innerHTML = ""; // Limpiar la tabla

            for (var i = 0; i < result.length; i++) {
                var estado = result[i]["estado_usuario"].toLowerCase();
                
                // Definir color del texto según el estado
                var colorEstado = "";
                if (estado === "deshabilitado") {
                    colorEstado = "red";
                }

                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${result[i]["id_usuario"]}</td>
                    <td>${result[i]["documento_usuario"]}</td>
                    <td>${result[i]["nombre_usuario"]}</td>
                    <td>${result[i]["username"]}</td>
                    <td>${result[i]["centro"]}</td>
                    <td>${result[i]["cargo"]}</td>
                    <td>${result[i]["role"]}</td>
                    <td style="color: ${colorEstado};">${result[i]["estado_usuario"]}</td>
                    <td class="text-center align-middle">
                        <i class="btn fas fa-edit Editar text-warning" onclick="openEditModal('${result[i]["id_usuario"]}')"></i>
                        <i class="btn fas fa-regular fa-user-slash Deshabilitar text-danger" onclick="deshabilitarUsuario('${result[i]["id_usuario"]}')"></i>
                    </td>
                `;
                cuerpoTabla.appendChild(trRegistro);
            }
        },
        error: function (errorLista) {
            Swal.fire({
                title: "Error",
                text: "Hubo un error al cargar los datos." + errorLista,
                icon: "error"
            });
        }
    });
}

$(document).ready(function () {
    document.getElementById("centroFilter").addEventListener("change", listarUsuarios);
    document.getElementById("roleFilter").addEventListener("change", listarUsuarios);
    document.getElementById("estadoFilter").addEventListener("change", listarUsuarios);
    document.getElementById("texto").addEventListener("input", listarUsuarios);

    listarUsuarios(); // para cargar usuarios al iniciar
});

function openEditModal(id) {
    $.ajax({
        url: urlIdUsuario + id, // Cambia la URL por la ruta correcta para obtener el usuario
        type: 'GET',
        success: function (data) {
            // Llenar los campos del formulario con los datos del usuario
            document.getElementById('userId').value = data.id_usuario;
            document.getElementById('nombreUsuario').value = data.nombre_usuario;
            document.getElementById('userDocument').value = data.documento_usuario;
            document.getElementById('username').value = data.username;
            document.getElementById('centroU').value = data.centro;
            document.getElementById('cargoU').value = data.cargo;
            document.getElementById("roleU").value = data.role;
            document.getElementById("estado_usuarioU").value = data.estado_usuario;

            // Abrir el modal
            $('#editUser').modal('show');
        },
        error: function (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    });
}

// Función para guardar los cambios cuando se edita un usuario
function guardarCambios() {
    var id = document.getElementById('userId').value;
    var nombreUsuario = document.getElementById('nombreUsuario').value;
    var userDocument = document.getElementById('userDocument').value;
    var username = document.getElementById('username').value;
    var centroU = document.getElementById('centroU').value;
    var cargoU = document.getElementById('cargoU').value;
    var roleU = document.getElementById("roleU").value;
    var estado_usuarioU = document.getElementById("estado_usuarioU").value; // 🔹 Obtener el valor correctamente

    var data = {
        nombre_usuario: nombreUsuario,
        documento_usuario: userDocument,
        username: username,
        centro: centroU,
        cargo: cargoU,
        role: roleU,
        estado_usuario: estado_usuarioU // 🔹 Ya tiene el valor correcto
    };

    $.ajax({
        url: urlEditar + id, // Asegúrate de que 'urlEditar' esté definido y sea correcto
        type: 'PUT',
        contentType: 'application/json', // 🔹 Indica que se envía JSON
        data: JSON.stringify(data), // 🔹 Convertir 'data' a JSON
        success: function (response) {
            Swal.fire({
                title: "Éxito",
                text: "Usuario actualizado con éxito",
                icon: "success",
            });
            $('#editUser').modal('hide');
            listarUsuarios(); // Recargar la lista de usuarios
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar el usuario:', xhr.responseText, status, error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error al actualizar los datos: " + xhr.responseText,
                icon: "error"
            });
        }
    });
}


function deshabilitarUsuario(idUsuario) {
    $.ajax({
        url: urlDeshabilitar + idUsuario,  // Endpoint en el backend
        type: 'DELETE',  // Método HTTP
        success: function(response) {
            Swal.fire({
                title: "Éxito",
                text: response,
                position: "top-end",
                icon: "success",
                timer: 1500, // Mantener la alerta visible por más tiempo
                showConfirmButton: false
            }).then(() => {
                listarUsuarios(); // Recargar después de que el usuario vea la alerta
            });
        },
        error: function(xhr, status, error) {
            console.error("Error al deshabilitar usuario:", xhr.responseText, status, error);
            Swal.fire("Error", "No se pudo deshabilitar el usuario.", "error");
        }
    });
}


//PROFILE
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

//EDITAR INFO ADMIN
document.addEventListener("DOMContentLoaded", function () {
    let token = localStorage.getItem("userToken");
    let userId = localStorage.getItem("userId"); // Obtener el ID del usuario

    // if (!token || !userId) {
    //     Swal.fire("Error", "Sesión expirada. Inicie sesión nuevamente.", "error");
    //     window.location.href = "/Front-end/index.html"; // Redirige a login
    //     return;
    // }

    // Cargar datos del usuario
    fetch(`http://localhost:8080/api/v1/LCDSena/usuario/${userId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
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
        document.getElementById("estado_usuario").value =data.estado_usuario;
    })
    .catch(error => {
        console.error("Error:", error);
    });
    
    document.addEventListener("DOMContentLoaded", function () {
        const btnGuardar = document.getElementById("btnGuardar");
        if (btnGuardar) {
            btnGuardar.addEventListener("click", function () {
                // tu lógica
            });
        }
    });
    
    // Evento para actualizar la información
    document.getElementById("btnGuardar").addEventListener("click", function () {
        let documento_usuario = document.getElementById("documento_usuario").value;
        let nombre_usuario = document.getElementById("nombre_usuario").value;
        let username = document.getElementById("username").value;
        let centro = document.getElementById("centro").value;
        let cargo = document.getElementById("cargo").value;
        let estado_usuario = document.getElementById("estado_usuario").value;

        let datosActualizados = {
            documento_usuario: documento_usuario,
            nombre_usuario: nombre_usuario,
            username: username,
            centro: centro,
            cargo: cargo,
            estado_usuario: estado_usuario
        };

        fetch(`http://localhost:8080/api/v1/LCDSena/usuario/${userId}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosActualizados)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al actualizar el perfil");
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Datos actualizados.",
                showConfirmButton: false,
                timer: 1500
            })
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire("Error", "No se pudo actualizar el perfil", "error");
        });
    });
});

document.getElementById("btnDescargar").addEventListener("click", function(event) {
    event.preventDefault(); // Evita la recarga de la página
    // Llamada a la función para descargar el PDF
    fetch("http://localhost:8080/api/v1/LCDSena/pdfReporte/export-pdf", {
        method: "GET",
        headers: {
            "Content-Type": "application/pdf",
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al generar el PDF");
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reporte.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error("Error al descargar el PDF:", error);
    });
});


// document.getElementById("btnDescargar").addEventListener("click", function (event) {
//     event.preventDefault(); // Prevenir el comportamiento por defecto del botón (en caso de que esté en un formulario)

//     fetch("http://localhost:8080/api/v1/LCDSena/pdfReporte/export-pdf", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/pdf"
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Error al generar el PDF");
//         }
//         return response.blob();
//     })
//     .then(blob => {
//         // Crear una URL temporal para el archivo PDF
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "reporte.pdf"; // Nombre con el que se descargará el archivo
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//     })
//     .catch(error => {
//         console.error("Error al descargar el PDF:", error);
//     });
// });


