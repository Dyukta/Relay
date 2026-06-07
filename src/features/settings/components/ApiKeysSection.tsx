"use client"

import { useState } from "react"
import { useApiKeys } from "@/features/settings/hooks/useApiKeys"
import { ApiKeyRow } from "@/features/settings/components/ApiKeyRow"
import { CopyButton } from "@/shared/components/CopyButton"

export const ApiKeysSection = () => {
  const { keys, loading, newKey, create, revoke, clearNewKey } = useApiKeys()
  const [newKeyName, setNewKeyName] = useState("")
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!newKeyName.trim()) return
    setCreating(true)
    await create(newKeyName.trim())
    setNewKeyName("")
    setCreating(false)
  }

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
        <div>
          <p className="text-white text-sm font-medium">API Keys</p>
          <p className="text-[#555] text-xs mt-0.5">
            Use API keys to authenticate requests to the Relay API.
          </p>
        </div>
      </div>

      {newKey && (
        <div className="mx-5 mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 text-xs font-medium mb-2">
            API key created. Copy it now — it will not be shown again.
          </p>
          <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded px-3 py-1.5">
            <code className="text-white text-xs flex-1 truncate">{newKey}</code>
            <CopyButton value={newKey} />
          </div>
          <button
            onClick={clearNewKey}
            className="text-xs text-[#555] hover:text-white mt-2 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-[#555] text-xs p-5">Loading...</p>
      ) : keys.length === 0 ? (
        <p className="text-[#555] text-xs p-5 text-center">No API keys yet.</p>
      ) : (
        <div>
          <div className="grid grid-cols-12 px-4 py-2 border-b border-[#1f1f1f]">
            <p className="col-span-3 text-[#444] text-xs font-medium uppercase tracking-wider">Name</p>
            <p className="col-span-4 text-[#444] text-xs font-medium uppercase tracking-wider">Key</p>
            <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">Created</p>
            <p className="col-span-2 text-[#444] text-xs font-medium uppercase tracking-wider">Last used</p>
            <p className="col-span-1" />
          </div>
          {keys.map((key) => (
            <ApiKeyRow key={key.id} apiKey={key} onRevoke={revoke} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-5 py-4 border-t border-[#1f1f1f]">
        <input
          type="text"
          placeholder="Key name e.g. Production"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm placeholder-[#444] focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          onClick={handleCreate}
          disabled={creating || !newKeyName.trim()}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          {creating ? "Creating..." : "+ Create API Key"}
        </button>
      </div>
    </div>
  )
}