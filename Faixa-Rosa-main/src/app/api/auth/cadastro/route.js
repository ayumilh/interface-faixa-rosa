// src/app/api/auth/cadastro/route.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Função helper para validar CPF (opcional, mas recomendada)
function isValidCPF(cpf) {
  // Implementar validação de CPF conforme necessário
  // Retorna true se válido, false caso contrário
  // Aqui está uma implementação simples
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(cpf.charAt(10));
}

export async function POST(request) {
  try {
    const { firstName, lastName, email, password, phone, cpf, userType } = await request.json();

    // Validação básica dos campos
    if (!firstName || !lastName || !email || !password || !phone || !cpf || !userType) {
      return new Response(JSON.stringify({ message: "Todos os campos são obrigatórios" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validação do tipo de usuário
    if (!["CONTRATANTE", "ACOMPANHANTE"].includes(userType)) {
      return new Response(JSON.stringify({ message: "Tipo de usuário inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validação do CPF
    if (!isValidCPF(cpf)) {
      return new Response(JSON.stringify({ message: "CPF inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verifica se o email já está em uso
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return new Response(JSON.stringify({ message: "Email já está em uso" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verifica se o CPF já está em uso
    const existingUserByCpf = await prisma.user.findUnique({
      where: { cpf },
    });

    if (existingUserByCpf) {
      return new Response(JSON.stringify({ message: "CPF já está em uso" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Cria um hash para a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        cpf,
        userType,
      },
    });

    // Retorna uma resposta de sucesso
    return new Response(
      JSON.stringify({
        message: "Usuário cadastrado com sucesso",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return new Response(JSON.stringify({ message: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
