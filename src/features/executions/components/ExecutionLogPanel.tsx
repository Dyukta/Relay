import { ExecutionLogEntry } from "@/features/executions/components/ExecutionLogEntry"
import type { ExecutionLog } from "@/features/executions/types/execution.types"

interface ExecutionLogPanelProps {
  logs: ExecutionLog[]
}

export const ExecutionLogPanel = ({ logs }: ExecutionLogPanelProps) => {
  return (
    <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4">
      <p className="text-white text-sm font-medium mb-3">Execution Logs</p>
      {logs.length === 0 ? (
        <p className="text-[#444] text-xs">No logs available.</p>
      ) : (
        <div>
          {logs.map((log) => (
            <ExecutionLogEntry key={log.id} log={log} />
          ))}
        </div>
      )}
    </div>
  )
}