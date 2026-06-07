"use client"

import { useEffect, useState } from "react"

export interface WorkflowSummary {
  id: string
  name: string
  actionType: string
  status: string
  webhookId: string
  createdAt: string
  updatedAt: string
  _count: { executions: number }
  executions: { startedAt: string; status: string }[]
}

interface UseWorkflowsResult {
  workflows: WorkflowSummary[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useWorkflows = (): UseWorkflowsResult => {
  const [workflows, setWorkflows] = useState<WorkflowSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/workflows")
        if (!res.ok) throw new Error("Failed to load workflows")
        const data = await res.json()
        setWorkflows(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [tick])

  return {
    workflows,
    loading,
    error,
    refetch: () => setTick((t) => t + 1)
  }
}