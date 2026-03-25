import prisma from "../../../services/prisma";
import { verifyToken } from "../../../services/auth";
import { getCookie } from "cookies-next";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Método não permitido" });

  try {
    const token = getCookie("authorization", { req, res });
    if (!token) return res.status(401).json({ message: "Não autorizado" });

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(JSON.parse(JSON.stringify(orders)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
