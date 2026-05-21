import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import { Check, Clock, Trash2, CheckCircle2 } from 'lucide-react'

export default function FeedbackItem({ item, onRefresh }) {
  const toggleReviewed = async () => {
    await supabase
      .from('feedback')
      .update({ is_reviewed: !item.is_reviewed })
      .eq('id', item.id)
    onRefresh()
  }

  const deleteItem = async () => {
    await supabase.from('feedback').delete().eq('id', item.id)
    onRefresh()
  }

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Bug': return 'var(--accent-danger)'
      case 'Suggestion': return '#eab308' // Cyber Yellow
      default: return 'var(--accent-primary)'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px -10px rgba(99, 102, 241, 0.3)' }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="cyber-panel"
      style={{ 
        padding: '1.5rem', display: 'flex', flexDirection: 'column', 
        gap: '1rem', position: 'relative', overflow: 'hidden',
        borderLeft: `3px solid ${getCategoryColor(item.category)}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ 
            fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', 
            letterSpacing: '0.1em', color: getCategoryColor(item.category)
          }}>
            CLASS: {item.category}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
            ID: {String(item.id).split('-')[0]} // {new Date(item.created_at).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' })}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', color: item.is_reviewed ? 'var(--accent-secondary)' : 'var(--text-secondary)', background: item.is_reviewed ? 'rgba(20, 184, 166, 0.1)' : 'var(--panel-bg)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: `1px solid ${item.is_reviewed ? 'rgba(20, 184, 166, 0.3)' : 'var(--border-subtle)'}` }}>
          {item.is_reviewed ? <CheckCircle2 size={14} /> : <Clock size={14} />}
          {item.is_reviewed ? 'VERIFIED' : 'PENDING'}
        </div>
      </div>

      <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0.5rem 0', wordBreak: 'break-word', lineHeight: 1.5 }}>
        {item.message}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggleReviewed}
            title={item.is_reviewed ? "Revert Status" : "Verify Data"}
            className="cyber-btn"
            style={{ 
              padding: '0.4rem 0.75rem', 
              borderColor: item.is_reviewed ? 'var(--border-subtle)' : 'var(--accent-secondary)',
              color: item.is_reviewed ? 'var(--text-secondary)' : 'var(--accent-secondary)',
              background: item.is_reviewed ? 'transparent' : 'rgba(20, 184, 166, 0.1)'
            }}
          >
            <Check size={16} />
            <span style={{ fontSize: '0.75rem' }}>{item.is_reviewed ? 'REVERT' : 'VERIFY'}</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', borderColor: 'var(--accent-danger)' }} 
            whileTap={{ scale: 0.9 }}
            onClick={deleteItem}
            title="Purge Record"
            className="cyber-btn"
            style={{ padding: '0.4rem 0.75rem', color: 'var(--text-secondary)' }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}