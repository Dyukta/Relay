import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getSigningSecret,
  regenerateSigningSecret,
} from "@/features/settings/services/settingsService"
import { logger } from "@/lib/logger"

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await getSigningSecret(session.user.workspaceId)
    return NextResponse.json(result)
  } catch (error) {
    logger.error("Get signing secret error", { error })
    return NextResponse.json(
      { error: "Failed to load signing secret" },
      { status: 500 }
    )
  }
}

export const POST = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await regenerateSigningSecret(session.user.workspaceId)
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Regenerate signing secret error", { error })
    return NextResponse.json(
      { error: "Failed to regenerate secret" },
      { status: 500 }
    )
  }
}