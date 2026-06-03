const { validarEstoque, decrementarEstoque, incrementarEstoque } = require('../services/stock')

describe('Controle de Estoque', () => {
  test('valida estoque suficiente', () => {
    const product = { id: 1, name: 'Anel', stock: 10 }
    expect(validarEstoque(product, 5)).toBe(true)
  })

  test('lança erro para estoque insuficiente', () => {
    const product = { id: 1, name: 'Anel', stock: 2 }
    expect(() => validarEstoque(product, 5)).toThrow('Estoque insuficiente para Anel')
  })

  test('lança erro para produto não encontrado', () => {
    expect(() => validarEstoque(null, 1)).toThrow('Produto não encontrado')
  })

  test('decrementa estoque ao criar pedido', () => {
    expect(decrementarEstoque(10, 3)).toBe(7)
  })

  test('incrementa estoque ao cancelar pedido', () => {
    expect(incrementarEstoque(7, 3)).toBe(10)
  })

  test('estoque não fica negativo', () => {
    expect(decrementarEstoque(5, 5)).toBe(0)
  })
})