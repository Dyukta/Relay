import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/login"
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logger.warn("Login attempt with missing credentials")
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { workspace: true },
        })

        if (!user) {
          logger.warn("Login attempt for non-existent user", {
            email: credentials.email,
          })
          return null
        }

        const isValid = await compare(credentials.password, user.passwordHash)

        if (!isValid) {
          logger.warn("Login attempt with invalid password", {
            email: credentials.email
          })
          return null
        }

        logger.info("User authenticated", { userId: user.id })

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          workspaceId: user.workspace?.id ?? null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.workspaceId = (user as any).workspaceId
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.workspaceId = token.workspaceId as string
      }
      return session
    },
  },
}