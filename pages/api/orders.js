import prisma from '../../services/prisma'
import { verifyToken } from '../../services/auth'
import { getCookie } from 'cookies-next'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método não permitido' })

  try {
    const token = getCookie('authorization', { req, res })
    if (!token) return res.status(401).json({ message: 'Não autorizado' })

    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { email: decoded.email } })
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    console.log('BODY RECEBIDO:', JSON.stringify(body))

    // Valida estoque antes de criar o pedido
    for (const item of body.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) return res.status(400).json({ message: `Produto ${item.productId} não encontrado` })
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Estoque insuficiente para ${product.name}` })
      }
    }

    // Cria o pedido com todos os itens
    const order = await prisma.order.create({
      data: {
        total: parseFloat(body.total),
        status: 'PENDING',
        userId: user.id,
        items: {
          create: body.items.map(i => ({
            productId: parseInt(i.productId),
            quantity:  parseInt(i.quantity),
            price:     parseFloat(i.price)
          }))
        }
      },
      include: { items: true }
    })

    // Diminui o estoque de cada produto
    for (const item of body.items) {
      await prisma.product.update({
        where: { id: parseInt(item.productId) },
        data: { stock: { decrement: parseInt(item.quantity) } }
      })
    }

    res.status(201).json(order)
  } catch (error) {
    console.error('ERRO ORDER:', error)
    res.status(500).json({ message: error.message })
  }
}