"use client"

import { useEffect, useState } from "react"

export interface ApiKey {
  id: string
  name: string
  keyPreview: string
  createdAt: string
  lastUsedAt: string | null
}

interface UseApiKeysResult {
  keys: ApiKey[]
  loading: boolean
  newKey: string | null
  create: (name: string) => Promise<void>
  revoke: (id: string) => Promise<void>
  clearNewKey: () => void
}

export const useApiKeys = (): UseApiKeysResult => {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [newKey, setNewKey] = useState<string | null>(null)

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/settings/api-keys")
      if (!res.ok) return
      const data = await res.json()
      setKeys(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKeys()
  }, [])

  const create = async (name: string) => {
    const res = await fetch("/api/settings/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })

    if (!res.ok) return

    const data = await res.json()
    setNewKey(data.raw)
    await fetchKeys()
  }

  const revoke = async (id: string) => {
    await fetch(`/api/settings/api-keys/${id}`, { method: "DELETE" })
    setKeys((prev) => prev.filter((k) => k.id !== id))
  }

  return { keys, loading, newKey, create, revoke, clearNewKey: () => setNewKey(null) }
}