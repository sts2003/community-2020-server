import firebase from "firebase";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FS_apiKey,
  authDomain: process.env.FS_authDomain,
  databaseURL: process.env.FS_databaseURL,
  projectId: process.env.FS_projectId,
  storageBucket: process.env.FS_storageBucket,
  messagingSenderId: process.env.FS_messagingSenderId,
  appId: process.env.FS_appId,
  measurementId: process.env.FS_measurementId,
};

firebase.initializeApp(firebaseConfig);

const firestore = new firebase.firestore();

export default firestore;
