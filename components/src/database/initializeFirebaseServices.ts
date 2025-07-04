import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyDCY7g0UnK80JjkHi-Zdiuke4ZWAb_cwGI",
	authDomain: "crescedu-f7402.firebaseapp.com",
	projectId: "crescedu-f7402",
	storageBucket: "crescedu-f7402.firebasestorage.app",
	messagingSenderId: "366546031805",
	appId: "1:366546031805:web:6967a0d520fe5075ee53d4",
	measurementId: "G-LQ55VW0ZB0",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
