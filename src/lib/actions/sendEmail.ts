import { appendExecutionLog } from "@/features/executions/services/executionService"
import { logger } from "@/lib/logger"

const interpolate = (
  template: string,
  payload: Record<string, unknown>
): string => {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const keys = key.trim().split(".")
    let value: unknown = payload
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return value !== undefined ? String(value) : `{{${key}}}`
  })
}

export const sendEmail = async (
  executionId: string,
  config: Record<string, unknown>,
  payload: Record<string, unknown>
) => {
  const recipient = config.recipient as string
  const subject = interpolate(config.subject as string, payload)
  const body = interpolate(config.template as string, payload)

  await appendExecutionLog(
    executionId,
    "INFO",
    `Sending email to ${recipient}`
  )

  const resendKey = process.env.RESEND_API_KEY

  if (!resendKey) {
    await appendExecutionLog(
      executionId,
      "INFO",
      `[DEV] Email skipped — no RESEND_API_KEY set. Would send: "${subject}" to ${recipient}`
    )
    logger.info("Email skipped in dev : no RESEND_API_KEY", {
      recipient,
      subject,
    })
    return
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Relay <noreply@relay.dev>",
      to: recipient,
      subject,
      text: body,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Resend error: ${error}`)
  }

  await appendExecutionLog(
    executionId,
    "SUCCESS",
    `Email delivered to ${recipient}`
  )

  logger.success("Email sent", { recipient, subject })
}