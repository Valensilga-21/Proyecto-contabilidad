document.getElementById('miFormulario').addEventListener('submit', function(event) {
  event.preventDefault();

  // Limpia los mensajes de error anteriores
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(function(error) {
      error.style.display = 'none';
  });

  let isValid = true;

  // Validación del campo Usuario
  const usuario = document.getElementById('usuario').value;
  if (usuario.trim() === '') {
      document.getElementById('usuarioError').innerText = 'Este es un campo obligatorio.';
      document.getElementById('usuarioError').style.display = 'block';
      isValid = false;
  }

  // Validación del campo Cargo
  const cargo = document.getElementById('cargo').value;
  if (!cargo) {
      document.getElementById('cargoError').innerText = 'Debe seleccionar un cargo.';
      document.getElementById('cargoError').style.display = 'block';
      isValid = false;
  }

  // Validación del campo Documento
  const documento = document.getElementById('documento').value;
  if (documento.trim() === '' || isNaN(documento)) {
      document.getElementById('documentoError').innerText = 'Este es un campo obligatorio.';
      document.getElementById('documentoError').style.display = 'block';
      isValid = false;
  }else if (documento.trim().length < 10) {
    document.getElementById('documentoError').innerText = 'El número de documento debe tener al menos 10 dígitos.';
    document.getElementById('documentoError').style.display = 'block';
    isValid = false;
  }

  //Valida que solo se puedan digitar numeros
  document.getElementById('documento').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  // Validación del campo Contraseña
  // Debe tener una letra mayuscula, una minuscula, un caracter especial, un numero y al menos 8 digitos
  const contraseña = document.getElementById('contrasena').value;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (contraseña.trim() === '') {
    document.getElementById('contraseñaError').innerText = 'Este es un campo obligatorio.';
    document.getElementById('contraseñaError').style.display = 'block';
    isValid = false;
  } else if (!passwordRegex.test(contraseña)) {
      document.getElementById('contraseñaError').innerText = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial.';
      document.getElementById('contraseñaError').style.display = 'block';
      isValid = false;
  } else {
      document.getElementById('contraseñaError').style.display = 'none';
  }

  // Validación del campo Correo
  const correo = document.getElementById('correo').value;
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
      document.getElementById('correoError').innerText = 'Debe ingresar un correo válido.';
      document.getElementById('correoError').style.display = 'block';
      isValid = false;
  }

  const confirmarContrasena = document.getElementById('confirmarContrasena').value;
  if (confirmarContrasena.trim() === '') {
      document.getElementById('confirmContraError').innerText = 'Este campo es obligatorio.';
      document.getElementById('confirmContraError').style.display = 'block';
      isValid = false;
  } else if (confirmarContrasena !== contraseña) {
      document.getElementById('confirmContraError').innerText = 'Las contraseñas no coinciden.';
      document.getElementById('confirmContraError').style.display = 'block';
      isValid = false;
  } else {
      document.getElementById('confirmContraError').style.display = 'none';
  }

  // Validación del campo Centro
  const centro = document.getElementById('centro').value;
  if (!centro) {
      document.getElementById('centroError').innerText = 'Debe seleccionar un cargo.';
      document.getElementById('centroError').style.display = 'block';
      isValid = false;
  }

  if (isValid) {
      alert('Formulario enviado correctamente.');
      // Aquí puedes enviar el formulario con fetch o similar
  }
});
