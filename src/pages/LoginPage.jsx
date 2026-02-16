import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async () => {
        if (!email || !password) return alert('لطفاً ایمیل و پسورد را وارد کنید')

        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)

        if (error) alert('خطا در ورود: ' + error.message)
        else navigate('/admin') // ورود موفق
    }

    return (
        <div style={{ padding: 40, maxWidth: 400, margin: 'auto', fontFamily: 'sans-serif' }}>
            <h1>ورود ادمین</h1>
            <input type="email" placeholder="ایمیل" value={email} onChange={e => setEmail(e.target.value)} style={{ display: 'block', marginBottom: 10, width: '100%' }} />
            <input type="password" placeholder="رمز عبور" value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', marginBottom: 10, width: '100%' }} />
            <button onClick={handleLogin} disabled={loading} style={{ width: '100%' }}>
                {loading ? 'در حال ورود...' : 'ورود'}
            </button>
        </div>
    )
}
