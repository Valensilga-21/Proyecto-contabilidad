//SECCION USUARIO

//Función para el registro de un usuario por parte del administrador
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

    //Validacion de campos
    if (!nombre_usuarioA || !usernameA || !passwordA || !confirm_contrasenaA || !centroA || !cargoA || !documento_usuarioA) {
        Swal.fire({
            title: "¡Error!",
            text: "¡Llene todos los campos correctamente!",
            icon: "error"
        });
        return;
    }

    //Verificación contraseña
    if (passwordA !== confirm_contrasenaA) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Las contraseñas no coinciden",
        });
        return;
    }

    //Obtiene datos
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
                position: "top-end",
                icon: "success",
                title: "Usuario registrado",
                showConfirmButton: false,
                timer: 1500
            })
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

function openEditModal(id) {
    $.ajax({
        url: urlIdUsuario + id,
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

//Perfil del administrador
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

//Editar información del administrador
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

//SECCION VIAJES

function registrarViaje() {
    var token = localStorage.getItem("userToken");
    var userId = localStorage.getItem("userId"); // Recuperar ID del usuario

    if (!userId) {
        Swal.fire({
            title: "¡Error!",
            text: "El usuario no ha iniciado sesión correctamente.",
            icon: "error"
        });
        return;
    }

    var formData = {
        num_comision: document.getElementById("num_comision").value.trim(),
        fecha_inicio: document.getElementById("fecha_inicio").value,
        fecha_fin: document.getElementById("fecha_fin").value,
        ruta: document.getElementById("ruta").value,
        estado_viaje: document.getElementById("estado_viaje").value,
        id_usuario: userId
    };

    // Validar que todos los campos estén llenos
    if (!formData.num_comision || !formData.fecha_inicio || !formData.fecha_fin || !formData.ruta) {
        Swal.fire({
            title: "¡Error!",
            text: "¡Llene todos los campos correctamente!",
            icon: "error"
        });
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/LCDSena/viaje/",
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json",
        headers: { "Authorization": "Bearer " + token },
        success: function(result) {
        console.log("Respuesta del backend:", result); // Verifica la estructura de la respuesta

        if (result.viaje && result.viaje.id_viaje) {
                let viaje = {
                id_viaje: result.viaje.id_viaje, // Acceder correctamente al ID
                    num_comision: formData.num_comision,
                    fecha_inicio: formData.fecha_inicio,
                    fecha_fin: formData.fecha_fin,
                    ruta: formData.ruta,
                    estado_viaje: formData.estado_viaje,
                    id_usuario: formData.id_usuario
                };

                // Almacenar el viaje en localStorage en formato JSON
                localStorage.setItem("viaje", JSON.stringify(viaje));

                console.log("Viaje almacenado en localStorage:", viaje);
            } else {
                console.log("Error: la respuesta del backend no contiene 'id_viaje'.");
            }

            Swal.fire({
                title: "¡Éxito!",
                text: "Viaje registrado correctamente.",
                icon: "success"
            }).then(() => {
                $('#viajeRegister').modal('hide');
                listarViajesAdmin(); // Si querés refrescar la tabla luego de registrar
            });
        },
        error: function(xhr, status, error) {
            console.log("Error en la petición:", xhr.responseText);
            Swal.fire({
                title: "¡Error!",
                text: "No se pudo registrar el viaje. Verifica tu sesión e intenta nuevamente.",
                icon: "error"
            });
        }
    });
}

// Función para listar viajes Admin
function listarViajesAdmin() {

    var filtro = document.getElementById("texto").value;
    var urlViaje = filtro !== "" ? urlListaViajes + "busquedaFiltro/" + filtro : urlListaViajes;

    $.ajax({
        url: urlViaje,
        type: "GET",
        success: function (result) {
            var cuerpoTabla = document.getElementById("viajesTableAdmin").getElementsByTagName('tbody')[0];
            cuerpoTabla.innerHTML = "";

            for (var i = 0; i < result.length; i++) {
                var usuario = result[i]["usuario"] || {};
                
                var num_comision = result[i]["num_comision"] || "No disponible";
                var nombre_usuario = usuario["nombre_usuario"] || "No disponible";
                var cargo = usuario["cargo"] || "No disponible";
                var centro = usuario["centro"] || "No disponible";
                var fecha_inicio = result[i]["fecha_inicio"] || "No disponible";
                var fecha_fin = result[i]["fecha_fin"] || "No disponible";
                var ruta = result[i]["ruta"] || "No disponible";

                // Crear fila de la tabla
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${num_comision}</td>
                    <td>${nombre_usuario}</td>
                    <td>${cargo}</td>
                    <td>${centro}</td>
                    <td>${fecha_inicio}</td>
                    <td>${fecha_fin}</td>
                    <td>${ruta}</td>
                    <td class="text-center align-middle">
                        <i class="btn fa-regular fa-file-lines fa-lg Editar" style="color: #39a800;" onclick="openEditModal('${result[i]["id_viaje"]}')"></i>
                    </td>
                `;
                cuerpoTabla.appendChild(trRegistro);
            }
        },
        error: function (errorLista) {
            Swal.fire({
                title: "Error",
                text: "Hubo un error al cargar los datos. " + errorLista.responseText,
                icon: "error"
            });
        }
    });
}

$(document).ready(function () {
    document.getElementById("texto").addEventListener("input", listarViajesAdmin);

    listarViajesAdmin();
});

function openEditModal(id) {
    $.ajax({
        url: urlIdViaje + id,
        type: 'GET',
        success: function (data) {
            // Llenar los campos del formulario con los datos del usuario
            document.getElementById('viajeId').value = data.id_viaje;
            document.getElementById('num_comisionE').value = data.num_comision;
            document.getElementById('fecha_inicioE').value = data.fecha_inicio;
            document.getElementById('fecha_finE').value = data.fecha_fin;
            document.getElementById('rutaE').value = data.ruta;
            document.getElementById('estado_viajeE').value = data.estado_viaje;

            // Abrir el modal
            $('#editViaje').modal('show');
        },
        error: function (error) {
            console.error('Error al obtener los datos del viaje:', error);
        }
    });
}

function guardarCambios() {
    var id = document.getElementById('viajeId').value;
    var num_comisionE = document.getElementById('num_comisionE').value;
    var fecha_inicioE = document.getElementById('fecha_inicioE').value;
    var fecha_finE = document.getElementById('fecha_finE').value;
    var rutaE = document.getElementById('rutaE').value;
    var estado_viajeE = document.getElementById('estado_viajeE').value;

    // Verificar si el estado ya fue cancelado antes
    var estadoAnterior = document.getElementById('estado_viajeE').getAttribute('data-estado-anterior');

    if (estadoAnterior === "cancelado") {
        Swal.fire({
            title: "Acción no permitida",
            text: "No puedes modificar el estado después de haberlo cambiado a 'Cancelado'.",
            icon: "warning",
        });
        return; // Detener ejecución
    }

    if (estado_viajeE === "cancelado") {
        Swal.fire({
            title: "Confirmación",
            text: "Solo puedes cancelar el viaje una vez. ¿Estás seguro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                // Marcar el estado como cancelado definitivamente
                document.getElementById('estado_viajeE').setAttribute('data-estado-anterior', "cancelado");

                // Continuar con la actualización
                enviarEdicion(id, num_comisionE, fecha_inicioE, fecha_finE, rutaE, estado_viajeE);
            }
        });
    } else {
        // Si el estado no es cancelado, proceder normalmente
        enviarEdicion(id, num_comisionE, fecha_inicioE, fecha_finE, rutaE, estado_viajeE);
    }
}

function enviarEdicion(id, num_comision, fecha_inicio, fecha_fin, ruta, estado_viaje) {
    var data = {
        num_comision: num_comision,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        ruta: ruta,
        estado_viaje: estado_viaje,
    };

    $.ajax({
        url: urlEditarViaje + id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            Swal.fire({
                title: "Éxito",
                text: "Viaje actualizado con éxito",
                icon: "success",
            }).then(() => {
                $('#editViaje').modal('hide'); // Cierra el modal después de éxito
                listarViajesAdmin(); // Actualiza la tabla correctamente
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar el viaje:', xhr.responseText, status, error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error al actualizar los datos: " + xhr.responseText,
                icon: "error"
            });
        }
    });
    listarViajesAdmin();
}

//Validacion número de comisión
function validateNumComision() {
    let num_comision = document.getElementById("num_comision").value;
    let validationDocument = document.getElementById("validation-comision");

    let messageDoc = '';

    if (num_comision.length === 0) {
        messageDoc = 'Este es un campo obligatorio';
        validationDocument.classList.remove('text-success');
        validationDocument.classList.add("text-danger");
    } else if (!/^\d+$/.test(num_comision)) {
        messageDoc = 'El número de comisión debe contener solo números.';
        validationDocument.classList.remove('text-success');
        validationDocument.classList.add("text-danger");
    } else {
        messageDoc = ''; // Puedes dejar un mensaje vacío o indicar que es válido.
        validationDocument.classList.remove('text-danger');
        validationDocument.classList.add('text-success');
    }

    validationDocument.textContent = messageDoc;
}

//VALIDAR FECHA INICIO
function validateFecha() {
    let fecha = document.getElementById("fecha_inicio").value;
    let validationMessage = document.getElementById("validation-fecha_inicio");

    let messageFechaInicio = '';

    // Expresión regular para validar formato YYYY-MM-DD
    let regexFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (fecha.length === 0) {
        message = 'Este es un campo obligatorio';
        validationMessage.classList.remove('text-success');
        validationMessage.classList.add("text-danger");
    } else if (!regexFecha.test(fecha)) {
        message = 'Formato de fecha inválido. Use AAAA-MM-DD';
        validationMessage.classList.remove('text-success');
        validationMessage.classList.add("text-danger");
    } else {
        let dateObject = new Date(fecha);
        let isValidDate = !isNaN(dateObject.getTime());

        if (!isValidDate) {
            message = 'Ingrese una fecha válida.';
            validationMessage.classList.remove('text-success');
            validationMessage.classList.add("text-danger");
        } else {
            message = '';
            validationMessage.classList.remove('text-danger');
            validationMessage.classList.add('text-success');
        }
    }

    validationMessage.textContent = messageFechaInicio;
}

//VALIDAR FECHA FIN
function validateFechaFin() {
    let fecha = document.getElementById("fecha_inicio").value;
    let validationMessage = document.getElementById("validation-fecha_fin");

    let messageFechaFin = '';

    let regexFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (fecha.length === 0) {
        message = 'Este es un campo obligatorio';
        validationMessage.classList.remove('text-success');
        validationMessage.classList.add("text-danger");
    } else if (!regexFecha.test(fecha)) {
        message = 'Formato de fecha inválido. Use AAAA-MM-DD';
        validationMessage.classList.remove('text-success');
        validationMessage.classList.add("text-danger");
    } else {
        let dateObject = new Date(fecha);
        let isValidDate = !isNaN(dateObject.getTime());

        if (!isValidDate) {
            message = 'Ingrese una fecha válida.';
            validationMessage.classList.remove('text-success');
            validationMessage.classList.add("text-danger");
        } else {
            message = '';
            validationMessage.classList.remove('text-danger');
            validationMessage.classList.add('text-success');
        }
    }

    validationMessage.textContent = messageFechaFin;
}

//VALIDACION RUTA
function validateRuta() {
    let ruta = document.getElementById("ruta").value;
    let validationMessage = document.getElementById("validation-ruta");

    let messageRuta = '';

    if (ruta.length === 0) {
        messageRuta = 'Este es un campo obligatorio.';
        validationMessage.classList.remove('text-success');
        validationMessage.classList.add("text-danger");
    } else if (ruta.length > 350) {
        messageRuta = 'La ruta no debe exceder los 350 caracteres.';
        validationMessage.classList.remove('text-success');
        validationMessage.classList.add("text-danger");
    } else {
        messageRuta = '';
        validationMessage.classList.remove('text-danger');
        validationMessage.classList.add('text-success');
    }

    validationMessage.textContent = messageRuta;
}

//SECCION LEGALIZACION
function seleccionarViaje(viaje) {
    let viajesGuardados = localStorage.getItem("viajes");
    let viajes = viajesGuardados ? JSON.parse(viajesGuardados) : [];

    // Agregar el nuevo viaje solo si no está en la lista
    if (!viajes.some(v => v.id_viaje === viaje.id_viaje)) {
        viajes.push(viaje);
        localStorage.setItem("viajes", JSON.stringify(viajes));
    }
}

// Función para cargar los viajes almacenados en el select
function cargarOpcionesDeViaje() {
    let viajesGuardados = localStorage.getItem("viajes");
    let viajes = viajesGuardados ? JSON.parse(viajesGuardados) : [];

    let selectViaje = document.getElementById("id_viaje"); // Asegúrate de que el ID sea el correcto
    selectViaje.innerHTML = "<option value=''>Seleccione una comisión</option>"; 

    viajes.forEach(viaje => {
        let option = document.createElement("option");
        option.value = viaje.id_viaje;
        option.textContent = `Comisión #${viaje.numero_comision} - ID: ${viaje.id_viaje}`;
        selectViaje.appendChild(option);
    });
}


// Función para registrar la legalización
function registrarLegalizacion() {
    var token = localStorage.getItem("userToken");
    var userId = localStorage.getItem("userId");

    if (!token || !userId) {
        Swal.fire("¡Error!", "Debe iniciar sesión.", "error");
        return;
    }

    // Obtener el viaje seleccionado
    var selectViaje = document.getElementById("id_viaje");
    var viajeId = selectViaje.value;

    if (!viajeId) {
        Swal.fire("¡Error!", "Seleccione un viaje antes de registrar.", "error");
        return;
    }

    var fileInput = document.getElementById("file");
    var file = fileInput.files[0];

    if (!file) {
        Swal.fire("¡Error!", "Debe subir un archivo.", "error");
        return;
    }

    var formData = new FormData();
    formData.append("moti_devolucion", document.getElementById("moti_devolucion").value.trim());
    formData.append("fecha_soli", document.getElementById("fecha_soli").value);
    formData.append("estado_lega", document.getElementById("estado_lega").value);
    formData.append("file", file);
    formData.append("id_usuario", userId);
    formData.append("id_viaje", viajeId);

    $.ajax({
        url: "http://localhost:8080/api/v1/LCDSena/legalizacion/?" + new Date().getTime(),
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: { "Authorization": "Bearer " + token },
        success: function(result) {
            Swal.fire({
                title: "¡Éxito!",
                text: "Legalización registrada correctamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                $('#legaRegister').modal('hide');
                listarLegalizaciones();
            });
        }        
    });
}

function cargarFormulario() {
    cargarViaje();
}

function cargarViaje() {
    let urlListaComsiones = "http://localhost:8080/api/v1/LCDSena/viaje/";
    $.ajax({
        url: urlListaComsiones,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("userToken")
        },
        success: function (result) {
            let selectViaje = document.getElementById("id_viaje");
            selectViaje.innerHTML = "<option value=''>Seleccione una comisión</option>"; 
        
            result.forEach(viaje => {
                let option = document.createElement("option");
                option.value = viaje.id_viaje;
                option.textContent = viaje.num_comision;
                selectViaje.appendChild(option);
            });
        
            selectViaje.addEventListener("change", function () {
                if (this.value) {
                    llenarDatosViaje(this.value);
                }
            });
        },
        error: function(xhr) {
            console.log("Error al cargar los viajes:", xhr.responseText);
        }
    });
}

function llenarDatosViaje(idViaje) {
    let urlDetalles = `http://localhost:8080/api/v1/LCDSena/viaje/${idViaje}`;
    
    $.ajax({
        url: urlDetalles,
        type: "GET",
        success: function (data) {
            document.getElementById("fecha_inicio").value = data.fecha_inicio;
            document.getElementById("fecha_fin").value = data.fecha_fin;
            document.getElementById("ruta").value = data.ruta;
        },
        error: function(xhr) {
            console.log("Error al obtener los detalles del viaje:", xhr.responseText);
        }
    });
}

// Función para listar legalizaciones Admin
function listarLegalizacionAdmin() {

    var fecha_soli = document.getElementById("filtroFecha").value;

    var urlListaLega = "";

    if(fecha_soli !== "") {
        urlListaLega = urlFiltroLega + "busqueda/fecha/" + fecha_soli;
    }else{
        urlListaLega = urlFiltroLega;
    }
    
    $.ajax({
        url: urlListaLega,
        type: "GET",
        success: function (result) {
            var cuerpoTabla = document.getElementById("legaTableAdmin").getElementsByTagName('tbody')[0];
            cuerpoTabla.innerHTML = ""; // Limpiar la tabla antes de llenarla

            for (var i = 0; i < result.length; i++) {
                var usuario = result[i]["usuario"] || {}; // Verificar si el usuario existe
                var viajeA = result[i]["viaje"] || {};
                
                // Asignar valores predeterminados si no están disponibles
                var num_comision = viajeA["num_comision"] || "No disponible";
                var nombre_usuario = usuario["nombre_usuario"] || "No disponible";
                var cargo = usuario["cargo"] || "No disponible";
                var centro = usuario["centro"] || "No disponible";
                var fecha_soli = result[i]["fecha_soli"] || "No disponible";
                var estado_lega = result[i]["estado_lega"] || "No disponible";

                // Crear fila de la tabla
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${num_comision}</td>
                    <td>${nombre_usuario}</td>
                    <td>${cargo}</td>
                    <td>${centro}</td>
                    <td>${fecha_soli}</td>
                    <td>${estado_lega}</td>
                    <td class="text-center align-middle">
                        <i class="btn fa-regular fa-file-lines fa-lg Editar" style="color: #39a800;" onclick="openEditModal('${result[i]["id_legalizacion"]}')"></i>
                    </td>
                `;
                cuerpoTabla.appendChild(trRegistro);
            }
        },
        error: function (errorLista) {
            Swal.fire({
                title: "Error",
                text: "Hubo un error al cargar los datos. " + errorLista.responseText,
                icon: "error"
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("filtroFecha").addEventListener("change", listarLegalizacionAdmin);
});

//Método para aprobar la legalizacion
function cambiaEstadoAprobada(nuevoEstado) {
    var idLegalizacion = document.getElementById('legaId').value;

    $.ajax({
        url: urlIdLega + idLegalizacion + "/estado",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ estado: nuevoEstado }),
        success: function (response) {
            $('#editLegalizacion').modal('hide');
            listarLegalizacionAdmin();
            Swal.fire({
                title: "Éxito",
                text: "La legalización ha sido " + nuevoEstado.toLowerCase() + ".",
                icon: "success"
            });
        },
        error: function (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo cambiar el estado: " + error.responseText,
                icon: "error"
            });
        }
    });
}

function cambiaEstadoRechazada() {
    var idLegalizacion = document.getElementById('legaId').value;
    var motivo = document.getElementById('moti_devolucionE').value;

    if (!motivo || motivo.trim() === "") {
        Swal.fire({
            title: "Campo requerido",
            text: "Por favor ingresa el motivo de la devolución.",
            icon: "warning"
        });
        return;
    }

    $.ajax({
        url: urlIdLega + idLegalizacion + "/estado/rechazar",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ moti_devolucion: motivo }), // <-- corregido aquí
        success: function (response) {
            Swal.fire({
                title: "Éxito",
                text: "La legalización ha sido rechazada.",
                icon: "success"
            }).then(() => {
                $('#editLegalizacion').modal('hide');
                listarLegalizacionAdmin();
            })
        },
        error: function (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo cambiar el estado: " + error.responseText,
                icon: "error"
            });
        }
    });
}

function openEditModal(id) {
    $.ajax({
        url: urlIdLega + id,
        type: 'GET',
        success: function (data) {
            if (!data) {
                console.error("No se recibieron datos válidos.");
                return;
            }

            var usuario = data.usuario || {}; 
            var viaje = data.viaje || {}; 

            // Llenar los campos del formulario
            document.getElementById('legaId').value = data.id_legalizacion || "";
            document.getElementById('num_comisionE').value = viaje.num_comision || "";
            document.getElementById('nombre_usuarioE').value = usuario.nombre_usuario || "No disponible";
            document.getElementById('fecha_inicioE').value = viaje.fecha_inicio || "";
            document.getElementById('fecha_finE').value = viaje.fecha_fin || "";
            document.getElementById('rutaE').value = viaje.ruta || "";
            document.getElementById('moti_devolucionE').value = data.moti_devolucion || "";

            // Establecer el ID de la legalización en el botón de descarga
            document.getElementById('downloadButton').setAttribute('data-id', data.id_legalizacion);

            // Abrir el modal
            $('#editLegalizacion').modal('show');
        },
        error: function (error) {
            console.error('Error al obtener los datos de la legalización:', error);
        }
    });
}

// Función para obtener el ID de la legalización seleccionada
function getSelectedLegalizacionId() {
    return document.getElementById('downloadButton').getAttribute('data-id');
}

// Evento de descarga
document.getElementById("downloadButton").addEventListener("click", function() {
    const selectedId = getSelectedLegalizacionId(); // Obtener el ID de la legalización seleccionada
    if (selectedId) {
        window.location.href = `http://localhost:8080/api/v1/LCDSena/legalizacion/download/${selectedId}`; // Asegúrate de que la URL sea correcta
    } else {
        console.error("ID de legalización no disponible.");
    }
});

//Input subir archivo
const fileInput = document.getElementById("file");
const removeButton = document.getElementById("removeFile");
const fileNameDisplay = document.getElementById("fileName");

fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        fileNameDisplay.textContent = `Archivo seleccionado: ${this.files[0].name}`;
        removeButton.classList.remove("d-none"); // Mostrar botón "Quitar"
    } else {
        fileNameDisplay.textContent = "";
        removeButton.classList.add("d-none"); // Ocultar botón "Quitar"
    }
});

function removeSelectedFile() {
    fileInput.value = ""; // Limpiar el input file
    fileNameDisplay.textContent = "";
    removeButton.classList.add("d-none"); // Ocultar botón "Quitar"
}

document.addEventListener("DOMContentLoaded", function() {
    listarLegalizacionAdmin();
    cargarFormulario();
});