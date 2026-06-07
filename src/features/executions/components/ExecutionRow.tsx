import Link from "next/link"
import { StatusBadge } from "@/shared/components/StatusBadge"
import { formatTime } from "@/shared/utils/formatTime"
import { formatDuration } from "@/shared/utils/formatDuration"
import type { ExecutionWithWorkflow } from "@/features/executions/types/execution.types"

interface ExecutionRowProps {
  execution: ExecutionWithWorkflow
}

export const ExecutionRow = ({ execution }: ExecutionRowProps) => {
  return (
    <Link
      href={`/app/executions/${execution.id}`}
      className="grid grid-cols-12 items-center px-4 py-3 hover:bg-[#ffffff04] transition-colors border-b border-[#1a1a1a] last:border-0"
    >
      <div className="col-span-3">
        <code className="text-[#666] text-xs">{execution.id.slice(0, 20)}</code>
      </div>

      <div className="col-span-3">
        <p className="text-white text-sm truncate">{execution.workflow.name}</p>
      </div>

      <div className="col-span-2">
        <StatusBadge status={execution.status as any} />
      </div>

      <div className="col-span-2">
        <span className="text-[#555] text-xs">
          {execution.durationMs ? formatDuration(execution.durationMs) : "—"}
        </span>
      </div>

      <div className="col-span-1">
        <span className="text-[#555] text-xs">
          {formatTime(execution.startedAt)}
        </span>
      </div>

      <div className="col-span-1 text-right">
        <span className="text-[#444] text-xs">
          {execution.completedAt ? formatTime(execution.completedAt) : "—"}
        </span>
      </div>
    </Link>
  )
}