import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getExecutions } from "@/features/executions/services/executionService"
import { logger } from "@/lib/logger"
import type { ExecutionStatus } from "@/features/executions/types/execution.types"

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") as ExecutionStatus | null

    const executions = await getExecutions(
      session.user.workspaceId,
      status ?? undefined
    )

    return NextResponse.json(executions)
  } catch (error) {
    logger.error("Get executions error", { error })
    return NextResponse.json(
      { error: "Failed to load executions" },
      { status: 500 }
    )
  }
}