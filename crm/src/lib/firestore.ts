// import firebase from 'firebase';
import "firebase/auth";
const firebase = require('firebase')
const config = {
    apiKey: "AIzaSyBjMkh7V2J6yLesMpVoa8gepNABOU300VU",
    authDomain: "bogdashka-com.firebaseapp.com",
    projectId: "bogdashka-com",
    storageBucket: "bogdashka-com.appspot.com",
    messagingSenderId: "939061573972",
    appId: "1:939061573972:web:d603a58c9a5b5fdf9ff0c1",
    measurementId: "G-BE36R4FBH1"
};
firebase.initializeApp(config);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
// export const firebaseDb = firebase;