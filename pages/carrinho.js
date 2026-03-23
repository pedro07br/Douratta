import Link from 'next/link'
import Navbar from '../src/components/Navbar/Navbar'
import { useCart } from '../src/context/CartContext'
import styles from '../src/components/Cart/Cart.module.css'

export default function Carrinho() {
  const { items, removeItem, updateQuantity, total, count } = useCart()

  const formatted = (value) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(value)

  return (
    <div className="marble">
      <Navbar />
      <div className={styles.wrapper}>
        <h1 className={styles.title}>MEU CARRINHO</h1>
        <p className={styles.sub}>{count} {count === 1 ? 'ITEM' : 'ITENS'}</p>
        <div className={styles.divider} />

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>SEU CARRINHO ESTÁ VAZIO</p>
            <Link href="/produtos">
              <button className={styles.continueBtn}>VER COLEÇÃO</button>
            </Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.itemsList}>
              {items.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImg}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="22" fill="none" stroke="#9a7c4f" strokeWidth="1"/>
                        <circle cx="30" cy="30" r="10" fill="#c9a96e" fillOpacity="0.5"/>
                      </svg>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemCat}>{item.category?.name?.toUpperCase()}</div>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemUnit}>{formatted(item.price)} / unidade</div>
                    <div className={styles.qtyRow}>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span className={styles.qtyNum}>{item.quantity}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className={styles.itemRight}>
                    <div className={styles.itemSubtotal}>{formatted(Number(item.price) * item.quantity)}</div>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>REMOVER</button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryTitle}>RESUMO DO PEDIDO</div>
              <div className={styles.summaryLine}><span>SUBTOTAL</span><span>{formatted(total)}</span></div>
              <div className={styles.summaryLine}><span>FRETE</span><span>A CALCULAR</span></div>
              <div className={styles.summaryTotal}>
                <span className={styles.summaryTotalLabel}>TOTAL</span>
                <span className={styles.summaryTotalValue}>{formatted(total)}</span>
              </div>
              <Link href="/checkout">
                <button className={styles.checkoutBtn}>FINALIZAR COMPRA</button>
              </Link>
              <Link href="/produtos">
                <button className={styles.continueBtn}>CONTINUAR COMPRANDO</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}