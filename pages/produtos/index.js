import { useState } from "react";
import Navbar from "../../src/components/Navbar/Navbar";
import ProductCard from "../../src/components/productCard/ProductCard";
import ProductCardSkeleton from "../../src/components/productCard/ProductCardSkeleton";
import styles from "../../src/components/ProductList/ProductList.module.css";
import prisma from "../../services/prisma";

export default function Produtos({ products, categories }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);
  const [sort, setSort] = useState("relevancia");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 12;

  const filtered = products
    .filter((p) => !category || p.category?.id === category)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "menor") return a.price - b.price;
      if (sort === "maior") return b.price - a.price;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <div className="marble">
      <Navbar />

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>NOSSA COLEÇÃO</h1>
        <p className={styles.heroSub}>
          JOIAS EXCLUSIVAS · OURO 18K · DIAMANTES CERTIFICADOS
        </p>
        <div className={styles.divider} />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.controls}>
          <input
            className={styles.search}
            type="text"
            placeholder="BUSCAR JOIAS..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <button
            className={!category ? styles.filterBtnActive : styles.filterBtn}
            onClick={() => { setCategory(null); setPage(1); }}
          >
            TODOS
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              className={category === cat.id ? styles.filterBtnActive : styles.filterBtn}
              onClick={() => { setCategory(cat.id); setPage(1); }}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}

          <select
            className={styles.sort}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="relevancia">ORDENAR: RELEVÂNCIA</option>
            <option value="menor">MENOR PREÇO</option>
            <option value="maior">MAIOR PREÇO</option>
          </select>
        </div>

        <div className={styles.grid}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : paginated.length > 0 ? (
            paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className={styles.empty}>NENHUM PRODUTO ENCONTRADO</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={page === n ? styles.pageBtnActive : styles.pageBtn}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            {page < totalPages && (
              <button
                className={styles.pageBtn}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, stock: { gt: 0 } },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
};