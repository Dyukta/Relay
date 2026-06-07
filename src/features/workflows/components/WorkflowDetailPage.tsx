"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useWorkflow } from "@/features/workflows/hooks/useWorkflow"
import { WebhookEndpointCard } from "@/features/workflows/components/WebhookEndpointCard"
import { WorkflowExecutionsTable } from "@/features/workflows/components/WorkflowExecutionsTable"
import { StatusBadge } from "@/shared/components/StatusBadge"
import { PageHeader } from "@/shared/components/PageHeader"
import { LoadingSpinner } from "@/shared/components/LoadingSpinner"
import { formatTime } from "@/shared/utils/formatTime"

interface WorkflowDetailPageProps {
  workflowId: string
}

export const WorkflowDetailPage = ({
  workflowId,
}: WorkflowDetailPageProps) => {
  const router = useRouter()
  const { workflow, loading, error, refetch } = useWorkflow(workflowId)

  const handleToggleStatus = async () => {
    if (!workflow) return

    const newStatus =
      workflow.status === "ACTIVE" ? "DISABLED" : "ACTIVE"

    await fetch(`/api/workflows/${workflowId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    refetch()
  }

  const handleDelete = async () => {
    if (!confirm("Delete this workflow? This cannot be undone.")) return

    await fetch(`/api/workflows/${workflowId}`, { method: "DELETE" })
    router.push("/app/workflows")
  }

  if (loading) return <LoadingSpinner />

  if (error || !workflow) {
    return (
      <div>
        <Link
          href="/app/workflows"
          className="text-[#555] hover:text-white text-sm transition-colors"
        >
          ← Back to workflows
        </Link>
        <p className="text-red-400 text-sm mt-4">
          {error ?? "Workflow not found"}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/app/workflows"
          className="text-[#555] hover:text-white text-sm transition-colors"
        >
          ← Back to workflows
        </Link>
      </div>

      <PageHeader
        title={workflow.name}
        description={`Created ${formatTime(workflow.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              className="text-sm text-[#666] hover:text-white border border-[#2a2a2a] hover:border-[#444] px-3 py-1.5 rounded-lg transition-colors"
            >
              {workflow.status === "ACTIVE" ? "Disable" : "Enable"}
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-3 mb-6 -mt-2">
        <StatusBadge status={workflow.status as any} />
        <span className="text-[#444] text-xs">
          {workflow._count.executions} total executions
        </span>
        <span className="text-[#444] text-xs">
          {workflow.actionType === "SEND_EMAIL"
            ? "Send Email"
            : "Forward Webhook"}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-1">
          <WebhookEndpointCard webhookId={workflow.webhookId} />
        </div>

        <div className="xl:col-span-2 bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
          <p className="text-white text-sm font-medium mb-4">
            Action Configuration
          </p>
          <div className="space-y-2">
            {Object.entries(workflow.actionConfig).map(([key, value]) => (
              <div key={key} className="flex gap-3">
                <span className="text-[#555] text-xs w-24 flex-shrink-0 pt-0.5">
                  {key}
                </span>
                <span className="text-[#888] text-xs break-all font-mono">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-white text-sm font-medium mb-3">
          Recent Executions
        </p>
        <WorkflowExecutionsTable executions={workflow.executions} />
      </div>
    </div>
  )
}