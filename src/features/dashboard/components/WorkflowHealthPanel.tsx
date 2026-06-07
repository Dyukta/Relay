import type { WorkflowHealth, RecentFailure } from "@/features/dashboard/types/dashboard.types"
import { formatTime } from "@/shared/utils/formatTime"

interface WorkflowHealthPanelProps {
  health: WorkflowHealth
  recentFailures: RecentFailure[]
}

export const WorkflowHealthPanel = ({
  health,
  recentFailures,
}: WorkflowHealthPanelProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
        <p className="text-white text-sm font-medium mb-1">Workflow Health</p>
        <p className="text-[#555] text-xs mb-4">
          Current state of your workspace
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[#666] text-xs">Active</span>
            </div>
            <p className="text-white text-xl font-semibold">{health.active}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#444]" />
              <span className="text-[#666] text-xs">Disabled</span>
            </div>
            <p className="text-white text-xl font-semibold">
              {health.disabled}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-[#666] text-xs">Failures 24h</span>
            </div>
            <p className="text-white text-xl font-semibold">
              {health.failures24h}
            </p>
          </div>
        </div>
      </div>

      {recentFailures.length > 0 && (
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
          <p className="text-white text-sm font-medium mb-3">Recent Failures</p>
          <div className="space-y-3">
            {recentFailures.map((failure) => (
              <div key={failure.id}>
                <p className="text-white text-xs font-medium">
                  {failure.workflowName}
                </p>
                <p className="text-[#555] text-xs mt-0.5">
                  {failure.id.slice(0, 16)} · {formatTime(failure.startedAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}