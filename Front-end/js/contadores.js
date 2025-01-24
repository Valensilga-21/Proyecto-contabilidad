// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const db=getFirestore();


db.collection("legalizaciones").where("estado", "==", "completada").get()
    .then((querySnapshot) => {
        console.log("Total completadas: ", querySnapshot.size);
    })

    .catch((error) => {
        console.log("Error al contar pendientes ", error);
    })

db.collection('legalizaciones').where('estado', '==', 'completada').onSnapshot((querySnapshot) => {
    console.log('Total completadas: ', querySnapshot.size);
});
      
db.collection('legalizaciones').where('estado', '==', 'pendiente').onSnapshot((querySnapshot) => {
    console.log('Total pendientes: ', querySnapshot.size);
});