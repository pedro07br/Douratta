import prisma from '../../services/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  try {
    const categorias = await Promise.all([
      prisma.category.upsert({ where: { slug: 'aneis' },     update: {}, create: { name: 'Anéis',      slug: 'aneis'      } }),
      prisma.category.upsert({ where: { slug: 'colares' },   update: {}, create: { name: 'Colares',    slug: 'colares'    } }),
      prisma.category.upsert({ where: { slug: 'pulseiras' }, update: {}, create: { name: 'Pulseiras',  slug: 'pulseiras'  } }),
      prisma.category.upsert({ where: { slug: 'brincos' },   update: {}, create: { name: 'Brincos',    slug: 'brincos'    } }),
    ])

    const [aneis, colares, pulseiras, brincos] = categorias

    const produtos = [
      { name: 'Solitário Eterno',       slug: 'solitario-eterno',       price: 4890,  stock: 5,  categoryId: aneis.id      },
      { name: 'Star Safira Azul',       slug: 'star-safira-azul',       price: 8100,  stock: 3,  categoryId: aneis.id      },
      { name: 'Anel Esmeralda Royal',   slug: 'anel-esmeralda-royal',   price: 6200,  stock: 4,  categoryId: aneis.id      },
      { name: 'Pingente Aurora',        slug: 'pingente-aurora',        price: 2350,  stock: 8,  categoryId: colares.id    },
      { name: 'Choker Ouro 18k',        slug: 'choker-ouro-18k',        price: 12400, stock: 2,  categoryId: colares.id    },
      { name: 'Colar Pérolas Clássico', slug: 'colar-perolas-classico', price: 3800,  stock: 6,  categoryId: colares.id    },
      { name: 'Riviera Diamantes',      slug: 'riviera-diamantes',      price: 6720,  stock: 3,  categoryId: pulseiras.id  },
      { name: 'Pulseira Tennis Gold',   slug: 'pulseira-tennis-gold',   price: 5100,  stock: 5,  categoryId: pulseiras.id  },
      { name: 'Pulseira Charm Ouro',    slug: 'pulseira-charm-ouro',    price: 1980,  stock: 10, categoryId: pulseiras.id  },
      { name: 'Lágrima Pérola',         slug: 'lagrima-perola',         price: 1890,  stock: 7,  categoryId: brincos.id    },
      { name: 'Brinco Argola Dourada',  slug: 'brinco-argola-dourada',  price: 1200,  stock: 12, categoryId: brincos.id    },
      { name: 'Drop Diamante',          slug: 'drop-diamante',          price: 9500,  stock: 2,  categoryId: brincos.id    },
    ]

    for (const produto of produtos) {
      await prisma.product.upsert({
        where: { slug: produto.slug },
        update: {},
        create: {
          name:        produto.name,
          slug:        produto.slug,
          description: `${produto.name} — peça exclusiva da coleção Aurum, confeccionada em ouro 18k.`,
          price:       produto.price,
          stock:       produto.stock,
          active:      true,
          categoryId:  produto.categoryId,
        }
      })
    }

    res.status(201).json({
      message: 'Banco populado com sucesso!',
      categorias: categorias.length,
      produtos: produtos.length
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}