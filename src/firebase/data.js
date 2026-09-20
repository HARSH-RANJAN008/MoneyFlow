import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseEnabled, getFirebase } from './config'
import { useAuth } from '../context/AuthContext'

const serialise = (item) => Object.fromEntries(Object.entries(item).filter(([, value]) => value !== undefined))

export function useUserCollection(collectionName, fallback = []) {
  const { user, demoMode } = useAuth()
  const [items, setItems] = useState(fallback)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (demoMode || !user?.uid || !firebaseEnabled) {
      setItems(fallback)
      return undefined
    }
    setError(null)
    const { db } = getFirebase()
    return onSnapshot(collection(db, 'users', user.uid, collectionName),
      (snapshot) => setItems(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))),
      (nextError) => setError(nextError),
    )
  }, [collectionName, demoMode, fallback, user?.uid])

  const saveItem = async (item) => {
    const id = String(item.id || crypto.randomUUID())
    const next = { ...serialise(item), id }
    if (demoMode || !firebaseEnabled) {
      setItems((current) => current.some((entry) => String(entry.id) === id)
        ? current.map((entry) => String(entry.id) === id ? next : entry)
        : [next, ...current])
      return next
    }
    const { db } = getFirebase()
    await setDoc(doc(db, 'users', user.uid, collectionName, id), { ...next, updatedAt: serverTimestamp() }, { merge: true })
    return next
  }

  const removeItem = async (id) => {
    if (demoMode || !firebaseEnabled) {
      setItems((current) => current.filter((entry) => String(entry.id) !== String(id)))
      return
    }
    const { db } = getFirebase()
    await deleteDoc(doc(db, 'users', user.uid, collectionName, String(id)))
  }

  return { items, saveItem, removeItem, error }
}
