import Link from 'next/link'
import Input from '../src/components/input/input'
import Button from '../src/components/Button/Button'
import styles from '../src/components/LoginCard/loginCard.module.css'

export default function Cadastro() {
  return (
    <section className={styles.section}>
      <form className={styles.loginBox}>
        <h2 className={styles.title}>Register</h2>

        <Input type="text"     label="Full Name"        icon="person"      />
        <Input type="email"    label="Email"            icon="mail"        />
        <Input type="password" label="Password"         icon="lock-closed" />
        <Input type="password" label="Confirm Password" icon="lock-closed" />

        <div className={styles.rememberForgot}>
          <label><input type="checkbox" /> I agree to the terms</label>
        </div>

        <Button type="submit">Register</Button>

        <div className={styles.registerLink}>
          <p>Already have an account? <Link href="/login">Login</Link></p>
        </div>
      </form>
    </section>
  )
}