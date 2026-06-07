import { formatTime } from "@/shared/utils/formatTime"
import type { ApiKey } from "@/features/settings/hooks/useApiKeys"

interface ApiKeyRowProps {
  apiKey: ApiKey
  onRevoke: (id: string) => void
}

export const ApiKeyRow = ({ apiKey, onRevoke }: ApiKeyRowProps) => {
  return (
    <div className="grid grid-cols-12 items-center px-4 py-3 border-b border-[#1a1a1a] last:border-0">
      <div className="col-span-3">
        <p className="text-white text-sm">{apiKey.name}</p>
      </div>
      <div className="col-span-4">
        <code className="text-[#555] text-xs">{apiKey.keyPreview}</code>
      </div>
      <div className="col-span-2">
        <p className="text-[#555] text-xs">{formatTime(apiKey.createdAt)}</p>
      </div>
      <div className="col-span-2">
        <p className="text-[#555] text-xs">
          {apiKey.lastUsedAt ? formatTime(apiKey.lastUsedAt) : "Never"}
        </p>
      </div>
      <div className="col-span-1 flex justify-end">
        <button
          onClick={() => onRevoke(apiKey.id)}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Revoke
        </button>
      </div>
    </div>
  )
}