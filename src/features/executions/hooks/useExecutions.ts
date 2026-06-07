"use client"

import { useEffect, useState } from "react"
import type {
  ExecutionWithWorkflow,
  ExecutionStatus,
} from "@/features/executions/types/execution.types"

interface UseExecutionsResult {
  executions: ExecutionWithWorkflow[]
  loading: boolean
  error: string | null
}

export const useExecutions = (
  status?: ExecutionStatus
): UseExecutionsResult => {
  const [executions, setExecutions] = useState<ExecutionWithWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        setLoading(true)
        const url = status
          ? `/api/executions?status=${status}`
          : "/api/executions"
        const res = await fetch(url)
        if (!res.ok) throw new Error("Failed to load executions")
        const data = await res.json()
        setExecutions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchExecutions()
  }, [status])

  return { executions, loading, error }
}