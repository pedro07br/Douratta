import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../../src/components/Navbar/Navbar'
import ProductCard from '../../src/components/productCard/ProductCard'
import styles from '../../src/components/ProductDetail/ProductDetail.module.css'
import prisma from '../../services/prisma'
import { useCart } from '../../src/context/CartContext'

export default function ProdutoDetalhe({ product, related }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(product.price)

  return (
    <div className="marble">
      <Navbar />

      <div className={styles.breadcrumb}>
        <Link href="/produtos">COLEÇÕES</Link>
        &nbsp;/&nbsp;
        <Link href={`/produtos?category=${product.category.id}`}>
          {product.category.name.toUpperCase()}
        </Link>
        &nbsp;/&nbsp;
        <span>{product.name.toUpperCase()}</span>
      </div>

      <div className={styles.detail}>
        <div className={styles.imgSide}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className={styles.image} />
          ) : (
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="60" fill="none" stroke="#9a7c4f" strokeWidth="1.5"/>
              <circle cx="80" cy="80" r="38" fill="none" stroke="#c9a96e" strokeWidth="0.8"/>
              <circle cx="80" cy="80" r="14" fill="#c9a96e" fillOpacity="0.5"/>
            </svg>
          )}
        </div>

        <div className={styles.infoSide}>
          <div className={styles.catLabel}>{product.category.name.toUpperCase()}</div>
          <h1 className={styles.prodName}>{product.name}</h1>
          <div className={styles.dividerGold} />
          <div className={styles.prodPrice}>{formatted}</div>
          <div className={styles.prodStock}>{product.stock} peças disponíveis</div>
          <p className={styles.prodDesc}>{product.description}</p>

          <div className={styles.qtyLabel}>QUANTIDADE</div>
          <div className={styles.qtyRow}>
            <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
            <span className={styles.qtyNum}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
          </div>

          <button className={styles.addBtn} onClick={() => addItem(product, quantity)}>+ ADICIONAR AO CARRINHO</button>
          <button className={styles.wishBtn}>♡ &nbsp; ADICIONAR À LISTA DE DESEJOS</button>
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.related}>
          <h2 className={styles.relatedTitle}>VOCÊ TAMBÉM PODE GOSTAR</h2>
          <p className={styles.relatedSub}>PEÇAS DA MESMA COLEÇÃO</p>
          <div className={styles.relatedDivider} />
          <div className={styles.relatedGrid}>
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async ({ params }) => {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true }
  })

  if (!product) {
    return { notFound: true }
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      active: true
    },
    include: { category: true },
    take: 4
  })

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      related: JSON.parse(JSON.stringify(related))
    }
  }
}