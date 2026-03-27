import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDDljxT6fZ8BFOF4Z8rOoDcdF79KSbyp9U",
  authDomain: "veenus-3451d.firebaseapp.com",
  projectId: "veenus-3451d",
  storageBucket: "veenus-3451d.firebasestorage.app",
  messagingSenderId: "153200382480",
  appId: "1:153200382480:web:a37cb2b1987b351c307095",
  measurementId: "G-56FE1QKMKM",
};

const app = initializeApp(firebaseConfig);

// Analytics only works in the browser
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

export { app, analytics };
