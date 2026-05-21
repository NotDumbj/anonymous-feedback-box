import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'

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
      setTimeout(() => setSubmitted(false), 5000) // Reset after 5s
    }
  }

  if (submitted) return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass-panel"
      style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '500px' }}
    >
      <CheckCircle color="var(--accent-color)" size={48} />
      <h2 className="text-gradient">Thank You!</h2>
      <p>Your feedback has been submitted successfully.</p>
    </motion.div>
  )

  return (
    <motion.div 
      className="glass-panel"
      style={{ padding: '2.5rem', width: '100%', maxWidth: '500px' }}
    >
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Submit Feedback</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)}
            style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)', outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          >
            <option style={{background: 'var(--bg-color)'}}>General</option>
            <option style={{background: 'var(--bg-color)'}}>Bug</option>
            <option style={{background: 'var(--bg-color)'}}>Suggestion</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message</label>
          <textarea 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            placeholder="Tell us what you think..."
            rows={5}
            style={{
              width: '100%', padding: '1rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)', outline: 'none',
              resize: 'none', transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-color)'
              e.target.style.boxShadow = '0 0 10px rgba(102, 252, 241, 0.2)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--glass-border)'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!message.trim() || isSubmitting}
          style={{
            marginTop: '1rem', padding: '0.75rem', borderRadius: '8px',
            background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-color))',
            color: '#0b0c10', fontWeight: 'bold', fontSize: '1rem',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
            opacity: (!message.trim() || isSubmitting) ? 0.5 : 1,
            cursor: (!message.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.3s'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Send Feedback'}
          {!isSubmitting && <Send size={18} />}
        </motion.button>
      </form>
    </motion.div>
  )
}