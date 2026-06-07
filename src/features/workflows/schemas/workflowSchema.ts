import { z } from "zod"

export const sendEmailConfigSchema = z.object({
  recipient: z.string().email("Please enter a valid recipient email"),
  subject: z.string().min(1, "Subject is required"),
  template: z.string().min(1, "Message template is required"),
})

export const forwardWebhookConfigSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  headers: z.record(z.string(), z.string()).optional(),
})

export const createWorkflowSchema = z.object({
  name: z
    .string()
    .min(1, "Workflow name is required")
    .max(100, "Name must be less than 100 characters"),
  actionType: z.enum(["SEND_EMAIL", "FORWARD_WEBHOOK"]),
  actionConfig: z.union([sendEmailConfigSchema, forwardWebhookConfigSchema]),
})

export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>