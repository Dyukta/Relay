import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getWorkflows, createWorkflow } from "@/features/workflows/services/workflowService"
import { createWorkflowSchema } from "@/features/workflows/schemas/workflowSchema"
import { logger } from "@/lib/logger"

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workflows = await getWorkflows(session.user.workspaceId)

    return NextResponse.json(workflows)
  } catch (error) {
    logger.error("Get workflows error", { error })
    return NextResponse.json(
      { error: "Failed to load workflows" },
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
    const parsed = createWorkflowSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const workflow = await createWorkflow(
      session.user.workspaceId,
      parsed.data
    )

    return NextResponse.json(workflow, { status: 201 })
  } catch (error) {
    logger.error("Create workflow error", { error })
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 }
    )
  }
}