import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import { useEffect, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { count, setIsOpen } = useCart()
  const [isAdmin, setIsAdmin] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/user/perfil')
      .then(r => r.json())
      .then(data => { if (data.role === 'ADMIN') setIsAdmin(true) })
      .catch(() => {})
  }, [])

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          DOUR<span className={styles.logoAccent}>·</span>ATTA
        </Link>

        {/* Desktop */}
        <div className={styles.navRight}>
          <Link href="/produtos"  className={styles.navLink}>COLEÇÕES</Link>
          <Link href="/sobre"     className={styles.navLink}>SOBRE</Link>
          <Link href="/contato"   className={styles.navLink}>CONTATO</Link>
          <Link href="/perfil"    className={styles.navLink}>MINHA CONTA</Link>
          {isAdmin && <Link href="/admin" className={styles.adminPill}>ADMIN</Link>}
          <button className={styles.themePill} onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className={styles.cartPill} onClick={() => setIsOpen(true)}>
            CARRINHO · {count}
          </button>
        </div>

        {/* Mobile */}
        <button className={styles.menuBtn} onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Menu mobile */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
        <Link href="/produtos" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>COLEÇÕES</Link>
        <Link href="/sobre"    className={styles.mobileLink} onClick={() => setMenuOpen(false)}>SOBRE</Link>
        <Link href="/contato"  className={styles.mobileLink} onClick={() => setMenuOpen(false)}>CONTATO</Link>
        <Link href="/perfil"   className={styles.mobileLink} onClick={() => setMenuOpen(false)}>MINHA CONTA</Link>
        {isAdmin && <Link href="/admin" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>ADMIN</Link>}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: 4 }}>
          <button className={styles.themePill} onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className={styles.cartPill} onClick={() => { setIsOpen(true); setMenuOpen(false) }}>
            CARRINHO · {count}
          </button>
        </div>
      </div>
    </>
  )
}