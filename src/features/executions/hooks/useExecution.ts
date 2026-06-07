"use client"

import { useEffect, useState } from "react"
import type { ExecutionDetail } from "@/features/executions/types/execution.types"

interface UseExecutionResult {
  execution: ExecutionDetail | null
  loading: boolean
  error: string | null
}

export const useExecution = (id: string): UseExecutionResult => {
  const [execution, setExecution] = useState<ExecutionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExecution = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/executions/${id}`)
        if (!res.ok) throw new Error("Execution not found")
        const data = await res.json()
        setExecution(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchExecution()
  }, [id])

  return { execution, loading, error }
}