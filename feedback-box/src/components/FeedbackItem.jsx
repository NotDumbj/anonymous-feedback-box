import { supabase } from '../supabaseClient'

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

  return (
    <div>
      <p>{item.message}</p>
      <p>Category: {item.category} | {new Date(item.created_at).toLocaleString()}</p>
      <p>Status: {item.is_reviewed ? '✅ Reviewed' : '⏳ Pending'}</p>
      <button onClick={toggleReviewed}>Toggle Review</button>
      <button onClick={deleteItem}>Delete</button>
    </div>
  )
}