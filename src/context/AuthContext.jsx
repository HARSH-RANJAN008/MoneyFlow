import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { firebaseEnabled, getFirebase } from '../firebase/config'

const AuthContext = createContext(null)
const demoUser = { uid: 'demo-user', displayName: 'Arjun Mehta', email: 'arjun@moneyflow.demo', photoURL: null, role: 'admin' }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!firebaseEnabled) {
      const saved = localStorage.getItem('moneyflow-user')
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
      return undefined
    }
    let unsubscribe
    getFirebase().then(({ auth, authSdk }) => {
      unsubscribe = authSdk.onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setLoading(false) })
    }).catch(() => setLoading(false))
    return () => unsubscribe?.()
  }, [])

  const saveDemoUser = (nextUser) => { localStorage.setItem('moneyflow-user', JSON.stringify(nextUser)); setUser(nextUser) }
  const value = useMemo(() => ({
    user, loading, demoMode: !firebaseEnabled,
    async login(email, password) {
      if (firebaseEnabled) { const { auth, authSdk } = await getFirebase(); return authSdk.signInWithEmailAndPassword(auth, email, password) }
      if (!email || !password) throw new Error('Enter your email and password to continue.')
      saveDemoUser({ ...demoUser, email, displayName: email === demoUser.email ? demoUser.displayName : email.split('@')[0] })
    },
    async signup(name, email, password) {
      if (firebaseEnabled) { const { auth, authSdk } = await getFirebase(); const credential = await authSdk.createUserWithEmailAndPassword(auth, email, password); await authSdk.updateProfile(credential.user, { displayName: name }); return credential }
      saveDemoUser({ ...demoUser, email, displayName: name, role: 'user' })
    },
    async loginWithGoogle() {
      if (firebaseEnabled) { const { auth, authSdk } = await getFirebase(); return authSdk.signInWithPopup(auth, new authSdk.GoogleAuthProvider()) }
      saveDemoUser(demoUser)
    },
    async resetPassword(email) {
      if (firebaseEnabled) { const { auth, authSdk } = await getFirebase(); return authSdk.sendPasswordResetEmail(auth, email) }
      if (!email) throw new Error('Enter an email address.')
    },
    async logout() {
      if (firebaseEnabled) { const { auth, authSdk } = await getFirebase(); return authSdk.signOut(auth) }
      localStorage.removeItem('moneyflow-user'); setUser(null)
    },
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
