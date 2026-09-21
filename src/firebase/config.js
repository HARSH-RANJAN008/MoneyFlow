// A static browser application cannot keep Firebase credentials secret: every
// client-side value is included in the built JavaScript. Firebase access is
// intentionally disabled here until it is supplied through a secure backend.
// The app remains fully usable in its local demo mode.
export const firebaseEnabled = false

export function getFirebase() {
  return null
}
