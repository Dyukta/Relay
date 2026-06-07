"use client"

import { cn } from "@/shared/utils/cn"
import type { ExecutionStatus } from "@/features/executions/types/execution.types"

type FilterValue = ExecutionStatus | undefined

interface Tab {
  label: string
  value: FilterValue
}

const tabs: Tab[] = [
  { label: "All", value: undefined },
  { label: "Success", value: "SUCCESS" },
  { label: "Failed", value: "FAILED" },
  { label: "Pending", value: "PENDING" },
  { label: "Retrying", value: "RETRYING" },
]

interface ExecutionFilterTabsProps {
  active: FilterValue
  onChange: (value: FilterValue) => void
}

export const ExecutionFilterTabs = ({
  active,
  onChange,
}: ExecutionFilterTabsProps) => {
  return (
    <div className="flex items-center gap-1 bg-[#111111] border border-[#1f1f1f] rounded-lg p-1 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            active === tab.value
              ? "bg-indigo-500 text-white"
              : "text-[#666] hover:text-white"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}