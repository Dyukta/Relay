import Link from "next/link"
import { StatusBadge } from "@/shared/components/StatusBadge"
import { formatTime } from "@/shared/utils/formatTime"
import type { WorkflowSummary } from "@/features/workflows/hooks/useWorkflows"

interface WorkflowRowProps {
  workflow: WorkflowSummary
}

export const WorkflowRow = ({ workflow }: WorkflowRowProps) => {
  const lastExecution = workflow.executions[0] ?? null

  return (
    <Link
      href={`/app/workflows/${workflow.id}`}
      className="grid grid-cols-12 items-center px-4 py-3 hover:bg-[#ffffff04] transition-colors border-b border-[#1a1a1a] last:border-0"
    >
      <div className="col-span-4">
        <p className="text-white text-sm font-medium">{workflow.name}</p>
        <p className="text-[#444] text-xs font-mono mt-0.5">
          {workflow.id.slice(0, 16)}
        </p>
      </div>

      <div className="col-span-2">
        <span className="text-[#666] text-xs bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded">
          Webhook
        </span>
      </div>

      <div className="col-span-2">
        <span className="text-[#666] text-xs">
          {workflow.actionType === "SEND_EMAIL"
            ? "Send Email"
            : "Forward Webhook"}
        </span>
      </div>

      <div className="col-span-2">
        <StatusBadge status={workflow.status as any} />
      </div>

      <div className="col-span-2 text-right">
        <p className="text-[#555] text-xs">
          {lastExecution ? formatTime(lastExecution.startedAt) : "Never"}
        </p>
      </div>
    </Link>
  )
}