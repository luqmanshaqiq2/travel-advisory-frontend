import { initializeApp } from 'firebase/app';
import { getAuth, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyD9v18T3HpAb68NujBYxF1m6Y-50VjrlME",
    authDomain: "tourist-advisory-d6147.firebaseapp.com",
    projectId: "tourist-advisory-d6147",
    storageBucket: "tourist-advisory-d6147.firebasestorage.app",
    messagingSenderId: "787666620639",
    appId: "1:787666620639:web:525937c899b8601e70d96a",
    measurementId: "G-Q2S811XNR1"
  };


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export { updateProfile, sendPasswordResetEmail };
export default app;