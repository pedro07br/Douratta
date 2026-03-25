import Link from 'next/link'
import styles from '../src/components/NotFound/NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.number}>404</div>
        <div className={styles.divider} />
        <h1 className={styles.title}>PÁGINA NÃO ENCONTRADA</h1>
        <p className={styles.text}>
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/">
          <button className={styles.btn}>VOLTAR PARA A HOME</button>
        </Link>
        <Link href="/produtos">
          <button className={styles.btnSecondary}>VER COLEÇÃO</button>
        </Link>
      </div>
      <div className={styles.decoration}>
        <svg width="300" height="300" viewBox="0 0 300 300" opacity="0.05">
          <circle cx="150" cy="150" r="140" fill="none" stroke="#9a7c4f" strokeWidth="1"/>
          <circle cx="150" cy="150" r="100" fill="none" stroke="#9a7c4f" strokeWidth="1"/>
          <circle cx="150" cy="150" r="60" fill="none" stroke="#9a7c4f" strokeWidth="1"/>
          <circle cx="150" cy="150" r="25" fill="#9a7c4f"/>
        </svg>
      </div>
    </div>
  )
}