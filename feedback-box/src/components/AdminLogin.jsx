import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, ShieldAlert } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setIsLoading(false)
  }

  return (
    <motion.div 
      className="cyber-panel"
      style={{ padding: '3rem', width: '100%', maxWidth: '420px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ border: '1px solid var(--accent-primary)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: 'var(--panel-bg)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.15) inset' }}>
          <Lock color="var(--accent-primary)" size={32} />
        </div>
        <h2 style={{ fontSize: '1.25rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>System_Auth</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enter credentials to proceed</p>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ position: 'relative' }}>
          <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
          <input 
            type="email" 
            placeholder="Identity [Email]"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="cyber-input"
            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', outline: 'none' }}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
          <input 
            type="password" 
            placeholder="Passcode [Hidden]"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="cyber-input"
            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', outline: 'none' }}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--accent-danger)', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || !email || !password}
          className={`cyber-btn ${(!isLoading && email && password) ? 'cyber-btn-primary' : ''}`}
          style={{
            marginTop: '0.5rem', padding: '1rem',
            opacity: (isLoading || !email || !password) ? 0.5 : 1,
            cursor: (isLoading || !email || !password) ? 'not-allowed' : 'pointer'
          }}
        >
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isLoading ? 'AUTHENTICATING...' : 'AUTHORIZE_ACCESS'}
          </span>
          {!isLoading && <LogIn size={18} />}
        </motion.button>
      </form>
    </motion.div>
  )
}