import { WorkflowRow } from "@/features/workflows/components/WorkflowRow"
import { EmptyState } from "@/shared/components/EmptyState"
import type { WorkflowSummary } from "@/features/workflows/hooks/useWorkflows"

interface WorkflowTableProps {
  workflows: WorkflowSummary[]
}

export const WorkflowTable = ({ workflows }: WorkflowTableProps) => {
  if (workflows.length === 0) {
    return (
      <EmptyState
        title="No workflows yet"
        description="Create your first workflow to start receiving and processing webhook events."
      />
    )
  }

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl overflow-hidden">
      <div className="grid grid-cols-12 px-4 py-2.5 border-b border-[#1f1f1f]">
        <p className="col-span-4 text-[#444] text-xs font-medium uppercase tracking-wider">
          Name
        </p>
        <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">
          Trigger
        </p>
        <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">
          Action
        </p>
        <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">
          Status
        </p>
        <p className="col-span-2 text-right text-[#444] text-xs font-medium uppercase tracking-wider">
          Last Run
        </p>
      </div>

      <div>
        {workflows.map((workflow) => (
          <WorkflowRow key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </div>
  )
}