"use client"

import Link from "next/link"
import { useExecution } from "@/features/executions/hooks/useExecution"
import { ExecutionDetailHeader } from "@/features/executions/components/ExecutionDetailHeader"
import { ExecutionLogPanel } from "@/features/executions/components/ExecutionLogPanel"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"

interface ExecutionDetailPageProps {
  executionId: string
}

export const ExecutionDetailPage = ({
  executionId,
}: ExecutionDetailPageProps) => {
  const { execution, loading, error } = useExecution(executionId)

  if (loading) return <LoadingSpinner />

  if (error || !execution) {
    return (
      <div>
        <Link
          href="/app/executions"
          className="text-[#555] hover:text-white text-sm transition-colors"
        >
          ← Back to executions
        </Link>
        <p className="text-red-400 text-sm mt-4">
          {error ?? "Execution not found"}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/app/executions"
          className="text-[#555] hover:text-white text-sm transition-colors"
        >
          ← Back to executions
        </Link>
      </div>

      <ExecutionDetailHeader execution={execution} />

      {execution.payload &&
        Object.keys(execution.payload).length > 0 && (
          <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5 mb-4">
            <p className="text-white text-sm font-medium mb-3">
              Event Payload
            </p>
            <pre className="text-[#666] text-xs font-mono overflow-auto max-h-48">
              {JSON.stringify(execution.payload, null, 2)}
            </pre>
          </div>
        )}

      <ExecutionLogPanel logs={execution.logs} />
    </div>
  )
}