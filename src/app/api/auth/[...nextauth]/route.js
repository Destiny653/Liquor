import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Authorize: Missing credentials");
          return null;
        }

        await connectDB();
        try {
          const email = credentials.email.toLowerCase().trim();
          console.log("Authorize: Checking user", email);
          const user = await User.findOne({ email });

          if (!user) {
            console.log("Authorize: User not found", email);
            return null;
          }

          if (!user.password && user.provider === 'google') {
            console.log("Authorize: User signed up with Google", email);
            // We return null here because credentials login isn't allowed for Google-only users
            return null;
          }

          if (!user.password) {
            console.log("Authorize: No password for user", email);
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            console.log("Authorize: Success for", email);
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.image
            };
          } else {
            console.log("Authorize: Password mismatch for", email);
            return null;
          }
        } catch (err) {
          console.error("Authorize: Unexpected error", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user._id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }

      // Refresh role from DB if missing (safety net)
      if (!token.role && token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectDB();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              name: user.name || user.email.split('@')[0],
              email: user.email.toLowerCase(),
              provider: 'google',
              role: 'user',
            });
            await newUser.save();
            user.role = 'user';
            user.id = newUser._id;
            return true;
          }
          user.role = existingUser.role;
          user._id = existingUser._id;
          return true;
        } catch (err) {
          console.error("Sign-in callback error:", err);
          return false;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };