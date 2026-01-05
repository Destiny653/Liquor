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
        console.log("JWT Callback: Initial user object received.", { userId: user._id, userEmail: user.email, userRole: user.role });
        token.id = user._id ? user._id.toString() : user.id;
        token.role = user.role;
      }

      // If we don't have a role in the token, or we want to ensure it's up to date
      // we should fetch it. For performance, we can skip if it's already there
      // unless we want real-time role updates.
      if (!token.role) {
        console.log("JWT Callback: Role not found in token, fetching from DB.", { tokenEmail: token.email });
        await connectDB();
        // token.email should be available if user logged in
        if (token.email) {
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser._id.toString();
            console.log("JWT Callback: Role fetched from DB.", { dbUserRole: dbUser.role });
          } else {
            console.log("JWT Callback: User not found in DB for token email.", { tokenEmail: token.email });
          }
        }
      }
      console.log("JWT Callback: Returning token.", { tokenId: token.id, tokenRole: token.role });
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        console.log("Session Callback: Assigning role from token to session.", { sessionUserRole: session.user.role });
      }
      console.log("Session Callback: Returning session.", { sessionUserId: session.user.id, sessionUserEmail: session.user.email, sessionUserRole: session.user.role });
      return session;
    },
    async signIn({ user, account }) {
      console.log("SignIn Callback: Attempting sign-in.", { provider: account.provider, userEmail: user.email });
      if (account.provider === "google") {
        await connectDB();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            console.log("Creating new Google user:", user.email);
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
            console.log("New Google user created with role:", user.role);
            return true;
          }
          console.log("Google user sign-in:", user.email, "Role in DB:", existingUser.role);
          user.role = existingUser.role;
          user._id = existingUser._id;
          return true;
        } catch (err) {
          console.log("Error checking/creating user: ", err);
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