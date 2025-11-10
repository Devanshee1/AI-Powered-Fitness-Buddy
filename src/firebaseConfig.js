// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuL0bZq7XpNrdoA85vH-XUKdSIWkKzR5g",
  authDomain: "ai-powered-fitness-buddy.firebaseapp.com",
  projectId: "ai-powered-fitness-buddy",
  storageBucket: "ai-powered-fitness-buddy.firebasestorage.app",
  messagingSenderId: "739117272841",
  appId: "1:739117272841:web:254b9a7642f14fe3e34dd8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
