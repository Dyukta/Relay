// src/features/auth/services/registerService.ts
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { generateSecret } from "@/lib/hmac"
import { logger } from "@/lib/logger"
import type { RegisterInput } from "@/features/auth/schemas/registerSchema"

interface RegisterResult {
  success: boolean
  error?: string
  userId?: string
}

export const registerUser = async (
  input: RegisterInput
): Promise<RegisterResult> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  })

  if (existingUser) {
    logger.warn("Registration attempt with existing email", {
      email: input.email,
    })
    return {
      success: false,
      error: "An account with this email already exists"
    }
  }

  const passwordHash = await hash(input.password, 12)
  const signingSecret = generateSecret()

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      workspace: {
        create: {
          signingSecret
        }
      }
    }
  })

  logger.info("New user registered", { userId: user.id, email: user.email })

  return {
    success: true,
    userId: user.id
  }
}