"use client"

import { useState, useEffect } from "react"

interface Profile {
  name: string
  email: string
}

interface ProfileSectionProps {
  profile: Profile
  onSaved: () => void
}

export const ProfileSection = ({ profile, onSaved }: ProfileSectionProps) => {
  const [values, setValues] = useState(profile)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setValues(profile)
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccess(false)
    setError("")
  }

  const handleSave = async () => {
    setLoading(true)
    setError("")

    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? "Failed to save")
      return
    }

    setSuccess(true)
    onSaved()
  }

  return (
    <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-5">
      <p className="text-white text-sm font-medium mb-0.5">Profile</p>
      <p className="text-[#555] text-xs mb-4">
        Personal information for your account.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs text-[#666] mb-1.5">Name</label>
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-[#666] mb-1.5">Email</label>
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
      {success && (
        <p className="text-green-400 text-xs mb-3">Changes saved.</p>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  )
}