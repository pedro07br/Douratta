import prisma from "../../../services/prisma";
import { verifyToken } from "../../../services/auth";
import { getCookie } from "cookies-next";

async function checkAdmin(req, res) {
  const token = getCookie("authorization", { req, res });
  if (!token) throw new Error("Não autorizado");
  const decoded = verifyToken(token);
  const user = await prisma.user.findUnique({
    where: { email: decoded.email },
  });
  if (user.role !== "ADMIN") throw new Error("Acesso negado");
  return user;
}

export default async function handler(req, res) {
  try {
    await checkAdmin(req, res);
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};

    if (req.method === "GET") {
      const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      });
      return res.status(200).json(JSON.parse(JSON.stringify(categories)));
    }

    if (req.method === "POST") {
      const category = await prisma.category.create({
        data: {
          name: body.name,
          slug: body.slug,
          imageUrl: body.imageUrl || null,
        },
      });
      return res.status(201).json(category);
    }

    if (req.method === "PUT") {
      const category = await prisma.category.update({
        where: { id: parseInt(body.id) },
        data: {
          name: body.name,
          slug: body.slug,
          imageUrl: body.imageUrl || null,
        },
      });
      return res.status(200).json(category);
    }

    if (req.method === "DELETE") {
      await prisma.category.delete({ where: { id: parseInt(body.id) } });
      return res.status(200).json({ message: "Categoria removida" });
    }

    res.status(405).json({ message: "Método não permitido" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
