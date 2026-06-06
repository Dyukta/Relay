// src/shared/components/PageHeader.tsx
interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-white text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-[#666] text-sm mt-0.5">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}