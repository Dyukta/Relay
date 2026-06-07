import { ExecutionRow } from "@/features/executions/components/ExecutionRow"
import { EmptyState } from "@/shared/components/EmptyState"
import type { ExecutionWithWorkflow } from "@/features/executions/types/execution.types"

interface ExecutionTableProps {
  executions: ExecutionWithWorkflow[]
}

export const ExecutionTable = ({ executions }: ExecutionTableProps) => {
  if (executions.length === 0) {
    return (
      <EmptyState
        title="No executions found"
        description="Executions will appear here once your workflows receive webhook events."
      />
    )
  }

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
      <div className="grid grid-cols-12 px-4 py-2.5 border-b border-[#1f1f1f]">
        <p className="col-span-3 text-[#444] text-xs font-medium uppercase tracking-wider">
          Execution ID
        </p>
        <p className="col-span-3 text-[#444] text-xs font-medium uppercase tracking-wider">
          Workflow
        </p>
        <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">
          Status
        </p>
        <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">
          Duration
        </p>
        <p className="col-span-1 text-[#444] text-xs font-medium uppercase tracking-wider">
          Started
        </p>
        <p className="col-span-1 text-right text-[#444] text-xs font-medium uppercase tracking-wider">
          Completed
        </p>
      </div>

      <div>
        {executions.map((execution) => (
          <ExecutionRow key={execution.id} execution={execution} />
        ))}
      </div>
    </div>
  )
}