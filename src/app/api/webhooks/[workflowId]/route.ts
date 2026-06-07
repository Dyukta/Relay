import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySignature } from "@/lib/hmac"
import { logger } from "@/lib/logger"
import { createExecution, appendExecutionLog, updateExecutionStatus } from "@/features/executions/services/executionService"

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) => {
  const { workflowId } = await params

  try {
   
    const workflow = await prisma.workflow.findUnique({
      where: { webhookId: workflowId },
      include: { workspace: true },
    })

    if (!workflow) {
      logger.warn("Webhook received for unknown workflow", { workflowId })
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      )
    }

    if (workflow.status !== "ACTIVE") {
      logger.warn("Webhook received for inactive workflow", {
        workflowId,
        status: workflow.status,
      })
      return NextResponse.json(
        { error: "Workflow is not active" },
        { status: 400 }
      )
    }

    const rawBody = await req.text()

    const signature = req.headers.get("x-relay-signature")

    if (signature) {
      const isValid = verifySignature(
        rawBody,
        signature,
        workflow.workspace.signingSecret
      )

      if (!isValid) {
        logger.warn("Invalid webhook signature", { workflowId })
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        )
      }
    }

    let payload: unknown = {}
    try {
      payload = JSON.parse(rawBody)
    } catch {
      logger.warn("Webhook received non-JSON payload", { workflowId })
    }

    const execution = await createExecution(workflow.id, payload)

    await appendExecutionLog(
      execution.id,
      "INFO",
      `Event received from ${req.headers.get("x-forwarded-for") ?? "unknown"}`
    )

    await updateExecutionStatus(execution.id, "QUEUED")

    await appendExecutionLog(
      execution.id,
      "INFO",
      `Job queued for workflow: ${workflow.name}`
    )

  
    const { processWorkflowJob } = await import("@/lib/worker")

    processWorkflowJob({
      executionId: execution.id,
      workflowId: workflow.id,
      actionType: workflow.actionType,
      actionConfig: workflow.actionConfig as Record<string, unknown>,
      payload: payload as Record<string, unknown>,
    }).catch((err) => {
      logger.error("Background job failed", { executionId: execution.id, err })
    })

    logger.info("Webhook accepted", {
      executionId: execution.id,
      workflowId: workflow.id,
    })

    return NextResponse.json(
      { received: true, executionId: execution.id },
      { status: 202 }
    )
  } catch (error) {
    logger.error("Webhook route error", { error, workflowId })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}