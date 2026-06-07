"use client"

import Link from "next/link"
import { useWorkflows } from "@/features/workflows/hooks/useWorkflows"
import { WorkflowTable } from "@/features/workflows/components/WorkflowTable"
import { PageHeader } from "@/shared/components/PageHeader"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"

export const WorkflowsPage = () => {
  const { workflows, loading, error } = useWorkflows()

  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Manage event-driven workflows in your workspace."
        actions={
          <Link
            href="/app/workflows/new"
            className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <span>+</span>
            <span>Create Workflow</span>
          </Link>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-400 text-sm">{error}</p>
      ) : (
        <WorkflowTable workflows={workflows} />
      )}
    </div>
  )
}