import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
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

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
      <h2>Admin Dashboard</h2>
      {/* Add your filter UI here */}
      {filtered.map(item => (
        <FeedbackItem key={item.id} item={item} onRefresh={fetchFeedback} />
      ))}
    </div>
  )
}