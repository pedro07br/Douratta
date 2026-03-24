import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.logo}>
            DOUR<span className={styles.logoAccent}>·</span>ATTA
          </div>
          <p className={styles.desc}>
            Joias exclusivas confeccionadas em ouro 18k com pedras preciosas certificadas. Arte e elegância em cada peça.
          </p>
          <div className={styles.socialRow}>
            <a className={styles.socialBtn} href="#" target="_blank" rel="noreferrer">in</a>
            <a className={styles.socialBtn} href="#" target="_blank" rel="noreferrer">ig</a>
            <a className={styles.socialBtn} href="#" target="_blank" rel="noreferrer">fb</a>
            <a className={styles.socialBtn} href="#" target="_blank" rel="noreferrer">pi</a>
          </div>
        </div>

        <div>
          <div className={styles.colTitle}>COLEÇÕES</div>
          <Link href="/produtos?categoria=aneis"      className={styles.colLink}>Anéis</Link>
          <Link href="/produtos?categoria=colares"    className={styles.colLink}>Colares</Link>
          <Link href="/produtos?categoria=pulseiras"  className={styles.colLink}>Pulseiras</Link>
          <Link href="/produtos?categoria=brincos"    className={styles.colLink}>Brincos</Link>
          <Link href="/produtos"                      className={styles.colLink}>Novidades</Link>
        </div>

        <div>
          <div className={styles.colTitle}>INSTITUCIONAL</div>
          <Link href="/sobre"   className={styles.colLink}>Nossa História</Link>
          <Link href="/sobre"   className={styles.colLink}>Sustentabilidade</Link>
          <Link href="/sobre"   className={styles.colLink}>Certificações</Link>
          <Link href="/contato" className={styles.colLink}>Contato</Link>
        </div>

        <div>
          <div className={styles.colTitle}>ATENDIMENTO</div>
          <Link href="/contato" className={styles.colLink}>Trocas e Devoluções</Link>
          <Link href="/contato" className={styles.colLink}>Prazo de Entrega</Link>
          <Link href="/contato" className={styles.colLink}>Formas de Pagamento</Link>
          <Link href="/contato" className={styles.colLink}>FAQ</Link>
          <a href="mailto:contato@douratta.com" className={`${styles.colLink} ${styles.colEmail}`}>
            contato@douratta.com
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.copy}>
          © 2026 <span className={styles.copyAccent}>DOURATTA</span> · TODOS OS DIREITOS RESERVADOS
        </div>
        <div className={styles.badges}>
          <span className={styles.badge}>SSL SEGURO</span>
          <span className={styles.badge}>OURO 18K</span>
          <span className={styles.badge}>FRETE GRÁTIS</span>
        </div>
      </div>
    </footer>
  )
}