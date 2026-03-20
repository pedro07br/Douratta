import styles from './input.module.css'

export default function Input({ type, label, icon }) {
  return (
    <div className="input-box">
      <span className="icon">
        <ion-icon name={icon}></ion-icon>
      </span>
      <input type={type} required />
      <label>{label}</label>
    </div>
  )
}