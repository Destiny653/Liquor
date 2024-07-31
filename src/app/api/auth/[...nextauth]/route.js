import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

 const handler = NextAuth  ({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  secret:process.env.NEXTAUTH_SECRET,
  url:process.env.NEXTAUTH_URL
})

export  {handler as GET, handler as POST}