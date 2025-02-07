import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          });
          const user = await response.json();
          if (response.ok && user) {
            return user;
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
    jwt: true,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        domain: ".faixarosa.com",
        httpOnly: true,
        sameSite: "None",
        secure: true,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      token.accessToken = user.token;
      token.id = user.id;
      token.name = user.name;
      token.email = user.email;
      token.userType = user.userType;

      console.log("Token JWT gerado:", token);
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        userType: token.userType,
        name: token.name,
      };
      return session;
    },
    async signIn({ user, account }) {
      return true; // Confirme o login apenas se o `authorize` retornar o usuário
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
    session: async (session, user, token) => {
      session.user = user;
      if (token && token.provider === 'google') {
        session.user.password = tempPassword;
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };