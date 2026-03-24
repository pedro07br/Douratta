import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import { getCookie } from 'cookies-next'
import { useEffect, useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { count, setIsOpen } = useCart()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/user/perfil')
      .then(r => r.json())
      .then(data => { if (data.role === 'ADMIN') setIsAdmin(true) })
      .catch(() => {})
  }, [])

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        DOUR<span className={styles.logoAccent}>·</span>ATTA
      </Link>
      <div className={styles.navRight}>
        <Link href="/produtos"  className={styles.navLink}>COLEÇÕES</Link>
        <Link href="/sobre"     className={styles.navLink}>SOBRE</Link>
        <Link href="/contato"   className={styles.navLink}>CONTATO</Link>
        <Link href="/perfil"    className={styles.navLink}>MINHA CONTA</Link>
        {isAdmin && (
          <Link href="/admin" className={styles.adminPill}>ADMIN</Link>
        )}
        <button className={styles.cartPill} onClick={() => setIsOpen(true)}>
          CARRINHO · {count}
        </button>
      </div>
    </nav>
  )
}