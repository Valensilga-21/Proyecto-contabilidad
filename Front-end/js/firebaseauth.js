// Importar las funciones necesarias
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCKTJxwwP2roq8DioEyhrBWMNN34f2JB6Y",
    authDomain: "lcd-contabilidad.firebaseapp.com",
    projectId: "lcd-contabilidad",
    storageBucket: "lcd-contabilidad.firebasestorage.app",
    messagingSenderId: "289220346007",
    appId: "1:289220346007:web:b9034c2734e3602830a9d2",
    measurementId: "G-2LDHTHRHNY"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('correo_usuario').value;
    const password = document.getElementById('contrasena').value;
    const nombre_usuario = document.getElementById('nombre_usuario').value;
    const num_documento = document.getElementById('num_documento').value;
    const centro = document.getElementById('centro').value;
    const cargo = document.getElementById('cargo').value;
    const confirm_contra = document.getElementById('confirm_contra').value;

    const auth = getAuth();
    const db = getFirestore();

    // Primero, verificamos si el usuario ya tiene acceso para registrarse
    const userRef = doc(db, 'usuarios', email);  // Usamos el email como identificador
    getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.isApproved) {
                // Si está aprobado, proceder con el registro
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        // Guardar más datos del usuario en Firestore
                        setDoc(doc(db, 'usuarios', user.uid), {
                            email: email,
                            nombre_usuario: nombre_usuario,
                            num_documento: num_documento,
                            centro: centro,
                            cargo: cargo,
                            confirm_contra: confirm_contra,
                            isApproved: true  // El usuario ahora está aprobado
                        });
                        Swal.fire({
                            title: "!Éxito!",
                            text: "Has registrado exitosamente!",
                            icon: "success",
                            confirmButtonColor: "#00BB00",
                        }).then(() => {
                            window.location.href = 'inicio.html';
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            title: "!Oops!",
                            text: "Hubo un problema al enviar tu solicitud, por favor intentalo de nuevo.",
                            icon: "error",
                            confirmButtonColor: "#ff0000"
                        });
                    });
            } else {
                // Si el usuario no está aprobado, mostramos un mensaje
                Swal.fire({
                    title: "¡Espera!",
                    text: "Tu solicitud está pendiente de aprobación por el administrador.",
                    icon: "warning",
                    confirmButtonColor: "#ff9800"
                });
            }
        } else {
            // Si no hay datos del usuario en Firestore, pedirle que espere
            Swal.fire({
                title: "¡Espera!",
                text: "Tu solicitud aún no ha sido revisada por el administrador.",
                icon: "warning",
                confirmButtonColor: "#ff9800"
            });
        }
    });
});

// Proceso de inicio de sesión (sin cambios)
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('correo_usuario').value;
    const password = document.getElementById('contrasena').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'inicio.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                Swal.fire({
                    title: "!Oops!",
                    text: "Correo o contraseña incorrectos",
                    icon: "error",
                    confirmButtonColor: "#ff0000"
                });
            } else {
                Swal.fire({
                    title: "!Oops!",
                    text: "Usuario no encontrado",
                    icon: "error",
                    confirmButtonColor: "#ff0000"
                });
            }
        });
});
