// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCKTJxwwP2roq8DioEyhrBWMNN34f2JB6Y",
    authDomain: "lcd-contabilidad.firebaseapp.com",
    projectId: "lcd-contabilidad",
    storageBucket: "lcd-contabilidad.firebasestorage.app",
    messagingSenderId: "289220346007",
    appId: "1:289220346007:web:b9034c2734e3602830a9d2",
    measurementId: "G-2LDHTHRHNY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

const obtenerDatos = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const datos = querySnapshot.docs.map(doc => doc.data());
    return datos;
};

import html2pdf from 'html2pdf.js';
import { auth } from "firebase-admin";

const generarPDF = async () => {
    const datos = await obtenerDatos();
    const contenedor = document.getElementById('pdf');

    // Rellena el contenedor con los datos de Firebase
    contenedor.innerHTML = ''; // Limpia el contenedor
    datos.forEach(users => {
        contenedor.innerHTML += `<p>${users.num_documento} - ${users.nombre_usuario}</p> - ${users.correo_usuario}</p> - ${users.centro}</p> - ${users.cargo}</p>`;
    });

    // Configuración de html2pdf
    const opciones = {
        margin:       1,
        filename:     'listado_usuarios.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generar y descargar el PDF
    html2pdf()
        .from(contenedor)
        .set(opciones)
        .save();
};