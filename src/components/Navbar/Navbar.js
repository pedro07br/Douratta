import Link from "next/link";
import styles from "./Navbar.module.css";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { count, setIsOpen } = useCart();

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        DOUR<span className={styles.logoAccent}>·</span>ATTA
      </Link>

      <div className={styles.navRight}>
        <Link href="/produtos" className={styles.navLink}>
          COLEÇÕES
        </Link>
        <Link href="/sobre" className={styles.navLink}>
          SOBRE
        </Link>
        <Link href="/contato" className={styles.navLink}>
          CONTATO
        </Link>

        <button className={styles.cartPill} onClick={() => setIsOpen(true)}>
          CARRINHO · {count}
        </button>
      </div>
    </nav>
  );
}