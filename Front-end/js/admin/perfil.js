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