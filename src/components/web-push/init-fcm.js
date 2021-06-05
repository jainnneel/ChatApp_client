import firebase from 'firebase/app'
import "firebase/messaging";


const firebaseConfig = {
    apiKey: "AIzaSyDBARQkJXCiELqwdaq6wAEiJ1SJdKyLpDQ",
    authDomain: "badget-7d2e5.firebaseapp.com",
    databaseURL: "https://badget-7d2e5-default-rtdb.firebaseio.com",
    projectId: "badget-7d2e5",
    storageBucket: "badget-7d2e5.appspot.com",
    messagingSenderId: "388376641692",
    appId: "1:388376641692:web:e74eff1e379f24e43eed59"
  };

const initializedFirebaseApp = firebase.initializeApp(firebaseConfig);

const messaging = initializedFirebaseApp.messaging();

messaging.usePublicVapidKey(
  "BKokfypvDo10LpwD-cu56XmJbBbQADMj4zTxSgbYA-5Ff2A4FrpXjKDZvLkLIiv-9ZIoeigTQh9QO-OlsTMJ680"
);

export { messaging };