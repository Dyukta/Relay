import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { deleteAccount } from "@/features/settings/services/settingsService"
import { logger } from "@/lib/logger"

export const DELETE = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteAccount(session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Delete account error", { error })
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}