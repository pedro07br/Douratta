import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch (error) {
    throw new Error('Token inválido')
  }
}