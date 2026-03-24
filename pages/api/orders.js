import prisma from '../../services/prisma'
import { verifyToken } from '../../services/auth'
import { getCookie } from 'cookies-next'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método não permitido' })

  try {
    const token = getCookie('authorization', { req, res })
    if (!token) return res.status(401).json({ message: 'Não autorizado' })

    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { email: decoded.email } })
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const order = await prisma.order.create({
      data: {
        total: body.total,
        status: 'PENDING',
        userId: user.id,
        items: {
          create: body.items.map(i => ({
            productId: i.productId,
            quantity:  i.quantity,
            price:     i.price
          }))
        }
      }
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}