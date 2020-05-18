import firebase from 'firebase/app';
import "firebase/auth";
import 'firebase/database';
import 'firebase/storage';


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAgsvTt9EbvusaibwK6b3nHVffDGpmrCrY",
  authDomain: "react-chat-b187c.firebaseapp.com",
  databaseURL: "https://react-chat-b187c.firebaseio.com",
  projectId: "react-chat-b187c",
  storageBucket: "react-chat-b187c.appspot.com",
  messagingSenderId: "611917890031",
  appId: "1:611917890031:web:2a5852a1a390722fcc761a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;