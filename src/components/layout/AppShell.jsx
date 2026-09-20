import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Bell, CreditCard, FileText, Gauge, Goal, Landmark, LogOut, Menu, Moon, Plus, ReceiptText, Search, Settings, ShieldCheck, Sun, WalletCards, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Badge, Button, IconButton } from '../ui/Primitives'
import { notifications } from '../../data/demoData'

const primaryNav = [
  { to: '/', label: 'Overview', icon: Gauge, end: true },
  { to: '/accounts', label: 'Accounts', icon: WalletCards },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/transfers', label: 'Transfers', icon: CreditCard },
]
const manageNav = [
  { to: '/expenses', label: 'Expenses', icon: FileText },
  { to: '/goals', label: 'Savings goals', icon: Goal },
  { to: '/bills', label: 'Bills & payments', icon: Landmark },
]

function Brand() { return <Link to="/" className="brand"><span className="brand-mark"><span /></span><span>moneyflow</span></Link> }

function NavItems({ close }) {
  return <nav className="side-nav"><p className="nav-label">Workspace</p>{primaryNav.map((item) => <NavItem key={item.to} {...item} close={close} />)}<p className="nav-label nav-label-gap">Planning</p>{manageNav.map((item) => <NavItem key={item.to} {...item} close={close} />)}</nav>
}
function NavItem({ to, label, icon: Icon, end, close }) { return <NavLink to={to} end={end} onClick={close} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span></NavLink> }

function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(notifications)
  const unread = items.filter((item) => !item.read).length
  return <div className="notification-wrap"><IconButton label="Notifications" className="notification-button" onClick={() => setOpen(!open)}><Bell size={19} />{unread > 0 && <i>{unread}</i>}</IconButton>
    <AnimatePresence>{open && <motion.div className="notification-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><div className="notification-head"><div><strong>Notifications</strong><span>{unread} unread</span></div><button onClick={() => setItems(items.map((item) => ({ ...item, read: true })))}>Mark all read</button></div>{items.map((item) => <button className={`notification-item ${!item.read ? 'unread' : ''}`} key={item.id} onClick={() => setItems(items.map((itemEntry) => itemEntry.id === item.id ? { ...itemEntry, read: true } : itemEntry))}><span className="notification-dot" /><span><strong>{item.title}</strong><small>{item.detail}</small><em>{item.time}</em></span></button>)}</motion.div>}</AnimatePresence>
  </div>
}

export function AppShell({ children, title, subtitle, action }) {
  const { user, logout, demoMode } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname])
  const initial = (user?.displayName || user?.email || 'A').charAt(0).toUpperCase()

  const signOut = async () => { await logout(); navigate('/login') }
  const submitSearch = (event) => {
    event.preventDefault()
    const term = search.trim()
    if (!term) return
    const routes = [
      { terms: ['account', 'balance'], path: '/accounts' },
      { terms: ['goal', 'saving', 'plan'], path: '/goals' },
      { terms: ['expense', 'spend'], path: '/expenses' },
      { terms: ['bill', 'payment'], path: '/bills' },
      { terms: ['transfer', 'send'], path: '/transfers' },
      { terms: ['profile', 'setting', 'security'], path: '/settings' },
    ]
    const match = routes.find((route) => route.terms.some((keyword) => term.toLowerCase().includes(keyword)))
    navigate(match?.path || `/transactions?search=${encodeURIComponent(term)}`)
    setSearch('')
  }
  return <div className="app-shell">
    <aside className="sidebar"><Brand /><NavItems /><div className="sidebar-bottom"><Link to="/settings" className="nav-item"><Settings size={18} /><span>Settings</span></Link>{user?.role === 'admin' && <Link to="/admin" className="nav-item"><ShieldCheck size={18} /><span>Admin</span><Badge tone="purple">New</Badge></Link>}<div className="help-card"><div className="help-icon">✦</div><strong>Need a hand?</strong><p>Our support team is always here.</p><button>Get help <span>→</span></button></div></div></aside>
    <AnimatePresence>{menuOpen && <motion.div className="mobile-menu-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)}><motion.aside className="mobile-sidebar" initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} onClick={(event) => event.stopPropagation()}><div className="mobile-side-head"><Brand /><IconButton label="Close menu" onClick={() => setMenuOpen(false)}><X size={20} /></IconButton></div><NavItems close={() => setMenuOpen(false)} /><div className="sidebar-bottom"><NavLink to="/settings" className="nav-item"><Settings size={18} />Settings</NavLink></div></motion.aside></motion.div>}</AnimatePresence>
    <div className="main-area"><header className="topbar"><div className="topbar-title"><IconButton className="mobile-menu-toggle" label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={21} /></IconButton><div><p className="eyebrow">{subtitle}</p><h1>{title}</h1></div></div><div className="topbar-actions"><form className="global-search" onSubmit={submitSearch}><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search MoneyFlow" placeholder="Search anything" /></form><IconButton className="theme-button" label="Switch colour theme" onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</IconButton><NotificationMenu /><Link to="/settings" className="avatar" aria-label="Profile settings">{user?.photoURL ? <img src={user.photoURL} alt="Profile" /> : initial}</Link></div></header>
      {demoMode && <div className="demo-banner"><span>Demo workspace</span> Your data stays in this browser until you connect Firebase.</div>}
      <main className="page-content"><div className="page-action">{action}</div>{children}</main>
    </div>
  </div>
}

export function PageAction({ children, onClick }) { return <Button onClick={onClick}><Plus size={17} />{children}</Button> }
