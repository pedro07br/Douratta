// services/coupon.js
export const aplicarCupom = (total, coupon) => {
  if (!coupon || !coupon.active || coupon.usedCount >= coupon.maxUses) {
    throw new Error('Cupom inválido ou esgotado')
  }
  if (coupon.type === 'PERCENTAGE') {
    return total - (total * (coupon.value / 100))
  }
  if (coupon.type === 'FIXED') {
    return Math.max(0, total - coupon.value)
  }
  if (coupon.type === 'FREESHIP') {
    return total
  }
  return total
}