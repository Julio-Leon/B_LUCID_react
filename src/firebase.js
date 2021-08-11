import firebase from 'firebase'
import 'firebase/storage'

export const app = firebase.initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: "blucid.firebaseapp.com",
    projectId: "blucid",
    storageBucket: "blucid.appspot.com",
    messagingSenderId: "503113550973",
    appId: "1:503113550973:web:bfd45fa3693b7aa720b514",
    measurementId: "G-HWW71JMS6J"
});
// Initialize Firebase
// export const app = firebase.initializeApp(config);
// firebase.analytics();

// export default firebase