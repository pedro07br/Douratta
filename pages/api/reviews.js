import prisma from '../../services/prisma'
import { verifyToken } from '../../services/auth'
import { getCookie } from 'cookies-next'

export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

    if (req.method === 'GET') {
      const reviews = await prisma.review.findMany({
        where: { productId: parseInt(req.query.productId) },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(reviews)))
    }

    if (req.method === 'POST') {
      const token = getCookie('authorization', { req, res })
      if (!token) return res.status(401).json({ message: 'Faça login para avaliar' })

      const decoded = verifyToken(token)
      const user = await prisma.user.findUnique({ where: { email: decoded.email } })

      // Verifica se já avaliou
      const existing = await prisma.review.findFirst({
        where: { userId: user.id, productId: parseInt(body.productId) }
      })
      if (existing) return res.status(400).json({ message: 'Você já avaliou este produto' })

      const review = await prisma.review.create({
        data: {
          rating:    parseInt(body.rating),
          comment:   body.comment,
          userId:    user.id,
          productId: parseInt(body.productId)
        },
        include: { user: { select: { name: true } } }
      })
      return res.status(201).json(JSON.parse(JSON.stringify(review)))
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}