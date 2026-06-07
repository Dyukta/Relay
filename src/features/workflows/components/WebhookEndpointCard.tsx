import { CopyButton } from "@/shared/components/CopyButton"
import { generateEndpointUrl } from "@/features/workflows/utils/generateEndpointUrl"

interface WebhookEndpointCardProps {
  webhookId: string
}

export const WebhookEndpointCard = ({
  webhookId,
}: WebhookEndpointCardProps) => {
  const endpointUrl = generateEndpointUrl(webhookId)

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
      <p className="text-white text-sm font-medium mb-1">Webhook Endpoint</p>
      <p className="text-[#555] text-xs mb-4">
        Point any service at this URL to trigger this workflow.
      </p>

      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono">
            POST
          </span>
          <code className="text-[#888] text-xs truncate">{endpointUrl}</code>
          <CopyButton value={endpointUrl} />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[#555] text-xs">HMAC-SHA256 signed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[#555] text-xs">Automatic retries with exponential backoff</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[#555] text-xs">Full execution history</span>
        </div>
      </div>
    </div>
  )
}