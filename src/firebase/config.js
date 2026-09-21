import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export let firebaseEnabled = true
let firebase
let initialization

const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId']

export async function initializeFirebase() {
  if (firebase) return firebase
  if (initialization) return initialization

  initialization = fetch('/api/firebase-config', { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) return null
      const config = await response.json()
      if (!requiredFields.every((field) => typeof config[field] === 'string' && config[field])) return null

      const app = getApps().length ? getApp() : initializeApp(config)
      firebase = { app, auth: getAuth(app), db: getFirestore(app), storage: getStorage(app) }
      firebaseEnabled = true
      return firebase
    })
    .catch(() => null)

  return initialization
}

export function getFirebase() {
  return firebase
}
