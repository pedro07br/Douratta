import { PrismaClient } from '../generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL)
const prisma = new PrismaClient({ adapter })

const SECRET = process.env.JWT_SECRET

function createToken(user) {
  return jwt.sign({ email: user.email, name: user.name }, SECRET)
}

export async function cadastrarUsuario(body) {
  const userExiste = await prisma.user.findUnique({
    where: { email: body.email }
  })

  if (userExiste) throw new Error('Usuário já cadastrado')

  const senhaHash = await bcrypt.hash(body.password, 10)

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: senhaHash
    }
  })

  return createToken(user)
}

export async function loginUsuario(body) {
  const user = await prisma.user.findUnique({
    where: { email: body.email }
  })

  if (!user) throw new Error('Usuário não encontrado')

  const senhaCorreta = await bcrypt.compare(body.password, user.password)
  if (!senhaCorreta) throw new Error('Senha incorreta')

  return createToken(user)
}