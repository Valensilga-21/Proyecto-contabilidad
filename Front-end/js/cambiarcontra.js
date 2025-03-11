async function cambiarContrasena() {
    const actualContrasena = document.getElementById('actualContrasena').value;
    const nuevaContrasena = document.getElementById('nuevaContrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;

    if (!actualContrasena || !nuevaContrasena || !confirmarContrasena) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.',
        });
        return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseña no coincide',
            text: 'La nueva contraseña y su confirmación no coinciden.',
        });
        return;
    }

    const requestData = {
        actualContrasena: actualContrasena,
        nuevaContrasena: nuevaContrasena,
        confirmarContrasena: confirmarContrasena
    };

    const token = localStorage.getItem('userToken');

    if (!token) {
        Swal.fire({
            icon: 'warning',
            title: 'Sesión no iniciada',
            text: 'Debe iniciar sesión para cambiar su contraseña.',
        });
        return; 
    }

    try {
        const response = await fetch(urlCambiarContrasena, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer "+ token
            },
            body: JSON.stringify(requestData)
        });

        const message = await response.text();

        if (!response.ok) {
            throw new Error(message);
        }

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: message,
            timer: 1500
        });
        cerrarSesion();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
        });
    }
}

// Cambia el selector para el botón
document.querySelector('.submit-button').addEventListener('click', (event) => {
    event.preventDefault();
    cambiarContrasena();
});

function cerrarSesion() {
    localStorage.removeItem('userToken');
    window.location.href = "/Front-end/index.html";
}