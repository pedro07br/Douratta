import prisma from '../../../services/prisma'
import { sign } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { setCookie } from 'cookies-next'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método não permitido' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const user = await prisma.user.findUnique({ where: { email: body.email } })

    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' })

    const valid = await bcrypt.compare(body.password, user.password)
    if (!valid) return res.status(401).json({ message: 'Credenciais inválidas' })

    if (user.role !== 'OPERATOR' && user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso não autorizado para este painel' })
    }

    const token = sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    setCookie('op_token', token, { req, res, maxAge: 60 * 60 * 8, httpOnly: true })

    res.status(200).json({ message: 'Login realizado', user: { name: user.name, role: user.role } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}