import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Corrigido: importação nomeada do prisma
import jwt from "jsonwebtoken";

// Função para validar o JWT e extrair o ID do usuário
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token com a chave secreta
    return decoded;
  } catch (error) {
    return null;
  }
};

export async function GET(request) {
  const token = request.headers.get("Authorization")?.split(" ")[1]; // Extrai o token do header Authorization
  if (!token) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
  }

  const decoded = verifyToken(token); // Valida o token
  if (!decoded) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
  }

  try {
    // Busca o usuário no banco de dados pelo ID que foi armazenado no token
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId, // Assumindo que o ID do usuário está dentro do token
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Se o usuário for encontrado, retorne as informações necessárias
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.firstName,
        email: user.email,
        profileImage: user.profileImage, // Exemplo de campo de imagem do perfil
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar o usuário" }, { status: 500 });
  }
}
