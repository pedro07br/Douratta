import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import styles from './ProductCard.module.css'


export default function ProductCard({ product }) {
  const { addItem } = useCart()

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price)

  return (
    <Link href={`/produtos/${product.slug}`} style={{ textDecoration: 'none' }}>
      <div className={styles.card}>
        <div className={styles.imgArea}>
          {product.badge && (
            <span className={styles.badge}>{product.badge}</span>
          )}
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className={styles.image} />
          ) : (
            <svg className={styles.placeholder} width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="32" fill="none" stroke="#9a7c4f" strokeWidth="1"/>
              <circle cx="45" cy="45" r="20" fill="none" stroke="#c9a96e" strokeWidth="0.5"/>
              <circle cx="45" cy="45" r="7" fill="#c9a96e" fillOpacity="0.6"/>
            </svg>
          )}
        </div>
        <div className={styles.info}>
          <div className={styles.category}>{product.category?.name}</div>
          <div className={styles.name}>{product.name}</div>
          <div className={styles.bottom}>
            <span className={styles.price}>{formatted}</span>
            <button
              className={styles.addBtn}
              onClick={(e) => {
                e.preventDefault()
                addItem(product, 1)
              }}
            >
              + CARRINHO
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}