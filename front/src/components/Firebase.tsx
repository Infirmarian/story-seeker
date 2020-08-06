import firebase from "firebase";
const firebaseConfig = {
    apiKey: "AIzaSyAZnU6Fl7s3iVTpCm35V6otEJT1DjdOAw0",
    authDomain: "storyseeker.firebaseapp.com",
    databaseURL: "https://storyseeker.firebaseio.com",
    projectId: "storyseeker",
    storageBucket: "storyseeker.appspot.com",
    messagingSenderId: "866668463774",
    appId: "1:866668463774:web:96e001f2ef2ae6cf10dd8f",
    measurementId: "G-2FHMSDNWVP"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const Auth = firebase.auth;
const Firestore = firebase.firestore;
export { Auth, Firestore }
