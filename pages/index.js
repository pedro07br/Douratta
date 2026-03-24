import Link from 'next/link'
import Navbar from '../src/components/Navbar/Navbar'
import ProductCard from '../src/components/ProductCard/ProductCard'
import styles from '../src/components/Home/Home.module.css'
import prisma from '../services/prisma'

export default function Home({ featured, categories }) {
  return (
    <div>
      <Navbar />

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>NOVA COLEÇÃO 2026</div>
          <h1 className={styles.heroTitle}>ARTE EM<br />OURO PURO</h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroSub}>JOIAS EXCLUSIVAS · FEITAS À MÃO · OURO 18K</p>
          <div className={styles.heroBtns}>
            <Link href="/produtos">
              <button className={styles.btnPrimary}>VER COLEÇÃO</button>
            </Link>
            <Link href="/sobre">
              <button className={styles.btnSecondary}>NOSSA HISTÓRIA</button>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>NOSSAS CATEGORIAS</h2>
          <p className={styles.sectionSub}>ENCONTRE A JOIA PERFEITA</p>
          <div className={styles.sectionLine} />
        </div>
        <div className={styles.catGrid}>
          {categories.map(cat => (
            <Link key={cat.id} href={`/produtos?categoria=${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div className={styles.catCard}>
                <div className={styles.catIcon}>
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="22" fill="none" stroke="#9a7c4f" strokeWidth="1"/>
                    <circle cx="30" cy="30" r="10" fill="#c9a96e" fillOpacity="0.3"/>
                  </svg>
                </div>
                <div className={styles.catName}>{cat.name.toUpperCase()}</div>
                <div className={styles.catCount}>{cat._count?.products || 0} peças</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUE */}
      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>DESTAQUES</h2>
          <p className={styles.sectionSub}>PEÇAS MAIS DESEJADAS</p>
          <div className={styles.sectionLine} />
        </div>
        <div className={styles.productsGrid}>
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className={styles.seeAll}>
          <Link href="/produtos">
            <button className={styles.seeAllBtn}>VER TODA A COLEÇÃO</button>
          </Link>
        </div>
      </section>

      {/* INSTITUCIONAL */}
      <section className={styles.instSection}>
        <div className={styles.instContent}>
          <div className={styles.instTag}>NOSSA HISTÓRIA</div>
          <h2 className={styles.instTitle}>TRADIÇÃO E<br />ELEGÂNCIA<br />EM CADA PEÇA</h2>
          <div className={styles.instDivider} />
          <p className={styles.instText}>
            A Douratta nasceu da paixão por joias que transcendem o tempo. Cada peça é criada com dedicação artesanal, utilizando ouro 18k e pedras preciosas certificadas, para que você carregue consigo uma história única.
          </p>
          <Link href="/sobre">
            <button className={styles.instBtn}>CONHECER A MARCA</button>
          </Link>
        </div>
        <div className={styles.instImg}>
          <svg width="120" height="120" viewBox="0 0 120 120" opacity="0.3">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#c9a96e" strokeWidth="0.5"/>
            <circle cx="60" cy="60" r="35" fill="none" stroke="#c9a96e" strokeWidth="0.5"/>
            <circle cx="60" cy="60" r="20" fill="none" stroke="#c9a96e" strokeWidth="0.5"/>
            <circle cx="60" cy="60" r="8" fill="#c9a96e" fillOpacity="0.3"/>
          </svg>
        </div>
      </section>

      {/* PROMO */}
      <section className={styles.promo}>
        <div className={styles.promoTag}>OFERTA ESPECIAL</div>
        <h2 className={styles.promoTitle}>FRETE GRÁTIS</h2>
        <p className={styles.promoSub}>EM COMPRAS ACIMA DE R$ 500 · VÁLIDO ATÉ 31/03</p>
        <Link href="/produtos">
          <button className={styles.promoBtn}>APROVEITAR AGORA</button>
        </Link>
      </section>
    </div>
  )
}

export const getServerSideProps = async () => {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 4
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    })
  ])

  return {
    props: {
      featured: JSON.parse(JSON.stringify(featured)),
      categories: JSON.parse(JSON.stringify(categories))
    }
  }
}