const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseEnabled = Boolean(config.apiKey && config.projectId && config.appId)

// Firebase is loaded only when a project is configured, keeping the local demo
// entirely self-contained. The official modular SDK is loaded from Firebase's CDN.
let firebasePromise
export function getFirebase() {
  if (!firebaseEnabled) return Promise.resolve(null)
  if (!firebasePromise) {
    firebasePromise = Promise.all([
      import(/* @vite-ignore */ 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
      import(/* @vite-ignore */ 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
      import(/* @vite-ignore */ 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js'),
      import(/* @vite-ignore */ 'https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js'),
    ]).then(([appSdk, authSdk, firestoreSdk, storageSdk]) => {
      const app = appSdk.getApps()[0] || appSdk.initializeApp(config)
      return { auth: authSdk.getAuth(app), db: firestoreSdk.getFirestore(app), storage: storageSdk.getStorage(app), authSdk, firestoreSdk, storageSdk }
    })
  }
  return firebasePromise
}
