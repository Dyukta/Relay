import { cn } from "@/shared/utils/cn"

type Status =
  | "PENDING"
  | "QUEUED"
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "RETRYING"
  | "ACTIVE"
  | "DISABLED"
  | "ERROR"

interface StatusBadgeProps {
  status: Status
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
  },
  QUEUED: {
    label: "Queued",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  RUNNING: {
    label: "Running",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  SUCCESS: {
    label: "Success",
    className: "bg-green-500/10 text-green-400 border-green-500/20"
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-500/10 text-red-400 border-red-500/20"
  },
  RETRYING: {
    label: "Retrying",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20"
  },
  ACTIVE: {
    label: "Active",
    className: "bg-green-500/10 text-green-400 border-green-500/20"
  },
  DISABLED: {
    label: "Disabled",
    className: "bg-[#ffffff0f] text-[#666] border-[#ffffff10]"
  },
  ERROR: {
    label: "Error",
    className: "bg-red-500/10 text-red-400 border-red-500/20"
  },
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
        config.className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}