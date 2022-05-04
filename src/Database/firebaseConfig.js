import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {

    apiKey: "AIzaSyA6ScWfHCm-Bb7Xr_bz4J_iwKv5OJLxaTo",

    authDomain: "instagram-clone-6d1b6.firebaseapp.com",

    projectId: "instagram-clone-6d1b6",

    storageBucket: "instagram-clone-6d1b6.appspot.com",

    messagingSenderId: "951634675172",

    appId: "1:951634675172:web:a649c676a1fd75f107f3f1",

    measurementId: "G-XJ77C3WMQ7"

};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = getFirestore(app)