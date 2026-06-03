import jwt from 'jsonwebtoken'

process.env.JWT_SECRET = 'test-secret'

// Importa a função real
const { verifyToken } = require('../services/auth')

describe('Auth Service', () => {
  test('verifica token JWT válido', () => {
    const token = jwt.sign({ email: 'test@test.com' }, 'test-secret')
    const decoded = verifyToken(token)
    expect(decoded.email).toBe('test@test.com')
  })

  test('lança erro para token inválido', () => {
    expect(() => verifyToken('token-invalido')).toThrow()
  })

  test('lança erro para token expirado', () => {
    const token = jwt.sign({ email: 'test@test.com' }, 'test-secret', { expiresIn: '-1s' })
    expect(() => verifyToken(token)).toThrow()
  })
})