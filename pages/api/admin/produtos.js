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
      const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(products)))
    }

    if (req.method === 'POST') {
      const product = await prisma.product.create({
        data: {
          name:        body.name,
          slug:        body.slug,
          description: body.description,
          price:       parseFloat(body.price),
          stock:       parseInt(body.stock),
          imageUrl:    body.imageUrl || null,
          active:      body.active ?? true,
          categoryId:  parseInt(body.categoryId)
        },
        include: { category: true }
      })
      return res.status(201).json(JSON.parse(JSON.stringify(product)))
    }

    if (req.method === 'PUT') {
      const product = await prisma.product.update({
        where: { id: parseInt(body.id) },
        data: {
          name:        body.name,
          slug:        body.slug,
          description: body.description,
          price:       parseFloat(body.price),
          stock:       parseInt(body.stock),
          imageUrl:    body.imageUrl || null,
          active:      body.active ?? true,
          categoryId:  parseInt(body.categoryId)
        },
        include: { category: true }
      })
      return res.status(200).json(JSON.parse(JSON.stringify(product)))
    }

    if (req.method === 'DELETE') {
      await prisma.product.delete({ where: { id: parseInt(body.id) } })
      return res.status(200).json({ message: 'Produto removido' })
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(error.message === 'Não autorizado' ? 401 : 500).json({ message: error.message })
  }
}