import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getExecutionById } from "@/features/executions/services/executionService"
import { logger } from "@/lib/logger"

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const execution = await getExecutionById(id, session.user.workspaceId)

    if (!execution) {
      return NextResponse.json(
        { error: "Execution not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(execution)
  } catch (error) {
    logger.error("Get execution error", { error })
    return NextResponse.json(
      { error: "Failed to load execution" },
      { status: 500 }
    )
  }
}