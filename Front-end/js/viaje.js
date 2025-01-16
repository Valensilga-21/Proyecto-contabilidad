// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth,  createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const auth=getAuth();
const db=getFirestore();

//Registro de viajes
const registroViaje=document.getElementById("viaje");
registroViaje.addEventListener("click", (event) => {
   event.preventDefault();
   const num_comision=document.getElementById("num_comision").value;
   const fecha_inicio=document.getElementById("fecha_inicio").value;
   const fecha_fin=document.getElementById("fecha_fin").value;
   const ruta=document.getElementById("ruta").value;
   //const estado_viaje=document.getElementById("estado_viaje").value;

   createUserWithEmailAndPassword(auth)
   .then((viajeCredencial) => {
       const viaje = viajeCredencial.viaje;
       const viajeData={
           num_comision: num_comision,
           fecha_inicio: fecha_inicio,
           fecha_fin: fecha_fin,
           ruta: ruta,
           //estado_viaje: estado_viaje,
       };
       Swal.fire({
           title: "!Éxito!",
           text: "La orden de viaje a sido registrada.",
           icon: "success",
           confirmButtonColor: "#00BB00",
       })
       const docRef=doc(db, "viajes", viaje.uid)
       setDoc(docRef, viajeData)
   })

   .catch((error) => {
       const errorCode= error.code;
       if (errorCode) {
           Swal.fire({
               title: "!Oops!",
               text: "La orden de viaje ya existe",
               icon: "error",
               confirmButtonColor: "#ff0000"
           })
       }
       else{
           Swal.fire({
               title: "!Oops!",
               text: "Hubo un problema al registrar tu viaje, intentalo de nuevo",
               icon: "error",
               confirmButtonColor: "#ff0000"
           })
           .then(()=> {
               document.getElementById("num_comision").value = "";
               document.getElementById("fecha_inicio").value = "";
               document.getElementById("fecha_fin").value = "";
               document.getElementById("ruta").value = "";
               //document.getElementById("estado_viaje").value = "";
           })
       }
   })
})