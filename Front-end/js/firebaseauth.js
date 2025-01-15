// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword,} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
import { collection, query, where, onSnapshot } from "firebase/firestore";

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

const signUp=document.getElementById('submitSignUp');
 signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('correo_usuario').value;
    const password=document.getElementById('contrasena').value;
    const nombre_usuario=document.getElementById('nombre_usuario').value;
    const num_documento=document.getElementById('num_documento').value;
    const centro=document.getElementById('centro').value;
    const cargo=document.getElementById('cargo').value;
    const confirm_contra=document.getElementById('confirm_contra').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            nombre_usuario: nombre_usuario,
            num_documento: num_documento,
            nombre_usuario: nombre_usuario,
            centro: centro,
            cargo: cargo,
            confirm_contra: confirm_contra
        };
        Swal.fire({
            title: "!Éxito!",
            text: "Has enviado tu solicitud de registro exitosamente!",
            icon: "success",
            confirmButtonColor: "#00BB00",
        })
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='inicio.html';
        })

        .catch((error)=>{
            Swal.fire({
                title: "!Oops!",
                text: "Hubo un problema al enviar tu solicitud, por favor intentalo de nuevo.",
                icon: "error",
                confirmButtonColor: "#ff0000"
            })
        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            Swal.fire({
                title: "!Oops!",
                text: "El correo con el que estás intentando enviar tu solicitud ya está registrado.",
                icon: "error",
                confirmButtonColor: "#ff0000"
            })
        }
        else{
            Swal.fire({
                title: "!Oops!",
                text: "Por favor llene los campos.",
                icon: "error",
                confirmButtonColor: "#ff0000"
            })
        }
    })
 });

 db.collection("users").get().then((QuerySnapshot) => {
     QuerySnapshot.forEach((doc) =>{
         console.log(`${doc.id} => ${doc.data()}`);
     });
 });