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
      const products = await prisma.product.findMany({
        include: { category: { select: { name: true } } },
        orderBy: { stock: 'asc' }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(products)))
    }

    if (req.method === 'PUT') {
      const product = await prisma.product.update({
        where: { id: parseInt(body.id) },
        data: { stock: { increment: parseInt(body.quantidade) } }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(product)))
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}