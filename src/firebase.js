// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 👇 Copy this from your Firebase console (Project Settings > Web App)

const firebaseConfig = {
  apiKey: "AIzaSyDZADutPf8abpP63_YQ7wB_9G7MWbXYB-s",
  authDomain: "youth-services-cgpt.firebaseapp.com",
  projectId: "youth-services-cgpt",
  storageBucket: "youth-services-cgpt.firebasestorage.app",
  messagingSenderId: "219085940566",
  appId: "1:219085940566:web:3aa6f139251349f34698f7",
  measurementId: "G-D1RVD72T0L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

