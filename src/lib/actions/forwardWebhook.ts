import { appendExecutionLog } from "@/features/executions/services/executionService"
import { logger } from "@/lib/logger"

export const forwardWebhook = async (
  executionId: string,
  config: Record<string, unknown>,
  payload: Record<string, unknown>
) => {
  const targetUrl = config.url as string

  await appendExecutionLog(
    executionId,
    "INFO",
    `Forwarding payload to ${targetUrl}`
  )

  const res = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Relay-Forwarded": "true",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(
      `Target URL responded with ${res.status}: ${res.statusText}`
    )
  }

  await appendExecutionLog(
    executionId,
    "SUCCESS",
    `Payload forwarded : received ${res.status}`
  )

  logger.success("Webhook forwarded", { targetUrl, status: res.status })
}