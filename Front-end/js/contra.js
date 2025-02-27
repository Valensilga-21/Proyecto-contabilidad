document.querySelector('#btn-reset-password').addEventListener('click', function (event) {
    event.preventDefault();

    const nuevaContrasena = document.getElementById('nuevaContrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;

    restablecerContrasena(nuevaContrasena, confirmarContrasena);
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
    
        // Verifica si el tipo de contenido es JSON
        const contentType = response.headers.get("content-type");
        let responseData;
        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            responseData = { message: await response.text() }; // Asigna el texto de respuesta si no es JSON
        }
    
        if (!response.ok) {
            throw new Error('Error al cambiar la contraseña: ' + (responseData.message || response.statusText));
        }
    
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: responseData.message
        });
        await redirectAfterPasswordChange(token);
        document.getElementById("modifyForm").reset();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    }
}