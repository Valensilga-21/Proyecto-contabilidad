document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#btn-change-password').addEventListener('click', function (event) {
        event.preventDefault();

        const emailInput = document.getElementById('email');

        // Validar que el campo de correo no esté vacío
        if (!emailInput.value) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, introduce tu correo electrónico.'
            });
            return;
        }

        // Realizar la solicitud POST al backend
        fetch(urlNotificacionCambioContra, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: emailInput.value  
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(err => {
                        throw new Error(err.message);
                    });
                }
            })
            .then(data => {
                // Mostrar la alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: data.message || 'Se ha enviado un enlace para cambiar la contraseña'
                }).then(() => {
                    emailInput.value = '';
                });
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message || 'Error al enviar la solicitud.'
                });
            });
    });
});