import { useState } from 'react'
import { BellRing, Camera, ChevronRight, KeyRound, LogOut, Mail, MapPin, Moon, Phone, ShieldCheck, Sun, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { AppShell } from '../components/layout/AppShell'
import { Button, Card, Field, Input, Toggle, Toast } from '../components/ui/Primitives'

const settings = [
  { icon: BellRing, title: 'Transaction updates', text: 'Get notified when money moves', enabled: true },
  { icon: Mail, title: 'Monthly insight', text: 'A thoughtful review of your finances', enabled: true },
  { icon: ShieldCheck, title: 'Security alerts', text: 'Important account and sign-in activity', enabled: true },
]

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [toggles, setToggles] = useState(settings.map((item) => item.enabled))
  const [toast, setToast] = useState(null)
  const [profile, setProfile] = useState({ name: user?.displayName || 'Arjun Mehta', email: user?.email || 'arjun@moneyflow.demo', phone: '+91 98765 43210', address: 'Bengaluru, Karnataka' })
  const initial = profile.name.charAt(0).toUpperCase()
  const save = (event) => { event.preventDefault(); setToast({ message: 'Your profile details have been saved.', type: 'success' }) }
  const update = (key) => (event) => setProfile({ ...profile, [key]: event.target.value })
  const changeToggle = (index, enabled) => setToggles(toggles.map((value, entryIndex) => entryIndex === index ? enabled : value))

  return <AppShell title="Profile & settings" subtitle="Your MoneyFlow experience, your way">
    <div className="settings-layout">
      <aside className="settings-nav">
        <a className="active" href="#profile"><UserRound size={17} /> Profile</a>
        <a href="#notifications"><BellRing size={17} /> Notifications</a>
        <a href="#security"><KeyRound size={17} /> Security</a>
        <a href="#appearance"><Moon size={17} /> Appearance</a>
      </aside>
      <div className="settings-content">
        <Card id="profile" className="settings-card">
          <div className="settings-card-head"><div><span className="eyebrow">YOUR PROFILE</span><h2>Personal details</h2><p>This is how you’ll appear in MoneyFlow.</p></div></div>
          <div className="profile-header"><div className="profile-avatar">{initial}<button aria-label="Change profile photo"><Camera size={14} /></button></div><div><strong>{profile.name}</strong><p>{profile.email}</p></div><Button variant="secondary" size="sm">Change photo</Button></div>
          <form className="stack-form profile-form" onSubmit={save}>
            <div className="form-two"><Field label="Full name"><div className="input-icon"><UserRound size={16} /><Input value={profile.name} onChange={update('name')} /></div></Field><Field label="Email address"><div className="input-icon"><Mail size={16} /><Input type="email" value={profile.email} onChange={update('email')} /></div></Field></div>
            <div className="form-two"><Field label="Phone number"><div className="input-icon"><Phone size={16} /><Input value={profile.phone} onChange={update('phone')} /></div></Field><Field label="Location"><div className="input-icon"><MapPin size={16} /><Input value={profile.address} onChange={update('address')} /></div></Field></div>
            <div className="settings-save"><Button type="submit">Save changes</Button></div>
          </form>
        </Card>
        <Card id="notifications" className="settings-card">
          <div className="settings-card-head"><div><span className="eyebrow">NOTIFICATIONS</span><h2>Keep me in the loop</h2><p>Choose what you’d like to hear about.</p></div></div>
          <div className="preference-list">{settings.map((item, index) => { const Icon = item.icon; return <div key={item.title}><span className="preference-icon"><Icon size={18} /></span><div><strong>{item.title}</strong><p>{item.text}</p></div><Toggle label={item.title} checked={toggles[index]} onChange={(enabled) => changeToggle(index, enabled)} /></div> })}</div>
        </Card>
        <Card id="security" className="settings-card">
          <div className="settings-card-head"><div><span className="eyebrow">SECURITY</span><h2>Keep your account protected</h2><p>Small actions to keep your finances private.</p></div></div>
          <div className="security-row"><span className="preference-icon"><KeyRound size={18} /></span><div><strong>Password</strong><p>Last changed 3 months ago</p></div><Button variant="secondary" size="sm">Update password <ChevronRight size={14} /></Button></div>
          <div className="security-row"><span className="preference-icon"><ShieldCheck size={18} /></span><div><strong>Two-step verification</strong><p>Add an extra layer to your account</p></div><Button variant="secondary" size="sm">Set up <ChevronRight size={14} /></Button></div>
        </Card>
        <Card id="appearance" className="settings-card appearance-card"><div><span className="eyebrow">APPEARANCE</span><h2>Set the mood</h2><p>Choose how MoneyFlow looks to you.</p></div><div className="theme-choices"><button className="theme-choice active"><Sun size={17} /><span>Light</span><i /></button><button className="theme-choice"><Moon size={17} /><span>Dark</span></button></div></Card>
        <button className="logout-row" onClick={logout}><LogOut size={18} /> Sign out of MoneyFlow <ChevronRight size={17} /></button>
      </div>
    </div>
    <Toast {...(toast || {})} onClose={() => setToast(null)} />
  </AppShell>
}
