// This file MUST be a plain script (no ES modules, no bundler, no import.meta.env) —
// service workers registered from a static path are fetched and executed by the browser
// directly, outside of Vite's build pipeline. Firebase Web config values are public,
// domain-restricted identifiers (restricted in Firebase Console > Project Settings),
// not secrets — hardcoding them here is the standard/expected pattern for FCM web push.
// Keep this in sync with the VITE_FIREBASE_* values in .env.

importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyAJ4eza_69zsb8hBYjjvzaFZvx9hW2VcbY',
  authDomain: 'zarmani1108.firebaseapp.com',
  projectId: 'zarmani1108',
  storageBucket: 'zarmani1108.firebasestorage.app',
  messagingSenderId: '896528267116',
  appId: '1:896528267116:web:ff7a1fc1c02020e7d32549',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'Zarmani108'
  const options = {
    body: payload.notification?.body ?? '',
    icon: '/vite.svg',
    data: payload.data ?? {},
  }
  self.registration.showNotification(title, options)
})
