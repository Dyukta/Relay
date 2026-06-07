import { cn } from "@/shared/utils/cn"

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  highlight?: boolean
}

export const StatCard = ({ label, value, sub, highlight }: StatCardProps) => {
  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
      <p className="text-[#666] text-xs font-medium uppercase tracking-wider mb-3">
        {label}
      </p>
      <p
        className={cn(
          "text-2xl font-semibold",
          highlight ? "text-indigo-400" : "text-white"
        )}
      >
        {value}
      </p>
      {sub && <p className="text-[#555] text-xs mt-1">{sub}</p>}
    </div>
  )
}