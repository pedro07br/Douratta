import { cadastrarUsuario } from "../../../services/user";

export default async function handler(req, res) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const token = await cadastrarUsuario(body)
    res.status(201).json(token)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}