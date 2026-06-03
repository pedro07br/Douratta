const { aplicarCupom } = require('../services/coupon')

describe('Lógica de Cupons', () => {
  test('aplica desconto de porcentagem corretamente', () => {
    const coupon = { type: 'PERCENTAGE', value: 10, active: true, usedCount: 0, maxUses: 100 }
    expect(aplicarCupom(1000, coupon)).toBe(900)
  })

  test('aplica desconto fixo corretamente', () => {
    const coupon = { type: 'FIXED', value: 50, active: true, usedCount: 0, maxUses: 100 }
    expect(aplicarCupom(200, coupon)).toBe(150)
  })

  test('desconto fixo não resulta em valor negativo', () => {
    const coupon = { type: 'FIXED', value: 500, active: true, usedCount: 0, maxUses: 100 }
    expect(aplicarCupom(100, coupon)).toBe(0)
  })

  test('frete grátis não altera o total', () => {
    const coupon = { type: 'FREESHIP', value: 0, active: true, usedCount: 0, maxUses: 100 }
    expect(aplicarCupom(300, coupon)).toBe(300)
  })

  test('lança erro para cupom inativo', () => {
    const coupon = { type: 'PERCENTAGE', value: 10, active: false, usedCount: 0, maxUses: 100 }
    expect(() => aplicarCupom(1000, coupon)).toThrow('Cupom inválido ou esgotado')
  })

  test('lança erro para cupom esgotado', () => {
    const coupon = { type: 'PERCENTAGE', value: 10, active: true, usedCount: 100, maxUses: 100 }
    expect(() => aplicarCupom(1000, coupon)).toThrow('Cupom inválido ou esgotado')
  })
})