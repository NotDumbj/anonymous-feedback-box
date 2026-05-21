import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('General')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    const { error } = await supabase
      .from('feedback')
      .insert([{ message, category }])

    if (!error) {
      setSubmitted(true)
      setMessage('')
    }
  }

  if (submitted) return <p>✅ Feedback submitted! Thank you.</p>

  return (
    <div>
      <h2>Submit Feedback</h2>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option>General</option>
        <option>Bug</option>
        <option>Suggestion</option>
      </select>
      <textarea value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}