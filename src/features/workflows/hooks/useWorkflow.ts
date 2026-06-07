"use client"

import { useEffect, useState } from "react"

export interface WorkflowDetail {
  id: string
  name: string
  actionType: string
  actionConfig: Record<string, unknown>
  status: string
  webhookId: string
  createdAt: string
  updatedAt: string
  _count: { executions: number }
  executions: {
    id: string
    status: string
    durationMs: number | null
    startedAt: string
    completedAt: string | null
  }[]
}

interface UseWorkflowResult {
  workflow: WorkflowDetail | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useWorkflow = (id: string): UseWorkflowResult => {
  const [workflow, setWorkflow] = useState<WorkflowDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const fetchWorkflow = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/workflows/${id}`)
        if (!res.ok) throw new Error("Workflow not found")
        const data = await res.json()
        setWorkflow(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflow()
  }, [id, tick])

  return {
    workflow,
    loading,
    error,
    refetch: () => setTick((t) => t + 1)
  }
}