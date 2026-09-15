// Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyB6EbPPMXMrl4ffSJjo2JT3H7TmCevFHyI",
    authDomain: "fitness-tracker-45d9d.firebaseapp.com",
    projectId: "fitness-tracker-45d9d",
    storageBucket: "fitness-tracker-45d9d.firebasestorage.app",
    messagingSenderId: "937091721409",
    appId: "1:937091721409:web:5b0864fd55f9e6d159cc40",
    measurementId: "G-PCQR82F53G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Connect to Firestore
const db = firebase.firestore();

console.log("Firebase connected successfully!");