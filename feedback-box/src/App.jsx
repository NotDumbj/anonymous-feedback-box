import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import FeedbackForm from './components/FeedbackForm'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading
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

  if (session === undefined) return <p>Loading...</p>

  if (session) return <AdminDashboard session={session} />

  return (
    <div>
      <FeedbackForm />
      {showLogin
        ? <AdminLogin />
        : <button onClick={() => setShowLogin(true)}>Admin Login</button>
      }
    </div>
  )
}