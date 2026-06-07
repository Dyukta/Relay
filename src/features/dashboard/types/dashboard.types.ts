export interface DashboardStats {
  totalWorkflows: number
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  successRate: number
  avgDurationMs: number
}

export interface WorkflowHealth {
  active: number
  disabled: number
  failures24h: number
}

export interface RecentExecution {
  id: string
  workflowId: string
  workflowName: string
  status: string
  durationMs: number | null
  startedAt: Date
}

export interface RecentFailure {
  id: string
  workflowName: string
  startedAt: Date
}

export interface DashboardData {
  stats: DashboardStats
  health: WorkflowHealth
  recentExecutions: RecentExecution[]
  recentFailures: RecentFailure[]
}