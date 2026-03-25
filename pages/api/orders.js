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

    // Valida estoque
    for (const item of body.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) return res.status(400).json({ message: `Produto ${item.productId} não encontrado` })
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Estoque insuficiente para ${product.name}` })
      }
    }

    // Valida e aplica cupom
    let couponId = null
    let discount = 0
    let finalTotal = parseFloat(body.total)

    if (body.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: body.couponCode.toUpperCase() }
      })

      if (!coupon || !coupon.active || coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ message: 'Cupom inválido ou esgotado' })
      }

      couponId = coupon.id

      if (coupon.type === 'PERCENTAGE') {
        discount = finalTotal * (parseFloat(coupon.value) / 100)
      } else if (coupon.type === 'FIXED') {
        discount = parseFloat(coupon.value)
      } else if (coupon.type === 'FREESHIP') {
        discount = 0 // frete já é grátis, apenas registra
      }

      finalTotal = Math.max(0, finalTotal - discount)

      // Incrementa uso do cupom
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } }
      })
    }

    const order = await prisma.order.create({
      data: {
        total:    finalTotal,
        discount: discount > 0 ? discount : null,
        status:   'PENDING',
        userId:   user.id,
        couponId: couponId,
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

    // Diminui estoque
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