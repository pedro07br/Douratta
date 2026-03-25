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
      const cupons = await prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(cupons)))
    }

    if (req.method === 'POST') {
      const coupon = await prisma.coupon.create({
        data: {
          code:     body.code.toUpperCase(),
          type:     body.type,
          value:    parseFloat(body.value),
          maxUses:  parseInt(body.maxUses),
          active:   body.active ?? true
        }
      })
      return res.status(201).json(JSON.parse(JSON.stringify(coupon)))
    }

    if (req.method === 'PUT') {
      const coupon = await prisma.coupon.update({
        where: { id: parseInt(body.id) },
        data: {
          code:    body.code.toUpperCase(),
          type:    body.type,
          value:   parseFloat(body.value),
          maxUses: parseInt(body.maxUses),
          active:  body.active
        }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(coupon)))
    }

    if (req.method === 'DELETE') {
      await prisma.coupon.delete({ where: { id: parseInt(body.id) } })
      return res.status(200).json({ message: 'Cupom removido' })
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}