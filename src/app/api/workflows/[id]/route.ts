import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getWorkflowById, deleteWorkflow, updateWorkflowStatus } from "@/features/workflows/services/workflowService"
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
    const workflow = await getWorkflowById(id, session.user.workspaceId)

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    return NextResponse.json(workflow)
  } catch (error) {
    logger.error("Get workflow error", { error })
    return NextResponse.json(
      { error: "Failed to load workflow" },
      { status: 500 }
    )
  }
}

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    if (!body.status || !["ACTIVE", "DISABLED"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    await updateWorkflowStatus(id, session.user.workspaceId, body.status)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Update workflow error", { error })
    return NextResponse.json(
      { error: "Failed to update workflow" },
      { status: 500 }
    )
  }
}

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.workspaceId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const workflow = await deleteWorkflow(id, session.user.workspaceId)

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Delete workflow error", { error })
    return NextResponse.json(
      { error: "Failed to delete workflow" },
      { status: 500 }
    )
  }
}