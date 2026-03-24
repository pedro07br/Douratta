import prisma from '../../../services/prisma'
import { verifyToken } from '../../../services/auth'
import { getCookie } from 'cookies-next'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Método não permitido' })

  try {
    const token = getCookie('authorization', { req, res })
    if (!token) return res.status(401).json({ message: 'Não autorizado' })

    const decoded = verifyToken(token)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const user = await prisma.user.findUnique({ where: { email: decoded.email } })

    const senhaCorreta = await bcrypt.compare(body.currentPassword, user.password)
    if (!senhaCorreta) throw new Error('Senha atual incorreta')

    if (body.newPassword !== body.confirmPassword) throw new Error('As senhas não coincidem')

    const senhaHash = await bcrypt.hash(body.newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: senhaHash }
    })

    res.status(200).json({ message: 'Senha atualizada com sucesso' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}