# MoneyFlow

MoneyFlow is a polished, responsive banking-management demo built with React and Vite. It intentionally simulates financial actions; it does not move real money.

## Highlights

- Secure Firebase-ready authentication with protected and admin-only routes
- Demo mode that works immediately without a Firebase project
- Responsive fintech dashboard with cash-flow, spending, and admin analytics
- Account, transaction, expense, goal, bill, and profile management experiences
- React Hook Form + Zod validation for sign-in and transfers
- Dark mode, loading routes, empty-state primitives, dialogs, toasts, and mobile navigation

## Quick start

```bash
npm install
npm run dev
```

Open the local address Vite prints. In demo mode, sign in with any valid email and a password that is at least six characters long. The suggested demo identity is `arjun@moneyflow.demo` / `moneyflow`.

## Firebase setup

1. Create a Firebase project and register a **Web app**.
2. Enable Email/Password and Google in **Authentication → Sign-in method**.
3. Create a Firestore database and a Storage bucket.
4. Copy `.env.example` to the environment file used by your **server/API**, then enter the Firebase values there. Never place them in a Vite environment file.
5. Publish [firestore.rules](./firestore.rules) in Firestore Rules and [storage.rules](./storage.rules) in Storage Rules.
6. Connect this frontend to a server-side API that owns Firebase access before enabling production authentication or cloud data.
7. To give a user admin access, set `users/{uid}.role` with a trusted server-side Admin SDK or Firebase Console. Never let a client assign this role.

The included static frontend deliberately does not read Firebase environment variables and therefore runs in local demo mode. A browser build cannot keep environment values secret; keep service-account credentials and any sensitive provider keys exclusively on the server.

## Firestore model

```text
users/{userId}
  displayName, email, phone, address, photoURL, role, createdAt
  accounts/{accountId}
  transactions/{transactionId}
  expenses/{expenseId}
  savingsGoals/{goalId}
  notifications/{notificationId}
```

The supplied rules restrict every user-owned collection to its owner. Admin data belongs in a separate `admin` area and requires a `role: "admin"` profile created by a trusted process.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite server |
| `npm run build` | Create a production build |
| `npm run lint` | Check the JavaScript source |
| `npm run preview` | Serve the production build locally |

## Deployment to Vercel

1. Push this repository to GitHub.
2. Import the repository into Vercel. Its Vite preset will detect the correct build command (`npm run build`) and output directory (`dist`).
3. Deploy the backend/API separately and add Firebase values only to that service’s environment configuration.
4. Deploy. Add the deployed domain to Firebase Authentication’s authorized domains when the backend integration is enabled.

## Resume description

> Built MoneyFlow, a responsive React fintech dashboard using Vite, Firebase Authentication/Firestore/Storage, React Router, React Hook Form + Zod, Recharts, Framer Motion, and reusable component architecture. Implemented protected and role-based routes, CRUD-oriented financial workflows, responsive navigation, analytics, validation, and Firebase security rules.
