import Link from 'next/link'
import { useCart } from '../../context/CartContext'
import styles from './CartSidebar.module.css'

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, count } = useCart()

  const formatted = (value) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(value)

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>MEU CARRINHO</span>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>SEU CARRINHO ESTÁ VAZIO</div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImg}>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} />
                  ) : (
                    <svg width="40" height="40" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="14" fill="none" stroke="#9a7c4f" strokeWidth="1"/>
                      <circle cx="20" cy="20" r="6" fill="#c9a96e" fillOpacity="0.5"/>
                    </svg>
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemCat}>{item.category?.name?.toUpperCase()}</div>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemPrice}>{formatted(item.price)}</div>
                </div>
                <div className={styles.itemRight}>
                  <div className={styles.qtyRow}>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className={styles.qtyNum}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>REMOVER</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>{count} {count === 1 ? 'ITEM' : 'ITENS'}</span>
              <span>{formatted(total)}</span>
            </div>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>TOTAL</span>
              <span className={styles.totalValue}>{formatted(total)}</span>
            </div>
            <Link href="/checkout">
              <button className={styles.checkoutBtn}>FINALIZAR COMPRA</button>
            </Link>
            <Link href="/carrinho">
              <button className={styles.viewCartBtn} onClick={() => setIsOpen(false)}>
                VER CARRINHO COMPLETO
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}