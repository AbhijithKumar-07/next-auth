// import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import User from "@/models/User";
// import connectDB from "@/config/db";
// import { signIn } from "next-auth/react";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credientals",
//       name: "credientals",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "email",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },

//       async authorize(credentials) {
//         await connectDB();
//         try {
//           const user = await User.findOne({ email: credentials.email });

//           if (user) {
//             const isPasswordCorrect = await bcrypt.compare(
//               credentials.password,
//               user.password
//             );

//             if (isPasswordCorrect) {
//               return user;
//             }
//           }
//         } catch (error) {
//           throw new Error(error);
//         }
//       },
//     }),
//   ],

//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider == "credientals") {
//         return true;
//       }
//     },
//   },
// };

// export const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };











import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/config/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials", // Fixed typo
      name: "Credentials", // Fixed typo
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        try {
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User not found");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          return { id: user._id, email: user.email };
        } catch (error) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Ensure you have a login page
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

