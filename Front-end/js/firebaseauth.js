// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

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


const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
   event.preventDefault();
   const email=document.getElementById('correo_usuario').value;
   const password=document.getElementById('contrasena').value;
   const auth=getAuth();

   signInWithEmailAndPassword(auth, email, password)
   .then((userCredential)=>{
       showMessage('login is successful', 'signInMessage');
       const user=userCredential.user;
       localStorage.setItem('loggedInUserId', user.uid);
       window.location.href='inicio.html';
   })
   .catch((error)=>{
       const errorCode=error.code;
       if(errorCode==='auth/invalid-credential'){
           showMessage('Incorrect Email or Password', 'signInMessage');
       }
       else{
           showMessage('Account does not Exist', 'signInMessage');
       }
   })
})

const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');

signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
})