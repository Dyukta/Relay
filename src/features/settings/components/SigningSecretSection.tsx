"use client"

import { useState } from "react"

interface SigningSecretSectionProps {
  preview: string
  onRegenerated: () => void
}

export const SigningSecretSection = ({
  preview,
  onRegenerated,
}: SigningSecretSectionProps) => {
  const [loading, setLoading] = useState(false)

  const handleRegenerate = async () => {
    if (
      !confirm(
        "Regenerate signing secret? Existing webhooks using the old secret will fail."
      )
    )
      return

    setLoading(true)
    await fetch("/api/settings/signing-secret", { method: "POST" })
    setLoading(false)
    onRegenerated()
  }

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
      <p className="text-white text-sm font-medium mb-0.5">Webhook Security</p>
      <p className="text-[#555] text-xs mb-4">
        Rotate the secret used to sign incoming webhook events.
      </p>

      <div className="flex items-center justify-between bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-4 py-3">
        <div>
          <p className="text-[#555] text-xs mb-1">Endpoint signing secret</p>
          <code className="text-[#666] text-xs">{preview}</code>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="text-xs text-[#666] hover:text-white border border-[#2a2a2a] hover:border-[#444] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Regenerating..." : "↻ Regenerate"}
        </button>
      </div>
    </div>
  )
}