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
    const adminUser = await checkAdmin(req, res)
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

    if (req.method === 'GET') {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(users)))
    }

    if (req.method === 'PUT') {
      if (body.id === adminUser.id) return res.status(400).json({ message: 'Você não pode alterar seu próprio perfil' })
      const user = await prisma.user.update({
        where: { id: parseInt(body.id) },
        data: { role: body.role },
        select: { id: true, name: true, email: true, role: true }
      })
      return res.status(200).json(user)
    }

    if (req.method === 'DELETE') {
      if (body.id === adminUser.id) return res.status(400).json({ message: 'Você não pode remover sua própria conta' })
      await prisma.user.delete({ where: { id: parseInt(body.id) } })
      return res.status(200).json({ message: 'Usuário removido' })
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}