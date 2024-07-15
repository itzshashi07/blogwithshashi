import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCb7iyvMqTx7km7wY1KcC_t5CPSu3PagHU",
    authDomain: "blog-with-shashi.firebaseapp.com",
    projectId: "blog-with-shashi",
    storageBucket: "blog-with-shashi.appspot.com",
    messagingSenderId: "420556508319",
    appId: "1:420556508319:web:f67f107492af32154966aa",
    measurementId: "G-9NB7R2GFEM"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
