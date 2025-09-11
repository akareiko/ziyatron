// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAhqtAp5j_i7s_uKgh_LWdlLcS8kqOz4XY",
  authDomain: "ziya-57d19.firebaseapp.com",
  projectId: "ziya-57d19",
  storageBucket: "ziya-57d19.firebasestorage.app",
  messagingSenderId: "1050492568190",
  appId: "1:1050492568190:web:b12a4c8a7aca5ba56d4e2f",
  measurementId: "G-ZVDQ36QTW9"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);