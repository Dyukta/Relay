"use client"

import { useState } from "react"
import { useExecutions } from "@/features/executions/hooks/useExecutions"
import { ExecutionTable } from "@/features/executions/components/ExecutionTable"
import { ExecutionFilterTabs } from "@/features/executions/components/ExecutionFilterTabs"
import { PageHeader } from "@/shared/components/PageHeader"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import type { ExecutionStatus } from "@/features/executions/types/execution.types"

export const ExecutionsPage = () => {
  const [filter, setFilter] = useState<ExecutionStatus | undefined>(undefined)
  const { executions, loading, error } = useExecutions(filter)

  return (
    <div>
      <PageHeader
        title="Executions"
        description="Inspect workflow runs and diagnose failures across your workspace."
      />

      <div className="mb-4">
        <ExecutionFilterTabs active={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <ExecutionTable executions={executions} />
      )}
    </div>
  )
}