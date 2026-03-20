import Link from 'next/link'

export default function Cadastro() {
  return (
    <section>
      <form className="login-box">
        <h2>Register</h2>

        <div className="input-box">
          <span className="icon"><ion-icon name="person"></ion-icon></span>
          <input type="text" required />
          <label>Full Name</label>
        </div>

        <div className="input-box">
          <span className="icon"><ion-icon name="mail"></ion-icon></span>
          <input type="email" required />
          <label>Email</label>
        </div>

        <div className="input-box">
          <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
          <input type="password" required />
          <label>Password</label>
        </div>

        <div className="input-box">
          <span className="icon"><ion-icon name="lock-closed"></ion-icon></span>
          <input type="password" required />
          <label>Confirm Password</label>
        </div>

        <div className="remember-forgot">
          <label><input type="checkbox" /> I agree to the terms</label>
        </div>

        <button type="submit">Register</button>

        <div className="register-link">
          <p>Already have an account? <Link href="/">Login</Link></p>
        </div>
      </form>
    </section>
  )
}