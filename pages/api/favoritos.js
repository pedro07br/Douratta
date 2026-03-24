import prisma from '../../../services/prisma'
import { verifyToken } from '../../../services/auth'
import { getCookie } from 'cookies-next'

export default async function handler(req, res) {
  try {
    const token = getCookie('authorization', { req, res })
    if (!token) return res.status(401).json({ message: 'Não autorizado' })

    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { email: decoded.email } })
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

    if (req.method === 'GET') {
      const wishlist = await prisma.wishlist.findMany({
        where: { userId: user.id },
        include: { product: { include: { category: true } } },
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(wishlist)))
    }

    if (req.method === 'POST') {
      const existing = await prisma.wishlist.findFirst({
        where: { userId: user.id, productId: parseInt(body.productId) }
      })
      if (existing) {
        await prisma.wishlist.delete({ where: { id: existing.id } })
        return res.status(200).json({ action: 'removed' })
      }
      await prisma.wishlist.create({
        data: { userId: user.id, productId: parseInt(body.productId) }
      })
      return res.status(201).json({ action: 'added' })
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}