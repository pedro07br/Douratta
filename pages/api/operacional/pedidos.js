import prisma from '../../../services/prisma'
import { verifyToken } from '../../../services/auth'
import { getCookie } from 'cookies-next'

async function checkOperator(req, res) {
  const token = getCookie('op_token', { req, res })
  if (!token) throw new Error('Não autorizado')
  const decoded = verifyToken(token)
  if (!['ADMIN', 'OPERATOR'].includes(decoded.role)) throw new Error('Acesso negado')
  return decoded
}

export default async function handler(req, res) {
  try {
    await checkOperator(req, res)
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

    if (req.method === 'GET') {
      const { status, search, page = 1 } = req.query
      const where = {}
      if (status && status !== 'ALL') where.status = status
      if (search) {
        where.OR = [
          { user: { name: { contains: search } } },
          { user: { email: { contains: search } } },
        ]
      }

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: { select: { name: true, imageUrl: true } } } },
            coupon: { select: { code: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
          skip: (parseInt(page) - 1) * 20
        }),
        prisma.order.count({ where })
      ])

      return res.status(200).json(JSON.parse(JSON.stringify({ orders, total, pages: Math.ceil(total / 20) })))
    }

    if (req.method === 'PUT') {
      const order = await prisma.order.update({
        where: { id: parseInt(body.id) },
        data: { status: body.status }
      })

      if (body.status === 'CANCELLED') {
        const items = await prisma.orderItem.findMany({ where: { orderId: parseInt(body.id) } })
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