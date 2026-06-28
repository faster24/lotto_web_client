import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getMessaging, getToken, isSupported, onMessage, type Messaging, type MessagePayload } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined

let app: FirebaseApp | null = null
let messagingPromise: Promise<Messaging | null> | null = null

function getFirebaseApp(): FirebaseApp | null {
  if (firebaseConfig.apiKey == null || firebaseConfig.apiKey === '' || firebaseConfig.projectId == null || firebaseConfig.projectId === '') {
    return null
  }

  app ??= initializeApp(firebaseConfig)
  return app
}

async function resolveMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') {
    return null
  }

  const supported = await isSupported().catch(() => false)
  if (!supported) {
    return null
  }

  const firebaseApp = getFirebaseApp()
  if (firebaseApp == null) {
    return null
  }

  return getMessaging(firebaseApp)
}

function getMessagingInstance(): Promise<Messaging | null> {
  messagingPromise ??= resolveMessaging()
  return messagingPromise
}

export async function requestPushPermissionAndToken(): Promise<string | null> {
  try {
    const messaging = await getMessagingInstance()
    if (messaging == null || VAPID_KEY == null || VAPID_KEY === '') {
      return null
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return null
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration })
    return token ?? null
  } catch (error) {
    console.warn('[fcm] permission/token request failed', error)
    return null
  }
}

export async function listenForForegroundMessages(onMessageReceived: (payload: MessagePayload) => void): Promise<() => void> {
  const messaging = await getMessagingInstance()
  if (messaging == null) {
    return () => {}
  }

  return onMessage(messaging, onMessageReceived)
}
