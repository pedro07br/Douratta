import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../../src/components/Operacional/Operacional.module.css'

export default function OperacionalLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/operacional/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      router.push('/operacional')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          DOUR<span className={styles.loginAccent}>·</span>ATTA
        </div>
        <div className={styles.loginSub}>PAINEL OPERACIONAL</div>
        <div className={styles.loginDivider} />

        <div className={styles.field}>
          <div className={styles.fieldLabel}>EMAIL</div>
          <input
            className={styles.fieldInput}
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="operador@douratta.com"
          />
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>SENHA</div>
          <input
            className={styles.fieldInput}
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>

        {error && <div className={styles.loginError}>{error}</div>}

        <button
          className={styles.loginBtn}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'ENTRANDO...' : 'ENTRAR'}
        </button>
      </div>
    </div>
  )
}