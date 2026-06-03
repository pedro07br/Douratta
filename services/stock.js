export const validarEstoque = (product, quantity) => {
  if (!product) throw new Error('Produto não encontrado')
  if (product.stock < quantity) throw new Error(`Estoque insuficiente para ${product.name}`)
  return true
}

export const decrementarEstoque = (stock, quantity) => stock - quantity
export const incrementarEstoque = (stock, quantity) => stock + quantity