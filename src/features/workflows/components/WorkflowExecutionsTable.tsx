import Link from "next/link"
import { StatusBadge } from "@/shared/components/StatusBadge"
import { formatTime } from "@/shared/utils/formatTime"
import { formatDuration } from "@/shared/utils/formatDuration"

interface Execution {
  id: string
  status: string
  durationMs: number | null
  startedAt: string
  completedAt: string | null
}

interface WorkflowExecutionsTableProps {
  executions: Execution[]
}

export const WorkflowExecutionsTable = ({
  executions,
}: WorkflowExecutionsTableProps) => {
  if (executions.length === 0) {
    return (
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-8 text-center">
        <p className="text-[#555] text-sm">No executions yet</p>
        <p className="text-[#444] text-xs mt-1">
          Send a POST request to your webhook endpoint to trigger this workflow.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
      <div className="grid grid-cols-12 px-4 py-2.5 border-b border-[#1f1f1f]">
        <p className="col-span-4 text-[#444] text-xs font-medium uppercase tracking-wider">
          Execution ID
        </p>
        <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">
          Status
        </p>
        <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">
          Duration
        </p>
        <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">
          Started
        </p>
        <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">
          Completed
        </p>
      </div>

      <div>
        {executions.map((execution) => (
          <Link
            key={execution.id}
            href={`/app/executions/${execution.id}`}
            className="grid grid-cols-12 items-center px-4 py-3 hover:bg-[#ffffff04] transition-colors border-b border-[#1a1a1a] last:border-0"
          >
            <div className="col-span-4">
              <code className="text-[#666] text-xs">
                {execution.id.slice(0, 20)}
              </code>
            </div>
            <div className="col-span-2">
              <StatusBadge status={execution.status as any} />
            </div>
            <div className="col-span-2">
              <span className="text-[#555] text-xs">
                {execution.durationMs
                  ? formatDuration(execution.durationMs)
                  : "—"}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[#555] text-xs">
                {formatTime(execution.startedAt)}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[#555] text-xs">
                {execution.completedAt
                  ? formatTime(execution.completedAt)
                  : "—"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}