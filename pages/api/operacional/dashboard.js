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

    const [totalOrders, totalRevenue, pendingOrders, paidOrders, shippedOrders, deliveredOrders, cancelledOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PAID' } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
    ])

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } }
      }
    })

    const lowStock = await prisma.product.findMany({
      where: { stock: { lte: 3 }, active: true },
      select: { id: true, name: true, stock: true, category: { select: { name: true } } },
      orderBy: { stock: 'asc' }
    })

    const last7days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })

    const orders7days = await prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: new Date(last7days[0]) }
      },
      select: { total: true, createdAt: true }
    })

    const receitaPorDia = last7days.map(day => ({
      day: day.slice(5),
      receita: orders7days
        .filter(o => o.createdAt.toISOString().split('T')[0] === day)
        .reduce((acc, o) => acc + parseFloat(o.total), 0)
    }))

    res.status(200).json(JSON.parse(JSON.stringify({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      paidOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      recentOrders,
      lowStock,
      receitaPorDia
    })))
  } catch (error) {
    res.status(error.message === 'Não autorizado' ? 401 : 500).json({ message: error.message })
  }
}