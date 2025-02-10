import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

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
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log("Autenticando no NextAuth:", credentials);
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`, {
            email: credentials.email,
            password: credentials.password
          }, { withCredentials: true });

          const user = res.data;
          console.log("Usuário autenticado pelo backend:", user);

          if (!user.token) {
            console.error("Erro: Nenhum token recebido do backend.");
            return null;
          }

          return {
            id: user.user.id,
            name: `${user.user.firstName} ${user.user.lastName}`,
            email: user.user.email,
            userType: user.user.userType || "CONTRATANTE",
            token: user.token,
          };
        } catch (error) {
          console.error("Erro ao autenticar no backend:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.userType = user.userType || "CONTRATANTE";
        console.log("Token JWT gerado:", token);
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        userType: token.userType,
        name: token.name,
        accessToken: token.accessToken,
      };
      return session;
    },
    async signIn({ user, account }) {
      return true;
    },
    // async signIn({ user, account }) {
    //   if (account.provider === 'google') {
    //     try {
    //       const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`, {
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
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };