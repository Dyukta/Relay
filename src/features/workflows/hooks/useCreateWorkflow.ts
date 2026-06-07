"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { CreateWorkflowInput } from "@/features/workflows/schemas/workflowSchema"

interface UseCreateWorkflowResult {
  create: (input: CreateWorkflowInput) => Promise<void>
  loading: boolean
  error: string | null
}

export const useCreateWorkflow = (): UseCreateWorkflowResult => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (input: CreateWorkflowInput) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Failed to create workflow")
        return
      }

      router.push(`/app/workflows/${data.id}`)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}