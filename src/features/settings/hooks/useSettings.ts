"use client"

import { useEffect, useState } from "react"

interface Profile {
  id: string
  name: string
  email: string
}

interface SigningSecret {
  preview: string
}

interface UseSettingsResult {
  profile: Profile | null
  signingSecret: SigningSecret | null
  loading: boolean
  error: string | null
  refetchProfile: () => void
}

export const useSettings = (): UseSettingsResult => {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [signingSecret, setSigningSecret] = useState<SigningSecret | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const [profileRes, secretRes] = await Promise.all([
          fetch("/api/settings/profile"),
          fetch("/api/settings/signing-secret"),
        ])

        if (!profileRes.ok) throw new Error("Failed to load settings")

        const profileData = await profileRes.json()
        const secretData = secretRes.ok ? await secretRes.json() : null

        setProfile(profileData)
        setSigningSecret(secretData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [tick])

  return {
    profile,
    signingSecret,
    loading,
    error,
    refetchProfile: () => setTick((t) => t + 1)
  }
}