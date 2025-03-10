document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#btn-reset-password').addEventListener('click', function (event) {
        event.preventDefault();

        const nuevaContrasena = document.getElementById('nuevaContrasena').value;
        const confirmarContrasena = document.getElementById('confirmarContrasena').value;

        restablecerContrasena(nuevaContrasena, confirmarContrasena);
    });
});

async function restablecerContrasena(nuevaContrasena, confirmarContrasena) {
    if (nuevaContrasena !== confirmarContrasena) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las contraseñas no coinciden.'
        });
        return;
    }

    const token = localStorage.getItem('userToken');
    console.log('Token:', token); // Verifica el token

    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró un token de sesión.'
        });
        return;
    }

    const body = { nuevaContrasena, confirmarContrasena };
    try {
        const response = await fetch(urlCambioRestablecerContrasena, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify(body)
        });

        const contentType = response.headers.get("content-type");
        let responseData;

        // Verifica el tipo de contenido de la respuesta
        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            responseData = { message: await response.text() };
        }

        console.log('Response Status:', response.status); // Verifica el estado de la respuesta
        console.log('Response Data:', responseData); // Verifica el contenido de la respuesta

        // Si el estado de la respuesta es exitoso
        if (response.ok) {
            console.log('Respuesta Exitosa'); // Depuración para ver si llega aquí
            if (responseData && responseData.message) {
                // Muestra mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: responseData.message // Usa el mensaje de la respuesta
                }).then(() => {
                    redirectAfterPasswordChange(token);
                });

                document.getElementById("modifyForm").reset();
            } else {
                // Si no hay mensaje de éxito en la respuesta
                throw new Error('Respuesta inesperada del servidor: mensaje no encontrado');
            }
        } else {
            // Si la respuesta no es exitosa, lanza un error con el mensaje de error de la API
            throw new Error('Error al cambiar la contraseña: ' + (responseData.message || response.statusText));
        }
    } catch (error) {
        // Muestra el error en un mensaje de alerta
        console.error('Error en catch:', error); // Depuración para ver qué error se captura
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}

function redirectAfterPasswordChange(token) {
    // Redirige a la página de inicio de sesión
    window.location.href = '/Front-end/index.html';
}

