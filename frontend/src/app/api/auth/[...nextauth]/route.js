import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const options = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
            { email: credentials.email, password: credentials.password },
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
          );

          const user = res.data;
          if (!user.token) return null;

          return {
            id: user.user.id,
            name: `${user.user.firstName} ${user.user.lastName}`,
            email: user.user.email,
            userType: user.user.userType || "CONTRATANTE",
            accessToken: user.token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { ...token };
      return session;
    },
    async signIn() {
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  csrf: false,
};

const handler = NextAuth(options);

// exporta apenas os handlers HTTP
export { handler as GET, handler as POST };
