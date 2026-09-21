import { useEffect, useRef, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseEnabled, getFirebase } from './config'
import { useAuth } from '../context/AuthContext'

const serialise = (item) => Object.fromEntries(Object.entries(item).filter(([, value]) => value !== undefined))

export function useUserCollection(collectionName, fallback = []) {
  const { user, demoMode } = useAuth()
  const fallbackRef = useRef(fallback)
  const [items, setItems] = useState(fallback)
  const [error, setError] = useState(null)
  const storageKey = user?.uid ? `moneyflow:${user.uid}:${collectionName}` : null

  useEffect(() => {
    if (demoMode || !user?.uid || !firebaseEnabled) {
      if (!storageKey) {
        setItems(fallbackRef.current)
        return undefined
      }
      try {
        const saved = localStorage.getItem(storageKey)
        setItems(saved ? JSON.parse(saved) : fallbackRef.current)
      } catch {
        setItems(fallbackRef.current)
      }
      return undefined
    }

    setError(null)
    const { db } = getFirebase()
    return onSnapshot(collection(db, 'users', user.uid, collectionName),
      (snapshot) => setItems(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))),
      (nextError) => setError(nextError),
    )
  }, [collectionName, demoMode, storageKey, user?.uid])

  const saveItem = async (item) => {
    const id = String(item.id || crypto.randomUUID())
    const next = { ...serialise(item), id }
    if (demoMode || !firebaseEnabled) {
      const nextItems = items.some((entry) => String(entry.id) === id)
        ? items.map((entry) => String(entry.id) === id ? next : entry)
        : [next, ...items]
      setItems(nextItems)
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(nextItems))
      return next
    }
    const { db } = getFirebase()
    await setDoc(doc(db, 'users', user.uid, collectionName, id), { ...next, updatedAt: serverTimestamp() }, { merge: true })
    return next
  }

  const removeItem = async (id) => {
    if (demoMode || !firebaseEnabled) {
      const nextItems = items.filter((entry) => String(entry.id) !== String(id))
      setItems(nextItems)
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(nextItems))
      return
    }
    const { db } = getFirebase()
    await deleteDoc(doc(db, 'users', user.uid, collectionName, String(id)))
  }

  return { items, saveItem, removeItem, error }
}
