import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDashboardData } from "@/features/dashboard/services/dashboardService"
import { logger } from "@/lib/logger"

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await getDashboardData(session.user.workspaceId)

    return NextResponse.json(data)
  } catch (error) {
    logger.error("Dashboard route error", { error })
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    )
  }
}