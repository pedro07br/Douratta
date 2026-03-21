import Link from 'next/link'
import Input from '../input/input'
import Button from '../Button/Button'
import styles from './loginCard.module.css'

export default function LoginCard({ formData, error, onSubmit, onChange }) {
  return (
    <section className={styles.section}>
      <div className={styles.loginBox}>
        <form onSubmit={onSubmit}>
          <h2 className={styles.title}>Login</h2>

          <Input type="email"    label="Email"    icon="mail"        required value={formData.email}    onChange={(e) => onChange(e, 'email')}    />
          <Input type="password" label="Password" icon="lock-closed" required value={formData.password} onChange={(e) => onChange(e, 'password')} />

          <div className={styles.rememberForgot}>
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot password?</a>
          </div>

          <Button type="submit">Login</Button>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.registerLink}>
            <p>Don't have an account? <Link href="/cadastro">Register</Link></p>
          </div>
        </form>
      </div>
    </section>
  )
}