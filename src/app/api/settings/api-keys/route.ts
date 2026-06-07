import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getApiKeys,
  createApiKey,
} from "@/features/settings/services/settingsService"
import { logger } from "@/lib/logger"

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const keys = await getApiKeys(session.user.workspaceId)
    return NextResponse.json(keys)
  } catch (error) {
    logger.error("Get API keys error", { error })
    return NextResponse.json(
      { error: "Failed to load API keys" },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Key name is required" },
        { status: 400 }
      )
    }

    const result = await createApiKey(session.user.workspaceId, body.name)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    logger.error("Create API key error", { error })
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    )
  }
}