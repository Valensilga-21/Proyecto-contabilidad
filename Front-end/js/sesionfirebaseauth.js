// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const db = getFirestore();
const auth = getAuth();

// Evento asincrónico para el inicio de sesión
const signInButton = document.getElementById('submitSignIn');
signInButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = document.getElementById('correo_usuario').value;
    const password = document.getElementById('contrasena').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Obtener el rol del usuario desde Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Redirigir según el rol
            if (userData.rol === 'admin') {
                window.location.href = 'inicio.html'; // Redirige a la página del administrador
            } else if (userData.rol === 'usuario') {
                window.location.href = 'Usuario/inicioUsuario.html'; // Redirige a la página del usuario
            }
        } else {
            console.error("No se encontró el documento del usuario.");
        }

        Swal.fire({
            icon: "success",
            position: "top-end",
            title: "Has iniciado sesión correctamente.",
            showConfirmButton: false,
            timer: 2000
        });

    } catch (error) {
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
    }
});