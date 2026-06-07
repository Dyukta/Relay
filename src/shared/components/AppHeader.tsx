"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

export const AppHeader = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <header className="h-14 border-b border-[#1f1f1f] bg-[#0f0f0f] flex items-center justify-between px-4 fixed top-0 right-0 left-56 z-10">
      {/* Search */}
      <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 w-72">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#444]"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search workflows, executions..."
          className="bg-transparent text-sm text-white placeholder-[#444] outline-none w-full"
        />
      </div>

      {/* Avatar */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold hover:bg-indigo-600 transition-colors"
        >
          {initials}
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 top-10 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-20 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-[#2a2a2a]">
                <p className="text-white text-xs font-medium truncate">
                  {session?.user?.name}
                </p>
                <p className="text-[#666] text-xs truncate">
                  {session?.user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-[#ffffff08] transition-colors"
              >
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}