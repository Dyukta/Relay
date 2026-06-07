"use client"

import { useEffect, useState } from "react"
import type { DashboardData } from "@/features/dashboard/types/dashboard.types"

interface UseDashboardResult {
  data: DashboardData | null
  loading: boolean
  error: string | null
}

export const useDashboard = (): UseDashboardResult => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard")

        if (!res.ok) {
          throw new Error("Failed to load dashboard")
        }

        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  return { data, loading, error }
}