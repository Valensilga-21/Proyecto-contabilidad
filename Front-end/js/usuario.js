// // VALIDACIONES

// //VALIDACION CORREO
// function validarCorreo(correo_usuario){
//     var emailRegex  = /^[^\s@]+@[^\s@]+\.(com|es|org|net)$/i;

//     if(emailRegex.test(correo_usuario)){
//         var domainPart = correo_usuario.split("@")[1];
//         if(domainPart && domainPart.split(".").length > 1){
//             return true; 
//         }
//     }
//     return false;
// }

// //ENTRADA DE ARROBAS
// // document.getElementById("correo_usuario").addEventListener("keydown", function(event) {
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
// document.getElementById("correo_usuario").addEventListener("keypress", letraCorreo);
// document.getElementById("contrasena").addEventListener("keypress", clave);
// document.getElementById("confirm_contrasena").addEventListener("keypress", clave);


// //EVENTOS ASIGNADOS A LOS ATRIBUTOS
// const nombreCampo = document.getElementById("nombre_usuario");
// const documentoCampo = document.getElementById("documento_usuario");
// const correoValidar = document.getElementById("correo_usuario");
// const nocopypagepassword = document.getElementById("contrasena");
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
    var correo_usuario = document.getElementById("correo_usuario");
    var centro = document.getElementById("centro");
    var cargo = document.getElementById("cargo");
    var contrasena = document.getElementById("contrasena");
    var confirm_contrasena = document.getElementById("confirm_contrasena");
    var rol = document.getElementById("rol").value = "usuario";

    if (!ValidarnombreCompleto(nombre_usuario) ||
        !ValidarcorreoElectronico(correo_usuario) ||
        !Validarcontra(contrasena) ||
        !ValidarcoContra(confirm_contrasena) || 
        !Validarcentro(centro) || 
        !Validarcargo(cargo) || 
        !Validardocumento(documento_usuario)) {

        Swal.fire({
            title: "¡Error!",
            text: "¡Llene todos los campos correctamente!",
            icon: "error"
        });
        return;
    }

    if(!validarCorreo(correo_usuario.value)) {
        return;
    }

    var resultValidation = Validarcontra(contrasena.value);
    if (resultValidation.estado === "error") {
        return
    }

    if (contrasena.value !== confirm_contrasena.value) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Las contraseñas no coinciden",
        });
        return;
    }

    var formData = {
        "nombre_usuario": nombre_usuario.value,
        "correo_usuario": correo_usuario.value,
        "contrasena": contrasena.value,
        "confirm_contrasena": confirm_contrasena.value
    }

    var metodo = RegistrarUsuario ? "POST" : "PUT";
    var urlLocal = RegistrarUsuario ? urlUsuario : urlUsuario + id_usuario;
    var textoImprimir = RegistrarUsuario ? "Felicidades, has enviado tu solicitud de registro exitosamente" : "Los cambios han sido guardados exitosamente";         

    // Enviar datos al servidor
    if (ValidarCampos()) {
        $.ajax({
            type: metodo,
            url: urlUsuario + "/registro",
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
                        window.location.href = '/Front-end/html/registro.html';
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

function listarUsuarios() {
    $.ajax({
        url: urlUsuario + "/listaUsuarios",
        type: "GET",
        success: function (result) {
            var cuerpoTabla = document.getElementById("userTable");
            cuerpoTabla.innerHTML = "";

            for (var i = 0; i < result.length; i++) {
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                <td>${result[i]["id_usuario"]}</td>
                <td class="text-center align-middle">${result[i]["documento_usuario"]}</td>
                <td class="text-center align-middle">${result[i]["nombre_usuario"]}</td>
                <td class="text-center align-middle">${result[i]["correo_usuario"]}</td>
                <td class="text-center align-middle">${result[i]["centro"]}</td>
                <td class="text-center align-middle">${result[i]["cargo"]}</td>
                <td class="text-center align-middle">${result[i]["Rol"]}</td>
                <td class="text-center align-middle">${result[i]["estado_usuario"]}</td>
                <td class="text-center align-middle">
                    <i class="btn fas fa-edit Editar"  onclick="RegistrarUsuario=false;"   data-id="${result[i]["id_usuario"]}"></i>
                    <i class="btn fas fa-trash-alt Eliminar" data-id="${result[i]["id_usuario"]}"></i>
                </td>
            `;
                cuerpoTabla.appendChild(trRegistro);
            }
        },
        error: function (error) {
            alert("ERROR en la petición" + error);
        }
    });
}