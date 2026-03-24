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
      const addresses = await prisma.address.findMany({
        where: { userId: user.id },
        orderBy: { isMain: 'desc' }
      })
      return res.status(200).json(addresses)
    }

    if (req.method === 'POST') {
      const address = await prisma.address.create({
        data: { ...body, userId: user.id }
      })
      return res.status(201).json(address)
    }

    if (req.method === 'DELETE') {
      await prisma.address.delete({ where: { id: Number(body.id) } })
      return res.status(200).json({ message: 'Endereço removido' })
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}