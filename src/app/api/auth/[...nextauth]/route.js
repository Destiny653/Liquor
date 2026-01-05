import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
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
        await connectDB();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            if (user.provider === 'google') {
              throw new Error("This email is registered with Google. Please sign in with Google.");
            }
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            } else {
              throw new Error("Wrong Credentials!");
            }
          } else {
            throw new Error("User not found!");
          }
        } catch (err) {
          throw new Error(err.message || err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // This block runs only on the first sign-in (or when 'user' is passed)
        token.id = user._id ? user._id.toString() : user.id;
        token.role = user.role;
      }

      // If we don't have a role in the token, or we want to ensure it's up to date
      // we should fetch it. For performance, we can skip if it's already there
      // unless we want real-time role updates.
      if (!token.role) {
        await connectDB();
        // token.email should be available if user logged in
        if (token.email) {
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser._id.toString();
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
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
              email: user.email,
              provider: 'google',
              role: 'user', // Explicitly 'user'
            });
            await newUser.save();
            // Manually attach fields to user object to be picked up by jwt callback immediately
            user.role = 'user';
            user._id = newUser._id;
            return true;
          }
          user.role = existingUser.role;
          user._id = existingUser._id;
          return true;
        } catch (err) {
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  url: process.env.NEXTAUTH_URL,
});

export { handler as GET, handler as POST };