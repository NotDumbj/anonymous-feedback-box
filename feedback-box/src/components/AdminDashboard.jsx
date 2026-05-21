import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Filter, Activity, LayoutGrid } from 'lucide-react'
import FeedbackItem from './FeedbackItem'

export default function AdminDashboard({ session }) {
  const [feedbackList, setFeedbackList] = useState([])
  const [filter, setFilter] = useState('all')
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

  const FilterTab = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        padding: '0.4rem 1.25rem',
        borderRadius: '0',
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: active ? '600' : '400',
        background: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        borderBottom: `2px solid ${active ? 'var(--accent-primary)' : 'transparent'}`,
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  )

  return (
    <div style={{ width: '100%', zIndex: 10 }}>
      {/* Dashboard Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="cyber-panel"
        style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '1.25rem 2rem', marginBottom: '2rem' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ border: '1px solid var(--accent-primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '0.4rem', borderRadius: '4px' }}>
            <Activity color="var(--accent-primary)" size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System_Overview</h2>
        </div>
        
        <button 
          onClick={handleSignOut}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            color: 'var(--accent-danger)', padding: '0.4rem 0.8rem', borderRadius: '4px',
            background: 'rgba(239, 68, 68, 0.1)', transition: 'all 0.2s',
            border: '1px solid rgba(239, 68, 68, 0.2)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.borderColor = 'var(--accent-danger)' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
        className="cyber-panel"
        style={{ padding: '0.5rem 1rem', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Filter size={16} color="var(--text-secondary)" style={{ marginRight: '0.5rem' }} />
          <FilterTab active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterTab>
          <FilterTab active={filter === 'pending'} onClick={() => setFilter('pending')}>Pending</FilterTab>
          <FilterTab active={filter === 'reviewed'} onClick={() => setFilter('reviewed')}>Reviewed</FilterTab>
        </div>
        
        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LayoutGrid size={16} color="var(--text-secondary)" style={{ marginRight: '0.5rem' }} />
          <FilterTab active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>All</FilterTab>
          <FilterTab active={categoryFilter === 'General'} onClick={() => setCategoryFilter('General')}>General</FilterTab>
          <FilterTab active={categoryFilter === 'Bug'} onClick={() => setCategoryFilter('Bug')}>Bug</FilterTab>
          <FilterTab active={categoryFilter === 'Suggestion'} onClick={() => setCategoryFilter('Suggestion')}>Suggestion</FilterTab>
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
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', border: '1px dashed var(--border-subtle)', borderRadius: '4px' }}
            >
              No data records match current filter parameters.
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