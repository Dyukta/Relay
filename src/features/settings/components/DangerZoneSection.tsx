"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"

export const DangerZoneSection = () => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (
      !confirm(
        "Permanently delete your account and all workspace data? This cannot be undone."
      )
    )
      return

    setLoading(true)
    await fetch("/api/settings/account", { method: "DELETE" })
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="bg-[#111111] border border-red-500/20 rounded-xl p-5">
      <p className="text-red-400 text-sm font-medium mb-0.5">Danger Zone</p>
      <p className="text-[#555] text-xs mb-4">
        Irreversible and destructive actions.
      </p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm">Delete account</p>
          <p className="text-[#555] text-xs mt-0.5">
            Permanently delete your account and all workspace data.
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete account"}
        </button>
      </div>
    </div>
  )
}