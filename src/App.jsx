// function App() {
//   return (
//     <div className="bg-red-500 text-white p-10 text-3xl">
//       Tailwind Works 🔥
//     </div>
//   )
// }

// export default App















import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminPage from './pages/AdminPage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { supabase } from './supabaseClient'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return <p>در حال بررسی ورود ادمین...</p>

  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={user ? <AdminPage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default App
