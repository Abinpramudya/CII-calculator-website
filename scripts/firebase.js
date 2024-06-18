// Import the functions you need from the SDKs you need
import{initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9NtpCxUv8-MmXpIPOqBjkytAgvLOlfKo",
    authDomain: "cii-website-calculator.firebaseapp.com",
    projectId: "cii-website-calculator",
    storageBucket: "cii-website-calculator.appspot.com",
    messagingSenderId: "141598285360",
    appId: "1:141598285360:web:5bdd92f46c4d5f8b8c97f5"
};

function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const signUp=document.getElementById('signup-button');
signUp.addEventListener('click',(event)=>{
    event.preventDefault();
    const email = document.getElementById('email').value;
    const company = document.getElementById('company');
    const username = document.getElementById('username');
    const password = document.getElementById('password')

    const auth= getAuth();
    const db= getFirestore();

    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email:email,
            firstName: 'abin',
            lastName:'pramudya'
            // company:company,
            // username:username
        };
        showMessage('account created succsesfully', 'signUpMessage');
        const docRef=doc(db,"users",user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='index.html';
        })
        .catch((error)=>{
            console.error("error writing document",error);
        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('email adress already in use !');
        }
        else{
            showMessage('unable to create user', 'signUpMessage');
        }
    })
});