const required = [
  ['apiKey', 'FIREBASE_API_KEY'],
  ['authDomain', 'FIREBASE_AUTH_DOMAIN'],
  ['projectId', 'FIREBASE_PROJECT_ID'],
  ['storageBucket', 'FIREBASE_STORAGE_BUCKET'],
  ['messagingSenderId', 'FIREBASE_MESSAGING_SENDER_ID'],
  ['appId', 'FIREBASE_APP_ID'],
]

export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const config = Object.fromEntries(required.map(([property, environmentName]) => [property, process.env[environmentName]]))
  const missing = required.filter(([, environmentName]) => !process.env[environmentName]).map(([, environmentName]) => environmentName)

  response.setHeader('Cache-Control', 'no-store, max-age=0')
  if (missing.length) return response.status(503).json({ error: 'Firebase is not configured' })
  return response.status(200).json(config)
}
