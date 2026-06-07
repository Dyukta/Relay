import Link from "next/link"
import { StatusBadge } from "@/shared/components/StatusBadge"
import { formatTime } from "@/shared/utils/formatTime"
import { formatDuration } from "@/shared/utils/formatDuration"
import type { ExecutionDetail } from "@/features/executions/types/execution.types"

interface ExecutionDetailHeaderProps {
  execution: ExecutionDetail
}

export const ExecutionDetailHeader = ({
  execution,
}: ExecutionDetailHeaderProps) => {
  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={execution.status as any} />
            {execution.durationMs && (
              <span className="text-[#555] text-xs">
                Completed in {formatDuration(execution.durationMs)}
              </span>
            )}
          </div>
          <p className="text-white text-sm font-medium mt-2">
            {execution.workflow.name}
          </p>
        </div>
        <Link
          href={`/app/workflows/${execution.workflow.id}`}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View workflow →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#1a1a1a]">
        <div>
          <p className="text-[#444] text-xs mb-0.5">Execution ID</p>
          <code className="text-[#666] text-xs">{execution.id}</code>
        </div>
        <div>
          <p className="text-[#444] text-xs mb-0.5">Started</p>
          <p className="text-[#666] text-xs">{formatTime(execution.startedAt)}</p>
        </div>
        <div>
          <p className="text-[#444] text-xs mb-0.5">Completed</p>
          <p className="text-[#666] text-xs">
            {execution.completedAt
              ? formatTime(execution.completedAt)
              : "In progress"}
          </p>
        </div>
        <div>
          <p className="text-[#444] text-xs mb-0.5">Workflow ID</p>
          <code className="text-[#666] text-xs">{execution.workflowId}</code>
        </div>
      </div>
    </div>
  )
}