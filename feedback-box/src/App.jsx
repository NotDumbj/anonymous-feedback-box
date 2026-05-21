import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Terminal } from 'lucide-react'
import FeedbackForm from './components/FeedbackForm'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import { ErrorBoundary } from './components/ErrorBoundary'
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
        animate={{ opacity: 1, scale: [0.98, 1, 0.98] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-gradient glow-text"
        style={{ fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        Initializing System...
      </motion.p>
    </div>
  )

  if (session) return (
    <div className="app-container">
      <div className="grid-background"></div>
      <div className="glow-orb"></div>
      <div className="content-wrapper">
        <ErrorBoundary>
          <AdminDashboard session={session} />
        </ErrorBoundary>
      </div>
    </div>
  )

  return (
    <div className="app-container">
      {/* Structural Background */}
      <div className="grid-background"></div>
      <div className="glow-orb"></div>

      <div className="content-wrapper">
        {/* Header / Nav */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', zIndex: 10 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-subtle)', padding: '0.5rem', borderRadius: '4px' }}>
              <Terminal color="var(--accent-primary)" size={24} />
            </div>
            <h1 style={{ fontSize: '1.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }} className="text-gradient">Feedback_Portal</h1>
          </div>
          
          <button 
            onClick={() => setShowLogin(!showLogin)}
            className="cyber-btn"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Settings size={16} />
            {showLogin ? 'RETURN TO FORM' : 'ADMIN ACCESS'}
          </button>
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showLogin ? 'login' : 'form'}
            initial={{ scale: 0.95, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 1.05, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="page-transition"
          >
            {showLogin ? <AdminLogin /> : <FeedbackForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}