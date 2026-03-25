import prisma from '../../../services/prisma'
import { verifyToken } from '../../../services/auth'
import { getCookie } from 'cookies-next'

async function checkAdmin(req, res) {
  const token = getCookie('authorization', { req, res })
  if (!token) throw new Error('Não autorizado')
  const decoded = verifyToken(token)
  const user = await prisma.user.findUnique({ where: { email: decoded.email } })
  if (user.role !== 'ADMIN') throw new Error('Acesso negado')
  return user
}

export default async function handler(req, res) {
  try {
    await checkAdmin(req, res)
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

    if (req.method === 'GET') {
      const orders = await prisma.order.findMany({
        where: { status: { in: ['PENDING', 'PAID'] } },
        include: {
          user: { select: { name: true, email: true } },
          items: {
            include: { product: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(orders)))
    }

    if (req.method === 'PUT') {
      const order = await prisma.order.update({
        where: { id: parseInt(body.id) },
        data: { status: body.status }
      })

      // Se negar, devolve o estoque
      if (body.status === 'CANCELLED') {
        const items = await prisma.orderItem.findMany({
          where: { orderId: parseInt(body.id) }
        })
        for (const item of items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }
          })
        }
      }

      return res.status(200).json(JSON.parse(JSON.stringify(order)))
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}