import prisma from '../../services/prisma'

export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

    if (req.method === 'POST') {
      const coupon = await prisma.coupon.findUnique({
        where: { code: body.code.toUpperCase() }
      })

      if (!coupon) return res.status(404).json({ message: 'Cupom não encontrado' })
      if (!coupon.active) return res.status(400).json({ message: 'Cupom inativo' })
      if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'Cupom esgotado' })

      return res.status(200).json(JSON.parse(JSON.stringify(coupon)))
    }

    res.status(405).json({ message: 'Método não permitido' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}