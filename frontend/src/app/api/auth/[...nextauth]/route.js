import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from 'axios';

let tempPassword = '';
const nextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials) return null
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password
            },
            {
              withCredentials: true,
              headers: { 'Content-Type': 'application/json' }
            }
          );

          console.log("Resposta do backend:", response.data);

          if (response.status === 200 && response.data.token) {
            return {
              id: res.data.user.id,
              name: `${res.data.user.firstName} ${res.data.user.lastName}`,
              email: res.data.user.email,
              token: res.data.token,
              userType: res.data.user.userType,
            };
          } else {
            return null;
          }
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Callback para JWT
    async jwt({ token, user }) {
      if (user) {
        // Adiciona o userType do backend ao token
        token.accessToken = user.token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.userType = user.userType; // Certifique-se de que o backend retorne `userType`
      }
      console.log("Token JWT gerado:", token);
      return token;
    },

    // Callback para sessão
    async session({ session, token }) {
      // Adiciona userType e outras informações do token à sessão
      session.accessToken = token.accessToken;
      session.user = {
        id: token.id,
        email: token.email,
        userType: token.userType,
        name: token.name,
      };
      console.log("Sessão ativa:", session);
      return session;
    },
    async signIn({ user, account }) {
      return true; // Confirme o login apenas se o `authorize` retornar o usuário
    },
    // async signIn({ user, account }) {
    //   if (account.provider === 'google') {
    //     try {
    //       const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
    //         email: user.email,
    //         googleLogin: true
    //       }, { withCredentials: true });

    //       if (response.status === 200 && response.data.token && response.data.user) {
    //         user.token = response.data.token; // Armazena o token no usuário
    //         user.userType = response.data.user.userType || "CONTRATANTE"; // Define userType padrão se não existir
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     } catch {
    //       return false;
    //     }
    //   }
    //   console.log("Tentando login com:", account?.provider, user);
    //   return true;
    // },
    session: async (session, user, token) => {
      session.user = user;
      if (token && token.provider === 'google') {
        session.user.password = tempPassword;
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };