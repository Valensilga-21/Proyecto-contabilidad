// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
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
const auth = getAuth();
const db = getFirestore();

// Función para cargar el perfil del usuario
async function perfil() {
    const user = auth.currentUser ;

    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data(); // Obtener los datos del documento
                // Mostrar los datos en los elementos HTML
                document.getElementById("num_documento").innerText = userData.num_documento;
                document.getElementById("nombre_usuario").innerText = userData.nombre_usuario;
                document.getElementById("email").innerText = userData.email;
                document.getElementById("centro").innerText = userData.centro;
                document.getElementById("cargo").innerText = userData.cargo;
            } else {
                Swal.fire({
                    title: "!Oops!",
                    text: "Error al cargar los datos del usuario.",
                    icon: "error",
                    confirmButtonColor: "#ff0000"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "!Oops!",
                text: error.message || "Ocurrió un error inesperado.",
                icon: "error",
                confirmButtonColor: "#ff0000"
            });
        }
    } else {
        Swal.fire({
            title: "!Oops!",
            text: "Usuario no autenticado",
            icon: "error",
            confirmButtonColor: "#ff0000"
        });
    }
}

// Cargar el perfil al cargar la página
window.onload = perfil;