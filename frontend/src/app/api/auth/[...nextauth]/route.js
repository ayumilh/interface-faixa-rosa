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
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
            email: credentials.email,
            password: credentials.password
          }, { withCredentials: true });

          if (response.status === 200 && response.data.user) {
            return response.data.user;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    // async signIn({ user, account }) {
    //   if (account.provider === 'google') {
    //     tempPassword = generateRandomPassword();
    //     const inputs = {
    //       email: user.email,
    //       senha: tempPassword
    //     };

    //     try {
    //       const loginResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, true, { withCredentials: true });
    //       console.log(loginResponse.data);
    //       Cookies.set('userId', JSON.stringify(loginResponse.data));
    //     } catch (registerError) {
    //       await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, inputs);
    //     }
    //   }

    //   return user;
    // },

    // async session({ session, token }) {
    //   if (token && token.provider === 'google') {
    //     session.user.password = tempPassword;
    //   }
    //   return session;
    // },

    session: async (session, user, token) => {
      session.user = user;
      if (token && token.provider === 'google') {
        session.user.password = tempPassword;
      }

      return session;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST, nextAuthOptions };