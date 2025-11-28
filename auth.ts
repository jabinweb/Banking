import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
import { signInSchema } from "@/lib/zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials)

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              profile: true,
              accounts: true
            }
          })

          if (!user) {
            throw new Error("Invalid credentials")
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password)

          if (!isValidPassword) {
            throw new Error("Invalid credentials")
          }

          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone || undefined
          }
        } catch (error) {
          if (error instanceof ZodError) {
            return null
          }
          throw error
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.phone = (user as any).phone
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.phone = token.phone as string | undefined
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
})
