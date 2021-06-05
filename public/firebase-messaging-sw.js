importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDBARQkJXCiELqwdaq6wAEiJ1SJdKyLpDQ",
  authDomain: "badget-7d2e5.firebaseapp.com",
  databaseURL: "https://badget-7d2e5-default-rtdb.firebaseio.com",
  projectId: "badget-7d2e5",
  storageBucket: "badget-7d2e5.appspot.com",
  messagingSenderId: "388376641692",
  appId: "1:388376641692:web:e74eff1e379f24e43eed59"
};
firebase.initializeApp(firebaseConfig);

// firebase.initializeApp({
//   messagingSenderId: "388376641692"
// });

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification("my notification title");
    });
  return promiseChain;
});

self.addEventListener('notificationclick', function(event) {
  // do what you want
  // ...
  debugger
});