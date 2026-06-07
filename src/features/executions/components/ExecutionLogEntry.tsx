import { cn } from "@/shared/utils/cn"
import type { ExecutionLog } from "@/features/executions/types/execution.types"

interface ExecutionLogEntryProps {
  log: ExecutionLog
}

const levelConfig: Record<string, string> = {
  INFO: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  SUCCESS: "text-green-400 bg-green-500/10 border-green-500/20",
  ERROR: "text-red-400 bg-red-500/10 border-red-500/20",
  WARN: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
}

export const ExecutionLogEntry = ({ log }: ExecutionLogEntryProps) => {
  const time = new Date(log.timestamp).toISOString().split("T")[1].slice(0, 12)
  const levelClass = levelConfig[log.level] ?? levelConfig.INFO

  return (
    <div className="flex items-start gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
     <span className="text-[#444] text-xs font-mono shrink-0 pt-0.5">
        {time}
      </span>
      <span
        className={cn(
          "text-xs px-1.5 py-0.5 rounded border font-medium shrink-0",
          levelClass
        )}
      >
        {log.level}
      </span>
      <span className="text-[#888] text-xs font-mono">{log.message}</span>
    </div>
  )
}