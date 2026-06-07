import { updateExecutionStatus, appendExecutionLog } from "@/features/executions/services/executionService"
import { logger } from "@/lib/logger"

interface WorkflowJob {
  executionId: string
  workflowId: string
  actionType: string
  actionConfig: Record<string, unknown>
  payload: Record<string, unknown>
}

export const processWorkflowJob = async (job: WorkflowJob) => {
  const { executionId, actionType, actionConfig, payload } = job
  const startedAt = Date.now()

  try {
    await updateExecutionStatus(executionId, "RUNNING")
    await appendExecutionLog(executionId, "INFO", "Worker picked up job")

    if (actionType === "SEND_EMAIL") {
      const { sendEmail } = await import("@/lib/actions/sendEmail")
      await sendEmail(executionId, actionConfig, payload)
    } else if (actionType === "FORWARD_WEBHOOK") {
      const { forwardWebhook } = await import("@/lib/actions/forwardWebhook")
      await forwardWebhook(executionId, actionConfig, payload)
    } else {
      throw new Error(`Unknown action type: ${actionType}`)
    }

    const durationMs = Date.now() - startedAt
    await updateExecutionStatus(executionId, "SUCCESS", durationMs)
    await appendExecutionLog(
      executionId,
      "SUCCESS",
      `Execution completed in ${durationMs}ms`
    )

    logger.success("Job completed", { executionId, durationMs })
  } catch (error) {
    const durationMs = Date.now() - startedAt
    const message = error instanceof Error ? error.message : "Unknown error"

    await updateExecutionStatus(executionId, "FAILED", durationMs)
    await appendExecutionLog(executionId, "ERROR", `Execution failed: ${message}`)

    logger.error("Job failed", { executionId, error: message })
  }
}