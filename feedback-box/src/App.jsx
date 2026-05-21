import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, MessageSquare } from 'lucide-react'
import FeedbackForm from './components/FeedbackForm'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return (
    <div className="app-container">
      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-gradient glow-text"
        style={{ fontSize: '1.5rem', fontWeight: 600 }}
      >
        Loading System...
      </motion.p>
    </div>
  )

  if (session) return (
    <div className="app-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="content-wrapper">
        <AdminDashboard session={session} />
      </div>
    </div>
  )

  return (
    <div className="app-container">
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="content-wrapper">
        {/* Header / Nav */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="glow-effect" style={{ background: 'var(--accent-secondary)', padding: '0.5rem', borderRadius: '12px' }}>
              <MessageSquare color="#0b0c10" size={24} />
            </div>
            <h1 style={{ fontSize: '1.75rem', margin: 0 }} className="text-gradient">Feedback Portal</h1>
          </div>
          
          <button 
            onClick={() => setShowLogin(!showLogin)}
            className="glass-panel"
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              padding: '0.5rem 1rem', color: 'var(--text-secondary)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <Settings size={18} />
            {showLogin ? 'Back to Form' : 'Admin Login'}
          </button>
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showLogin ? 'login' : 'form'}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="page-transition"
          >
            {showLogin ? <AdminLogin /> : <FeedbackForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}