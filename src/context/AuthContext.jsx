import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createUserWithEmailAndPassword, EmailAuthProvider, getMultiFactorResolver, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier, multiFactor, onAuthStateChanged, PhoneMultiFactorGenerator, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updatePassword, updateProfile } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseEnabled, getFirebase } from '../firebase/config'

const AuthContext = createContext(null)
const demoUser = { uid: 'demo-user', displayName: 'Arjun Mehta', email: 'arjun@moneyflow.demo', photoURL: null, role: 'admin' }

async function loadProfile(authUser) {
  const { db } = getFirebase()
  const reference = doc(db, 'users', authUser.uid)
  const snapshot = await getDoc(reference)
  const existing = snapshot.exists() ? snapshot.data() : {}
  const profile = {
    displayName: authUser.displayName || existing.displayName || authUser.email?.split('@')[0] || 'MoneyFlow user',
    email: authUser.email || existing.email || '',
    phone: existing.phone || authUser.phoneNumber || '',
    address: existing.address || '',
    photoURL: authUser.photoURL || existing.photoURL || null,
    role: existing.role || 'user',
    twoFactorEnabled: multiFactor(authUser).enrolledFactors.length > 0,
  }
  await setDoc(reference, { ...profile, createdAt: existing.createdAt || serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true })
  return { ...authUser, ...profile }
}

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
    const { auth } = getFirebase()
    return onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) { setUser(null); setLoading(false); return }
      try { setUser(await loadProfile(nextUser)) } catch { setUser(nextUser) }
      setLoading(false)
    })
  }, [])

  const saveDemoUser = (nextUser) => { localStorage.setItem('moneyflow-user', JSON.stringify(nextUser)); setUser(nextUser) }
  const value = useMemo(() => ({
    user, loading, demoMode: !firebaseEnabled,
    async login(email, password) {
      if (firebaseEnabled) {
        const { auth } = getFirebase()
        try { return await signInWithEmailAndPassword(auth, email, password) } catch (error) {
          if (error.code === 'auth/multi-factor-auth-required') return { requiresTwoFactor: true, resolver: getMultiFactorResolver(auth, error) }
          throw error
        }
      }
      if (!email || !password) throw new Error('Enter your email and password to continue.')
      saveDemoUser({ ...demoUser, email, displayName: email === demoUser.email ? demoUser.displayName : email.split('@')[0] })
    },
    async signup(name, email, password) {
      if (firebaseEnabled) {
        const { auth } = getFirebase()
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(credential.user, { displayName: name })
        await loadProfile(credential.user)
        return credential
      }
      saveDemoUser({ ...demoUser, email, displayName: name, role: 'user' })
    },
    async loginWithGoogle() {
      if (firebaseEnabled) { const { auth } = getFirebase(); return signInWithPopup(auth, new GoogleAuthProvider()) }
      saveDemoUser(demoUser)
    },
    async resetPassword(email) {
      if (firebaseEnabled) { const { auth } = getFirebase(); return sendPasswordResetEmail(auth, email) }
      if (!email) throw new Error('Enter an email address.')
    },
    async updateUserProfile(profile) {
      if (!user) throw new Error('Sign in before updating your profile.')
      if (!firebaseEnabled) { saveDemoUser({ ...user, ...profile }); return }
      const { db, auth } = getFirebase()
      if (profile.displayName !== auth.currentUser.displayName) await updateProfile(auth.currentUser, { displayName: profile.displayName })
      await setDoc(doc(db, 'users', user.uid), { ...profile, updatedAt: serverTimestamp() }, { merge: true })
      setUser((current) => ({ ...current, ...profile }))
    },
    async changePassword(currentPassword, newPassword) {
      if (!firebaseEnabled) return
      const { auth } = getFirebase()
      await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(auth.currentUser.email, currentPassword))
      await updatePassword(auth.currentUser, newPassword)
    },
    async beginTwoFactor(phoneNumber, containerId = 'recaptcha-container') {
      if (!firebaseEnabled) return { verificationId: `demo:${phoneNumber}` }
      const { auth } = getFirebase()
      const container = document.getElementById(containerId)
      if (!container) throw new Error('Unable to start verification. Please reopen this dialog.')
      const verifier = new RecaptchaVerifier(auth, container, { size: 'invisible' })
      await verifier.render()
      const session = await multiFactor(auth.currentUser).getSession()
      const verificationId = await new PhoneAuthProvider(auth).verifyPhoneNumber({ phoneNumber, session }, verifier)
      return { verificationId, verifier }
    },
    async finishTwoFactor(verificationId, code) {
      if (!firebaseEnabled) { setUser((current) => ({ ...current, twoFactorEnabled: true })); return }
      const { auth } = getFirebase()
      await multiFactor(auth.currentUser).enroll(PhoneMultiFactorGenerator.assertion(PhoneAuthProvider.credential(verificationId, code)), 'Phone')
      setUser((current) => ({ ...current, twoFactorEnabled: true }))
    },
    async beginSignInTwoFactor(resolver, containerId = 'login-recaptcha-container') {
      const { auth } = getFirebase()
      const container = document.getElementById(containerId)
      if (!container || !resolver?.hints?.length) throw new Error('Unable to start two-step verification. Please sign in again.')
      const verifier = new RecaptchaVerifier(auth, container, { size: 'invisible' })
      await verifier.render()
      const verificationId = await new PhoneAuthProvider(auth).verifyPhoneNumber({ multiFactorHint: resolver.hints[0], session: resolver.session }, verifier)
      return { verificationId, verifier }
    },
    async finishSignInTwoFactor(resolver, verificationId, code) {
      const credential = PhoneAuthProvider.credential(verificationId, code)
      return resolver.resolveSignIn(PhoneMultiFactorGenerator.assertion(credential))
    },
    async logout() {
      if (firebaseEnabled) { const { auth } = getFirebase(); return signOut(auth) }
      localStorage.removeItem('moneyflow-user'); setUser(null)
    },
  }), [loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
