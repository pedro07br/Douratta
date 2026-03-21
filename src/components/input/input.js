import styles from './input.module.css'

export default function Input({ type, label, icon, required, value, onChange }) {
  return (
    <div className={styles.inputBox}>
      <span className={styles.icon}>
        <ion-icon name={icon}></ion-icon>
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
      />
      <label>{label}</label>
    </div>
  )
}