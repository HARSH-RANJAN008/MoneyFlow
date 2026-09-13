import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Button({ children, className, variant = 'primary', size = 'md', type = 'button', ...props }) {
  return <button type={type} className={cn('button', `button-${variant}`, `button-${size}`, className)} {...props}>{children}</button>
}

export function IconButton({ children, className, label, ...props }) {
  return <button className={cn('icon-button', className)} aria-label={label} title={label} {...props}>{children}</button>
}

export function Card({ children, className, ...props }) {
  return <section className={cn('card', className)} {...props}>{children}</section>
}

export function Badge({ children, tone = 'default', className }) {
  return <span className={cn('badge', `badge-${tone}`, className)}>{children}</span>
}

export function Progress({ value, className }) {
  return <div className={cn('progress-track', className)}><motion.div className="progress-value" initial={{ width: 0 }} animate={{ width: `${Math.min(value, 100)}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} /></div>
}

export function Field({ label, error, children, hint }) {
  return <label className="field"><span className="field-label">{label}</span>{children}{hint && <span className="field-hint">{hint}</span>}{error && <span className="field-error">{error}</span>}</label>
}

export function Input({ className, ...props }) { return <input className={cn('input', className)} {...props} /> }
export function Select({ children, className, ...props }) { return <span className="select-wrap"><select className={cn('select', className)} {...props}>{children}</select><ChevronDown size={15} /></span> }

export function Modal({ open, onClose, title, children, wide = false }) {
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" onMouseDown={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div className={cn('modal', wide && 'modal-wide')} onMouseDown={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}>
      <div className="modal-head"><h2>{title}</h2><IconButton label="Close dialog" onClick={onClose}><X size={18} /></IconButton></div>{children}
    </motion.div>
  </motion.div>}</AnimatePresence>
}

export function Toggle({ checked, onChange, label }) {
  return <button className={cn('toggle', checked && 'toggle-on')} role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}><span /></button>
}

export function Toast({ message, type = 'success', onClose }) {
  return <AnimatePresence>{message && <motion.div className={`toast toast-${type}`} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}><span className="toast-icon">{type === 'success' ? <Check size={16} /> : <X size={16} />}</span>{message}<button onClick={onClose} aria-label="Dismiss notification"><X size={15} /></button></motion.div>}</AnimatePresence>
}

export function EmptyState({ title = 'Nothing here yet', body, action }) {
  return <div className="empty-state"><div className="empty-orb"><span>+</span></div><h3>{title}</h3><p>{body}</p>{action}</div>
}
