import prisma from '../../../services/prisma'
import { verifyToken } from '../../../services/auth'
import { getCookie } from 'cookies-next'

export default async function handler(req, res) {
  try {
    const token = getCookie('authorization', { req, res })
    if (!token) return res.status(401).json({ message: 'Não autorizado' })

    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: { id: true, name: true, email: true, phone: true, cpf: true }
    })

    if (req.method === 'GET') {
      return res.status(200).json(user)
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          name:  body.name  || user.name,
          phone: body.phone || user.phone,
          cpf:   body.cpf   || user.cpf,
        },
        select: { id: true, name: true, email: true, phone: true, cpf: true }
      })
      return res.status(200).json(updated)
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}