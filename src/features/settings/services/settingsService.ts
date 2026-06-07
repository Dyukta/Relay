import { prisma } from "@/lib/prisma"
import { generateSecret, generateApiKey } from "@/lib/hmac"
import { hash } from "bcryptjs"
import { logger } from "@/lib/logger"

export const getProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  })
}

export const updateProfile = async (
  userId: string,
  data: { name: string; email: string }
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true },
  })
}

export const getApiKeys = async (workspaceId: string) => {
  return prisma.apiKey.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPreview: true,
      createdAt: true,
      lastUsedAt: true,
    },
  })
}

export const createApiKey = async (workspaceId: string, name: string) => {
  const { raw, preview } = generateApiKey()
  const keyHash = await hash(raw, 10)

  await prisma.apiKey.create({
    data: { workspaceId, name, keyHash, keyPreview: preview },
  })

  logger.info("API key created", { workspaceId, name })

  return { raw }
}

export const revokeApiKey = async (keyId: string, workspaceId: string) => {
  const key = await prisma.apiKey.findFirst({
    where: { id: keyId, workspaceId },
  })

  if (!key) return null

  await prisma.apiKey.delete({ where: { id: keyId } })

  logger.info("API key revoked", { keyId, workspaceId })

  return key
}

export const getSigningSecret = async (workspaceId: string) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { signingSecret: true },
  })

  if (!workspace) return null

  const secret = workspace.signingSecret
  const preview = `${secret.slice(0, 10)}${"•".repeat(24)}${secret.slice(-4)}`

  return { preview }
}

export const regenerateSigningSecret = async (workspaceId: string) => {
  const newSecret = generateSecret()

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { signingSecret: newSecret },
  })

  logger.info("Signing secret regenerated", { workspaceId })

  return { success: true }
}

export const deleteAccount = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } })
  logger.info("Account deleted", { userId })
}