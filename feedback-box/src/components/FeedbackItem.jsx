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
    // Add subtle exit animation by triggering state first if needed, but for now we'll just delete
    await supabase.from('feedback').delete().eq('id', item.id)
    onRefresh()
  }

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Bug': return '#ff4b4b'
      case 'Suggestion': return '#c084fc'
      default: return '#45a29e'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(102, 252, 241, 0.2)' }}
      className="glass-panel"
      style={{ 
        padding: '1.5rem', display: 'flex', flexDirection: 'column', 
        gap: '1rem', position: 'relative', overflow: 'hidden'
      }}
    >
      {/* Category Indicator Line */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: getCategoryColor(item.category) }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', 
          letterSpacing: '1px', color: getCategoryColor(item.category),
          background: `${getCategoryColor(item.category)}22`, padding: '0.2rem 0.6rem', borderRadius: '4px'
        }}>
          {item.category}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <p style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: '0.5rem 0', wordBreak: 'break-word' }}>
        "{item.message}"
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: item.is_reviewed ? '#45a29e' : 'var(--text-secondary)' }}>
          {item.is_reviewed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
          {item.is_reviewed ? 'Reviewed' : 'Pending'}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <motion.button 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={toggleReviewed}
            title={item.is_reviewed ? "Mark as Pending" : "Mark as Reviewed"}
            style={{ 
              padding: '0.4rem', borderRadius: '6px', 
              background: item.is_reviewed ? 'rgba(255,255,255,0.05)' : 'rgba(69, 162, 158, 0.2)', 
              color: item.is_reviewed ? 'var(--text-secondary)' : '#45a29e'
            }}
          >
            <Check size={16} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, background: 'rgba(255, 75, 75, 0.2)', color: '#ff4b4b' }} 
            whileTap={{ scale: 0.9 }}
            onClick={deleteItem}
            title="Delete Feedback"
            style={{ padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}