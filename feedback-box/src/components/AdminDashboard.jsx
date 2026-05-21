import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Filter, Activity, LayoutGrid } from 'lucide-react'
import FeedbackItem from './FeedbackItem'

export default function AdminDashboard({ session }) {
  const [feedbackList, setFeedbackList] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'reviewed'
  const [categoryFilter, setCategoryFilter] = useState('all')

  const fetchFeedback = async () => {
    const { data } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
    setFeedbackList(data || [])
  }

  useEffect(() => {
    fetchFeedback()

    // Realtime subscription
    const channel = supabase
      .channel('feedback-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => {
        fetchFeedback()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const handleSignOut = () => supabase.auth.signOut()

  const filtered = feedbackList.filter(item => {
    const statusMatch = filter === 'all' || (filter === 'reviewed' ? item.is_reviewed : !item.is_reviewed)
    const catMatch = categoryFilter === 'all' || item.category === categoryFilter
    return statusMatch && catMatch
  })

  const FilterPill = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: active ? 'bold' : 'normal',
        background: active ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.05)',
        color: active ? '#0b0c10' : 'var(--text-secondary)',
        border: `1px solid ${active ? 'var(--accent-secondary)' : 'var(--glass-border)'}`,
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  )

  return (
    <div style={{ width: '100%' }}>
      {/* Dashboard Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel"
        style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '1.25rem 2rem', marginBottom: '2rem' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="glow-effect" style={{ background: 'var(--accent-color)', padding: '0.4rem', borderRadius: '8px' }}>
            <Activity color="#0b0c10" size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Admin Dashboard</h2>
        </div>
        
        <button 
          onClick={handleSignOut}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            color: '#ff4b4b', padding: '0.4rem 0.8rem', borderRadius: '8px',
            background: 'rgba(255, 75, 75, 0.1)', transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 75, 75, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 75, 75, 0.1)'}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status:</span>
          <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterPill>
          <FilterPill active={filter === 'pending'} onClick={() => setFilter('pending')}>Pending</FilterPill>
          <FilterPill active={filter === 'reviewed'} onClick={() => setFilter('reviewed')}>Reviewed</FilterPill>
          
          <div style={{ width: '1px', height: '20px', background: 'var(--glass-border)', margin: '0 0.5rem' }} />
          
          <LayoutGrid size={18} color="var(--text-secondary)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category:</span>
          <FilterPill active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>All</FilterPill>
          <FilterPill active={categoryFilter === 'General'} onClick={() => setCategoryFilter('General')}>General</FilterPill>
          <FilterPill active={categoryFilter === 'Bug'} onClick={() => setCategoryFilter('Bug')}>Bug</FilterPill>
          <FilterPill active={categoryFilter === 'Suggestion'} onClick={() => setCategoryFilter('Suggestion')}>Suggestion</FilterPill>
        </div>
      </motion.div>

      {/* Feedback Grid */}
      <motion.div 
        layout
        style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem', alignItems: 'start' 
        }}
      >
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}
            >
              No feedback items match your filters.
            </motion.div>
          ) : (
            filtered.map(item => (
              <FeedbackItem key={item.id} item={item} onRefresh={fetchFeedback} />
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}