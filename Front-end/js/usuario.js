// // VALIDACIONES

// //VALIDACION CORREO
// function validarCorreo(username){
//     var emailRegex  = /^[^\s@]+@[^\s@]+\.(com|es|org|net)$/i;

//     if(emailRegex.test(username)){
//         var domainPart = username.split("@")[1];
//         if(domainPart && domainPart.split(".").length > 1){
//             return true; 
//         }
//     }
//     return false;
// }

// //ENTRADA DE ARROBAS
// // document.getElementById("username").addEventListener("keydown", function(event) {
// //     if(event.key === "@") {
// //         var inputCorreo = event.target.value;
// //         var arrobaCount = (inputCorreo.match(/@/g) || []).length;

// //         if(arrobaCount >=1){
// //             event.preventDefault();
// //         }
// //     }
// // })

// //VALICACION NOMBRE
// document.getElementById("nombre_usuario").addEventListener("keypress", soloLetras);
// document.getElementById("documento_usuario").addEventListener("keypress", soloNumeros);
// document.getElementById("username").addEventListener("keypress", letraCorreo);
// document.getElementById("password").addEventListener("keypress", clave);
// document.getElementById("confirm_contrasena").addEventListener("keypress", clave);


// //EVENTOS ASIGNADOS A LOS ATRIBUTOS
// const nombreCampo = document.getElementById("nombre_usuario");
// const documentoCampo = document.getElementById("documento_usuario");
// const correoValidar = document.getElementById("username");
// const nocopypagepassword = document.getElementById("password");
// const nocopypageCPassword = document.getElementById("confirm_contrasena");

// const letrasPermitidas = [
//     'A', 'Á', 'B', 'C', 'D', 'E', 'É', 'F', 'G', 'H', 'I', 'Í', 'J', 'K', 'L', 'M',
//     'N', 'Ñ', 'O', 'Ó', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ú', 'Ü', 'V', 'W', 'X', 'Y', 'Z',
//     'a', 'á', 'b', 'c', 'd', 'e', 'é', 'f', 'g', 'h', 'i', 'í', 'j', 'k', 'l', 'm',
//     'n', 'ñ', 'o', 'ó', 'p', 'q', 'r', 's', 't', 'u', 'ú', 'ü', 'v', 'w', 'x', 'y', 'z', ' '
// ]

// const numeroPermitidos = [
//     '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ''
// ]

// const signosPermitidos = [
//     '.', ',', '@', '_', '-', '', '$', '%', '&'
// ];

// function soloLetras(event) {
//     console.log("Llave presionada: " + event.key);
//     console.log("Codigo tecla" + event.keyCode);

//     if(!(letrasPermitidas.includes(event.key))) {
//         event.preventDefault();
//         return;
//     }
// }
// function soloNumeros(event) {
//     console.log("Llave presionada: " + event.key);
//     console.log("Codigo tecla" + event.keyCode);

//     if(!(numeroPermitidos.includes(event.key))) {
//         event.preventDefault();
//         return;
//     }
// }

// function letraCorreo(event) {
//     const caracter = event.key;
//     if(letrasPermitidas.includes(caracter) || 
//     numeroPermitidos.includes(caracter) || 
//     signosPermitidos.includes(caracter)) {

//         return;

//     }else{
//         event.preventDefault();
//     }
// }


//REGISTRO DE USUARIOS
var RegistrarUsuario = true; 

