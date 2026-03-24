import prisma from '../../../services/prisma'
import { verifyToken } from '../../../services/auth'
import { getCookie } from 'cookies-next'

export default async function handler(req, res) {
  try {
    const token = getCookie('authorization', { req, res })
    if (!token) return res.status(401).json({ message: 'Não autorizado' })
    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { email: decoded.email } })
    if (user.role !== 'ADMIN') return res.status(403).json({ message: 'Acesso negado' })

    const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, _count: true }),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.findMany({
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    res.status(200).json({
      revenue: totalOrders._sum.total || 0,
      orders: totalOrders._count,
      users: totalUsers,
      products: totalProducts,
      recentOrders: JSON.parse(JSON.stringify(orders))
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}