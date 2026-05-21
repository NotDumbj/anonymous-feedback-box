import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import { Send, CheckCircle2 } from 'lucide-react'

export default function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('General')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    setIsSubmitting(true)
    const { error } = await supabase
      .from('feedback')
      .insert([{ message, category }])

    setIsSubmitting(false)
    if (!error) {
      setSubmitted(true)
      setMessage('')
      setTimeout(() => setSubmitted(false), 5000)
    }
  }

  if (submitted) return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="cyber-panel"
      style={{ padding: '4rem 3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '500px' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
      >
        <CheckCircle2 color="var(--accent-secondary)" size={64} style={{ filter: 'drop-shadow(0 0 10px rgba(20, 184, 166, 0.4))' }} />
      </motion.div>
      <div>
        <h2 className="text-gradient" style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transmission Sent</h2>
        <p>Your feedback has been securely logged.</p>
      </div>
    </motion.div>
  )

  return (
    <motion.div 
      className="cyber-panel"
      style={{ padding: '3rem', width: '100%', maxWidth: '550px' }}
    >
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Input_Data</h2>
        <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Provide your anonymous feedback below.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Classification</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            className="cyber-input"
            style={{ width: '100%', padding: '0.85rem 1rem', outline: 'none' }}
          >
            <option style={{background: 'var(--bg-secondary)'}}>General</option>
            <option style={{background: 'var(--bg-secondary)'}}>Bug</option>
            <option style={{background: 'var(--bg-secondary)'}}>Suggestion</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Payload</label>
          <textarea 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            placeholder="Awaiting input..."
            rows={5}
            className="cyber-input"
            style={{ width: '100%', padding: '1rem', outline: 'none', resize: 'none' }}
          />
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!message.trim() || isSubmitting}
          className={`cyber-btn ${(!message.trim() || isSubmitting) ? '' : 'cyber-btn-primary'}`}
          style={{
            marginTop: '1rem', padding: '1rem',
            opacity: (!message.trim() || isSubmitting) ? 0.5 : 1,
            cursor: (!message.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
          }}
        >
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isSubmitting ? 'TRANSMITTING...' : 'INITIALIZE_TRANSFER'}
          </span>
          {!isSubmitting && <Send size={18} />}
        </motion.button>
      </form>
    </motion.div>
  )
}