function registrarUsuario() {
    var documento_usuario = document.getElementById("documento_usuario");
    var nombre_usuario = document.getElementById("nombre_usuario");
    var username = document.getElementById("username");
    var centro = document.getElementById("centro");
    var cargo = document.getElementById("cargo");
    var password = document.getElementById("password");
    var confirm_contrasena = document.getElementById("confirm_contrasena");
    var role = document.getElementById("role");

    if (!nombre_usuario.value || !username.value || !password.value ||
        !confirm_contrasena.value || !centro.value || !cargo.value || !documento_usuario.value || !role.value) {

        Swal.fire({
            title: "¡Error!",
            text: "¡Llene todos los campos correctamente!",
            icon: "error"
        });
        return;
    }
    
    // if(!validarCorreo(username.value)) {
    //     return;
    // }

    // var resultValidation = Validarcontra(password.value);
    // if (resultValidation.estado === "error") {
    //     return
    // }

    // if (password.value !== confirm_contrasena.value) {
    //     Swal.fire({
    //         icon: "error",
    //         title: "Oops...",
    //         text: "Las contraseñas no coinciden",
    //     });
    //     return;
    // }

    var formData = {
        "documento_usuario": documento_usuario,
        "nombre_usuario": nombre_usuario.value,
        "username": username.value,
        "centro": centro.value,
        "cargo": cargo.value,
        "password": password.value,
        "confirm_contrasena": confirm_contrasena.value,
        "role": role.value,
        "estado_usuario": estado_usuario.value
    }

    var metodo = RegistrarUsuario ? "POST" : "PUT";
    var urlLocal = RegistrarUsuario ? urlUsuario : urlUsuario + id_usuario;
    var textoImprimir = RegistrarUsuario ? "Felicidades, has enviado tu solicitud de registro exitosamente" : "Los cambios han sido guardados exitosamente";         

    // Enviar datos al servidor
    if (validarCampos()) {
        $.ajax({
            type: metodo,
            url: urlRegistro + "register/",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.token) {
                    localStorage.setItem('token', response.token);

                    Swal.fire({
                        title: "Éxito",
                        text: textoimprimir,
                        icon: "success"
                    }).then(function () {
                        $('#exampleModal').modal('hide');
                        listarUsuarios();
                        window.location.href = '/Front-end/html/inicioUsuario.html';
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No se recibió un token del servidor.",
                        icon: "error"
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    title: "Error",
                    text: "No lograste registrar los datos",
                    icon: "error"
                });
            }
        });
    } else {
        Swal.fire({
            title: "Error",
            text: "¡Llene todos los campos correctamente!",
            icon: "error"
        });
    }
}

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

        console.log(response); // Verifica la respuesta

        if (response.ok) {
            const result = await response.json();
            console.log(result); // Verifica si el campo "role" está presente
            if (result.token) {
                localStorage.setItem('userToken', result.token);
                // Verificar el rol del usuario
                var role = result.role; // Asumiendo que el rol se envía en la respuesta
                console.log(role); // Asegúrate de que el rol se esté leyendo correctamente
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Has iniciado sesión correctamente.",
                    showConfirmButton: false,
                    timer: 1500
                  }).then(() => {
                    // Redirigir según el rol
                    if (role === "administrador") {
                        window.location.href = "/Front-end/html/inicio.html"; // Redirigir a la vista de administrador
                    } else {
                        window.location.href = "/Front-end/html/Usuario/inicioUsuario.html"; // Redirigir a la vista de usuario
                    }
                  });
            } else {
                alert("No se recibió un token válido.");
            }
        } else {
            const errorMessage = await response.text();
            Swal.fire({
                title: "Error",
                text: "Hubo un error al intentar iniciar sesión, usuario o contraseña inválidos.",
                icon: "error"
            }) + errorMessage;
        }
    } catch (error) {
        Swal.fire({
            title: "Error: " + error,
            text: "Hubo un error al intentar iniciar sesión. Inténtelo de nuevo.",
            icon: "error"
        })
    }
}


function validarCampos() {
    var nombre_usuario = document.getElementById("nombre_usuario");
    return validarNombre_usuario(nombre_usuario);
}

function validarNombre_usuario(CuadroNumero) {
    var Valor = CuadroNumero.value;
    var Valido = true;

    if (Valor.length <= 3 || Valor.length > 60) {
        Valido = false;
    }
    if (Valido) {
        CuadroNumero.className = " input form-control is-valid";
    } else {
        CuadroNumero.className = "input form-control is-invalid";
    }
    return Valido;
}

// function listarUsuarios() {
//     $.ajax({
//         url: urlUsuario + "/listaUsuarios",
//         type: "GET",
//         success: function (result) {
//             var cuerpoTabla = document.getElementById("userTable");
//             cuerpoTabla.innerHTML = "";

//             for (var i = 0; i < result.length; i++) {
//                 var trRegistro = document.createElement("tr");
//                 trRegistro.innerHTML = `
//                 <td>${result[i]["id_usuario"]}</td>
//                 <td class="text-center align-middle">${result[i]["documento_usuario"]}</td>
//                 <td class="text-center align-middle">${result[i]["nombre_usuario"]}</td>
//                 <td class="text-center align-middle">${result[i]["username"]}</td>
//                 <td class="text-center align-middle">${result[i]["centro"]}</td>
//                 <td class="text-center align-middle">${result[i]["cargo"]}</td>
//                 <td class="text-center align-middle">${result[i]["role"]}</td>
//                 <td class="text-center align-middle">${result[i]["estado_usuario"]}</td>
//                 <td class="text-center align-middle">
//                     <i class="btn fas fa-edit Editar"  onclick="RegistrarUsuario=false;"   data-id="${result[i]["id_usuario"]}"></i>
//                     <i class="btn fas fa-trash-alt Eliminar" data-id="${result[i]["id_usuario"]}"></i>
//                 </td>
//             `;
//                 cuerpoTabla.appendChild(trRegistro);
//             }
//         },
//         error: function (error) {
//             alert("ERROR en la petición" + error);
//         }
//     });
// }