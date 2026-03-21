import styles from './Button.module.css'

export default function Button({ children, type = 'button', onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={styles.button}
    >
      {children}
    </button>
  )
}
