const signInBtnLink = document.querySelector('.signInBtn-link');
const signUpBtnLink = document.querySelector('.signUpBtn-link');
const wrapper = document.querySelector('.wrapper');

signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});

signInBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
});



const loginbtn = document.getElementById("login");
const signbtn = document.getElementById("signup");


loginbtn.addEventListener("click",function(){
  console.log("signup");
})

  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
  import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword, signOut ,updateProfile  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";


  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDzBylnZRHjduKLfGVdbMr6MfQ4gkNYjI8",
    authDomain: "game-3a9dd.firebaseapp.com",
    projectId: "game-3a9dd",
    storageBucket: "game-3a9dd.appspot.com",
    messagingSenderId: "1088032915432",
    appId: "1:1088032915432:web:93d3dae336145458b7ee5d",
    measurementId: "G-DTST5PVV2N"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth();

  document.getElementById("signup").addEventListener("click",function(){
    console.log("signup click");
    var user = document.getElementById("signup_name").value;
    var email = document.getElementById("signup_email").value;
    var pass = document.getElementById("signup_password").value;
    

    createUserWithEmailAndPassword(auth,email,pass).then((userCredential) =>{
      const usr = userCredential.user;
      console.log(usr);
      
    })
    .catch((error) => {
      const ec = error.code;
      const em = error.message;

      console.log(em)
    });
  });

  // updateProfile(auth.currentUser, {
  //   displayName: "Jane Q. User", photoURL: "https://example.com/jane-q-user/profile.jpg"
  // }).then(() => {
  //   // Profile updated!
  //   // ...
  // }).catch((error) => {
  //   // An error occurred
  //   // ...
  // });


  loginbtn.addEventListener("click",function(){
    var email = document.getElementById("login_username").value;
    var pass = document.getElementById("login_password").value;

    console.log(email +" "+pass);
    signInWithEmailAndPassword(auth,email,pass).then((userCredential) =>{
      const user = userCredential.user;
      console.log(user);
      window.location.href = "ghome.html";
    })
    .catch((error) => {
      const ec = error.code;
      const em = error.message;
      alert(em);
      console.log(em)
    });
  
  });




  
