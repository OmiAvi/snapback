import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDFh-0shx4-0SQqAH0UJ5y93teVmqjI5rc",
  authDomain: "snapback-ba478.firebaseapp.com",
  projectId: "snapback-ba478",
  storageBucket: "snapback-ba478.firebasestorage.app",
  messagingSenderId: "691659342999",
  appId: "1:691659342999:web:cc6a3fae6953664cda55d2"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
