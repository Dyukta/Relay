export type WorkflowStatus = "ACTIVE" | "DISABLED" | "ERROR"
export type ActionType = "SEND_EMAIL" | "FORWARD_WEBHOOK"

export interface SendEmailConfig {
  recipient: string
  subject: string
  template: string
}

export interface ForwardWebhookConfig {
  url: string
  headers?: Record<string, string>
}

export type ActionConfig = SendEmailConfig | ForwardWebhookConfig

export interface Workflow {
  id: string
  workspaceId: string
  name: string
  actionType: ActionType
  actionConfig: ActionConfig
  status: WorkflowStatus
  webhookId: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowWithStats extends Workflow {
  _count: {
    executions: number
  }
  lastExecution?: {
    startedAt: Date
    status: string
  } | null
}

export interface CreateWorkflowInput {
  name: string
  actionType: ActionType
  actionConfig: ActionConfig
}