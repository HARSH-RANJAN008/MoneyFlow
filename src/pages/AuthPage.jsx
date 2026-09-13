import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button, Field, Input, Toast } from '../components/ui/Primitives'

const loginSchema = z.object({ email: z.string().email('Enter a valid email address.'), password: z.string().min(6, 'Password must be at least 6 characters.'), remember: z.boolean() })
const signupSchema = z.object({ name: z.string().min(2, 'Please enter your name.'), email: z.string().email('Enter a valid email address.'), password: z.string().min(6, 'Use at least 6 characters.'), confirm: z.string(), terms: z.literal(true, { error: 'Please accept the terms to continue.' }) }).refine((data) => data.password === data.confirm, { message: 'Passwords do not match.', path: ['confirm'] })
const resetSchema = z.object({ email: z.string().email('Enter a valid email address.') })

const copy = {
  login: { eyebrow: 'Welcome back', heading: 'Your money, in a clearer flow.', button: 'Sign in', foot: 'New to MoneyFlow?', link: 'Create an account' },
  signup: { eyebrow: 'Start your journey', heading: 'Build a better relationship with money.', button: 'Create account', foot: 'Already have an account?', link: 'Sign in' },
  reset: { eyebrow: 'Reset your password', heading: 'We’ll help you get back in.', button: 'Send reset link', foot: 'Remembered your password?', link: 'Back to sign in' },
}

function AuthArt() { return <aside className="auth-art"><div className="auth-art-grid" /><div className="art-brand"><span className="brand-mark"><span /></span><span>moneyflow</span></div><div className="art-copy"><span className="art-kicker"><Sparkles size={15} /> MONEY, MADE SIMPLE</span><h2>Financial clarity<br />starts with <i>today.</i></h2><p>One calm, intelligent home for all the things your money needs to do.</p></div><div className="art-orb art-orb-one" /><div className="art-orb art-orb-two" /><div className="art-card"><span className="art-card-label">This month</span><strong>₹20,250</strong><div><span><Check size={12} /> on track</span><small>+12.4% from July</small></div></div><p className="art-quote">“The future depends on what you do today.” <span>— M. Gandhi</span></p></aside> }

export default function AuthPage({ mode = 'login' }) {
  const { login, signup, loginWithGoogle, resetPassword, demoMode } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const schema = mode === 'login' ? loginSchema : mode === 'signup' ? signupSchema : resetSchema
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { remember: true, terms: false } })
  const view = copy[mode]
  const target = location.state?.from?.pathname || '/'
  const onSubmit = async (data) => {
    try {
      if (mode === 'login') { await login(data.email, data.password); navigate(target, { replace: true }) }
      if (mode === 'signup') { await signup(data.name, data.email, data.password); navigate('/') }
      if (mode === 'reset') { await resetPassword(data.email); setToast({ message: 'Reset link sent — check your inbox.', type: 'success' }) }
    } catch (error) { setToast({ message: error.message.replace('Firebase: ', ''), type: 'error' }) }
  }
  const google = async () => { try { await loginWithGoogle(); navigate('/') } catch (error) { setToast({ message: error.message, type: 'error' }) } }
  return <div className="auth-page"><AuthArt /><main className="auth-main"><div className="auth-mobile-brand"><span className="brand-mark"><span /></span> moneyflow</div><div className="auth-form-wrap"><Link className="auth-back" to={mode === 'signup' ? '/login' : mode === 'reset' ? '/login' : '#'} onClick={(event) => mode === 'login' && event.preventDefault()}>{mode !== 'login' && <><ArrowLeft size={16} /> Back to sign in</>}</Link><span className="auth-eyebrow">{view.eyebrow}</span><h1>{view.heading}</h1>{mode === 'reset' && <p className="auth-description">Enter the email tied to your account and we’ll send you a secure reset link.</p>}
    {mode !== 'reset' && <button className="google-button" onClick={google}><span className="google-g">G</span> Continue with Google</button>} {mode !== 'reset' && <div className="divider"><span>or continue with email</span></div>}
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {mode === 'signup' && <Field label="Full name" error={errors.name?.message}><Input placeholder="Your name" autoComplete="name" {...register('name')} /></Field>}
      <Field label="Email address" error={errors.email?.message}><div className="input-icon"><Mail size={17} /><Input type="email" placeholder="you@example.com" autoComplete="email" {...register('email')} /></div></Field>
      {mode !== 'reset' && <Field label="Password" error={errors.password?.message}><div className="input-icon password-input"><LockKeyhole size={17} /><Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} {...register('password')} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Show password">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></Field>}
      {mode === 'signup' && <Field label="Confirm password" error={errors.confirm?.message}><div className="input-icon password-input"><LockKeyhole size={17} /><Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" autoComplete="new-password" {...register('confirm')} /></div></Field>}
      {mode === 'login' && <div className="form-row"><Controller name="remember" control={control} render={({ field }) => <label className="check-label"><input type="checkbox" checked={field.value} onChange={field.onChange} /> <span /> Remember me</label>} /><Link to="/forgot-password">Forgot password?</Link></div>}
      {mode === 'signup' && <Controller name="terms" control={control} render={({ field }) => <label className="check-label terms"><input type="checkbox" checked={field.value} onChange={field.onChange} /> <span /> I agree to MoneyFlow’s <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a></label>} />}{errors.terms && <span className="field-error">{errors.terms.message}</span>}
      <Button type="submit" className="auth-submit" size="lg" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : <>{view.button} <ArrowRight size={17} /></>}</Button>
    </form><p className="auth-switch">{view.foot} <Link to={mode === 'login' ? '/signup' : '/login'}>{view.link}</Link></p>{demoMode && mode === 'login' && <p className="demo-login"><ShieldCheck size={15} /> Demo mode — use any valid email and 6+ character password.</p>}</div><Toast {...(toast || {})} onClose={() => setToast(null)} /></main></div>
}
