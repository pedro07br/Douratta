import Navbar from '../src/components/Navbar/Navbar'
import styles from '../src/components/Sobre/Sobre.module.css'

export default function Sobre() {
  const equipe = [
    { nome: 'Pedro Henrique C. Santos', cargo: 'PROGRAMADOR & CEO', inicial: 'P' },
    { nome: 'Pedro Henrique G. Silva',  cargo: 'CHEFE & ARTESÃO',   inicial: 'P' },
    { nome: 'Juan Assis',               cargo: 'VENDEDOR & GERENTE', inicial: 'J' },
    { nome: 'Pedro W. B. Rodrigues',    cargo: 'MESTRE EM REFINAMENTO', inicial: 'P' },
  ]

  return (
    <div>
      <Navbar />

      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>NOSSA HISTÓRIA</div>
          <h1 className={styles.heroTitle}>QUEM SOMOS</h1>
          <div className={styles.heroDivider} />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>A NOSSA HISTÓRIA</div>
        <div className={styles.sectionDivider} />
        <p className={styles.text}>
          A Douratta nasceu da paixão por joias que transcendem o tempo. Com sede em São Paulo, a marca se especializou na criação de joias exclusivas em ouro 18k, combinando técnicas artesanais tradicionais com design contemporâneo.
        </p>
        <p className={styles.text}>
          Cada peça é cuidadosamente concebida em nosso atelier, onde a precisão e o cuidado com os detalhes fazem parte de cada etapa do processo. Trabalhamos apenas com ouro 18k certificado e pedras preciosas de origem responsável.
        </p>

        <div className={styles.valoresGrid}>
          <div className={styles.valorCard}>
            <div className={styles.valorIcon}>◇</div>
            <div className={styles.valorTitle}>QUALIDADE</div>
            <div className={styles.valorText}>Apenas ouro 18k certificado e pedras preciosas de origem rastreável.</div>
          </div>
          <div className={styles.valorCard}>
            <div className={styles.valorIcon}>○</div>
            <div className={styles.valorTitle}>ARTESANAL</div>
            <div className={styles.valorText}>Cada peça é feita à mão por joalheiros com mais de 20 anos de experiência.</div>
          </div>
          <div className={`${styles.valorCard} ${styles.valorCardDark}`}>
            <div className={styles.valorIconLight}>△</div>
            <div className={styles.valorTitleLight}>EXCLUSIVIDADE</div>
            <div className={styles.valorTextLight}>Coleções limitadas para garantir que cada cliente tenha uma peça única.</div>
          </div>
        </div>
      </div>

      <div className={styles.teamSection}>
        <div className={styles.teamHeader}>
          <div className={styles.sectionTitle}>NOSSA EQUIPE</div>
          <div className={`${styles.sectionDivider} ${styles.sectionDividerCenter}`} />
        </div>
        <div className={styles.teamGrid}>
          {equipe.map((m, i) => (
            <div key={i} className={styles.teamCard}>
              <div className={styles.teamAvatar}>{m.inicial}</div>
              <div className={styles.teamName}>{m.nome}</div>
              <div className={styles.teamRole}>{m.cargo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}