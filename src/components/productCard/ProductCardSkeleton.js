import styles from './ProductCardSkeleton.module.css'

export default function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.imgArea} />
      <div className={styles.info}>
        <div className={styles.category} />
        <div className={styles.name} />
        <div className={styles.nameSm} />
        <div className={styles.bottom}>
          <div className={styles.price} />
          <div className={styles.btn} />
        </div>
      </div>
    </div>
  )
}