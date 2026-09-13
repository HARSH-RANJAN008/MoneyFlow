import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import AccountsPage from './pages/AccountsPage'
import TransactionsPage from './pages/TransactionsPage'
import TransfersPage from './pages/TransfersPage'
import ExpensesPage from './pages/ExpensesPage'
import GoalsPage from './pages/GoalsPage'
import BillsPage from './pages/BillsPage'
import SettingsPage from './pages/SettingsPage'
import AdminPage from './pages/AdminPage'

const protect = (page) => <ProtectedRoute>{page}</ProtectedRoute>

export default function App() {
  return <Routes>
    <Route path="/login" element={<AuthPage />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route path="/forgot-password" element={<AuthPage mode="reset" />} />
    <Route path="/" element={protect(<DashboardPage />)} />
    <Route path="/accounts" element={protect(<AccountsPage />)} />
    <Route path="/transactions" element={protect(<TransactionsPage />)} />
    <Route path="/transfers" element={protect(<TransfersPage />)} />
    <Route path="/expenses" element={protect(<ExpensesPage />)} />
    <Route path="/goals" element={protect(<GoalsPage />)} />
    <Route path="/bills" element={protect(<BillsPage />)} />
    <Route path="/settings" element={protect(<SettingsPage />)} />
    <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
