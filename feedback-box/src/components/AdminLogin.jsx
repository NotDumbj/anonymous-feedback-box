import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

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
      className="glass-panel"
      style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
          <Lock color="var(--accent-color)" size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Admin Access</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sign in to manage feedback</p>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ position: 'relative' }}>
          <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
          <input 
            type="email" 
            placeholder="Email Address"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{
              width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)', outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
        </div>

        <div style={{ position: 'relative' }}>
          <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
          <input 
            type="password" 
            placeholder="Password"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{
              width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)', outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4b4b', fontSize: '0.85rem', background: 'rgba(255, 75, 75, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || !email || !password}
          style={{
            marginTop: '0.5rem', padding: '0.75rem', borderRadius: '8px',
            background: 'var(--text-primary)', color: 'var(--bg-color)', 
            fontWeight: 'bold', fontSize: '1rem',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
            opacity: (isLoading || !email || !password) ? 0.7 : 1,
            cursor: (isLoading || !email || !password) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Authenticating...' : 'Sign In'}
          {!isLoading && <LogIn size={18} />}
        </motion.button>
      </form>
    </motion.div>
  )
}