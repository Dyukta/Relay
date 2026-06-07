export type ExecutionStatus =
  | "PENDING"
  | "QUEUED"
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "RETRYING"

export interface ExecutionLog {
  id: string
  executionId: string
  level: string
  message: string
  timestamp: string
}

export interface Execution {
  id: string
  workflowId: string
  status: ExecutionStatus
  durationMs: number | null
  payload: Record<string, unknown> | null
  startedAt: string
  completedAt: string | null
}

export interface ExecutionWithWorkflow extends Execution {
  workflow: {
    id: string
    name: string
  }
}

export interface ExecutionDetail extends ExecutionWithWorkflow {
  logs: ExecutionLog[]
}