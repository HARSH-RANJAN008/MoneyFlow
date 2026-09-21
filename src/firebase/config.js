import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredFields = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
]

export const firebaseEnabled = requiredFields.every(
  (field) => typeof config[field] === 'string' && config[field]
)

let firebase
let initialization

export async function initializeFirebase() {
  if (firebase) return firebase

  if (!firebaseEnabled) {
    return null
  }

  if (initialization) {
    return initialization
  }

  initialization = Promise.resolve().then(() => {
    const app = getApps().length ? getApp() : initializeApp(config)

    firebase = {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      storage: getStorage(app),
    }

    return firebase
  })

  return initialization
}

export function getFirebase() {
  return firebase
}