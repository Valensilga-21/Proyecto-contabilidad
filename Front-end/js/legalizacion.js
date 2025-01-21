// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, onSnapshot, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCKTJxwwP2roq8DioEyhrBWMNN34f2JB6Y",
    authDomain: "lcd-contabilidad.firebaseapp.com",
    projectId: "lcd-contabilidad",
    storageBucket: "lcd-contabilidad.firebasestorage.app",
    messagingSenderId: "289220346007",
    appId: "1:289220346007:web:b9034c2734e3602830a9d2",
    measurementId: "G-2LDHTHRHNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

const modal = document.getElementById("myModal");

const registrarLegalizacion = async (legalizacion) => {
    try {
        const docRef = await addDoc(collection(db, "legalizaciones"), legalizacion);
        Swal.fire({
            icon: "success",
            position: "top-end",
            title: "Tu legalizacion ha sido registrado exitosamente.",
            showConfirmButton: false,
            timer: 2000
        })
        listalegalizaciones();
    } catch (error) {
        Swal.fire({
            title: "!Oops!",
            text: "Hubo un problema al enviar al registrar el legalizacion, por favor intentalo de nuevo.",
            icon: "error",
            confirmButtonColor: "#ff0000"
        })
    }
};

document.getElementById("registrar").addEventListener("click", () => {
    const num_comision = document.getElementById("noComision").value;
    const fecha_inicio = document.getElementById("fecha_inicio").value;
    const fecha_fin = document.getElementById("fecha_fin").value;
    const ruta = document.getElementById("ruta").value;
    const estado = document.getElementById("estado").value;

    const legalizacion = {
        num_comision,
        fecha_inicio,
        fecha_fin,
        ruta,
        estado
    };

    registrarLegalizacion(legalizacion);
    
});