// src/app/api/auth/login/route.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Função helper para gerar o JWT
function generateJWT(user) {
  const payload = {
    id: user.id,
    email: user.email,
    userType: user.userType,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token válido por 1 hora
  });

  return token;
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validação básica dos campos
    if (!email || !password) {
      return NextResponse.json(
        { message: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    // Busca o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Retorna erro genérico para não expor informações sobre a existência do email
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Compara a senha fornecida com a hash armazenada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Retorna erro genérico para não expor informações sobre a existência do email
      return NextResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // Gera o JWT
    const token = generateJWT(user);

    // Retorna o token na resposta
    return NextResponse.json(
      {
        message: "Login realizado com sucesso.",
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
