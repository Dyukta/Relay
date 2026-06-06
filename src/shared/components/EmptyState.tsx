// src/shared/components/EmptyState.tsx
interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-white text-sm font-medium">{title}</p>
      {description && (
        <p className="text-[#666] text-xs mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}