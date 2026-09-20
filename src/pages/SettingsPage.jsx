import { useEffect, useState } from 'react'
import { BellRing, Camera, ChevronRight, KeyRound, LogOut, Mail, MapPin, Moon, Phone, ShieldCheck, Sun, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { AppShell } from '../components/layout/AppShell'
import { Button, Card, Field, Input, Modal, Toggle, Toast } from '../components/ui/Primitives'

const settings = [
  { icon: BellRing, title: 'Transaction updates', text: 'Get notified when money moves', enabled: true },
  { icon: Mail, title: 'Monthly insight', text: 'A thoughtful review of your finances', enabled: true },
  { icon: ShieldCheck, title: 'Security alerts', text: 'Important account and sign-in activity', enabled: true },
]

export default function SettingsPage() {
  const { user, logout, updateUserProfile, changePassword, beginTwoFactor, finishTwoFactor, demoMode } = useAuth()
  const { theme, setTheme } = useTheme()
  const [toggles, setToggles] = useState(settings.map((item) => item.enabled))
  const [toast, setToast] = useState(null)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [twoFactorOpen, setTwoFactorOpen] = useState(false)
  const [verificationId, setVerificationId] = useState(null)
  const [profile, setProfile] = useState({ name: user?.displayName || 'Arjun Mehta', email: user?.email || 'arjun@moneyflow.demo', phone: user?.phone || '', address: user?.address || '' })

  useEffect(() => setProfile({ name: user?.displayName || '', email: user?.email || '', phone: user?.phone || '', address: user?.address || '' }), [user?.address, user?.displayName, user?.email, user?.phone, user?.uid])
  const initial = (profile.name || 'A').charAt(0).toUpperCase()
  const update = (key) => (event) => setProfile((current) => ({ ...current, [key]: event.target.value }))
  const showError = (error) => setToast({ message: error.message?.replace(/^Firebase:\s*/, '') || 'Please try again.', type: 'error' })
  const save = async (event) => {
    event.preventDefault()
    try { await updateUserProfile({ displayName: profile.name, email: profile.email, phone: profile.phone, address: profile.address }); setToast({ message: 'Your profile details have been saved.', type: 'success' }) } catch (error) { showError(error) }
  }
  const sendCode = async (event) => {
    event.preventDefault()
    try { const data = new FormData(event.currentTarget); const result = await beginTwoFactor(data.get('phone')); setVerificationId(result.verificationId); setToast({ message: demoMode ? 'Demo verification code: 123456' : 'Verification code sent to your phone.', type: 'success' }) } catch (error) { showError(error) }
  }
  const verifyCode = async (event) => {
    event.preventDefault()
    try { const code = new FormData(event.currentTarget).get('code'); if (demoMode && code !== '123456') throw new Error('Use 123456 for the demo verification code.'); await finishTwoFactor(verificationId, code); setTwoFactorOpen(false); setVerificationId(null); setToast({ message: 'Two-step verification is now enabled.', type: 'success' }) } catch (error) { showError(error) }
  }
  const savePassword = async (event) => {
    event.preventDefault()
    try { const data = new FormData(event.currentTarget); const next = data.get('newPassword'); if (next !== data.get('confirmPassword')) throw new Error('New passwords do not match.'); if (next.length < 6) throw new Error('Use at least 6 characters.'); await changePassword(data.get('currentPassword'), next); setPasswordOpen(false); setToast({ message: demoMode ? 'Demo password update saved.' : 'Your password has been updated.', type: 'success' }) } catch (error) { showError(error) }
  }

  return <AppShell title="Profile & settings" subtitle="Your MoneyFlow experience, your way">
    <div className="settings-layout">
      <aside className="settings-nav"><a className="active" href="#profile"><UserRound size={17} /> Profile</a><a href="#notifications"><BellRing size={17} /> Notifications</a><a href="#security"><KeyRound size={17} /> Security</a><a href="#appearance"><Moon size={17} /> Appearance</a></aside>
      <div className="settings-content">
        <Card id="profile" className="settings-card"><div className="settings-card-head"><div><span className="eyebrow">YOUR PROFILE</span><h2>Personal details</h2><p>This is how you’ll appear in MoneyFlow.</p></div></div><div className="profile-header"><div className="profile-avatar">{initial}<button aria-label="Profile photo uploads are coming soon"><Camera size={14} /></button></div><div><strong>{profile.name}</strong><p>{profile.email}</p></div></div><form className="stack-form profile-form" onSubmit={save}><div className="form-two"><Field label="Full name"><div className="input-icon"><UserRound size={16} /><Input value={profile.name} onChange={update('name')} required /></div></Field><Field label="Email address" hint="Email changes must be completed from your sign-in provider."><div className="input-icon"><Mail size={16} /><Input type="email" value={profile.email} readOnly /></div></Field></div><div className="form-two"><Field label="Phone number"><div className="input-icon"><Phone size={16} /><Input value={profile.phone} onChange={update('phone')} /></div></Field><Field label="Location"><div className="input-icon"><MapPin size={16} /><Input value={profile.address} onChange={update('address')} /></div></Field></div><div className="settings-save"><Button type="submit">Save changes</Button></div></form></Card>
        <Card id="notifications" className="settings-card"><div className="settings-card-head"><div><span className="eyebrow">NOTIFICATIONS</span><h2>Keep me in the loop</h2><p>Choose what you’d like to hear about.</p></div></div><div className="preference-list">{settings.map((item, index) => { const Icon = item.icon; return <div key={item.title}><span className="preference-icon"><Icon size={18} /></span><div><strong>{item.title}</strong><p>{item.text}</p></div><Toggle label={item.title} checked={toggles[index]} onChange={(enabled) => setToggles((current) => current.map((value, entryIndex) => entryIndex === index ? enabled : value))} /></div> })}</div></Card>
        <Card id="security" className="settings-card"><div className="settings-card-head"><div><span className="eyebrow">SECURITY</span><h2>Keep your account protected</h2><p>Small actions to keep your finances private.</p></div></div><div className="security-row"><span className="preference-icon"><KeyRound size={18} /></span><div><strong>Password</strong><p>Update it whenever you need to.</p></div><Button variant="secondary" size="sm" onClick={() => setPasswordOpen(true)}>Update password <ChevronRight size={14} /></Button></div><div className="security-row"><span className="preference-icon"><ShieldCheck size={18} /></span><div><strong>Two-step verification</strong><p>{user?.twoFactorEnabled ? 'Extra protection is enabled.' : 'Add an extra layer to your account'}</p></div><Button variant="secondary" size="sm" onClick={() => { setVerificationId(null); setTwoFactorOpen(true) }}>{user?.twoFactorEnabled ? 'Enabled' : 'Set up'} <ChevronRight size={14} /></Button></div></Card>
        <Card id="appearance" className="settings-card appearance-card"><div><span className="eyebrow">APPEARANCE</span><h2>Set the mood</h2><p>Choose how MoneyFlow looks to you.</p></div><div className="theme-choices"><button type="button" className={`theme-choice ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}><Sun size={17} /><span>Light</span>{theme === 'light' && <i />}</button><button type="button" className={`theme-choice ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}><Moon size={17} /><span>Dark</span>{theme === 'dark' && <i />}</button></div></Card>
        <button className="logout-row" onClick={logout}><LogOut size={18} /> Sign out of MoneyFlow <ChevronRight size={17} /></button>
      </div>
    </div>
    <Modal open={passwordOpen} onClose={() => setPasswordOpen(false)} title="Update password"><form className="stack-form" onSubmit={savePassword}><Field label="Current password"><Input name="currentPassword" type="password" required /></Field><Field label="New password"><Input name="newPassword" type="password" minLength="6" required /></Field><Field label="Confirm new password"><Input name="confirmPassword" type="password" minLength="6" required /></Field><div className="modal-actions"><Button variant="secondary" onClick={() => setPasswordOpen(false)}>Cancel</Button><Button type="submit">Update password</Button></div></form></Modal>
    <Modal open={twoFactorOpen} onClose={() => { setTwoFactorOpen(false); setVerificationId(null) }} title="Set up two-step verification">{verificationId ? <form className="stack-form" onSubmit={verifyCode}><p className="soft-note">Enter the verification code sent to your phone.</p><Field label="Verification code"><Input name="code" inputMode="numeric" autoComplete="one-time-code" required /></Field><div className="modal-actions"><Button variant="secondary" onClick={() => setVerificationId(null)}>Use another number</Button><Button type="submit">Verify and enable</Button></div></form> : <form className="stack-form" onSubmit={sendCode}><p className="soft-note">We’ll text a code to confirm this phone can secure your account.</p><Field label="Mobile number"><Input name="phone" type="tel" placeholder="+91 98765 43210" required /></Field><div id="recaptcha-container" /><div className="modal-actions"><Button variant="secondary" onClick={() => setTwoFactorOpen(false)}>Cancel</Button><Button type="submit">Send verification code</Button></div></form>}</Modal>
    <Toast {...(toast || {})} onClose={() => setToast(null)} />
  </AppShell>
}
