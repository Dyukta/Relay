import Link from "next/link"
import { StatusBadge } from "@/shared/components/StatusBadge"
import { formatTime } from "@/shared/utils/formatTime"
import { formatDuration } from "@/shared/utils/formatDuration"
import type { RecentExecution } from "@/features/dashboard/types/dashboard.types"

interface RecentExecutionsPanelProps {
  executions: RecentExecution[]
}

export const RecentExecutionsPanel = ({
  executions,
}: RecentExecutionsPanelProps) => {
  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
        <div>
          <p className="text-white text-sm font-medium">Recent Executions</p>
          <p className="text-[#555] text-xs mt-0.5">
            Latest activity 
          </p>
        </div>
        <Link
          href="/app/executions"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="divide-y divide-[#1a1a1a]">
        {executions.length === 0 ? (
          <p className="text-[#555] text-sm text-center py-8">
            No executions yet
          </p>
        ) : (
          executions.map((execution) => (
            <Link
              key={execution.id}
              href={`/app/executions/${execution.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-[#ffffff04] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <StatusBadge status={execution.status as any} />
                <span className="text-white text-sm truncate">
                  {execution.workflowName}
                </span>
                <span className="text-[#444] text-xs font-mono hidden sm:block">
                  {execution.id.slice(0, 12)}
                </span>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="text-[#555] text-xs">
                  {execution.durationMs
                    ? formatDuration(execution.durationMs)
                    : "—"}
                </span>
                <span className="text-[#444] text-xs">
                  {formatTime(execution.startedAt)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}