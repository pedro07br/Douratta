const { gerarSlug } = require('../services/slug')

describe('Geração de Slug', () => {
  test('gera slug a partir de nome simples', () => {
    expect(gerarSlug('Anel Dourado')).toBe('anel-dourado')
  })

  test('remove acentos corretamente', () => {
    expect(gerarSlug('Pulseira Clássica')).toBe('pulseira-classica')
  })

  test('remove caracteres especiais', () => {
    expect(gerarSlug('Colar Brinco')).toBe('colar-brinco')
  })

  test('converte para minúsculas', () => {
    expect(gerarSlug('ANEL OURO 18K')).toBe('anel-ouro-18k')
  })

  test('remove espaços extras', () => {
    expect(gerarSlug('Anel Prata')).toBe('anel-prata')
  })

  test('gera slug com números', () => {
    expect(gerarSlug('Anel 18k Ouro')).toBe('anel-18k-ouro')
  })
})