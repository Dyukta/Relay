import { PrismaClient } from "@prisma/client"

const createPrismaClient = () => {
  if (process.env.NODE_ENV === "production") {
    const { PrismaNeon } = require("@prisma/adapter-neon")
    const { neonConfig } = require("@neondatabase/serverless")
    const ws = require("ws")
    neonConfig.webSocketConstructor = ws
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL!,
    })
    return new PrismaClient({ adapter })
  }

  const { PrismaPg } = require("@prisma/adapter-pg")
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}