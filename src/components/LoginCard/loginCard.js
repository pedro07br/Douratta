import Link from 'next/link'
import Input from '../input/input'

export default function LoginCard() {
  return (
    <div className="login-box">
      <form action="">
        <h2>Login</h2>

        <Input type="email" label="Email" icon="mail" />
        <Input type="password" label="Password" icon="lock-closed" />

        <div className="remember-forgot">
          <label><input type="checkbox" /> Remember me</label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit">Login</button>

        <div className="register-link">
          <p>Don't have an account? <Link href="/cadastro">Register</Link></p>
        </div>
      </form>
    </div>
  )
}